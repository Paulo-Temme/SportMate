// Darstellungsdaten eines Kartenmarkers, gemeinsam für die MapLibre-Karte und die Offline-Karte (F-08).
import type { Sport } from '@/lib/events/event-model';

/** Zustand eines Markers: normal, ausgewählt (Akzent) oder ausgebucht (gedämpft). */
export type MarkerState = 'default' | 'selected' | 'full';

/** Ein Treffen als Marker. */
export type MapMarkerItem = {
  id: string;
  sport: Sport;
  timeLabel: string;
  accessibleLabel: string;
  latitude: number;
  longitude: number;
  state: MarkerState;
};

/** Kamerawunsch an die Karte. `key` ändert sich bei jedem neuen Wunsch, damit gleiche Ziele erneut angeflogen werden. */
export type CameraRequest =
  | { kind: 'event'; latitude: number; longitude: number; bottomInset: number; key: number }
  | { kind: 'home'; bottomInset: number; key: number }
  | { kind: 'fit'; points: Array<{ latitude: number; longitude: number }>; bottomInset: number; key: number };

/** Mittelpunkt von Flensburg (Innenstadt am Hafen) und Start-Zoom. */
export const flensburgCenter = { latitude: 54.7856, longitude: 9.4366, zoom: 12.6 } as const;

/** Mehrere Treffen, die sich auf dem Bildschirm überlappen würden, als ein Gruppen-Marker. */
export type MapClusterItem = {
  key: string;
  ids: string[];
  latitude: number;
  longitude: number;
  members: Array<{ latitude: number; longitude: number }>;
};

/** Was die Karte zeichnet: ein einzelnes Treffen oder eine Gruppe. */
export type MapDisplayItem = { kind: 'marker'; key: string; item: MapMarkerItem } | { kind: 'cluster'; key: string; cluster: MapClusterItem };
