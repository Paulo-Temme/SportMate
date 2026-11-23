// Schnittstelle für Registrieren, Anmelden und Abmelden. Oberfläche kennt nur diese Schnittstelle (F-01, F-02).
import type { AuthUser } from '../auth/auth-user';

export type { AuthUser } from '../auth/auth-user';
export { AuthError, type AuthField } from '../auth/auth-error';

/** Eingaben der Registrierung. */
export type SignUpInput = { email: string; password: string; displayName: string };

/** Eingaben der Anmeldung. */
export type SignInInput = { email: string; password: string };

/**
 * Anmeldung. Umsetzungen: lokal im Browser (`LocalAuthGateway`) und Supabase (`SupabaseAuthGateway`).
 * Fehler: Fachfehler als `AuthError` mit deutscher Meldung; technische Fehler als `Error`.
 * Feature: F-01
 */
export interface AuthGateway {
  /** Angemeldete Person oder `null` für Gäste. */
  getCurrentUser(): Promise<AuthUser | null>;

  /** Legt ein Konto an und meldet an. Fehler: E-Mail ungültig/vergeben, Passwort < 8, Anzeigename nicht 2–40. */
  signUp(input: SignUpInput): Promise<AuthUser>;

  /** Meldet an. Fehler: "E-Mail oder Passwort falsch." */
  signIn(input: SignInInput): Promise<AuthUser>;

  /** Meldet ab. Danach ist die Person Gast. */
  signOut(): Promise<void>;

  /** Meldet jede Änderung der angemeldeten Person. Rückgabe: Funktion zum Abbestellen. */
  onAuthChange(listener: (user: AuthUser | null) => void): () => void;

  /** Demo-Konten zum schnellen Anmelden. Nur lokal befüllt, im Supabase-Modus leer. */
  listDemoAccounts(): AuthUser[];

  /** Meldet als Demo-Konto an. Nur lokal; Supabase wirft `AuthError`. */
  signInAsDemo(userId: string): Promise<AuthUser>;
}
