// Tests der Rastpunkt-Logik des Bottom Sheets: Höhen je Rastpunkt, Wahl nach Ziehen und Tastaturschritte (F-05, F-08).
import { describe, expect, it } from 'vitest';
import { chooseSnapPoint, computeSnapHeights, stepSnapPoint } from './sheet-snap';

const heights = { peek: 120, half: 400, full: 760 };

describe('computeSnapHeights', () => {
  it('F-05 AK1: Spitze ist fest, halb ist die Hälfte, voll lässt oben Platz', () => {
    expect(computeSnapHeights(800)).toEqual({ peek: 120, half: 400, full: 760 });
  });

  it('F-08 AK4: kleine Bildschirme behalten eine aufsteigende Reihenfolge', () => {
    const small = computeSnapHeights(300);
    expect(small.peek).toBeLessThan(small.half);
    expect(small.half).toBeLessThan(small.full);
  });
});

describe('chooseSnapPoint', () => {
  it('F-05 AK1: ohne Schwung rastet das Sheet am nächsten Punkt ein', () => {
    expect(chooseSnapPoint(150, 0, heights)).toBe('peek');
    expect(chooseSnapPoint(330, 0, heights)).toBe('half');
    expect(chooseSnapPoint(700, 0, heights)).toBe('full');
  });

  it('F-05 AK1: schneller Wisch nach oben springt zum nächsthöheren Punkt', () => {
    expect(chooseSnapPoint(420, 900, heights)).toBe('full');
    expect(chooseSnapPoint(140, 900, heights)).toBe('half');
  });

  it('F-05 AK1: schneller Wisch nach unten springt zum nächsttieferen Punkt', () => {
    expect(chooseSnapPoint(390, -900, heights)).toBe('peek');
    expect(chooseSnapPoint(740, -900, heights)).toBe('half');
  });

  it('F-05 AK1: Schwung über die Grenzen hinaus bleibt bei Spitze oder voll', () => {
    expect(chooseSnapPoint(760, 3000, heights)).toBe('full');
    expect(chooseSnapPoint(120, -3000, heights)).toBe('peek');
  });
});

describe('stepSnapPoint', () => {
  it('F-05 AK1: Tastatur bewegt das Sheet um einen Rastpunkt', () => {
    expect(stepSnapPoint('peek', 'up')).toBe('half');
    expect(stepSnapPoint('half', 'up')).toBe('full');
    expect(stepSnapPoint('full', 'up')).toBe('full');
    expect(stepSnapPoint('full', 'down')).toBe('half');
    expect(stepSnapPoint('peek', 'down')).toBe('peek');
  });
});
