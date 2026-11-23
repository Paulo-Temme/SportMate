// Übersetzt zwischen Tabellenzeilen von Supabase (snake_case) und dem Modell der App. Reine Funktionen (F-01, F-17).
import type { AgeGroup, EventInput, EventStatus, Level, Sport, SportEvent } from '../events/event-model';

/** Zeile aus `events` mit dem eingebetteten Anzeigenamen des Organisators aus `profiles`. */
export type EventRow = {
  id: string;
  organizer_id: string | null;
  organizer_name: string | null;
  is_demo: boolean;
  sport: Sport;
  title: string;
  description: string;
  meeting_point: string;
  location_name: string;
  latitude: number;
  longitude: number;
  starts_at: string;
  ends_at: string;
  capacity: number;
  min_participants: number;
  level: Level;
  age_group: AgeGroup;
  cost_cents: number;
  bring_along: string;
  participant_count: number;
  external_participants: number;
  status: EventStatus;
  organizer: { display_name: string } | null;
};

/** Spaltenauswahl für `EventRow`, inklusive Organisatorname über den Fremdschlüssel. */
export const eventRowColumns =
  'id, organizer_id, organizer_name, is_demo, sport, title, description, meeting_point, location_name, latitude, longitude, ' +
  'starts_at, ends_at, capacity, min_participants, level, age_group, cost_cents, bring_along, participant_count, ' +
  'external_participants, status, organizer:profiles!events_organizer_id_fkey(display_name)';

/** Wer liest: angemeldete Person (oder `null`) und die Treffen, an denen sie teilnimmt. */
export type EventViewer = { userId: string | null; participatingIds: ReadonlySet<string> };

/**
 * Bildet eine Zeile auf das Modell ab. Belegung = App-Teilnahmen + extern belegte Plätze (ADR-0008).
 * Eingaben: Zeile, betrachtende Person. Rückgabe: neues `SportEvent` mit Zeiten als ISO-Text in UTC.
 * Feature: F-01, F-12, F-14
 */
export function mapEventRow(row: EventRow, viewer: EventViewer): SportEvent {
  return {
    id: row.id,
    organizerId: row.organizer_id ?? '',
    organizerName: row.organizer?.display_name ?? row.organizer_name ?? 'Unbekannt',
    isDemo: row.is_demo,
    sport: row.sport,
    title: row.title,
    description: row.description,
    meetingPoint: row.meeting_point,
    locationName: row.location_name,
    latitude: row.latitude,
    longitude: row.longitude,
    startsAt: new Date(row.starts_at).toISOString(),
    endsAt: new Date(row.ends_at).toISOString(),
    capacity: row.capacity,
    minParticipants: row.min_participants,
    level: row.level,
    ageGroup: row.age_group,
    costCents: row.cost_cents,
    bringAlong: row.bring_along,
    participantCount: row.participant_count + row.external_participants,
    status: row.status,
    isViewerParticipant: viewer.participatingIds.has(row.id),
    isViewerOrganizer: viewer.userId !== null && row.organizer_id === viewer.userId,
  };
}

/**
 * Baut die Parameter für die Datenbankfunktion `create_event`.
 * Eingaben: Formularwerte. Rückgabe: Objekt mit `p_`-Schlüsseln, Zeiten als ISO-Text in UTC.
 * Feature: F-17
 */
export function toCreateEventParams(input: EventInput): Record<string, string | number> {
  return {
    p_sport: input.sport,
    p_title: input.title,
    p_meeting_point: input.meetingPoint,
    p_latitude: input.latitude,
    p_longitude: input.longitude,
    p_starts_at: new Date(input.startsAt).toISOString(),
    p_ends_at: new Date(input.endsAt).toISOString(),
    p_capacity: input.capacity,
    p_min_participants: input.minParticipants,
    p_level: input.level,
    p_age_group: input.ageGroup,
    p_description: input.description,
    p_location_name: input.locationName,
    p_cost_cents: input.costCents,
    p_bring_along: input.bringAlong,
  };
}
