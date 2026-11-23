// "Was bringt dich in Bewegung?": die Sportarten der App als ruhige Auswahl, jede führt nach Entdecken mit Filter (F-31).
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { SportIcon } from '@/components/event/sport-icon';
import type { EventListState } from '@/hooks/use-event-list';
import { buildDiscoverHref } from '@/lib/events/discover-link';
import { sports, type Sport } from '@/lib/events/event-model';
import styles from './landing.module.css';

function describeCount(state: EventListState, sport: Sport): string {
  if (state.status !== 'ready') return '';
  const count = state.events.filter((event) => event.sport === sport).length;
  return count === 0 ? 'Noch keins' : `${count} Treffen`;
}

/**
 * Abschnitt mit allen Sportarten; neben jeder steht die Zahl kommender Treffen, sobald sie geladen ist.
 * Eingaben: Ladezustand der kommenden Treffen. Rückgabe: `<section>` mit einer Liste von Links.
 * Feature: F-31
 */
export function LandingSports({ upcoming }: { upcoming: EventListState }) {
  return (
    <section id="sportarten" className={styles.section} aria-labelledby="sportarten-titel">
      <h2 id="sportarten-titel" className={styles.sectionTitle}>
        Was bringt dich in Bewegung?
      </h2>
      <ul className={styles.sports}>
        {sports.map((sport) => (
          <li key={sport}>
            <Link href={buildDiscoverHref(sport)} className={styles.sportLink}>
              <SportIcon sport={sport} size={22} className={styles.sportIcon} />
              <span className={styles.sportName}>{sport}</span>
              <span className={`${styles.sportCount} tabular`}>{describeCount(upcoming, sport)}</span>
              <ArrowUpRight size={18} aria-hidden="true" className={styles.sportArrow} />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
