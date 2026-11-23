// Schnittstelle des Datenzugriffs auf Treffen. Oberfläche und Kernlogik kennen nur diese Schnittstelle (F-00).
import type { EventFilters, EventInput, SportEvent } from '../events/event-model';

/**
 * Speicher für Treffen. Umsetzungen: lokal im Browser (`LocalEventRepository`) und Supabase.
 * Alle Methoden sind asynchron, damit beide Umsetzungen austauschbar sind.
 * Fehler: Fachregelverstöße werfen `EventError` mit deutscher Meldung; technische Fehler werfen `Error`.
 * Feature: F-00
 */
export interface EventRepository {
  /** Kennung der angemeldeten Person oder `null` für Gäste. */
  getCurrentUserId(): Promise<string | null>;

  /** Treffen passend zu den Filtern, aufsteigend nach Beginn. Ohne Filter: alle kommenden, veröffentlichten Treffen. */
  listEvents(filters?: EventFilters): Promise<SportEvent[]>;

  /** Ein Treffen nach Kennung oder `null`, wenn es nicht existiert. */
  getEvent(eventId: string): Promise<SportEvent | null>;

  /** Legt ein Treffen an; die angemeldete Person organisiert und nimmt teil. Fehler: Gast, ungültige Eingabe. */
  createEvent(input: EventInput): Promise<SportEvent>;

  /** Trägt die angemeldete Person ein. Fehler: Gast, unbekanntes Treffen, abgesagt, begonnen, ausgebucht. */
  joinEvent(eventId: string): Promise<SportEvent>;

  /** Trägt die angemeldete Person aus. Fehler: Gast, unbekanntes Treffen, Person organisiert das Treffen. */
  leaveEvent(eventId: string): Promise<SportEvent>;

  /** Sagt ein Treffen ab. Fehler: Gast, unbekanntes Treffen, Person organisiert es nicht. */
  cancelEvent(eventId: string): Promise<SportEvent>;
}
