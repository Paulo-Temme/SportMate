'use client';
// MapLibre-Karte für die Ortswahl: die Karte wird unter der festen Nadel verschoben, die Mitte ist der Treffpunkt (F-17).
import 'maplibre-gl/dist/maplibre-gl.css';
import { useEffect, useRef } from 'react';
import type { GeoPoint } from '@/lib/events/event-model';
import { createThemedMap } from './themed-map';
import styles from './location-picker.module.css';

type LocationPickerMapProps = { initial: GeoPoint; onChange: (point: GeoPoint) => void; onUnavailable: () => void };

/**
 * Karte, deren Mittelpunkt nach jeder Bewegung gemeldet wird.
 * Eingaben: Startpunkt, Callback mit neuem Mittelpunkt, Callback bei Ausfall. Rückgabe: Kartenfläche.
 * Feature: F-17
 */
export default function LocationPickerMap({ initial, onChange, onUnavailable }: LocationPickerMapProps) {
  const container = useRef<HTMLDivElement>(null);
  const callbacks = useRef({ onChange, onUnavailable });
  const start = useRef(initial);
  useEffect(() => {
    callbacks.current = { onChange, onUnavailable };
  }, [onChange, onUnavailable]);

  useEffect(() => {
    if (!container.current) return;
    let map: ReturnType<typeof createThemedMap>;
    try {
      map = createThemedMap(container.current, start.current, 15, () => callbacks.current.onUnavailable());
    } catch {
      callbacks.current.onUnavailable();
      return;
    }
    map.on('moveend', () => {
      const center = map.getCenter();
      callbacks.current.onChange({ latitude: Number(center.lat.toFixed(6)), longitude: Number(center.lng.toFixed(6)) });
    });
    return () => map.remove();
  }, []);

  return <div ref={container} className={styles.canvas} />;
}
