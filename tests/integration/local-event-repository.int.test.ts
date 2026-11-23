import { describe, expect, it } from 'vitest';
import { emptyFilters } from '../../src/lib/events/event-model';
import { createMemoryStorage } from '../../src/lib/data/key-value-storage';
import { LocalEventRepository } from '../../src/lib/data/local-event-repository';
import { LocalSession } from '../../src/lib/data/local-session';
import { validInput } from '../fixtures/sample-events';

describe('F-22, F-23, F-18: Nutzerweg über den lokalen Datenzugriff', () => {
  const now = new Date('2026-10-26T11:00:00Z');
  const session = new LocalSession();
  const repository = new LocalEventRepository({ storage: createMemoryStorage(), session, now: () => now, createId: () => 'neu-1' });
  const lea = { id: 'lea', displayName: 'Lea', email: 'lea@example.org' };
  const tom = { id: 'tom', displayName: 'Tom', email: null };

  it('F-22 AK1: erstellen, finden, beitreten, verlassen und absagen greifen ineinander', async () => {
    session.setUser(lea);
    const created = await repository.createEvent(validInput);
    expect(created.organizerId).toBe('lea');

    const found = await repository.listEvents({ ...emptyFilters, query: 'Basketball am Campus' });
    expect(found.map((event) => event.id)).toContain('neu-1');

    session.setUser(tom);
    expect(await repository.joinEvent('neu-1')).toMatchObject({ participantCount: 2, isViewerParticipant: true, isViewerOrganizer: false });
    expect((await repository.listEvents({ ...emptyFilters, mine: true })).map((event) => event.id)).toContain('neu-1');
    expect(await repository.leaveEvent('neu-1')).toMatchObject({ participantCount: 1, isViewerParticipant: false });
    await expect(repository.cancelEvent('neu-1')).rejects.toThrow('Nur');

    session.setUser(lea);
    expect((await repository.cancelEvent('neu-1')).status).toBe('cancelled');
    expect((await repository.listEvents()).map((event) => event.id)).not.toContain('neu-1');
    expect((await repository.listEvents({ ...emptyFilters, mine: true })).map((event) => event.id)).toContain('neu-1');
  });
});
