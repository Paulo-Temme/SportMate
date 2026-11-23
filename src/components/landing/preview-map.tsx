'use client';
// Gezeichnete Flensburg-Karte mit bis zu vier echten kommenden Treffen als Marker-Pillen; hebt reihum eines hervor (F-31).
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { SportIcon } from '@/components/event/sport-icon';
import type { EventListState } from '@/hooks/use-event-list';
import type { SportEvent } from '@/lib/events/event-model';
import { describeDayLabel, formatEventTime, summarizePlaces } from '@/lib/events/event-presentation';
import { pickPreviewEvents, type PreviewPlacement } from '@/lib/map/preview-frame';
import { fjordLabel, fjordPath, parkAreas, previewCanvas } from './preview-shape';
import styles from './preview-map.module.css';

const highlightInterval = 3200;
const spring = { type: 'spring', stiffness: 420, damping: 26 } as const;

type Placement = PreviewPlacement<SportEvent>;

function describeMoment(event: SportEvent, now: Date): string {
  return `${describeDayLabel(event.startsAt, now)} ${formatEventTime(event.startsAt)} Uhr`;
}

function useRotatingHighlight(count: number, reduceMotion: boolean) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (reduceMotion || paused || count < 2) return;
    const timer = window.setInterval(() => setActive((index) => (index + 1) % count), highlightInterval);
    return () => window.clearInterval(timer);
  }, [count, paused, reduceMotion]);
  const focus = (index: number) => {
    setActive(index);
    setPaused(true);
  };
  return { active: count > 0 ? active % count : 0, focus, release: () => setPaused(false) };
}

function Backdrop() {
  return (
    <svg className={styles.backdrop} viewBox={`0 0 ${previewCanvas.width} ${previewCanvas.height}`} preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <pattern id="vorschau-raster" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0H0V40" className={styles.gridLine} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#vorschau-raster)" />
      {parkAreas.map((park) => (
        <ellipse
          key={park.name}
          cx={park.center.x}
          cy={park.center.y}
          rx={park.radiusX}
          ry={park.radiusY}
          transform={`rotate(${park.rotation} ${park.center.x} ${park.center.y})`}
          className={styles.park}
        />
      ))}
      <path d={fjordPath} className={styles.water} />
      <text x={fjordLabel.x} y={fjordLabel.y} className={styles.waterLabel} textAnchor="middle">
        Flensburger Förde
      </text>
    </svg>
  );
}

type MarkerProps = { placement: Placement; index: number; active: boolean; now: Date; reduceMotion: boolean; onFocus: () => void; onRelease: () => void };

function PreviewMarker({ placement, index, active, now, reduceMotion, onFocus, onRelease }: MarkerProps) {
  const { event, position } = placement;
  return (
    <Link
      href={`/treffen/${encodeURIComponent(event.id)}`}
      className={styles.marker}
      style={{ left: `${position.x * 100}%`, top: `${position.y * 100}%`, zIndex: active ? 2 : 1 }}
      data-testid="preview-marker"
      data-active={active}
      aria-label={`${event.title}, ${describeMoment(event, now)}`}
      onMouseEnter={onFocus}
      onMouseLeave={onRelease}
      onFocus={onFocus}
      onBlur={onRelease}
    >
      <motion.span
        className={styles.markerBody}
        initial={reduceMotion ? false : { opacity: 0, y: 10, scale: 0.85 }}
        animate={{ opacity: 1, y: active ? -4 : 0, scale: active ? 1.08 : 1 }}
        transition={reduceMotion ? { duration: 0 } : { ...spring, delay: index * 0.09 + 0.25 }}
      >
        <span className={styles.pill}>
          <span className={styles.pillIcon}>
            <SportIcon sport={event.sport} size={14} />
          </span>
          <span>{formatEventTime(event.startsAt)}</span>
        </span>
        <span className={styles.tip} aria-hidden="true" />
      </motion.span>
    </Link>
  );
}

function CaptionText({ state, placement, now }: { state: EventListState; placement: Placement | undefined; now: Date }) {
  if (state.status === 'loading') {
    return (
      <span className={styles.captionLoading} aria-label="Treffen werden geladen">
        <span className={styles.skeleton} style={{ width: '70%' }} />
        <span className={styles.skeleton} style={{ width: '45%' }} />
      </span>
    );
  }
  if (!placement) {
    const text =
      state.status === 'error'
        ? 'Die Treffen konnten gerade nicht geladen werden. Unter „Treffen entdecken“ kannst du es erneut versuchen.'
        : 'Gerade ist kein Treffen geplant. Das erste kannst du selbst anlegen.';
    return <span className={styles.captionEmpty}>{text}</span>;
  }
  const { event } = placement;
  const places = summarizePlaces(event);
  return (
    <span className={styles.captionEvent}>
      <span className={styles.captionIcon}>
        <SportIcon sport={event.sport} size={18} />
      </span>
      <span className={styles.captionText}>
        <span className={styles.captionTitle}>{event.title}</span>
        <span className={styles.captionMeta}>
          {describeDayLabel(event.startsAt, now)}, {formatEventTime(event.startsAt)} · {event.locationName || event.meetingPoint}
        </span>
        <span className={styles.captionPlaces}>{places.label}</span>
      </span>
    </span>
  );
}

/**
 * Vorschau der App auf der Startseite: vereinfachte Karte von Flensburg mit bis zu vier kommenden Treffen.
 * Marker führen zu den Details; ohne Treffen oder bei Fehlern erklärt ein Text den Zustand.
 * Eingaben: Ladezustand der Treffenliste (nach Beginn sortiert), optional fester Zeitpunkt (sonst jetzt). Rückgabe: Abbildung.
 * Feature: F-31
 */
export function PreviewMap({ state, now: fixedNow }: { state: EventListState; now?: Date }) {
  const [now] = useState(() => fixedNow ?? new Date());
  const reduceMotion = Boolean(useReducedMotion());
  const placements = useMemo(() => pickPreviewEvents(state.events), [state.events]);
  const { active, focus, release } = useRotatingHighlight(placements.length, reduceMotion);
  const current = placements[active];

  return (
    <figure className={styles.figure} aria-label="Kommende Treffen auf der Karte von Flensburg">
      <div className={styles.frame}>
        <Backdrop />
        <p className={styles.chip}>Als Nächstes in Flensburg</p>
        {placements.map((placement, index) => (
          <PreviewMarker
            key={placement.event.id}
            placement={placement}
            index={index}
            active={index === active}
            now={now}
            reduceMotion={reduceMotion}
            onFocus={() => focus(index)}
            onRelease={release}
          />
        ))}
        <figcaption className={styles.caption} data-testid="preview-caption">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={current?.event.id ?? state.status}
              className={styles.captionInner}
              initial={reduceMotion ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              <CaptionText state={state} placement={current} now={now} />
            </motion.span>
          </AnimatePresence>
        </figcaption>
      </div>
    </figure>
  );
}
