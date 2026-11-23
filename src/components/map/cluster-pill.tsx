'use client';
// Gruppen-Marker im Stil der Marker-Pille: Anzahl im dunklen Kreis und "Treffen"; Klick vergrößert auf die Gruppe (F-08).
import { motion, useReducedMotion } from 'motion/react';
import type { MapClusterItem } from './map-marker-item';
import styles from './marker-pill.module.css';

type ClusterPillProps = { cluster: MapClusterItem; onExpand: (cluster: MapClusterItem) => void };

/**
 * Zeigt mehrere Treffen an einer Stelle als einen Button mit Anzahl.
 * Eingaben: Gruppe, Callback zum Auffächern. Rückgabe: Button-Element (mindestens 44 px Trefferfläche).
 * Feature: F-08
 */
export function ClusterPill({ cluster, onExpand }: ClusterPillProps) {
  const reduceMotion = useReducedMotion();
  const count = cluster.ids.length;
  return (
    <motion.button
      type="button"
      className={styles.marker}
      data-state="cluster"
      data-testid="map-cluster"
      data-count={count}
      data-event-ids={cluster.ids.join(' ')}
      aria-label={`${count} Treffen an dieser Stelle, vergrößern`}
      onClick={(event) => {
        event.stopPropagation();
        onExpand(cluster);
      }}
      whileTap={reduceMotion ? undefined : { scale: 0.94 }}
    >
      <span className={styles.pill} data-part="pill">
        <span className={`${styles.icon} ${styles.count} tabular`}>{count}</span>
        <span className={styles.time}>Treffen</span>
      </span>
      <span className={styles.tip} aria-hidden="true" />
    </motion.button>
  );
}
