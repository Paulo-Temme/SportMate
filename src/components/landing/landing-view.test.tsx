// @vitest-environment jsdom
// Komponententests der Startseite: Hero mit Sportzeile, drei Schritte, Sportarten, Abschluss, Vorschau echter Treffen, Zustände (F-31).
import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { buildViewerEvent, componentTestNow } from '@/components/test-support/sample-viewer-event';
import { sports, type SportEvent } from '@/lib/events/event-model';
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
  buildViewerEvent({
    id: 'demo-volleyball-hafen',
    title: 'Volleyball an der Hafenspitze',
    meetingPoint: 'Flensburg, Hafenspitze (Beispiel)',
    latitude: 54.78783,
    longitude: 9.43715,
  }),
  buildViewerEvent({ id: 'demo-basketball-exe', title: 'Basketball auf dem Exe', sport: 'Basketball', latitude: 54.77952, longitude: 9.42606 }),
  buildViewerEvent({ id: 'demo-lauf-solitude', title: 'Strandlauf Solitüde', sport: 'Laufen', latitude: 54.82271, longitude: 9.4896 }),
];

const sportLines = ['Zusammen auf den Platz.', 'Ein Team. Viele gute Bälle.', 'Zeit für ein paar Körbe.', 'Einfach den Ball ins Spiel bringen.'];

function hero() {
  return screen.getByRole('region', { name: /Die Stadt ist das Spielfeld/ });
}

describe('LandingView', () => {
  it('F-31 AK1: Hero zeigt Hauptüberschrift und eine Sportzeile aus dem Wechsel, ohne weiteren Absatz', () => {
    renderLanding();
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Die Stadt ist das Spielfeld.');
    const line = screen.getByTestId('hero-sport-line');
    expect(sportLines).toContain(line.textContent);
    expect(hero().querySelectorAll('p')).toHaveLength(1);
  });

  it('F-31 AK1: Hero bietet die Einstiege "Treffen entdecken" (nach /entdecken) und "Treffen erstellen" (nach /erstellen)', () => {
    renderLanding();
    expect(within(hero()).getByRole('link', { name: 'Treffen entdecken' }).getAttribute('href')).toBe('/entdecken');
    expect(within(hero()).getByRole('link', { name: 'Treffen erstellen' }).getAttribute('href')).toBe('/erstellen');
  });

  it('F-31 AK1: "So funktioniert\'s" nennt Sportart wählen, Treffen finden, Bin dabei – je Titel und ein Satz', () => {
    renderLanding();
    const section = screen.getByRole('region', { name: "So funktioniert's" });
    const steps = within(section).getAllByRole('listitem');
    expect(steps.map((step) => within(step).getByRole('heading', { level: 3 }).textContent)).toEqual(['Sportart wählen', 'Treffen finden', 'Bin dabei']);
    for (const step of steps) expect(step.querySelectorAll('p')).toHaveLength(1);
  });

  it('F-31 AK1: kein "Flensburg" im Text der Startseite, auch nicht über die Treffen', () => {
    renderLanding({ preview: { status: 'ready', events: upcoming } });
    expect(document.body.textContent).not.toMatch(/Flensburg/);
  });

  it('F-31 AK9: "Was bringt dich in Bewegung?" führt je Sportart nach /entdecken mit vorgewählter Sportart', () => {
    renderLanding({ preview: { status: 'ready', events: upcoming } });
    const section = screen.getByRole('region', { name: 'Was bringt dich in Bewegung?' });
    const links = within(section).getAllByRole('link');
    expect(links).toHaveLength(sports.length);
    expect(links.map((link) => link.getAttribute('href'))).toEqual(sports.map((sport) => `/entdecken?sport=${encodeURIComponent(sport)}`));
    expect(within(section).getByRole('link', { name: /Volleyball/ }).textContent).toMatch(/1 Treffen/);
  });

  it('F-31 AK8: Abschluss "Zusammen geht mehr" mit Einstieg nach /entdecken', () => {
    renderLanding();
    const section = screen.getByRole('region', { name: 'Zusammen geht mehr' });
    expect(within(section).getByRole('link', { name: /Treffen entdecken/ }).getAttribute('href')).toBe('/entdecken');
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

  it('F-31 AK4: eine einzige Treffen-Karte nennt Titel, Uhrzeit und freie Plätze und führt zum Treffen', () => {
    renderLanding({ preview: { status: 'ready', events: upcoming } });
    const caption = screen.getByTestId('preview-caption');
    expect(caption.textContent).toMatch(/Volleyball an der Hafenspitze/);
    expect(caption.textContent).toMatch(/Morgen, 18:00/);
    expect(caption.textContent).toMatch(/5 von 10 Plätzen frei/);
    expect(within(caption).getByRole('link').getAttribute('href')).toBe('/treffen/demo-volleyball-hafen');
  });

  it('F-31 AK5: ohne kommende Treffen zeigt die Vorschau einen ehrlichen Leerzustand und keine Marker', () => {
    renderLanding({ preview: { status: 'ready', events: [] } });
    expect(screen.queryAllByTestId('preview-marker')).toHaveLength(0);
    expect(screen.getByTestId('preview-caption').textContent).toMatch(/Gerade ist kein Treffen geplant/);
    expect(within(hero()).getByRole('link', { name: 'Treffen entdecken' })).toBeTruthy();
    expect(within(hero()).getByRole('link', { name: 'Treffen erstellen' })).toBeTruthy();
  });

  it('F-31 AK5: Ladefehler wird verständlich gemeldet', () => {
    renderLanding({ preview: { status: 'error', events: [] } });
    expect(screen.queryAllByTestId('preview-marker')).toHaveLength(0);
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
    expect(screen.getAllByRole('link', { name: /SportMate, zur Startseite/ })[0].getAttribute('href')).toBe('/');
  });
});
