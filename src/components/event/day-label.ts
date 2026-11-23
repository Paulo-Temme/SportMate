// Kurzer Tagesname für Listen und Marker: "Heute", "Morgen" oder Datum wie "Fr., 27. Nov." (F-05).
import { formatEventDate } from '@/lib/events/event-presentation';
import { toBerlinDay } from '@/lib/events/event-search';

/**
 * Beschreibt den Tag eines Zeitpunkts relativ zu jetzt (Berliner Zeit).
 * Eingaben: ISO-Zeitpunkt, aktueller Zeitpunkt. Rückgabe: "Heute", "Morgen" oder kurzes Datum.
 * Fehler: wirft `RangeError` bei ungültigem Datum.
 * Feature: F-05
 */
export function describeDayLabel(iso: string, now: Date): string {
  const day = toBerlinDay(iso);
  if (day === toBerlinDay(now)) return 'Heute';
  const tomorrow = new Date(`${toBerlinDay(now)}T12:00:00Z`);
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  return day === toBerlinDay(tomorrow) ? 'Morgen' : formatEventDate(iso);
}
