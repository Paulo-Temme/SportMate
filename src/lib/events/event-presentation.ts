// Leitet aus vorhandenen Treffendaten Anzeigetexte ab (Plätze, Altersgruppe, Status, Datum). Repariert keine Daten (F-00).
import { ageGroups, type SportEvent } from './event-model';

/** Freie Plätze eines Treffens. `free` ist `null`, wenn die Daten keine ehrliche Aussage erlauben. */
export type PlaceSummary = { label: string; free: number | null; full: boolean };

/** Fachlicher Zustand eines Treffens aus Sicht der Suchenden. */
export type EventStatusLabel = 'Abgesagt' | 'Beendet' | 'Läuft bereits' | 'Ausgebucht' | 'Findet statt' | 'Sucht Mitspieler';

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

function isNonEmptyText(value: unknown): boolean {
  return typeof value === 'string' && value.trim().length > 0;
}

function hasValidCapacity(capacity: unknown): capacity is number {
  return typeof capacity === 'number' && Number.isInteger(capacity) && capacity > 0;
}

function hasValidParticipants(participants: unknown, capacity: number): participants is string[] {
  if (!Array.isArray(participants)) return false;
  const uniqueIds = new Set(participants);
  return participants.every(isNonEmptyText) && uniqueIds.size === participants.length && participants.length <= capacity;
}

/**
 * Berechnet die freien Plätze.
 * Eingaben: Treffen mit Kapazität, Teilnehmenden und Status; Felder dürfen fehlen oder ungültig sein.
 * Rückgabe: Text, Anzahl freier Plätze und ob ausgebucht. Bei abgesagten oder unvollständigen Daten `free: null`.
 * Feature: F-00
 */
export function summarizePlaces(event: { capacity?: unknown; participants?: unknown; status?: unknown }): PlaceSummary {
  if (event.status === 'cancelled') return { label: 'Abgesagt', free: null, full: false };
  const { capacity, participants } = event;
  if (!hasValidCapacity(capacity) || !hasValidParticipants(participants, capacity)) {
    return { label: 'Platzangabe nicht verfügbar', free: null, full: false };
  }
  const free = capacity - participants.length;
  return {
    label: free === 0 ? 'Ausgebucht · 0 Plätze frei' : `${free} von ${capacity} Plätzen frei`,
    free,
    full: free === 0,
  };
}

/**
 * Bestimmt den Zustand eines Treffens zum Zeitpunkt `now`.
 * Eingaben: Treffen, aktueller Zeitpunkt.
 * Rückgabe: einer der Zustände aus `EventStatusLabel`, Absage und Zeit gehen vor Belegung.
 * Feature: F-00
 */
export function describeEventStatus(event: SportEvent, now = new Date()): EventStatusLabel {
  if (event.status === 'cancelled') return 'Abgesagt';
  if (new Date(event.endsAt) <= now) return 'Beendet';
  if (new Date(event.startsAt) <= now) return 'Läuft bereits';
  if (event.participants.length >= event.capacity) return 'Ausgebucht';
  return event.participants.length >= event.minParticipants ? 'Findet statt' : 'Sucht Mitspieler';
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
