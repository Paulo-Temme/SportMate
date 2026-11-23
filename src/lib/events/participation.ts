// Fachregeln für Teilnehmen, Verlassen und Absagen eines Treffens. Liefert neue Objekte, ändert nichts an der Eingabe (F-00).
import { requireUser } from './acting-user';
import { EventError } from './event-error';
import type { SportEvent } from './event-model';
import { summarizePlaces } from './event-presentation';
import { isMember, type EventMember, type StoredEvent } from './stored-event';

/** Grund, warum eine Person einem Treffen gerade nicht beitreten kann. */
export type JoinBlockReason = 'cancelled' | 'unknown-date' | 'started' | 'already-joined' | 'full' | 'unknown-places';

/** Ergebnis der Vorabprüfung für den Teilnehmen-Knopf. */
export type JoinAvailability = { canJoin: true } | { canJoin: false; reason: JoinBlockReason; message: string };

/** Meldung, wenn der letzte Platz inzwischen vergeben ist (F-22 AK4). */
export const fullEventMessage = 'Leider gerade ausgebucht.';

const blockMessages: Record<JoinBlockReason, string> = {
  cancelled: 'Dieses Treffen wurde abgesagt.',
  'unknown-date': 'Der Termin ist noch nicht bekannt.',
  started: 'Dieses Treffen hat bereits begonnen.',
  'already-joined': 'Du bist bereits dabei.',
  full: 'Dieses Treffen ist ausgebucht.',
  'unknown-places': 'Die verfügbaren Plätze sind noch nicht bekannt.',
};

function hasStarted(event: { startsAt: string }, now: Date): boolean {
  return new Date(event.startsAt) <= now;
}

function findJoinBlockReason(event: SportEvent, now: Date): JoinBlockReason | null {
  if (event.status === 'cancelled') return 'cancelled';
  if (!Number.isFinite(Date.parse(event.startsAt))) return 'unknown-date';
  if (hasStarted(event, now)) return 'started';
  if (event.isViewerParticipant) return 'already-joined';
  const places = summarizePlaces(event);
  if (places.full) return 'full';
  return places.free === null ? 'unknown-places' : null;
}

/**
 * Prüft vorab, ob eine Person beitreten kann, ohne etwas zu ändern.
 * Eingaben: Treffen aus Sicht der betrachtenden Person (`isViewerParticipant`, `participantCount`), aktueller Zeitpunkt.
 * Rückgabe: `canJoin: true` oder Grund mit deutscher Meldung. Gäste werden hier nicht abgewiesen,
 * damit die Oberfläche zur Anmeldung führen kann.
 * Feature: F-22, F-02
 */
export function checkJoinAvailability(event: SportEvent, now = new Date()): JoinAvailability {
  const reason = findJoinBlockReason(event, now);
  return reason === null ? { canJoin: true } : { canJoin: false, reason, message: blockMessages[reason] };
}

function requireOpenEvent(event: StoredEvent, now: Date): void {
  if (event.status === 'cancelled') throw new EventError('Das Treffen ist abgesagt.');
  if (hasStarted(event, now)) throw new EventError('Das Treffen hat bereits begonnen.');
}

/**
 * Trägt eine Person in ein Treffen ein (lokaler Modus). Erneutes Beitreten ändert nichts.
 * Eingaben: gespeichertes Treffen, Person mit Kennung und Anzeigename, aktueller Zeitpunkt.
 * Rückgabe: Treffen mit der Person am Ende von `participants`.
 * Fehler: `EventError` bei Gast, Absage, begonnenem Treffen oder wenn ausgebucht ("Leider gerade ausgebucht.").
 * Feature: F-22
 */
export function addParticipant(event: StoredEvent, member: EventMember, now = new Date()): StoredEvent {
  requireUser(member.id);
  requireOpenEvent(event, now);
  if (isMember(event, member.id)) return event;
  if (event.participants.length >= event.capacity) throw new EventError(fullEventMessage);
  return { ...event, participants: [...event.participants, member] };
}

/**
 * Trägt eine Person aus einem Treffen aus.
 * Eingaben: gespeichertes Treffen, Kennung der Person, aktueller Zeitpunkt.
 * Rückgabe: Treffen ohne die Person; war sie nicht dabei, unverändert im Inhalt.
 * Fehler: `EventError` bei Gast, Absage, begonnenem Treffen oder wenn die Person das Treffen organisiert.
 * Feature: F-23
 */
export function removeParticipant(event: StoredEvent, userId: string, now = new Date()): StoredEvent {
  requireUser(userId);
  requireOpenEvent(event, now);
  if (event.organizerId === userId) throw new EventError('Als organisierende Person kannst du das gesamte Treffen absagen.');
  return { ...event, participants: event.participants.filter((member) => member.id !== userId) };
}

/**
 * Sagt ein Treffen ab. Nur die organisierende Person darf das. Erneutes Absagen ändert nichts.
 * Eingaben: gespeichertes Treffen, Kennung der Person, aktueller Zeitpunkt.
 * Rückgabe: Treffen mit Status `cancelled`.
 * Fehler: `EventError` bei Gast, fremder Person oder begonnenem Treffen.
 * Feature: F-18
 */
export function cancelEvent(event: StoredEvent, userId: string, now = new Date()): StoredEvent {
  requireUser(userId);
  if (event.organizerId !== userId) throw new EventError('Nur die organisierende Person darf das Treffen absagen.');
  if (event.status === 'cancelled') return event;
  requireOpenEvent(event, now);
  return { ...event, status: 'cancelled' };
}
