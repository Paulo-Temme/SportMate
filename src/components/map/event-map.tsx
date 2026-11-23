'use client';
// Wählt die Kartendarstellung: MapLibre im Browser, sonst (Testmodus, kein WebGL, kein Netz) die Offline-Karte (F-08).
import dynamic from 'next/dynamic';
import { useCallback, useState } from 'react';
import type { CameraRequest, MapMarkerItem } from './map-marker-item';
import { OfflineMap } from './offline-map';
import { useCanRenderMap } from './use-can-render-map';
import styles from './event-map.module.css';

const MaplibreMap = dynamic(() => import('./maplibre-map'), {
  ssr: false,
  loading: () => <div className={styles.loading} aria-hidden="true" />,
});

type EventMapProps = {
  markers: MapMarkerItem[];
  cameraRequest: CameraRequest | null;
  onSelectMarker: (id: string) => void;
};

/**
 * Kartenbühne der App. Marker und Liste kommen aus derselben Trefferliste.
 * Eingaben: Marker, Kamerawunsch, Auswahl-Callback. Rückgabe: Karte oder Offline-Ersatz.
 * Feature: F-08
 */
export function EventMap({ markers, cameraRequest, onSelectMarker }: EventMapProps) {
  const canRenderMap = useCanRenderMap();
  const [failed, setFailed] = useState(false);
  const markUnavailable = useCallback(() => setFailed(true), []);

  if (!canRenderMap || failed) return <OfflineMap markers={markers} onSelectMarker={onSelectMarker} />;
  return (
    <MaplibreMap markers={markers} cameraRequest={cameraRequest} onSelectMarker={onSelectMarker} onUnavailable={markUnavailable} />
  );
}
