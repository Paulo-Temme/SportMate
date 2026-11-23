// Baut ein Treffen aus Sicht einer Person für Komponententests; feste Zeiten, damit Tests nicht von der Uhr abhängen (F-05).
import type { SportEvent } from '@/lib/events/event-model';

/** Fester Zeitpunkt der Komponententests: Mittwoch, 25.11.2026, 10:00 Uhr Berliner Zeit. */
export const componentTestNow = new Date('2026-11-25T10:00:00+01:00');

/**
 * Liefert ein gültiges Treffen; einzelne Felder lassen sich überschreiben.
 * Eingaben: abweichende Felder. Rückgabe: neues `SportEvent`.
 * Feature: F-05
 */
export function buildViewerEvent(overrides: Partial<SportEvent> = {}): SportEvent {
  return {
    id: 't-volleyball-1',
    title: 'Volleyball am Abend',
    sport: 'Volleyball',
    locationName: 'Sporthalle Sandberg',
    meetingPoint: 'Sporthalle Sandberg, Eingang Nord',
    latitude: 54.78,
    longitude: 9.43,
    startsAt: '2026-11-26T17:00:00.000Z',
    endsAt: '2026-11-26T19:00:00.000Z',
    capacity: 10,
    minParticipants: 4,
    level: 'Anfänger',
    ageGroup: '20–25',
    costCents: 0,
    bringAlong: 'Hallenschuhe, Wasser',
    description: 'Lockeres Spiel, Neue sind willkommen',
    organizerId: 'max',
    organizerName: 'Max',
    status: 'published',
    participantCount: 5,
    isViewerParticipant: false,
    isViewerOrganizer: false,
    isDemo: false,
    ...overrides,
  };
}
