// Erzeugt eine MapLibre-Karte im Positron-Stil, an die App-Tokens angepasst, ohne Standard-Bedienelemente (F-08, F-17).
import * as maplibregl from 'maplibre-gl';
import { buildMapTheme } from '@/lib/map/map-theme';

const styleUrl = 'https://tiles.openfreemap.org/styles/positron';

maplibregl.setWorkerUrl(new URL('maplibre-gl/dist/maplibre-gl-worker.mjs', import.meta.url).href);

function applyTheme(map: maplibregl.Map): void {
  const layers = map.getStyle().layers.map((layer) => ({ id: layer.id, type: layer.type }));
  const theme = buildMapTheme(layers);
  theme.hidden.forEach((layerId) => map.setLayoutProperty(layerId, 'visibility', 'none'));
  theme.paint.forEach(({ layerId, property, value }) => {
    try {
      map.setPaintProperty(layerId, property as Parameters<maplibregl.Map['setPaintProperty']>[1], value);
    } catch {
      // Ein Layer ohne diese Eigenschaft behält seine Stilfarbe; die Karte bleibt nutzbar.
    }
  });
}

/**
 * Baut die Karte. Rotation ist aus, die Attribution kompakt; Stilfehler meldet `onUnavailable`.
 * Eingaben: Container, Mittelpunkt, Zoom, Callback bei Ausfall. Rückgabe: Karte.
 * Fehler: wirft, wenn WebGL fehlt (MapLibre-Konstruktor).
 * Feature: F-08
 */
export function createThemedMap(
  container: HTMLElement,
  center: { latitude: number; longitude: number },
  zoom: number,
  onUnavailable: () => void,
): maplibregl.Map {
  const map = new maplibregl.Map({
    container,
    style: styleUrl,
    center: [center.longitude, center.latitude],
    zoom,
    attributionControl: { compact: true },
    pitchWithRotate: false,
    dragRotate: false,
  });
  map.touchZoomRotate.disableRotation();
  map.on('style.load', () => applyTheme(map));
  // Die kompakte Attribution startet aufgeklappt; zugeklappt bleibt sie dezent und per Info-Knopf lesbar.
  map.on('load', () => container.querySelector('.maplibregl-ctrl-attrib')?.classList.remove('maplibregl-compact-show'));
  // Ohne geladenen Stil (Netz weg, Dienst gestört) gibt es keine Karte; einzelne fehlende Kacheln sind kein Ausfall.
  map.on('error', () => {
    if (!map.isStyleLoaded()) onUnavailable();
  });
  return map;
}

/**
 * Prüft, ob die Person reduzierte Bewegung wünscht.
 * Rückgabe: `true`, wenn Animationen der Karte entfallen sollen.
 * Feature: F-08
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
