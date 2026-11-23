import { describe, expect, it } from 'vitest';
import { validInput } from '../../../tests/fixtures/sample-events';
import { buildDataServices, buildLocalServices, createDataServices } from './data-services';
import { createMemoryStorage } from './key-value-storage';
import { LocalAuthGateway } from './local-auth-gateway';
import { LocalEventRepository } from './local-event-repository';
import { SupabaseAuthGateway } from './supabase-auth-gateway';
import { readSupabaseEnvironment, toSupabaseConfig } from './supabase-client';
import { SupabaseEventRepository } from './supabase-event-repository';

describe('F-32: Auswahl von Datenzugriff und Anmeldung', () => {
  it('F-32 AK4: nutzt Supabase nur, wenn URL und Schlüssel gesetzt sind', () => {
    const services = buildDataServices({ url: 'https://beispiel.supabase.co', anonKey: 'oeffentlicher-schluessel' });
    expect(services.mode).toBe('supabase');
    expect(services.events).toBeInstanceOf(SupabaseEventRepository);
    expect(services.auth).toBeInstanceOf(SupabaseAuthGateway);
    expect(services.auth.listDemoAccounts()).toEqual([]);
  });

  it.each([
    {},
    { url: 'https://beispiel.supabase.co' },
    { anonKey: 'schluessel' },
    { url: '  ', anonKey: 'schluessel' },
    { url: 'https://beispiel.supabase.co', anonKey: '' },
  ])('F-32 AK1: fällt ohne vollständige Konfiguration auf den lokalen Modus zurück: %j', (environment) => {
    expect(toSupabaseConfig(environment)).toBeNull();
    const services = buildDataServices(environment);
    expect(services.mode).toBe('local');
    expect(services.events).toBeInstanceOf(LocalEventRepository);
    expect(services.auth).toBeInstanceOf(LocalAuthGateway);
  });

  it('F-32 AK1: läuft ohne .env-Datei im lokalen Modus', () => {
    const environment = readSupabaseEnvironment();
    expect(Object.keys(environment)).toEqual(['url', 'anonKey']);
    if (!toSupabaseConfig(environment)) expect(createDataServices().mode).toBe('local');
  });

  it('F-01: lokales Repository und lokale Anmeldung teilen die angemeldete Person', async () => {
    const { events, auth } = buildLocalServices({ events: createMemoryStorage(), persistent: createMemoryStorage() });
    expect(await events.getCurrentUserId()).toBeNull();
    await auth.signInAsDemo('lea');
    expect(await events.getCurrentUserId()).toBe('lea');
    expect((await events.createEvent(validInput)).organizerName).toBe('Lea');
    await auth.signOut();
    expect(await events.getCurrentUserId()).toBeNull();
  });

  it('F-32 AK3: Treffen starten nach Neuladen frisch, die Anmeldung bleibt', async () => {
    const persistent = createMemoryStorage();
    const first = buildDataServices({}, persistent);
    await first.auth.signInAsDemo('lea');
    await first.events.joinEvent('demo-badminton-halle');
    const reloaded = buildDataServices({}, persistent);
    expect(await reloaded.events.getCurrentUserId()).toBe('lea');
    expect((await reloaded.events.getEvent('demo-badminton-halle'))?.participantCount).toBe(1);
  });
});
