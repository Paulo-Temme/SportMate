// Anmeldung über Supabase Auth; Anzeigename aus der Tabelle profiles (F-01).
import type { SupabaseClient, User } from '@supabase/supabase-js';
import { AuthError, authMessages } from '../auth/auth-error';
import type { AuthUser } from '../auth/auth-user';
import { normalizeEmail, validateSignUp } from '../auth/credential-validation';
import type { AuthGateway, SignInInput, SignUpInput } from './auth-gateway';
import { translateAuthError } from './supabase-error-translation';

const fallbackDisplayName = 'Neues Mitglied';

function readMetadataName(user: User): string | null {
  const name: unknown = user.user_metadata?.display_name;
  return typeof name === 'string' && name.trim() !== '' ? name.trim() : null;
}

/**
 * Supabase-Umsetzung von `AuthGateway`. Passwörter und Sitzungen verwaltet Supabase Auth;
 * der Anzeigename kommt aus `profiles` (vom Trigger bei der Registrierung angelegt).
 * Eingaben: Supabase-Client. Fehler: `AuthError` mit deutscher Meldung, technische Fehler als `Error`.
 * Feature: F-01
 */
export class SupabaseAuthGateway implements AuthGateway {
  private readonly client: SupabaseClient;

  constructor(client: SupabaseClient) {
    this.client = client;
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    const { data, error } = await this.client.auth.getSession();
    if (error) throw new Error(authMessages.unexpected);
    return data.session ? this.buildUser(data.session.user) : null;
  }

  async signUp(input: SignUpInput): Promise<AuthUser> {
    validateSignUp(input);
    const { data, error } = await this.client.auth.signUp({
      email: normalizeEmail(input.email),
      password: input.password,
      options: { data: { display_name: input.displayName.trim() } },
    });
    if (error) throw translateAuthError(error);
    // Mit eingeschalteter E-Mail-Bestätigung meldet Supabase vergebene Adressen als Konto ohne Identität.
    if (data.user?.identities?.length === 0) throw new AuthError(authMessages.emailTaken, 'email');
    if (!data.session || !data.user) throw new AuthError(authMessages.emailNotConfirmed);
    return this.buildUser(data.user);
  }

  async signIn(input: SignInInput): Promise<AuthUser> {
    const { data, error } = await this.client.auth.signInWithPassword({ email: normalizeEmail(input.email), password: input.password });
    if (error) throw translateAuthError(error);
    return this.buildUser(data.user);
  }

  async signOut(): Promise<void> {
    const { error } = await this.client.auth.signOut();
    if (error) throw new Error(authMessages.unexpected);
  }

  onAuthChange(listener: (user: AuthUser | null) => void): () => void {
    // Nach dem Abbestellen darf ein schon geplanter Rückruf nichts mehr melden (REV-12).
    let active = true;
    const notify = (user: AuthUser | null) => {
      if (active) listener(user);
    };
    const { data } = this.client.auth.onAuthStateChange((_event, session) => {
      // Keine Supabase-Aufrufe direkt im Rückruf (supabase-js kann sonst blockieren), deshalb verzögert.
      setTimeout(() => {
        if (!active) return;
        void (session ? this.buildUser(session.user) : Promise.resolve(null)).then(notify);
      }, 0);
    });
    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }

  listDemoAccounts(): AuthUser[] {
    return [];
  }

  async signInAsDemo(userId: string): Promise<AuthUser> {
    void userId;
    throw new AuthError(authMessages.demoOnlyLocal);
  }

  /** Person mit Anzeigename aus `profiles`; ist das Profil nicht lesbar, aus den Metadaten der Registrierung. */
  private async buildUser(user: User): Promise<AuthUser> {
    const { data } = await this.client.from('profiles').select('display_name').eq('id', user.id).maybeSingle();
    const profileName: unknown = data?.display_name;
    const displayName = typeof profileName === 'string' ? profileName : (readMetadataName(user) ?? fallbackDisplayName);
    return { id: user.id, displayName, email: user.email ?? null };
  }
}
