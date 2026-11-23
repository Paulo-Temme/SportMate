// Ordnet eine bereits gefilterte Trefferliste für die Anzeige um (F-00).
import type { SportEvent } from './event-model';
import { summarizePlaces } from './event-presentation';

/** Reihenfolge der Trefferliste. */
export type ListOrder = 'available-first' | 'chronological';

/**
 * Ordnet Treffen um. "available-first" stellt ausgebuchte Treffen ans Ende; innerhalb der Gruppen
 * bleibt die Reihenfolge erhalten (stabile Sortierung). "chronological" lässt die Liste unverändert.
 * Eingaben: gefilterte Treffen, gewünschte Reihenfolge.
 * Rückgabe: neue Liste. Die Eingabe bleibt unverändert.
 * Feature: F-00
 */
export function orderEventCards(events: readonly SportEvent[], order: ListOrder): SportEvent[] {
  const result = [...events];
  if (order === 'available-first') {
    result.sort((first, second) => Number(summarizePlaces(first).full) - Number(summarizePlaces(second).full));
  }
  return result;
}
