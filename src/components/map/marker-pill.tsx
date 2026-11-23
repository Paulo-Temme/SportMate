'use client';
// Weiße Marker-Pille mit Sport-Icon und Uhrzeit; ausgewählt in Akzentfarbe mit Federanimation, ausgebucht gedämpft (F-08).
import { motion, useReducedMotion } from 'motion/react';
import { SportIcon } from '@/components/event/sport-icon';
import type { MapMarkerItem } from './map-marker-item';
import styles from './marker-pill.module.css';

type MarkerPillProps = { item: MapMarkerItem; onSelect: (id: string) => void };

/**
 * Zeigt einen Marker als Button. Klick wählt das Treffen aus.
 * Eingaben: Markerdaten, Auswahl-Callback. Rückgabe: Button-Element (mindestens 44 px Trefferfläche).
 * Feature: F-08
 */
export function MarkerPill({ item, onSelect }: MarkerPillProps) {
  const reduceMotion = useReducedMotion();
  const selected = item.state === 'selected';
  return (
    <motion.button
      type="button"
      className={styles.marker}
      data-state={item.state}
      data-testid="map-marker"
      data-event-id={item.id}
      aria-label={item.accessibleLabel}
      aria-pressed={selected}
      onClick={(event) => {
        event.stopPropagation();
        onSelect(item.id);
      }}
      initial={false}
      animate={{ scale: selected ? 1.12 : 1, y: selected ? -4 : 0 }}
      transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 520, damping: 22 }}
      whileTap={reduceMotion ? undefined : { scale: 0.94 }}
    >
      <span className={styles.pill}>
        <span className={styles.icon}>
          <SportIcon sport={item.sport} size={14} />
        </span>
        <span className={styles.time}>{item.timeLabel}</span>
      </span>
      <span className={styles.tip} aria-hidden="true" />
    </motion.button>
  );
}
