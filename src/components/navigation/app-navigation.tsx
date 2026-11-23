'use client';
// Hauptnavigation: Tab-Leiste unten (mobil) bzw. schmale Leiste links (Desktop) mit Entdecken, Meine Treffen, Erstellen, Profil (F-05, F-17, F-24).
import { CalendarCheck, Compass, Plus, UserRound } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Suspense } from 'react';
import styles from './app-navigation.module.css';

type NavigationItem = { href: string; label: string; icon: typeof Compass; primary?: boolean };

const items: NavigationItem[] = [
  { href: '/', label: 'Entdecken', icon: Compass },
  { href: '/meine-treffen', label: 'Meine Treffen', icon: CalendarCheck },
  { href: '/erstellen', label: 'Erstellen', icon: Plus, primary: true },
  { href: '/profil', label: 'Profil', icon: UserRound },
];

function isActive(item: NavigationItem, pathname: string | null): boolean {
  if (!pathname) return false;
  if (item.href === '/') return pathname === '/' || pathname.startsWith('/treffen');
  return pathname.startsWith(item.href);
}

function NavigationLinks({ pathname }: { pathname: string | null }) {
  return (
    <ul className={styles.list}>
      {items.map((item) => {
        const active = isActive(item, pathname);
        const Icon = item.icon;
        return (
          <li key={item.href} className={item.primary ? styles.primaryItem : styles.item}>
            <Link
              href={item.href}
              className={item.primary ? styles.primaryLink : styles.link}
              aria-current={active ? 'page' : undefined}
              data-active={active}
              aria-label={item.primary ? 'Treffen erstellen' : undefined}
            >
              <span className={styles.iconWrap}>
                <Icon size={22} strokeWidth={active || item.primary ? 2.25 : 1.75} aria-hidden="true" />
              </span>
              <span className={styles.label}>{item.label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function ActiveNavigationLinks() {
  return <NavigationLinks pathname={usePathname()} />;
}

/**
 * Navigation der App. Die aktive Seite wird mit `aria-current` markiert.
 * Rückgabe: `<nav>`; die Darstellung (unten oder links) entscheidet CSS nach Bildschirmbreite.
 * Feature: F-05
 */
export function AppNavigation() {
  return (
    <nav className={styles.navigation} aria-label="Hauptnavigation">
      <Link href="/" className={styles.brand} aria-label="SportMate, zur Startansicht">
        <svg viewBox="0 0 32 32" width="32" height="32" aria-hidden="true">
          <rect width="32" height="32" rx="8" fill="var(--ink)" />
          <circle cx="16" cy="16" r="8.5" fill="none" stroke="#fff" strokeWidth="2.5" />
          <circle cx="16" cy="16" r="3.5" fill="var(--accent)" />
        </svg>
      </Link>
      <Suspense fallback={<NavigationLinks pathname={null} />}>
        <ActiveNavigationLinks />
      </Suspense>
    </nav>
  );
}
