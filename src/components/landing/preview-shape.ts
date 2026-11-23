// Vereinfachte Umrisse für die gezeichnete Flensburg-Vorschau: Förde und zwei Grünflächen im Vorschau-Ausschnitt (F-31).
import { previewBounds, projectToPreview } from '@/lib/map/preview-frame';

/** Breite und Höhe der Zeichenfläche (Seitenverhältnis wie der Ausschnitt, 4:5). */
export const previewCanvas = { width: 400, height: 500 } as const;

type FramePoint = { x: number; y: number };

const top = previewBounds.maxLatitude;
const right = previewBounds.maxLongitude;

// Förde, stark vereinfacht nach OpenStreetMap: von der Hafenspitze nach Norden, dann nach Osten zur Ostsee.
// Punkte an den Rändern des Ausschnitts stehen doppelt, damit die Glättung dort eine Ecke lässt.
const fjordOutline: Array<[number, number]> = [
  [54.7884, 9.4371],
  [54.79, 9.4356],
  [54.7935, 9.4352],
  [54.7975, 9.4348],
  [54.8015, 9.4342],
  [54.806, 9.4322],
  [54.8105, 9.4304],
  [54.8142, 9.4299],
  [54.8185, 9.4316],
  [54.8232, 9.4345],
  [54.8292, 9.4372],
  [top, 9.4395],
  [top, 9.4395],
  [top, right],
  [top, right],
  [54.8262, right],
  [54.8262, right],
  [54.8249, 9.499],
  [54.8236, 9.4905],
  [54.8218, 9.4805],
  [54.8192, 9.4705],
  [54.8162, 9.4625],
  [54.8122, 9.4562],
  [54.8077, 9.4512],
  [54.8035, 9.4455],
  [54.7995, 9.4412],
  [54.7952, 9.4398],
  [54.7915, 9.4390],
  [54.7894, 9.4384],
];

function toCanvas([latitude, longitude]: [number, number]): FramePoint {
  const position = projectToPreview({ latitude, longitude }) ?? { x: 0, y: 0 };
  return { x: position.x * previewCanvas.width, y: position.y * previewCanvas.height };
}

const round = (value: number) => Math.round(value * 10) / 10;
const middle = (a: FramePoint, b: FramePoint): FramePoint => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });

function toSmoothPath(points: FramePoint[]): string {
  const start = middle(points[points.length - 1], points[0]);
  const curves = points.map((point, index) => {
    const end = middle(point, points[(index + 1) % points.length]);
    return `Q${round(point.x)} ${round(point.y)} ${round(end.x)} ${round(end.y)}`;
  });
  return `M${round(start.x)} ${round(start.y)} ${curves.join(' ')}Z`;
}

/** SVG-Pfad der Förde in Koordinaten der Zeichenfläche. */
export const fjordPath = toSmoothPath(fjordOutline.map(toCanvas));

/** Grünflächen als Ellipsen: Volkspark und Marienhölzung. */
export const parkAreas = [
  { name: 'Volkspark', center: toCanvas([54.8028, 9.4525]), radiusX: 26, radiusY: 34, rotation: -20 },
  { name: 'Marienhölzung', center: toCanvas([54.7965, 9.4125]), radiusX: 30, radiusY: 46, rotation: 10 },
];

/** Lage der Beschriftung "Flensburger Förde" im äußeren Teil der Förde. */
export const fjordLabel = toCanvas([54.8235, 9.462]);
