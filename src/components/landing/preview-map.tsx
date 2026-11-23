'use client';
// Kartenvorschau der Startseite: echte Karte mit Kamerafahrt zu bis zu vier kommenden Treffen, sonst ruhige Fläche mit Markern (F-31).
import { useReducedMotion } from 'motion/react';
import dynamic from 'next/dynamic';
import { useCallback, useMemo, useRef, useState } from 'react';
import { preconnect } from 'react-dom';
import { useCanRenderMap } from '@/components/map/use-can-render-map';
import type { EventListState } from '@/hooks/use-event-list';
import type { SportEvent } from '@/lib/events/event-model';
import { findMarkerBounds } from '@/lib/map/marker-grouping';
import { pickPreviewEvents, placeInPreview } from '@/lib/map/preview-frame';
import { PreviewCaption } from './preview-caption';
import { PreviewMarker } from './preview-marker';
import { usePreviewTour } from './use-preview-tour';
import pillStyles from '@/components/map/marker-pill.module.css';
import styles from './preview-map.module.css';

// MapLibre (rund 200 kB) wird erst geladen, wenn das Panel in die Nähe des sichtbaren Bereichs kommt.
const PreviewMapCanvas = dynamic(() => import('./preview-map-canvas'), { ssr: false, loading: () => null });

type RenderMarker = (event: SportEvent, index: number) => React.ReactNode;

function PreviewPlane({ events, renderMarker }: { events: SportEvent[]; renderMarker: RenderMarker }) {
  const bounds = events.length > 0 ? findMarkerBounds(events) : null;
  return (
    <div className={styles.plane} data-map-mode="offline">
      {bounds &&
        events.map((event, index) => {
          const position = placeInPreview(event, bounds);
          return (
            <div key={event.id} className={`${styles.planeMarker} ${pillStyles.host}`} style={{ left: `${position.x * 100}%`, top: `${position.y * 100}%` }}>
              {renderMarker(event, index)}
            </div>
          );
        })}
    </div>
  );
}

/**
 * Vorschau der App auf der Startseite. Marker und Treffen-Karte führen zu den Details; ohne Treffen oder bei Fehlern
 * erklärt die Karte den Zustand. Nicht bedienbar (die Seite scrollt normal), pausiert bei Hover, Fokus und außerhalb des Bildes.
 * Eingaben: Ladezustand der Treffenliste (nach Beginn sortiert), optional fester Zeitpunkt (sonst jetzt). Rückgabe: Abbildung.
 * Feature: F-31
 */
export function PreviewMap({ state, now: fixedNow }: { state: EventListState; now?: Date }) {
  const [now] = useState(() => fixedNow ?? new Date());
  const reduceMotion = Boolean(useReducedMotion());
  const panel = useRef<HTMLElement>(null);
  const events = useMemo(() => pickPreviewEvents(state.events), [state.events]);
  const canRenderMap = useCanRenderMap();
  const [failed, setFailed] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const markUnavailable = useCallback(() => setFailed(true), []);
  const markReady = useCallback(() => setMapReady(true), []);
  const online = canRenderMap && !failed;
  const tour = usePreviewTour(panel, events.length, reduceMotion, mapReady || !online);
  const { highlight } = tour;

  const renderMarker: RenderMarker = (event, index) => (
    <PreviewMarker event={event} active={index === tour.active} now={now} reduceMotion={reduceMotion} onPoint={() => highlight(index)} />
  );

  if (online) preconnect('https://tiles.openfreemap.org', { crossOrigin: 'anonymous' });

  return (
    <figure
      ref={panel}
      className={styles.panel}
      aria-label="Kommende Treffen auf der Karte"
      onPointerEnter={() => tour.setHovered(true)}
      onPointerLeave={() => tour.setHovered(false)}
      onFocus={() => tour.setFocused(true)}
      onBlur={() => tour.setFocused(false)}
    >
      {online ? (
        tour.near && (
          <PreviewMapCanvas
            events={events}
            active={tour.active}
            follow={tour.origin === 'tour'}
            reduceMotion={reduceMotion}
            renderMarker={renderMarker}
            onReady={markReady}
            onUnavailable={markUnavailable}
          />
        )
      ) : (
        <PreviewPlane events={events} renderMarker={renderMarker} />
      )}
      <PreviewCaption status={state.status} event={events[tour.active]} now={now} reduceMotion={reduceMotion} />
    </figure>
  );
}
