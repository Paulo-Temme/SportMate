// Tests der Kartenfarben: Positron-Layer werden an die App-Tokens angepasst, POI-Symbole ausgeblendet (F-08).
import { describe, expect, it } from 'vitest';
import { buildMapTheme } from './map-theme';

const layers = [
  { id: 'background', type: 'background' },
  { id: 'water', type: 'fill' },
  { id: 'park', type: 'fill' },
  { id: 'highway_minor', type: 'line' },
  { id: 'highway_major_casing', type: 'line' },
  { id: 'poi_label', type: 'symbol' },
  { id: 'place_city', type: 'symbol' },
];

describe('buildMapTheme', () => {
  it('F-08 AK1: Wasser bläulich-grau, Grünflächen blass, Straßen weiß', () => {
    const theme = buildMapTheme(layers);
    expect(theme.paint).toContainEqual({ layerId: 'water', property: 'fill-color', value: '#DDE4E8' });
    expect(theme.paint).toContainEqual({ layerId: 'park', property: 'fill-color', value: '#E9EEE4' });
    expect(theme.paint).toContainEqual({ layerId: 'highway_minor', property: 'line-color', value: '#FFFFFF' });
    expect(theme.paint).toContainEqual({ layerId: 'highway_major_casing', property: 'line-color', value: '#E3E0D9' });
  });

  it('F-08 AK1: POI-Symbole werden ausgeblendet, Ortsnamen in Sekundärtextfarbe', () => {
    const theme = buildMapTheme(layers);
    expect(theme.hidden).toEqual(['poi_label']);
    expect(theme.paint).toContainEqual({ layerId: 'place_city', property: 'text-color', value: '#5B6068' });
  });
});
