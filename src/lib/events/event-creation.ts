// Baut aus gültigen Formularwerten ein neues, veröffentlichtes Treffen (F-00).
import { requireUser } from './acting-user';
import type { EventInput, SportEvent } from './event-model';
import { validateEventInput } from './event-validation';

/**
 * Legt ein Treffen an. Die organisierende Person zählt automatisch als erste Teilnehmerin.
 * Eingaben: Formularwerte, Kennung der handelnden Person, neue Kennung des Treffens, aktueller Zeitpunkt.
 * Rückgabe: neues Treffen mit getrimmten Texten und Zeiten als ISO-Text in UTC.
 * Fehler: `EventError`, wenn keine Person angemeldet ist oder eine Eingabe ungültig ist.
 * Feature: F-00
 */
export function createEvent(input: EventInput, userId: string, eventId: string, now = new Date()): SportEvent {
  requireUser(userId);
  validateEventInput(input, now);
  return {
    ...input,
    title: input.title.trim(),
    meetingPoint: input.meetingPoint.trim(),
    startsAt: new Date(input.startsAt).toISOString(),
    endsAt: new Date(input.endsAt).toISOString(),
    id: eventId,
    organizerId: userId,
    participants: [userId],
    status: 'published',
  };
}
