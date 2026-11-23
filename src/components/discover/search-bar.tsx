'use client';
// Schwebende Suchleiste (Pille) mit Freitextsuche und Filter-Button samt Zähler aktiver Filter (F-09, F-06, F-07).
import { Search, SlidersHorizontal, X } from 'lucide-react';
import type { EventFilters } from '@/lib/events/event-model';
import styles from './search-bar.module.css';

type SearchBarProps = { filters: EventFilters; onChange: (filters: EventFilters) => void; onOpenFilters: () => void };

function countPanelFilters(filters: EventFilters): number {
  return [filters.period, filters.level, filters.ageGroup].filter(Boolean).length;
}

/**
 * Suchfeld für Titel, Ort und Sportart plus Button zum Filterbereich.
 * Eingaben: aktuelle Filter, Änderungs-Callback, Callback zum Öffnen der Filter. Rückgabe: Suchformular.
 * Feature: F-09
 */
export function SearchBar({ filters, onChange, onOpenFilters }: SearchBarProps) {
  const active = countPanelFilters(filters);
  return (
    <form className={styles.bar} role="search" onSubmit={(event) => event.preventDefault()}>
      <Search size={18} className={styles.searchIcon} aria-hidden="true" />
      <input
        type="search"
        className={styles.input}
        placeholder="Sportart, Ort oder Titel"
        aria-label="Treffen suchen"
        value={filters.query}
        onChange={(event) => onChange({ ...filters, query: event.target.value })}
        enterKeyHint="search"
      />
      {filters.query && (
        <button type="button" className={styles.clear} aria-label="Suche leeren" onClick={() => onChange({ ...filters, query: '' })}>
          <X size={16} aria-hidden="true" />
        </button>
      )}
      <span className={styles.divider} aria-hidden="true" />
      <button
        type="button"
        className={styles.filterButton}
        onClick={onOpenFilters}
        aria-label={active > 0 ? `Filter, ${active} aktiv` : 'Filter'}
        data-active={active > 0}
      >
        <SlidersHorizontal size={18} aria-hidden="true" />
        {active > 0 && <span className={`${styles.badge} tabular`}>{active}</span>}
      </button>
    </form>
  );
}
