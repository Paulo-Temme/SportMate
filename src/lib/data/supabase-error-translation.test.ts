import { describe, expect, it } from 'vitest';
import { AuthError } from '../auth/auth-error';
import { EventError } from '../events/event-error';
import { translateAuthError, translateEventError } from './supabase-error-translation';

describe('F-22: Fehlercodes der Datenbank in deutsche Meldungen übersetzen', () => {
  it.each([
    ['EVENT_FULL', 'Leider gerade ausgebucht.'],
    ['AUTH_REQUIRED', 'Bitte zuerst anmelden.'],
    ['PROFILE_MISSING', 'Profil fehlt. Bitte neu anmelden.'],
    ['EVENT_NOT_FOUND', 'Dieses Treffen gibt es nicht.'],
    ['EVENT_CANCELLED', 'Das Treffen ist abgesagt.'],
    ['EVENT_STARTED', 'Das Treffen hat bereits begonnen.'],
    ['ORGANIZER_CANNOT_LEAVE', 'Als organisierende Person kannst du das gesamte Treffen absagen.'],
    ['NOT_ORGANIZER', 'Nur die organisierende Person darf das Treffen absagen.'],
    ['NOT_PARTICIPANT', 'Nur Teilnehmende sehen die Liste.'],
    ['etwas Unbekanntes', 'Das hat nicht geklappt. Bitte später erneut versuchen.'],
  ])('F-22 AK4: übersetzt %s', (code, message) => {
    const error = translateEventError({ message: code });
    expect(error).toBeInstanceOf(EventError);
    expect(error.message).toBe(message);
  });

  it('F-17 AK3: START_IN_PAST markiert das Feld Beginn', () => {
    const error = translateEventError({ message: 'START_IN_PAST' });
    expect(error.message).toBe('Der Termin muss in der Zukunft liegen.');
    expect(error.field).toBe('startsAt');
  });

  it.each([
    ['events_capacity_range', 'capacity'],
    ['events_title_length', 'title'],
    ['events_meeting_point_length', 'meetingPoint'],
    ['events_end_after_start', 'endsAt'],
    ['events_max_duration', 'endsAt'],
    ['events_min_participants_range', 'minParticipants'],
    ['events_cost_range', 'costCents'],
    ['events_bring_along_length', 'bringAlong'],
    ['events_location_name_length', 'locationName'],
    ['events_latitude_range', 'latitude'],
  ])('F-17 AK4: INVALID_INPUT mit %s ergibt eine Feldmeldung', (constraint, field) => {
    const error = translateEventError({ message: 'INVALID_INPUT', details: constraint });
    expect(error.field).toBe(field);
    expect(error.message.length).toBeGreaterThan(5);
  });

  it('F-17: INVALID_INPUT ohne bekanntes Feld ergibt eine allgemeine Meldung', () => {
    const error = translateEventError({ message: 'INVALID_INPUT', details: 'not_null' });
    expect(error.field).toBeUndefined();
    expect(error.message).toBe('Bitte die Eingaben prüfen.');
    expect(translateEventError({ message: 'INVALID_INPUT', details: null }).message).toBe('Bitte die Eingaben prüfen.');
  });
});

describe('F-01: Fehler von Supabase Auth übersetzen', () => {
  it.each([
    [{ code: 'invalid_credentials', message: 'Invalid login credentials' }, 'E-Mail oder Passwort falsch.', undefined],
    [{ code: 'user_already_exists', message: 'User already registered' }, 'Diese E-Mail wird bereits verwendet.', 'email'],
    [{ code: 'email_exists', message: 'x' }, 'Diese E-Mail wird bereits verwendet.', 'email'],
    [{ code: 'weak_password', message: 'x' }, 'Mindestens 8 Zeichen.', 'password'],
    [{ code: 'email_address_invalid', message: 'x' }, 'Bitte eine gültige E-Mail-Adresse eingeben.', 'email'],
    [{ code: 'validation_failed', message: 'Unable to validate email address: invalid format' }, 'Bitte eine gültige E-Mail-Adresse eingeben.', 'email'],
    [{ code: 'email_not_confirmed', message: 'x' }, 'Bitte bestätige zuerst deine E-Mail-Adresse.', undefined],
    [{ message: 'User already registered' }, 'Diese E-Mail wird bereits verwendet.', 'email'],
    [{ message: 'Invalid login credentials' }, 'E-Mail oder Passwort falsch.', undefined],
    [{ code: 'over_request_rate_limit', message: 'x' }, 'Das hat nicht geklappt. Bitte später erneut versuchen.', undefined],
  ])('F-01 AK3/AK4: übersetzt %j', (input, message, field) => {
    const error = translateAuthError(input);
    expect(error).toBeInstanceOf(AuthError);
    expect(error.message).toBe(message);
    expect(error.field).toBe(field);
  });
});
