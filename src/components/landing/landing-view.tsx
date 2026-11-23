'use client';
// Startseite: Hero mit Sportzeile und Kartenvorschau echter Treffen, drei Schritte, Sportarten, Abschluss, Fußzeile (F-31).
import { motion } from 'motion/react';
import { Suspense, type CSSProperties } from 'react';
import Link from 'next/link';
import type { EventListState } from '@/hooks/use-event-list';
import { HeroSportLine } from './hero-sport-line';
import { LandingFooter } from './landing-footer';
import { LandingHeader, type LandingViewer } from './landing-header';
import { LandingSports } from './landing-sports';
import { LandingSteps } from './landing-steps';
import { PreviewMap } from './preview-map';
import styles from './landing.module.css';

/** Eingaben der Startseite. */
export type LandingViewProps = {
  /** Kommende Treffen, nach Beginn sortiert. */
  preview: EventListState;
  viewer: LandingViewer;
  /** Fester Zeitpunkt für Tests; ohne Angabe gilt die Uhrzeit im Browser. */
  now?: Date;
};

const loadingPreview: EventListState = { status: 'loading', events: [] };

// Einblenden per CSS statt motion: gleiches HTML auf Server und Browser (kein Hydration-Unterschied bei
// reduzierter Bewegung), und die globale Regel für `prefers-reduced-motion` schaltet es ab.
function withReveal(className: string, order: number) {
  return { className: `${className} ${styles.reveal}`, style: { '--reveal-order': order } as CSSProperties };
}

function EntryLinks() {
  return (
    <div {...withReveal(styles.actions, 2)}>
      <motion.span whileTap={{ scale: 0.97 }} className={styles.actionWrap}>
        <Link href="/entdecken" className={styles.primary}>
          Treffen entdecken
        </Link>
      </motion.span>
      <motion.span whileTap={{ scale: 0.97 }} className={styles.actionWrap}>
        <Link href="/erstellen" className={styles.secondary}>
          Treffen erstellen
        </Link>
      </motion.span>
    </div>
  );
}

function Hero({ preview, now }: Pick<LandingViewProps, 'preview' | 'now'>) {
  return (
    <div className={styles.hero}>
      <section className={styles.heroCopy} aria-labelledby="startseite-titel">
        <h1 id="startseite-titel" {...withReveal(styles.title, 0)}>
          <span className={styles.titleLine}>Die Stadt ist</span> <span className={styles.titleLine}>das Spielfeld.</span>
        </h1>
        <div {...withReveal(styles.sportLineWrap, 1)}>
          <HeroSportLine />
        </div>
        <EntryLinks />
      </section>
      <div {...withReveal(styles.heroPreview, 2)}>
        {/* Tageslabels hängen von der Uhrzeit ab; die Vorschau wird darum erst beim Aufruf gerendert, nicht vorab. */}
        <Suspense fallback={<PreviewMap state={loadingPreview} now={new Date(0)} />}>
          <PreviewMap state={preview} now={now} />
        </Suspense>
      </div>
    </div>
  );
}

function Closing() {
  return (
    <section className={styles.closing} aria-labelledby="zusammen-titel">
      <h2 id="zusammen-titel" className={styles.closingTitle}>
        Zusammen geht mehr
      </h2>
      <motion.span whileTap={{ scale: 0.97 }} className={styles.actionWrap}>
        <Link href="/entdecken" className={styles.primary}>
          Jetzt Treffen entdecken
        </Link>
      </motion.span>
    </section>
  );
}

/**
 * Darstellung der Startseite ohne Datenzugriff; Daten und Person kommen als Eingaben.
 * Eingaben: siehe `LandingViewProps`. Rückgabe: Kopf, `<main>` und Fußzeile.
 * Feature: F-31
 */
export function LandingView({ preview, viewer, now }: LandingViewProps) {
  return (
    <div className={styles.page} data-page="startseite">
      <LandingHeader viewer={viewer} />
      <main className={styles.main}>
        <Hero preview={preview} now={now} />
        <LandingSteps />
        <LandingSports upcoming={preview} />
        <Closing />
      </main>
      <LandingFooter />
    </div>
  );
}
