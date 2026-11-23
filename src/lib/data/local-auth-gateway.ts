// Anmeldung im lokalen Modus: Konten im Browser, Demo-Konten aus demo-people.ts (F-01, F-32).
import { AuthError, authMessages } from '../auth/auth-error';
import type { AuthUser } from '../auth/auth-user';
import type { AuthGateway, SignInInput, SignUpInput } from './auth-gateway';
import type { KeyValueStorage } from './key-value-storage';
import type { LocalSession } from './local-session';

/** Abhängigkeiten der lokalen Anmeldung. */
export type LocalAuthGatewayOptions = {
  session: LocalSession;
  storage?: KeyValueStorage;
  createId?: () => string;
};

/**
 * Lokale Umsetzung von `AuthGateway`. Noch Platzhalter (Schritt 1 des Vertrags).
 * Feature: F-01
 */
export class LocalAuthGateway implements AuthGateway {
  private readonly session: LocalSession;

  constructor(options: LocalAuthGatewayOptions) {
    this.session = options.session;
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    return this.session.getUser();
  }

  async signUp(input: SignUpInput): Promise<AuthUser> {
    void input;
    throw new AuthError(authMessages.unexpected);
  }

  async signIn(input: SignInInput): Promise<AuthUser> {
    void input;
    throw new AuthError(authMessages.unexpected);
  }

  async signOut(): Promise<void> {
    this.session.setUser(null);
  }

  onAuthChange(listener: (user: AuthUser | null) => void): () => void {
    return this.session.subscribe(listener);
  }

  listDemoAccounts(): AuthUser[] {
    return [];
  }

  async signInAsDemo(userId: string): Promise<AuthUser> {
    void userId;
    throw new AuthError(authMessages.unexpected);
  }
}
