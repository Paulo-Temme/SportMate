// Treffen im Browser speichern, mit Demodaten befüllt. Voll nutzbar ohne Server (F-00, F-32).
import { createDemoEvents } from '../events/demo-events';
import { createEvent as buildEvent } from '../events/event-creation';
import { EventError } from '../events/event-error';
import { emptyFilters, type EventFilters, type EventInput, type ParticipantEntry, type SportEvent } from '../events/event-model';
import { searchEvents, toBerlinDay } from '../events/event-search';
import { addParticipant, cancelEvent, removeParticipant } from '../events/participation';
import { listVisibleParticipants, toViewerEvent, type EventMember, type StoredEvent } from '../events/stored-event';
import type { EventRepository } from './event-repository';
import { createMemoryStorage, readJson, type KeyValueStorage } from './key-value-storage';
import { LocalSession } from './local-session';

/** Austauschbare Abhängigkeiten, damit Tests Zeit, Kennungen, Speicher und angemeldete Person festlegen können. */
export type LocalEventRepositoryOptions = {
  storage?: KeyValueStorage;
  session?: LocalSession;
  now?: () => Date;
  createId?: () => string;
};

/** Gespeicherter Stand. `seededOn` ist der Berliner Tag, an dem die Demotreffen erzeugt wurden. */
type StoredState = { version: 2; seededOn: string; events: StoredEvent[] };

const storageKey = 'sportmate.events.v2';
const demoIdPrefix = 'demo-';

function isStoredState(value: unknown): value is StoredState {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Partial<StoredState>;
  return candidate.version === 2 && typeof candidate.seededOn === 'string' && Array.isArray(candidate.events);
}

/**
 * Lokale Umsetzung von `EventRepository`. Speichert alle Treffen unter einem Schlüssel als JSON.
 * Demotreffen werden an jedem neuen Tag frisch erzeugt, damit "heute" und "morgen" stimmen;
 * selbst angelegte Treffen bleiben erhalten. Die angemeldete Person kommt aus der geteilten `LocalSession`.
 * Feature: F-00, F-32
 */
export class LocalEventRepository implements EventRepository {
  private readonly storage: KeyValueStorage;
  private readonly session: LocalSession;
  private readonly now: () => Date;
  private readonly createId: () => string;

  constructor(options: LocalEventRepositoryOptions = {}) {
    this.storage = options.storage ?? createMemoryStorage();
    this.session = options.session ?? new LocalSession();
    this.now = options.now ?? (() => new Date());
    this.createId = options.createId ?? (() => crypto.randomUUID());
  }

  async getCurrentUserId(): Promise<string | null> {
    return this.session.getUser()?.id ?? null;
  }

  async listEvents(filters: EventFilters = emptyFilters): Promise<SportEvent[]> {
    const viewerId = await this.getCurrentUserId();
    const events = this.readState().events.map((event) => toViewerEvent(event, viewerId));
    return searchEvents(events, filters, this.now());
  }

  async getEvent(eventId: string): Promise<SportEvent | null> {
    const stored = this.findStored(eventId);
    return stored ? toViewerEvent(stored, await this.getCurrentUserId()) : null;
  }

  async createEvent(input: EventInput): Promise<SportEvent> {
    const state = this.readState();
    const viewer = this.readViewer();
    const created = buildEvent(input, viewer, this.createId(), this.now());
    this.writeState({ ...state, events: [...state.events, created] });
    return toViewerEvent(created, viewer.id);
  }

  async joinEvent(eventId: string): Promise<SportEvent> {
    return this.updateEvent(eventId, (event, viewer) => addParticipant(event, viewer, this.now()));
  }

  async leaveEvent(eventId: string): Promise<SportEvent> {
    return this.updateEvent(eventId, (event, viewer) => removeParticipant(event, viewer.id, this.now()));
  }

  async cancelEvent(eventId: string): Promise<SportEvent> {
    return this.updateEvent(eventId, (event, viewer) => cancelEvent(event, viewer.id, this.now()));
  }

  async listParticipants(eventId: string): Promise<ParticipantEntry[]> {
    const stored = this.findStored(eventId);
    return stored ? listVisibleParticipants(stored, await this.getCurrentUserId()) : [];
  }

  /** Angemeldete Person als Teilnehmende; bei Gästen leere Kennung (die Fachregeln lehnen dann ab). */
  private readViewer(): EventMember {
    const user = this.session.getUser();
    return user ? { id: user.id, displayName: user.displayName } : { id: '', displayName: '' };
  }

  private findStored(eventId: string): StoredEvent | undefined {
    return this.readState().events.find((event) => event.id === eventId);
  }

  private updateEvent(eventId: string, change: (event: StoredEvent, viewer: EventMember) => StoredEvent): SportEvent {
    const state = this.readState();
    const current = state.events.find((event) => event.id === eventId);
    if (!current) throw new EventError('Dieses Treffen gibt es nicht.');
    const viewer = this.readViewer();
    const updated = change(current, viewer);
    const events = state.events.map((event) => (event.id === eventId ? updated : event));
    this.writeState({ ...state, events });
    return toViewerEvent(updated, viewer.id);
  }

  private readState(): StoredState {
    const today = toBerlinDay(this.now());
    const stored = readJson(this.storage, storageKey, isStoredState);
    if (stored && stored.seededOn === today) return stored;
    const ownEvents = stored ? stored.events.filter((event) => !event.id.startsWith(demoIdPrefix)) : [];
    const fresh: StoredState = { version: 2, seededOn: today, events: [...createDemoEvents(this.now()), ...ownEvents] };
    this.writeState(fresh);
    return fresh;
  }

  private writeState(state: StoredState): void {
    this.storage.setItem(storageKey, JSON.stringify(state));
  }
}
