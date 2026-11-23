'use client';
// Startseite: Erklärung in einem Satz, zwei Einstiege, Vorschau echter Treffen, drei Schritte, was SportMate nicht ist, Fußzeile (F-31).
import { motion } from 'motion/react';
import { Suspense, type CSSProperties } from 'react';
import Link from 'next/link';
import type { EventListState } from '@/hooks/use-event-list';
import { LandingHeader, type LandingViewer } from './landing-header';
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

const omissions = [
  { title: 'Kein Verein.', text: 'Keine Mitgliedschaft, kein Beitrag, keine festen Trainingszeiten. Du kommst, wenn es dir passt.' },
  { title: 'Kein Gruppenchat.', text: 'Treffpunkt, Niveau, Kosten und was mitzubringen ist, stehen im Treffen selbst.' },
  { title: 'Keine Hallenbuchung.', text: 'SportMate reserviert keine Plätze oder Hallen. Wer ein Treffen anlegt, kümmert sich um den Ort.' },
];

// Einblenden per CSS statt motion: gleiches HTML auf Server und Browser (kein Hydration-Unterschied bei
// reduzierter Bewegung), und die globale Regel für `prefers-reduced-motion` schaltet es ab.
function withReveal(className: string, order: number) {
  return { className: `${className} ${styles.reveal}`, style: { '--reveal-order': order } as CSSProperties };
}

function Hero({ preview, now }: Pick<LandingViewProps, 'preview' | 'now'>) {
  return (
    <section className={styles.hero} aria-labelledby="startseite-titel">
      <div className={styles.heroCopy}>
        <h1 id="startseite-titel" {...withReveal(styles.title, 0)}>
          Sport in Flensburg.{' '}
          <span className={styles.titleSecond}>Mit Leuten, die heute auch Lust haben.</span>
        </h1>
        <p {...withReveal(styles.lead, 1)}>
          SportMate zeigt offene Sporttreffen in der Stadt – Fußball, Volleyball, Basketball, Badminton, Laufen und Tischtennis. Du
          siehst, wo und wann gespielt wird und wie viele Plätze noch frei sind.
        </p>
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
        <p {...withReveal(styles.actionNote, 3)}>Stöbern geht ohne Konto. Anmelden musst du dich erst zum Mitmachen.</p>
      </div>
      <div {...withReveal(styles.heroPreview, 2)}>
        {/* Tageslabels hängen von der Uhrzeit ab; die Vorschau wird darum erst beim Aufruf gerendert, nicht vorab. */}
        <Suspense fallback={<PreviewMap state={loadingPreview} now={new Date(0)} />}>
          <PreviewMap state={preview} now={now} />
        </Suspense>
      </div>
    </section>
  );
}

function Omissions() {
  return (
    <section className={`${styles.section} ${styles.split}`} aria-labelledby="was-nicht">
      <h2 id="was-nicht" className={styles.sectionTitle}>
        Was SportMate nicht ist
      </h2>
      <ul className={styles.omissions}>
        {omissions.map((item) => (
          <li key={item.title} className={styles.omission}>
            <strong className={styles.omissionTitle}>{item.title}</strong> <span className={styles.omissionText}>{item.text}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function LandingFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <p>SportMate · Hochschulprojekt WS 2026/27</p>
        <p>
          Kartendaten ©{' '}
          <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">
            OpenStreetMap-Mitwirkende
          </a>
          , Kartenstil{' '}
          <a href="https://openfreemap.org" target="_blank" rel="noreferrer">
            OpenFreeMap
          </a>
        </p>
        <p>Als Beispiel gekennzeichnete Treffen sind fiktiv.</p>
      </div>
    </footer>
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
        <Omissions />
      </main>
      <LandingFooter />
    </div>
  );
}
