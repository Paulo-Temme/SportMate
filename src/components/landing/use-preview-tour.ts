'use client';
// Rundgang der Kartenvorschau: hebt nacheinander ein Treffen hervor, pausiert bei Hover, Fokus und außerhalb des Bildes (F-31).
import { useEffect, useState, type RefObject } from 'react';

const stepDuration = 6500;

/** Woher die Hervorhebung kommt: vom Rundgang (Kamera fährt hin) oder vom Zeigen auf einen Marker (Kamera bleibt). */
export type TourOrigin = 'tour' | 'pointer';

/** Zustand des Rundgangs. */
export type PreviewTour = {
  active: number;
  origin: TourOrigin;
  /** Ob das Panel in der Nähe des sichtbaren Bereichs ist (dann darf die Karte laden). */
  near: boolean;
  highlight: (index: number) => void;
  setHovered: (hovered: boolean) => void;
  setFocused: (focused: boolean) => void;
};

function useViewportPresence(panel: RefObject<HTMLElement | null>) {
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const node = panel.current;
    // Ohne IntersectionObserver (nur in Testumgebungen) bleibt die Karte ungeladen und der Rundgang steht.
    if (!node || typeof IntersectionObserver === 'undefined') return;
    const nearObserver = new IntersectionObserver(([entry]) => entry.isIntersecting && setNear(true), { rootMargin: '300px 0px' });
    const visibleObserver = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.25 });
    nearObserver.observe(node);
    visibleObserver.observe(node);
    return () => {
      nearObserver.disconnect();
      visibleObserver.disconnect();
    };
  }, [panel]);
  return { near, visible };
}

/**
 * Steuert, welches Treffen die Vorschau hervorhebt. Ohne Bewegung (reduzierte Bewegung, weniger als zwei Treffen,
 * Hover, Fokus, Panel nicht sichtbar) steht der Rundgang.
 * Der Rundgang beginnt erst, wenn die Karte bereit ist, damit keine Station während des Ladens verstreicht.
 * Eingaben: Panel-Element, Anzahl der Treffen, ob Bewegung reduziert ist, ob die Karte bereit ist. Rückgabe: Zustand und Setzer.
 * Feature: F-31
 */
export function usePreviewTour(panel: RefObject<HTMLElement | null>, count: number, reduceMotion: boolean, ready: boolean): PreviewTour {
  const [state, setState] = useState<{ active: number; origin: TourOrigin }>({ active: 0, origin: 'tour' });
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const { near, visible } = useViewportPresence(panel);
  const running = ready && near && visible && !hovered && !focused && !reduceMotion && count > 1;

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(
      () => setState((current) => ({ active: (current.active + 1) % count, origin: 'tour' })),
      stepDuration,
    );
    return () => window.clearInterval(timer);
  }, [running, count]);

  return {
    active: count > 0 ? state.active % count : 0,
    origin: state.origin,
    near,
    highlight: (index) => setState({ active: index, origin: 'pointer' }),
    setHovered,
    setFocused,
  };
}
