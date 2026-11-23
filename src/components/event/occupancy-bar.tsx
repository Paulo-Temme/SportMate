// Feine Belegungslinie: belegter Anteil der Plätze als 1-px-präzise Leiste, rein dekorativ (F-05).
import styles from './occupancy-bar.module.css';

/**
 * Zeigt die Belegung als Linie. Der Text daneben trägt die Information; die Linie ist `aria-hidden`.
 * Eingaben: belegte Plätze, Kapazität. Rückgabe: Leiste.
 * Feature: F-05
 */
export function OccupancyBar({ taken, capacity, wide = false }: { taken: number; capacity: number; wide?: boolean }) {
  const ratio = capacity > 0 ? Math.min(1, Math.max(0, taken / capacity)) : 0;
  return (
    <span className={styles.track} data-wide={wide} data-full={ratio >= 1} aria-hidden="true">
      <span className={styles.fill} style={{ transform: `scaleX(${ratio})` }} />
    </span>
  );
}
