'use client';
// MapLibre-Karte mit Positron-Stil, Token-Farben, eigenen HTML-Markern und Gruppen ohne Überlappung. Nur im Browser geladen (F-08).
import 'maplibre-gl/dist/maplibre-gl.css';
import * as maplibregl from 'maplibre-gl';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { canSpreadGroup } from '@/lib/map/marker-grouping';
import { ClusterPill } from './cluster-pill';
import { buildDisplayItems } from './map-display-items';
import { flensburgCenter, type CameraRequest, type MapClusterItem, type MapDisplayItem, type MapMarkerItem } from './map-marker-item';
import { MapPlaceholder } from './map-placeholder';
import { MarkerPill } from './marker-pill';
import { createThemedMap, prefersReducedMotion } from './themed-map';
import styles from './event-map.module.css';
import pillStyles from './marker-pill.module.css';

type MaplibreMapProps = {
  markers: MapMarkerItem[];
  cameraRequest: CameraRequest | null;
  onSelectMarker: (id: string) => void;
  onUnavailable: () => void;
};

type MarkerHandle = { marker: maplibregl.Marker; element: HTMLDivElement };

const bottomPaddingFallback = 24;

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

function positionOf(entry: MapDisplayItem): [number, number] {
  const point = entry.kind === 'marker' ? entry.item : entry.cluster;
  return [point.longitude, point.latitude];
}

// Neu gruppieren, wenn sich Marker oder der Kartenausschnitt (nach Zoom/Verschieben) ändern.
function useDisplayItems(map: maplibregl.Map | null, markers: MapMarkerItem[]): MapDisplayItem[] {
  const [items, setItems] = useState<MapDisplayItem[]>([]);
  useEffect(() => {
    if (!map) return;
    const regroup = () => setItems(buildDisplayItems(markers, (item) => map.project([item.longitude, item.latitude])));
    regroup();
    map.on('moveend', regroup);
    return () => {
      map.off('moveend', regroup);
    };
  }, [map, markers]);
  return items;
}

function useMarkerElements(map: maplibregl.Map | null, items: MapDisplayItem[]) {
  const handles = useRef(new Map<string, MarkerHandle>());
  const [elements, setElements] = useState<Array<[string, HTMLDivElement]>>([]);

  useEffect(() => {
    if (!map) return;
    const current = handles.current;
    const wanted = new Set(items.map((entry) => entry.key));
    current.forEach((handle, key) => {
      if (wanted.has(key)) return;
      handle.marker.remove();
      current.delete(key);
    });
    items.forEach((entry) => {
      const existing = current.get(entry.key);
      if (existing) {
        existing.marker.setLngLat(positionOf(entry));
      } else {
        const element = document.createElement('div');
        element.className = pillStyles.host;
        const marker = new maplibregl.Marker({ element, anchor: 'bottom' }).setLngLat(positionOf(entry)).addTo(map);
        current.set(entry.key, { marker, element });
      }
      const selected = entry.kind === 'marker' && entry.item.state === 'selected';
      current.get(entry.key)!.element.style.zIndex = selected ? '2' : '1';
    });
    setElements([...current.entries()].map(([key, handle]) => [key, handle.element]));
  }, [map, items]);

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

function zoomToCluster(map: maplibregl.Map, cluster: MapClusterItem, bottomInset: number): void {
  const bounds = new maplibregl.LngLatBounds();
  cluster.members.forEach((member) => bounds.extend([member.longitude, member.latitude]));
  map.fitBounds(bounds, {
    padding: { top: 210, bottom: bottomInset + bottomPaddingFallback, left: 64, right: 64 },
    maxZoom: 18,
    duration: prefersReducedMotion() ? 0 : 600,
  });
}

/**
 * Vollflächige Vektorkarte mit eigenen Markern. Meldet über `onUnavailable`, wenn Stil oder WebGL fehlen.
 * Eingaben: Marker, Kamerawunsch, Auswahl-Callback, Fehler-Callback. Rückgabe: Kartenfläche.
 * Feature: F-08
 */
export default function MaplibreMap({ markers, cameraRequest, onSelectMarker, onUnavailable }: MaplibreMapProps) {
  const container = useRef<HTMLDivElement>(null);
  const map = useMapInstance(container, onUnavailable);
  const items = useDisplayItems(map, markers);
  const elements = useMarkerElements(map, items);
  useCamera(map, cameraRequest);
  const byKey = new Map(items.map((entry) => [entry.key, entry]));
  const bottomInset = cameraRequest?.bottomInset ?? 0;

  const expand = (cluster: MapClusterItem) => {
    if (map && canSpreadGroup(cluster.members)) zoomToCluster(map, cluster, bottomInset);
    else onSelectMarker(cluster.ids[0]);
  };

  return (
    <>
      <div className={styles.canvas} ref={container} data-map-mode="online" data-map-ready={Boolean(map)}>
        {elements.map(([key, element]) => {
          const entry = byKey.get(key);
          if (!entry) return null;
          const pill =
            entry.kind === 'marker' ? (
              <MarkerPill item={entry.item} onSelect={onSelectMarker} />
            ) : (
              <ClusterPill cluster={entry.cluster} onExpand={expand} />
            );
          return createPortal(pill, element, key);
        })}
      </div>
      <MapPlaceholder ready={Boolean(map)} />
    </>
  );
}
