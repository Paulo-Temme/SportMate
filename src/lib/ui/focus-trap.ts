// Reine Logik der Fokusfalle: wohin der Fokus bei Tab am Rand eines modalen Dialogs springt (REV-05, REV-06).

/**
 * Bestimmt das nächste Fokusziel, wenn Tab den Dialog verlassen würde.
 * Eingaben: Index des fokussierten Elements unter den fokussierbaren (-1 = außerhalb), deren Anzahl, ob rückwärts (Shift+Tab).
 * Rückgabe: Index, auf den der Fokus gesetzt werden muss; `null`, wenn der Browser normal weiterspringen darf;
 * -1, wenn es kein fokussierbares Element gibt (Fokus bleibt auf dem Dialog selbst).
 * Feature: F-18, F-06
 */
export function findTrapTarget(currentIndex: number, count: number, backwards: boolean): number | null {
  if (count === 0) return -1;
  const first = 0;
  const last = count - 1;
  if (currentIndex < 0) return backwards ? last : first;
  if (backwards) return currentIndex === first ? last : null;
  return currentIndex === last ? first : null;
}
