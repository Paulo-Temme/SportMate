'use client';
// Schritt 1 des Assistenten: Sportart und Titel (F-17).
import { SportIcon } from '@/components/event/sport-icon';
import { sports, type Sport } from '@/lib/events/event-model';
import { eventLimits } from '@/lib/events/event-validation';
import { ChoiceChips } from './choice-chips';
import type { DraftErrors, EventDraft } from './event-draft';
import { FormField } from './form-field';
import styles from './create-wizard.module.css';

type StepProps = { draft: EventDraft; errors: DraftErrors; onChange: (patch: Partial<EventDraft>) => void };

/**
 * Felder für Sportart und Titel.
 * Eingaben: Entwurf, Fehler, Änderungs-Callback. Rückgabe: Formularabschnitt.
 * Feature: F-17
 */
export function StepBasics({ draft, errors, onChange }: StepProps) {
  return (
    <div className={styles.stepBody}>
      <ChoiceChips<Sport>
        legend="Sportart"
        name="sportart"
        options={sports.map((sport) => ({ value: sport, label: sport, icon: <SportIcon sport={sport} size={16} /> }))}
        value={draft.sport}
        onChange={(sport) => onChange({ sport })}
        error={errors.sport}
      />
      <FormField label="Titel" error={errors.title} hint={`Kurz und konkret, z. B. „Volleyball am Abend“ (${eventLimits.titleMin}–${eventLimits.titleMax} Zeichen)`}>
        {(field) => (
          <input
            {...field}
            className={styles.input}
            value={draft.title}
            maxLength={eventLimits.titleMax + 20}
            onChange={(event) => onChange({ title: event.target.value })}
          />
        )}
      </FormField>
    </div>
  );
}
