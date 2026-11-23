'use client';
// Wechselnde Zeile im Hero, je Sportart ein Satz; gleitet ruhig weiter, bei reduzierter Bewegung steht sie (F-31).
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useState } from 'react';
import { SportIcon } from '@/components/event/sport-icon';
import type { Sport } from '@/lib/events/event-model';
import styles from './landing.module.css';

const lines: Array<{ sport: Sport; text: string }> = [
  { sport: 'Fußball', text: 'Zusammen auf den Platz.' },
  { sport: 'Volleyball', text: 'Ein Team. Viele gute Bälle.' },
  { sport: 'Basketball', text: 'Zeit für ein paar Körbe.' },
  { sport: 'Badminton', text: 'Einfach den Ball ins Spiel bringen.' },
];

const lineDuration = 3200;

/**
 * Sportzeile unter der Hauptüberschrift.
 * Rückgabe: Absatz mit Sport-Icon und Satz; wechselt alle 3,2 s, außer bei reduzierter Bewegung.
 * Feature: F-31
 */
export function HeroSportLine() {
  const reduceMotion = Boolean(useReducedMotion());
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % lines.length), lineDuration);
    return () => window.clearInterval(timer);
  }, [reduceMotion]);

  const line = lines[reduceMotion ? 0 : index];
  return (
    <p className={styles.sportLine}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={line.sport}
          className={styles.sportLineInner}
          initial={{ opacity: 0, y: '40%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '-40%' }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        >
          <SportIcon sport={line.sport} size={22} className={styles.sportLineIcon} />
          <span data-testid="hero-sport-line">{line.text}</span>
        </motion.span>
      </AnimatePresence>
    </p>
  );
}
