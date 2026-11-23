import type { SupabaseClient } from '@supabase/supabase-js';
import { describe, expect, it, vi } from 'vitest';
import { validInput } from '../../../tests/fixtures/sample-events';
import { SupabaseAuthGateway } from './supabase-auth-gateway';
import { SupabaseEventRepository } from './supabase-event-repository';

/** Kleiner Ersatz für den Supabase-Client: nur die Teile, die die Umsetzungen ohne Netz aufrufen. */
function createFakeClient(options: { userId?: string; rpcError?: { message: string; details?: string } } = {}) {
  const session = options.userId ? { user: { id: options.userId, email: 'lea@example.org', user_metadata: {} } } : null;
  const rpc = vi.fn(async () => ({ data: null, error: options.rpcError ?? null }));
  const auth = {
    getSession: vi.fn(async () => ({ data: { session }, error: null })),
    signUp: vi.fn(async () => ({ data: { user: null, session: null }, error: { code: 'user_already_exists', message: 'User already registered' } })),
    signInWithPassword: vi.fn(async () => ({ data: { user: null, session: null }, error: { code: 'invalid_credentials', message: 'Invalid login credentials' } })),
    signOut: vi.fn(async () => ({ error: null })),
  };
  return { client: { rpc, auth } as unknown as SupabaseClient, rpc, auth };
}

describe('F-01: Anmeldung über Supabase ohne Netz', () => {
  it('F-01 AK2: prüft das Passwort, bevor Supabase gefragt wird', async () => {
    const { client, auth } = createFakeClient();
    await expect(new SupabaseAuthGateway(client).signUp({ email: 'lea@example.org', password: 'kurz12', displayName: 'Lea' })).rejects.toThrow(
      'Mindestens 8 Zeichen',
    );
    expect(auth.signUp).not.toHaveBeenCalled();
  });

  it('F-01 AK3: übersetzt "E-Mail vergeben" und übergibt den Anzeigenamen', async () => {
    const { client, auth } = createFakeClient();
    await expect(
      new SupabaseAuthGateway(client).signUp({ email: ' Lea@example.org ', password: 'sportmate1', displayName: ' Lea ' }),
    ).rejects.toThrow('Diese E-Mail wird bereits verwendet.');
    expect(auth.signUp).toHaveBeenCalledWith({ email: 'lea@example.org', password: 'sportmate1', options: { data: { display_name: 'Lea' } } });
  });

  it('F-01 AK4: übersetzt falsches Passwort', async () => {
    const { client } = createFakeClient();
    await expect(new SupabaseAuthGateway(client).signIn({ email: 'lea@example.org', password: 'falsch123' })).rejects.toThrow(
      'E-Mail oder Passwort falsch.',
    );
  });

  it('F-01: kennt keine Demo-Konten', async () => {
    const gateway = new SupabaseAuthGateway(createFakeClient().client);
    expect(gateway.listDemoAccounts()).toEqual([]);
    await expect(gateway.signInAsDemo('lea')).rejects.toThrow('nur im Demo-Modus');
  });

  it('F-01 AK5: meldet ab und liefert Gäste als null', async () => {
    const { client, auth } = createFakeClient();
    const gateway = new SupabaseAuthGateway(client);
    await gateway.signOut();
    expect(auth.signOut).toHaveBeenCalled();
    expect(await gateway.getCurrentUser()).toBeNull();
  });
});

describe('F-22: Datenzugriff über Supabase ohne Netz', () => {
  it('F-02 AK2: Gäste bekommen keine Teilnehmerliste und keine Kennung', async () => {
    const { client, rpc } = createFakeClient();
    const repository = new SupabaseEventRepository(client);
    expect(await repository.getCurrentUserId()).toBeNull();
    expect(await repository.listParticipants('6a1f0c1e-0000-4000-8000-000000000001')).toEqual([]);
    expect(rpc).not.toHaveBeenCalled();
  });

  it('F-22 AK4: übersetzt EVENT_FULL beim Beitritt', async () => {
    const { client, rpc } = createFakeClient({ userId: 'lea-id', rpcError: { message: 'EVENT_FULL' } });
    await expect(new SupabaseEventRepository(client).joinEvent('6a1f0c1e-0000-4000-8000-000000000001')).rejects.toThrow(
      'Leider gerade ausgebucht.',
    );
    expect(rpc).toHaveBeenCalledWith('join_event', { p_event_id: '6a1f0c1e-0000-4000-8000-000000000001' });
  });

  it('F-20 AK2: NOT_PARTICIPANT ergibt eine leere Liste', async () => {
    const { client } = createFakeClient({ userId: 'lea-id', rpcError: { message: 'NOT_PARTICIPANT' } });
    expect(await new SupabaseEventRepository(client).listParticipants('6a1f0c1e-0000-4000-8000-000000000001')).toEqual([]);
  });

  it('F-17 AK3: prüft Eingaben vor dem Aufruf und meldet das Feld', async () => {
    const { client, rpc } = createFakeClient({ userId: 'lea-id' });
    const error = await new SupabaseEventRepository(client)
      .createEvent({ ...validInput, startsAt: '2000-01-01T10:00:00Z', endsAt: '2000-01-01T12:00:00Z' })
      .catch((caught: unknown) => caught);
    expect((error as { field?: string }).field).toBe('startsAt');
    expect(rpc).not.toHaveBeenCalled();
  });

  it('F-22: unbekannte Kennungen ohne UUID-Form gibt es nicht', async () => {
    const { client, rpc } = createFakeClient({ userId: 'lea-id' });
    const repository = new SupabaseEventRepository(client);
    expect(await repository.getEvent('demo-fussball')).toBeNull();
    await expect(repository.joinEvent('kein-uuid')).rejects.toThrow('Dieses Treffen gibt es nicht.');
    expect(rpc).not.toHaveBeenCalled();
  });
});
