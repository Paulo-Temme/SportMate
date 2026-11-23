'use client';
// MapLibre-Karte mit Positron-Stil, an die Tokens angepassten Farben und eigenen HTML-Markern. Nur im Browser geladen (F-08).
import 'maplibre-gl/dist/maplibre-gl.css';
import * as maplibregl from 'maplibre-gl';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { createThemedMap, prefersReducedMotion } from './themed-map';
import { flensburgCenter, type CameraRequest, type MapMarkerItem } from './map-marker-item';
import { MarkerPill } from './marker-pill';
import styles from './event-map.module.css';

type MaplibreMapProps = {
  markers: MapMarkerItem[];
  cameraRequest: CameraRequest | null;
  onSelectMarker: (id: string) => void;
  onUnavailable: () => void;
};

type MarkerHandle = { marker: maplibregl.Marker; element: HTMLDivElement };

function useMapInstance(container: React.RefObject<HTMLDivElement | null>, onUnavailable: () => void) {
  const [map, setMap] = useState<maplibregl.Map | null>(null);
  const unavailableRef = useRef(onUnavailable);
  useEffect(() => {
    unavailableRef.current = onUnavailable;
  }, [onUnavailable]);

  useEffect(() => {
    if (!container.current) return;
    let instance: maplibregl.Map;
    try {
      instance = createThemedMap(container.current, flensburgCenter, flensburgCenter.zoom, () => unavailableRef.current());
    } catch {
      unavailableRef.current();
      return;
    }
    instance.on('load', () => setMap(instance));
    return () => instance.remove();
  }, [container]);

  return map;
}

function useMarkerElements(map: maplibregl.Map | null, markers: MapMarkerItem[]) {
  const handles = useRef(new Map<string, MarkerHandle>());
  const [elements, setElements] = useState<Array<[string, HTMLDivElement]>>([]);

  useEffect(() => {
    if (!map) return;
    const current = handles.current;
    const wanted = new Set(markers.map((item) => item.id));
    current.forEach((handle, id) => {
      if (wanted.has(id)) return;
      handle.marker.remove();
      current.delete(id);
    });
    markers.forEach((item) => {
      const existing = current.get(item.id);
      if (existing) {
        existing.marker.setLngLat([item.longitude, item.latitude]);
      } else {
        const element = document.createElement('div');
        const marker = new maplibregl.Marker({ element, anchor: 'bottom' }).setLngLat([item.longitude, item.latitude]).addTo(map);
        current.set(item.id, { marker, element });
      }
      current.get(item.id)!.element.style.zIndex = item.state === 'selected' ? '2' : '1';
    });
    setElements([...current.entries()].map(([id, handle]) => [id, handle.element]));
  }, [map, markers]);

  return elements;
}

function flyToRequest(map: maplibregl.Map, request: CameraRequest): void {
  const padding = { top: 150, bottom: request.bottomInset + 24, left: 40, right: 40 };
  const duration = prefersReducedMotion() ? 0 : 900;
  if (request.kind === 'fit') {
    if (request.points.length === 0) return;
    const bounds = new maplibregl.LngLatBounds();
    request.points.forEach((point) => bounds.extend([point.longitude, point.latitude]));
    // Oben Platz für Suchleiste und Chips, damit kein Marker darunter verschwindet.
    map.fitBounds(bounds, { padding: { ...padding, top: 210, left: 32, right: 32 }, maxZoom: 14.5, duration: 0 });
    return;
  }
  const target =
    request.kind === 'event'
      ? { center: [request.longitude, request.latitude] as [number, number], zoom: Math.max(map.getZoom(), 14) }
      : { center: [flensburgCenter.longitude, flensburgCenter.latitude] as [number, number], zoom: flensburgCenter.zoom };
  map.flyTo({ ...target, padding, duration, essential: false });
}

function useCamera(map: maplibregl.Map | null, request: CameraRequest | null) {
  useEffect(() => {
    if (map && request) flyToRequest(map, request);
  }, [map, request]);
}

/**
 * Vollflächige Vektorkarte mit eigenen Markern. Meldet über `onUnavailable`, wenn Stil oder WebGL fehlen.
 * Eingaben: Marker, Kamerawunsch, Auswahl-Callback, Fehler-Callback. Rückgabe: Kartenfläche.
 * Feature: F-08
 */
export default function MaplibreMap({ markers, cameraRequest, onSelectMarker, onUnavailable }: MaplibreMapProps) {
  const container = useRef<HTMLDivElement>(null);
  const map = useMapInstance(container, onUnavailable);
  const elements = useMarkerElements(map, markers);
  useCamera(map, cameraRequest);
  const byId = new Map(markers.map((item) => [item.id, item]));

  return (
    <div className={styles.canvas} ref={container} data-map-mode="online">
      {elements.map(([id, element]) => {
        const item = byId.get(id);
        return item ? createPortal(<MarkerPill item={item} onSelect={onSelectMarker} />, element, id) : null;
      })}
    </div>
  );
}
