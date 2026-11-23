// Fußzeile der Startseite: Marke, Sprungziele, Projekt, Kartendaten-Lizenz und Hinweis auf fiktive Beispieltreffen (F-31).
import Link from 'next/link';
import { BrandMark } from '@/components/navigation/brand-mark';
import styles from './landing.module.css';

/**
 * Fußzeile der Startseite.
 * Rückgabe: `<footer>` mit Marke, Navigation und Pflichtangaben.
 * Feature: F-31
 */
export function LandingFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerTop}>
          <Link href="/" className={styles.footerBrand} aria-label="SportMate, zur Startseite">
            <BrandMark size={24} />
            <span aria-hidden="true">SportMate</span>
          </Link>
          <nav aria-label="Fußzeile" className={styles.footerNav}>
            <a href="#so-funktionierts">So funktioniert&apos;s</a>
            <a href="#sportarten">Sportarten</a>
            <Link href="/entdecken">Treffen entdecken</Link>
          </nav>
        </div>
        <div className={styles.footerNotes}>
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
      </div>
    </footer>
  );
}
