// Fiktive Treffen an Orten in Flensburg für den Demomodus. Termine relativ zu "jetzt", damit Zeitfilter Treffer haben (F-00, F-32).
import { demoPeople } from './demo-people';
import { toBerlinDay } from './event-search';
import type { EventMember, StoredEvent } from './stored-event';

const minute = 60_000;
const hour = 60 * minute;

/** Versatz der Berliner Zeit zu UTC in Millisekunden zum Zeitpunkt `moment` (+1 h Winter, +2 h Sommer). */
function readBerlinOffset(moment: Date): number {
  const name = new Intl.DateTimeFormat('en-US', { timeZone: 'Europe/Berlin', timeZoneName: 'shortOffset' })
    .formatToParts(moment)
    .find((part) => part.type === 'timeZoneName')?.value;
  const hours = Number(name?.replace('GMT', '') || '0');
  return hours * hour;
}

/** Zeitpunkt an einem Tag relativ zu heute, zu einer Berliner Uhrzeit. */
function atBerlinTime(now: Date, daysFromToday: number, hourOfDay: number): string {
  const noon = new Date(`${toBerlinDay(now)}T12:00:00Z`);
  noon.setUTCDate(noon.getUTCDate() + daysFromToday);
  const localAsUtc = noon.getTime() + (hourOfDay - 12) * hour;
  return new Date(localAsUtc - readBerlinOffset(noon)).toISOString();
}

/**
 * Zeitpunkt heute nach `now`. Rundet auf die nächste Viertelstunde nach `hoursFromNow`;
 * würde das in den nächsten Tag fallen, nimmt es fünf Minuten nach `now`.
 * Nur in den letzten fünf Minuten vor Mitternacht liegt kein Treffen mehr auf heute.
 */
function laterToday(now: Date, hoursFromNow: number): string {
  const quarter = 15 * minute;
  const rounded = new Date(Math.ceil((now.getTime() + hoursFromNow * hour) / quarter) * quarter);
  const sameDay = toBerlinDay(rounded) === toBerlinDay(now);
  return (sameDay ? rounded : new Date(now.getTime() + 5 * minute)).toISOString();
}

function plusHours(iso: string, hours: number): string {
  return new Date(Date.parse(iso) + hours * hour).toISOString();
}

type DemoTemplate = Omit<StoredEvent, 'status' | 'endsAt' | 'participants' | 'organizerName' | 'isDemo'> & {
  durationHours: number;
  participants: string[];
  status?: StoredEvent['status'];
};

