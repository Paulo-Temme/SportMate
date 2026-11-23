-- =====================================================================================
-- SportMate · Seed · Demotreffen in Flensburg
--
-- BESONDERE VORSICHT: läuft als Datenbank-Owner (umgeht RLS). Nur auf Demo-/Testprojekten
-- ausführen. Menschliches Review nötig.
--
-- ALLE TREFFEN UND PERSONEN SIND AUSDRÜCKLICH FIKTIV. Die Orte gibt es in Flensburg, die
-- Treffen dort nicht. Keine Halle und kein Platz ist reserviert.
-- Koordinaten: ungefähre Lage der Orte (soweit vorhanden dieselben Werte wie im lokalen
-- Demo-Modus, src/lib/events/demo-events.ts). NICHT nachgemessen. Vor der ersten Demo auf
-- der Karte prüfen und ggf. an beiden Stellen korrigieren (offen).
--
-- Lösung für Organisatoren ohne Konto (ADR-0008):
--   organizer_id = NULL, organizer_name = fiktiver Anzeigename, is_demo = true.
--   external_participants = schon belegte Plätze (inkl. fiktivem Organisator), weil es
--   für fiktive Personen keine Zeilen in participations geben kann (kein auth.users-Eintrag).
--
-- Wertelisten (sport, level, age_group) wörtlich wie in src/lib/events/event-model.ts.
-- Startzeiten relativ zu now(), Uhrzeiten in Europe/Berlin. Wiederholbar: löscht zuerst
-- alle bisherigen Demotreffen (is_demo = true). Echte Treffen bleiben unberührt.
-- =====================================================================================

begin;

delete from public.events where is_demo;

-- Treffen an den nächsten Tagen zu festen Uhrzeiten (Berliner Zeit)
insert into public.events (
  is_demo, organizer_name, sport, title, location_name, meeting_point, latitude, longitude,
  starts_at, ends_at, capacity, min_participants, level, age_group, cost_cents, bring_along,
  description, external_participants
)
select
  true, v.organizer_name, v.sport, v.title, v.location_name, v.meeting_point, v.latitude, v.longitude,
  (b.today + v.day_offset * interval '1 day' + v.start_time) at time zone 'Europe/Berlin',
  (b.today + v.day_offset * interval '1 day' + v.start_time + v.duration) at time zone 'Europe/Berlin',
  v.capacity, v.min_participants, v.level, v.age_group, v.cost_cents, v.bring_along,
  v.description, v.external_participants
