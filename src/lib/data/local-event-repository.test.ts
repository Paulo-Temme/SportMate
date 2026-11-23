import { describe, expect, it } from 'vitest';
import { validInput } from '../../../tests/fixtures/sample-events';
import { emptyFilters } from '../events/event-model';
import { createMemoryStorage, type KeyValueStorage } from './key-value-storage';
import { LocalEventRepository } from './local-event-repository';
import { LocalSession } from './local-session';

const storageKey = 'sportmate.events.v2';
const lea = { id: 'lea', displayName: 'Lea', email: null };
const tom = { id: 'tom', displayName: 'Tom', email: null };

function createRepository(now: Date, storage: KeyValueStorage = createMemoryStorage(), session = new LocalSession()) {
  let counter = 0;
  const repository = new LocalEventRepository({ storage, session, now: () => now, createId: () => `eigen-${++counter}` });
  return { repository, session };
}

function signedIn(now: Date, user = lea, storage: KeyValueStorage = createMemoryStorage()) {
  const setup = createRepository(now, storage);
  setup.session.setUser(user);
  return setup;
}

describe('F-32: lokaler Datenzugriff', () => {
  const now = new Date('2026-10-26T11:00:00Z');

  it('F-32 AK2: startet als Gast mit Demotreffen', async () => {
    const { repository } = createRepository(now);
    expect(await repository.getCurrentUserId()).toBeNull();
    const events = await repository.listEvents();
    expect(events.length).toBeGreaterThanOrEqual(6);
    expect(events.every((event) => event.status === 'published' && event.isDemo)).toBe(true);
    expect(events.every((event) => !event.isViewerParticipant && !event.isViewerOrganizer)).toBe(true);
    expect(await repository.getEvent('demo-fussball-campus')).not.toBeNull();
    expect(await repository.getEvent('gibt-es-nicht')).toBeNull();
  });

  it('F-32: speichert Änderungen im übergebenen Speicher', async () => {
    const storage = createMemoryStorage();
    await signedIn(now, lea, storage).repository.joinEvent('demo-badminton-halle');
    const reloaded = signedIn(now, lea, storage).repository;
    const event = await reloaded.getEvent('demo-badminton-halle');
    expect(event?.participantCount).toBe(2);
    expect(event?.isViewerParticipant).toBe(true);
  });

  it('F-01: liest die angemeldete Person aus der geteilten Sitzung', async () => {
    const { repository, session } = createRepository(now);
    session.setUser(tom);
    expect(await repository.getCurrentUserId()).toBe('tom');
    session.setUser(null);
    expect(await repository.getCurrentUserId()).toBeNull();
  });

  it('F-02 AK2: Gäste können nichts ändern', async () => {
    const { repository } = createRepository(now);
    await expect(repository.joinEvent('demo-badminton-halle')).rejects.toThrow('anmelden');
    await expect(repository.createEvent(validInput)).rejects.toThrow('anmelden');
    expect((await repository.getEvent('demo-badminton-halle'))?.participantCount).toBe(1);
  });

  it('F-22: meldet unbekannte Treffen', async () => {
    const { repository } = signedIn(now);
    await expect(repository.joinEvent('gibt-es-nicht')).rejects.toThrow('gibt es nicht');
    await expect(repository.leaveEvent('gibt-es-nicht')).rejects.toThrow('gibt es nicht');
    await expect(repository.cancelEvent('gibt-es-nicht')).rejects.toThrow('gibt es nicht');
    expect(await repository.listParticipants('gibt-es-nicht')).toEqual([]);
  });

  it('F-32: befüllt beschädigte oder fremde Daten neu', async () => {
    for (const content of ['kein json', '{"version":1}', 'null']) {
      const storage = createMemoryStorage();
      storage.setItem(storageKey, content);
      expect((await createRepository(now, storage).repository.listEvents()).length).toBeGreaterThan(3);
    }
  });

  it('F-32: erneuert Demotreffen an einem neuen Tag und behält eigene Treffen', async () => {
    const storage = createMemoryStorage();
    const created = await signedIn(now, lea, storage).repository.createEvent(validInput);
    const nextDay = new Date('2026-10-27T09:00:00Z');
    const { repository } = signedIn(nextDay, lea, storage);
    expect(await repository.getEvent(created.id)).toEqual(created);
    const today = await repository.listEvents({ ...emptyFilters, period: 'today' });
    expect(today.length).toBeGreaterThanOrEqual(1);
  });

  it('F-17 AK1: neues Treffen hat Belegung 1 und die Person als Organisatorin', async () => {
    const { repository } = signedIn(now);
    const created = await repository.createEvent(validInput);
    expect(created).toMatchObject({ participantCount: 1, isViewerParticipant: true, isViewerOrganizer: true, organizerName: 'Lea', isDemo: false });
  });

  it('F-20 AK1: Teilnehmende sehen die Anzeigenamen, Organisator zuerst', async () => {
    const { repository } = signedIn(now, { id: 'kim', displayName: 'Kim', email: null });
    expect(await repository.listParticipants('demo-fussball-campus')).toEqual([
      { displayName: 'Alex', isOrganizer: true },
      { displayName: 'Kim', isOrganizer: false },
      { displayName: 'Sam', isOrganizer: false },
      { displayName: 'Nora', isOrganizer: false },
      { displayName: 'Emi', isOrganizer: false },
    ]);
  });

  it('F-20 AK2: Nicht-Teilnehmende und Gäste sehen keine Namen', async () => {
    expect(await signedIn(now).repository.listParticipants('demo-fussball-campus')).toEqual([]);
    expect(await createRepository(now).repository.listParticipants('demo-fussball-campus')).toEqual([]);
  });
});
