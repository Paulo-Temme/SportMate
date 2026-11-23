// Baut aus gültigen Formularwerten ein neues, veröffentlichtes Treffen (F-00).
import { requireUser } from './acting-user';
import type { EventInput } from './event-model';
import { validateEventInput } from './event-validation';
import type { EventMember, StoredEvent } from './stored-event';

/**
 * Legt ein Treffen an. Die organisierende Person zählt automatisch als erste Teilnehmerin.
 * Eingaben: Formularwerte, handelnde Person (Kennung und Anzeigename), neue Kennung des Treffens, aktueller Zeitpunkt.
 * Rückgabe: neues gespeichertes Treffen mit getrimmten Texten und Zeiten als ISO-Text in UTC.
 * Fehler: `EventError`, wenn keine Person angemeldet ist oder eine Eingabe ungültig ist.
 * Feature: F-17
 */
export function createEvent(input: EventInput, organizer: EventMember, eventId: string, now = new Date()): StoredEvent {
  requireUser(organizer.id);
  validateEventInput(input, now);
  return {
    ...input,
    title: input.title.trim(),
    locationName: input.locationName.trim(),
    meetingPoint: input.meetingPoint.trim(),
    bringAlong: input.bringAlong.trim(),
    startsAt: new Date(input.startsAt).toISOString(),
    endsAt: new Date(input.endsAt).toISOString(),
    id: eventId,
    organizerId: organizer.id,
    organizerName: organizer.displayName,
    participants: [organizer],
    status: 'published',
    isDemo: false,
  };
}
