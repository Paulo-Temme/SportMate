// Bildmarke von SportMate: dunkles Quadrat mit Ring und Punkt im Akzent; dekorativ (F-05, F-31).

/**
 * Zeichnet die Bildmarke. Dekorativ (`aria-hidden`); der umgebende Link trägt den Namen.
 * Eingaben: Kantenlänge in Pixeln. Rückgabe: SVG-Element.
 * Feature: F-31
 */
export function BrandMark({ size = 32 }: { size?: number }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden="true" focusable="false">
      <rect width="32" height="32" rx="8" fill="var(--ink)" />
      <circle cx="16" cy="16" r="8.5" fill="none" stroke="var(--on-accent)" strokeWidth="2.5" />
      <circle cx="16" cy="16" r="3.5" fill="var(--accent)" />
    </svg>
  );
}
