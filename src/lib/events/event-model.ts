// Fachliches Datenmodell eines Sporttreffens: erlaubte Werte, Typen und leere Filter (F-00).

/** Sportarten, die ein Treffen haben kann. */
export const sports = ['Fußball', 'Volleyball', 'Badminton', 'Basketball', 'Laufen', 'Tischtennis'] as const;

/** Spielniveaus. "Alle Niveaus" passt zu jedem Niveaufilter. */
export const levels = ['Alle Niveaus', 'Anfänger', 'Fortgeschritten', 'Erfahren'] as const;

/** Altersgruppen. Eine leere Altersgruppe bedeutet: offen für alle. */
export const ageGroups = ['unter 20', '20–25', '26–30', '31–40', 'über 40'] as const;

export type Sport = (typeof sports)[number];
export type Level = (typeof levels)[number];
export type AgeGroup = (typeof ageGroups)[number] | '';
export type EventStatus = 'published' | 'cancelled';

/** Geokoordinate in Grad (WGS 84). */
export type GeoPoint = { latitude: number; longitude: number };

/** Eingaben beim Anlegen eines Treffens, wie sie aus dem Formular kommen. */
export type EventInput = GeoPoint & {
  title: string;
  sport: Sport;
  meetingPoint: string;
  startsAt: string;
  endsAt: string;
  capacity: number;
  minParticipants: number;
  level: Level;
  ageGroup: AgeGroup;
  description: string;
};

/** Gespeichertes Treffen mit Kennung, organisierender Person, Status und Teilnehmenden. */
export type SportEvent = EventInput & {
  id: string;
  organizerId: string;
  status: EventStatus;
  participants: string[];
};

/** Zeitraumfilter der Suche. "date" nutzt das Feld `date` (YYYY-MM-DD, Europe/Berlin). */
export type PeriodFilter = '' | 'today' | 'tomorrow' | 'week' | 'date';

/** Suchkriterien. Leere Werte bedeuten: nicht einschränken. */
export type EventFilters = {
  query: string;
  sports: Sport[];
  level: string;
  ageGroup: string;
  period: PeriodFilter;
  date: string;
  mine: boolean;
};

/** Filter ohne Einschränkung, Ausgangspunkt für jede Suche. */
export const emptyFilters: EventFilters = {
  query: '',
  sports: [],
  level: '',
  ageGroup: '',
  period: '',
  date: '',
  mine: false,
};
