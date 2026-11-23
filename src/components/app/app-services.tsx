'use client';
// Stellt allen Seiten Datenzugriff, Anmeldung, angemeldete Person und ein Änderungssignal bereit (F-01, F-32).
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { AuthGateway, AuthUser } from '@/lib/data/auth-gateway';
import { createDataServices, type DataMode } from '@/lib/data/data-services';
import type { EventRepository } from '@/lib/data/event-repository';

/** Was Komponenten über `useAppServices` erhalten. */
export type AppServicesValue = {
  events: EventRepository;
  auth: AuthGateway;
  mode: DataMode;
  /** Angemeldete Person, `null` für Gäste. */
  user: AuthUser | null;
  /** `false`, solange noch nicht feststeht, ob jemand angemeldet ist. */
  authReady: boolean;
  /** Zählt Datenänderungen (Teilnahme, Absage, neues Treffen), damit Listen neu laden. */
  dataVersion: number;
  notifyDataChanged: () => void;
};

const AppServicesContext = createContext<AppServicesValue | null>(null);

/**
 * Erzeugt die Dienste einmal im Browser und verfolgt die Anmeldung.
 * Eingaben: Kinder. Rückgabe: Context-Provider.
 * Feature: F-01
 */
export function AppServicesProvider({ children }: { children: ReactNode }) {
  const [services] = useState(createDataServices);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [dataVersion, setDataVersion] = useState(0);

  useEffect(() => {
    let active = true;
    services.auth
      .getCurrentUser()
      .then((current) => {
        if (!active) return;
        setUser(current);
        setAuthReady(true);
      })
      .catch(() => active && setAuthReady(true));
    const unsubscribe = services.auth.onAuthChange((next) => {
      setUser(next);
      setAuthReady(true);
      setDataVersion((version) => version + 1);
    });
    return () => {
      active = false;
      unsubscribe();
    };
  }, [services]);

  const notifyDataChanged = useCallback(() => setDataVersion((version) => version + 1), []);

  const value = useMemo<AppServicesValue>(
    () => ({ ...services, user, authReady, dataVersion, notifyDataChanged }),
    [services, user, authReady, dataVersion, notifyDataChanged],
  );
  return <AppServicesContext.Provider value={value}>{children}</AppServicesContext.Provider>;
}

/**
 * Liefert die Dienste der App.
 * Rückgabe: siehe `AppServicesValue`. Fehler: wirft, wenn kein `AppServicesProvider` darüber liegt.
 * Feature: F-01
 */
export function useAppServices(): AppServicesValue {
  const value = useContext(AppServicesContext);
  if (!value) throw new Error('useAppServices braucht einen AppServicesProvider.');
  return value;
}
