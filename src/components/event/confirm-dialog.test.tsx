// @vitest-environment jsdom
// Komponententests des Bestätigungsdialogs: Fokusfalle, Fokus-Rückgabe, Escape während laufender Aktion (F-18, F-23, REV-05).
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ConfirmDialog } from './confirm-dialog';

afterEach(cleanup);

function Harness({ busy = false, onCancel = vi.fn() }: { busy?: boolean; onCancel?: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Treffen absagen
      </button>
      <button type="button">Anderes Element</button>
      <ConfirmDialog
        open={open}
        title="Treffen absagen?"
        description="Alle Teilnehmenden sehen danach Abgesagt."
        confirmLabel="Ja, absagen"
        busy={busy}
        onConfirm={() => setOpen(false)}
        onCancel={() => {
          onCancel();
          setOpen(false);
        }}
      />
    </>
  );
}

function openDialog() {
  const trigger = screen.getByRole('button', { name: 'Treffen absagen' });
  trigger.focus();
  fireEvent.click(trigger);
  return trigger;
}

describe('ConfirmDialog', () => {
  it('F-18 AK1 (REV-05): Tab und Shift+Tab bleiben im Dialog', () => {
    render(<Harness />);
    openDialog();
    const cancel = screen.getByRole('button', { name: 'Abbrechen' });
    const confirm = screen.getByRole('button', { name: 'Ja, absagen' });
    expect(document.activeElement).toBe(cancel);
    fireEvent.keyDown(cancel, { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(confirm);
    fireEvent.keyDown(confirm, { key: 'Tab' });
    expect(document.activeElement).toBe(cancel);
  });

  it('F-18 AK1 (REV-05): nach dem Schließen liegt der Fokus wieder auf dem Auslöser', () => {
    render(<Harness />);
    const trigger = openDialog();
    fireEvent.click(screen.getByRole('button', { name: 'Abbrechen' }));
    expect(document.activeElement).toBe(trigger);
  });

  it('F-18 AK1 (REV-05): Escape bricht ab, außer während die Aktion läuft', () => {
    const onCancel = vi.fn();
    const { unmount } = render(<Harness onCancel={onCancel} />);
    openDialog();
    fireEvent.keyDown(document.activeElement ?? document.body, { key: 'Escape' });
    expect(onCancel).toHaveBeenCalledTimes(1);
    unmount();

    const blocked = vi.fn();
    render(<Harness busy onCancel={blocked} />);
    openDialog();
    fireEvent.keyDown(document.activeElement ?? document.body, { key: 'Escape' });
    expect(blocked).not.toHaveBeenCalled();
    expect(screen.getByRole('alertdialog')).toBeTruthy();
  });
});
