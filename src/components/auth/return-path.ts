// Prüft das Rücksprungziel nach der Anmeldung, damit nur Seiten dieser App angesteuert werden (F-02).

/**
 * Liefert ein sicheres Rücksprungziel.
 * Eingaben: Wert des Suchparameters `weiter` (kann fehlen), Ersatzziel.
 * Rückgabe: interner Pfad, der mit genau einem "/" beginnt; sonst das Ersatzziel (Schutz vor offenen Weiterleitungen).
 * Feature: F-02
 */
export function resolveReturnPath(candidate: string | null, fallback: string): string {
  if (!candidate || !candidate.startsWith('/') || candidate.startsWith('//') || candidate.includes('\\')) return fallback;
  return candidate;
}
