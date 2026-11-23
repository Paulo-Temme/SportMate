// Kartenvorschau der Startseite: Auswahl der Treffen für die Kamerafahrt und Lage auf der Ersatzfläche ohne Karte (F-31).
import type { GeoPoint, SportEvent } from '../events/event-model';
import type { MarkerBounds } from './marker-grouping';

/** Für die Vorschau nötige Felder eines Treffens. */
export type PreviewCandidate = Pick<SportEvent, 'id' | 'latitude' | 'longitude' | 'capacity' | 'participantCount' | 'status'>;

/** Lage auf der Ersatzfläche als Anteil 0–1, x nach Osten, y nach Süden. */
export type PreviewPosition = { x: number; y: number };

const defaultLimit = 4;
/** Mindestabstand zweier Treffen: näher beieinander würden sich die Pillen überdecken und die Kamera kaum bewegen. */
const minimumDistanceMeters = 300;
/** Größter Abstand zum ersten Treffen: die Kamerafahrt bleibt in einer Gegend. */
const maximumDistanceMeters = 15_000;
const earthRadiusMeters = 6_371_000;
const sameSpotTolerance = 0.0001;

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

function distanceInMeters(a: GeoPoint, b: GeoPoint): number {
  const deltaLatitude = toRadians(b.latitude - a.latitude);
  const deltaLongitude = toRadians(b.longitude - a.longitude);
  const h =
    Math.sin(deltaLatitude / 2) ** 2 + Math.cos(toRadians(a.latitude)) * Math.cos(toRadians(b.latitude)) * Math.sin(deltaLongitude / 2) ** 2;
  return 2 * earthRadiusMeters * Math.asin(Math.sqrt(h));
}

function isJoinable(event: PreviewCandidate): boolean {
  return event.status === 'published' && event.participantCount < event.capacity;
}

function fitsSelection(event: PreviewCandidate, picked: readonly PreviewCandidate[]): boolean {
  if (picked.length > 0 && distanceInMeters(picked[0], event) > maximumDistanceMeters) return false;
  return picked.every((other) => distanceInMeters(other, event) >= minimumDistanceMeters);
}

/**
 * Wählt Treffen für die Vorschau: in der gegebenen Reihenfolge (z. B. nach Beginn), nur mit freien Plätzen,
 * mindestens 300 m von bereits gewählten und höchstens 15 km vom ersten entfernt.
 * Eingaben: Treffen, Höchstzahl (Standard 4). Rückgabe: ausgewählte Treffen; leer, wenn keines passt.
 * Feature: F-31
 */
export function pickPreviewEvents<T extends PreviewCandidate>(events: readonly T[], limit = defaultLimit): T[] {
  const picked: T[] = [];
  for (const event of events) {
    if (picked.length >= limit) break;
    if (isJoinable(event) && fitsSelection(event, picked)) picked.push(event);
  }
  return picked;
}

function toShare(value: number, min: number, max: number): number {
  return max - min < sameSpotTolerance ? 0.5 : (value - min) / (max - min);
}

/**
 * Legt einen Ort auf die Ersatzfläche der Vorschau: Westen 16 %, Osten 84 % der Breite; Norden 16 %, Süden 62 %
 * der Höhe (unten bleibt Platz für die Treffen-Karte).
 * Eingaben: Ort, Ausdehnung aller gezeigten Orte. Rückgabe: Lage als Anteile.
 * Feature: F-31
 */
export function placeInPreview(point: GeoPoint, bounds: MarkerBounds): PreviewPosition {
  const east = toShare(point.longitude, bounds.minLongitude, bounds.maxLongitude);
  const north = toShare(point.latitude, bounds.minLatitude, bounds.maxLatitude);
  return { x: 0.16 + 0.68 * east, y: 0.16 + 0.46 * (1 - north) };
}
