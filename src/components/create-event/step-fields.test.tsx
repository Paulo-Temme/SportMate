// @vitest-environment jsdom
// Komponententests der Assistenten-Schritte: Fehlermeldungen erscheinen direkt am Feld und sind verknüpft (F-17).
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createEmptyDraft, findStepErrors } from './event-draft';
import { StepBasics } from './step-basics';
import { StepDetails } from './step-details';

afterEach(cleanup);

const now = new Date('2026-11-25T10:00:00');

describe('Erstellen-Assistent, Validierung am Feld', () => {
  it('F-17 AK2: fehlender Treffpunkt markiert das Feld und verknüpft die Meldung', () => {
    const draft = createEmptyDraft(now);
    const errors = findStepErrors({ ...draft, title: 'Volleyball am Abend' }, 3, now);
    render(<StepDetails draft={draft} errors={errors} onChange={vi.fn()} />);
    const field = screen.getByLabelText('Treffpunkt');
    expect(field.getAttribute('aria-invalid')).toBe('true');
    const message = document.getElementById(field.getAttribute('aria-describedby') ?? '');
    expect(message?.textContent).toMatch(/Bitte den Treffpunkt/);
  });

  it('F-17 AK4: Kapazität 51 zeigt die Grenze am Feld "Plätze insgesamt"', () => {
    const draft = { ...createEmptyDraft(now), title: 'Volleyball am Abend', meetingPoint: 'Halle Sandberg', capacity: '51' };
    render(<StepDetails draft={draft} errors={findStepErrors(draft, 3, now)} onChange={vi.fn()} />);
    expect(screen.getByLabelText('Plätze insgesamt').getAttribute('aria-invalid')).toBe('true');
    expect(screen.getByText(/zwischen 2 und 50/)).toBeTruthy();
  });

  it('F-17 AK1: Eingaben in Schritt 1 melden Sportart und Titel', () => {
    const onChange = vi.fn();
    render(<StepBasics draft={createEmptyDraft(now)} errors={{}} onChange={onChange} />);
    fireEvent.click(screen.getByRole('radio', { name: 'Volleyball' }));
    fireEvent.change(screen.getByLabelText('Titel'), { target: { value: 'Volleyball am Abend' } });
    expect(onChange).toHaveBeenCalledWith({ sport: 'Volleyball' });
    expect(onChange).toHaveBeenCalledWith({ title: 'Volleyball am Abend' });
  });
});
