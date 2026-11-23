import { describe, expect, it } from 'vitest';
import { emptyFilters } from '../../src/lib/events/event-model';
import { createMemoryStorage, LocalEventRepository } from '../../src/lib/data/local-event-repository';
import { validInput } from '../fixtures/sample-events';

describe('F-00 AK7: Nutzerweg über den lokalen Datenzugriff', () => {
  const now = new Date('2026-10-26T11:00:00Z');
  const repository = new LocalEventRepository({ storage: createMemoryStorage(), now: () => now, createId: () => 'neu-1' });

  it('F-00 AK7: erstellen, finden, beitreten, verlassen und absagen greifen ineinander', async () => {
    const created = await repository.createEvent(validInput);
    expect(created.organizerId).toBe('lea');

    const found = await repository.listEvents({ ...emptyFilters, query: 'Basketball am Campus' });
    expect(found.map((event) => event.id)).toContain('neu-1');

    await repository.switchUser('tom');
    expect((await repository.joinEvent('neu-1')).participants).toEqual(['lea', 'tom']);
    expect((await repository.listEvents({ ...emptyFilters, mine: true })).map((event) => event.id)).toContain('neu-1');
    expect((await repository.leaveEvent('neu-1')).participants).toEqual(['lea']);
    await expect(repository.cancelEvent('neu-1')).rejects.toThrow('Nur');

    await repository.switchUser('lea');
    expect((await repository.cancelEvent('neu-1')).status).toBe('cancelled');
    expect((await repository.listEvents()).map((event) => event.id)).not.toContain('neu-1');
    expect((await repository.listEvents({ ...emptyFilters, mine: true })).map((event) => event.id)).toContain('neu-1');
  });
});
