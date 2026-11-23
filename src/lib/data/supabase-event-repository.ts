// Platzhalter für den Datenzugriff über Supabase. Wird später von architect und coder umgesetzt (F-00).
import type { EventFilters, EventInput, SportEvent } from '../events/event-model';
import type { EventRepository } from './event-repository';

/** Verbindungsdaten zu Supabase aus `NEXT_PUBLIC_SUPABASE_URL` und `NEXT_PUBLIC_SUPABASE_ANON_KEY`. */
export type SupabaseConfig = { url: string; anonKey: string };

const notImplementedMessage = 'Der Datenzugriff über Supabase ist noch nicht umgesetzt.';

/**
 * Supabase-Umsetzung von `EventRepository`. Noch ohne Funktion: jede Methode wirft einen Fehler.
 * Eingaben: Verbindungsdaten. Fehler: jede Methode wirft `Error` mit dem Hinweis "noch nicht umgesetzt".
 * Feature: F-00
 */
export class SupabaseEventRepository implements EventRepository {
  readonly config: SupabaseConfig;

  constructor(config: SupabaseConfig) {
    this.config = config;
  }

  async getCurrentUserId(): Promise<string | null> {
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
}
