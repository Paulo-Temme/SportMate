// Tests der Marker-Gruppierung nach Pixelabstand und der Offline-Ebene (F-08).
import { describe, expect, it } from 'vitest';
import { canSpreadGroup, findMarkerBounds, groupOverlappingMarkers, placeOnOfflinePlane, type CollisionBox } from './marker-grouping';

type Point = { id: string; latitude: number; longitude: number; x: number; y: number };

const box: CollisionBox = { width: 90, height: 40 };

function point(id: string, x: number, y: number): Point {
  return { id, latitude: y / 1000, longitude: x / 1000, x, y };
}

const project = (item: Point) => ({ x: item.x, y: item.y });

function idsOf(groups: Array<{ members: Point[] }>): string[][] {
  return groups.map((group) => group.members.map((member) => member.id));
}

describe('F-08 AK5: Marker überlappen nicht', () => {
  it('F-08 AK5: weit auseinanderliegende Marker bleiben einzeln', () => {
    const groups = groupOverlappingMarkers([point('a', 0, 0), point('b', 200, 0), point('c', 0, 100)], project, box);
    expect(idsOf(groups)).toEqual([['a'], ['b'], ['c']]);
    expect(groups[1]).toMatchObject({ x: 200, y: 0, latitude: 0, longitude: 0.2 });
  });

  it('F-08 AK5: Marker, deren Felder sich überschneiden, werden zu einer Gruppe', () => {
    const groups = groupOverlappingMarkers([point('a', 0, 0), point('b', 89, 39), point('c', 300, 0)], project, box);
    expect(idsOf(groups)).toEqual([['a', 'b'], ['c']]);
  });

  it('F-08 AK5: genau auf der Feldgrenze gilt nicht als Überlappung', () => {
    expect(idsOf(groupOverlappingMarkers([point('a', 0, 0), point('b', 90, 0)], project, box))).toEqual([['a'], ['b']]);
    expect(idsOf(groupOverlappingMarkers([point('a', 0, 0), point('b', 0, 40)], project, box))).toEqual([['a'], ['b']]);
    expect(idsOf(groupOverlappingMarkers([point('a', 0, 0), point('b', -89, -39)], project, box))).toEqual([['a', 'b']]);
  });

  it('F-08 AK5: Gruppe liegt im Mittel ihrer Mitglieder, auf dem Bildschirm und geografisch', () => {
    const [group] = groupOverlappingMarkers([point('a', 0, 0), point('b', 60, 30)], project, box);
    expect(group).toMatchObject({ x: 30, y: 15 });
    expect(group.latitude).toBeCloseTo(0.015);
    expect(group.longitude).toBeCloseTo(0.03);
  });

  it('F-08 AK5: eine wachsende Gruppe nimmt auch Marker auf, die erst danach überlappen', () => {
    // a und b verschmelzen bei (40, 15); c überlappt weder a (dx 125) noch b (dy 50), wohl aber die Gruppe (dx 85, dy 35).
    const groups = groupOverlappingMarkers([point('a', 0, 0), point('b', 80, 30), point('c', 125, -20)], project, box);
    expect(idsOf(groups)).toEqual([['a', 'b', 'c']]);
  });

  it('F-08 AK5: im Ergebnis überlappt keine Gruppe eine andere', () => {
    const points = Array.from({ length: 30 }, (_, index) => point(`p${index}`, (index * 37) % 400, (index * 53) % 300));
    const groups = groupOverlappingMarkers(points, project, box);
    expect(groups.flatMap((group) => group.members).length).toBe(30);
    for (const first of groups) {
      for (const second of groups) {
        if (first === second) continue;
        const overlaps = Math.abs(first.x - second.x) < box.width && Math.abs(first.y - second.y) < box.height;
        expect(overlaps).toBe(false);
      }
    }
  });

  it('F-08 AK5: leere Eingabe ergibt keine Gruppen', () => {
    expect(groupOverlappingMarkers([], project, box)).toEqual([]);
  });
});

describe('F-08 AK6: Gruppe aufklappen', () => {
  it('F-08 AK6: Gruppe mit verschiedenen Orten lässt sich auffächern, gleicher Ort nicht', () => {
    expect(canSpreadGroup([point('a', 0, 0), point('b', 10, 0)])).toBe(true);
    expect(canSpreadGroup([point('a', 0, 0), point('b', 0, 10)])).toBe(true);
    expect(canSpreadGroup([point('a', 5, 5), point('b', 5, 5)])).toBe(false);
    expect(canSpreadGroup([point('a', 5, 5)])).toBe(false);
  });

  it('F-08 AK6: berechnet die Ausdehnung einer Gruppe', () => {
    expect(findMarkerBounds([point('a', 10, 50), point('b', 30, 20), point('c', 20, 40)])).toEqual({
      minLatitude: 0.02,
      maxLatitude: 0.05,
      minLongitude: 0.01,
      maxLongitude: 0.03,
    });
  });
});

describe('F-08 AK3: Offline-Karte', () => {
  const bounds = { minLatitude: 54, maxLatitude: 55, minLongitude: 9, maxLongitude: 10 };

  it('F-08 AK3: legt Ecken und Mitte auf feste Anteile der Fläche (Norden oben)', () => {
    const size = { width: 1000, height: 1000 };
    expect(placeOnOfflinePlane({ latitude: 55, longitude: 9 }, bounds, size)).toEqual({ x: 120, y: 240 });
    expect(placeOnOfflinePlane({ latitude: 54, longitude: 10 }, bounds, size)).toEqual({ x: 880, y: 580 });
    expect(placeOnOfflinePlane({ latitude: 54.5, longitude: 9.5 }, bounds, size)).toEqual({ x: 500, y: 410 });
  });

  it('F-08 AK3: skaliert mit der Größe der Fläche', () => {
    expect(placeOnOfflinePlane({ latitude: 54, longitude: 10 }, bounds, { width: 500, height: 200 })).toEqual({ x: 440, y: 116 });
  });

  it('F-08 AK3: ein einzelner Ort liegt in der Mitte des Bereichs', () => {
    const single = { minLatitude: 54.5, maxLatitude: 54.5, minLongitude: 9.5, maxLongitude: 9.5 };
    expect(placeOnOfflinePlane({ latitude: 54.5, longitude: 9.5 }, single, { width: 1000, height: 1000 })).toEqual({ x: 500, y: 410 });
  });
});
