// Datenzugriff über Supabase: Lesen aus Tabellen, Schreiben nur per RPC (F-01, F-17, F-18, F-22, F-23, ADR-0007).
import type { SupabaseClient } from '@supabase/supabase-js';
import type { EventFilters, EventInput, ParticipantEntry, SportEvent } from '../events/event-model';
import type { EventRepository } from './event-repository';

const notImplementedMessage = 'Der Datenzugriff über Supabase ist noch nicht umgesetzt.';

/**
 * Supabase-Umsetzung von `EventRepository`. Noch Platzhalter (Schritt 1 des Vertrags).
 * Feature: F-01
 */
export class SupabaseEventRepository implements EventRepository {
  private readonly client: SupabaseClient;

  constructor(client: SupabaseClient) {
    this.client = client;
  }

  async getCurrentUserId(): Promise<string | null> {
    void this.client;
    throw new Error(notImplementedMessage);
  }

  async listEvents(filters?: EventFilters): Promise<SportEvent[]> {
    void filters;
    throw new Error(notImplementedMessage);
  }

  async getEvent(eventId: string): Promise<SportEvent | null> {
    void eventId;
    throw new Error(notImplementedMessage);
  }

  async createEvent(input: EventInput): Promise<SportEvent> {
    void input;
    throw new Error(notImplementedMessage);
  }

  async joinEvent(eventId: string): Promise<SportEvent> {
    void eventId;
    throw new Error(notImplementedMessage);
  }

  async leaveEvent(eventId: string): Promise<SportEvent> {
    void eventId;
    throw new Error(notImplementedMessage);
  }

  async cancelEvent(eventId: string): Promise<SportEvent> {
    void eventId;
    throw new Error(notImplementedMessage);
  }

  async listParticipants(eventId: string): Promise<ParticipantEntry[]> {
    void eventId;
    throw new Error(notImplementedMessage);
  }
}
