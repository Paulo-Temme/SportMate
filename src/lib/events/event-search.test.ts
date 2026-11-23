import { describe, expect, it } from 'vitest';
import { createSampleEvents, fixedNow } from '../../../tests/fixtures/sample-events';
import { emptyFilters } from './event-model';
import { searchEvents, toBerlinDay } from './event-search';

const ids = (events: { id: string }[]) => events.map((event) => event.id);

describe('F-00 AK3: Treffen suchen und filtern', () => {
  it('F-00 AK3: zeigt ohne Filter alle kommenden Treffen aufsteigend nach Beginn', () => {
    const events = createSampleEvents().reverse();
    expect(ids(searchEvents(events, emptyFilters, '', fixedNow))).toEqual(['fussball', 'volleyball', 'badminton']);
  });

  it('F-00 AK3: verknüpft Sportarten per ODER und Filtergruppen per UND', () => {
    const events = createSampleEvents();
    expect(searchEvents(events, { ...emptyFilters, sports: ['Fußball', 'Badminton'] }, '', fixedNow)).toHaveLength(2);
    const combined = {
      ...emptyFilters,
      sports: ['Fußball' as const, 'Badminton' as const],
      query: 'CAMPUS',
      level: 'Erfahren',
      ageGroup: 'über 40',
    };
    expect(ids(searchEvents(events, combined, '', fixedNow))).toEqual(['badminton']);
  });

  it('F-00 AK3: findet Suchtext in Titel, Treffpunkt und Sportart ohne Groß-/Kleinschreibung', () => {
    const events = createSampleEvents();
    expect(ids(searchEvents(events, { ...emptyFilters, query: ' hafenspitze ' }, '', fixedNow))).toEqual(['volleyball']);
    expect(ids(searchEvents(events, { ...emptyFilters, query: 'badminton' }, '', fixedNow))).toEqual(['badminton']);
    expect(searchEvents(events, { ...emptyFilters, query: 'nichtvorhanden' }, '', fixedNow)).toEqual([]);
  });

  it('F-00 AK3: filtert nach Niveau und Altersgruppe, offene Treffen passen immer', () => {
    const events = createSampleEvents();
    expect(ids(searchEvents(events, { ...emptyFilters, level: 'Anfänger' }, '', fixedNow))).toEqual(['fussball', 'badminton']);
    expect(ids(searchEvents(events, { ...emptyFilters, ageGroup: '26–30' }, '', fixedNow))).toEqual(['volleyball', 'badminton']);
  });

  it('F-00 AK3: filtert heute, morgen, Woche und konkretes Datum', () => {
    const events = createSampleEvents();
    expect(searchEvents(events, { ...emptyFilters, period: 'today' }, '', fixedNow)).toHaveLength(0);
    expect(searchEvents(events, { ...emptyFilters, period: 'tomorrow' }, '', fixedNow)).toHaveLength(2);
    expect(searchEvents(events, { ...emptyFilters, period: 'week' }, '', fixedNow)).toHaveLength(3);
    expect(ids(searchEvents(events, { ...emptyFilters, period: 'date', date: '2026-10-28' }, '', fixedNow))).toEqual(['badminton']);
  });

  it('F-00 AK3: Woche endet am Sonntag', () => {
    const sunday = { ...createSampleEvents()[0], id: 'sonntag', startsAt: '2026-11-01T10:00:00.000Z' };
    const monday = { ...sunday, id: 'montag', startsAt: '2026-11-02T10:00:00.000Z' };
    expect(ids(searchEvents([sunday, monday], { ...emptyFilters, period: 'week' }, '', fixedNow))).toEqual(['sonntag']);
  });

  it('F-00 AK3: blendet begonnene Treffen aus', () => {
    const started = { ...createSampleEvents()[0], startsAt: fixedNow.toISOString() };
    expect(searchEvents([started], emptyFilters, '', fixedNow)).toEqual([]);
  });

  it('F-00 AK3: zeigt unter "Meine Treffen" nur eigene Zusagen', () => {
    const events = createSampleEvents();
    expect(searchEvents(events, { ...emptyFilters, mine: true }, 'lea', fixedNow)).toHaveLength(0);
    expect(ids(searchEvents(events, { ...emptyFilters, mine: true }, 'emi', fixedNow))).toEqual(['fussball']);
  });

  it('F-00 AK3: berechnet den Kalendertag in Europe/Berlin auch an UTC-Grenzen', () => {
    expect(toBerlinDay('2026-10-26T23:30:00Z')).toBe('2026-10-27');
    expect(toBerlinDay('2026-07-01T22:30:00Z')).toBe('2026-07-02');
    expect(toBerlinDay('2026-07-01T21:59:00Z')).toBe('2026-07-01');
  });
});
