'use client';
// App-Rahmen: Dienste, Toasts, Demo-Hinweis und Navigation um alle Seiten; die Startseite hat keine Navigation (F-05, F-31, F-32).
import { usePathname } from 'next/navigation';
import { Suspense, type ReactNode } from 'react';
import { AppNavigation } from '@/components/navigation/app-navigation';
import { AppServicesProvider, useAppServices } from './app-services';
import { ToastProvider } from './toast-provider';
import styles from './app-shell.module.css';

// Die Startseite hat einen eigenen Kopf statt Tab-Leiste und Seitenleiste. Der Pfad wird in einer
// Suspense-Grenze gelesen, damit dynamische Routen nicht am ganzen App-Rahmen warten.
function RouteNavigation() {
  return usePathname() === '/' ? null : <AppNavigation />;
}

function ShellFrame({ children }: { children: ReactNode }) {
  const { mode } = useAppServices();
  const demo = mode === 'local';
  return (
    <div className={styles.shell} data-demo={demo}>
      {demo && (
        <p className={styles.demoBanner} data-testid="demo-banner">
          Demo-Modus – Beispieldaten, Änderungen gehen beim Neuladen verloren
        </p>
      )}
      {children}
      <Suspense fallback={null}>
        <RouteNavigation />
      </Suspense>
    </div>
  );
}

/**
 * Umschließt jede Seite mit Diensten, Toasts, Demo-Hinweis (nur lokaler Modus) und Navigation (außer auf der Startseite).
 * Eingaben: Seiteninhalt. Rückgabe: App-Rahmen.
 * Feature: F-05, F-31, F-32
 */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <AppServicesProvider>
      <ToastProvider>
        <ShellFrame>{children}</ShellFrame>
      </ToastProvider>
    </AppServicesProvider>
  );
}
