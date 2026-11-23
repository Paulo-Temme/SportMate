// Leitet aus den Layern des Positron-Stils die Farbanpassungen an die App-Tokens ab, ohne MapLibre zu kennen (F-08).

/** Minimale Beschreibung eines Stil-Layers. */
export type MapLayerDescription = { id: string; type: string };

/** Eine Farbänderung an einem Layer. */
export type PaintOverride = { layerId: string; property: string; value: string };

/** Alle Anpassungen: Farben und auszublendende Layer. */
export type MapTheme = { paint: PaintOverride[]; hidden: string[] };

const colors = {
  background: '#F2F1EC',
  water: '#DDE4E8',
  waterway: '#CFD9DE',
  green: '#E9EEE4',
  building: '#EAE8E2',
  road: '#FFFFFF',
  casing: '#E3E0D9',
  boundary: '#D6D3CB',
  label: '#5B6068',
  halo: '#F7F6F2',
} as const;

const hiddenSymbolPattern = /poi|housenumber|transit|rail|aeroway|airport|shield|ferry/;
const greenPattern = /park|wood|grass|landcover|forest|cemetery|pitch|garden/;

function describeFill(id: string): PaintOverride[] {
  if (id.includes('water')) return [{ layerId: id, property: 'fill-color', value: colors.water }];
  if (greenPattern.test(id)) return [{ layerId: id, property: 'fill-color', value: colors.green }];
  if (id.includes('building')) return [{ layerId: id, property: 'fill-color', value: colors.building }];
  return [];
}

function describeLine(id: string): PaintOverride[] {
  if (id.includes('waterway')) return [{ layerId: id, property: 'line-color', value: colors.waterway }];
  if (id.includes('boundary')) return [{ layerId: id, property: 'line-color', value: colors.boundary }];
  if (!/highway|road|street|bridge|tunnel/.test(id)) return [];
  return [{ layerId: id, property: 'line-color', value: id.includes('casing') ? colors.casing : colors.road }];
}

function describeSymbol(id: string): PaintOverride[] {
  return [
    { layerId: id, property: 'text-color', value: colors.label },
    { layerId: id, property: 'text-halo-color', value: colors.halo },
  ];
}

function describeLayer(layer: MapLayerDescription): PaintOverride[] {
  switch (layer.type) {
    case 'background':
      return [{ layerId: layer.id, property: 'background-color', value: colors.background }];
    case 'fill':
      return describeFill(layer.id);
    case 'line':
      return describeLine(layer.id);
    case 'symbol':
      return describeSymbol(layer.id);
    default:
      return [];
  }
}

/**
 * Berechnet die Farbanpassungen für die Layer eines Kartenstils.
 * Eingaben: Layer mit Kennung und Typ, wie MapLibre sie nach dem Laden liefert.
 * Rückgabe: Farbänderungen je Layer und Liste der auszublendenden Symbol-Layer (POI, Hausnummern, ÖPNV).
 * Feature: F-08
 */
export function buildMapTheme(layers: readonly MapLayerDescription[]): MapTheme {
  const hidden = layers.filter((layer) => layer.type === 'symbol' && hiddenSymbolPattern.test(layer.id)).map((layer) => layer.id);
  const paint = layers.filter((layer) => !hidden.includes(layer.id)).flatMap(describeLayer);
  return { paint, hidden };
}
