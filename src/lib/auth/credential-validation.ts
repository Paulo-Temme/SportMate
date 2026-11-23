// Prüft Eingaben von Registrierung und Anmeldung, bevor ein Konto angelegt wird (F-01).
import { AuthError, authMessages } from './auth-error';

/** Grenzwerte, gleich in Oberfläche, lokalem Modus und Datenbank (profiles_display_name_length). */
export const credentialLimits = { passwordMin: 8, displayNameMin: 2, displayNameMax: 40 } as const;

// Bewusst einfach: etwas vor und nach dem @, ein Punkt in der Domain, keine Leerzeichen.
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Vereinheitlicht eine E-Mail-Adresse für Speichern und Vergleich.
 * Eingaben: E-Mail wie eingegeben. Rückgabe: ohne Leerzeichen am Rand, in Kleinbuchstaben.
 * Feature: F-01
 */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Sucht den ersten Fehler in den Eingaben der Registrierung (Reihenfolge wie im Formular).
 * Eingaben: Anzeigename, E-Mail, Passwort. Rückgabe: `AuthError` mit Feld oder `null`. Wirft nicht.
 * Feature: F-01
 */
export function findSignUpError(input: { email: string; password: string; displayName: string }): AuthError | null {
  const nameLength = input.displayName.trim().length;
  if (nameLength < credentialLimits.displayNameMin || nameLength > credentialLimits.displayNameMax) {
    return new AuthError(authMessages.invalidDisplayName, 'displayName');
  }
  if (!emailPattern.test(normalizeEmail(input.email))) return new AuthError(authMessages.invalidEmail, 'email');
  if (input.password.length < credentialLimits.passwordMin) return new AuthError(authMessages.passwordTooShort, 'password');
  return null;
}

/**
 * Prüft die Eingaben der Registrierung.
 * Eingaben: Anzeigename, E-Mail, Passwort. Rückgabe: nichts.
 * Fehler: `AuthError` beim ersten ungültigen Feld.
 * Feature: F-01
 */
export function validateSignUp(input: { email: string; password: string; displayName: string }): void {
  const error = findSignUpError(input);
  if (error) throw error;
}
