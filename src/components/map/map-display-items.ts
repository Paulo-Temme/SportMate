// Macht aus Markern und ihrer Bildschirmlage die zu zeichnenden Einzel- und Gruppen-Marker, gemeinsam für beide Karten (F-08).
import { groupOverlappingMarkers, type CollisionBox, type ScreenPosition } from '@/lib/map/marker-grouping';
import type { MapDisplayItem, MapMarkerItem } from './map-marker-item';

/** Fläche einer Marker-Pille samt Spitze und etwas Luft; breit genug auch für die Gruppen-Pille. */
export const markerCollisionBox: CollisionBox = { width: 96, height: 40 };

/**
 * Gruppiert überlappende Marker. Das ausgewählte Treffen bleibt immer einzeln sichtbar und liegt obenauf.
 * Eingaben: Marker, Projektion auf Bildschirmpixel. Rückgabe: Einzel- und Gruppen-Marker.
 * Feature: F-08
 */
export function buildDisplayItems(markers: MapMarkerItem[], project: (item: MapMarkerItem) => ScreenPosition): MapDisplayItem[] {
  const selected = markers.filter((item) => item.state === 'selected');
  const others = markers.filter((item) => item.state !== 'selected');
  const groups = groupOverlappingMarkers(others, project, markerCollisionBox);
  const items: MapDisplayItem[] = groups.map((group) => {
    if (group.members.length === 1) return { kind: 'marker', key: group.members[0].id, item: group.members[0] };
    const ids = group.members.map((member) => member.id);
    return {
      kind: 'cluster',
      key: `gruppe:${ids.join('|')}`,
      cluster: {
        key: `gruppe:${ids.join('|')}`,
        ids,
        latitude: group.latitude,
        longitude: group.longitude,
        members: group.members.map(({ latitude, longitude }) => ({ latitude, longitude })),
      },
    };
  });
  return [...items, ...selected.map((item): MapDisplayItem => ({ kind: 'marker', key: item.id, item }))];
}
