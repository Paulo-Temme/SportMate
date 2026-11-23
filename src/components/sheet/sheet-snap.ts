// Reine Rastpunkt-Logik des Bottom Sheets: Höhen je Rastpunkt, Wahl nach dem Ziehen, Tastaturschritte (F-05, F-08).

/** Rastpunkte des Sheets, von niedrig nach hoch. */
export const snapOrder = ['peek', 'half', 'full'] as const;

export type SnapPoint = (typeof snapOrder)[number];

/** Sichtbare Höhe des Sheets je Rastpunkt in Pixeln. */
export type SnapHeights = Record<SnapPoint, number>;

const peekHeight = 120;
const topGap = 40;
const minimumStep = 40;
const flickVelocity = 500;

/**
 * Berechnet die Sheet-Höhen für den verfügbaren Platz über der Tab-Leiste.
 * Eingaben: verfügbare Höhe in Pixeln.
 * Rückgabe: aufsteigende Höhen für Spitze, halb und voll; auch bei sehr kleinem Platz streng aufsteigend.
 * Feature: F-05
 */
export function computeSnapHeights(availableHeight: number): SnapHeights {
  const half = Math.max(peekHeight + minimumStep, Math.round(availableHeight / 2));
  const full = Math.max(half + minimumStep, availableHeight - topGap);
  return { peek: peekHeight, half, full };
}

function findNearestIndex(height: number, heights: SnapHeights): number {
  let nearest = 0;
  snapOrder.forEach((snap, index) => {
    if (Math.abs(heights[snap] - height) < Math.abs(heights[snapOrder[nearest]] - height)) nearest = index;
  });
  return nearest;
}

/**
 * Wählt den Rastpunkt nach dem Loslassen.
 * Eingaben: aktuelle Höhe, Geschwindigkeit in px/s (positiv = nach oben), Höhen je Rastpunkt.
 * Rückgabe: nächster Rastpunkt; bei schnellem Wisch der nächste Punkt in Wischrichtung, begrenzt auf Spitze und voll.
 * Feature: F-05
 */
export function chooseSnapPoint(height: number, velocity: number, heights: SnapHeights): SnapPoint {
  const nearest = findNearestIndex(height, heights);
  if (Math.abs(velocity) < flickVelocity) return snapOrder[nearest];
  const direction = velocity > 0 ? 1 : -1;
  const target = Math.min(snapOrder.length - 1, Math.max(0, nearest + direction));
  return snapOrder[target];
}

/**
 * Bewegt das Sheet per Tastatur um genau einen Rastpunkt.
 * Eingaben: aktueller Rastpunkt, Richtung. Rückgabe: neuer Rastpunkt, an den Enden unverändert.
 * Feature: F-05
 */
export function stepSnapPoint(current: SnapPoint, direction: 'up' | 'down'): SnapPoint {
  const index = snapOrder.indexOf(current) + (direction === 'up' ? 1 : -1);
  return snapOrder[Math.min(snapOrder.length - 1, Math.max(0, index))];
}
