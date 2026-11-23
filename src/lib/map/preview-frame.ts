// Fester Kartenausschnitt Flensburg für die Vorschau auf der Startseite: Lage von Orten und Auswahl der Treffen (F-31).
import type { GeoPoint, SportEvent } from '../events/event-model';

/** Ausschnitt Flensburg von Exe/Campus bis Solitüde; Seitenverhältnis etwa 4:5 (Breite zu Höhe). */
export const previewBounds = {
  minLatitude: 54.755,
  maxLatitude: 54.836,
  minLongitude: 9.4,
  maxLongitude: 9.51,
} as const;

/** Lage im Ausschnitt als Anteil 0–1, x nach Osten, y nach Süden. */
export type PreviewPosition = { x: number; y: number };

/** Für die Vorschau nötige Felder eines Treffens. */
export type PreviewCandidate = Pick<SportEvent, 'id' | 'latitude' | 'longitude' | 'capacity' | 'participantCount' | 'status'>;

/** Ein ausgewähltes Treffen mit seiner Lage im Ausschnitt. */
export type PreviewPlacement<T extends PreviewCandidate> = { event: T; position: PreviewPosition };

/** Mindestabstand zweier Marker als Anteil der Ausschnittbreite, damit sich Pillen nicht überdecken. */
const minimumGap = 0.14;
const defaultLimit = 4;

/**
 * Rechnet eine Koordinate in die Lage im Vorschau-Ausschnitt um (lineare Projektion, für 7 km ausreichend genau).
 * Eingaben: Koordinate. Rückgabe: Anteile 0–1 oder `null`, wenn der Ort außerhalb des Ausschnitts liegt.
 * Feature: F-31
 */
export function projectToPreview(point: GeoPoint): PreviewPosition | null {
  const x = (point.longitude - previewBounds.minLongitude) / (previewBounds.maxLongitude - previewBounds.minLongitude);
  const y = (previewBounds.maxLatitude - point.latitude) / (previewBounds.maxLatitude - previewBounds.minLatitude);
  if (x < 0 || x > 1 || y < 0 || y > 1) return null;
  return { x, y };
}

function isJoinable(event: PreviewCandidate): boolean {
  return event.status === 'published' && event.participantCount < event.capacity;
}

function isFarFromAll(position: PreviewPosition, placed: PreviewPosition[]): boolean {
  return placed.every((other) => Math.hypot(other.x - position.x, other.y - position.y) >= minimumGap);
}

/**
 * Wählt Treffen für die Vorschau: in der gegebenen Reihenfolge (z. B. nach Beginn), nur mit freien Plätzen,
 * im Ausschnitt und mit Abstand zu bereits gewählten Treffen.
 * Eingaben: Treffen, Höchstzahl (Standard 4). Rückgabe: ausgewählte Treffen mit Lage; leer, wenn keines passt.
 * Feature: F-31
 */
export function pickPreviewEvents<T extends PreviewCandidate>(events: readonly T[], limit = defaultLimit): PreviewPlacement<T>[] {
  const picked: PreviewPlacement<T>[] = [];
  for (const event of events) {
    if (picked.length >= limit) break;
    const position = isJoinable(event) ? projectToPreview(event) : null;
    if (!position || !isFarFromAll(position, picked.map((entry) => entry.position))) continue;
    picked.push({ event, position });
  }
  return picked;
}
