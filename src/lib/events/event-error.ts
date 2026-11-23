// Fachlicher Fehler mit verständlicher Meldung und optional dem betroffenen Eingabefeld (F-00).
import type { EventInput } from './event-model';

/**
 * Wird geworfen, wenn eine Fachregel verletzt ist (ungültige Eingabe, fehlende Rechte, ausgebucht).
 * Eingaben: deutsche Meldung für die Nutzerin oder den Nutzer, optional das Feld der Eingabe.
 * Feature: F-00
 */
export class EventError extends Error {
  readonly field?: keyof EventInput;

  constructor(message: string, field?: keyof EventInput) {
    super(message);
    this.name = 'EventError';
    this.field = field;
  }
}
