'use client';
// Echte Vektorkarte der Startseiten-Vorschau: nicht bedienbar, ruhige Kamerafahrt von Treffen zu Treffen. Nur im Browser geladen (F-31).
import 'maplibre-gl/dist/maplibre-gl.css';
import * as maplibregl from 'maplibre-gl';
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import type { SportEvent } from '@/lib/events/event-model';
import { createThemedMap } from '@/components/map/themed-map';
import pillStyles from '@/components/map/marker-pill.module.css';
import styles from './preview-map.module.css';

type PreviewMapCanvasProps = {
  events: SportEvent[];
  active: number;
  /** Nur bei `true` fährt die Kamera zum hervorgehobenen Treffen (nicht beim bloßen Zeigen auf einen Marker). */
  follow: boolean;
  reduceMotion: boolean;
  renderMarker: (event: SportEvent, index: number) => ReactNode;
  onReady: () => void;
  onUnavailable: () => void;
};

const overviewPadding = { top: 72, bottom: 150, left: 56, right: 56 };
const focusPadding = { top: 40, bottom: 130, left: 40, right: 40 };
// Leicht wechselnde Blickrichtung je Treffen, damit die Fahrt räumlich wirkt, ohne zu schwanken.
const bearings = [-14, 10, -6, 16];

function useMap(container: React.RefObject<HTMLDivElement | null>, onUnavailable: () => void) {
  const [map, setMap] = useState<maplibregl.Map | null>(null);
  const unavailableRef = useRef(onUnavailable);
  useEffect(() => {
    unavailableRef.current = onUnavailable;
  }, [onUnavailable]);
  useEffect(() => {
    if (!container.current) return;
    let instance: maplibregl.Map;
    try {
      instance = createThemedMap(container.current, { latitude: 54.79, longitude: 9.44 }, 12, () => unavailableRef.current(), {
        interactive: false,
        labels: false,
      });
    } catch {
      unavailableRef.current();
      return;
    }
    instance.on('load', () => setMap(instance));
    return () => instance.remove();
  }, [container]);
  return map;
}

// Die Elemente für die Marker entstehen mit den Treffen; an die Karte gehängt werden sie erst nach dem Laden.
function useMarkerHosts(map: maplibregl.Map | null, events: SportEvent[]) {
  const hosts = useMemo(
    () =>
      events.map(() => {
        const element = document.createElement('div');
        element.className = pillStyles.host;
        return element;
      }),
    [events],
  );
  useEffect(() => {
    if (!map) return;
    const markers = events.map((event, index) =>
      new maplibregl.Marker({ element: hosts[index], anchor: 'bottom' }).setLngLat([event.longitude, event.latitude]).addTo(map),
    );
    return () => markers.forEach((marker) => marker.remove());
  }, [map, events, hosts]);
  return hosts;
}

function showOverview(map: maplibregl.Map, events: SportEvent[]): void {
  if (events.length === 0) return;
  const bounds = new maplibregl.LngLatBounds();
  events.forEach((event) => bounds.extend([event.longitude, event.latitude]));
  map.fitBounds(bounds, { padding: overviewPadding, maxZoom: 14.5, duration: 0 });
}

function useCamera(map: maplibregl.Map | null, events: SportEvent[], active: number, follow: boolean, reduceMotion: boolean) {
  const flights = useRef(0);
  useEffect(() => {
    if (map) showOverview(map, events);
  }, [map, events]);

  useEffect(() => {
    const target = events[active];
    if (!map || !target || !follow || reduceMotion) return;
    // Der erste Flug startet kurz nach dem Einblenden der Marker aus der Übersicht heraus, spätere sofort.
    const delay = flights.current === 0 ? 900 : 0;
    flights.current += 1;
    const timer = window.setTimeout(() => {
      map.flyTo({
        center: [target.longitude, target.latitude],
        zoom: 13.9,
        pitch: 40,
        bearing: bearings[active % bearings.length],
        padding: focusPadding,
        duration: 4200,
        curve: 1.3,
        essential: false,
      });
    }, delay);
    return () => window.clearTimeout(timer);
  }, [map, events, active, follow, reduceMotion]);
}

/**
 * Vorschaukarte mit Markern der gewählten Treffen. Meldet über `onUnavailable`, wenn Stil oder WebGL fehlen.
 * Eingaben: Treffen, hervorgehobener Index, ob die Kamera folgt, reduzierte Bewegung, Marker-Darstellung, Callbacks für bereit und Ausfall.
 * Rückgabe: Kartenfläche; bis zum Laden eine ruhige Fläche in Kartenfarbe.
 * Feature: F-31
 */
export default function PreviewMapCanvas({ events, active, follow, reduceMotion, renderMarker, onReady, onUnavailable }: PreviewMapCanvasProps) {
  const container = useRef<HTMLDivElement>(null);
  const map = useMap(container, onUnavailable);
  const hosts = useMarkerHosts(map, events);
  useCamera(map, events, active, follow, reduceMotion);
  useEffect(() => {
    if (map) onReady();
  }, [map, onReady]);
  useEffect(() => {
    hosts.forEach((host, index) => {
      host.style.zIndex = index === active ? '2' : '1';
    });
  }, [hosts, active]);

  return (
    <div ref={container} className={styles.canvas} data-map-mode="online" data-map-ready={Boolean(map)}>
      {hosts.map((host, index) => {
        const event = events[index];
        if (!event) return null;
        return createPortal(renderMarker(event, index), host, event.id);
      })}
    </div>
  );
}
