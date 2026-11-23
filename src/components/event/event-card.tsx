'use client';
// Treffen als Zeile der Trefferliste: Zeit, Titel, Ort, Niveau, Kosten, Alter, freie Plätze und Teilnahme-Button (F-05, F-12, F-13, F-22).
import { Check } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import type { SportEvent } from '@/lib/events/event-model';
import { describeAgeGroup, describeCost, describeDayLabel, formatEventTime, summarizePlaces } from '@/lib/events/event-presentation';
import { resolveJoinAction } from './join-action';
import { OccupancyBar } from './occupancy-bar';
import { SportIcon } from './sport-icon';
import styles from './event-card.module.css';

type EventCardProps = {
  event: SportEvent;
  selected: boolean;
  onSelect: (id: string) => void;
  onJoin: (event: SportEvent) => void;
  pending?: boolean;
  now?: Date;
};

function isPlainClick(event: React.MouseEvent): boolean {
  return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
}

function JoinControl({ event, now, pending, onJoin }: Pick<EventCardProps, 'event' | 'now' | 'pending' | 'onJoin'>) {
  const reduceMotion = useReducedMotion();
  const action = resolveJoinAction(event, now);
  if (action.kind === 'joined' || action.kind === 'organizer') {
    return (
      <span className={styles.joined}>
        <Check size={14} strokeWidth={2.5} aria-hidden="true" />
        {action.label}
      </span>
    );
  }
  if (action.kind === 'join' || action.kind === 'full') {
    return (
      <motion.button
        type="button"
        className={styles.join}
        data-kind={action.kind}
        disabled={action.kind === 'full' || pending}
        aria-label={action.kind === 'join' ? `Jetzt teilnehmen: ${event.title}` : `Ausgebucht: ${event.title}`}
        onClick={() => onJoin(event)}
        whileTap={reduceMotion || action.kind === 'full' ? undefined : { scale: 0.97 }}
      >
        {action.label}
      </motion.button>
    );
  }
  return <span className={styles.closed}>{action.label}</span>;
}

/**
 * Zeigt ein Treffen in der Liste. Die ganze Zeile ist ein Link zu den Details; der Teilnahme-Button liegt darüber.
 * Eingaben: Treffen, ob ausgewählt, Callbacks für Auswahl und Teilnahme, optional laufende Aktion und Zeitpunkt.
 * Rückgabe: `<article>` mit Link und Button.
 * Feature: F-05, F-22
 */
export function EventCard({ event, selected, onSelect, onJoin, pending = false, now = new Date() }: EventCardProps) {
  const places = summarizePlaces(event);
  const placeLabel = places.full ? 'Ausgebucht' : places.label;
  return (
    <article className={styles.card} data-selected={selected} data-full={places.full} data-testid="event-card" data-event-id={event.id}>
      <div className={styles.when}>
        <span className={styles.time}>{formatEventTime(event.startsAt)}</span>
        <span className={styles.day}>{describeDayLabel(event.startsAt, now)}</span>
      </div>
      <div className={styles.body}>
        <h3 className={styles.title}>
          <a
            href={`/treffen/${event.id}`}
            className={styles.link}
            aria-current={selected ? 'true' : undefined}
            onClick={(clickEvent) => {
              if (!isPlainClick(clickEvent)) return;
              clickEvent.preventDefault();
              onSelect(event.id);
            }}
          >
            {event.title}
          </a>
        </h3>
        <p className={styles.meta} data-part="meta-row">
          <span className={styles.sport}>
            <SportIcon sport={event.sport} size={14} />
            {event.sport}
          </span>
          {event.locationName && <span>{event.locationName}</span>}
        </p>
        <p className={styles.facts} data-part="meta-row">
          <span>{event.level}</span>
          <span>{describeAgeGroup(event.ageGroup)}</span>
          <span>{describeCost(event.costCents)}</span>
        </p>
        <div className={styles.footer}>
          <div className={styles.places}>
            <OccupancyBar taken={event.participantCount} capacity={event.capacity} />
            <span className={`${styles.placeLabel} tabular`} data-full={places.full}>
              {placeLabel}
            </span>
          </div>
          <JoinControl event={event} now={now} pending={pending} onJoin={onJoin} />
        </div>
      </div>
    </article>
  );
}
