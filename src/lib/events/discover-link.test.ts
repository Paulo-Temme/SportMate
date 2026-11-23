// Tests des Einstiegs in Entdecken mit vorgewählter Sportart: Adresse bauen und Parameter lesen (F-31).
import { describe, expect, it } from 'vitest';
import { sports } from './event-model';
import { buildDiscoverHref, readSportParam } from './discover-link';

describe('F-31 AK9: Sportart-Auswahl führt nach /entdecken mit Filter', () => {
  it('F-31 AK9: ohne Sportart führt der Link schlicht nach /entdecken', () => {
    expect(buildDiscoverHref()).toBe('/entdecken');
  });

  it('F-31 AK9: mit Sportart hängt der Link den Parameter kodiert an', () => {
    expect(buildDiscoverHref('Volleyball')).toBe('/entdecken?sport=Volleyball');
    expect(buildDiscoverHref('Fußball')).toBe('/entdecken?sport=Fu%C3%9Fball');
  });

  it('F-31 AK9: jede Sportart übersteht den Weg Link → Parameter unverändert', () => {
    for (const sport of sports) {
      const value = new URL(buildDiscoverHref(sport), 'http://localhost').searchParams.get('sport');
      expect(readSportParam(value)).toBe(sport);
    }
  });

  it('F-31 AK9: unbekannte, leere oder fehlende Werte wählen keine Sportart', () => {
    expect(readSportParam('Curling')).toBeNull();
    expect(readSportParam('volleyball')).toBeNull();
    expect(readSportParam('')).toBeNull();
    expect(readSportParam(null)).toBeNull();
  });
});
