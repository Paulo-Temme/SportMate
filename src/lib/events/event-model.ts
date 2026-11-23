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
  /** Kurzer Ortsname für Liste und Marker, z. B. "Volkspark". Darf leer sein. */
  locationName: string;
  /** Treffpunktbeschreibung, Pflichtfeld. */
  meetingPoint: string;
  startsAt: string;
  endsAt: string;
  capacity: number;
  minParticipants: number;
  level: Level;
  ageGroup: AgeGroup;
  /** Kosten pro Person in Cent, 0 = kostenlos. */
  costCents: number;
  /** Was Teilnehmende mitbringen sollen. Leer = nichts Besonderes. */
  bringAlong: string;
  description: string;
};

/**
 * Treffen, wie es die Oberfläche sieht. Wer genau teilnimmt, ist nicht Teil des Modells
 * (im Supabase-Modus nicht öffentlich lesbar); dafür gibt es `EventRepository.listParticipants`.
 */
export type SportEvent = EventInput & {
  id: string;
  /** Konto der organisierenden Person; leer bei fiktiven Treffen ohne Konto. */
  organizerId: string;
  /** Anzeigename der organisierenden Person, nie eine E-Mail-Adresse. */
  organizerName: string;
  status: EventStatus;
  /** Belegte Plätze einschließlich organisierender Person. */
  participantCount: number;
  /** Ob die angemeldete Person teilnimmt (Gäste: immer `false`). */
  isViewerParticipant: boolean;
  /** Ob die angemeldete Person das Treffen organisiert (Gäste: immer `false`). */
  isViewerOrganizer: boolean;
  /** Fiktives Beispieltreffen, in der Oberfläche als solches gekennzeichnet. */
  isDemo: boolean;
};

/** Eintrag der Teilnehmerliste. Enthält bewusst keine Kennung und keine E-Mail-Adresse. */
export type ParticipantEntry = { displayName: string; isOrganizer: boolean };

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
