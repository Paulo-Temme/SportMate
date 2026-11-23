'use client';
// Weiße Marker-Pille mit Sport-Icon und Uhrzeit; ausgewählt in Akzentfarbe mit Federanimation, ausgebucht gedämpft (F-08).
import { motion, useReducedMotion } from 'motion/react';
import { SportIcon } from '@/components/event/sport-icon';
import type { Sport } from '@/lib/events/event-model';
import type { MapMarkerItem } from './map-marker-item';
import styles from './marker-pill.module.css';

/**
 * Inhalt einer Marker-Pille (Pille mit Sport-Icon und Uhrzeit, darunter die Spitze), ohne Bedienelement drumherum.
 * Den Zustand (ausgewählt, ausgebucht) setzt das umgebende Element mit `styles.marker` und `data-state`.
 * Eingaben: Sportart, Uhrzeit. Rückgabe: Pille und Spitze.
 * Feature: F-08, F-31
 */
export function MarkerPillFace({ sport, timeLabel }: { sport: Sport; timeLabel: string }) {
  return (
    <>
      <span className={styles.pill} data-part="pill">
        <span className={styles.icon}>
          <SportIcon sport={sport} size={14} />
        </span>
        <span className={styles.time}>{timeLabel}</span>
      </span>
      <span className={styles.tip} aria-hidden="true" />
    </>
  );
}

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
      <MarkerPillFace sport={item.sport} timeLabel={item.timeLabel} />
    </motion.button>
  );
}
