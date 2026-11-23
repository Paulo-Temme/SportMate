'use client';
// Marker der Startseiten-Vorschau: dieselbe Pille wie auf der Karte in Entdecken, als Link zu den Details (F-31).
import { motion } from 'motion/react';
import Link from 'next/link';
import { MarkerPillFace } from '@/components/map/marker-pill';
import type { SportEvent } from '@/lib/events/event-model';
import { describeDayLabel, formatEventTime } from '@/lib/events/event-presentation';
import pillStyles from '@/components/map/marker-pill.module.css';
import styles from './preview-map.module.css';

type PreviewMarkerProps = {
  event: SportEvent;
  active: boolean;
  now: Date;
  reduceMotion: boolean;
  onPoint: () => void;
};

const spring = { type: 'spring', stiffness: 420, damping: 24 } as const;

/**
 * Marker eines Treffens; der hervorgehobene erscheint in Akzentfarbe und leicht größer.
 * Eingaben: Treffen, ob hervorgehoben, Bezugszeitpunkt, reduzierte Bewegung, Callback beim Zeigen/Fokussieren.
 * Rückgabe: Link nach `/treffen/[id]` (mindestens 44 px Trefferfläche).
 * Feature: F-31
 */
export function PreviewMarker({ event, active, now, reduceMotion, onPoint }: PreviewMarkerProps) {
  const time = formatEventTime(event.startsAt);
  return (
    <Link
      href={`/treffen/${encodeURIComponent(event.id)}`}
      className={`${pillStyles.marker} ${styles.markerLink}`}
      data-state={active ? 'selected' : 'default'}
      data-testid="preview-marker"
      aria-label={`${event.title}, ${describeDayLabel(event.startsAt, now)} ${time} Uhr`}
      onPointerEnter={onPoint}
      onFocus={onPoint}
    >
      <motion.span
        className={styles.markerBody}
        initial={false}
        animate={{ scale: active ? 1.12 : 1, y: active ? -4 : 0 }}
        transition={reduceMotion ? { duration: 0 } : spring}
      >
        <MarkerPillFace sport={event.sport} timeLabel={time} />
      </motion.span>
    </Link>
  );
}
