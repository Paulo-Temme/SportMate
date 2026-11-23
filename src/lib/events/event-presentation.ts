// Leitet aus vorhandenen Treffendaten Anzeigetexte ab (Plätze, Altersgruppe, Status, Kosten, Datum). Repariert keine Daten (F-00).
import { ageGroups, type SportEvent } from './event-model';

/** Freie Plätze eines Treffens. `free` ist `null`, wenn die Daten keine ehrliche Aussage erlauben. */
export type PlaceSummary = { label: string; free: number | null; full: boolean };

/** Fachlicher Zustand eines Treffens aus Sicht der Suchenden. */
export type EventStatusLabel = 'Abgesagt' | 'Beendet' | 'Läuft bereits' | 'Ausgebucht' | 'Findet statt' | 'Sucht noch Mitspielende';

const berlinTimeZone = 'Europe/Berlin';

/**
 * Beschreibt die Altersgruppe eines Treffens.
 * Eingaben: gespeicherter Wert, auch unvollständig oder falsch typisiert.
 * Rückgabe: Text wie "Altersgruppe: 20–25 Jahre"; leer heißt offen für alle, Unbekanntes heißt "Nicht angegeben".
 * Feature: F-00
 */
export function describeAgeGroup(ageGroup: unknown): string {
  if (ageGroup === '') return 'Altersgruppe: Alle Altersgruppen';
  if (typeof ageGroup !== 'string' || !ageGroups.some((value) => value === ageGroup)) return 'Altersgruppe: Nicht angegeben';
  return `Altersgruppe: ${ageGroup} Jahre`;
}

function hasValidCapacity(capacity: unknown): capacity is number {
  return typeof capacity === 'number' && Number.isInteger(capacity) && capacity > 0;
}

function hasValidCount(count: unknown, capacity: number): count is number {
  return typeof count === 'number' && Number.isInteger(count) && count >= 0 && count <= capacity;
}

/**
 * Berechnet die freien Plätze.
 * Eingaben: Treffen mit Kapazität, Belegung (`participantCount`) und Status; Felder dürfen fehlen oder ungültig sein.
 * Rückgabe: Text, Anzahl freier Plätze und ob ausgebucht. Bei abgesagten oder unvollständigen Daten `free: null`.
 * Feature: F-05, F-12
 */
export function summarizePlaces(event: { capacity?: unknown; participantCount?: unknown; status?: unknown }): PlaceSummary {
  if (event.status === 'cancelled') return { label: 'Abgesagt', free: null, full: false };
  const { capacity, participantCount } = event;
  if (!hasValidCapacity(capacity) || !hasValidCount(participantCount, capacity)) {
    return { label: 'Platzangabe nicht verfügbar', free: null, full: false };
  }
  const free = capacity - participantCount;
  return {
    label: free === 0 ? 'Ausgebucht · 0 Plätze frei' : `${free} von ${capacity} Plätzen frei`,
    free,
    full: free === 0,
  };
}

/**
 * Zählt, wie viele Personen bis zur Mindestzahl noch fehlen.
 * Eingaben: Treffen mit Mindestzahl und Belegung. Rückgabe: 0 oder mehr.
 * Feature: F-25
 */
export function countMissingParticipants(event: Pick<SportEvent, 'minParticipants' | 'participantCount'>): number {
  return Math.max(0, event.minParticipants - event.participantCount);
}

/**
 * Bestimmt den Zustand eines Treffens zum Zeitpunkt `now`.
 * Eingaben: Treffen, aktueller Zeitpunkt.
 * Rückgabe: einer der Zustände aus `EventStatusLabel`, Absage und Zeit gehen vor Belegung.
 * Feature: F-12, F-25
 */
export function describeEventStatus(event: SportEvent, now = new Date()): EventStatusLabel {
  if (event.status === 'cancelled') return 'Abgesagt';
  if (new Date(event.endsAt) <= now) return 'Beendet';
  if (new Date(event.startsAt) <= now) return 'Läuft bereits';
  if (event.participantCount >= event.capacity) return 'Ausgebucht';
  return countMissingParticipants(event) === 0 ? 'Findet statt' : 'Sucht noch Mitspielende';
}

/**
 * Beschreibt die Kosten pro Person, zum Beispiel "Kostenlos" oder "3,50 € pro Person".
 * Eingaben: Kosten in Cent. Rückgabe: Text; ungültige Werte ergeben "Kosten nicht angegeben".
 * Feature: F-13
 */
export function describeCost(costCents: unknown): string {
  if (typeof costCents !== 'number' || !Number.isInteger(costCents) || costCents < 0) return 'Kosten nicht angegeben';
  if (costCents === 0) return 'Kostenlos';
  const euros = (costCents / 100).toFixed(2).replace('.', ',');
  return `${euros} € pro Person`;
}

/**
 * Beschreibt, was mitzubringen ist.
 * Eingaben: Text aus dem Treffen. Rückgabe: "Mitbringen: …" oder "Mitbringen: nichts Besonderes" bei leerem Text.
 * Feature: F-13
 */
export function describeBringAlong(bringAlong: string): string {
  const text = bringAlong.trim();
  return `Mitbringen: ${text || 'nichts Besonderes'}`;
}

/**
 * Formatiert das Datum eines Zeitpunkts kurz auf Deutsch in Berliner Zeit, zum Beispiel "Mi., 28. Okt.".
 * Eingaben: ISO-Zeitpunkt. Rückgabe: Text. Fehler: wirft `RangeError` bei ungültigem Datum.
 * Feature: F-00
 */
export function formatEventDate(iso: string): string {
  return new Intl.DateTimeFormat('de-DE', { timeZone: berlinTimeZone, weekday: 'short', day: 'numeric', month: 'short' }).format(
    new Date(iso),
  );
}

/**
 * Formatiert die Uhrzeit eines Zeitpunkts in Berliner Zeit, zum Beispiel "18:00".
 * Eingaben: ISO-Zeitpunkt. Rückgabe: Text. Fehler: wirft `RangeError` bei ungültigem Datum.
 * Feature: F-00
 */
export function formatEventTime(iso: string): string {
  return new Intl.DateTimeFormat('de-DE', { timeZone: berlinTimeZone, hour: '2-digit', minute: '2-digit' }).format(new Date(iso));
}
