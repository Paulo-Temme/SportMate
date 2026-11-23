'use client';
// Detailansicht eines Treffens: Zeit, Plätze, Status, Treffpunkt, Niveau, Alter, Kosten, Mitbringen, Organisator, Teilnehmende (F-12, F-13, F-14, F-20, F-25).
import { Backpack, CalendarDays, Euro, Gauge, MapPin, UserRound, Users } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import Link from 'next/link';
import { useState, type ReactNode } from 'react';
import { useEventDetail } from '@/hooks/use-event-detail';
import { useParticipation } from '@/hooks/use-participation';
import type { ParticipantEntry, SportEvent } from '@/lib/events/event-model';
import {
  countMissingParticipants,
  describeAgeGroup,
  describeBringAlong,
  describeCost,
  describeEventStatus,
  formatEventSchedule,
  summarizePlaces,
} from '@/lib/events/event-presentation';
import { ConfirmDialog } from './confirm-dialog';
import { DetailAction } from './detail-action';
import { OccupancyBar } from './occupancy-bar';
import { SportIcon } from './sport-icon';
import styles from './event-detail.module.css';

type PendingConfirm = 'leave' | 'cancel' | null;

function Fact({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div className={styles.fact}>
      <dt className={styles.factIcon}>
        {icon}
        <span className="visually-hidden">{label}</span>
      </dt>
      <dd className={styles.factText}>{children}</dd>
    </div>
  );
}

function StatusLine({ event, now }: { event: SportEvent; now: Date }) {
  const status = describeEventStatus(event, now);
  const missing = countMissingParticipants(event);
  const tone = status === 'Findet statt' ? 'ok' : status === 'Sucht noch Mitspielende' ? 'warn' : 'neutral';
  return (
    <p className={styles.status} data-tone={tone}>
      <span className={styles.statusDot} aria-hidden="true" />
      {status === 'Sucht noch Mitspielende' ? `${status} (noch ${missing})` : status}
      {status !== 'Abgesagt' && <span className={styles.statusHint}>Mindestens {event.minParticipants} Personen</span>}
    </p>
  );
}

