// Prüft die Eingaben eines neuen Treffens gegen die Fachregeln und meldet das erste fehlerhafte Feld (F-00).
import { EventError } from './event-error';
import { ageGroups, levels, sports, type EventInput } from './event-model';

/** Grenzwerte der Eingaben. Ein Ort, damit Oberfläche und Prüfung dieselben Zahlen nutzen. */
export const eventLimits = {
  titleMin: 3,
  titleMax: 80,
  meetingPointMin: 5,
  meetingPointMax: 200,
  capacityMin: 2,
  capacityMax: 50,
  descriptionMax: 300,
} as const;

type FieldRule = {
  field: keyof EventInput;
  message: string;
  isValid: (input: EventInput, now: Date) => boolean;
};

function hasLengthBetween(text: string, min: number, max: number): boolean {
  const length = text.trim().length;
  return length >= min && length <= max;
}

function isValidDate(iso: string): boolean {
  return Number.isFinite(Date.parse(iso));
}

function isOneOf(values: readonly string[], value: string): boolean {
  return values.includes(value);
}

function hasValidCoordinates(input: EventInput): boolean {
  const { latitude, longitude } = input;
  return Number.isFinite(latitude) && Number.isFinite(longitude) && Math.abs(latitude) <= 90 && Math.abs(longitude) <= 180;
}

function isIntegerBetween(value: number, min: number, max: number): boolean {
  return Number.isInteger(value) && value >= min && value <= max;
}

// Reihenfolge entspricht dem Formular, damit die erste Meldung zum obersten fehlerhaften Feld gehört.
const fieldRules: FieldRule[] = [
  {
    field: 'title',
    message: `Bitte einen Titel mit ${eventLimits.titleMin}–${eventLimits.titleMax} Zeichen eingeben.`,
    isValid: (input) => hasLengthBetween(input.title, eventLimits.titleMin, eventLimits.titleMax),
  },
  {
    field: 'sport',
    message: 'Bitte eine gültige Sportart wählen.',
    isValid: (input) => isOneOf(sports, input.sport),
  },
  {
    field: 'meetingPoint',
    message: `Bitte den Treffpunkt mit ${eventLimits.meetingPointMin}–${eventLimits.meetingPointMax} Zeichen beschreiben.`,
    isValid: (input) => hasLengthBetween(input.meetingPoint, eventLimits.meetingPointMin, eventLimits.meetingPointMax),
  },
  {
    field: 'latitude',
    message: 'Bitte einen Treffpunkt auf der Karte auswählen.',
    isValid: hasValidCoordinates,
  },
  {
    field: 'startsAt',
    message: 'Der Termin muss in der Zukunft liegen.',
    isValid: (input, now) => isValidDate(input.startsAt) && new Date(input.startsAt) > now,
  },
  {
    field: 'endsAt',
    message: 'Das Ende muss nach dem Beginn liegen.',
    isValid: (input) => isValidDate(input.endsAt) && new Date(input.endsAt) > new Date(input.startsAt),
  },
  {
    field: 'capacity',
    message: `Die maximale Teilnehmerzahl muss zwischen ${eventLimits.capacityMin} und ${eventLimits.capacityMax} liegen.`,
    isValid: (input) => isIntegerBetween(input.capacity, eventLimits.capacityMin, eventLimits.capacityMax),
  },
  {
    field: 'minParticipants',
    message: 'Die Mindestzahl muss zwischen 2 und der maximalen Teilnehmerzahl liegen.',
    isValid: (input) => isIntegerBetween(input.minParticipants, eventLimits.capacityMin, input.capacity),
  },
  {
    field: 'level',
    message: 'Bitte ein gültiges Niveau wählen.',
    isValid: (input) => isOneOf(levels, input.level),
  },
  {
    field: 'ageGroup',
    message: 'Bitte eine gültige Altersgruppe wählen.',
    isValid: (input) => input.ageGroup === '' || isOneOf(ageGroups, input.ageGroup),
  },
  {
    field: 'description',
    message: `Die Beschreibung darf höchstens ${eventLimits.descriptionMax} Zeichen enthalten.`,
    isValid: (input) => input.description.length <= eventLimits.descriptionMax,
  },
];

/**
 * Sucht das erste Feld, das gegen eine Fachregel verstößt.
 * Eingaben: Formularwerte, aktueller Zeitpunkt (für "Termin in der Zukunft").
 * Rückgabe: Fehler mit Feld und Meldung oder `null`, wenn alles gültig ist. Wirft nicht.
 * Feature: F-00
 */
export function findEventInputError(input: EventInput, now = new Date()): EventError | null {
  const brokenRule = fieldRules.find((rule) => !rule.isValid(input, now));
  return brokenRule ? new EventError(brokenRule.message, brokenRule.field) : null;
}

/**
 * Prüft die Eingaben eines Treffens.
 * Eingaben: Formularwerte, aktueller Zeitpunkt.
 * Rückgabe: nichts.
 * Fehler: wirft `EventError` mit Feld und Meldung beim ersten ungültigen Feld.
 * Feature: F-00
 */
export function validateEventInput(input: EventInput, now = new Date()): void {
  const error = findEventInputError(input, now);
  if (error) throw error;
}
