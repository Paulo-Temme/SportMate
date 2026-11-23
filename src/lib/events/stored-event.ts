// Treffen mit vollständiger Teilnehmerliste, wie es der lokale Modus intern speichert, und die Sicht einer Person darauf (F-01, F-20, F-32).
import type { ParticipantEntry, SportEvent } from './event-model';

/** Person in einem Treffen: Kennung und Anzeigename. */
export type EventMember = { id: string; displayName: string };

/** Intern gespeichertes Treffen. Die Sichtfelder werden erst beim Lesen für eine Person abgeleitet. */
export type StoredEvent = Omit<SportEvent, 'participantCount' | 'isViewerParticipant' | 'isViewerOrganizer'> & {
  participants: EventMember[];
};

/**
 * Prüft, ob eine Person an einem gespeicherten Treffen teilnimmt.
 * Eingaben: Treffen, Kennung (leer oder `null` bei Gästen). Rückgabe: `true`, wenn sie in der Liste steht.
 * Feature: F-22
 */
export function isMember(event: StoredEvent, userId: string | null): boolean {
  return userId !== null && userId !== '' && event.participants.some((member) => member.id === userId);
}

/**
 * Leitet aus einem gespeicherten Treffen die Sicht einer Person ab. Die Teilnehmerliste fällt weg.
 * Eingaben: gespeichertes Treffen, Kennung der betrachtenden Person oder `null` für Gäste.
 * Rückgabe: neues `SportEvent` mit Belegung und Sichtfeldern.
 * Feature: F-01
 */
export function toViewerEvent(event: StoredEvent, viewerId: string | null): SportEvent {
  const { participants, ...rest } = event;
  return {
    ...rest,
    participantCount: participants.length,
    isViewerParticipant: isMember(event, viewerId),
    isViewerOrganizer: viewerId !== null && viewerId !== '' && event.organizerId === viewerId,
  };
}

/**
 * Teilnehmerliste für eine Person. Nur Teilnehmende und die organisierende Person sehen Namen.
 * Eingaben: gespeichertes Treffen, Kennung der betrachtenden Person oder `null`.
 * Rückgabe: Organisator zuerst, dann in Beitrittsreihenfolge; leer für alle anderen.
 * Feature: F-20
 */
export function listVisibleParticipants(event: StoredEvent, viewerId: string | null): ParticipantEntry[] {
  const allowed = isMember(event, viewerId) || (viewerId !== null && viewerId !== '' && event.organizerId === viewerId);
  if (!allowed) return [];
  const entries = event.participants.map((member) => ({
    displayName: member.displayName,
    isOrganizer: member.id === event.organizerId,
  }));
  return [...entries.filter((entry) => entry.isOrganizer), ...entries.filter((entry) => !entry.isOrganizer)];
}
