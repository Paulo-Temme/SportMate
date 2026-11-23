import { describe, expect, it } from 'vitest';
import { createSampleEvents, fixedNow } from '../../../tests/fixtures/sample-events';
import {
  countMissingParticipants,
  describeAgeGroup,
  describeBringAlong,
  describeCost,
  describeDayLabel,
  describeEventStatus,
  formatEventDate,
  formatEventSchedule,
  formatEventTime,
  summarizePlaces,
} from './event-presentation';

describe('F-00 AK4: Alters-, Platz- und Statusangaben', () => {
  it('F-00 AK4: unterscheidet Altersgruppe, offene Gruppe und fehlende Daten', () => {
    expect(describeAgeGroup('20–25')).toBe('Alter: 20–25 Jahre');
    expect(describeAgeGroup('unter 20')).toBe('Alter: unter 20 Jahre');
    expect(describeAgeGroup('über 40')).toBe('Alter: über 40 Jahre');
    for (const age of [undefined, null, 'unbekannt', 22]) expect(describeAgeGroup(age)).toBe('Alter: nicht angegeben');
  });

  it('F-12 AK2 (FB-45): Treffen ohne Altersgrenze heißt "Alter: offen für alle"', () => {
    expect(describeAgeGroup('')).toBe('Alter: offen für alle');
  });

  it('F-00 AK4: berechnet freie Plätze einschließlich leerer und voller Treffen', () => {
    expect(summarizePlaces({ capacity: 10, participantCount: 5 })).toEqual({
      label: '5 von 10 Plätzen frei',
      free: 5,
      full: false,
    });
    expect(summarizePlaces({ capacity: 2, participantCount: 1 }).free).toBe(1);
    expect(summarizePlaces({ capacity: 2, participantCount: 0 }).free).toBe(2);
    expect(summarizePlaces({ capacity: 2, participantCount: 2 })).toEqual({
      label: 'Ausgebucht · 0 Plätze frei',
      free: 0,
      full: true,
    });
    expect(summarizePlaces({ status: 'cancelled', capacity: 2, participantCount: 0 })).toEqual({ label: 'Abgesagt', free: null, full: false });
  });

  it.each([
    {},
    { capacity: 10 },
    { capacity: null, participantCount: 0 },
    { capacity: -1, participantCount: 0 },
    { capacity: 2.5, participantCount: 0 },
    { capacity: NaN, participantCount: 0 },
    { capacity: 0, participantCount: 0 },
    { capacity: 2, participantCount: -1 },
    { capacity: 2, participantCount: 1.5 },
    { capacity: 2, participantCount: '1' },
    { capacity: 2, participantCount: NaN },
    { capacity: 1, participantCount: 2 },
  ])('F-00 AK4: erfindet keine Verfügbarkeit für unvollständige Daten: %j', (event) => {
    expect(summarizePlaces(event)).toEqual({ label: 'Platzangabe nicht verfügbar', free: null, full: false });
  });

  it('F-00 AK4: bestimmt den Zustand nach Absage, Zeit und Belegung', () => {
    const [football, volleyball, badminton] = createSampleEvents();
    expect(describeEventStatus(football, fixedNow)).toBe('Sucht noch Mitspielende');
    expect(describeEventStatus({ ...football, participantCount: football.participantCount + 1 }, fixedNow)).toBe('Findet statt');
    expect(describeEventStatus(volleyball, fixedNow)).toBe('Ausgebucht');
    expect(describeEventStatus(badminton, new Date(badminton.startsAt))).toBe('Läuft bereits');
    expect(describeEventStatus(badminton, new Date(badminton.endsAt))).toBe('Beendet');
    expect(describeEventStatus({ ...badminton, status: 'cancelled' }, fixedNow)).toBe('Abgesagt');
  });

  it('F-00 AK4: formatiert Datum und Uhrzeit auf Deutsch in Berliner Zeit', () => {
    expect(formatEventDate('2026-10-28T15:00:00.000Z')).toBe('Mi., 28. Okt.');
    expect(formatEventTime('2026-10-28T15:00:00.000Z')).toBe('16:00');
    expect(formatEventTime('2026-07-01T16:00:00.000Z')).toBe('18:00');
  });
});

describe('F-25: Mindestteilnehmerzahl', () => {
  it('F-25 AK1: zählt, wie viele bis zur Mindestzahl fehlen', () => {
    const [football] = createSampleEvents();
    expect(countMissingParticipants({ minParticipants: 4, participantCount: 3 })).toBe(1);
    expect(countMissingParticipants({ minParticipants: 4, participantCount: 4 })).toBe(0);
    expect(countMissingParticipants({ minParticipants: 4, participantCount: 6 })).toBe(0);
    expect(describeEventStatus({ ...football, minParticipants: 4, participantCount: 3 }, fixedNow)).toBe('Sucht noch Mitspielende');
  });

  it('F-25 AK2: zeigt "Findet statt", sobald die Mindestzahl erreicht ist', () => {
    const [football] = createSampleEvents();
    expect(describeEventStatus({ ...football, minParticipants: 4, participantCount: 4 }, fixedNow)).toBe('Findet statt');
  });
});

