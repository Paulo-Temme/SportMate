import { describe, expect, it } from 'vitest';
import { LocalEventRepository } from './local-event-repository';
import { createEventRepository, readSupabaseEnvironment, toSupabaseConfig } from './repository-factory';
import { SupabaseEventRepository } from './supabase-event-repository';

describe('F-00 AK7: Auswahl des Datenzugriffs', () => {
  it('F-00 AK7: nutzt Supabase nur, wenn URL und Schlüssel gesetzt sind', () => {
    const repository = createEventRepository({ url: 'https://beispiel.supabase.co', anonKey: 'oeffentlicher-schluessel' });
    expect(repository).toBeInstanceOf(SupabaseEventRepository);
    expect((repository as SupabaseEventRepository).config).toEqual({
      url: 'https://beispiel.supabase.co',
      anonKey: 'oeffentlicher-schluessel',
    });
  });

  it.each([
    {},
    { url: 'https://beispiel.supabase.co' },
    { anonKey: 'schluessel' },
    { url: '  ', anonKey: 'schluessel' },
    { url: 'https://beispiel.supabase.co', anonKey: '' },
  ])('F-00 AK7: fällt ohne vollständige Konfiguration auf den lokalen Speicher zurück: %j', (environment) => {
    expect(toSupabaseConfig(environment)).toBeNull();
    expect(createEventRepository(environment)).toBeInstanceOf(LocalEventRepository);
  });

  it('F-00 AK7: läuft ohne .env-Datei im lokalen Modus', () => {
    const environment = readSupabaseEnvironment();
    if (!toSupabaseConfig(environment)) expect(createEventRepository()).toBeInstanceOf(LocalEventRepository);
    expect(Object.keys(environment)).toEqual(['url', 'anonKey']);
  });

  it('F-00 AK7: der Supabase-Platzhalter meldet ehrlich, dass er noch nicht umgesetzt ist', async () => {
    const repository = new SupabaseEventRepository({ url: 'https://beispiel.supabase.co', anonKey: 'schluessel' });
    await expect(repository.listEvents()).rejects.toThrow('noch nicht umgesetzt');
    await expect(repository.getCurrentUserId()).rejects.toThrow('noch nicht umgesetzt');
  });
});
