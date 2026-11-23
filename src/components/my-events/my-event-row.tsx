'use client';
// Eintrag unter "Meine Treffen": Zeit, Titel, Status (Angemeldet, Organisiert von dir, Abgesagt) und passende Aktion (F-24, F-18, F-23).
import Link from 'next/link';
import { describeDayLabel } from '@/components/event/day-label';
import { SportIcon } from '@/components/event/sport-icon';
import type { SportEvent } from '@/lib/events/event-model';
import { describeEventStatus, formatEventTime, summarizePlaces } from '@/lib/events/event-presentation';
import styles from './my-event-row.module.css';

type MyEventRowProps = {
  event: SportEvent;
  now: Date;
  busy: boolean;
  onLeave: (event: SportEvent) => void;
  onCancel: (event: SportEvent) => void;
};

function describeRole(event: SportEvent): { label: string; tone: 'ok' | 'neutral' | 'danger' } {
  if (event.status === 'cancelled') return { label: 'Abgesagt', tone: 'danger' };
  return event.isViewerOrganizer ? { label: 'Organisiert von dir', tone: 'neutral' } : { label: 'Angemeldet', tone: 'ok' };
}

/**
 * Zeigt ein eigenes Treffen mit Status und Aktion. Begonnene oder abgesagte Treffen haben keine Aktion.
 * Eingaben: Treffen, Zeitpunkt, ob eine Aktion läuft, Callbacks. Rückgabe: Listeneintrag.
 * Feature: F-24
 */
export function MyEventRow({ event, now, busy, onLeave, onCancel }: MyEventRowProps) {
  const role = describeRole(event);
  const open = event.status !== 'cancelled' && new Date(event.startsAt) > now;
  const status = describeEventStatus(event, now);
  return (
    <article className={styles.row} data-testid="my-event" data-event-id={event.id}>
      <span className={styles.icon} aria-hidden="true">
        <SportIcon sport={event.sport} size={18} />
      </span>
      <div className={styles.body}>
        <p className={styles.when}>
          {describeDayLabel(event.startsAt, now)} · {formatEventTime(event.startsAt)} Uhr
        </p>
        <h3 className={styles.title}>
          <Link href={`/treffen/${event.id}`} className={styles.link}>
            {event.title}
          </Link>
        </h3>
        <p className={styles.meta}>
          <span className={styles.role} data-tone={role.tone}>
            {role.label}
          </span>
          {event.status !== 'cancelled' && (
            <span>
              {summarizePlaces(event).full ? 'Ausgebucht' : summarizePlaces(event).label} · {status}
            </span>
          )}
        </p>
      </div>
      {open && (
        <button
          type="button"
          className={styles.action}
          data-tone={event.isViewerOrganizer ? 'danger' : 'neutral'}
          disabled={busy}
          onClick={() => (event.isViewerOrganizer ? onCancel(event) : onLeave(event))}
        >
          {event.isViewerOrganizer ? 'Absagen' : 'Zurückziehen'}
          <span className="visually-hidden">: {event.title}</span>
        </button>
      )}
    </article>
  );
}
