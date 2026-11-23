// Tests des Rücksprungziels nach der Anmeldung (F-02).
import { describe, expect, it } from 'vitest';
import { resolveReturnPath } from './return-path';

describe('resolveReturnPath', () => {
  it('F-02 AK3: führt zurück zu den Details des Treffens', () => {
    expect(resolveReturnPath('/treffen/t-volleyball-1', '/')).toBe('/treffen/t-volleyball-1');
  });

  it('F-02 AK3: lehnt fremde Ziele ab und nutzt das Ersatzziel', () => {
    expect(resolveReturnPath('https://example.org', '/')).toBe('/');
    expect(resolveReturnPath('//example.org', '/')).toBe('/');
    expect(resolveReturnPath('/\\example.org', '/')).toBe('/');
    expect(resolveReturnPath(null, '/profil')).toBe('/profil');
  });
});
