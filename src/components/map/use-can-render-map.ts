'use client';
// Entscheidet, ob eine echte Karte möglich ist: nicht im Offline-Modus (Tests), mit Netz und mit WebGL (F-08).
import { useSyncExternalStore } from 'react';

let webGlSupport: boolean | undefined;

// Einmal prüfen und merken: jeder Aufruf legte sonst einen neuen WebGL-Kontext an.
function detectWebGl(): boolean {
  if (webGlSupport !== undefined) return webGlSupport;
  try {
    const canvas = document.createElement('canvas');
    webGlSupport = Boolean(canvas.getContext('webgl2') ?? canvas.getContext('webgl'));
  } catch {
    webGlSupport = false;
  }
  return webGlSupport;
}

function isOfflineConfigured(): boolean {
  return process.env.NEXT_PUBLIC_MAP_MODE === 'offline';
}

const subscribeNever = () => () => {};

/**
 * Meldet, ob MapLibre geladen werden soll.
 * Rückgabe: `false` bei `NEXT_PUBLIC_MAP_MODE=offline`, ohne Netz oder ohne WebGL; auf dem Server nur abhängig vom Modus.
 * Feature: F-08
 */
export function useCanRenderMap(): boolean {
  return useSyncExternalStore(
    subscribeNever,
    () => !isOfflineConfigured() && navigator.onLine && detectWebGl(),
    () => !isOfflineConfigured(),
  );
}
