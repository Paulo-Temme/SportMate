'use client';
// Fokusführung modaler Dialoge: Startfokus, Fokusfalle, Escape und Rückgabe des Fokus an den Auslöser (REV-05, REV-06).
import { useEffect, useRef, type RefObject } from 'react';
import { findTrapTarget } from '@/lib/ui/focus-trap';

const focusableSelector = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

type DialogFocusOptions = {
  open: boolean;
  container: RefObject<HTMLElement | null>;
  initialFocus?: RefObject<HTMLElement | null>;
  onEscape: () => void;
  /** Solange `true`, schließt Escape nicht (z. B. während eine Aktion läuft). */
  escapeBlocked?: boolean;
};

function trapTab(event: KeyboardEvent, container: HTMLElement): void {
  const focusable = [...container.querySelectorAll<HTMLElement>(focusableSelector)];
  const target = findTrapTarget(focusable.indexOf(document.activeElement as HTMLElement), focusable.length, event.shiftKey);
  if (target === null) return;
  event.preventDefault();
  (target >= 0 ? focusable[target] : container).focus();
}

/**
 * Führt den Fokus in einem geöffneten Dialog und gibt ihn beim Schließen an das vorher fokussierte Element zurück.
 * Eingaben: siehe `DialogFocusOptions`. Rückgabe: nichts.
 * Feature: F-18, F-06
 */
export function useDialogFocus({ open, container, initialFocus, onEscape, escapeBlocked = false }: DialogFocusOptions): void {
  const escapeRef = useRef({ onEscape, escapeBlocked });
  useEffect(() => {
    escapeRef.current = { onEscape, escapeBlocked };
  }, [onEscape, escapeBlocked]);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    (initialFocus?.current ?? container.current)?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !escapeRef.current.escapeBlocked) escapeRef.current.onEscape();
      if (event.key === 'Tab' && container.current) trapTab(event, container.current);
    };
    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('keydown', handleKey);
      previous?.focus();
    };
  }, [open, container, initialFocus]);
}
