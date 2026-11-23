'use client';
// Liest eine CSS-Media-Query im Browser; auf dem Server gilt der mobile Fall (F-05).
import { useSyncExternalStore } from 'react';

/**
 * Meldet, ob eine Media-Query zutrifft, und aktualisiert sich bei Änderung.
 * Eingaben: Query wie "(min-width: 1024px)". Rückgabe: `true`/`false`; auf dem Server `false`.
 * Feature: F-05
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener('change', onChange);
      return () => list.removeEventListener('change', onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}
