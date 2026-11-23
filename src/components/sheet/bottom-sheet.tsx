'use client';
// Ziehbares Bottom Sheet mit drei Rastpunkten (Spitze, halb, voll), Schwung und Tastaturbedienung; ab Desktop feste Seitenleiste (F-05, F-08).
import { animate, motion, useDragControls, useMotionValue, useReducedMotion, type PanInfo } from 'motion/react';
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { chooseSnapPoint, computeSnapHeights, stepSnapPoint, type SnapHeights, type SnapPoint } from './sheet-snap';
import styles from './bottom-sheet.module.css';

type BottomSheetProps = {
  snap: SnapPoint;
  onSnapChange: (snap: SnapPoint) => void;
  onHeightsChange?: (heights: SnapHeights) => void;
  label: string;
  header: ReactNode;
  children: ReactNode;
  /** Ändert sich, wenn neuer Inhalt erscheint; setzt die Scrollposition zurück. */
  contentKey?: string;
};

const desktopQuery = '(min-width: 1024px)';
const fallbackHeights = computeSnapHeights(700);

function useAvailableHeight(stage: React.RefObject<HTMLDivElement | null>): SnapHeights {
  const [heights, setHeights] = useState<SnapHeights>(fallbackHeights);
  useLayoutEffect(() => {
    const element = stage.current;
    if (!element) return;
    const update = () => setHeights(computeSnapHeights(element.clientHeight));
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, [stage]);
  return heights;
}

function nextSnapOnClick(snap: SnapPoint): SnapPoint {
  return snap === 'peek' ? 'half' : snap === 'half' ? 'full' : 'peek';
}

/**
 * Sheet über der Karte. Ziehen am Griff oder Kopf, Loslassen rastet nach Position und Geschwindigkeit ein.
 * Pfeiltasten am Griff bewegen um einen Rastpunkt, Klick schaltet weiter.
 * Eingaben: aktueller Rastpunkt (gesteuert), Callback bei Änderung, Beschriftung, Kopfbereich, Inhalt.
 * Rückgabe: Sheet-Element. Ab 1024 px Breite wird daraus per CSS eine feste Liste links.
 * Feature: F-05
 */
export function BottomSheet({ snap, onSnapChange, onHeightsChange, label, header, children, contentKey }: BottomSheetProps) {
  const stage = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const heights = useAvailableHeight(stage);
  const offsetFor = useCallback((point: SnapPoint) => heights.full - heights[point], [heights]);
  const y = useMotionValue(offsetFor(snap));
  const dragControls = useDragControls();
  const reduceMotion = useReducedMotion();

  useEffect(() => onHeightsChange?.(heights), [heights, onHeightsChange]);

  useEffect(() => {
    const controls = animate(y, offsetFor(snap), reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 38 });
    return () => controls.stop();
  }, [snap, offsetFor, y, reduceMotion]);

  useEffect(() => {
    content.current?.scrollTo({ top: 0 });
  }, [contentKey]);

  const startDrag = (event: React.PointerEvent) => {
    if (window.matchMedia(desktopQuery).matches) return;
    dragControls.start(event);
  };

  const finishDrag = (_event: PointerEvent, info: PanInfo) => {
    const target = chooseSnapPoint(heights.full - y.get(), -info.velocity.y, heights);
    if (target === snap) animate(y, offsetFor(snap), { type: 'spring', stiffness: 380, damping: 38 });
    onSnapChange(target);
  };

  const handleKey = (event: React.KeyboardEvent) => {
    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
    event.preventDefault();
    onSnapChange(stepSnapPoint(snap, event.key === 'ArrowUp' ? 'up' : 'down'));
  };

  return (
    <div className={styles.stage} ref={stage}>
      <motion.section
        className={styles.sheet}
        aria-label={label}
        data-snap={snap}
        style={{ y, height: heights.full }}
        drag="y"
        dragListener={false}
        dragControls={dragControls}
        dragConstraints={{ top: 0, bottom: offsetFor('peek') }}
        dragElastic={0.06}
        dragMomentum={false}
        onDragEnd={finishDrag}
      >
        <div className={styles.head} onPointerDown={startDrag}>
          <button
            type="button"
            className={styles.handle}
            aria-label={snap === 'full' ? 'Liste verkleinern' : 'Liste vergrößern'}
            aria-expanded={snap !== 'peek'}
            aria-keyshortcuts="ArrowUp ArrowDown"
            onClick={() => onSnapChange(nextSnapOnClick(snap))}
            onKeyDown={handleKey}
          >
            <span className={styles.grip} aria-hidden="true" />
          </button>
          {header}
        </div>
        <div className={styles.content} ref={content} style={{ paddingBottom: offsetFor(snap) }}>
          {children}
        </div>
      </motion.section>
    </div>
  );
}
