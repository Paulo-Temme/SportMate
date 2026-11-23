// Wählt den Datenzugriff: Supabase, wenn beide Umgebungsvariablen gesetzt sind, sonst lokal im Browser (F-00).
import type { EventRepository } from './event-repository';
import { LocalEventRepository, type KeyValueStorage } from './local-event-repository';
import { SupabaseEventRepository, type SupabaseConfig } from './supabase-event-repository';

/** Rohwerte der Umgebungsvariablen; fehlende Werte sind `undefined`. */
export type SupabaseEnvironment = { url?: string; anonKey?: string };

/**
 * Liest die öffentlichen Supabase-Variablen. Next.js setzt sie nur bei wörtlichem Zugriff
 * auf `process.env.NEXT_PUBLIC_...` in den Browser-Code ein, deshalb kein dynamischer Zugriff.
 * Rückgabe: Rohwerte, eventuell leer.
 * Feature: F-00
 */
export function readSupabaseEnvironment(): SupabaseEnvironment {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  };
}

/**
 * Prüft, ob Supabase vollständig konfiguriert ist.
 * Eingaben: Rohwerte. Rückgabe: Verbindungsdaten oder `null`, wenn ein Wert fehlt oder nur Leerzeichen enthält.
 * Feature: F-00
 */
export function toSupabaseConfig(environment: SupabaseEnvironment): SupabaseConfig | null {
  const url = environment.url?.trim() ?? '';
  const anonKey = environment.anonKey?.trim() ?? '';
  return url && anonKey ? { url, anonKey } : null;
}

function findBrowserStorage(): KeyValueStorage | undefined {
  return typeof window === 'undefined' ? undefined : window.localStorage;
}

/**
 * Erzeugt den passenden Datenzugriff.
 * Eingaben: Umgebungswerte (Standard: aus `process.env`), optional ein Speicher für den lokalen Modus
 * (Standard: localStorage im Browser, sonst Arbeitsspeicher).
 * Rückgabe: `SupabaseEventRepository` bei vollständiger Konfiguration, sonst `LocalEventRepository`.
 * Feature: F-00
 */
export function createEventRepository(
  environment: SupabaseEnvironment = readSupabaseEnvironment(),
  storage: KeyValueStorage | undefined = findBrowserStorage(),
): EventRepository {
  const config = toSupabaseConfig(environment);
  return config ? new SupabaseEventRepository(config) : new LocalEventRepository({ storage });
}
