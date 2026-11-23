'use client';
// Trefferliste im Sheet: Skelett beim Laden, Fehler, Leerzustand mit "Filter zurücksetzen", gestaffeltes Einblenden (F-05, F-06).
import { SearchX } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import Link from 'next/link';
import { EventCard } from '@/components/event/event-card';
import type { EventListState } from '@/hooks/use-event-list';
import type { SportEvent } from '@/lib/events/event-model';
import styles from './result-list.module.css';

type ResultListProps = {
  state: EventListState;
  selectedId: string | null;
  pendingId: string | null;
  onSelect: (id: string) => void;
  onJoin: (event: SportEvent) => void;
  onResetFilters: () => void;
  hasFilters: boolean;
};

function ListSkeleton() {
  return (
    <div aria-busy="true" aria-label="Treffen werden geladen">
      {[0, 1, 2].map((row) => (
        <div key={row} className={styles.skeletonRow}>
          <span className={styles.skeletonBlock} style={{ width: 44, height: 18 }} />
          <span className={styles.skeletonStack}>
            <span className={styles.skeletonBlock} style={{ width: '70%', height: 16 }} />
            <span className={styles.skeletonBlock} style={{ width: '45%', height: 12 }} />
            <span className={styles.skeletonBlock} style={{ width: '55%', height: 12 }} />
          </span>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ hasFilters, onResetFilters }: Pick<ResultListProps, 'hasFilters' | 'onResetFilters'>) {
  return (
    <div className={styles.empty}>
      <span className={styles.emptyIcon} aria-hidden="true">
        <SearchX size={22} />
      </span>
      <h3 className={styles.emptyTitle}>Keine Treffen gefunden</h3>
      <p className={styles.emptyText}>
        {hasFilters ? 'Mit diesen Filtern gibt es gerade nichts. Lockere die Auswahl oder starte selbst etwas.' : 'Gerade ist nichts geplant. Starte selbst etwas.'}
      </p>
      <div className={styles.emptyActions}>
        {hasFilters && (
          <button type="button" className={styles.reset} onClick={onResetFilters}>
            Filter zurücksetzen
          </button>
        )}
        <Link href="/erstellen" className={styles.create}>
          Selbst ein Treffen erstellen
        </Link>
      </div>
    </div>
  );
}

/**
 * Zeigt die Treffer als Liste oder den passenden Zustand.
 * Eingaben: Ladezustand, Auswahl, laufende Aktion, Callbacks, ob Filter aktiv sind. Rückgabe: Liste oder Zustand.
 * Feature: F-05
 */
export function ResultList({ state, selectedId, pendingId, onSelect, onJoin, onResetFilters, hasFilters }: ResultListProps) {
  const reduceMotion = useReducedMotion();
  if (state.status === 'loading' && state.events.length === 0) return <ListSkeleton />;
  if (state.status === 'error' && state.events.length === 0) {
    return (
      <p className={styles.error} role="alert">
        Treffen konnten nicht geladen werden. Bitte prüfe deine Verbindung und lade die Seite neu.
      </p>
    );
  }
  if (state.events.length === 0) return <EmptyState hasFilters={hasFilters} onResetFilters={onResetFilters} />;

  return (
    <motion.ul
      className={styles.list}
      aria-label="Treffer"
      initial={reduceMotion ? false : 'hidden'}
      animate="shown"
      variants={{ hidden: {}, shown: { transition: { staggerChildren: 0.035 } } }}
    >
      {state.events.map((event) => (
        <motion.li
          key={event.id}
          variants={{ hidden: { opacity: 0, y: 8 }, shown: { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } } }}
        >
          <EventCard event={event} selected={event.id === selectedId} onSelect={onSelect} onJoin={onJoin} pending={pendingId === event.id} />
        </motion.li>
      ))}
    </motion.ul>
  );
}
