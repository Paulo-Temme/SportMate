'use client';
// "Meine Treffen": Reiter "Ich nehme teil" und "Ich organisiere", Rückzug und Absage mit Bestätigung (F-24, F-18, F-23).
import { motion, useReducedMotion } from 'motion/react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useAppServices } from '@/components/app/app-services';
import { ConfirmDialog } from '@/components/event/confirm-dialog';
import { useEventList } from '@/hooks/use-event-list';
import { useParticipation } from '@/hooks/use-participation';
import { emptyFilters, type SportEvent } from '@/lib/events/event-model';
import { MyEventRow } from './my-event-row';
import styles from './my-events-view.module.css';

type Tab = 'participating' | 'organizing';
type Pending = { action: 'leave' | 'cancel'; event: SportEvent } | null;

const mineFilters = { ...emptyFilters, mine: true };

function GuestPrompt() {
  return (
    <div className={styles.empty}>
      <p className={styles.emptyTitle}>Melde dich an, um deine Treffen zu sehen.</p>
      <Link href="/anmelden?weiter=%2Fmeine-treffen" className={styles.primary}>
        Anmelden
      </Link>
    </div>
  );
}

function EmptyTab({ tab }: { tab: Tab }) {
  return (
    <div className={styles.empty}>
      <p className={styles.emptyTitle}>Noch keine Treffen</p>
      <p className={styles.emptyText}>
        {tab === 'participating' ? 'Wenn du bei einem Treffen mitmachst, steht es hier.' : 'Treffen, die du erstellst, stehen hier.'}
      </p>
      <Link href={tab === 'participating' ? '/' : '/erstellen'} className={styles.primary}>
        {tab === 'participating' ? 'Zur Übersicht' : 'Treffen erstellen'}
      </Link>
    </div>
  );
}

function MyEventList({ tab }: { tab: Tab }) {
  const list = useEventList(mineFilters, 'chronological');
  const participation = useParticipation();
  const [pending, setPending] = useState<Pending>(null);
  const [now] = useState(() => new Date());
  const items = useMemo(
    () => list.events.filter((event) => (tab === 'organizing' ? event.isViewerOrganizer : !event.isViewerOrganizer)),
    [list.events, tab],
  );

  const confirm = async () => {
    if (!pending) return;
    if (pending.action === 'leave') await participation.leave(pending.event);
    else await participation.cancel(pending.event);
    setPending(null);
  };

  if (list.status === 'loading') return <div className={styles.skeleton} aria-busy="true" aria-label="Treffen werden geladen" />;
  if (list.status === 'error') return <p role="alert">Deine Treffen konnten nicht geladen werden. Bitte versuche es erneut.</p>;
  if (items.length === 0) return <EmptyTab tab={tab} />;
  return (
    <>
      <ul className={styles.list}>
        {items.map((event) => (
          <li key={event.id}>
            <MyEventRow
              event={event}
              now={now}
              busy={participation.pendingId === event.id}
              onLeave={(target) => setPending({ action: 'leave', event: target })}
              onCancel={(target) => setPending({ action: 'cancel', event: target })}
            />
          </li>
        ))}
      </ul>
      <ConfirmDialog
        open={pending?.action === 'leave'}
        title="Teilnahme zurückziehen?"
        description={`Dein Platz bei „${pending?.event.title ?? ''}“ wird wieder frei.`}
        confirmLabel="Zurückziehen"
        busy={Boolean(participation.pendingId)}
        onConfirm={confirm}
        onCancel={() => setPending(null)}
      />
      <ConfirmDialog
        open={pending?.action === 'cancel'}
        title="Treffen absagen?"
        description={`Alle Teilnehmenden sehen „${pending?.event.title ?? ''}“ danach als abgesagt. Das lässt sich nicht rückgängig machen.`}
        confirmLabel="Treffen absagen"
        busy={Boolean(participation.pendingId)}
        onConfirm={confirm}
        onCancel={() => setPending(null)}
      />
    </>
  );
}

/**
 * Seite "Meine Treffen" mit zwei Reitern.
 * Rückgabe: Reiter und Liste; Gäste sehen einen Hinweis zur Anmeldung.
 * Feature: F-24
 */
export function MyEventsView() {
  const { user, authReady } = useAppServices();
  const reduceMotion = useReducedMotion();
  const [tab, setTab] = useState<Tab>('participating');
  const tabs: Array<{ id: Tab; label: string }> = [
    { id: 'participating', label: 'Ich nehme teil' },
    { id: 'organizing', label: 'Ich organisiere' },
  ];
  return (
    <div className={styles.view}>
      <h1 className={styles.title}>Meine Treffen</h1>
      {!authReady ? (
        <div className={styles.skeleton} aria-busy="true" />
      ) : !user ? (
        <GuestPrompt />
      ) : (
        <>
          <div className={styles.tabs} role="tablist" aria-label="Meine Treffen">
            {tabs.map((option) => (
              <button
                key={option.id}
                type="button"
                role="tab"
                id={`reiter-${option.id}`}
                aria-selected={tab === option.id}
                aria-controls="meine-treffen-liste"
                className={styles.tab}
                onClick={() => setTab(option.id)}
              >
                {option.label}
                {tab === option.id && (
                  <motion.span layoutId="my-events-tab" className={styles.tabLine} transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 500, damping: 40 }} />
                )}
              </button>
            ))}
          </div>
          <div id="meine-treffen-liste" role="tabpanel" aria-labelledby={`reiter-${tab}`}>
            <MyEventList tab={tab} />
          </div>
        </>
      )}
    </div>
  );
}
