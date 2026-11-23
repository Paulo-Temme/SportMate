// Datenzugriff über Supabase: Lesen aus Tabellen, Schreiben nur per RPC (F-01, F-17, F-18, F-20, F-22, F-23, ADR-0007).
import type { SupabaseClient } from '@supabase/supabase-js';
import { emptyFilters, type EventFilters, type EventInput, type ParticipantEntry, type SportEvent } from '../events/event-model';
import { searchEvents } from '../events/event-search';
import { validateEventInput } from '../events/event-validation';
import type { EventRepository } from './event-repository';
import { eventRowColumns, mapEventRow, toCreateEventParams, type EventRow, type EventViewer } from './event-row-mapping';
import { translateEventError } from './supabase-error-translation';

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const loadFailedMessage = 'Die Treffen konnten nicht geladen werden. Bitte später erneut versuchen.';

// Diese Codes bedeuten bei der Teilnehmerliste "keine Namen sichtbar", nicht "Fehler".
const hiddenListCodes = new Set(['NOT_PARTICIPANT', 'EVENT_NOT_FOUND', 'AUTH_REQUIRED']);

type ParticipantRow = { display_name: string; is_organizer: boolean };

/**
 * Supabase-Umsetzung von `EventRepository`. Liest `events` (öffentlich) und die eigenen `participations`;
 * schreibt ausschließlich über die Datenbankfunktionen. Die Datenbank ist die Sicherheitsgrenze (RLS, RPC);
 * Prüfungen hier sind nur Bedienhilfe.
 * Eingaben: Supabase-Client. Fehler: Fachfehler als `EventError` (deutsch), Lade-/Netzfehler als `Error`.
 * Feature: F-01, F-17, F-18, F-22, F-23
 */
export class SupabaseEventRepository implements EventRepository {
  private readonly client: SupabaseClient;

  constructor(client: SupabaseClient) {
    this.client = client;
  }

  async getCurrentUserId(): Promise<string | null> {
    const { data } = await this.client.auth.getSession();
    return data.session?.user.id ?? null;
  }

  async listEvents(filters: EventFilters = emptyFilters): Promise<SportEvent[]> {
    const viewer = await this.readViewer();
    const now = new Date();
    if (filters.mine && viewer.participatingIds.size === 0) return [];
    const base = this.client.from('events').select(eventRowColumns);
    const query = filters.mine
      ? base.in('id', [...viewer.participatingIds])
      : base.eq('status', 'published').gt('starts_at', now.toISOString());
    const { data, error } = await query.order('starts_at');
    if (error) throw new Error(loadFailedMessage);
    const rows = data as unknown as EventRow[];
    return searchEvents(
      rows.map((row) => mapEventRow(row, viewer)),
      filters,
      now,
    );
  }

  async getEvent(eventId: string): Promise<SportEvent | null> {
    if (!uuidPattern.test(eventId)) return null;
    const viewer = await this.readViewer();
    const { data, error } = await this.client.from('events').select(eventRowColumns).eq('id', eventId).maybeSingle();
    if (error) throw new Error(loadFailedMessage);
    return data ? mapEventRow(data as unknown as EventRow, viewer) : null;
  }

  async createEvent(input: EventInput): Promise<SportEvent> {
    validateEventInput(input);
    const { data, error } = await this.client.rpc('create_event', toCreateEventParams(input));
    if (error) throw translateEventError(error);
    return this.requireEvent((data as { id: string }).id);
  }

  async joinEvent(eventId: string): Promise<SportEvent> {
    return this.runEventFunction('join_event', eventId);
  }

  async leaveEvent(eventId: string): Promise<SportEvent> {
    return this.runEventFunction('leave_event', eventId);
  }

  async cancelEvent(eventId: string): Promise<SportEvent> {
    return this.runEventFunction('cancel_event', eventId);
  }

  async listParticipants(eventId: string): Promise<ParticipantEntry[]> {
    if (!uuidPattern.test(eventId) || (await this.getCurrentUserId()) === null) return [];
    const { data, error } = await this.client.rpc('list_event_participants', { p_event_id: eventId });
    if (error) {
      if (hiddenListCodes.has(error.message)) return [];
      throw translateEventError(error);
    }
    return (data as ParticipantRow[]).map((row) => ({ displayName: row.display_name, isOrganizer: row.is_organizer }));
  }

  /** Ruft eine Datenbankfunktion mit `p_event_id` auf und liest das Treffen danach neu (mit Organisatorname und Sicht). */
  private async runEventFunction(name: 'join_event' | 'leave_event' | 'cancel_event', eventId: string): Promise<SportEvent> {
    if (!uuidPattern.test(eventId)) throw translateEventError({ message: 'EVENT_NOT_FOUND' });
    const { error } = await this.client.rpc(name, { p_event_id: eventId });
    if (error) throw translateEventError(error);
    return this.requireEvent(eventId);
  }

  private async requireEvent(eventId: string): Promise<SportEvent> {
    const event = await this.getEvent(eventId);
    if (!event) throw translateEventError({ message: 'EVENT_NOT_FOUND' });
    return event;
  }

  /** Angemeldete Person und ihre Teilnahmen (RLS liefert nur eigene Zeilen). Gäste: keine. */
  private async readViewer(): Promise<EventViewer> {
    const userId = await this.getCurrentUserId();
    if (!userId) return { userId: null, participatingIds: new Set() };
    const { data, error } = await this.client.from('participations').select('event_id').eq('user_id', userId);
    if (error) throw new Error(loadFailedMessage);
    return { userId, participatingIds: new Set((data as { event_id: string }[]).map((row) => row.event_id)) };
  }
}
