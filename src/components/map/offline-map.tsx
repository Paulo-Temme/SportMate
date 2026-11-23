'use client';
// Ersatzkarte ohne Netz, ohne WebGL oder in Tests: neutrale Fläche mit Raster und Markern an relativen Positionen (F-08).
import { WifiOff } from 'lucide-react';
import type { MapMarkerItem } from './map-marker-item';
import { MarkerPill } from './marker-pill';
import styles from './event-map.module.css';

type OfflineMapProps = { markers: MapMarkerItem[]; onSelectMarker: (id: string) => void };

type Bounds = { minLat: number; maxLat: number; minLng: number; maxLng: number };

function findBounds(markers: MapMarkerItem[]): Bounds {
  const lats = markers.map((item) => item.latitude);
  const lngs = markers.map((item) => item.longitude);
  return { minLat: Math.min(...lats), maxLat: Math.max(...lats), minLng: Math.min(...lngs), maxLng: Math.max(...lngs) };
}

function toRelative(value: number, min: number, max: number): number {
  return max - min < 1e-9 ? 0.5 : (value - min) / (max - min);
}

/**
 * Zeigt die Marker ohne Kartenkacheln, deutlich als "Karte offline" gekennzeichnet.
 * Eingaben: Marker, Auswahl-Callback. Rückgabe: Ersatzfläche; die Liste bleibt die vollständige Alternative.
 * Feature: F-08
 */
export function OfflineMap({ markers, onSelectMarker }: OfflineMapProps) {
  const bounds = markers.length > 0 ? findBounds(markers) : null;
  return (
    <div className={styles.offline} data-map-mode="offline" role="region" aria-label="Karte offline">
      <svg className={styles.grid} aria-hidden="true">
        <defs>
          <pattern id="offline-grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M48 0H0V48" fill="none" stroke="var(--line)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#offline-grid)" />
      </svg>
      <p className={styles.offlineBadge}>
        <WifiOff size={14} aria-hidden="true" />
        <span>Karte offline</span>
        <span className={styles.offlineHint}>Karte nicht verfügbar, die Liste zeigt alle Treffer.</span>
      </p>
      {bounds &&
        markers.map((item) => {
          const x = 12 + 76 * toRelative(item.longitude, bounds.minLng, bounds.maxLng);
          const y = 24 + 34 * (1 - toRelative(item.latitude, bounds.minLat, bounds.maxLat));
          return (
            <div
              key={item.id}
              className={styles.offlineMarker}
              style={{ left: `${x}%`, top: `${y}%`, zIndex: item.state === 'selected' ? 2 : 1 }}
            >
              <MarkerPill item={item} onSelect={onSelectMarker} />
            </div>
          );
        })}
    </div>
  );
}
