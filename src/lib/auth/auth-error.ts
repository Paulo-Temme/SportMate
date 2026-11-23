// Fehler beim Registrieren oder Anmelden mit deutscher Meldung und optional dem betroffenen Feld (F-01).

/** Formularfelder von Registrierung und Anmeldung. */
export type AuthField = 'email' | 'password' | 'displayName';

/**
 * Wird geworfen, wenn Registrierung oder Anmeldung scheitern (falsches Passwort, E-Mail vergeben, ungültige Eingabe).
 * Eingaben: deutsche Meldung, optional das Feld.
 * Feature: F-01
 */
export class AuthError extends Error {
  readonly field?: AuthField;

  constructor(message: string, field?: AuthField) {
    super(message);
    this.name = 'AuthError';
    this.field = field;
  }
}

/** Feste Meldungen, an einer Stelle, damit lokaler und Supabase-Modus gleich klingen. */
export const authMessages = {
  wrongCredentials: 'E-Mail oder Passwort falsch.',
  emailTaken: 'Diese E-Mail wird bereits verwendet.',
  passwordTooShort: 'Mindestens 8 Zeichen.',
  invalidEmail: 'Bitte eine gültige E-Mail-Adresse eingeben.',
  invalidDisplayName: 'Der Anzeigename muss 2–40 Zeichen haben.',
  unknownDemoAccount: 'Bitte eine Demo-Person auswählen.',
  demoOnlyLocal: 'Demo-Konten gibt es nur im Demo-Modus.',
  emailNotConfirmed: 'Bitte bestätige zuerst deine E-Mail-Adresse.',
  unexpected: 'Das hat nicht geklappt. Bitte später erneut versuchen.',
} as const;
