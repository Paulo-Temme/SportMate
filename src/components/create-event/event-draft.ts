// Formularwerte des Erstellen-Assistenten, Umwandlung in die Eingabe der Kernlogik und Prüfung je Schritt (F-17).
import { EventError } from '@/lib/events/event-error';
import type { AgeGroup, EventInput, Level, Sport } from '@/lib/events/event-model';
import { findEventInputError } from '@/lib/events/event-validation';

/** Schritte des Assistenten. */
export type WizardStep = 1 | 2 | 3;

/** Rohwerte der Eingabefelder (Texte, wie sie im Formular stehen). */
export type EventDraft = {
  title: string;
  sport: Sport;
  locationName: string;
  latitude: number;
  longitude: number;
  date: string;
  startTime: string;
  endTime: string;
  capacity: string;
  minParticipants: string;
  level: Level;
  ageGroup: AgeGroup;
  cost: string;
  bringAlong: string;
  meetingPoint: string;
  description: string;
};

/** Fehlermeldung je Feld. */
export type DraftErrors = Partial<Record<keyof EventInput, string>>;

const stepFields: Record<WizardStep, Array<keyof EventInput>> = {
  1: ['title', 'sport'],
  2: ['locationName', 'latitude', 'longitude', 'startsAt', 'endsAt'],
  3: ['meetingPoint', 'capacity', 'minParticipants', 'level', 'ageGroup', 'costCents', 'bringAlong', 'description'],
};

function toLocalDay(moment: Date): string {
  const month = String(moment.getMonth() + 1).padStart(2, '0');
  const day = String(moment.getDate()).padStart(2, '0');
  return `${moment.getFullYear()}-${month}-${day}`;
}

/**
 * Leerer Entwurf: morgen 18–20 Uhr, Treffpunkt in Flensburg, 8 Plätze, mindestens 2, alle Niveaus, kostenlos.
 * Eingaben: aktueller Zeitpunkt. Rückgabe: Entwurf.
 * Feature: F-17
 */
export function createEmptyDraft(now: Date): EventDraft {
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  return {
    title: '',
    sport: 'Fußball',
    locationName: '',
    latitude: 54.7856,
    longitude: 9.4366,
    date: toLocalDay(tomorrow),
    startTime: '18:00',
    endTime: '20:00',
    capacity: '8',
    minParticipants: '2',
    level: 'Alle Niveaus',
    ageGroup: '',
    cost: '',
    bringAlong: '',
    meetingPoint: '',
    description: '',
  };
}

function toIso(date: string, time: string): string {
  const moment = new Date(`${date}T${time}`);
  return Number.isFinite(moment.getTime()) ? moment.toISOString() : '';
}

function toCents(cost: string): number {
  const normalized = cost.trim().replace(/\s|€/g, '').replace(',', '.');
  if (normalized === '') return 0;
  return /^\d+(\.\d{1,2})?$/.test(normalized) ? Math.round(Number(normalized) * 100) : Number.NaN;
}

/**
 * Wandelt die Formularwerte in die Eingabe der Kernlogik um. Datum und Uhrzeit gelten in der Zeitzone des Geräts.
 * Eingaben: Entwurf. Rückgabe: `EventInput`; Unlesbares wird zu leerem Text bzw. `NaN`, damit die Prüfung es meldet.
 * Feature: F-17
 */
export function buildEventInput(draft: EventDraft): EventInput {
  return {
    title: draft.title,
    sport: draft.sport,
    locationName: draft.locationName,
    meetingPoint: draft.meetingPoint,
    latitude: draft.latitude,
    longitude: draft.longitude,
    startsAt: toIso(draft.date, draft.startTime),
    endsAt: toIso(draft.date, draft.endTime),
    capacity: Number.parseInt(draft.capacity, 10),
    minParticipants: Number.parseInt(draft.minParticipants, 10),
    level: draft.level,
    ageGroup: draft.ageGroup,
    costCents: toCents(draft.cost),
    bringAlong: draft.bringAlong,
    description: draft.description,
  };
}

// Gültige Platzhalter für Felder späterer Schritte, damit die Prüfung nur den aktuellen Schritt bewertet.
function fillLaterSteps(input: EventInput, step: WizardStep, now: Date): EventInput {
  const start = new Date(now.getTime() + 24 * 3_600_000);
  const later: EventInput = {
    ...input,
    locationName: '',
    latitude: 54.7856,
    longitude: 9.4366,
    startsAt: start.toISOString(),
    endsAt: new Date(start.getTime() + 3_600_000).toISOString(),
    meetingPoint: 'Treffpunkt folgt',
    capacity: 10,
    minParticipants: 2,
    level: 'Alle Niveaus',
    ageGroup: '',
    costCents: 0,
    bringAlong: '',
    description: '',
  };
  const keep = ([1, 2, 3] as const).filter((candidate) => candidate <= step).flatMap((candidate) => stepFields[candidate]);
  return Object.fromEntries(
    (Object.keys(input) as Array<keyof EventInput>).map((field) => [field, keep.includes(field) ? input[field] : later[field]]),
  ) as EventInput;
}

/**
 * Prüft einen Schritt mit den Fachregeln (`findEventInputError`) und meldet den ersten Fehler dieses oder eines früheren Schritts.
 * Eingaben: Entwurf, Schritt, aktueller Zeitpunkt. Rückgabe: Fehler je Feld; leer, wenn der Schritt gültig ist.
 * Feature: F-17
 */
export function findStepErrors(draft: EventDraft, step: WizardStep, now = new Date()): DraftErrors {
  const error = findEventInputError(fillLaterSteps(buildEventInput(draft), step, now), now);
  return toDraftErrors(error);
}

/**
 * Übersetzt einen Fachfehler in eine Feldmeldung.
 * Eingaben: Fehler oder `null`. Rückgabe: Fehler je Feld; Fehler ohne Feld (z. B. nicht angemeldet) ergeben nichts.
 * Feature: F-17
 */
export function toDraftErrors(error: EventError | null): DraftErrors {
  if (!error?.field) return {};
  return { [error.field]: error.message };
}

/**
 * Liefert den Schritt, in dem ein Feld steht.
 * Eingaben: Feld der Eingabe. Rückgabe: Schritt 1–3.
 * Feature: F-17
 */
export function stepOfField(field: keyof EventInput): WizardStep {
  return ([1, 2, 3] as const).find((step) => stepFields[step].includes(field)) ?? 1;
}
