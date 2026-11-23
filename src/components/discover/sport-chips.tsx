'use client';
// Horizontal scrollbare Sportarten-Chips mit Mehrfachauswahl (ODER-Verknüpfung) (F-06).
import { motion, useReducedMotion } from 'motion/react';
import { SportIcon } from '@/components/event/sport-icon';
import { sports, type EventFilters, type Sport } from '@/lib/events/event-model';
import styles from './sport-chips.module.css';

type SportChipsProps = { filters: EventFilters; onChange: (filters: EventFilters) => void };

function toggleSport(selected: Sport[], sport: Sport): Sport[] {
  return selected.includes(sport) ? selected.filter((value) => value !== sport) : [...selected, sport];
}

/**
 * Chips je Sportart; gewählte Chips sind hervorgehoben (`aria-pressed`).
 * Eingaben: aktuelle Filter, Änderungs-Callback. Rückgabe: scrollbare Chip-Leiste.
 * Feature: F-06
 */
export function SportChips({ filters, onChange }: SportChipsProps) {
  const reduceMotion = useReducedMotion();
  return (
    <div className={styles.scroller} role="group" aria-label="Sportarten">
      {sports.map((sport) => {
        const active = filters.sports.includes(sport);
        return (
          <motion.button
            key={sport}
            type="button"
            className={styles.chip}
            aria-pressed={active}
            onClick={() => onChange({ ...filters, sports: toggleSport(filters.sports, sport) })}
            whileTap={reduceMotion ? undefined : { scale: 0.96 }}
          >
            <SportIcon sport={sport} size={15} />
            {sport}
          </motion.button>
        );
      })}
    </div>
  );
}
