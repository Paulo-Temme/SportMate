// @vitest-environment jsdom
// Komponententests der Startseite: Erklärung, drei Schritte, zwei Einstiege, Vorschau mit echten Treffen und Leerzustand (F-31).
import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { buildViewerEvent, componentTestNow } from '@/components/test-support/sample-viewer-event';
import type { SportEvent } from '@/lib/events/event-model';
import { LandingView, type LandingViewProps } from './landing-view';

afterEach(cleanup);

const guest: LandingViewProps['viewer'] = { ready: true, displayName: null };

function renderLanding(overrides: Partial<LandingViewProps> = {}) {
  const props: LandingViewProps = {
    preview: { status: 'ready', events: [] },
    viewer: guest,
    now: componentTestNow,
    ...overrides,
  };
  return render(<LandingView {...props} />);
}

const upcoming: SportEvent[] = [
  buildViewerEvent({ id: 'demo-volleyball-hafen', title: 'Volleyball an der Hafenspitze', latitude: 54.78783, longitude: 9.43715 }),
  buildViewerEvent({ id: 'demo-basketball-exe', title: 'Basketball auf dem Exe', sport: 'Basketball', latitude: 54.77952, longitude: 9.42606 }),
  buildViewerEvent({ id: 'demo-lauf-solitude', title: 'Strandlauf Solitüde', sport: 'Laufen', latitude: 54.82271, longitude: 9.4896 }),
];

describe('LandingView', () => {
  it('F-31 AK1: erklärt in der Hauptüberschrift, worum es geht', () => {
    renderLanding();
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading.textContent).toMatch(/Sport in Flensburg/);
  });

  it('F-31 AK1: bietet die Einstiege "Treffen entdecken" (nach /entdecken) und "Treffen erstellen" (nach /erstellen)', () => {
    renderLanding();
    expect(screen.getByRole('link', { name: 'Treffen entdecken' }).getAttribute('href')).toBe('/entdecken');
    expect(screen.getByRole('link', { name: 'Treffen erstellen' }).getAttribute('href')).toBe('/erstellen');
  });

  it('F-31 AK1: "So funktioniert\'s" nennt drei Schritte in der Reihenfolge Finden, Mitmachen, Spielen', () => {
    renderLanding();
    const section = screen.getByRole('region', { name: "So funktioniert's" });
    const steps = within(section).getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent);
    expect(steps).toEqual(['Finden', 'Mitmachen', 'Spielen']);
  });

  it('F-31 AK8: sagt ehrlich, was SportMate nicht ist', () => {
    renderLanding();
    const section = screen.getByRole('region', { name: 'Was SportMate nicht ist' });
    expect(within(section).getByText(/Kein Verein/)).toBeTruthy();
    expect(within(section).getByText(/Kein Gruppenchat/)).toBeTruthy();
    expect(within(section).getByText(/Keine Hallenbuchung/)).toBeTruthy();
  });

  it('F-31 AK8: Fußzeile nennt Hochschulprojekt, Kartendaten-Lizenz und fiktive Demo-Daten', () => {
    renderLanding();
    const footer = screen.getByRole('contentinfo');
    expect(within(footer).getByText(/Hochschulprojekt WS 2026\/27/)).toBeTruthy();
    expect(within(footer).getByRole('link', { name: /OpenStreetMap/ }).getAttribute('href')).toBe('https://www.openstreetmap.org/copyright');
    expect(within(footer).getByRole('link', { name: /OpenFreeMap/ })).toBeTruthy();
    expect(within(footer).getByText(/fiktiv/)).toBeTruthy();
  });

  it('F-31 AK4: Vorschau zeigt kommende Treffen als Marker, die zu den Details führen', () => {
    renderLanding({ preview: { status: 'ready', events: upcoming } });
    const markers = screen.getAllByTestId('preview-marker');
    expect(markers).toHaveLength(3);
    expect(markers[0].getAttribute('href')).toBe('/treffen/demo-volleyball-hafen');
    expect(markers[0].getAttribute('aria-label')).toMatch(/Volleyball an der Hafenspitze, Morgen 18:00 Uhr/);
  });

  it('F-31 AK4: die Vorschau beschreibt das hervorgehobene Treffen mit Ort und freien Plätzen', () => {
    renderLanding({ preview: { status: 'ready', events: upcoming } });
    const caption = screen.getByTestId('preview-caption');
    expect(caption.textContent).toMatch(/Volleyball an der Hafenspitze/);
    expect(caption.textContent).toMatch(/5 von 10 Plätzen frei/);
  });

  it('F-31 AK5: ohne kommende Treffen zeigt die Vorschau einen ehrlichen Leerzustand und keine Marker', () => {
    renderLanding({ preview: { status: 'ready', events: [] } });
    expect(screen.queryAllByTestId('preview-marker')).toHaveLength(0);
    expect(screen.getByTestId('preview-caption').textContent).toMatch(/Gerade ist kein Treffen geplant/);
    expect(screen.getByRole('link', { name: 'Treffen entdecken' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Treffen erstellen' })).toBeTruthy();
  });

  it('F-31 AK5: Ladefehler wird verständlich gemeldet', () => {
    renderLanding({ preview: { status: 'error', events: [] } });
    expect(screen.getByTestId('preview-caption').textContent).toMatch(/konnten gerade nicht geladen werden/);
  });

  it('F-31 AK7: Kopf zeigt Gästen "Anmelden", angemeldeten Personen "Profil"', () => {
    renderLanding();
    expect(screen.getByRole('link', { name: 'Anmelden' }).getAttribute('href')).toBe('/anmelden');
    cleanup();
    renderLanding({ viewer: { ready: true, displayName: 'Lea' } });
    expect(screen.queryByRole('link', { name: 'Anmelden' })).toBeNull();
    expect(screen.getByRole('link', { name: 'Profil' }).getAttribute('href')).toBe('/profil');
  });

  it('F-31 AK7: Logo führt zur Startseite', () => {
    renderLanding();
    expect(screen.getByRole('link', { name: /SportMate, zur Startseite/ }).getAttribute('href')).toBe('/');
  });
});
