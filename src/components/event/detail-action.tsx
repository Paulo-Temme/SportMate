'use client';
// Hauptaktion der Detailansicht: Jetzt teilnehmen, Dabei mit Zurückziehen, Absagen für Organisatoren oder Ausgebucht (F-18, F-22, F-23).
import { Check } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import type { SportEvent } from '@/lib/events/event-model';
import { resolveJoinAction } from './join-action';
import styles from './detail-action.module.css';

type DetailActionProps = {
  event: SportEvent;
  now: Date;
  busy: boolean;
  onJoin: () => void;
  onLeave: () => void;
  onCancel: () => void;
};

/**
 * Zeigt die passende Hauptaktion zum Treffen.
 * Eingaben: Treffen, Zeitpunkt, ob eine Aktion läuft, Callbacks. Rückgabe: Aktionsbereich oder nichts (abgesagt).
 * Feature: F-22
 */
export function DetailAction({ event, now, busy, onJoin, onLeave, onCancel }: DetailActionProps) {
  const reduceMotion = useReducedMotion();
  const action = resolveJoinAction(event, now);
  const press = reduceMotion ? undefined : { scale: 0.97 };

  switch (action.kind) {
    case 'join':
      return (
        <motion.button type="button" className={styles.primary} onClick={onJoin} disabled={busy} whileTap={press}>
          Jetzt teilnehmen
        </motion.button>
      );
    case 'full':
      return (
        <button type="button" className={styles.disabled} disabled>
          Ausgebucht
        </button>
      );
    case 'joined':
      return (
        <div className={styles.joinedRow}>
          <motion.p
            className={styles.joined}
            initial={reduceMotion ? false : { scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 26 }}
          >
            <Check size={18} strokeWidth={2.5} aria-hidden="true" />
            Du bist dabei
          </motion.p>
          <button type="button" className={styles.secondary} onClick={onLeave} disabled={busy}>
            Teilnahme zurückziehen
          </button>
        </div>
      );
    case 'organizer':
      return (
        <div className={styles.joinedRow}>
          <p className={styles.joined}>
            <Check size={18} strokeWidth={2.5} aria-hidden="true" />
            Organisiert von dir
          </p>
          <button type="button" className={styles.danger} onClick={onCancel} disabled={busy}>
            Treffen absagen
          </button>
        </div>
      );
    case 'cancelled':
      return null;
    default:
      return <p className={styles.closed}>{action.label}</p>;
  }
}
