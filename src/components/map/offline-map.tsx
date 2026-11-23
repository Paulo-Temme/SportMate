'use client';
// Ersatzkarte ohne Netz, ohne WebGL oder in Tests: neutrale Fläche mit Raster, überlappungsfreien Markern und Gruppen (F-08).
import { Expand, WifiOff } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { canSpreadGroup, findMarkerBounds, placeOnOfflinePlane, type MarkerBounds } from '@/lib/map/marker-grouping';
import { ClusterPill } from './cluster-pill';
import { buildDisplayItems } from './map-display-items';
import type { MapClusterItem, MapMarkerItem } from './map-marker-item';
import { MarkerPill } from './marker-pill';
import styles from './event-map.module.css';
import pillStyles from './marker-pill.module.css';

type OfflineMapProps = { markers: MapMarkerItem[]; onSelectMarker: (id: string) => void };

type PlaneSize = { width: number; height: number };

function usePlaneSize(element: React.RefObject<HTMLDivElement | null>): PlaneSize | null {
  const [size, setSize] = useState<PlaneSize | null>(null);
  useEffect(() => {
    const node = element.current;
    if (!node) return;
    const measure = () => setSize({ width: node.clientWidth, height: node.clientHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [element]);
  return size;
}

function isInside(item: MapMarkerItem, bounds: MarkerBounds): boolean {
  return (
    item.latitude >= bounds.minLatitude &&
    item.latitude <= bounds.maxLatitude &&
    item.longitude >= bounds.minLongitude &&
    item.longitude <= bounds.maxLongitude
  );
}

function selectVisibleMarkers(markers: MapMarkerItem[], focusIds: string[] | null) {
  const focused = focusIds ? markers.filter((item) => focusIds.includes(item.id)) : [];
  if (focused.length === 0) return { visible: markers, bounds: markers.length > 0 ? findMarkerBounds(markers) : null, zoomed: false };
  const bounds = findMarkerBounds(focused);
  return { visible: markers.filter((item) => isInside(item, bounds)), bounds, zoomed: true };
}

/**
 * Zeigt die Marker ohne Kartenkacheln, deutlich als "Karte offline" gekennzeichnet. Überlappende Marker werden
 * zu Gruppen; ein Klick auf eine Gruppe vergrößert auf ihre Treffen.
 * Eingaben: Marker, Auswahl-Callback. Rückgabe: Ersatzfläche; die Liste bleibt die vollständige Alternative.
 * Feature: F-08
 */
export function OfflineMap({ markers, onSelectMarker }: OfflineMapProps) {
  const plane = useRef<HTMLDivElement>(null);
  const size = usePlaneSize(plane);
  const [focusIds, setFocusIds] = useState<string[] | null>(null);
  const { visible, bounds, zoomed } = selectVisibleMarkers(markers, focusIds);
  const place = (item: { latitude: number; longitude: number }) => placeOnOfflinePlane(item, bounds!, size!);
  const items = size && bounds ? buildDisplayItems(visible, place) : [];

  const expand = (cluster: MapClusterItem) => {
    if (canSpreadGroup(cluster.members)) setFocusIds(cluster.ids);
    else onSelectMarker(cluster.ids[0]);
  };

  return (
    <div ref={plane} className={styles.offline} data-map-mode="offline" role="region" aria-label="Karte offline">
      <svg className={styles.grid} aria-hidden="true">
        <defs>
          <pattern id="offline-grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M48 0H0V48" fill="none" stroke="var(--line)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#offline-grid)" />
      </svg>
      <div className={styles.offlineBar}>
        <p className={styles.offlineBadge}>
          <WifiOff size={14} aria-hidden="true" />
          <span>Karte offline</span>
          {!zoomed && <span className={styles.offlineHint}>Karte nicht verfügbar, die Liste zeigt alle Treffer.</span>}
        </p>
        {zoomed && (
          <button type="button" className={styles.offlineReset} onClick={() => setFocusIds(null)} aria-label="Alle Treffen auf der Karte zeigen">
            <Expand size={14} aria-hidden="true" />
            Alle zeigen
          </button>
        )}
      </div>
      {items.map((entry) => {
        const position = place(entry.kind === 'marker' ? entry.item : entry.cluster);
        const selected = entry.kind === 'marker' && entry.item.state === 'selected';
        return (
          <div
            key={entry.key}
            className={`${styles.offlineMarker} ${pillStyles.host}`}
            style={{ left: position.x, top: position.y, zIndex: selected ? 2 : 1 }}
          >
            {entry.kind === 'marker' ? (
              <MarkerPill item={entry.item} onSelect={onSelectMarker} />
            ) : (
              <ClusterPill cluster={entry.cluster} onExpand={expand} />
            )}
          </div>
        );
      })}
    </div>
  );
}
