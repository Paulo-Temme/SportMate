// @vitest-environment jsdom
// Komponententests der Treffen-Karte in der Liste: Plätze, Altersangabe, Kosten und Teilnahme-Button (F-05, F-12, F-13, F-22).
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { buildViewerEvent, componentTestNow } from '@/components/test-support/sample-viewer-event';
import { EventCard } from './event-card';

afterEach(cleanup);

function renderCard(overrides = {}, handlers = { onSelect: vi.fn(), onJoin: vi.fn() }) {
  render(<EventCard event={buildViewerEvent(overrides)} now={componentTestNow} selected={false} {...handlers} />);
  return handlers;
}

describe('EventCard', () => {
  it('F-05 AK2: zeigt die freien Plätze als "5 von 10 Plätzen frei"', () => {
    renderCard();
    expect(screen.getByText('5 von 10 Plätzen frei')).toBeTruthy();
  });

  it('F-12 AK2: beschriftet die Altersangabe eindeutig mit Jahren', () => {
    renderCard();
    expect(screen.getByText(/20–25 Jahre/)).toBeTruthy();
  });

  it('F-13 AK1: zeigt "Kostenlos" bei Kosten 0', () => {
    renderCard();
    expect(screen.getByText('Kostenlos')).toBeTruthy();
  });

  it('F-22 AK5: trägt bei freien Plätzen einen sichtbaren Button "Jetzt teilnehmen"', () => {
    const handlers = renderCard();
    fireEvent.click(screen.getByRole('button', { name: /Jetzt teilnehmen/ }));
    expect(handlers.onJoin).toHaveBeenCalledTimes(1);
    expect(handlers.onSelect).not.toHaveBeenCalled();
  });

  it('F-22 AK2: ausgebuchtes Treffen zeigt "Ausgebucht" ohne Beitrittsmöglichkeit', () => {
    const handlers = renderCard({ participantCount: 10 });
    const button = screen.getByRole('button', { name: /Ausgebucht/ });
    expect(button.hasAttribute('disabled')).toBe(true);
    fireEvent.click(button);
    expect(handlers.onJoin).not.toHaveBeenCalled();
  });

  it('F-22 AK1: wer schon teilnimmt, sieht "Dabei" statt des Buttons', () => {
    renderCard({ isViewerParticipant: true, participantCount: 6 });
    expect(screen.getByText('Dabei')).toBeTruthy();
    expect(screen.queryByRole('button', { name: /Jetzt teilnehmen/ })).toBeNull();
  });

  it('F-08 AK2: Klick auf die Karte wählt das Treffen aus', () => {
    const handlers = renderCard();
    fireEvent.click(screen.getByRole('link', { name: /Volleyball am Abend/ }));
    expect(handlers.onSelect).toHaveBeenCalledWith('t-volleyball-1');
  });
});
