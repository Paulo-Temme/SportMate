'use client';
// Bestätigungsdialog für folgenreiche Aktionen wie Absagen oder Teilnahme zurückziehen (F-18, F-23).
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useId, useRef, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import styles from './confirm-dialog.module.css';

const subscribeNever = () => () => {};

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  tone?: 'danger' | 'neutral';
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

/**
 * Modaler Dialog mit "Abbrechen" und einer Bestätigung. Escape und Hintergrund brechen ab; der Fokus startet bei "Abbrechen".
 * Eingaben: offen, Texte, Ton, ob beschäftigt, Callbacks. Rückgabe: Dialog oder nichts.
 * Feature: F-18, F-23
 */
export function ConfirmDialog({ open, title, description, confirmLabel, tone = 'danger', busy = false, onConfirm, onCancel }: ConfirmDialogProps) {
  const reduceMotion = useReducedMotion();
  const cancelButton = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const inBrowser = useSyncExternalStore(subscribeNever, () => true, () => false);

  useEffect(() => {
    if (!open) return;
    cancelButton.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => event.key === 'Escape' && onCancel();
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [open, onCancel]);

  // Portal an <body>: Das Sheet ist per transform verschoben und würde "position: fixed" sonst einfangen.
  if (!inBrowser) return null;
  return createPortal(
    <AnimatePresence>
      {open && (
        <div className={styles.layer}>
          <motion.div className={styles.backdrop} onClick={onCancel} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          <motion.div
            className={styles.dialog}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            initial={reduceMotion ? false : { opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 500, damping: 36 }}
          >
            <h2 id={titleId} className={styles.title}>
              {title}
            </h2>
            <p id={descriptionId} className={styles.description}>
              {description}
            </p>
            <div className={styles.actions}>
              <button ref={cancelButton} type="button" className={styles.cancel} onClick={onCancel}>
                Abbrechen
              </button>
              <button type="button" className={styles.confirm} data-tone={tone} onClick={onConfirm} disabled={busy}>
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
