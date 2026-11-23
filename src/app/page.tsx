// Platzhalter der Startseite, bis die eigentliche Oberfläche gebaut ist (F-00).
import styles from './page.module.css';

export default function HomePage() {
  return (
    <main className={styles.page}>
      <h1 className={styles.title}>SportMate</h1>
      <p className={styles.status}>im Aufbau</p>
    </main>
  );
}
