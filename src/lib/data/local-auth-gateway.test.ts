import { describe, expect, it, vi } from 'vitest';
import { AuthError } from './auth-gateway';
import { createMemoryStorage, type KeyValueStorage } from './key-value-storage';
import { LocalAuthGateway } from './local-auth-gateway';
import { LocalSession } from './local-session';

const accountsKey = 'sportmate.accounts.v1';
const leaInput = { email: 'lea@example.org', password: 'sportmate1', displayName: 'Lea' };

function createGateway(storage: KeyValueStorage = createMemoryStorage()) {
  const session = new LocalSession(storage);
  let counter = 0;
  const gateway = new LocalAuthGateway({ session, storage, createId: () => `konto-${++counter}` });
  return { gateway, session, storage };
}

describe('F-01: Registrieren, anmelden, abmelden im lokalen Modus', () => {
  it('F-02 AK1: startet als Gast', async () => {
    expect(await createGateway().gateway.getCurrentUser()).toBeNull();
  });

  it('F-01 AK1: Registrierung meldet sofort an', async () => {
    const { gateway, session } = createGateway();
    const user = await gateway.signUp({ ...leaInput, displayName: ' Lea ', email: ' Lea@Example.org ' });
    expect(user).toEqual({ id: 'konto-1', displayName: 'Lea', email: 'lea@example.org' });
    expect(await gateway.getCurrentUser()).toEqual(user);
    expect(session.getUser()).toEqual(user);
  });

  it('F-01 AK1: speichert das Passwort nur als Hash', async () => {
    const { gateway, storage } = createGateway();
    await gateway.signUp(leaInput);
    const stored = storage.getItem(accountsKey) ?? '';
    expect(stored).toContain('lea@example.org');
    expect(stored).not.toContain('sportmate1');
    expect(stored).toMatch(/[0-9a-f]{64}/);
  });

  it('F-01 AK2: lehnt ein zu kurzes Passwort ab und legt kein Konto an', async () => {
    const { gateway, storage } = createGateway();
    await expect(gateway.signUp({ ...leaInput, password: 'kurz12' })).rejects.toThrow('Mindestens 8 Zeichen');
    expect(storage.getItem(accountsKey)).toBeNull();
    expect(await gateway.getCurrentUser()).toBeNull();
  });

  it('F-01 AK3: lehnt eine bereits verwendete E-Mail ab, auch in anderer Schreibweise', async () => {
    const { gateway } = createGateway();
    await gateway.signUp(leaInput);
    await gateway.signOut();
    const error = await gateway.signUp({ ...leaInput, email: 'LEA@example.org', displayName: 'Andere' }).catch((caught: unknown) => caught);
    expect(error).toBeInstanceOf(AuthError);
    expect((error as AuthError).message).toBe('Diese E-Mail wird bereits verwendet.');
    expect((error as AuthError).field).toBe('email');
    expect(await gateway.getCurrentUser()).toBeNull();
  });

  it('F-01 AK4: falsches Passwort lässt die Person abgemeldet', async () => {
    const { gateway } = createGateway();
    await gateway.signUp(leaInput);
    await gateway.signOut();
    await expect(gateway.signIn({ email: leaInput.email, password: 'falsch123' })).rejects.toThrow('E-Mail oder Passwort falsch.');
    await expect(gateway.signIn({ email: 'tom@example.org', password: 'sportmate1' })).rejects.toThrow('E-Mail oder Passwort falsch.');
    expect(await gateway.getCurrentUser()).toBeNull();
  });

  it('F-01 AK4: richtige Daten melden an, auch nach Neuladen', async () => {
    const storage = createMemoryStorage();
    const first = createGateway(storage).gateway;
    await first.signUp(leaInput);
    await first.signOut();
    const { gateway } = createGateway(storage);
    const user = await gateway.signIn({ email: ' LEA@example.org', password: 'sportmate1' });
    expect(user.displayName).toBe('Lea');
    expect(await createGateway(storage).gateway.getCurrentUser()).toEqual(user);
  });

  it('F-01 AK5: Abmelden macht die Person zum Gast und benachrichtigt', async () => {
    const { gateway } = createGateway();
    const listener = vi.fn();
    const unsubscribe = gateway.onAuthChange(listener);
    const user = await gateway.signUp(leaInput);
    expect(listener).toHaveBeenLastCalledWith(user);
    await gateway.signOut();
    expect(listener).toHaveBeenLastCalledWith(null);
    expect(await gateway.getCurrentUser()).toBeNull();
    unsubscribe();
    await gateway.signInAsDemo('tom');
    expect(listener).toHaveBeenCalledTimes(2);
  });

  it('F-01: behandelt beschädigte Kontodaten wie leer', async () => {
    const storage = createMemoryStorage();
    storage.setItem(accountsKey, 'kein json');
    const { gateway } = createGateway(storage);
    await expect(gateway.signIn({ email: leaInput.email, password: leaInput.password })).rejects.toThrow('falsch');
    expect((await gateway.signUp(leaInput)).email).toBe('lea@example.org');
  });
});

describe('F-32: Demo-Konten im lokalen Modus', () => {
  it('F-32: listet alle Demopersonen ohne E-Mail', () => {
    const accounts = createGateway().gateway.listDemoAccounts();
    expect(accounts).toHaveLength(7);
    expect(accounts[0]).toEqual({ id: 'lea', displayName: 'Lea', email: null });
    expect(accounts.every((account) => account.email === null)).toBe(true);
  });

  it('F-32: meldet als Demoperson an und lehnt Unbekannte ab', async () => {
    const { gateway } = createGateway();
    expect(await gateway.signInAsDemo('tom')).toEqual({ id: 'tom', displayName: 'Tom', email: null });
    expect((await gateway.getCurrentUser())?.id).toBe('tom');
    for (const userId of ['unbekannt', '__proto__', '']) await expect(gateway.signInAsDemo(userId)).rejects.toThrow('Demo-Person');
    expect((await gateway.getCurrentUser())?.id).toBe('tom');
  });
});
