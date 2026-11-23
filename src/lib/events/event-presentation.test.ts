import { describe, expect, it } from 'vitest';
import { createSampleEvents, fixedNow } from '../../../tests/fixtures/sample-events';
import {
  countMissingParticipants,
  describeAgeGroup,
  describeBringAlong,
  describeCost,
  describeEventStatus,
  formatEventDate,
  formatEventTime,
  summarizePlaces,
} from './event-presentation';

describe('F-00 AK4: Alters-, Platz- und Statusangaben', () => {
  it('F-00 AK4: unterscheidet Altersgruppe, offene Gruppe und fehlende Daten', () => {
    expect(describeAgeGroup('20–25')).toBe('Altersgruppe: 20–25 Jahre');
    expect(describeAgeGroup('unter 20')).toBe('Altersgruppe: unter 20 Jahre');
    expect(describeAgeGroup('über 40')).toBe('Altersgruppe: über 40 Jahre');
    expect(describeAgeGroup('')).toBe('Altersgruppe: Alle Altersgruppen');
    for (const age of [undefined, null, 'unbekannt', 22]) expect(describeAgeGroup(age)).toBe('Altersgruppe: Nicht angegeben');
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
