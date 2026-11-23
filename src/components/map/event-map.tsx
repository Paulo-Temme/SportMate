'use client';
// Wählt die Kartendarstellung: MapLibre im Browser, sonst (Testmodus, kein WebGL, kein Netz) die Offline-Karte (F-08).
import dynamic from 'next/dynamic';
import { useCallback, useState } from 'react';
import { preconnect } from 'react-dom';
import { MapPlaceholder } from './map-placeholder';
import type { CameraRequest, MapMarkerItem } from './map-marker-item';
import { OfflineMap } from './offline-map';
import { useCanRenderMap } from './use-can-render-map';

const loadMaplibreMap = () => import('./maplibre-map');

// Den Karten-Code sofort beim Laden dieses Moduls anfordern, nicht erst nach dem ersten Rendern (spart einen Umlauf).
if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_MAP_MODE !== 'offline') void loadMaplibreMap();

const MaplibreMap = dynamic(loadMaplibreMap, { ssr: false, loading: () => <MapPlaceholder /> });

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
  // Verbindung zum Kartendienst früh aufbauen (DNS, TLS), parallel zum Laden des Karten-Codes.
  preconnect('https://tiles.openfreemap.org', { crossOrigin: 'anonymous' });
  return (
    <MaplibreMap markers={markers} cameraRequest={cameraRequest} onSelectMarker={onSelectMarker} onUnavailable={markUnavailable} />
  );
}
