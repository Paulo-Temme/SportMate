import { describe, expect, it } from 'vitest';
import { createSampleEvents, createSampleStoredEvents, fixedNow, member } from '../../../tests/fixtures/sample-events';
import { describeEventStatus } from './event-presentation';
import { searchEvents } from './event-search';
import { emptyFilters } from './event-model';
import { addParticipant, cancelEvent, checkJoinAvailability, removeParticipant } from './participation';
import { toViewerEvent, type StoredEvent } from './stored-event';

const ids = (event: StoredEvent) => event.participants.map((person) => person.id);
const view = (event: StoredEvent, viewerId: string | null = null) => toViewerEvent(event, viewerId);

const [football, , badminton] = createSampleStoredEvents();

describe('F-00 AK2: Teilnehmen, Verlassen und Absagen', () => {
  it('F-00 AK2: verweigert Gästen jede Änderung', () => {
    expect(() => addParticipant(football, { id: '', displayName: '' }, fixedNow)).toThrow('anmelden');
    expect(() => removeParticipant(football, '', fixedNow)).toThrow('anmelden');
    expect(() => cancelEvent(football, ' ', fixedNow)).toThrow('anmelden');
  });

  it('F-00 AK2: verhindert Doppelteilnahme und Überbelegung, ohne die Eingabe zu ändern', () => {
    const joined = addParticipant(badminton, member('lea'), fixedNow);
    expect(ids(badminton)).toEqual(['alex']);
    expect(ids(joined)).toEqual(['alex', 'lea']);
    expect(addParticipant(joined, member('lea'), fixedNow)).toBe(joined);
    expect(describeEventStatus(view(joined), fixedNow)).toBe('Ausgebucht');
    expect(() => addParticipant(joined, member('tom'), fixedNow)).toThrow('Leider gerade ausgebucht.');
    const left = removeParticipant(joined, 'lea', fixedNow);
    expect(ids(addParticipant(left, member('tom'), fixedNow))).toEqual(['alex', 'tom']);
  });

  it('F-00 AK2: prüft die Rechte der organisierenden Person unabhängig von der Oberfläche', () => {
    expect(() => cancelEvent(football, 'lea', fixedNow)).toThrow('Nur');
    expect(() => removeParticipant(football, 'alex', fixedNow)).toThrow('organisierende');
    const cancelled = cancelEvent(football, 'alex', fixedNow);
    expect(cancelled.status).toBe('cancelled');
    expect(cancelEvent(cancelled, 'alex', fixedNow)).toBe(cancelled);
    expect(describeEventStatus(view(cancelled), fixedNow)).toBe('Abgesagt');
    expect(() => addParticipant(cancelled, member('lea'), fixedNow)).toThrow('abgesagt');
    expect(() => removeParticipant(cancelled, 'kim', fixedNow)).toThrow('abgesagt');
    expect(searchEvents([view(cancelled)], emptyFilters, fixedNow)).toEqual([]);
    expect(searchEvents([view(cancelled, 'alex')], { ...emptyFilters, mine: true }, fixedNow)).toHaveLength(1);
  });

  it('F-00 AK2: sperrt Änderungen ab Beginn des Treffens', () => {
    const start = new Date(football.startsAt);
    expect(() => addParticipant(football, member('lea'), start)).toThrow('begonnen');
    expect(() => removeParticipant(football, 'kim', start)).toThrow('begonnen');
    expect(() => cancelEvent(football, 'alex', start)).toThrow('begonnen');
  });
});

describe('F-00 AK2: Vorabprüfung für den Teilnehmen-Knopf', () => {
  it('F-00 AK2: erlaubt Beitritt bei freien Plätzen, auch für Gäste', () => {
    expect(checkJoinAvailability(view(badminton, 'lea'), fixedNow)).toEqual({ canJoin: true });
    expect(checkJoinAvailability(view(badminton), fixedNow)).toEqual({ canJoin: true });
  });

  const [footballView, volleyballView] = createSampleEvents();

  it.each([
    [{ ...footballView, status: 'cancelled' as const }, 'cancelled', 'Dieses Treffen wurde abgesagt.'],
    [{ ...footballView, startsAt: '' }, 'unknown-date', 'Der Termin ist noch nicht bekannt.'],
    [{ ...footballView, startsAt: fixedNow.toISOString() }, 'started', 'Dieses Treffen hat bereits begonnen.'],
    [createSampleEvents('kim')[0], 'already-joined', 'Du bist bereits dabei.'],
    [volleyballView, 'full', 'Dieses Treffen ist ausgebucht.'],
    [{ ...footballView, capacity: NaN }, 'unknown-places', 'Die verfügbaren Plätze sind noch nicht bekannt.'],
  ])('F-22 AK2: nennt den Grund, warum Beitritt nicht geht (%#)', (event, reason, message) => {
    const before = structuredClone(event);
    expect(checkJoinAvailability(event, fixedNow)).toEqual({ canJoin: false, reason, message });
    expect(event).toEqual(before);
  });
});
