// Übersetzt die Teilnahme-Vorabprüfung der Kernlogik in den Zustand des Teilnahme-Buttons (F-22, F-02).
import type { SportEvent } from '@/lib/events/event-model';
import { checkJoinAvailability } from '@/lib/events/participation';

/** Was der Button zeigt: beitreten, schon dabei, organisiert, ausgebucht oder nicht (mehr) möglich. */
export type JoinAction =
  | { kind: 'join'; label: 'Jetzt teilnehmen' }
  | { kind: 'joined'; label: 'Dabei' }
  | { kind: 'organizer'; label: 'Organisiert von dir' }
  | { kind: 'full'; label: 'Ausgebucht' }
  | { kind: 'cancelled'; label: 'Abgesagt' }
  | { kind: 'closed'; label: string };

/**
 * Bestimmt den Zustand des Teilnahme-Buttons. Gäste sehen "Jetzt teilnehmen" und werden beim Klick zur Anmeldung geführt.
 * Eingaben: Treffen aus Sicht der betrachtenden Person, aktueller Zeitpunkt.
 * Rückgabe: Art und Beschriftung.
 * Feature: F-22
 */
export function resolveJoinAction(event: SportEvent, now = new Date()): JoinAction {
  if (event.isViewerOrganizer && event.status !== 'cancelled') return { kind: 'organizer', label: 'Organisiert von dir' };
  const availability = checkJoinAvailability(event, now);
  if (availability.canJoin) return { kind: 'join', label: 'Jetzt teilnehmen' };
  switch (availability.reason) {
    case 'already-joined':
      return { kind: 'joined', label: 'Dabei' };
    case 'full':
      return { kind: 'full', label: 'Ausgebucht' };
    case 'cancelled':
      return { kind: 'cancelled', label: 'Abgesagt' };
    default:
      return { kind: 'closed', label: availability.message };
  }
}
