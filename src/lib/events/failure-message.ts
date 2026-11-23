// Wählt die Meldung, die nach einer gescheiterten Aktion angezeigt wird: Fachfehler wörtlich, Technisches freundlich (F-22).
import { AuthError } from '../auth/auth-error';
import { EventError } from './event-error';

/** Meldung für Netzwerk- und unerwartete Fehler; technische Rohtexte (englisch, Codes) erscheinen nie. */
export const connectionFailureMessage = 'Das hat nicht geklappt. Bitte prüfe deine Verbindung und versuche es erneut.';

/**
 * Beschreibt einen Fehler für Nutzerinnen und Nutzer.
 * Eingaben: beliebiger gefangener Fehler. Rückgabe: Meldung von `EventError`/`AuthError`, sonst `connectionFailureMessage`.
 * Feature: F-22, F-17, F-01
 */
export function describeActionFailure(error: unknown): string {
  if (error instanceof EventError || error instanceof AuthError) return error.message;
  return connectionFailureMessage;
}
