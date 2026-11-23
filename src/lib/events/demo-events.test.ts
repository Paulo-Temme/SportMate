import { describe, expect, it } from 'vitest';
import { createDemoEvents } from './demo-events';
import { isDemoPerson } from './demo-people';
import { emptyFilters, type SportEvent } from './event-model';
import { searchEvents, toBerlinDay } from './event-search';
import { findEventInputError } from './event-validation';

// Verschiedene Tageszeiten, auch an der Zeitumstellung (25.10.2026) und kurz vor Mitternacht.
const moments = [
  '2026-10-26T07:00:00Z',
  '2026-10-26T15:30:00Z',
  '2026-10-26T21:40:00Z',
  '2026-10-24T22:30:00Z',
  '2026-07-01T20:30:00Z',
  '2026-03-28T23:00:00Z',
].map((iso) => new Date(iso));

describe('F-00 AK6: Demodaten relativ zum aktuellen Datum', () => {
  it.each(moments)('F-00 AK6: hat heute und morgen Treffer (jetzt = %s)', (now) => {
    const events = createDemoEvents(now);
    expect(searchEvents(events, { ...emptyFilters, period: 'today' }, '', now).length).toBeGreaterThanOrEqual(1);
    expect(searchEvents(events, { ...emptyFilters, period: 'tomorrow' }, '', now).length).toBeGreaterThanOrEqual(2);
  });

  it('F-00 AK6: legt Treffen zur Berliner Uhrzeit an, auch an der Zeitumstellung', () => {
    const now = new Date('2026-10-24T10:00:00Z');
    const football = createDemoEvents(now).find((event) => event.id === 'demo-fussball-campus') as SportEvent;
    expect(football.startsAt).toBe('2026-10-25T16:00:00.000Z');
    expect(toBerlinDay(football.startsAt)).toBe('2026-10-25');
  });

  it('F-00 AK6: alle Demotreffen sind gültig, eindeutig und nutzen nur Demopersonen', () => {
    const now = moments[0];
    const events = createDemoEvents(now);
    expect(new Set(events.map((event) => event.id)).size).toBe(events.length);
    for (const event of events) {
      expect(findEventInputError(event, now)).toBeNull();
      expect(event.id.startsWith('demo-')).toBe(true);
      expect([event.organizerId, ...event.participants].every(isDemoPerson)).toBe(true);
      expect(event.participants).toContain(event.organizerId);
    }
  });

  it('F-00 AK6: enthält ein ausgebuchtes und ein abgesagtes Treffen', () => {
    const events = createDemoEvents(moments[0]);
    expect(events.some((event) => event.participants.length === event.capacity)).toBe(true);
    expect(events.filter((event) => event.status === 'cancelled')).toHaveLength(1);
  });

  it('F-00 AK6: liefert bei jedem Aufruf frische Objekte', () => {
    const first = createDemoEvents(moments[0]);
    first[0].participants.push('lea');
    expect(createDemoEvents(moments[0])[0].participants).not.toContain('lea');
  });

  it('F-00 AK6: erkennt nur echte Demopersonen', () => {
    expect(isDemoPerson('lea')).toBe(true);
    for (const userId of ['', 'unbekannt', '__proto__', 'constructor']) expect(isDemoPerson(userId)).toBe(false);
  });
});
