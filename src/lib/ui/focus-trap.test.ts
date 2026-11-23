// Tests der Fokusfalle für modale Dialoge (REV-05, REV-06; F-18, F-06).
import { describe, expect, it } from 'vitest';
import { findTrapTarget } from './focus-trap';

describe('F-18 AK1 (REV-05): Fokusfalle', () => {
  it('F-18 AK1: springt vom letzten zum ersten Element und rückwärts vom ersten zum letzten', () => {
    expect(findTrapTarget(2, 3, false)).toBe(0);
    expect(findTrapTarget(0, 3, true)).toBe(2);
  });

  it('F-18 AK1: dazwischen übernimmt der Browser (kein Eingriff)', () => {
    expect(findTrapTarget(0, 3, false)).toBeNull();
    expect(findTrapTarget(1, 3, true)).toBeNull();
  });

  it('F-18 AK1: Fokus außerhalb des Dialogs wird hineingeholt; ohne Ziele bleibt er im Dialog', () => {
    expect(findTrapTarget(-1, 3, false)).toBe(0);
    expect(findTrapTarget(-1, 3, true)).toBe(2);
    expect(findTrapTarget(0, 1, false)).toBe(0);
    expect(findTrapTarget(-1, 0, false)).toBe(-1);
  });
});
