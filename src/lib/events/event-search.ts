// Filtert und sortiert Treffen nach Suchtext, Sportart, Niveau, Alter, Zeitraum und "Meine Treffen" (F-00).
import type { EventFilters, SportEvent } from './event-model';

type EventPredicate = (event: SportEvent) => boolean;

/** Kalendertage (YYYY-MM-DD, Berliner Zeit), gegen die der Zeitraumfilter prüft. */
type CalendarWindow = { today: string; tomorrow: string; weekEnd: string };

/**
 * Liefert den Kalendertag eines Zeitpunkts in Berliner Zeit.
 * Eingaben: ISO-Text oder Date. Rückgabe: "YYYY-MM-DD". Fehler: wirft `RangeError` bei ungültigem Datum.
 * Feature: F-00
 */
export function toBerlinDay(moment: string | Date): string {
  return new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Europe/Berlin',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(moment));
}

function addDays(day: Date, days: number): Date {
  const result = new Date(day);
  result.setUTCDate(day.getUTCDate() + days);
  return result;
}

// Mittag UTC als Anker, damit Sommer-/Winterzeit den Tag beim Rechnen nicht verschiebt.
function buildCalendarWindow(now: Date): CalendarWindow {
  const today = toBerlinDay(now);
  const noon = new Date(`${today}T12:00:00Z`);
  const daysUntilSunday = 7 - (noon.getUTCDay() || 7);
  return {
    today,
    tomorrow: toBerlinDay(addDays(noon, 1)),
    weekEnd: toBerlinDay(addDays(noon, daysUntilSunday)),
  };
}

function matchesPeriod(day: string, filters: EventFilters, window: CalendarWindow): boolean {
  switch (filters.period) {
    case 'today':
      return day === window.today;
    case 'tomorrow':
      return day === window.tomorrow;
    case 'week':
      return day >= window.today && day <= window.weekEnd;
    case 'date':
      return day === filters.date;
    default:
      return true;
  }
}

function buildPredicates(filters: EventFilters, userId: string, now: Date): EventPredicate[] {
  const query = filters.query.trim().toLocaleLowerCase('de');
  const window = buildCalendarWindow(now);
  return [
    (event) => (filters.mine ? event.participants.includes(userId) : event.status === 'published' && new Date(event.startsAt) > now),
    (event) => filters.sports.length === 0 || filters.sports.includes(event.sport),
    (event) => !filters.level || event.level === filters.level || event.level === 'Alle Niveaus',
    (event) => !filters.ageGroup || !event.ageGroup || event.ageGroup === filters.ageGroup,
    (event) => !query || `${event.title} ${event.meetingPoint} ${event.sport}`.toLocaleLowerCase('de').includes(query),
    (event) => matchesPeriod(toBerlinDay(event.startsAt), filters, window),
  ];
}

/**
 * Sucht Treffen. Sportarten werden mit ODER verknüpft, die Filtergruppen untereinander mit UND.
 * Ohne "Meine Treffen" erscheinen nur veröffentlichte, noch nicht begonnene Treffen;
 * mit "Meine Treffen" alle, an denen die Person teilnimmt, auch abgesagte.
 * Eingaben: Treffen, Filter, Kennung der Person (leer bei Gästen), aktueller Zeitpunkt.
 * Rückgabe: neue Liste, aufsteigend nach Beginn. Die Eingabe bleibt unverändert.
 * Feature: F-00
 */
export function searchEvents(events: readonly SportEvent[], filters: EventFilters, userId: string, now = new Date()): SportEvent[] {
  const predicates = buildPredicates(filters, userId, now);
  return events
    .filter((event) => predicates.every((matches) => matches(event)))
    .sort((first, second) => Date.parse(first.startsAt) - Date.parse(second.startsAt));
}
