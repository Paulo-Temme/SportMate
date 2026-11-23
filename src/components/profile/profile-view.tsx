'use client';
// Profil: angemeldet Name, E-Mail und Abmelden; als Gast Anmelden und Registrieren (F-01).
import { LogOut } from 'lucide-react';
import Link from 'next/link';
import { useAppServices } from '@/components/app/app-services';
import { useToast } from '@/components/app/toast-provider';
import { describeActionFailure } from '@/lib/events/failure-message';
import styles from './profile-view.module.css';

/**
 * Zeigt die angemeldete Person oder die Einstiege für Gäste.
 * Rückgabe: Profilansicht; während die Anmeldung geprüft wird, ein Skelett.
 * Feature: F-01
 */
export function ProfileView() {
  const { auth, user, authReady, mode } = useAppServices();
  const showToast = useToast();

  if (!authReady) return <div className={styles.skeleton} aria-busy="true" aria-label="Profil wird geladen" />;

  if (!user) {
    return (
      <div className={styles.view}>
        <h1 className={styles.title}>Profil</h1>
        <p className={styles.lead}>Treffen ansehen geht ohne Konto. Zum Mitmachen und Erstellen meldest du dich an.</p>
        <div className={styles.actions}>
          <Link href="/anmelden" className={styles.primary}>
            Anmelden
          </Link>
          <Link href="/anmelden?modus=registrieren" className={styles.secondary}>
            Registrieren
          </Link>
        </div>
      </div>
    );
  }

  const signOut = async () => {
    try {
      await auth.signOut();
      showToast('Abgemeldet');
    } catch (error) {
      showToast(describeActionFailure(error), 'error');
    }
  };

  return (
    <div className={styles.view}>
      <h1 className={styles.title}>Profil</h1>
      <div className={styles.card}>
        <span className={styles.avatar} aria-hidden="true">
          {user.displayName.charAt(0).toUpperCase()}
        </span>
        <div className={styles.identity}>
          <p className={styles.name}>{user.displayName}</p>
          <p className={styles.email}>{user.email ?? 'Demo-Person ohne E-Mail'}</p>
        </div>
      </div>
      {mode === 'local' && <p className={styles.note}>Demo-Modus: Konto und Anmeldung liegen nur in diesem Browser.</p>}
      <button type="button" className={styles.signOut} onClick={signOut}>
        <LogOut size={18} aria-hidden="true" />
        Abmelden
      </button>
    </div>
  );
}
