import { describe, expect, it } from 'vitest';
import { validInput } from '../../../tests/fixtures/sample-events';
import { emptyFilters } from '../events/event-model';
import { createMemoryStorage, LocalEventRepository, type KeyValueStorage } from './local-event-repository';

const storageKey = 'sportmate.events.v1';

function createRepository(now: Date, storage: KeyValueStorage = createMemoryStorage()) {
  let counter = 0;
  return new LocalEventRepository({ storage, now: () => now, createId: () => `eigen-${++counter}` });
}

describe('F-00 AK7: lokaler Datenzugriff', () => {
  const now = new Date('2026-10-26T11:00:00Z');

  it('F-00 AK7: startet mit Demotreffen und der Demoperson Lea', async () => {
    const repository = createRepository(now);
    expect(await repository.getCurrentUserId()).toBe('lea');
    const events = await repository.listEvents();
    expect(events.length).toBeGreaterThan(3);
    expect(events.every((event) => event.status === 'published')).toBe(true);
    expect(await repository.getEvent('demo-fussball-campus')).not.toBeNull();
    expect(await repository.getEvent('gibt-es-nicht')).toBeNull();
  });

  it('F-00 AK7: speichert Änderungen dauerhaft im übergebenen Speicher', async () => {
    const storage = createMemoryStorage();
    await createRepository(now, storage).joinEvent('demo-badminton-halle');
    const reloaded = createRepository(now, storage);
    expect((await reloaded.getEvent('demo-badminton-halle'))?.participants).toEqual(['alex', 'lea']);
  });

  it('F-00 AK7: wechselt die Demoperson und lehnt Unbekannte ab', async () => {
    const repository = createRepository(now);
    await repository.switchUser('tom');
    expect(await repository.getCurrentUserId()).toBe('tom');
    for (const userId of ['unbekannt', '__proto__', '']) await expect(repository.switchUser(userId)).rejects.toThrow('Demo-Person');
    await repository.switchUser(null);
    expect(await repository.getCurrentUserId()).toBeNull();
  });

  it('F-00 AK7: Gäste können nichts ändern', async () => {
    const repository = createRepository(now);
    await repository.switchUser(null);
    await expect(repository.joinEvent('demo-badminton-halle')).rejects.toThrow('anmelden');
    await expect(repository.createEvent(validInput)).rejects.toThrow('anmelden');
  });

  it('F-00 AK7: meldet unbekannte Treffen', async () => {
    const repository = createRepository(now);
    await expect(repository.joinEvent('gibt-es-nicht')).rejects.toThrow('gibt es nicht');
    await expect(repository.leaveEvent('gibt-es-nicht')).rejects.toThrow('gibt es nicht');
    await expect(repository.cancelEvent('gibt-es-nicht')).rejects.toThrow('gibt es nicht');
  });

  it('F-00 AK7: befüllt beschädigte oder fremde Daten neu', async () => {
    for (const content of ['kein json', '{"version":2}', 'null']) {
      const storage = createMemoryStorage();
      storage.setItem(storageKey, content);
      expect((await createRepository(now, storage).listEvents()).length).toBeGreaterThan(3);
    }
  });

  it('F-00 AK7: erneuert Demotreffen an einem neuen Tag und behält eigene Treffen', async () => {
    const storage = createMemoryStorage();
    const created = await createRepository(now, storage).createEvent(validInput);
    const nextDay = new Date('2026-10-27T09:00:00Z');
    const repository = createRepository(nextDay, storage);
    expect(await repository.getEvent(created.id)).toEqual(created);
    expect(await repository.getCurrentUserId()).toBe('lea');
    const today = await repository.listEvents({ ...emptyFilters, period: 'today' });
    expect(today.length).toBeGreaterThanOrEqual(1);
  });
});
