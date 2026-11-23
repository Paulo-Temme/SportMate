// Tests der Aufteilung "Ich nehme teil" / "Ich organisiere" für Meine Treffen und Profil (F-24).
import { describe, expect, it } from 'vitest';
import { createSampleEvents } from '../../../tests/fixtures/sample-events';
import { splitViewerEvents } from './viewer-events';

describe('F-24 AK1: eigene Treffen aufteilen', () => {
  it('F-24 AK1: trennt organisierte von besuchten Treffen und ignoriert fremde', () => {
    const [football, volleyball, badminton] = createSampleEvents();
    const organized = { ...football, isViewerOrganizer: true, isViewerParticipant: true };
    const joined = { ...volleyball, isViewerOrganizer: false, isViewerParticipant: true };
    const foreign = { ...badminton, isViewerOrganizer: false, isViewerParticipant: false };
    const split = splitViewerEvents([organized, joined, foreign]);
    expect(split.organizing.map((event) => event.id)).toEqual([organized.id]);
    expect(split.participating.map((event) => event.id)).toEqual([joined.id]);
  });

  it('F-24 AK3: ohne eigene Treffen sind beide Listen leer', () => {
    expect(splitViewerEvents([])).toEqual({ participating: [], organizing: [] });
  });
});
