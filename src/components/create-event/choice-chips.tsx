'use client';
// Auswahl als Chips (Radiogruppe) für Sportart, Niveau und Alter im Erstellen-Assistenten (F-17).
import type { ReactNode } from 'react';
import styles from './create-wizard.module.css';

type ChoiceChipsProps<T extends string> = {
  legend: string;
  name: string;
  options: ReadonlyArray<{ value: T; label: string; icon?: ReactNode }>;
  value: T;
  onChange: (value: T) => void;
  error?: string;
};

/**
 * Radiogruppe mit Chip-Optik; per Pfeiltasten bedienbar wie native Radios.
 * Eingaben: Legende, Name, Optionen, Wert, Callback, Fehlermeldung. Rückgabe: `<fieldset>`.
 * Feature: F-17
 */
export function ChoiceChips<T extends string>({ legend, name, options, value, onChange, error }: ChoiceChipsProps<T>) {
  return (
    <fieldset className={styles.fieldset}>
      <legend className={styles.label}>{legend}</legend>
      <div className={styles.chips}>
        {options.map((option) => (
          <label key={option.value || 'leer'} className={styles.chip}>
            <input type="radio" name={name} value={option.value} checked={value === option.value} onChange={() => onChange(option.value)} />
            <span>
              {option.icon}
              {option.label}
            </span>
          </label>
        ))}
      </div>
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
    </fieldset>
  );
}
