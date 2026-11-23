// Stellt der Oberfläche Datenzugriff und Anmeldung bereit: Supabase, wenn konfiguriert, sonst lokal (F-01, F-32).
import type { AuthGateway } from './auth-gateway';
import type { EventRepository } from './event-repository';
import { createMemoryStorage, type KeyValueStorage } from './key-value-storage';
import { LocalAuthGateway } from './local-auth-gateway';
import { LocalEventRepository } from './local-event-repository';
import { LocalSession } from './local-session';
import { SupabaseAuthGateway } from './supabase-auth-gateway';
import { getSupabaseBrowserClient, readSupabaseEnvironment, toSupabaseConfig, type SupabaseEnvironment } from './supabase-client';
import { SupabaseEventRepository } from './supabase-event-repository';

/** Woher die Daten kommen. "local" zeigt die Oberfläche als Demo-Modus an. */
export type DataMode = 'local' | 'supabase';

/** Alles, was die Oberfläche für Daten und Anmeldung braucht. */
export interface DataServices {
  events: EventRepository;
  auth: AuthGateway;
  mode: DataMode;
}

/**
 * Speicher des lokalen Modus. Treffen liegen nur im Arbeitsspeicher, damit Neuladen den Ausgangszustand
 * wiederherstellt (F-32 AK3); Konten und Sitzung liegen in `persistent` (Browser: localStorage).
 */
export type LocalStorages = { events: KeyValueStorage; persistent: KeyValueStorage };

let browserServices: DataServices | undefined;

function findBrowserStorage(): KeyValueStorage | undefined {
  return typeof window === 'undefined' ? undefined : window.localStorage;
}

/**
 * Baut die lokalen Dienste. Repository und Anmeldung teilen dieselbe Sitzung (aktuelle Person).
 * Eingaben: Speicher. Rückgabe: Dienste im Modus "local", Start als Gast.
 * Feature: F-32
 */
export function buildLocalServices(storages: LocalStorages): DataServices {
  const session = new LocalSession(storages.persistent);
  return {
    events: new LocalEventRepository({ storage: storages.events, session }),
    auth: new LocalAuthGateway({ session, storage: storages.persistent }),
    mode: 'local',
  };
}

/**
 * Baut die Dienste passend zur Konfiguration.
 * Eingaben: Umgebungswerte, dauerhafter Speicher für den lokalen Modus (Standard: Arbeitsspeicher).
 * Rückgabe: Supabase-Dienste, wenn URL und Schlüssel gesetzt sind, sonst lokale Dienste.
 * Feature: F-01, F-32
 */
export function buildDataServices(
  environment: SupabaseEnvironment,
  persistent: KeyValueStorage = createMemoryStorage(),
): DataServices {
  const config = toSupabaseConfig(environment);
  if (!config) return buildLocalServices({ events: createMemoryStorage(), persistent });
  const client = getSupabaseBrowserClient(config);
  return { events: new SupabaseEventRepository(client), auth: new SupabaseAuthGateway(client), mode: 'supabase' };
}

/**
 * Liefert die Dienste der App. Im Browser immer dieselbe Instanz, damit alle Seiten dieselbe Person sehen.
 * Rückgabe: Dienste aus `process.env` und localStorage; auf dem Server jedes Mal neu (ohne Browser-Speicher).
 * Feature: F-01, F-32
 */
export function createDataServices(): DataServices {
  const persistent = findBrowserStorage();
  if (!persistent) return buildDataServices(readSupabaseEnvironment());
  browserServices ??= buildDataServices(readSupabaseEnvironment(), persistent);
  return browserServices;
}
