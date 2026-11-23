// Prüft, dass eine Aktion von einer angemeldeten Person ausgeht. Wer das ist, entscheidet der Datenzugriff (F-00).
import { EventError } from './event-error';

/**
 * Stellt sicher, dass eine Kennung der handelnden Person vorliegt.
 * Eingaben: Kennung (leer bei Gästen).
 * Rückgabe: nichts.
 * Fehler: `EventError`, wenn die Kennung leer ist oder nur aus Leerzeichen besteht.
 * Feature: F-00
 */
export function requireUser(userId: string): void {
  if (userId.trim().length === 0) throw new EventError('Bitte zuerst anmelden.');
}
