import { describe, expect, it } from 'vitest';
import { createSampleEvents, fixedNow } from '../../../tests/fixtures/sample-events';
import { emptyFilters } from './event-model';
import { searchEvents } from './event-search';
import { orderEventCards } from './list-order';

describe('F-00 AK5: Reihenfolge der Trefferliste nach der Filterung', () => {
  it('F-00 AK5: verschiebt nur volle Treffen und lässt Quelle und relative Reihenfolge unverändert', () => {
    const list = searchEvents(createSampleEvents(), emptyFilters, '', fixedNow);
    const before = structuredClone(list);
    expect(orderEventCards(list, 'available-first').map((event) => event.id)).toEqual(['fussball', 'badminton', 'volleyball']);
    expect(list).toEqual(before);
    expect(orderEventCards(list, 'chronological')).toEqual(list);
    expect(orderEventCards(list, 'chronological')).not.toBe(list);
  });

  it('F-00 AK5: erhält Suchtreffer, Sportfilter, leere Listen und vollständig volle Listen', () => {
    const events = createSampleEvents();
    for (const filters of [
      { ...emptyFilters, query: 'Campus' },
      { ...emptyFilters, sports: ['Volleyball' as const] },
      { ...emptyFilters, query: 'nichtvorhanden' },
    ]) {
      const filtered = searchEvents(events, filters, '', fixedNow);
      expect(orderEventCards(filtered, 'available-first')).toEqual(filtered);
    }
    const full = [events[1], { ...events[1], id: 'zweites-volles-treffen' }];
    expect(orderEventCards(full, 'available-first')).toEqual(full);
  });
});
