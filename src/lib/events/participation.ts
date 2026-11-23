// Fachregeln für Teilnehmen, Verlassen und Absagen eines Treffens. Liefert neue Objekte, ändert nichts an der Eingabe (F-00).
import { requireUser } from './acting-user';
import { EventError } from './event-error';
import type { SportEvent } from './event-model';
import { summarizePlaces } from './event-presentation';

/** Grund, warum eine Person einem Treffen gerade nicht beitreten kann. */
export type JoinBlockReason = 'cancelled' | 'unknown-date' | 'started' | 'already-joined' | 'full' | 'unknown-places';

/** Ergebnis der Vorabprüfung für den Teilnehmen-Knopf. */
export type JoinAvailability = { canJoin: true } | { canJoin: false; reason: JoinBlockReason; message: string };

const blockMessages: Record<JoinBlockReason, string> = {
  cancelled: 'Dieses Treffen wurde abgesagt.',
  'unknown-date': 'Der Termin ist noch nicht bekannt.',
  started: 'Dieses Treffen hat bereits begonnen.',
  'already-joined': 'Du bist bereits dabei.',
  full: 'Dieses Treffen ist ausgebucht.',
  'unknown-places': 'Die verfügbaren Plätze sind noch nicht bekannt.',
};

function hasStarted(event: SportEvent, now: Date): boolean {
  return new Date(event.startsAt) <= now;
}

function findJoinBlockReason(event: SportEvent, userId: string, now: Date): JoinBlockReason | null {
  if (event.status === 'cancelled') return 'cancelled';
  if (!Number.isFinite(Date.parse(event.startsAt))) return 'unknown-date';
  if (hasStarted(event, now)) return 'started';
  if (event.participants.includes(userId)) return 'already-joined';
  const places = summarizePlaces(event);
  if (places.full) return 'full';
  return places.free === null ? 'unknown-places' : null;
}

/**
 * Prüft vorab, ob eine Person beitreten kann, ohne etwas zu ändern.
 * Eingaben: Treffen, Kennung der Person (leer bei Gästen), aktueller Zeitpunkt.
 * Rückgabe: `canJoin: true` oder Grund mit deutscher Meldung. Gäste werden hier nicht abgewiesen,
 * damit die Oberfläche zur Anmeldung führen kann.
 * Feature: F-00
 */
export function checkJoinAvailability(event: SportEvent, userId: string, now = new Date()): JoinAvailability {
  const reason = findJoinBlockReason(event, userId, now);
  return reason === null ? { canJoin: true } : { canJoin: false, reason, message: blockMessages[reason] };
}

function requireOpenEvent(event: SportEvent, now: Date): void {
  if (event.status === 'cancelled') throw new EventError('Das Treffen ist abgesagt.');
  if (hasStarted(event, now)) throw new EventError('Das Treffen hat bereits begonnen.');
}

/**
 * Trägt eine Person in ein Treffen ein. Erneutes Beitreten ändert nichts.
 * Eingaben: Treffen, Kennung der Person, aktueller Zeitpunkt.
 * Rückgabe: Treffen mit der Person in `participants`.
 * Fehler: `EventError` bei Gast, Absage, begonnenem Treffen oder wenn ausgebucht.
 * Feature: F-00
 */
export function addParticipant(event: SportEvent, userId: string, now = new Date()): SportEvent {
  requireUser(userId);
  requireOpenEvent(event, now);
  if (event.participants.includes(userId)) return event;
  if (event.participants.length >= event.capacity) throw new EventError('Ausgebucht');
  return { ...event, participants: [...event.participants, userId] };
}

/**
 * Trägt eine Person aus einem Treffen aus.
 * Eingaben: Treffen, Kennung der Person, aktueller Zeitpunkt.
 * Rückgabe: Treffen ohne die Person.
 * Fehler: `EventError` bei Gast, Absage, begonnenem Treffen oder wenn die Person das Treffen organisiert.
 * Feature: F-00
 */
export function removeParticipant(event: SportEvent, userId: string, now = new Date()): SportEvent {
  requireUser(userId);
  requireOpenEvent(event, now);
  if (event.organizerId === userId) throw new EventError('Als organisierende Person kannst du das gesamte Treffen absagen.');
  return { ...event, participants: event.participants.filter((id) => id !== userId) };
}

/**
 * Sagt ein Treffen ab. Nur die organisierende Person darf das. Erneutes Absagen ändert nichts.
 * Eingaben: Treffen, Kennung der Person, aktueller Zeitpunkt.
 * Rückgabe: Treffen mit Status `cancelled`.
 * Fehler: `EventError` bei Gast, fremder Person oder begonnenem Treffen.
 * Feature: F-00
 */
export function cancelEvent(event: SportEvent, userId: string, now = new Date()): SportEvent {
  requireUser(userId);
  if (event.organizerId !== userId) throw new EventError('Nur die organisierende Person darf das Treffen absagen.');
  if (event.status === 'cancelled') return event;
  requireOpenEvent(event, now);
  return { ...event, status: 'cancelled' };
}
