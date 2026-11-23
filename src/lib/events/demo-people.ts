// Fiktive Personen für den lokalen Demomodus ohne Server. Keine echten Personen (F-00).

/** Kennung → Anzeigename der Demopersonen. */
export const demoPeople: Readonly<Record<string, string>> = {
  lea: 'Lea',
  tom: 'Tom',
  alex: 'Alex',
  kim: 'Kim',
  sam: 'Sam',
  nora: 'Nora',
  emi: 'Emi',
};

/** Person, als die der Demomodus startet. */
export const defaultDemoUserId = 'lea';

/**
 * Prüft, ob eine Kennung zu einer Demoperson gehört. Schützt vor Schlüsseln wie "__proto__".
 * Eingaben: Kennung. Rückgabe: `true`, wenn die Person existiert.
 * Feature: F-00
 */
export function isDemoPerson(userId: string): boolean {
  return Object.hasOwn(demoPeople, userId);
}
