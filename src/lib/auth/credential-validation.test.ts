import { describe, expect, it } from 'vitest';
import { AuthError } from './auth-error';
import { findSignUpError, normalizeEmail, validateSignUp } from './credential-validation';

const valid = { email: 'lea@example.org', password: 'sportmate1', displayName: 'Lea' };

describe('F-01: Eingaben der Registrierung prüfen', () => {
  it('F-01 AK1: akzeptiert gültige Eingaben', () => {
    expect(findSignUpError(valid)).toBeNull();
    expect(() => validateSignUp(valid)).not.toThrow();
    expect(findSignUpError({ ...valid, password: '12345678', displayName: 'Al' })).toBeNull();
    expect(findSignUpError({ ...valid, displayName: 'x'.repeat(40) })).toBeNull();
  });

  it('F-01 AK2: lehnt Passwörter unter 8 Zeichen ab', () => {
    const error = findSignUpError({ ...valid, password: 'kurz12' });
    expect(error).toBeInstanceOf(AuthError);
    expect(error?.message).toBe('Mindestens 8 Zeichen.');
    expect(error?.field).toBe('password');
    expect(findSignUpError({ ...valid, password: '1234567' })?.field).toBe('password');
  });

  it.each([' ', 'L', 'x'.repeat(41), ' L '])('F-01: lehnt Anzeigenamen außerhalb 2–40 Zeichen ab (%j)', (displayName) => {
    const error = findSignUpError({ ...valid, displayName });
    expect(error?.field).toBe('displayName');
    expect(error?.message).toBe('Der Anzeigename muss 2–40 Zeichen haben.');
  });

  it.each(['', 'lea', 'lea@', '@example.org', 'lea example@org.de', 'lea@example'])('F-01: lehnt ungültige E-Mail ab (%j)', (email) => {
    expect(findSignUpError({ ...valid, email })?.field).toBe('email');
    expect(() => validateSignUp({ ...valid, email })).toThrow('gültige E-Mail');
  });

  it('F-01 AK3: vereinheitlicht E-Mail-Adressen für den Vergleich', () => {
    expect(normalizeEmail('  Lea@Example.ORG ')).toBe('lea@example.org');
  });
});
