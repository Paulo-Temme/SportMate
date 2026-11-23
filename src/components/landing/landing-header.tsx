// Schlanker Kopf der Startseite: Logo mit Namen und "Anmelden" bzw. Profil, statt Tab-Leiste (F-31).
import Link from 'next/link';
import { BrandMark } from '@/components/navigation/brand-mark';
import styles from './landing-header.module.css';

/** Wer die Startseite ansieht: `ready` erst, wenn feststeht, ob jemand angemeldet ist. */
export type LandingViewer = { ready: boolean; displayName: string | null };

function ViewerLink({ viewer }: { viewer: LandingViewer }) {
  if (!viewer.ready) return <span className={styles.placeholder} aria-hidden="true" />;
  if (!viewer.displayName) {
    return (
      <Link href="/anmelden" className={styles.signIn}>
        Anmelden
      </Link>
    );
  }
  return (
    <Link href="/profil" className={styles.profile}>
      <span className={styles.initial} aria-hidden="true">
        {viewer.displayName.charAt(0).toUpperCase()}
      </span>
      <span>Profil</span>
    </Link>
  );
}

/**
 * Kopf der Startseite.
 * Eingaben: Person, die die Seite ansieht. Rückgabe: `<header>` mit Logo-Link zur Startseite und Konto-Link.
 * Feature: F-31
 */
export function LandingHeader({ viewer }: { viewer: LandingViewer }) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand} aria-label="SportMate, zur Startseite">
          <BrandMark size={28} />
          <span className={styles.wordmark} aria-hidden="true">
            SportMate
          </span>
        </Link>
        <ViewerLink viewer={viewer} />
      </div>
    </header>
  );
}
