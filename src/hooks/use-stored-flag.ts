'use client';
// Merkt sich ein Ja/Nein im localStorage (z. B. "Hinweis weggeklickt"); ohne Speicher gilt der Startwert (F-31).
import { useCallback, useSyncExternalStore } from 'react';

const listeners = new Set<() => void>();

function readFlag(key: string): boolean {
  try {
    return window.localStorage.getItem(key) === '1';
  } catch {
    return false;
  }
}

/**
 * Liefert einen gespeicherten Schalter und eine Funktion zum Setzen.
 * Eingaben: Schlüssel, Wert auf dem Server (vor dem Laden im Browser). Rückgabe: `[wert, setzen]`.
 * Feature: F-31
 */
export function useStoredFlag(key: string, serverValue: boolean): [boolean, () => void] {
  const value = useSyncExternalStore(
    (onChange) => {
      listeners.add(onChange);
      return () => listeners.delete(onChange);
    },
    () => readFlag(key),
    () => serverValue,
  );
  const setFlag = useCallback(() => {
    try {
      window.localStorage.setItem(key, '1');
    } catch {
      // Ohne Speicher (privates Fenster) gilt der Schalter nur bis zum Neuladen nicht; kein Fehler für die Nutzerin.
    }
    listeners.forEach((listener) => listener());
  }, [key]);
  return [value, setFlag];
}
