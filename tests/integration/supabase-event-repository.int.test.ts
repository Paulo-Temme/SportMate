// Läuft nur gegen eine echte Supabase-Datenbank: SUPABASE_INTEGRATION=1 und beide NEXT_PUBLIC_SUPABASE_* gesetzt.
// Legt Wegwerf-Konten (*@sportmate-test.de) und Treffen "[Test] …" an. Jedes erstellte Treffen sagt der Organisator
// nach jedem Test ab (afterEach, auch bei Fehlschlag), damit es in der App nicht sichtbar bleibt (BUG-03).
// Die Konten bleiben zurück (ohne service_role nicht löschbar).
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { afterEach, describe, expect, it } from 'vitest';
import { SupabaseAuthGateway } from '../../src/lib/data/supabase-auth-gateway';
import { SupabaseEventRepository } from '../../src/lib/data/supabase-event-repository';
import { summarizePlaces } from '../../src/lib/events/event-presentation';
import { validInput } from '../fixtures/sample-events';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
const enabled = process.env.SUPABASE_INTEGRATION === '1' && url !== '' && anonKey !== '';

function createIsolatedClient(): SupabaseClient {
  return createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } });
}

function randomSecret(): string {
  return `${crypto.randomUUID()}-${crypto.randomUUID()}`.slice(0, 32);
}

async function registerThrowawayAccount(label: string) {
  const client = createIsolatedClient();
  const auth = new SupabaseAuthGateway(client);
  const email = `${label}-${crypto.randomUUID().slice(0, 8)}@sportmate-test.de`;
  const user = await auth.signUp({ email, password: randomSecret(), displayName: `Test ${label}` });
  return { client, auth, user, events: new SupabaseEventRepository(client) };
}

type CreatedEvent = { id: string; events: SupabaseEventRepository };

// Alles, was ein Test angelegt hat; afterEach sagt es ab.
const createdEvents: CreatedEvent[] = [];

async function createTrackedEvent(organizer: { events: SupabaseEventRepository }, input: ReturnType<typeof tomorrowInput>) {
  const created = await organizer.events.createEvent(input);
  createdEvents.push({ id: created.id, events: organizer.events });
  return created;
}

/** Sagt alle im Test erstellten Treffen ab. Bereits abgesagte bleiben unverändert (idempotent). */
async function cancelCreatedEvents(): Promise<void> {
  const pending = createdEvents.splice(0);
  const results = await Promise.allSettled(pending.map(({ id, events }) => events.cancelEvent(id)));
  results.forEach((result, index) => {
    if (result.status === 'rejected') console.warn(`Testtreffen ${pending[index].id} konnte nicht abgesagt werden:`, result.reason);
  });
}

function tomorrowInput() {
  const start = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
  return { ...validInput, title: '[Test] Integrationstest Treffen', capacity: 2, minParticipants: 2, startsAt: start.toISOString(), endsAt: end.toISOString() };
}

describe.skipIf(!enabled)('F-01, F-17, F-18, F-22, F-23: Supabase-Datenzugriff gegen die echte Datenbank', () => {
  afterEach(cancelCreatedEvents, 30_000);

  it('F-22 AK1: Beitritt, Vollstand, Rückzug und Absage mit Rechteprüfung', async () => {
    const organizer = await registerThrowawayAccount('orga');
    const member = await registerThrowawayAccount('mitglied');
    expect(await organizer.auth.getCurrentUser()).toMatchObject({ id: organizer.user.id, displayName: 'Test orga' });

    // F-17 AK1: Organisator belegt den ersten Platz.
    const created = await createTrackedEvent(organizer, tomorrowInput());
    expect(created).toMatchObject({ participantCount: 1, isViewerOrganizer: true, isViewerParticipant: true, organizerName: 'Test orga' });

    // F-22 AK1 + AK3: Beitritt, Wiederholung ändert nichts, danach ausgebucht.
    expect(await member.events.joinEvent(created.id)).toMatchObject({ participantCount: 2, isViewerParticipant: true });
    expect((await member.events.joinEvent(created.id)).participantCount).toBe(2);
    const guestView = await new SupabaseEventRepository(createIsolatedClient()).getEvent(created.id);
    expect(guestView && summarizePlaces(guestView).full).toBe(true);
    expect(guestView?.isViewerParticipant).toBe(false);

    // F-20 AK1/AK2: Namen nur für Mitglieder.
    expect((await organizer.events.listParticipants(created.id)).map((entry) => entry.displayName)).toEqual(['Test orga', 'Test mitglied']);
    expect(await new SupabaseEventRepository(createIsolatedClient()).listParticipants(created.id)).toEqual([]);

    // F-24 AK1: Meine Treffen.
    const mine = await member.events.listEvents({ query: '', sports: [], level: '', ageGroup: '', period: '', date: '', mine: true });
    expect(mine.map((event) => event.id)).toContain(created.id);

    // F-23 AK1: Rückzug gibt den Platz frei.
    expect(await member.events.leaveEvent(created.id)).toMatchObject({ participantCount: 1, isViewerParticipant: false });

    // F-18 AK3: Fremde dürfen weder per RPC noch per direktem Update absagen.
    await expect(member.events.cancelEvent(created.id)).rejects.toThrow('Nur die organisierende Person darf das Treffen absagen.');
    await member.client.from('events').update({ status: 'cancelled' }).eq('id', created.id);
    expect((await member.events.getEvent(created.id))?.status).toBe('published');

    // F-18 AK1/AK2: Organisator sagt ab, danach ist kein Beitritt mehr möglich.
    expect((await organizer.events.cancelEvent(created.id)).status).toBe('cancelled');
    await expect(member.events.joinEvent(created.id)).rejects.toThrow('Das Treffen ist abgesagt.');
    expect((await member.events.listEvents()).map((event) => event.id)).not.toContain(created.id);

    // Abmelden erst nach dem Aufräumen, damit afterEach noch als Organisator absagen kann.
    await cancelCreatedEvents();
    await organizer.auth.signOut();
    expect(await organizer.auth.getCurrentUser()).toBeNull();
  }, 30_000);

  it('F-22 AK2: lehnt Beitritt bei vollem Treffen ab (EVENT_FULL)', async () => {
    const organizer = await registerThrowawayAccount('orga');
    const member = await registerThrowawayAccount('mitglied');
    const created = await createTrackedEvent(organizer, { ...tomorrowInput(), capacity: 2 });
    await member.events.joinEvent(created.id);
    // Für "voll" braucht es eine dritte Person, weil Organisator und Mitglied die zwei Plätze belegen.
    const outsider = await registerThrowawayAccount('dritte');
    await expect(outsider.events.joinEvent(created.id)).rejects.toThrow('Leider gerade ausgebucht.');
  }, 30_000);
});
