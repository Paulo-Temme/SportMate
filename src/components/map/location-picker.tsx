'use client';
// Ortswahl mit fester Nadel in der Mitte; ohne Karte (offline/Test) bleibt der Startpunkt und der Treffpunkttext wird wichtiger (F-17).
import { MapPin, WifiOff } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import dynamic from 'next/dynamic';
import { useCallback, useState } from 'react';
import type { GeoPoint } from '@/lib/events/event-model';
import { useCanRenderMap } from './use-can-render-map';
import styles from './location-picker.module.css';

const LocationPickerMap = dynamic(() => import('./location-picker-map'), {
  ssr: false,
  loading: () => <div className={styles.canvas} aria-hidden="true" />,
});

type LocationPickerProps = { value: GeoPoint; onChange: (point: GeoPoint) => void; error?: string };

/**
 * Kartenausschnitt zum Festlegen des Treffpunkts. Die Nadel hüpft kurz, wenn ein neuer Punkt gewählt wurde.
 * Eingaben: aktueller Punkt, Änderungs-Callback, Fehlermeldung. Rückgabe: Kartenbereich mit Nadel.
 * Feature: F-17
 */
export function LocationPicker({ value, onChange, error }: LocationPickerProps) {
  const canRenderMap = useCanRenderMap();
  const [failed, setFailed] = useState(false);
  const [moves, setMoves] = useState(0);
  const reduceMotion = useReducedMotion();
  const markUnavailable = useCallback(() => setFailed(true), []);
  const handleChange = useCallback(
    (point: GeoPoint) => {
      setMoves((count) => count + 1);
      onChange(point);
    },
    [onChange],
  );
  const online = canRenderMap && !failed;

  return (
    <div className={styles.picker} role="group" aria-label="Treffpunkt auf der Karte" data-map-mode={online ? 'online' : 'offline'}>
      {online ? (
        <LocationPickerMap initial={value} onChange={handleChange} onUnavailable={markUnavailable} />
      ) : (
        <div className={styles.offline}>
          <p className={styles.offlineBadge}>
            <WifiOff size={14} aria-hidden="true" />
            Karte offline – Treffpunkt bitte genau beschreiben
          </p>
        </div>
      )}
      <motion.span
        key={moves}
        className={styles.pin}
        aria-hidden="true"
        initial={reduceMotion ? false : { y: -10 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 600, damping: 18 }}
      >
        <MapPin size={36} strokeWidth={2} fill="var(--accent)" color="var(--surface)" />
      </motion.span>
      <span className={styles.pinShadow} aria-hidden="true" />
      <p className={styles.caption}>{online ? 'Karte verschieben, bis die Nadel auf dem Treffpunkt steht' : 'Treffpunkt: Flensburg'}</p>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
