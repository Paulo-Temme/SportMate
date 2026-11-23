'use client';
// Startseite mit Daten: lädt kommende Treffen für die Vorschau und liest die angemeldete Person (F-31).
import { useAppServices } from '@/components/app/app-services';
import { useEventList } from '@/hooks/use-event-list';
import { emptyFilters } from '@/lib/events/event-model';
import { LandingView } from './landing-view';

/**
 * Verbindet die Startseite mit den Diensten der App: kommende Treffen nach Beginn und Anmeldestand.
 * Rückgabe: `LandingView`.
 * Feature: F-31
 */
export function LandingPage() {
  const { user, authReady } = useAppServices();
  const preview = useEventList(emptyFilters, 'chronological');
  return <LandingView preview={preview} viewer={{ ready: authReady, displayName: user?.displayName ?? null }} />;
}
