import { describe, expect, it } from 'vitest';
import { createSampleEvents, fixedNow } from '../../../tests/fixtures/sample-events';
import { describeEventStatus } from './event-presentation';
import { searchEvents } from './event-search';
import { emptyFilters } from './event-model';
import { addParticipant, cancelEvent, checkJoinAvailability, removeParticipant } from './participation';

const [football, volleyball, badminton] = createSampleEvents();

describe('F-00 AK2: Teilnehmen, Verlassen und Absagen', () => {
  it('F-00 AK2: verweigert Gästen jede Änderung', () => {
    expect(() => addParticipant(football, '', fixedNow)).toThrow('anmelden');
    expect(() => removeParticipant(football, '', fixedNow)).toThrow('anmelden');
    expect(() => cancelEvent(football, ' ', fixedNow)).toThrow('anmelden');
  });

  it('F-00 AK2: verhindert Doppelteilnahme und Überbelegung, ohne die Eingabe zu ändern', () => {
    const joined = addParticipant(badminton, 'lea', fixedNow);
    expect(badminton.participants).toEqual(['alex']);
    expect(joined.participants).toEqual(['alex', 'lea']);
    expect(addParticipant(joined, 'lea', fixedNow)).toBe(joined);
    expect(describeEventStatus(joined, fixedNow)).toBe('Ausgebucht');
    expect(() => addParticipant(joined, 'tom', fixedNow)).toThrow('Ausgebucht');
    const left = removeParticipant(joined, 'lea', fixedNow);
    expect(addParticipant(left, 'tom', fixedNow).participants).toEqual(['alex', 'tom']);
  });

  it('F-00 AK2: prüft die Rechte der organisierenden Person unabhängig von der Oberfläche', () => {
    expect(() => cancelEvent(football, 'lea', fixedNow)).toThrow('Nur');
    expect(() => removeParticipant(football, 'alex', fixedNow)).toThrow('organisierende');
    const cancelled = cancelEvent(football, 'alex', fixedNow);
    expect(cancelled.status).toBe('cancelled');
    expect(cancelEvent(cancelled, 'alex', fixedNow)).toBe(cancelled);
    expect(describeEventStatus(cancelled, fixedNow)).toBe('Abgesagt');
    expect(() => addParticipant(cancelled, 'lea', fixedNow)).toThrow('abgesagt');
    expect(() => removeParticipant(cancelled, 'kim', fixedNow)).toThrow('abgesagt');
    expect(searchEvents([cancelled], emptyFilters, '', fixedNow)).toEqual([]);
    expect(searchEvents([cancelled], { ...emptyFilters, mine: true }, 'alex', fixedNow)).toHaveLength(1);
  });

  it('F-00 AK2: sperrt Änderungen ab Beginn des Treffens', () => {
    const start = new Date(football.startsAt);
    expect(() => addParticipant(football, 'lea', start)).toThrow('begonnen');
    expect(() => removeParticipant(football, 'kim', start)).toThrow('begonnen');
    expect(() => cancelEvent(football, 'alex', start)).toThrow('begonnen');
  });
});

describe('F-00 AK2: Vorabprüfung für den Teilnehmen-Knopf', () => {
  it('F-00 AK2: erlaubt Beitritt bei freien Plätzen, auch für Gäste', () => {
    expect(checkJoinAvailability(badminton, 'lea', fixedNow)).toEqual({ canJoin: true });
    expect(checkJoinAvailability(badminton, '', fixedNow)).toEqual({ canJoin: true });
  });

  it.each([
    [{ ...football, status: 'cancelled' as const }, '', 'cancelled', 'Dieses Treffen wurde abgesagt.'],
    [{ ...football, startsAt: '' }, '', 'unknown-date', 'Der Termin ist noch nicht bekannt.'],
    [{ ...football, startsAt: fixedNow.toISOString() }, '', 'started', 'Dieses Treffen hat bereits begonnen.'],
    [football, 'kim', 'already-joined', 'Du bist bereits dabei.'],
    [volleyball, 'lea', 'full', 'Dieses Treffen ist ausgebucht.'],
    [{ ...football, capacity: NaN }, '', 'unknown-places', 'Die verfügbaren Plätze sind noch nicht bekannt.'],
  ])('F-00 AK2: nennt den Grund, warum Beitritt nicht geht (%#)', (event, userId, reason, message) => {
    const before = structuredClone(event);
    expect(checkJoinAvailability(event, userId, fixedNow)).toEqual({ canJoin: false, reason, message });
    expect(event).toEqual(before);
  });
});
