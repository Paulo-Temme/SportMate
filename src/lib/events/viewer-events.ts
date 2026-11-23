// Teilt die eigenen Treffen der angemeldeten Person in "Ich nehme teil" und "Ich organisiere" (F-24).
import type { SportEvent } from './event-model';

/** Eigene Treffen, getrennt nach Rolle. */
export type ViewerEvents = { participating: SportEvent[]; organizing: SportEvent[] };

/**
 * Teilt Treffen nach der Rolle der betrachtenden Person; fremde Treffen fallen weg.
 * Eingaben: Treffen aus Sicht der Person (z. B. Filter "Meine Treffen"). Rückgabe: beide Listen in Eingabereihenfolge.
 * Feature: F-24
 */
export function splitViewerEvents(events: SportEvent[]): ViewerEvents {
  return {
    participating: events.filter((event) => event.isViewerParticipant && !event.isViewerOrganizer),
    organizing: events.filter((event) => event.isViewerOrganizer),
  };
}
