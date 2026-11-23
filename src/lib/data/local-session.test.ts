import { describe, expect, it, vi } from 'vitest';
import { createMemoryStorage } from './key-value-storage';
import { LocalSession } from './local-session';

const lea = { id: 'lea', displayName: 'Lea', email: null };

describe('F-32: geteilte Sitzung im lokalen Modus', () => {
  it('F-02 AK1: startet als Gast', () => {
    expect(new LocalSession().getUser()).toBeNull();
  });

  it('F-01 AK5: speichert die Person, benachrichtigt und meldet ab', () => {
    const storage = createMemoryStorage();
    const session = new LocalSession(storage);
    const listener = vi.fn();
    const unsubscribe = session.subscribe(listener);
    session.setUser(lea);
    expect(new LocalSession(storage).getUser()).toEqual(lea);
    expect(listener).toHaveBeenLastCalledWith(lea);
    session.setUser(null);
    expect(session.getUser()).toBeNull();
    unsubscribe();
    session.setUser(lea);
    expect(listener).toHaveBeenCalledTimes(2);
  });

  it.each(['kein json', '{"id":1}', '{"id":"a","displayName":"A"}', '"text"'])('F-32: behandelt beschädigte Sitzung als Gast (%j)', (content) => {
    const storage = createMemoryStorage();
    storage.setItem('sportmate.session.v1', content);
    expect(new LocalSession(storage).getUser()).toBeNull();
  });
});
