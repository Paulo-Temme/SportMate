'use client';
// Filterbereich als Dialog: Zeitraum (Heute, Morgen, Diese Woche, Datum), Niveau, Altersgruppe, Zurücksetzen (F-06, F-07).
import { X } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useId, useRef } from 'react';
import { useDialogFocus } from '@/hooks/use-dialog-focus';
import { ageGroups, emptyFilters, levels, type EventFilters, type PeriodFilter } from '@/lib/events/event-model';
import styles from './filter-panel.module.css';

type FilterPanelProps = {
  open: boolean;
  filters: EventFilters;
  onChange: (filters: EventFilters) => void;
  onClose: () => void;
  resultCount: number;
};

type Option = { value: string; label: string };

const periodOptions: Option[] = [
  { value: '', label: 'Alle' },
  { value: 'today', label: 'Heute' },
  { value: 'tomorrow', label: 'Morgen' },
  { value: 'week', label: 'Diese Woche' },
];

const levelOptions: Option[] = [
  { value: '', label: 'Beliebig' },
  ...levels.filter((level) => level !== 'Alle Niveaus').map((level) => ({ value: level, label: level })),
];

const ageOptions: Option[] = [{ value: '', label: 'Beliebig' }, ...ageGroups.map((age) => ({ value: age, label: age }))];

function ChoiceGroup({ legend, name, options, value, onSelect }: { legend: string; name: string; options: Option[]; value: string; onSelect: (value: string) => void }) {
  return (
    <fieldset className={styles.group}>
      <legend className={styles.legend}>{legend}</legend>
      <div className={styles.choices}>
        {options.map((option) => (
          <label key={option.value || 'alle'} className={styles.choice}>
            <input type="radio" name={name} value={option.value} checked={value === option.value} onChange={() => onSelect(option.value)} />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function PanelBody({ filters, onChange, onClose, resultCount }: Omit<FilterPanelProps, 'open'>) {
  const name = useId();
  const dateId = useId();
  return (
    <>
      <div className={styles.header}>
        <h2 className={styles.title}>Filter</h2>
        <button type="button" className={styles.close} onClick={onClose} aria-label="Filter schließen">
          <X size={20} aria-hidden="true" />
        </button>
      </div>
      <div className={styles.body}>
        <ChoiceGroup
          legend="Zeitraum"
          name={`${name}-period`}
          options={periodOptions}
          value={filters.period === 'date' ? 'date' : filters.period}
          onSelect={(value) => onChange({ ...filters, period: value as PeriodFilter, date: '' })}
        />
        <div className={styles.dateRow}>
          <label htmlFor={dateId} className={styles.dateLabel}>
            Datum
          </label>
          <input
            id={dateId}
            type="date"
            className={styles.date}
            value={filters.period === 'date' ? filters.date : ''}
            onChange={(event) =>
              onChange({ ...filters, period: event.target.value ? 'date' : '', date: event.target.value })
            }
          />
        </div>
        <ChoiceGroup legend="Niveau" name={`${name}-level`} options={levelOptions} value={filters.level} onSelect={(level) => onChange({ ...filters, level })} />
        <ChoiceGroup legend="Altersgruppe" name={`${name}-age`} options={ageOptions} value={filters.ageGroup} onSelect={(ageGroup) => onChange({ ...filters, ageGroup })} />
      </div>
      <div className={styles.footer}>
        <button type="button" className={styles.reset} onClick={() => onChange(emptyFilters)}>
          Filter zurücksetzen
        </button>
        <button type="button" className={styles.apply} onClick={onClose}>
          <span className="tabular">{resultCount}</span> Treffer anzeigen
        </button>
      </div>
    </>
  );
}

/**
 * Dialog mit allen weiteren Filtern. Änderungen wirken sofort auf Karte und Liste; Escape oder Hintergrund schließt.
 * Eingaben: offen ja/nein, Filter, Änderungs- und Schließen-Callback, aktuelle Trefferzahl.
 * Rückgabe: Dialog oder nichts.
 * Feature: F-06, F-07
 */
export function FilterPanel({ open, filters, onChange, onClose, resultCount }: FilterPanelProps) {
  const reduceMotion = useReducedMotion();
  const panel = useRef<HTMLDivElement>(null);

  useDialogFocus({ open, container: panel, onEscape: onClose });

  return (
    <AnimatePresence>
      {open && (
        <div className={styles.layer}>
          <motion.div
            className={styles.backdrop}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
          />
          <motion.div
            ref={panel}
            className={styles.panel}
            role="dialog"
            aria-modal="true"
            aria-label="Filter"
            tabIndex={-1}
            initial={reduceMotion ? false : { y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { y: 40, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 420, damping: 40 }}
          >
            <PanelBody filters={filters} onChange={onChange} onClose={onClose} resultCount={resultCount} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
