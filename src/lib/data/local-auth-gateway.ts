// Anmeldung im lokalen Modus: Konten im Browser mit Passwort-Hash, Demo-Konten aus demo-people.ts (F-01, F-32).
import { AuthError, authMessages } from '../auth/auth-error';
import type { AuthUser } from '../auth/auth-user';
import { normalizeEmail, validateSignUp } from '../auth/credential-validation';
import { demoPeople, isDemoPerson } from '../events/demo-people';
import type { AuthGateway, SignInInput, SignUpInput } from './auth-gateway';
import { createMemoryStorage, readJson, type KeyValueStorage } from './key-value-storage';
import type { LocalSession } from './local-session';

/** Abhängigkeiten der lokalen Anmeldung. */
export type LocalAuthGatewayOptions = {
  session: LocalSession;
  storage?: KeyValueStorage;
  createId?: () => string;
};

/** Gespeichertes Konto. Das Passwort liegt nur als SHA-256-Hash mit eigenem Salz vor. */
type LocalAccount = { id: string; email: string; displayName: string; salt: string; passwordHash: string };

const accountsKey = 'sportmate.accounts.v1';

function isAccountList(value: unknown): value is LocalAccount[] {
  return Array.isArray(value) && value.every((entry) => typeof entry === 'object' && entry !== null && typeof entry.email === 'string');
}

async function hashPassword(password: string, salt: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${salt}:${password}`));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

function toUser(account: LocalAccount): AuthUser {
  return { id: account.id, displayName: account.displayName, email: account.email };
}

/**
 * Lokale Umsetzung von `AuthGateway`. Nur für Demo und Tests: Der Hash schützt das Passwort vor
 * zufälligem Mitlesen im Speicher, ist aber keine Sicherheitsgrenze (alles liegt im Browser).
 * Eingaben: geteilte Sitzung, Speicher für Konten, Erzeuger für Kennungen.
 * Feature: F-01, F-32
 */
export class LocalAuthGateway implements AuthGateway {
  private readonly session: LocalSession;
  private readonly storage: KeyValueStorage;
  private readonly createId: () => string;

  constructor(options: LocalAuthGatewayOptions) {
    this.session = options.session;
    this.storage = options.storage ?? createMemoryStorage();
    this.createId = options.createId ?? (() => crypto.randomUUID());
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    return this.session.getUser();
  }

  async signUp(input: SignUpInput): Promise<AuthUser> {
    validateSignUp(input);
    const email = normalizeEmail(input.email);
    const accounts = this.readAccounts();
    if (accounts.some((account) => account.email === email)) throw new AuthError(authMessages.emailTaken, 'email');
    const salt = crypto.randomUUID();
    const account: LocalAccount = {
      id: this.createId(),
      email,
      displayName: input.displayName.trim(),
      salt,
      passwordHash: await hashPassword(input.password, salt),
    };
    this.storage.setItem(accountsKey, JSON.stringify([...accounts, account]));
    return this.signInAs(toUser(account));
  }

  async signIn(input: SignInInput): Promise<AuthUser> {
    const email = normalizeEmail(input.email);
    const account = this.readAccounts().find((candidate) => candidate.email === email);
    if (!account || (await hashPassword(input.password, account.salt)) !== account.passwordHash) {
      throw new AuthError(authMessages.wrongCredentials);
    }
    return this.signInAs(toUser(account));
  }

  async signOut(): Promise<void> {
    this.session.setUser(null);
  }

  onAuthChange(listener: (user: AuthUser | null) => void): () => void {
    return this.session.subscribe(listener);
  }

  listDemoAccounts(): AuthUser[] {
    return Object.entries(demoPeople).map(([id, displayName]) => ({ id, displayName, email: null }));
  }

  async signInAsDemo(userId: string): Promise<AuthUser> {
    if (!isDemoPerson(userId)) throw new AuthError(authMessages.unknownDemoAccount);
    return this.signInAs({ id: userId, displayName: demoPeople[userId], email: null });
  }

  private signInAs(user: AuthUser): AuthUser {
    this.session.setUser(user);
    return user;
  }

  private readAccounts(): LocalAccount[] {
    return readJson(this.storage, accountsKey, isAccountList) ?? [];
  }
}
