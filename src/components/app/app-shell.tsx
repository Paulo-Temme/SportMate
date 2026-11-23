'use client';
// App-Rahmen: Dienste, Toasts, Demo-Hinweis und Navigation um alle Seiten (F-05, F-32).
import type { ReactNode } from 'react';
import { AppNavigation } from '@/components/navigation/app-navigation';
import { AppServicesProvider, useAppServices } from './app-services';
import { ToastProvider } from './toast-provider';
import styles from './app-shell.module.css';

function ShellFrame({ children }: { children: ReactNode }) {
  const { mode } = useAppServices();
  const demo = mode === 'local';
  return (
    <div className={styles.shell} data-demo={demo}>
      {demo && (
        <p className={styles.demoBanner} data-testid="demo-banner">
          Demo-Modus – Beispieldaten, nichts wird gespeichert
        </p>
      )}
      {children}
      <AppNavigation />
    </div>
  );
}

/**
 * Umschließt jede Seite mit Diensten, Toasts, Demo-Hinweis (nur lokaler Modus) und Navigation.
 * Eingaben: Seiteninhalt. Rückgabe: App-Rahmen.
 * Feature: F-05, F-32
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
