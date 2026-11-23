'use client';
// Eine kompakte Treffen-Karte über der Vorschau: Sport-Icon, Titel, Tag und Uhrzeit, freie Plätze; blendet beim Wechsel weich über (F-31).
import { AnimatePresence, motion } from 'motion/react';
import Link from 'next/link';
import { SportIcon } from '@/components/event/sport-icon';
import type { EventListState } from '@/hooks/use-event-list';
import type { SportEvent } from '@/lib/events/event-model';
import { describeDayLabel, formatEventTime, summarizePlaces } from '@/lib/events/event-presentation';
import styles from './preview-map.module.css';

type PreviewCaptionProps = { status: EventListState['status']; event: SportEvent | undefined; now: Date; reduceMotion: boolean };

function CaptionContent({ status, event, now }: Omit<PreviewCaptionProps, 'reduceMotion'>) {
  if (status === 'loading') {
    return (
      <span className={styles.captionLoading} aria-label="Treffen werden geladen">
        <span className={styles.skeleton} style={{ width: '64%' }} />
        <span className={styles.skeleton} style={{ width: '40%' }} />
      </span>
    );
  }
  if (!event) {
    const text =
      status === 'error'
        ? 'Die Treffen konnten gerade nicht geladen werden. Versuch es unter „Treffen entdecken“ noch einmal.'
        : 'Gerade ist kein Treffen geplant. Das erste kannst du selbst anlegen.';
    return <span className={styles.captionEmpty}>{text}</span>;
  }
  const places = summarizePlaces(event);
  return (
    <Link href={`/treffen/${encodeURIComponent(event.id)}`} className={styles.captionLink}>
      <span className={styles.captionIcon}>
        <SportIcon sport={event.sport} size={18} />
      </span>
      <span className={styles.captionText}>
        <span className={styles.captionTitle}>{event.title}</span>
        <span className={styles.captionMeta}>
          <span>
            {describeDayLabel(event.startsAt, now)}, {formatEventTime(event.startsAt)}
          </span>
          <span aria-hidden="true"> · </span>
          <span className={styles.captionPlaces}>{places.label}</span>
        </span>
      </span>
    </Link>
  );
}

/**
 * Treffen-Karte der Vorschau mit Lade-, Leer- und Fehlerzustand.
 * Eingaben: Ladezustand, hervorgehobenes Treffen, Bezugszeitpunkt, reduzierte Bewegung. Rückgabe: Bildunterschrift.
 * Feature: F-31
 */
export function PreviewCaption({ status, event, now, reduceMotion }: PreviewCaptionProps) {
  return (
    <figcaption className={styles.caption} data-testid="preview-caption">
      <AnimatePresence initial={false}>
        <motion.span
          key={event?.id ?? status}
          className={styles.captionInner}
          initial={reduceMotion ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <CaptionContent status={status} event={event} now={now} />
        </motion.span>
      </AnimatePresence>
    </figcaption>
  );
}
