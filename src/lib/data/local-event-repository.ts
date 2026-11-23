// Treffen im Browser speichern (localStorage), mit Demodaten befüllt. Voll nutzbar ohne Server (F-00).
import { createDemoEvents } from '../events/demo-events';
import { defaultDemoUserId, isDemoPerson } from '../events/demo-people';
import { createEvent as buildEvent } from '../events/event-creation';
import { EventError } from '../events/event-error';
import { emptyFilters, type EventFilters, type EventInput, type SportEvent } from '../events/event-model';
import { toBerlinDay, searchEvents } from '../events/event-search';
import { addParticipant, cancelEvent, removeParticipant } from '../events/participation';
import type { EventRepository } from './event-repository';

/** Der Teil von `Storage`, den das Repository braucht. In Tests und auf dem Server reicht ein Ersatz im Speicher. */
export type KeyValueStorage = Pick<Storage, 'getItem' | 'setItem'>;

/** Austauschbare Abhängigkeiten, damit Tests Zeit, Kennungen und Speicher festlegen können. */
export type LocalEventRepositoryOptions = {
  storage?: KeyValueStorage;
  now?: () => Date;
  createId?: () => string;
};

/** Gespeicherter Stand. `seededOn` ist der Berliner Tag, an dem die Demotreffen erzeugt wurden. */
type StoredState = { version: 1; seededOn: string; userId: string | null; events: SportEvent[] };

const storageKey = 'sportmate.events.v1';
const demoIdPrefix = 'demo-';

/**
 * Erzeugt einen Speicher im Arbeitsspeicher. Ersatz, wenn kein localStorage verfügbar ist (Server, Tests).
 * Rückgabe: neues, leeres Objekt mit `getItem` und `setItem`.
 * Feature: F-00
 */
export function createMemoryStorage(): KeyValueStorage {
  const values = new Map<string, string>();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => {
      values.set(key, value);
    },
  };
}

function isStoredState(value: unknown): value is StoredState {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Partial<StoredState>;
  return candidate.version === 1 && typeof candidate.seededOn === 'string' && Array.isArray(candidate.events);
}

function parseState(text: string | null): StoredState | null {
  if (text === null) return null;
  try {
    const parsed: unknown = JSON.parse(text);
    return isStoredState(parsed) ? parsed : null;
  } catch {
    return null; // Beschädigte Daten: wie beim ersten Start neu befüllen.
  }
}

/**
 * Lokale Umsetzung von `EventRepository`. Speichert alles unter einem Schlüssel als JSON.
 * Demotreffen werden an jedem neuen Tag frisch erzeugt, damit "heute" und "morgen" stimmen;
 * selbst angelegte Treffen bleiben erhalten.
 * Feature: F-00
 */
export class LocalEventRepository implements EventRepository {
  private readonly storage: KeyValueStorage;
  private readonly now: () => Date;
  private readonly createId: () => string;

  constructor(options: LocalEventRepositoryOptions = {}) {
    this.storage = options.storage ?? createMemoryStorage();
    this.now = options.now ?? (() => new Date());
    this.createId = options.createId ?? (() => crypto.randomUUID());
  }

  async getCurrentUserId(): Promise<string | null> {
    return this.readState().userId;
  }

  /**
   * Wechselt die Demoperson oder meldet mit `null` ab (Gastmodus). Nur im lokalen Modus vorhanden.
   * Fehler: `EventError`, wenn die Kennung keine Demoperson ist.
   * Feature: F-00
   */
  async switchUser(userId: string | null): Promise<void> {
    if (userId !== null && !isDemoPerson(userId)) throw new EventError('Bitte eine Demo-Person auswählen.');
    this.writeState({ ...this.readState(), userId });
  }

  async listEvents(filters: EventFilters = emptyFilters): Promise<SportEvent[]> {
    const state = this.readState();
    return searchEvents(state.events, filters, state.userId ?? '', this.now());
  }

  async getEvent(eventId: string): Promise<SportEvent | null> {
    return this.readState().events.find((event) => event.id === eventId) ?? null;
  }

  async createEvent(input: EventInput): Promise<SportEvent> {
    const state = this.readState();
    const created = buildEvent(input, state.userId ?? '', this.createId(), this.now());
    this.writeState({ ...state, events: [...state.events, created] });
    return created;
  }

  async joinEvent(eventId: string): Promise<SportEvent> {
    return this.updateEvent(eventId, (event, userId) => addParticipant(event, userId, this.now()));
  }

  async leaveEvent(eventId: string): Promise<SportEvent> {
    return this.updateEvent(eventId, (event, userId) => removeParticipant(event, userId, this.now()));
  }

  async cancelEvent(eventId: string): Promise<SportEvent> {
    return this.updateEvent(eventId, (event, userId) => cancelEvent(event, userId, this.now()));
  }

  private updateEvent(eventId: string, change: (event: SportEvent, userId: string) => SportEvent): SportEvent {
    const state = this.readState();
    const current = state.events.find((event) => event.id === eventId);
    if (!current) throw new EventError('Dieses Treffen gibt es nicht.');
    const updated = change(current, state.userId ?? '');
    const events = state.events.map((event) => (event.id === eventId ? updated : event));
    this.writeState({ ...state, events });
    return updated;
  }

  private readState(): StoredState {
    const today = toBerlinDay(this.now());
    const stored = parseState(this.storage.getItem(storageKey));
    if (stored && stored.seededOn === today) return stored;
    const ownEvents = stored ? stored.events.filter((event) => !event.id.startsWith(demoIdPrefix)) : [];
    const fresh: StoredState = {
      version: 1,
      seededOn: today,
      userId: stored ? stored.userId : defaultDemoUserId,
      events: [...createDemoEvents(this.now()), ...ownEvents],
    };
    this.writeState(fresh);
    return fresh;
  }

  private writeState(state: StoredState): void {
    this.storage.setItem(storageKey, JSON.stringify(state));
  }
}
