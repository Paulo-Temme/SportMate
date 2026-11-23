'use client';
// Schritt 3 des Assistenten: Plätze, Mindestzahl, Niveau, Alter, Kosten, Mitbringen, Treffpunkt, Beschreibung (F-17, F-13, F-25).
import { ageGroups, levels, type AgeGroup, type Level } from '@/lib/events/event-model';
import { eventLimits } from '@/lib/events/event-validation';
import { ChoiceChips } from './choice-chips';
import type { DraftErrors, EventDraft } from './event-draft';
import { FormField } from './form-field';
import styles from './create-wizard.module.css';

type StepProps = { draft: EventDraft; errors: DraftErrors; onChange: (patch: Partial<EventDraft>) => void };

const ageOptions: Array<{ value: AgeGroup; label: string }> = [
  { value: '', label: 'Offen für alle' },
  ...ageGroups.map((age) => ({ value: age, label: age })),
];

/**
 * Details des Treffens.
 * Eingaben: Entwurf, Fehler, Änderungs-Callback. Rückgabe: Formularabschnitt.
 * Feature: F-17
 */
export function StepDetails({ draft, errors, onChange }: StepProps) {
  return (
    <div className={styles.stepBody}>
      <FormField label="Treffpunkt" error={errors.meetingPoint} hint="So findet man euch, z. B. „Halle Sandberg, Eingang Nord“.">
        {(field) => <textarea {...field} rows={2} className={styles.textarea} value={draft.meetingPoint} onChange={(event) => onChange({ meetingPoint: event.target.value })} />}
      </FormField>
      <div className={styles.row}>
        <FormField label="Plätze insgesamt" error={errors.capacity} hint={`${eventLimits.capacityMin} bis ${eventLimits.capacityMax}, du zählst mit`}>
          {(field) => <input {...field} type="number" inputMode="numeric" min={eventLimits.capacityMin} max={eventLimits.capacityMax} className={styles.input} value={draft.capacity} onChange={(event) => onChange({ capacity: event.target.value })} />}
        </FormField>
        <FormField label="Mindestens" error={errors.minParticipants} hint="Ab dann findet es statt">
          {(field) => <input {...field} type="number" inputMode="numeric" min={2} className={styles.input} value={draft.minParticipants} onChange={(event) => onChange({ minParticipants: event.target.value })} />}
        </FormField>
      </div>
      <ChoiceChips<Level> legend="Niveau" name="niveau" options={levels.map((level) => ({ value: level, label: level }))} value={draft.level} onChange={(level) => onChange({ level })} error={errors.level} />
      <ChoiceChips<AgeGroup> legend="Alter" name="alter" options={ageOptions} value={draft.ageGroup} onChange={(ageGroup) => onChange({ ageGroup })} error={errors.ageGroup} />
      <FormField label="Kosten pro Person in €" error={errors.costCents} hint="Leer oder 0 heißt kostenlos, z. B. 3,50">
        {(field) => <input {...field} inputMode="decimal" className={styles.input} value={draft.cost} placeholder="0" onChange={(event) => onChange({ cost: event.target.value })} />}
      </FormField>
      <FormField label="Mitbringen" error={errors.bringAlong} hint="Optional, z. B. Hallenschuhe, Wasser">
        {(field) => <input {...field} className={styles.input} value={draft.bringAlong} onChange={(event) => onChange({ bringAlong: event.target.value })} />}
      </FormField>
      <FormField label="Was erwartet dich?" error={errors.description} hint={`Optional, höchstens ${eventLimits.descriptionMax} Zeichen`}>
        {(field) => <textarea {...field} rows={3} className={styles.textarea} value={draft.description} onChange={(event) => onChange({ description: event.target.value })} />}
      </FormField>
    </div>
  );
}
