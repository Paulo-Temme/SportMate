// Tests der verständlichen Fehlermeldung für Aktionen in der Oberfläche (F-22, F-17, F-01).
import { describe, expect, it } from 'vitest';
import { AuthError } from '../auth/auth-error';
import { EventError } from './event-error';
import { connectionFailureMessage, describeActionFailure } from './failure-message';

describe('F-22 AK4: verständliche Fehlermeldungen', () => {
  it('F-22 AK4: Fachfehler behalten ihre deutsche Meldung', () => {
    expect(describeActionFailure(new EventError('Ausgebucht'))).toBe('Ausgebucht');
    expect(describeActionFailure(new AuthError('E-Mail oder Passwort stimmt nicht.'))).toBe('E-Mail oder Passwort stimmt nicht.');
  });

  it('F-22 AK4: technische Fehler (Netz, unbekannt) zeigen nie die Rohmeldung', () => {
    expect(describeActionFailure(new TypeError('Failed to fetch'))).toBe(connectionFailureMessage);
    expect(describeActionFailure(new Error('JWT expired'))).toBe(connectionFailureMessage);
    expect(describeActionFailure('kaputt')).toBe(connectionFailureMessage);
    expect(describeActionFailure(undefined)).toBe(connectionFailureMessage);
    expect(connectionFailureMessage).toBe('Das hat nicht geklappt. Bitte prüfe deine Verbindung und versuche es erneut.');
  });
});