describe('F-13: Kosten und Mitbringen', () => {
  it('F-13 AK1: zeigt "Kostenlos" bei Kosten 0', () => {
    expect(describeCost(0)).toBe('Kostenlos');
  });

  it('F-13 AK2: zeigt Kosten in Euro pro Person', () => {
    expect(describeCost(350)).toBe('3,50 € pro Person');
    expect(describeCost(5000)).toBe('50,00 € pro Person');
    expect(describeCost(5)).toBe('0,05 € pro Person');
    for (const value of [-1, 1.5, NaN, '350', null]) expect(describeCost(value)).toBe('Kosten nicht angegeben');
  });

  it('F-13 AK3: zeigt Mitbringen oder "nichts Besonderes"', () => {
    expect(describeBringAlong(' Hallenschuhe, Wasser ')).toBe('Mitbringen: Hallenschuhe, Wasser');
    expect(describeBringAlong('  ')).toBe('Mitbringen: nichts Besonderes');
  });
});

describe('F-12 AK1: Datum mit Dauer', () => {
  it('F-12 AK1: zeigt Wochentag, Datum, Uhrzeit und Dauer in Stunden', () => {
    expect(formatEventSchedule('2026-11-26T17:00:00.000Z', '2026-11-26T19:00:00.000Z')).toBe('Do, 26.11., 18:00–20:00 Uhr · 2 Std.');
  });

  it('F-12 AK1: zeigt Minuten, Stunden mit Minuten und eine Stunde', () => {
    expect(formatEventSchedule('2026-11-26T17:00:00.000Z', '2026-11-26T17:45:00.000Z')).toBe('Do, 26.11., 18:00–18:45 Uhr · 45 Min.');
    expect(formatEventSchedule('2026-11-23T08:30:00.000Z', '2026-11-23T10:00:00.000Z')).toBe('Mo, 23.11., 09:30–11:00 Uhr · 1 Std. 30 Min.');
    expect(formatEventSchedule('2026-11-28T09:00:00.000Z', '2026-11-28T10:00:00.000Z')).toBe('Sa, 28.11., 10:00–11:00 Uhr · 1 Std.');
  });

  it('F-12 AK1: rechnet immer in Berliner Zeit, auch im Sommer und über Mitternacht', () => {
    expect(formatEventSchedule('2026-07-01T16:00:00.000Z', '2026-07-01T18:30:00.000Z')).toBe('Mi, 01.07., 18:00–20:30 Uhr · 2 Std. 30 Min.');
    expect(formatEventSchedule('2026-11-27T21:00:00.000Z', '2026-11-28T00:00:00.000Z')).toBe('Fr, 27.11., 22:00–01:00 Uhr · 3 Std.');
  });

  it('F-12 AK1: lässt die Dauer weg, wenn das Ende nicht nach dem Beginn liegt', () => {
    expect(formatEventSchedule('2026-11-26T17:00:00.000Z', '2026-11-26T17:00:00.000Z')).toBe('Do, 26.11., 18:00 Uhr');
    expect(formatEventSchedule('2026-11-26T17:00:00.000Z', '2026-11-26T16:00:00.000Z')).toBe('Do, 26.11., 18:00 Uhr');
  });

  it('F-12 AK1: wirft bei ungültigem Datum', () => {
    expect(() => formatEventSchedule('kein Datum', '2026-11-26T17:00:00.000Z')).toThrow(RangeError);
    expect(() => formatEventSchedule('2026-11-26T17:00:00.000Z', 'kein Datum')).toThrow(RangeError);
  });
});

describe('F-05 AK1 (REV-04): Tagesangabe Heute/Morgen', () => {
  it('F-05 AK1: nennt heute, morgen und sonst das kurze Datum (Berliner Kalendertag)', () => {
    expect(describeDayLabel('2026-10-26T19:00:00Z', fixedNow)).toBe('Heute');
    expect(describeDayLabel('2026-10-26T22:59:00Z', fixedNow)).toBe('Heute');
    expect(describeDayLabel('2026-10-26T23:30:00Z', fixedNow)).toBe('Morgen');
    expect(describeDayLabel('2026-10-27T22:59:00Z', fixedNow)).toBe('Morgen');
    expect(describeDayLabel('2026-10-27T23:00:00Z', fixedNow)).toBe('Mi., 28. Okt.');
    expect(describeDayLabel('2026-10-25T12:00:00Z', fixedNow)).toBe('So., 25. Okt.');
  });

  it('F-05 AK1: rechnet über die Zeitumstellung im Herbst und Frühjahr richtig', () => {
    const autumnNow = new Date('2026-10-24T23:30:00Z'); // So., 25.10., 01:30 Sommerzeit; um 03:00 wird auf Winterzeit gestellt
    expect(describeDayLabel('2026-10-25T22:30:00Z', autumnNow)).toBe('Heute');
    expect(describeDayLabel('2026-10-25T23:30:00Z', autumnNow)).toBe('Morgen');
    const springNow = new Date('2026-03-28T23:30:00Z'); // So., 29.03., 00:30 Winterzeit; um 02:00 wird auf Sommerzeit gestellt
    expect(describeDayLabel('2026-03-29T21:30:00Z', springNow)).toBe('Heute');
    expect(describeDayLabel('2026-03-29T22:30:00Z', springNow)).toBe('Morgen');
  });

  it('F-05 AK1: wirft bei ungültigem Datum', () => {
    expect(() => describeDayLabel('kein Datum', fixedNow)).toThrow(RangeError);
  });
});
