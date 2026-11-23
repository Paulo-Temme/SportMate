// Platzhalter der Entdecken-Ansicht beim ersten Rendern: neutrale Kartenfläche und Sheet-Andeutung (F-05).
import styles from './discover-skeleton.module.css';

/**
 * Zeigt Kartenfläche und ein angedeutetes Sheet, bis die Ansicht im Browser bereit ist.
 * Rückgabe: statischer Platzhalter ohne Spinner.
 * Feature: F-05
 */
export function DiscoverSkeleton() {
  return (
    <div className={styles.skeleton} aria-busy="true" aria-label="Entdecken wird geladen">
      <div className={styles.search} />
      <div className={styles.sheet} />
    </div>
  );
}
