// Einstieg in Entdecken mit vorgewählter Sportart: Adresse bauen und den Parameter `sport` sicher lesen (F-31).
import { sports, type Sport } from './event-model';

const discoverPath = '/entdecken';

/**
 * Baut den Link nach Entdecken, optional mit vorgewählter Sportart.
 * Eingaben: Sportart oder nichts. Rückgabe: `/entdecken` bzw. `/entdecken?sport=<kodiert>`.
 * Feature: F-31
 */
export function buildDiscoverHref(sport?: Sport): string {
  return sport ? `${discoverPath}?sport=${encodeURIComponent(sport)}` : discoverPath;
}

/**
 * Liest die Sportart aus dem Parameter `sport` der Adresse.
 * Eingaben: Wert des Parameters (bereits dekodiert) oder `null`. Rückgabe: bekannte Sportart oder `null`
 * bei fehlendem, leerem oder unbekanntem Wert (Groß-/Kleinschreibung zählt).
 * Feature: F-31
 */
export function readSportParam(value: string | null): Sport | null {
  return sports.find((sport) => sport === value) ?? null;
}
