// "So funktioniert's": drei Schritte Finden, Mitmachen, Spielen als ruhige nummerierte Liste mit kleinen App-Ausschnitten (F-31).
import { MapPin } from 'lucide-react';
import type { ReactNode } from 'react';
import styles from './landing.module.css';

type Step = { title: string; text: string; example: ReactNode };

const steps: Step[] = [
  {
    title: 'Finden',
    text: 'Karte oder Liste, gefiltert nach Sportart, Tag und Niveau. Jedes Treffen zeigt Ort, Uhrzeit und freie Plätze.',
    example: (
      <>
        <span className={styles.exampleChip} data-active="true">
          Volleyball
        </span>
        <span className={styles.exampleChip}>Heute</span>
        <span className={styles.exampleChip}>Anfänger</span>
      </>
    ),
  },
  {
    title: 'Mitmachen',
    text: 'Ein Tipp auf „Jetzt teilnehmen“. Ein Konto brauchst du erst in diesem Moment, nicht zum Stöbern.',
    example: (
      <>
        <span className={styles.exampleButton}>Jetzt teilnehmen</span>
        <span className={styles.exampleNote}>3 von 10 Plätzen frei</span>
      </>
    ),
  },
  {
    title: 'Spielen',
    text: 'Zur Uhrzeit am Treffpunkt sein. Wer organisiert und was du mitbringen sollst, steht im Treffen.',
    example: (
      <span className={styles.examplePlace}>
        <MapPin size={16} aria-hidden="true" />
        Hafenspitze, 18:00
      </span>
    ),
  },
];

/**
 * Abschnitt mit den drei Schritten. Die Beispiele sind dekorativ und für Screenreader ausgeblendet.
 * Rückgabe: `<section>` mit Überschrift "So funktioniert's" und geordneter Liste.
 * Feature: F-31
 */
export function LandingSteps() {
  return (
    <section className={styles.section} aria-labelledby="so-funktionierts">
      <h2 id="so-funktionierts" className={styles.sectionTitle}>
        So funktioniert&apos;s
      </h2>
      <ol className={styles.steps}>
        {steps.map((step, index) => (
          <li key={step.title} className={styles.step}>
            <span className={`${styles.stepNumber} tabular`} aria-hidden="true">
              {index + 1}
            </span>
            <div className={styles.stepBody}>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepText}>{step.text}</p>
              <div className={styles.example} aria-hidden="true">
                {step.example}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
