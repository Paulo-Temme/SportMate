// Tests des Erstellen-Entwurfs: Umwandlung der Formularwerte und Prüfung je Schritt über validateEventInput (F-17, F-25).
import { describe, expect, it } from 'vitest';
import { buildEventInput, createEmptyDraft, findStepErrors, stepOfField, type EventDraft } from './event-draft';

const now = new Date('2026-11-25T10:00:00');

function validDraft(overrides: Partial<EventDraft> = {}): EventDraft {
  return {
    ...createEmptyDraft(now),
    title: 'Volleyball am Abend',
    sport: 'Volleyball',
    date: '2026-11-26',
    startTime: '18:00',
    endTime: '20:00',
    capacity: '8',
    minParticipants: '2',
    level: 'Alle Niveaus',
    cost: '0',
    meetingPoint: 'Halle Sandberg, Eingang Nord',
    ...overrides,
  };
}

describe('buildEventInput', () => {
  it('F-17 AK1: wandelt Datum, Uhrzeit, Zahlen und Kosten in die Eingabe der Kernlogik um', () => {
    const input = buildEventInput(validDraft({ cost: '3,50' }));
    expect(input.startsAt).toBe(new Date('2026-11-26T18:00').toISOString());
    expect(input.endsAt).toBe(new Date('2026-11-26T20:00').toISOString());
    expect(input.capacity).toBe(8);
    expect(input.costCents).toBe(350);
  });

  it('F-13 AK1: leere Kosten bedeuten kostenlos', () => {
    expect(buildEventInput(validDraft({ cost: '' })).costCents).toBe(0);
  });
});

describe('findStepErrors', () => {
  it('F-17 AK1: ein gültiger Entwurf hat in keinem Schritt Fehler', () => {
    expect(findStepErrors(validDraft(), 1, now)).toEqual({});
    expect(findStepErrors(validDraft(), 2, now)).toEqual({});
    expect(findStepErrors(validDraft(), 3, now)).toEqual({});
  });

  it('F-17 AK1: Schritt 1 meldet einen zu kurzen Titel am Feld', () => {
    expect(findStepErrors(validDraft({ title: 'V' }), 1, now)).toHaveProperty('title');
  });

  it('F-17 AK1: Schritt 1 ignoriert Fehler späterer Schritte', () => {
    expect(findStepErrors(validDraft({ meetingPoint: '', date: '' }), 1, now)).toEqual({});
  });

  it('F-17 AK3: Termin in der Vergangenheit wird in Schritt 2 gemeldet', () => {
    const errors = findStepErrors(validDraft({ date: '2026-11-25', startTime: '09:00', endTime: '10:00' }), 2, now);
    expect(errors.startsAt).toBe('Der Termin muss in der Zukunft liegen.');
  });

  it('F-17 AK3: Ende vor Beginn wird in Schritt 2 gemeldet', () => {
    const errors = findStepErrors(validDraft({ startTime: '18:00', endTime: '17:00' }), 2, now);
    expect(errors.endsAt).toBe('Das Ende muss nach dem Beginn liegen.');
  });

  it('F-17 AK2: fehlender Treffpunkt wird in Schritt 3 gemeldet', () => {
    expect(findStepErrors(validDraft({ meetingPoint: '' }), 3, now)).toHaveProperty('meetingPoint');
  });

  it('F-17 AK4: Kapazität 1 oder 51 wird in Schritt 3 gemeldet', () => {
    expect(findStepErrors(validDraft({ capacity: '1', minParticipants: '1' }), 3, now)).toHaveProperty('capacity');
    expect(findStepErrors(validDraft({ capacity: '51' }), 3, now)).toHaveProperty('capacity');
  });

  it('F-25 AK3: Mindestzahl über den Plätzen wird gemeldet', () => {
    expect(findStepErrors(validDraft({ capacity: '8', minParticipants: '9' }), 3, now)).toHaveProperty('minParticipants');
  });
});

describe('stepOfField', () => {
  it('F-17 AK2: ordnet Felder ihrem Schritt zu, damit Serverfehler am richtigen Schritt erscheinen', () => {
    expect(stepOfField('title')).toBe(1);
    expect(stepOfField('startsAt')).toBe(2);
    expect(stepOfField('meetingPoint')).toBe(3);
  });
});
