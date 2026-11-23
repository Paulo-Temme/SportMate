// Feste Testdaten: drei fiktive Treffen zu einem festen Zeitpunkt, damit Tests nicht von der Uhrzeit abhängen (F-00).
import type { EventInput, SportEvent } from '../../src/lib/events/event-model';

/** Fester "Jetzt"-Zeitpunkt aller Tests: Montag, 26.10.2026, 12:00 Uhr Berliner Zeit. */
export const fixedNow = new Date('2026-10-26T12:00:00+01:00');

/** Gültige Formularwerte für ein neues Treffen am Mittwoch, 28.10.2026. */
export const validInput: EventInput = {
  title: 'Basketball am Campus',
  sport: 'Basketball',
  meetingPoint: 'Campus Sportplatz',
  latitude: 54.774,
  longitude: 9.452,
  startsAt: '2026-10-28T16:00:00+01:00',
  endsAt: '2026-10-28T18:00:00+01:00',
  capacity: 10,
  minParticipants: 4,
  level: 'Alle Niveaus',
  ageGroup: '',
  description: '',
};

/** Fußball morgen 17 Uhr (5/10), Volleyball morgen 18 Uhr (voll, 4/4), Badminton übermorgen 16 Uhr (1/2). */
export function createSampleEvents(): SportEvent[] {
  const common = { organizerId: 'alex', status: 'published' as const };
  return [
    {
      ...common,
      id: 'fussball',
      title: 'Fußball am Campus',
      sport: 'Fußball',
      meetingPoint: 'Campus Flensburg, Sportplatz',
      latitude: 54.7753,
      longitude: 9.4479,
      startsAt: '2026-10-27T16:00:00.000Z',
      endsAt: '2026-10-27T18:00:00.000Z',
      capacity: 10,
      minParticipants: 6,
      level: 'Anfänger',
      ageGroup: '20–25',
      description: '',
      participants: ['alex', 'kim', 'sam', 'nora', 'emi'],
    },
    {
      ...common,
      id: 'volleyball',
      title: 'Volleyball am Hafen',
      sport: 'Volleyball',
      meetingPoint: 'Flensburg, Hafenspitze',
      latitude: 54.7923,
      longitude: 9.4347,
      startsAt: '2026-10-27T17:00:00.000Z',
      endsAt: '2026-10-27T19:00:00.000Z',
      capacity: 4,
      minParticipants: 4,
      level: 'Fortgeschritten',
      ageGroup: '',
      description: '',
      participants: ['alex', 'kim', 'sam', 'nora'],
    },
    {
      ...common,
      id: 'badminton',
      title: 'Badminton zu zweit',
      sport: 'Badminton',
      meetingPoint: 'Campus Flensburg, Sporthalle',
      latitude: 54.7707,
      longitude: 9.4559,
      startsAt: '2026-10-28T15:00:00.000Z',
      endsAt: '2026-10-28T16:00:00.000Z',
      capacity: 2,
      minParticipants: 2,
      level: 'Alle Niveaus',
      ageGroup: '',
      description: '',
      participants: ['alex'],
    },
  ];
}
