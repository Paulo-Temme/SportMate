import { describe, expect, it } from 'vitest';
import { buildLocalServices } from '../../src/lib/data/data-services';
import { createMemoryStorage } from '../../src/lib/data/key-value-storage';
import { validInput } from '../fixtures/sample-events';

describe('F-01, F-02, F-22: Anmeldung und Teilnahme im lokalen Modus', () => {
  it('F-02 AK2: Gast stöbert, wird beim Mitmachen abgewiesen und kann nach der Registrierung beitreten', async () => {
    const { events, auth } = buildLocalServices({ events: createMemoryStorage(), persistent: createMemoryStorage() });
    const list = await events.listEvents();
    expect(list.length).toBeGreaterThanOrEqual(6);
    const target = list.find((event) => event.id === 'demo-badminton-halle');
    expect(target).toMatchObject({ participantCount: 1, isViewerParticipant: false });
    await expect(events.joinEvent('demo-badminton-halle')).rejects.toThrow('anmelden');

    await auth.signUp({ email: 'lea@example.org', password: 'sportmate1', displayName: 'Lea Neu' });
    const joined = await events.joinEvent('demo-badminton-halle');
    expect(joined).toMatchObject({ participantCount: 2, isViewerParticipant: true });
    expect((await events.listParticipants('demo-badminton-halle')).map((entry) => entry.displayName)).toEqual(['Alex', 'Lea Neu']);
  });

  it('F-22 AK2: lehnt Beitritt bei vollem Treffen ab', async () => {
    const { events, auth } = buildLocalServices({ events: createMemoryStorage(), persistent: createMemoryStorage() });
    await auth.signInAsDemo('lea');
    await expect(events.joinEvent('demo-volleyball-hafen')).rejects.toThrow('Leider gerade ausgebucht.');
    expect((await events.getEvent('demo-volleyball-hafen'))?.participantCount).toBe(4);
  });

  it('F-22 AK3: erneuter Beitritt ändert die Teilnehmerzahl nicht', async () => {
    const { events, auth } = buildLocalServices({ events: createMemoryStorage(), persistent: createMemoryStorage() });
    await auth.signInAsDemo('lea');
    await events.joinEvent('demo-laufen-volkspark');
    expect((await events.joinEvent('demo-laufen-volkspark')).participantCount).toBe(3);
  });

  it('F-23 AK3: Rückzug von lea lässt tom als Teilnehmer', async () => {
    const { events, auth } = buildLocalServices({ events: createMemoryStorage(), persistent: createMemoryStorage() });
    await auth.signInAsDemo('tom');
    await events.joinEvent('demo-laufen-volkspark');
    await auth.signInAsDemo('lea');
    await events.joinEvent('demo-laufen-volkspark');
    expect((await events.leaveEvent('demo-laufen-volkspark')).participantCount).toBe(3);
    await auth.signInAsDemo('tom');
    expect((await events.getEvent('demo-laufen-volkspark'))?.isViewerParticipant).toBe(true);
  });

  it('F-18 AK1: abgesagtes Treffen bleibt bei Teilnehmenden unter "Meine Treffen"', async () => {
    const { events, auth } = buildLocalServices({ events: createMemoryStorage(), persistent: createMemoryStorage() });
    await auth.signInAsDemo('lea');
    const created = await events.createEvent({ ...validInput, startsAt: '2099-01-01T10:00:00Z', endsAt: '2099-01-01T12:00:00Z' });
    await auth.signInAsDemo('tom');
    await events.joinEvent(created.id);
    await auth.signInAsDemo('lea');
    await events.cancelEvent(created.id);
    await auth.signInAsDemo('tom');
    const mine = await events.listEvents({ query: '', sports: [], level: '', ageGroup: '', period: '', date: '', mine: true });
    expect(mine.find((event) => event.id === created.id)?.status).toBe('cancelled');
    await expect(events.joinEvent(created.id)).rejects.toThrow('abgesagt');
  });
});
