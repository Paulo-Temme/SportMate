// Verbindung zu Supabase: Konfiguration aus Umgebungsvariablen und ein Client je Browser (F-01, ADR-0007).
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/** Verbindungsdaten zu Supabase aus `NEXT_PUBLIC_SUPABASE_URL` und `NEXT_PUBLIC_SUPABASE_ANON_KEY`. */
export type SupabaseConfig = { url: string; anonKey: string };

/** Rohwerte der Umgebungsvariablen; fehlende Werte sind `undefined`. */
export type SupabaseEnvironment = { url?: string; anonKey?: string };

let browserClient: SupabaseClient | undefined;

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

/**
 * Erzeugt einen neuen Supabase-Client. Die Sitzung speichert supabase-js im Browser (localStorage),
 * auf dem Server und in Tests im Arbeitsspeicher.
 * Eingaben: Verbindungsdaten. Rückgabe: neuer Client.
 * Feature: F-01
 */
export function createSupabaseClient(config: SupabaseConfig): SupabaseClient {
  return createClient(config.url, config.anonKey);
}

/**
 * Liefert im Browser immer denselben Client, damit es nur eine Sitzung gibt.
 * Eingaben: Verbindungsdaten (beim ersten Aufruf maßgeblich). Rückgabe: Client; außerhalb des Browsers jedes Mal neu.
 * Feature: F-01
 */
export function getSupabaseBrowserClient(config: SupabaseConfig): SupabaseClient {
  if (typeof window === 'undefined') return createSupabaseClient(config);
  browserClient ??= createSupabaseClient(config);
  return browserClient;
}
