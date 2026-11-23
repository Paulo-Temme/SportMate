import { describe, expect, it } from 'vitest';
import { fixedNow, validInput } from '../../../tests/fixtures/sample-events';
import { createEvent } from './event-creation';
import { EventError } from './event-error';
import type { EventInput } from './event-model';
import { findEventInputError } from './event-validation';

describe('F-00 AK1: Treffen erstellen und Eingaben prüfen', () => {
  it('F-00 AK1: zählt die organisierende Person automatisch mit und normalisiert die Zeit', () => {
    const event = createEvent({ ...validInput, title: '  Basketball am Campus  ' }, 'lea', 'neu-1', fixedNow);
    expect(event.id).toBe('neu-1');
    expect(event.participants).toEqual(['lea']);
    expect(event.organizerId).toBe('lea');
    expect(event.status).toBe('published');
    expect(event.title).toBe('Basketball am Campus');
    expect(event.startsAt).toBe('2026-10-28T15:00:00.000Z');
  });

  it.each(['', '   '])('F-00 AK1: verweigert das Erstellen für Gäste (Kennung %j)', (userId) => {
    expect(() => createEvent(validInput, userId, 'neu-1', fixedNow)).toThrow('anmelden');
  });

  it.each([
    [{ title: ' ' }, 'title'],
    [{ title: 'ab' }, 'title'],
    [{ title: 'x'.repeat(81) }, 'title'],
    [{ sport: 'Hockey' }, 'sport'],
    [{ meetingPoint: 'Ort' }, 'meetingPoint'],
    [{ meetingPoint: 'x'.repeat(201) }, 'meetingPoint'],
    [{ latitude: NaN }, 'latitude'],
    [{ latitude: 91 }, 'latitude'],
    [{ longitude: 181 }, 'latitude'],
    [{ startsAt: 'ungültig' }, 'startsAt'],
    [{ startsAt: '2026-10-25T10:00:00Z' }, 'startsAt'],
    [{ startsAt: fixedNow.toISOString() }, 'startsAt'],
    [{ endsAt: validInput.startsAt }, 'endsAt'],
    [{ endsAt: 'ungültig' }, 'endsAt'],
    [{ capacity: 51 }, 'capacity'],
    [{ capacity: 1 }, 'capacity'],
    [{ capacity: 2.5 }, 'capacity'],
    [{ minParticipants: 11 }, 'minParticipants'],
    [{ minParticipants: 1 }, 'minParticipants'],
    [{ level: 'Profi' }, 'level'],
    [{ ageGroup: 'privat' }, 'ageGroup'],
    [{ description: 'x'.repeat(301) }, 'description'],
  ])('F-00 AK1: weist ungültige Daten mit Feldangabe ab: %j', (bad, field) => {
    const input = { ...validInput, ...bad } as EventInput;
    expect(findEventInputError(input, fixedNow)?.field).toBe(field);
    expect(() => createEvent(input, 'lea', 'neu-1', fixedNow)).toThrow(EventError);
  });

  it.each([
    { title: 'abc' },
    { title: 'x'.repeat(80) },
    { meetingPoint: 'x'.repeat(200) },
    { capacity: 2, minParticipants: 2 },
    { capacity: 50 },
    { minParticipants: 10 },
    { ageGroup: 'über 40' },
    { description: 'x'.repeat(300) },
  ])('F-00 AK1: akzeptiert Randwerte: %j', (edge) => {
    expect(findEventInputError({ ...validInput, ...edge } as EventInput, fixedNow)).toBeNull();
  });
});