function PlacesBlock({ event }: { event: SportEvent }) {
  const reduceMotion = useReducedMotion();
  const places = summarizePlaces(event);
  if (event.status === 'cancelled') return null;
  return (
    <div className={styles.places}>
      <div className={styles.placesRow}>
        <span className={`${styles.placesLabel} tabular`} data-full={places.full}>
          {places.full ? 'Ausgebucht' : places.label}
        </span>
        <span className={`${styles.placesCount} tabular`} aria-label={`${event.participantCount} Teilnehmende`}>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={event.participantCount}
              initial={reduceMotion ? false : { y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { y: -10, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className={styles.countNumber}
            >
              {event.participantCount}
            </motion.span>
          </AnimatePresence>
          /{event.capacity} dabei
        </span>
      </div>
      <OccupancyBar taken={event.participantCount} capacity={event.capacity} wide />
    </div>
  );
}

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}

function ParticipantsBlock({ event, participants }: { event: SportEvent; participants: ParticipantEntry[] }) {
  return (
    <section className={styles.section} aria-labelledby="teilnehmende">
      <h3 id="teilnehmende" className={styles.sectionTitle}>
        Teilnehmende
      </h3>
      {participants.length === 0 ? (
        <p className={styles.muted}>
          {event.participantCount} {event.participantCount === 1 ? 'Teilnehmende Person' : 'Teilnehmende'} · Namen sehen nur Teilnehmende
        </p>
      ) : (
        <ul className={styles.people}>
          {participants.map((person, index) => (
            <li key={`${person.displayName}-${index}`} className={styles.person}>
              <span className={styles.avatar} aria-hidden="true">
                {initialsOf(person.displayName)}
              </span>
              {person.displayName}
              {person.isOrganizer && <span className={styles.organizerTag}>Organisiert</span>}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function welcomesBeginners(event: SportEvent): boolean {
  return event.level === 'Anfänger' || event.level === 'Alle Niveaus';
}

function DetailFacts({ event }: { event: SportEvent }) {
  return (
    <dl className={styles.facts}>
      <Fact icon={<CalendarDays size={18} aria-hidden="true" />} label="Wann">
        <span>{formatEventSchedule(event.startsAt, event.endsAt)}</span>
      </Fact>
      <Fact icon={<MapPin size={18} aria-hidden="true" />} label="Treffpunkt">
        {event.locationName && <strong className={styles.factStrong}>{event.locationName}</strong>}
        <span>{event.meetingPoint}</span>
      </Fact>
      <Fact icon={<Gauge size={18} aria-hidden="true" />} label="Niveau">
        <span>Niveau: {event.level}</span>
        {welcomesBeginners(event) && <span className={styles.welcome}>Anfänger willkommen</span>}
      </Fact>
      <Fact icon={<Users size={18} aria-hidden="true" />} label="Alter">
        <span>{describeAgeGroup(event.ageGroup)}</span>
      </Fact>
      <Fact icon={<Euro size={18} aria-hidden="true" />} label="Kosten">
        <span>{describeCost(event.costCents)}</span>
      </Fact>
      <Fact icon={<Backpack size={18} aria-hidden="true" />} label="Mitbringen">
        <span>{describeBringAlong(event.bringAlong)}</span>
      </Fact>
      <Fact icon={<UserRound size={18} aria-hidden="true" />} label="Organisator">
        <span>Organisiert von {event.organizerName || 'unbekannt'}</span>
      </Fact>
    </dl>
  );
}

function ReadyDetail({ event, participants, now }: { event: SportEvent; participants: ParticipantEntry[]; now: Date }) {
  const participation = useParticipation();
  const [confirm, setConfirm] = useState<PendingConfirm>(null);
  const busy = participation.pendingId === event.id;

  const confirmAction = async () => {
    if (confirm === 'leave') await participation.leave(event);
    if (confirm === 'cancel') await participation.cancel(event);
    setConfirm(null);
  };

  return (
    <article className={styles.detail} data-testid="event-detail" aria-labelledby="treffen-titel">
      <p className={styles.kicker}>
        <span className={styles.sportBadge}>
          <SportIcon sport={event.sport} size={16} />
        </span>
        <span>{event.sport}</span>
        {event.isDemo && <span className={styles.demoTag}>Beispieltreffen</span>}
      </p>
      <h2 id="treffen-titel" className={styles.title}>
        {event.title}
      </h2>
      {event.status === 'cancelled' && <p className={styles.cancelled}>Abgesagt · Dieses Treffen findet nicht statt.</p>}
      <PlacesBlock event={event} />
      <StatusLine event={event} now={now} />
      <DetailAction
        event={event}
        now={now}
        busy={busy}
        onJoin={() => participation.join(event)}
        onLeave={() => setConfirm('leave')}
        onCancel={() => setConfirm('cancel')}
      />
      <DetailFacts event={event} />
      <section className={styles.section} aria-labelledby="erwartung">
        <h3 id="erwartung" className={styles.sectionTitle}>
          Was erwartet dich?
        </h3>
        <p className={styles.description}>{event.description.trim() || 'Keine weitere Beschreibung.'}</p>
      </section>
      <ParticipantsBlock event={event} participants={participants} />
      <ConfirmDialog
        open={confirm === 'leave'}
        title="Teilnahme zurückziehen?"
        description="Dein Platz wird wieder frei. Du kannst später erneut teilnehmen, solange Plätze frei sind."
        confirmLabel="Zurückziehen"
        busy={busy}
        onConfirm={confirmAction}
        onCancel={() => setConfirm(null)}
      />
      <ConfirmDialog
        open={confirm === 'cancel'}
        title="Treffen absagen?"
        description="Alle Teilnehmenden sehen das Treffen danach als abgesagt. Das lässt sich nicht rückgängig machen."
        confirmLabel="Treffen absagen"
        busy={busy}
        onConfirm={confirmAction}
        onCancel={() => setConfirm(null)}
      />
    </article>
  );
}

function DetailSkeleton() {
  return (
    <div className={styles.detail} aria-busy="true" aria-label="Treffen wird geladen">
      <span className={styles.skeletonLine} style={{ width: '30%' }} />
      <span className={styles.skeletonTitle} />
      <span className={styles.skeletonLine} style={{ width: '100%' }} />
      <span className={styles.skeletonButton} />
      <span className={styles.skeletonLine} style={{ width: '80%' }} />
      <span className={styles.skeletonLine} style={{ width: '65%' }} />
    </div>
  );
}

/**
 * Lädt und zeigt ein Treffen. Zeigt Skelett beim Laden, "Treffen nicht gefunden" und verständliche Fehler.
 * Eingaben: Kennung des Treffens, optional aktueller Zeitpunkt. Rückgabe: Detailansicht.
 * Feature: F-12, F-13
 */
export function EventDetail({ eventId, now = new Date() }: { eventId: string; now?: Date }) {
  const state = useEventDetail(eventId);
  if (state.status === 'loading') return <DetailSkeleton />;
  if (state.status === 'missing' || state.status === 'error') {
    return (
      <div className={styles.detail}>
        <h2 className={styles.title}>{state.status === 'missing' ? 'Treffen nicht gefunden' : 'Treffen konnte nicht geladen werden'}</h2>
        <p className={styles.muted}>
          {state.status === 'missing'
            ? 'Vielleicht wurde der Link falsch kopiert oder das Treffen gibt es nicht mehr.'
            : 'Bitte prüfe deine Verbindung und versuche es erneut.'}
        </p>
        <Link href="/entdecken" className={styles.textLink}>
          Zur Übersicht
        </Link>
      </div>
    );
  }
  return <ReadyDetail event={state.event} participants={state.participants} now={now} />;
}
