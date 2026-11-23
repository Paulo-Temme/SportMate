// Tests der Kartenvorschau auf der Startseite: Lage im festen Flensburg-Ausschnitt und Auswahl der Treffen (F-31).
import { describe, expect, it } from 'vitest';
import type { SportEvent } from '@/lib/events/event-model';
import { pickPreviewEvents, previewBounds, projectToPreview } from './preview-frame';

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

describe('F-31 AK4: Vorschau zeigt kommende Treffen an ihrem Ort', () => {
  it('F-31 AK4: Ecken des Ausschnitts liegen bei 0 und 1, Norden oben', () => {
    expect(projectToPreview({ latitude: previewBounds.maxLatitude, longitude: previewBounds.minLongitude })).toEqual({ x: 0, y: 0 });
    expect(projectToPreview({ latitude: previewBounds.minLatitude, longitude: previewBounds.maxLongitude })).toEqual({ x: 1, y: 1 });
  });

  it('F-31 AK4: ein Punkt in der Mitte liegt bei 0,5 / 0,5', () => {
    const latitude = (previewBounds.minLatitude + previewBounds.maxLatitude) / 2;
    const longitude = (previewBounds.minLongitude + previewBounds.maxLongitude) / 2;
    const position = projectToPreview({ latitude, longitude });
    expect(position?.x).toBeCloseTo(0.5, 6);
    expect(position?.y).toBeCloseTo(0.5, 6);
  });

  it('F-31 AK4: Orte außerhalb des Ausschnitts liefern null', () => {
    expect(projectToPreview({ latitude: previewBounds.maxLatitude + 0.001, longitude: 9.45 })).toBeNull();
    expect(projectToPreview({ latitude: previewBounds.minLatitude - 0.001, longitude: 9.45 })).toBeNull();
    expect(projectToPreview({ latitude: 54.79, longitude: previewBounds.minLongitude - 0.001 })).toBeNull();
    expect(projectToPreview({ latitude: 54.79, longitude: previewBounds.maxLongitude + 0.001 })).toBeNull();
  });

  it('F-31 AK4: alle Demo-Orte in Flensburg liegen im Ausschnitt', () => {
    for (const place of [hafenspitze, solitude, exe, campusFootball, campusBadminton, volkspark]) {
      expect(projectToPreview(place)).not.toBeNull();
    }
  });

  it('F-31 AK4: übernimmt Treffen in der gegebenen Reihenfolge, höchstens vier', () => {
    const picked = pickPreviewEvents([hafenspitze, solitude, exe, volkspark, campusFootball]);
    expect(picked.map((entry) => entry.event.id)).toEqual(['hafen', 'solitude', 'exe', 'volkspark']);
    expect(picked[0].position).toEqual(projectToPreview(hafenspitze));
  });

  it('F-31 AK4: die Höchstzahl lässt sich vorgeben', () => {
    expect(pickPreviewEvents([hafenspitze, solitude, exe], 2)).toHaveLength(2);
  });

  it('F-31 AK4: dicht beieinander liegende Treffen erscheinen nur einmal (keine überlappenden Pillen)', () => {
    const picked = pickPreviewEvents([campusFootball, campusBadminton, hafenspitze]);
    expect(picked.map((entry) => entry.event.id)).toEqual(['campus-fussball', 'hafen']);
  });

  it('F-31 AK4: ausgebuchte, abgesagte und entfernte Treffen werden übersprungen', () => {
    const full = candidate('voll', 54.79, 9.44, { participantCount: 10 });
    const cancelled = candidate('abgesagt', 54.8, 9.45, { status: 'cancelled' });
    const far = candidate('kiel', 54.32, 10.13);
    expect(pickPreviewEvents([full, cancelled, far, exe]).map((entry) => entry.event.id)).toEqual(['exe']);
  });

  it('F-31 AK5: ohne Treffen bleibt die Vorschau leer', () => {
    expect(pickPreviewEvents([])).toEqual([]);
  });
});
