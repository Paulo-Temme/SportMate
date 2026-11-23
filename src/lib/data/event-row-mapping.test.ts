import { describe, expect, it } from 'vitest';
import { validInput } from '../../../tests/fixtures/sample-events';
import { mapEventRow, toCreateEventParams, type EventRow } from './event-row-mapping';

const row: EventRow = {
  id: '6a1f0c1e-0000-4000-8000-000000000001',
  organizer_id: 'b0b0b0b0-0000-4000-8000-000000000002',
  organizer_name: null,
  is_demo: false,
  sport: 'Volleyball',
  title: 'Volleyball am Abend',
  description: 'Lockeres Spiel',
  meeting_point: 'Halle Sandberg, Eingang Nord',
  location_name: 'Sandberg',
  latitude: 54.78,
  longitude: 9.43,
  starts_at: '2026-11-26T17:00:00+00:00',
  ends_at: '2026-11-26T19:00:00+00:00',
  capacity: 12,
  min_participants: 4,
  level: 'Anfänger',
  age_group: '20–25',
  cost_cents: 350,
  bring_along: 'Hallenschuhe',
  participant_count: 6,
  external_participants: 1,
  status: 'published',
  organizer: { display_name: 'Max' },
};

describe('F-01: Zeilen aus Supabase ins Modell abbilden', () => {
  it('F-12 AK1: bildet alle Felder ab und zählt externe Plätze zur Belegung', () => {
    expect(mapEventRow(row, { userId: null, participatingIds: new Set() })).toEqual({
      id: row.id,
      organizerId: row.organizer_id,
      organizerName: 'Max',
      isDemo: false,
      sport: 'Volleyball',
      title: 'Volleyball am Abend',
      description: 'Lockeres Spiel',
      meetingPoint: 'Halle Sandberg, Eingang Nord',
      locationName: 'Sandberg',
      latitude: 54.78,
      longitude: 9.43,
      startsAt: '2026-11-26T17:00:00.000Z',
      endsAt: '2026-11-26T19:00:00.000Z',
      capacity: 12,
      minParticipants: 4,
      level: 'Anfänger',
      ageGroup: '20–25',
      costCents: 350,
      bringAlong: 'Hallenschuhe',
      participantCount: 7,
      status: 'published',
      isViewerParticipant: false,
      isViewerOrganizer: false,
    });
  });

  it('F-24 AK1: setzt Teilnahme und Organisation aus Sicht der angemeldeten Person', () => {
    const organizer = mapEventRow(row, { userId: row.organizer_id, participatingIds: new Set([row.id]) });
    expect(organizer).toMatchObject({ isViewerParticipant: true, isViewerOrganizer: true });
    const other = mapEventRow(row, { userId: 'fremd', participatingIds: new Set(['anderes-treffen']) });
    expect(other).toMatchObject({ isViewerParticipant: false, isViewerOrganizer: false });
  });

  it('F-14 AK2: nutzt bei fiktiven Treffen den gespeicherten Namen und eine leere Organisator-Kennung', () => {
    const seed = mapEventRow(
      { ...row, organizer_id: null, organizer_name: 'Kim', is_demo: true, organizer: null },
      { userId: null, participatingIds: new Set() },
    );
    expect(seed).toMatchObject({ organizerId: '', organizerName: 'Kim', isDemo: true, isViewerOrganizer: false });
    const nameless = mapEventRow({ ...row, organizer_name: null, organizer: null }, { userId: null, participatingIds: new Set() });
    expect(nameless.organizerName).toBe('Unbekannt');
  });

  it('F-12 AK5: übernimmt den Status "abgesagt"', () => {
    expect(mapEventRow({ ...row, status: 'cancelled' }, { userId: null, participatingIds: new Set() }).status).toBe('cancelled');
  });
});

describe('F-17: Eingaben für create_event', () => {
  it('F-17 AK1: übergibt alle Felder mit Präfix p_ und Zeiten in UTC', () => {
    expect(toCreateEventParams({ ...validInput, costCents: 350, bringAlong: 'Ball' })).toEqual({
      p_sport: 'Basketball',
      p_title: 'Basketball am Campus',
      p_meeting_point: 'Campus Sportplatz',
      p_latitude: 54.774,
      p_longitude: 9.452,
      p_starts_at: '2026-10-28T15:00:00.000Z',
      p_ends_at: '2026-10-28T17:00:00.000Z',
      p_capacity: 10,
      p_min_participants: 4,
      p_level: 'Alle Niveaus',
      p_age_group: '',
      p_description: '',
      p_location_name: 'Campus',
      p_cost_cents: 350,
      p_bring_along: 'Ball',
    });
  });
});
