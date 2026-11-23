// "So funktioniert's": Sportart wählen → Treffen finden → Bin dabei, je Titel und ein kurzer Satz (F-31).
import styles from './landing.module.css';

const steps = [
  { title: 'Sportart wählen', text: 'Filter nach Sportart, Tag und Niveau.' },
  { title: 'Treffen finden', text: 'Auf der Karte siehst du Ort, Uhrzeit und freie Plätze.' },
  { title: 'Bin dabei', text: 'Ein Tipp, und du stehst auf der Liste.' },
];

/**
 * Abschnitt mit den drei Schritten.
 * Rückgabe: `<section>` mit Überschrift "So funktioniert's" und geordneter Liste.
 * Feature: F-31
 */
export function LandingSteps() {
  return (
    <section id="so-funktionierts" className={styles.section} aria-labelledby="so-funktionierts-titel">
      <h2 id="so-funktionierts-titel" className={styles.sectionTitle}>
        So funktioniert&apos;s
      </h2>
      <ol className={styles.steps}>
        {steps.map((step, index) => (
          <li key={step.title} className={styles.step}>
            <span className={styles.stepNumber} aria-hidden="true">
              0{index + 1}
            </span>
            <h3 className={styles.stepTitle}>{step.title}</h3>
            <p className={styles.stepText}>{step.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
