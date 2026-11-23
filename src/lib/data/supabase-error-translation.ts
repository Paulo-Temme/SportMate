// Übersetzt Fehler von Supabase (Datenbankcodes, Auth-Codes) in deutsche Meldungen. Die einzige Stelle dafür (F-01, F-22).
import { AuthError, authMessages, type AuthField } from '../auth/auth-error';
import { EventError } from '../events/event-error';
import type { EventInput } from '../events/event-model';
import { describeFieldRule, maxDurationMessage } from '../events/event-validation';
import { fullEventMessage } from '../events/participation';

/** Fehlerform von PostgREST/RPC: Code steht in `message`, bei INVALID_INPUT der Constraint in `details`. */
export type DatabaseError = { message: string; details?: string | null };

/** Fehlerform von Supabase Auth. */
export type AuthApiError = { message: string; code?: string };

const eventMessages: Record<string, string> = {
  EVENT_FULL: fullEventMessage,
  AUTH_REQUIRED: 'Bitte zuerst anmelden.',
  PROFILE_MISSING: 'Profil fehlt. Bitte neu anmelden.',
  EVENT_NOT_FOUND: 'Dieses Treffen gibt es nicht.',
  EVENT_CANCELLED: 'Das Treffen ist abgesagt.',
  EVENT_STARTED: 'Das Treffen hat bereits begonnen.',
  ORGANIZER_CANNOT_LEAVE: 'Als organisierende Person kannst du das gesamte Treffen absagen.',
  NOT_ORGANIZER: 'Nur die organisierende Person darf das Treffen absagen.',
  NOT_PARTICIPANT: 'Nur Teilnehmende sehen die Liste.',
};

// Constraint-Namen aus supabase/migrations/0001_initial_schema.sql → Formularfeld.
const constraintFields: Record<string, keyof EventInput> = {
  events_title_length: 'title',
  events_sport_allowed: 'sport',
  events_location_name_length: 'locationName',
  events_meeting_point_length: 'meetingPoint',
  events_latitude_range: 'latitude',
  events_longitude_range: 'latitude',
  events_end_after_start: 'endsAt',
  events_max_duration: 'endsAt',
  events_capacity_range: 'capacity',
  events_min_participants_range: 'minParticipants',
  events_level_allowed: 'level',
  events_age_group_allowed: 'ageGroup',
  events_cost_range: 'costCents',
  events_bring_along_length: 'bringAlong',
  events_description_length: 'description',
};

// Constraints, deren Meldung nicht die erste Regel ihres Feldes ist.
const constraintMessages: Record<string, string> = {
  events_max_duration: maxDurationMessage,
};

const authCodes: Record<string, { message: string; field?: AuthField }> = {
  invalid_credentials: { message: authMessages.wrongCredentials },
  user_already_exists: { message: authMessages.emailTaken, field: 'email' },
  email_exists: { message: authMessages.emailTaken, field: 'email' },
  weak_password: { message: authMessages.passwordTooShort, field: 'password' },
  email_address_invalid: { message: authMessages.invalidEmail, field: 'email' },
  email_not_confirmed: { message: authMessages.emailNotConfirmed },
};

const unexpectedMessage = 'Das hat nicht geklappt. Bitte später erneut versuchen.';

function translateInvalidInput(details: string | null | undefined): EventError {
  const field = details ? constraintFields[details] : undefined;
  const specific = details && Object.hasOwn(constraintMessages, details) ? constraintMessages[details] : null;
  const message = field ? (specific ?? describeFieldRule(field)) : null;
  return field && message ? new EventError(message, field) : new EventError('Bitte die Eingaben prüfen.');
}

/**
 * Übersetzt einen Fehler der Datenbankfunktionen in einen `EventError`.
 * Eingaben: Fehler mit Code in `message`. Rückgabe: `EventError` mit deutscher Meldung, bei Eingabefehlern mit Feld;
 * unbekannte Codes ergeben eine allgemeine Meldung.
 * Feature: F-17, F-18, F-22, F-23
 */
export function translateEventError(error: DatabaseError): EventError {
  if (error.message === 'START_IN_PAST') return new EventError('Der Termin muss in der Zukunft liegen.', 'startsAt');
  if (error.message === 'INVALID_INPUT') return translateInvalidInput(error.details);
  return new EventError(Object.hasOwn(eventMessages, error.message) ? eventMessages[error.message] : unexpectedMessage);
}

function findAuthCode(error: AuthApiError): string | undefined {
  if (error.code && Object.hasOwn(authCodes, error.code)) return error.code;
  if (/already registered/i.test(error.message)) return 'user_already_exists';
  if (/invalid login credentials/i.test(error.message)) return 'invalid_credentials';
  if (/email address/i.test(error.message) && /invalid/i.test(error.message)) return 'email_address_invalid';
  return undefined;
}

/**
 * Übersetzt einen Fehler von Supabase Auth in einen `AuthError`.
 * Eingaben: Fehler mit `code` (neuere Versionen) und/oder `message`. Rückgabe: `AuthError`; Unbekanntes ergibt eine allgemeine Meldung.
 * Feature: F-01
 */
export function translateAuthError(error: AuthApiError): AuthError {
  const code = findAuthCode(error);
  if (!code) return new AuthError(authMessages.unexpected);
  return new AuthError(authCodes[code].message, authCodes[code].field);
}
