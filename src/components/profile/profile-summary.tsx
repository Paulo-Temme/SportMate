'use client';
// Profil: Zähler "Treffen dabei" und "organisiert" aus den eigenen Treffen und Link zu "Meine Treffen" (F-24, F-01).
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useEventList } from '@/hooks/use-event-list';
import { emptyFilters } from '@/lib/events/event-model';
import { splitViewerEvents } from '@/lib/events/viewer-events';
import styles from './profile-view.module.css';

const mineFilters = { ...emptyFilters, mine: true };

function Stat({ value, label, testId }: { value: number | null; label: string; testId: string }) {
  return (
    <div className={styles.stat}>
      <dd className={`${styles.statValue} tabular`} data-testid={testId}>
        {value ?? '–'}
      </dd>
      <dt className={styles.statLabel}>{label}</dt>
    </div>
  );
}

/**
 * Zeigt, bei wie vielen Treffen die Person dabei ist und wie viele sie organisiert.
 * Rückgabe: Abschnitt mit zwei Zahlen (beim Laden oder Fehler "–") und Link zu "Meine Treffen".
 * Feature: F-24
 */
export function ProfileSummary() {
  const list = useEventList(mineFilters, 'chronological');
  const split = list.status === 'ready' ? splitViewerEvents(list.events) : null;
  return (
    <section className={styles.summary} aria-labelledby="deine-treffen">
      <h2 id="deine-treffen" className={styles.summaryTitle}>
        Deine Treffen
      </h2>
      <dl className={styles.stats}>
        <Stat value={split ? split.participating.length : null} label="Treffen dabei" testId="count-participating" />
        <Stat value={split ? split.organizing.length : null} label="organisiert" testId="count-organizing" />
      </dl>
      <Link href="/meine-treffen" className={styles.summaryLink}>
        Deine Treffen ansehen
        <ChevronRight size={18} aria-hidden="true" />
      </Link>
    </section>
  );
}
