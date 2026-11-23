'use client';
// Kleiner Erstbesuch-Hinweis, worum es bei SportMate geht; wegklickbar und gemerkt (F-31).
import { X } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import Link from 'next/link';
import { useStoredFlag } from '@/hooks/use-stored-flag';
import styles from './first-visit-hint.module.css';

const storageKey = 'sportmate.erstbesuch-hinweis-gelesen';
const steps = ['Sportart auswählen', 'Treffen finden', 'Gemeinsam Sport machen'];

/**
 * Erklärt in einem Satz und drei Schritten, was SportMate ist. Nach "Verstanden" erscheint er nicht wieder.
 * Rückgabe: Hinweisbox oder nichts.
 * Feature: F-31
 */
export function FirstVisitHint() {
  const [dismissed, dismiss] = useStoredFlag(storageKey, true);
  const reduceMotion = useReducedMotion();
  return (
    <AnimatePresence initial={false}>
      {!dismissed && (
        <motion.aside
          className={styles.hint}
          aria-labelledby="erstbesuch-titel"
          initial={reduceMotion ? false : { opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className={styles.inner}>
            <div className={styles.head}>
              <h2 id="erstbesuch-titel" className={styles.title}>
                Sporttreffen in Flensburg – offen für alle
              </h2>
              <button type="button" className={styles.close} onClick={dismiss} aria-label="Hinweis schließen">
                <X size={18} aria-hidden="true" />
              </button>
            </div>
            <p className={styles.text}>Leute finden, die gerade das Gleiche spielen wollen. Ohne Verein, ohne Gruppenchat.</p>
            <ol className={styles.steps}>
              {steps.map((step, index) => (
                <li key={step}>
                  <span className={`${styles.number} tabular`}>{index + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
            <div className={styles.actions}>
              <button type="button" className={styles.primary} onClick={dismiss}>
                Treffen entdecken
              </button>
              <Link href="/erstellen" className={styles.secondary}>
                Treffen erstellen
              </Link>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
