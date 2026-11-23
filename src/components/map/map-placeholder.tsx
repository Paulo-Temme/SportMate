// Ruhige Platzhalterfläche in Kartenfarbe, solange die Vektorkarte lädt: blasses Raster und dezenter Hinweis (F-08).
import styles from './event-map.module.css';

/**
 * Zeigt bis zum ersten fertigen Kartenbild eine Fläche statt Leere.
 * Eingaben: ob die Karte bereit ist (dann blendet die Fläche aus). Rückgabe: Platzhalter-Element.
 * Feature: F-08
 */
export function MapPlaceholder({ ready = false }: { ready?: boolean }) {
  return (
    <div className={styles.placeholder} data-ready={ready} aria-hidden={ready}>
      <svg className={styles.placeholderGrid} aria-hidden="true">
        <defs>
          <pattern id="map-placeholder-grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M48 0H0V48" fill="none" stroke="var(--line)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#map-placeholder-grid)" />
      </svg>
      <p className={styles.placeholderHint} role="status">
        Karte wird geladen
      </p>
    </div>
  );
}
