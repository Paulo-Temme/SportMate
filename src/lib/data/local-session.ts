// Angemeldete Person im lokalen Modus. Wird von LocalAuthGateway und LocalEventRepository geteilt (F-01, F-32).
import type { AuthUser } from '../auth/auth-user';
import { createMemoryStorage, readJson, type KeyValueStorage } from './key-value-storage';

const sessionKey = 'sportmate.session.v1';

function isAuthUser(value: unknown): value is AuthUser {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Partial<AuthUser>;
  return typeof candidate.id === 'string' && typeof candidate.displayName === 'string' && (candidate.email === null || typeof candidate.email === 'string');
}

/**
 * Hält die angemeldete Person im Speicher und benachrichtigt bei Änderungen. Startet als Gast.
 * Eingaben: Speicher (Standard: Arbeitsspeicher).
 * Feature: F-01, F-32
 */
export class LocalSession {
  private readonly storage: KeyValueStorage;
  private readonly listeners = new Set<(user: AuthUser | null) => void>();

  constructor(storage: KeyValueStorage = createMemoryStorage()) {
    this.storage = storage;
  }

  /** Angemeldete Person oder `null`. Beschädigte Daten gelten als Gast. */
  getUser(): AuthUser | null {
    return readJson(this.storage, sessionKey, isAuthUser);
  }

  /** Setzt die angemeldete Person (`null` = abmelden) und benachrichtigt alle Abonnenten. */
  setUser(user: AuthUser | null): void {
    this.storage.setItem(sessionKey, JSON.stringify(user));
    for (const listener of this.listeners) listener(user);
  }

  /** Abonniert Änderungen. Rückgabe: Funktion zum Abbestellen. */
  subscribe(listener: (user: AuthUser | null) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
}
