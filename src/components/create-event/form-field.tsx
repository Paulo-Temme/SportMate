'use client';
// Formularfeld mit Beschriftung, Hinweis und Fehlermeldung direkt am Feld, per aria-describedby verknüpft (F-17).
import { useId, type ReactNode } from 'react';
import styles from './create-wizard.module.css';

type FormFieldProps = {
  label: string;
  error?: string;
  hint?: string;
  children: (props: { id: string; 'aria-invalid': boolean; 'aria-describedby'?: string }) => ReactNode;
};

/**
 * Rahmen für ein Eingabefeld; das Feld selbst kommt als Render-Funktion mit passenden ARIA-Attributen.
 * Eingaben: Beschriftung, Fehlermeldung, Hinweis, Render-Funktion. Rückgabe: Feldgruppe.
 * Feature: F-17
 */
export function FormField({ label, error, hint, children }: FormFieldProps) {
  const id = useId();
  const messageId = error || hint ? `${id}-meldung` : undefined;
  return (
    <div className={styles.field} data-invalid={Boolean(error)}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      {children({ id, 'aria-invalid': Boolean(error), 'aria-describedby': messageId })}
      {(error || hint) && (
        <p id={messageId} className={error ? styles.error : styles.hint} role={error ? 'alert' : undefined}>
          {error ?? hint}
        </p>
      )}
    </div>
  );
}