function buildTemplates(now: Date): DemoTemplate[] {
  return [
    {
      id: 'demo-laufen-volkspark',
      locationName: 'Volkspark',
      costCents: 0,
      bringAlong: 'Laufschuhe, Wasser',
      title: 'Lockere Laufrunde im Volkspark',
      sport: 'Laufen',
      meetingPoint: 'Volkspark Flensburg, Eingang Mürwiker Straße (Beispiel)',
      latitude: 54.79953,
      longitude: 9.44624,
      startsAt: laterToday(now, 1),
      durationHours: 1,
      capacity: 8,
      minParticipants: 2,
      level: 'Alle Niveaus',
      ageGroup: '',
      description: 'Fiktive Beispieldaten. Etwa 5 km in ruhigem Tempo, niemand wird zurückgelassen.',
      organizerId: 'kim',
      participants: ['kim', 'sam'],
    },
    {
      id: 'demo-basketball-exe',
      locationName: 'Exe',
      costCents: 0,
      bringAlong: 'Hallenschuhe oder feste Sportschuhe',
      title: 'Basketball auf dem Exe',
      sport: 'Basketball',
      meetingPoint: 'Exe-Platz Flensburg, Basketballkorb (Beispiel)',
      latitude: 54.77952,
      longitude: 9.42606,
      startsAt: laterToday(now, 3),
      durationHours: 2,
      capacity: 10,
      minParticipants: 4,
      level: 'Fortgeschritten',
      ageGroup: '20–25',
      description: 'Fiktive Beispieldaten. Drei gegen drei, Ball ist vorhanden.',
      organizerId: 'tom',
      participants: ['tom', 'nora', 'emi', 'alex'],
    },
    {
      id: 'demo-fussball-campus',
      locationName: 'Campus',
      costCents: 0,
      bringAlong: 'Sportschuhe, Getränk',
      title: 'Fußball am Campus – Anfänger willkommen',
      sport: 'Fußball',
      meetingPoint: 'Campus Flensburg, Sportplatz (Beispiel)',
      latitude: 54.77511,
      longitude: 9.45044,
      startsAt: atBerlinTime(now, 1, 17),
      durationHours: 2,
      capacity: 10,
      minParticipants: 6,
      level: 'Anfänger',
      ageGroup: '20–25',
      description: 'Fiktive Beispieldaten. Entspannt zusammen kicken. Bitte eigene Sportschuhe mitbringen.',
      organizerId: 'alex',
      participants: ['alex', 'kim', 'sam', 'nora', 'emi'],
    },
    {
      id: 'demo-volleyball-hafen',
      locationName: 'Hafenspitze',
      costCents: 0,
      bringAlong: '',
      title: 'Volleyball an der Hafenspitze',
      sport: 'Volleyball',
      meetingPoint: 'Flensburg, Hafenspitze (Beispiel)',
      latitude: 54.78783,
      longitude: 9.43715,
      startsAt: atBerlinTime(now, 1, 18),
      durationHours: 2,
      capacity: 4,
      minParticipants: 4,
      level: 'Fortgeschritten',
      ageGroup: '',
      description: 'Fiktive Beispieldaten. Dieses Treffen ist ausgebucht.',
      organizerId: 'alex',
      participants: ['alex', 'kim', 'sam', 'nora'],
    },
    {
      id: 'demo-badminton-halle',
      locationName: 'Sporthalle Campus',
      costCents: 350,
      bringAlong: 'Hallenschuhe, eigener Schläger falls vorhanden',
      title: 'Badminton zu zweit',
      sport: 'Badminton',
      meetingPoint: 'Campus Flensburg, Sporthalle (Beispiel)',
      latitude: 54.77348,
      longitude: 9.45272,
      startsAt: atBerlinTime(now, 2, 16),
      durationHours: 1,
      capacity: 2,
      minParticipants: 2,
      level: 'Alle Niveaus',
      ageGroup: '',
      description: 'Fiktive Beispieldaten. Die Halle ist nicht reserviert. Genau ein Platz ist frei.',
      organizerId: 'alex',
      participants: ['alex'],
    },
    {
      id: 'demo-tischtennis-duburg',
      locationName: 'Duburg',
      costCents: 0,
      bringAlong: 'Tischtennisschläger',
      title: 'Tischtennis in der Duburg',
      sport: 'Tischtennis',
      meetingPoint: 'Duburger Straße, Platten am Spielplatz (Beispiel)',
      latitude: 54.79227,
      longitude: 9.42727,
      startsAt: atBerlinTime(now, 3, 15),
      durationHours: 2,
      capacity: 4,
      minParticipants: 2,
      level: 'Anfänger',
      ageGroup: 'über 40',
      description: 'Fiktive Beispieldaten. Schläger bitte selbst mitbringen.',
      organizerId: 'emi',
      participants: ['emi'],
    },
    {
      id: 'demo-laufen-solitude',
      locationName: 'Solitüde',
      costCents: 0,
      bringAlong: 'Laufschuhe',
      title: 'Strandlauf Solitüde',
      sport: 'Laufen',
      meetingPoint: 'Strand Solitüde, Parkplatz (Beispiel)',
      latitude: 54.82271,
      longitude: 9.4896,
      startsAt: atBerlinTime(now, 4, 9),
      durationHours: 1,
      capacity: 12,
      minParticipants: 2,
      level: 'Erfahren',
      ageGroup: '26–30',
      description: 'Fiktive Beispieldaten. Zügiges Tempo, etwa 10 km am Wasser entlang.',
      organizerId: 'lea',
      participants: ['lea', 'tom'],
    },
    {
      id: 'demo-volleyball-ostseebad',
      locationName: 'Ostseebad',
      costCents: 200,
      bringAlong: 'Sonnencreme, Wasser',
      title: 'Beachvolleyball am Ostseebad',
      sport: 'Volleyball',
      meetingPoint: 'Ostseebad Flensburg, Beachfeld (Beispiel)',
      latitude: 54.8129,
      longitude: 9.4296,
      startsAt: atBerlinTime(now, 2, 18),
      durationHours: 2,
      capacity: 8,
      minParticipants: 4,
      level: 'Alle Niveaus',
      ageGroup: '',
      description: 'Fiktive Beispieldaten. Wurde wegen Sturmwarnung abgesagt.',
      organizerId: 'lea',
      participants: ['lea', 'kim'],
      status: 'cancelled',
    },
  ];
}

function toMember(userId: string): EventMember {
  return { id: userId, displayName: demoPeople[userId] };
}

/**
 * Erzeugt die Demotreffen relativ zum Zeitpunkt `now`: zwei heute, zwei morgen, weitere in den nächsten Tagen,
 * darunter ein ausgebuchtes, ein abgesagtes, ein kostenpflichtiges und ein "Anfänger willkommen"-Treffen.
 * Eingaben: aktueller Zeitpunkt. Rückgabe: neue Liste, bei jedem Aufruf frische Objekte.
 * Feature: F-00, F-32
 */
export function createDemoEvents(now = new Date()): StoredEvent[] {
  return buildTemplates(now).map(({ durationHours, status, participants, ...event }) => ({
    ...event,
    endsAt: plusHours(event.startsAt, durationHours),
    status: status ?? 'published',
    organizerName: demoPeople[event.organizerId],
    participants: participants.map(toMember),
    isDemo: true,
  }));
}
