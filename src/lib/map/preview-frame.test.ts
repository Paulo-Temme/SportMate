// Tests der Kartenvorschau auf der Startseite: Auswahl der Treffen für die Kamerafahrt und Lage auf der Ersatzfläche (F-31).
import { describe, expect, it } from 'vitest';
import type { SportEvent } from '@/lib/events/event-model';
import { findMarkerBounds } from './marker-grouping';
import { pickPreviewEvents, placeInPreview } from './preview-frame';

type PreviewCandidate = Pick<SportEvent, 'id' | 'latitude' | 'longitude' | 'capacity' | 'participantCount' | 'status'>;

function candidate(id: string, latitude: number, longitude: number, overrides: Partial<PreviewCandidate> = {}): PreviewCandidate {
  return { id, latitude, longitude, capacity: 10, participantCount: 2, status: 'published', ...overrides };
}

const hafenspitze = candidate('hafen', 54.78783, 9.43715);
const solitude = candidate('solitude', 54.82271, 9.4896);
const exe = candidate('exe', 54.77952, 9.42606);
const campusFootball = candidate('campus-fussball', 54.77511, 9.45044);
const campusBadminton = candidate('campus-badminton', 54.77348, 9.45272);
const volkspark = candidate('volkspark', 54.79953, 9.44624);

describe('F-31 AK4: Vorschau wählt kommende Treffen für die Kamerafahrt', () => {
  it('F-31 AK4: übernimmt Treffen in der gegebenen Reihenfolge, höchstens vier', () => {
    const picked = pickPreviewEvents([hafenspitze, solitude, exe, volkspark, campusFootball]);
    expect(picked.map((event) => event.id)).toEqual(['hafen', 'solitude', 'exe', 'volkspark']);
  });

  it('F-31 AK4: die Höchstzahl lässt sich vorgeben', () => {
    expect(pickPreviewEvents([hafenspitze, solitude, exe], 2)).toHaveLength(2);
  });

  it('F-31 AK4: Treffen näher als 300 m an einem gewählten erscheinen nicht (keine überlappenden Pillen)', () => {
    const picked = pickPreviewEvents([campusFootball, campusBadminton, hafenspitze]);
    expect(picked.map((event) => event.id)).toEqual(['campus-fussball', 'hafen']);
  });

  it('F-31 AK4: ausgebuchte und abgesagte Treffen werden übersprungen', () => {
    const full = candidate('voll', 54.79, 9.44, { participantCount: 10 });
    const cancelled = candidate('abgesagt', 54.8, 9.45, { status: 'cancelled' });
    expect(pickPreviewEvents([full, cancelled, exe]).map((event) => event.id)).toEqual(['exe']);
  });

  it('F-31 AK4: Treffen weiter als 15 km vom ersten gewählten bleiben draußen (keine Fahrt quer durchs Land)', () => {
    const far = candidate('weit-weg', 54.32, 10.13);
    expect(pickPreviewEvents([exe, far, solitude]).map((event) => event.id)).toEqual(['exe', 'solitude']);
  });

  it('F-31 AK5: ohne Treffen bleibt die Vorschau leer', () => {
    expect(pickPreviewEvents([])).toEqual([]);
  });
});

describe('F-31 AK4: Lage der Marker auf der Ersatzfläche ohne Karte', () => {
  const places = [hafenspitze, solitude, exe];
  const bounds = findMarkerBounds(places);

  it('F-31 AK4: Nordwesten oben links, Südosten unten rechts, mit Rand und Platz für die Treffen-Karte unten', () => {
    expect(placeInPreview({ latitude: bounds.maxLatitude, longitude: bounds.minLongitude }, bounds)).toEqual({ x: 0.16, y: 0.16 });
    const southEast = placeInPreview({ latitude: bounds.minLatitude, longitude: bounds.maxLongitude }, bounds);
    expect(southEast.x).toBeCloseTo(0.84, 6);
    expect(southEast.y).toBeCloseTo(0.62, 6);
  });

  it('F-31 AK4: ein einzelner Ort liegt waagerecht mittig', () => {
    const single = findMarkerBounds([exe]);
    const position = placeInPreview(exe, single);
    expect(position.x).toBeCloseTo(0.5, 6);
    expect(position.y).toBeCloseTo(0.39, 6);
  });
});
