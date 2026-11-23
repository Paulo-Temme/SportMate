// Anmeldung über Supabase Auth; Anzeigename aus der Tabelle profiles (F-01).
import type { SupabaseClient } from '@supabase/supabase-js';
import { AuthError, authMessages } from '../auth/auth-error';
import type { AuthUser } from '../auth/auth-user';
import type { AuthGateway, SignInInput, SignUpInput } from './auth-gateway';

const notImplementedMessage = 'Die Anmeldung über Supabase ist noch nicht umgesetzt.';

/**
 * Supabase-Umsetzung von `AuthGateway`. Noch Platzhalter (Schritt 1 des Vertrags).
 * Feature: F-01
 */
export class SupabaseAuthGateway implements AuthGateway {
  private readonly client: SupabaseClient;

  constructor(client: SupabaseClient) {
    this.client = client;
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    void this.client;
    throw new Error(notImplementedMessage);
  }

  async signUp(input: SignUpInput): Promise<AuthUser> {
    void input;
    throw new Error(notImplementedMessage);
  }

  async signIn(input: SignInInput): Promise<AuthUser> {
    void input;
    throw new Error(notImplementedMessage);
  }

  async signOut(): Promise<void> {
    throw new Error(notImplementedMessage);
  }

  onAuthChange(listener: (user: AuthUser | null) => void): () => void {
    void listener;
    return () => undefined;
  }

  listDemoAccounts(): AuthUser[] {
    return [];
  }

  async signInAsDemo(userId: string): Promise<AuthUser> {
    void userId;
    throw new AuthError(authMessages.demoOnlyLocal);
  }
}
