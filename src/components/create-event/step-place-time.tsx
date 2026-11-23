'use client';
// Schritt 2 des Assistenten: Ort per Karte mit fester Nadel, kurzer Ortsname, Datum, Beginn und Ende (F-17).
import { useCallback } from 'react';
import { LocationPicker } from '@/components/map/location-picker';
import type { GeoPoint } from '@/lib/events/event-model';
import type { DraftErrors, EventDraft } from './event-draft';
import { FormField } from './form-field';
import styles from './create-wizard.module.css';

type StepProps = { draft: EventDraft; errors: DraftErrors; onChange: (patch: Partial<EventDraft>) => void };

/**
 * Ortswahl und Termin.
 * Eingaben: Entwurf, Fehler, Änderungs-Callback. Rückgabe: Formularabschnitt mit großer Karte.
 * Feature: F-17
 */
export function StepPlaceTime({ draft, errors, onChange }: StepProps) {
  const moveTo = useCallback((point: GeoPoint) => onChange(point), [onChange]);
  return (
    <div className={styles.placeStep}>
      <LocationPicker value={{ latitude: draft.latitude, longitude: draft.longitude }} onChange={moveTo} error={errors.latitude ?? errors.longitude} />
      <div className={styles.stepBody}>
        <FormField label="Ort (kurz)" error={errors.locationName} hint="Erscheint in der Liste, z. B. „Volkspark“. Optional.">
          {(field) => <input {...field} className={styles.input} value={draft.locationName} onChange={(event) => onChange({ locationName: event.target.value })} />}
        </FormField>
        <FormField label="Datum" error={errors.startsAt}>
          {(field) => <input {...field} type="date" className={styles.input} value={draft.date} onChange={(event) => onChange({ date: event.target.value })} />}
        </FormField>
        <div className={styles.row}>
          <FormField label="Beginn">
            {(field) => <input {...field} type="time" className={styles.input} value={draft.startTime} onChange={(event) => onChange({ startTime: event.target.value })} />}
          </FormField>
          <FormField label="Ende" error={errors.endsAt}>
            {(field) => <input {...field} type="time" className={styles.input} value={draft.endTime} onChange={(event) => onChange({ endTime: event.target.value })} />}
          </FormField>
        </div>
      </div>
    </div>
  );
}