from (select date_trunc('day', now() at time zone 'Europe/Berlin') as today) as b
cross join (values
  -- organizer_name, sport, title, location_name, meeting_point, lat, lng,
  -- day_offset, start_time, duration, capacity, min, level, age_group, cost_cents,
  -- bring_along, description, external_participants
  ('Jonas (fiktiv)'::text, 'Fußball'::text, 'Feierabendkick am Campus'::text,
   'Campus Sand'::text, 'Campus Flensburg, Sportplatz neben der Mensa'::text,
   54.77511::double precision, 9.45044::double precision,
   1, '17:00'::interval, '02:00'::interval, 12, 8, 'Alle Niveaus'::text, ''::text, 0,
   'Sportschuhe, ein helles und ein dunkles Shirt'::text,
   'Lockeres Spiel ohne Schiri. Fiktives Beispieltreffen.'::text, 7),

  ('Mira (fiktiv)', 'Volleyball', 'Beachvolleyball am Ostseebad',
   'Ostseebad', 'Ostseebad Flensburg, Beachfeld rechts vom Kiosk',
   54.81290, 9.42960,
   1, '18:00', '02:00', 8, 4, 'Fortgeschritten', '', 0,
   'Wasser, Sonnencreme',
   'Wir spielen 4 gegen 4. Fiktives Beispieltreffen mit genau einem freien Platz.', 7),

  ('Ole (fiktiv)', 'Laufen', 'Laufrunde durch den Volkspark',
   'Volkspark', 'Volkspark Flensburg, Eingang Mürwiker Straße',
   54.79953, 9.44624,
   2, '07:30', '01:00', 15, 2, 'Anfänger', '', 0,
   'Laufschuhe',
   'Ca. 6 km im Plaudertempo, niemand wird zurückgelassen. Fiktives Beispieltreffen.', 3),

  ('Hanna (fiktiv)', 'Basketball', 'Streetball an der Exe',
   'Exe', 'Exe-Platz Flensburg, Basketballkörbe am Rand',
   54.77952, 9.42606,
   2, '16:00', '01:30', 10, 6, 'Erfahren', '20–25', 0,
   'Eigener Ball, falls vorhanden',
   'Schnelles 3 gegen 3. Fiktives Beispieltreffen, bereits ausgebucht.', 10),

  ('Lukas (fiktiv)', 'Badminton', 'Badminton-Doppel in der Halle',
   'Campushalle', 'Campushalle Flensburg (Campusallee), Foyer',
   54.77348, 9.45272,
   3, '19:00', '01:30', 4, 4, 'Alle Niveaus', '', 300,
   'Hallenschuhe, Schläger (Leihschläger vorhanden)',
   'Kosten = Anteil Hallenmiete pro Person. Fiktives Beispieltreffen, Halle nicht reserviert.', 2),

  ('Svenja (fiktiv)', 'Volleyball', 'Volleyball am Strand Solitüde',
   'Solitüde', 'Strand Solitüde, Netz am Strandabschnitt Nord',
   54.82254, 9.48886,
   4, '17:30', '02:00', 6, 4, 'Anfänger', '', 0,
   'Handtuch, Getränk',
   'Für Einsteigerinnen und Einsteiger. Fiktives Beispieltreffen.', 2),

  ('Timo (fiktiv)', 'Tischtennis', 'Tischtennis in der Mittagspause',
   'Campus Sand', 'Campus Flensburg, Platten vor dem Hörsaalgebäude',
   54.77474, 9.44787,
   5, '12:15', '00:45', 4, 2, 'Alle Niveaus', '', 0,
   'Schläger, wer hat',
   'Kurze Runde Rundlauf. Fiktives Beispieltreffen.', 1),

  ('Leonie (fiktiv)', 'Laufen', 'Intervalltraining am Ostseebad',
   'Ostseebad', 'Ostseebad Flensburg, Treppe zum Strand',
   54.81229, 9.43063,
   6, '10:00', '01:00', 8, 2, 'Fortgeschritten', '31–40', 0,
   'Laufschuhe, Uhr',
   'Kurze Sprints am Wasser, danach locker auslaufen. Fiktives Beispieltreffen.', 1)
) as v(organizer_name, sport, title, location_name, meeting_point, latitude, longitude,
       day_offset, start_time, duration, capacity, min_participants, level, age_group,
       cost_cents, bring_along, description, external_participants);

-- Ein Treffen noch heute (relativ zur Ausführungszeit, damit es sicher in der Zukunft liegt)
insert into public.events (
  is_demo, organizer_name, sport, title, location_name, meeting_point, latitude, longitude,
  starts_at, ends_at, capacity, min_participants, level, age_group, description,
  external_participants
) values (
  true, 'Ali (fiktiv)', 'Fußball', 'Spontanes Kicken an der Hafenspitze',
  'Hafenspitze', 'Flensburg, Rasenfläche an der Hafenspitze',
  54.78783, 9.43715,
  date_trunc('hour', now()) + interval '3 hours',
  date_trunc('hour', now()) + interval '4 hours 30 minutes',
  10, 6, 'Alle Niveaus', '',
  'Kurzfristig, kleine Tore. Fiktives Beispieltreffen.', 4
);

-- Ein abgesagtes Treffen (zum Prüfen des Zustands "Abgesagt")
insert into public.events (
  is_demo, organizer_name, sport, title, location_name, meeting_point, latitude, longitude,
  starts_at, ends_at, capacity, min_participants, level, age_group, description,
  external_participants, status, cancelled_at
) values (
  true, 'Jonas (fiktiv)', 'Volleyball', 'Hallenvolleyball am Campus',
  'Campus Sand', 'Campus Flensburg, Sporthalle',
  54.77348, 9.45272,
  (date_trunc('day', now() at time zone 'Europe/Berlin') + interval '2 days 20 hours') at time zone 'Europe/Berlin',
  (date_trunc('day', now() at time zone 'Europe/Berlin') + interval '2 days 22 hours') at time zone 'Europe/Berlin',
  12, 6, 'Alle Niveaus', '',
  'Halle nicht verfügbar, deshalb abgesagt. Fiktives Beispieltreffen.', 5, 'cancelled', now()
);

commit;
