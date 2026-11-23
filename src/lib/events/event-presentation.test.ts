import { describe, expect, it } from 'vitest';
import { createSampleEvents, fixedNow } from '../../../tests/fixtures/sample-events';
import { describeAgeGroup, describeEventStatus, formatEventDate, formatEventTime, summarizePlaces } from './event-presentation';

describe('F-00 AK4: Alters-, Platz- und Statusangaben', () => {
  it('F-00 AK4: unterscheidet Altersgruppe, offene Gruppe und fehlende Daten', () => {
    expect(describeAgeGroup('20–25')).toBe('Altersgruppe: 20–25 Jahre');
    expect(describeAgeGroup('unter 20')).toBe('Altersgruppe: unter 20 Jahre');
    expect(describeAgeGroup('über 40')).toBe('Altersgruppe: über 40 Jahre');
    expect(describeAgeGroup('')).toBe('Altersgruppe: Alle Altersgruppen');
    for (const age of [undefined, null, 'unbekannt', 22]) expect(describeAgeGroup(age)).toBe('Altersgruppe: Nicht angegeben');
  });

  it('F-00 AK4: berechnet freie Plätze einschließlich leerer und voller Treffen', () => {
    expect(summarizePlaces({ capacity: 10, participants: ['a', 'b', 'c', 'd', 'e'] })).toEqual({
      label: '5 von 10 Plätzen frei',
      free: 5,
      full: false,
    });
    expect(summarizePlaces({ capacity: 2, participants: ['a'] }).free).toBe(1);
    expect(summarizePlaces({ capacity: 2, participants: [] }).free).toBe(2);
    expect(summarizePlaces({ capacity: 2, participants: ['a', 'b'] })).toEqual({
      label: 'Ausgebucht · 0 Plätze frei',
      free: 0,
      full: true,
    });
    expect(summarizePlaces({ status: 'cancelled', capacity: 2, participants: [] })).toEqual({ label: 'Abgesagt', free: null, full: false });
  });

  it.each([
    {},
    { capacity: 10 },
    { capacity: null, participants: [] },
    { capacity: -1, participants: [] },
    { capacity: 2.5, participants: [] },
    { capacity: NaN, participants: [] },
    { capacity: 0, participants: [] },
    { capacity: 2, participants: ['a', 'a'] },
    { capacity: 2, participants: [null] },
    { capacity: 2, participants: [''] },
    { capacity: 2, participants: ['  '] },
    { capacity: 1, participants: ['a', 'b'] },
  ])('F-00 AK4: erfindet keine Verfügbarkeit für unvollständige Daten: %j', (event) => {
    expect(summarizePlaces(event)).toEqual({ label: 'Platzangabe nicht verfügbar', free: null, full: false });
  });

  it('F-00 AK4: bestimmt den Zustand nach Absage, Zeit und Belegung', () => {
    const [football, volleyball, badminton] = createSampleEvents();
    expect(describeEventStatus(football, fixedNow)).toBe('Sucht Mitspieler');
    expect(describeEventStatus({ ...football, participants: [...football.participants, 'lea'] }, fixedNow)).toBe('Findet statt');
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
