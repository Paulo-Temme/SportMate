// Fasst Kartenmarker, die sich auf dem Bildschirm überlappen würden, zu Gruppen zusammen; dazu Ausdehnung und Offline-Ebene (F-08).

/** Ein Marker mit Kennung und geografischer Lage. */
export type GeoPoint = { id: string; latitude: number; longitude: number };

/** Lage eines Markers auf dem Bildschirm in Pixeln. */
export type ScreenPosition = { x: number; y: number };

/** Fläche, die ein Marker belegt. Zwei Marker überlappen, wenn ihre Ankerpunkte näher liegen als Breite bzw. Höhe. */
export type CollisionBox = { width: number; height: number };

/** Eine Gruppe von Markern mit gemittelter Lage auf dem Bildschirm und auf der Karte. */
export type MarkerGroup<T extends GeoPoint> = { members: T[]; x: number; y: number; latitude: number; longitude: number };

/** Geografische Ausdehnung einer Menge von Markern. */
export type MarkerBounds = { minLatitude: number; maxLatitude: number; minLongitude: number; maxLongitude: number };

type WorkingGroup<T extends GeoPoint> = { members: T[]; positions: ScreenPosition[]; x: number; y: number };

const sameSpotTolerance = 1e-9;

function average(values: number[]): number {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function overlaps(first: ScreenPosition, second: ScreenPosition, box: CollisionBox): boolean {
  return Math.abs(first.x - second.x) < box.width && Math.abs(first.y - second.y) < box.height;
}

function findOverlappingPair<T extends GeoPoint>(groups: WorkingGroup<T>[], box: CollisionBox): [number, number] | null {
  for (let first = 0; first < groups.length; first += 1) {
    for (let second = first + 1; second < groups.length; second += 1) {
      if (overlaps(groups[first], groups[second], box)) return [first, second];
    }
  }
  return null;
}

function mergeGroups<T extends GeoPoint>(first: WorkingGroup<T>, second: WorkingGroup<T>): WorkingGroup<T> {
  const positions = [...first.positions, ...second.positions];
  return {
    members: [...first.members, ...second.members],
    positions,
    x: average(positions.map((position) => position.x)),
    y: average(positions.map((position) => position.y)),
  };
}

/**
 * Gruppiert Marker so, dass sich keine zwei Ergebnisse auf dem Bildschirm überlappen.
 * Eingaben: Marker, Projektion auf Bildschirmpixel, belegte Fläche je Marker.
 * Rückgabe: Gruppen in Reihenfolge ihres ersten Mitglieds; jede mit gemittelter Bildschirm- und Kartenlage.
 * Einzelne Marker sind Gruppen mit einem Mitglied. Fehler: keine.
 * Feature: F-08
 */
export function groupOverlappingMarkers<T extends GeoPoint>(
  markers: T[],
  project: (marker: T) => ScreenPosition,
  box: CollisionBox,
): MarkerGroup<T>[] {
  let groups: WorkingGroup<T>[] = markers.map((marker) => {
    const position = project(marker);
    return { members: [marker], positions: [position], x: position.x, y: position.y };
  });
  for (let pair = findOverlappingPair(groups, box); pair; pair = findOverlappingPair(groups, box)) {
    const [first, second] = pair;
    const merged = mergeGroups(groups[first], groups[second]);
    groups = groups.flatMap((group, index) => (index === first ? [merged] : index === second ? [] : [group]));
  }
  return groups.map(({ members, x, y }) => ({
    members,
    x,
    y,
    latitude: average(members.map((member) => member.latitude)),
    longitude: average(members.map((member) => member.longitude)),
  }));
}

/**
 * Berechnet die geografische Ausdehnung von Markern.
 * Eingaben: mindestens ein Marker. Rückgabe: kleinste und größte Breite und Länge.
 * Fehler: bei leerer Eingabe sind die Werte unendlich.
 * Feature: F-08
 */
export function findMarkerBounds(markers: Array<Pick<GeoPoint, 'latitude' | 'longitude'>>): MarkerBounds {
  const latitudes = markers.map((marker) => marker.latitude);
  const longitudes = markers.map((marker) => marker.longitude);
  return {
    minLatitude: Math.min(...latitudes),
    maxLatitude: Math.max(...latitudes),
    minLongitude: Math.min(...longitudes),
    maxLongitude: Math.max(...longitudes),
  };
}

/**
 * Prüft, ob sich eine Gruppe durch Vergrößern auffächern lässt, also nicht alle Mitglieder am selben Ort liegen.
 * Eingaben: Mitglieder der Gruppe. Rückgabe: `true` bei mindestens zwei verschiedenen Orten.
 * Feature: F-08
 */
export function canSpreadGroup(members: Array<Pick<GeoPoint, 'latitude' | 'longitude'>>): boolean {
  if (members.length < 2) return false;
  const bounds = findMarkerBounds(members);
  return bounds.maxLatitude - bounds.minLatitude > sameSpotTolerance || bounds.maxLongitude - bounds.minLongitude > sameSpotTolerance;
}

function toShare(value: number, min: number, max: number): number {
  return max - min < sameSpotTolerance ? 0.5 : (value - min) / (max - min);
}

/**
 * Legt einen Ort auf die Offline-Karte: Westen 12 %, Osten 88 % der Breite; Norden 24 %, Süden 58 % der Höhe
 * (oben Platz für Suche und Chips, unten für das Sheet).
 * Eingaben: Ort, Ausdehnung aller gezeigten Orte, Flächengröße in Pixeln. Rückgabe: Pixelposition.
 * Feature: F-08
 */
export function placeOnOfflinePlane(
  point: Pick<GeoPoint, 'latitude' | 'longitude'>,
  bounds: MarkerBounds,
  size: { width: number; height: number },
): ScreenPosition {
  const east = toShare(point.longitude, bounds.minLongitude, bounds.maxLongitude);
  const north = toShare(point.latitude, bounds.minLatitude, bounds.maxLatitude);
  return { x: Math.round((0.12 + 0.76 * east) * size.width), y: Math.round((0.24 + 0.34 * (1 - north)) * size.height) };
}
