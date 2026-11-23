'use client';
// Rahmen für Inhaltsseiten ohne Karte: Abstand zu Demo-Hinweis, Tab-Leiste und linker Leiste, sanftes Einblenden (F-05).
import { motion, useReducedMotion } from 'motion/react';
import { Suspense, type ReactNode } from 'react';
import styles from './page-frame.module.css';

/**
 * Inhaltsbereich einer Seite.
 * Eingaben: Inhalt, optional schmale Breite. Rückgabe: `<main>`.
 * Feature: F-05
 */
export function PageFrame({ children, narrow = false }: { children: ReactNode; narrow?: boolean }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.main
      className={styles.frame}
      data-narrow={narrow}
      initial={reduceMotion ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Inhalte hängen von Browserdaten und der aktuellen Uhrzeit ab; sie werden darum erst im Browser gerendert. */}
      <Suspense fallback={null}>{children}</Suspense>
    </motion.main>
  );
}
