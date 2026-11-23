-- =====================================================================================
-- SportMate · Migration 0001 · Initiales Schema
--
-- BESONDERE VORSICHT: Rechte/Schema – menschliches Review nötig.
-- (CLAUDE.md "Besondere Vorsicht": Login, Rechte, Datenbankschema. Diese Datei vor dem
--  Anwenden von einem Menschen lesen lassen und das Review im Protokoll vermerken.)
--
-- Entwurf: architect, 23.11.2026. Grundlage: docs/architecture.md, ADR-0002, ADR-0006,
-- ADR-0007, ADR-0008. Vorarbeit: P3-Entwurf datenmodell/schema.sql (26.10.2026).
-- Zustand: NICHT gegen eine Datenbank ausgeführt. Vor Nutzung auf einem leeren
-- Supabase-Projekt anwenden und die Prüfschritte aus supabase/README.md durchgehen.
--
-- Grundsätze
--   * Lesen: über Tabellen mit Row Level Security (RLS).
--   * Schreiben: nur über die RPC-Funktionen unten (security definer, fester search_path,
--     Identität ausschließlich aus auth.uid()). Direkte INSERT/UPDATE/DELETE sind entzogen.
--     Einzige Ausnahme: eigener Anzeigename in profiles (Spaltenrecht + RLS).
--   * Überbuchung: Zeilensperre (select ... for update) in join_event UND zusätzlich
--     Check-Constraint events_not_overbooked als zweites Netz.
--   * Fehler: raise exception mit stabilem Code als Meldungstext (z. B. 'EVENT_FULL').
--     Die Oberfläche übersetzt Codes in deutsche Texte (src/lib/data, RepositoryError).
--   * Keine Passwörter, keine Demo-Identitäten in der Datenbank. Konten verwaltet Supabase Auth.
-- =====================================================================================

begin;

-- -------------------------------------------------------------------------------------
-- Schema für interne Hilfsfunktionen (nicht über die Data API erreichbar)
-- -------------------------------------------------------------------------------------
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

-- -------------------------------------------------------------------------------------
-- Tabelle profiles: öffentliches Profil je Konto (nur Anzeigename)
-- -------------------------------------------------------------------------------------
create table public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  display_name text not null
               constraint profiles_display_name_length
               check (char_length(btrim(display_name)) between 2 and 40),
  created_at   timestamptz not null default now()
);

comment on table public.profiles is
  'Öffentliches Profil je Supabase-Konto. Enthält bewusst keine E-Mail-Adresse.';

-- -------------------------------------------------------------------------------------
-- Tabelle events: Sporttreffen
-- -------------------------------------------------------------------------------------
create table public.events (
  id                    uuid primary key default gen_random_uuid(),
  -- Organisator mit Konto. NULL nur bei fiktiven Seed-Treffen (siehe ADR-0008).
  organizer_id          uuid references public.profiles (id) on delete cascade,
  -- Anzeigename für Seed-Treffen ohne Konto. Bei echten Treffen NULL (Name kommt aus profiles).
  organizer_name        text
                        constraint events_organizer_name_length
                        check (organizer_name is null
                               or char_length(btrim(organizer_name)) between 2 and 40),
  is_demo               boolean not null default false,
  sport                 text not null
                        constraint events_sport_allowed
                        check (sport in ('Fußball', 'Volleyball', 'Badminton', 'Basketball',
                                         'Laufen', 'Tischtennis')),
  title                 text not null
                        constraint events_title_length
                        check (char_length(btrim(title)) between 3 and 80),
  description           text not null default ''
                        constraint events_description_length
                        check (char_length(description) <= 300),
  -- Treffpunktbeschreibung (Pflicht, wie meetingPoint im TS-Modell).
  meeting_point         text not null
                        constraint events_meeting_point_length
                        check (char_length(btrim(meeting_point)) between 5 and 200),
  -- Kurzer Ortsname für Liste/Marker (z. B. "Volkspark"). Optional, bis das TS-Modell ihn kennt.
  location_name         text not null default ''
                        constraint events_location_name_length
                        check (char_length(location_name) <= 80),
  latitude              double precision not null
                        constraint events_latitude_range check (latitude between -90 and 90),
  longitude             double precision not null
                        constraint events_longitude_range check (longitude between -180 and 180),
  starts_at             timestamptz not null,
  ends_at               timestamptz not null,
  capacity              smallint not null
                        constraint events_capacity_range check (capacity between 2 and 50),
  min_participants      smallint not null default 2,
  -- Wertelisten wörtlich wie in src/lib/events/event-model.ts (sports, levels, ageGroups).
  -- Änderung immer an beiden Stellen (ADR-0009). Altersgruppen mit Halbgeviertstrich (U+2013).
  level                 text not null default 'Alle Niveaus'
                        constraint events_level_allowed
                        check (level in ('Alle Niveaus', 'Anfänger', 'Fortgeschritten', 'Erfahren')),
  -- Leerer Text = offen für alle Altersgruppen.
  age_group             text not null default ''
                        constraint events_age_group_allowed
                        check (age_group in ('', 'unter 20', '20–25', '26–30', '31–40', 'über 40')),
  cost_cents            integer not null default 0
                        constraint events_cost_range check (cost_cents between 0 and 10000),
  bring_along           text not null default ''
                        constraint events_bring_along_length
                        check (char_length(bring_along) <= 200),
  -- Belegungszähler: wird ausschließlich vom Trigger private.sync_participant_count gepflegt.
  participant_count     smallint not null default 0
                        constraint events_participant_count_positive check (participant_count >= 0),
  -- Plätze, die außerhalb der App belegt sind (nur Seed-Treffen, inkl. fiktivem Organisator).
  external_participants smallint not null default 0
                        constraint events_external_participants_positive
                        check (external_participants >= 0),
  status                text not null default 'published'
                        constraint events_status_allowed check (status in ('published', 'cancelled')),
  cancelled_at          timestamptz,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),

  constraint events_end_after_start   check (ends_at > starts_at),
  constraint events_max_duration      check (ends_at <= starts_at + interval '12 hours'),
  constraint events_min_participants_range check (min_participants between 2 and capacity),
  constraint events_not_overbooked    check (participant_count + external_participants <= capacity),
  constraint events_has_organizer     check (organizer_id is not null
                                             or (is_demo and organizer_name is not null)),
  constraint events_cancelled_consistent check ((status = 'cancelled') = (cancelled_at is not null))
);

comment on table public.events is
  'Sporttreffen. Gespeicherter Lebenszyklus nur published/cancelled; Ausgebucht, Läuft, Beendet usw. werden in src/lib/events abgeleitet.';
comment on column public.events.external_participants is
  'Außerhalb der App belegte Plätze. Nur für fiktive Seed-Treffen (ADR-0008); create_event setzt immer 0.';

create index events_upcoming_idx  on public.events (starts_at) where status = 'published';
create index events_organizer_idx on public.events (organizer_id);

-- -------------------------------------------------------------------------------------
-- Tabelle participations: Teilnahme eines Kontos an einem Treffen
-- Eine Zeile = aktive Zusage. Abmelden löscht die Zeile. Bei Absage des Treffens bleiben
-- die Zeilen erhalten (Historie für "Meine Treffen").
-- -------------------------------------------------------------------------------------
create table public.participations (
  event_id  uuid not null references public.events (id) on delete cascade,
  user_id   uuid not null references public.profiles (id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (event_id, user_id)
);

create index participations_user_idx on public.participations (user_id);

-- -------------------------------------------------------------------------------------
-- Trigger: Belegungszähler konsistent halten (auch bei Kaskadenlöschung eines Kontos)
-- security definer, weil auch supabase_auth_admin (Konto löschen) diesen Pfad auslöst.
-- -------------------------------------------------------------------------------------
create function private.sync_participant_count()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    update public.events
       set participant_count = participant_count + 1, updated_at = now()
     where id = new.event_id;
    return new;
  end if;
  update public.events
     set participant_count = participant_count - 1, updated_at = now()
   where id = old.event_id;
  return old;
end;
$$;

create trigger participations_sync_count
  after insert or delete on public.participations
  for each row execute function private.sync_participant_count();

-- -------------------------------------------------------------------------------------
-- Trigger: Profil bei Registrierung anlegen
-- Anzeigename aus raw_user_meta_data.display_name (signUp options.data), sonst Teil der
-- E-Mail vor dem @, sonst Platzhalter. Kürzt auf 40 Zeichen.
-- -------------------------------------------------------------------------------------
create function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_name text;
begin
  v_name := left(btrim(coalesce(nullif(btrim(new.raw_user_meta_data ->> 'display_name'), ''),
                                split_part(coalesce(new.email, ''), '@', 1))), 40);
  if char_length(v_name) < 2 then
    v_name := 'Neues Mitglied';
  end if;
  insert into public.profiles (id, display_name) values (new.id, v_name);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function private.handle_new_user();

revoke all on function private.sync_participant_count() from public, anon, authenticated;
revoke all on function private.handle_new_user()        from public, anon, authenticated;

-- -------------------------------------------------------------------------------------
-- Interne Hilfsfunktion: angemeldetes Konto mit Profil verlangen
-- -------------------------------------------------------------------------------------
create function private.require_profile()
returns uuid
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
begin
  if v_user_id is null then
    raise exception 'AUTH_REQUIRED' using errcode = 'P0001';
  end if;
  if not exists (select 1 from public.profiles where id = v_user_id) then
    raise exception 'PROFILE_MISSING' using errcode = 'P0001';
  end if;
  return v_user_id;
end;
$$;

revoke all on function private.require_profile() from public, anon, authenticated;

-- -------------------------------------------------------------------------------------
-- Row Level Security
-- -------------------------------------------------------------------------------------
alter table public.profiles       enable row level security;
alter table public.events         enable row level security;
alter table public.participations enable row level security;

-- profiles: Anzeigenamen sind öffentlich (Organisator auf Karte/Liste). Ändern nur eigenes Profil.
create policy profiles_select_all on public.profiles
  for select to anon, authenticated using (true);
create policy profiles_update_own on public.profiles
  for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- events: Treffen sind öffentlich lesbar (Karte ohne Anmeldung). Schreiben nur per RPC.
create policy events_select_all on public.events
  for select to anon, authenticated using (true);

-- participations: nur eigene Zeilen. Teilnehmerliste fremder Personen nur per
-- list_event_participants (prüft Mitgliedschaft). Schreiben nur per RPC.
create policy participations_select_own on public.participations
  for select to authenticated using (user_id = (select auth.uid()));

-- Tabellenrechte: Supabase vergibt standardmäßig weitreichende Rechte an anon/authenticated.
-- Hier ausdrücklich auf das Nötige zurücksetzen (zusätzlich zu RLS).
revoke all on public.profiles, public.events, public.participations from public, anon, authenticated;
grant select on public.profiles, public.events to anon, authenticated;
grant update (display_name) on public.profiles to authenticated;
grant select on public.participations to authenticated;

-- -------------------------------------------------------------------------------------
-- RPC create_event: Treffen anlegen, Organisator nimmt automatisch teil
-- Fehler: AUTH_REQUIRED, PROFILE_MISSING, START_IN_PAST,
--         INVALID_INPUT (detail = Name des verletzten Constraints, z. B. events_capacity_range)
-- -------------------------------------------------------------------------------------
create function public.create_event(
  p_sport            text,
  p_title            text,
  p_meeting_point    text,
  p_latitude         double precision,
  p_longitude        double precision,
  p_starts_at        timestamptz,
  p_ends_at          timestamptz,
  p_capacity         integer,
  p_min_participants integer default 2,
  p_level            text    default 'Alle Niveaus',
  p_age_group        text    default '',
  p_description      text    default '',
  p_location_name    text    default '',
  p_cost_cents       integer default 0,
  p_bring_along      text    default ''
)
returns public.events
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id    uuid := private.require_profile();
  v_event      public.events;
  v_constraint text;
begin
  if p_starts_at is null or p_starts_at <= clock_timestamp() then
    raise exception 'START_IN_PAST' using errcode = 'P0001';
  end if;

  begin
    insert into public.events (
      organizer_id, sport, title, meeting_point, latitude, longitude, starts_at, ends_at,
      capacity, min_participants, level, age_group, description, location_name, cost_cents,
      bring_along
    ) values (
      v_user_id, p_sport, btrim(p_title), btrim(p_meeting_point), p_latitude, p_longitude,
      p_starts_at, p_ends_at, p_capacity, coalesce(p_min_participants, 2),
      coalesce(p_level, 'Alle Niveaus'), coalesce(p_age_group, ''),
      btrim(coalesce(p_description, '')), btrim(coalesce(p_location_name, '')),
      coalesce(p_cost_cents, 0), btrim(coalesce(p_bring_along, ''))
    )
    returning * into v_event;
  exception
    when check_violation or not_null_violation then
      get stacked diagnostics v_constraint = constraint_name;
      raise exception 'INVALID_INPUT' using errcode = 'P0001', detail = coalesce(nullif(v_constraint, ''), 'not_null');
    when numeric_value_out_of_range then
      raise exception 'INVALID_INPUT' using errcode = 'P0001', detail = 'numeric_range';
  end;

  -- Organisator belegt den ersten Platz (Trigger erhöht participant_count).
  insert into public.participations (event_id, user_id) values (v_event.id, v_user_id);

  select * into v_event from public.events where id = v_event.id;
  return v_event;
end;
$$;

-- -------------------------------------------------------------------------------------
-- RPC join_event: an einem Treffen teilnehmen (idempotent)
-- Sperrt die Eventzeile. Von zwei gleichzeitigen Anfragen auf den letzten Platz gewinnt
-- genau eine; die zweite liest nach dem Warten den neuen Stand und erhält EVENT_FULL.
-- Fehler: AUTH_REQUIRED, PROFILE_MISSING, EVENT_NOT_FOUND, EVENT_CANCELLED, EVENT_STARTED, EVENT_FULL
-- -------------------------------------------------------------------------------------
create function public.join_event(p_event_id uuid)
returns public.events
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := private.require_profile();
  v_event   public.events;
begin
  select * into v_event from public.events where id = p_event_id for update;
  if not found then
    raise exception 'EVENT_NOT_FOUND' using errcode = 'P0001';
  end if;
  if v_event.status = 'cancelled' then
    raise exception 'EVENT_CANCELLED' using errcode = 'P0001';
  end if;
  if v_event.starts_at <= clock_timestamp() then
    raise exception 'EVENT_STARTED' using errcode = 'P0001';
  end if;

  -- Bereits dabei: keine Änderung, aktueller Stand zurück.
  if exists (select 1 from public.participations
              where event_id = p_event_id and user_id = v_user_id) then
    return v_event;
  end if;

  if v_event.participant_count + v_event.external_participants >= v_event.capacity then
    raise exception 'EVENT_FULL' using errcode = 'P0001';
  end if;

  insert into public.participations (event_id, user_id) values (p_event_id, v_user_id);

  select * into v_event from public.events where id = p_event_id;
  return v_event;
end;
$$;

-- -------------------------------------------------------------------------------------
-- RPC leave_event: Teilnahme zurückziehen (idempotent)
-- Organisator kann nicht austreten, sondern nur absagen.
-- Fehler: AUTH_REQUIRED, PROFILE_MISSING, EVENT_NOT_FOUND, ORGANIZER_CANNOT_LEAVE,
--         EVENT_CANCELLED, EVENT_STARTED
-- -------------------------------------------------------------------------------------
create function public.leave_event(p_event_id uuid)
returns public.events
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := private.require_profile();
  v_event   public.events;
begin
  select * into v_event from public.events where id = p_event_id for update;
  if not found then
    raise exception 'EVENT_NOT_FOUND' using errcode = 'P0001';
  end if;
  if v_event.organizer_id = v_user_id then
    raise exception 'ORGANIZER_CANNOT_LEAVE' using errcode = 'P0001';
  end if;
  if v_event.status = 'cancelled' then
    raise exception 'EVENT_CANCELLED' using errcode = 'P0001';
  end if;
  if v_event.starts_at <= clock_timestamp() then
    raise exception 'EVENT_STARTED' using errcode = 'P0001';
  end if;

  delete from public.participations where event_id = p_event_id and user_id = v_user_id;

  select * into v_event from public.events where id = p_event_id;
  return v_event;
end;
$$;

-- -------------------------------------------------------------------------------------
-- RPC cancel_event: Treffen absagen (nur Organisator, idempotent, endgültig)
-- Fehler: AUTH_REQUIRED, PROFILE_MISSING, EVENT_NOT_FOUND, NOT_ORGANIZER, EVENT_STARTED
-- -------------------------------------------------------------------------------------
create function public.cancel_event(p_event_id uuid)
returns public.events
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := private.require_profile();
  v_event   public.events;
begin
  select * into v_event from public.events where id = p_event_id for update;
  if not found then
    raise exception 'EVENT_NOT_FOUND' using errcode = 'P0001';
  end if;
  if v_event.organizer_id is distinct from v_user_id then
    raise exception 'NOT_ORGANIZER' using errcode = 'P0001';
  end if;
  if v_event.status = 'cancelled' then
    return v_event;
  end if;
  if v_event.starts_at <= clock_timestamp() then
    raise exception 'EVENT_STARTED' using errcode = 'P0001';
  end if;

  update public.events
     set status = 'cancelled', cancelled_at = clock_timestamp(), updated_at = clock_timestamp()
   where id = p_event_id
  returning * into v_event;
  return v_event;
end;
$$;

-- -------------------------------------------------------------------------------------
-- RPC list_event_participants: Anzeigenamen der Teilnehmenden
-- Nur für Organisator und Teilnehmende des Treffens.
-- Fehler: AUTH_REQUIRED, PROFILE_MISSING, EVENT_NOT_FOUND, NOT_PARTICIPANT
-- -------------------------------------------------------------------------------------
create function public.list_event_participants(p_event_id uuid)
returns table (user_id uuid, display_name text, is_organizer boolean)
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_user_id      uuid := private.require_profile();
  v_organizer_id uuid;
begin
  select e.organizer_id into v_organizer_id from public.events e where e.id = p_event_id;
  if not found then
    raise exception 'EVENT_NOT_FOUND' using errcode = 'P0001';
  end if;
  if v_organizer_id is distinct from v_user_id
     and not exists (select 1 from public.participations pa
                      where pa.event_id = p_event_id and pa.user_id = v_user_id) then
    raise exception 'NOT_PARTICIPANT' using errcode = 'P0001';
  end if;

  return query
    select pr.id, pr.display_name, (pr.id = v_organizer_id)
      from public.participations pa
      join public.profiles pr on pr.id = pa.user_id
     where pa.event_id = p_event_id
     order by (pr.id = v_organizer_id) desc, pa.joined_at, pr.id;
end;
$$;

-- -------------------------------------------------------------------------------------
-- Ausführungsrechte: Supabase vergibt EXECUTE standardmäßig an anon/authenticated.
-- Ausdrücklich entziehen und nur angemeldeten Konten erlauben.
-- -------------------------------------------------------------------------------------
revoke all on function public.create_event(text, text, text, double precision, double precision,
  timestamptz, timestamptz, integer, integer, text, text, text, text, integer, text)
  from public, anon, authenticated;
revoke all on function public.join_event(uuid)              from public, anon, authenticated;
revoke all on function public.leave_event(uuid)             from public, anon, authenticated;
revoke all on function public.cancel_event(uuid)            from public, anon, authenticated;
revoke all on function public.list_event_participants(uuid) from public, anon, authenticated;

grant execute on function public.create_event(text, text, text, double precision, double precision,
  timestamptz, timestamptz, integer, integer, text, text, text, text, integer, text)
  to authenticated;
grant execute on function public.join_event(uuid)              to authenticated;
grant execute on function public.leave_event(uuid)             to authenticated;
grant execute on function public.cancel_event(uuid)            to authenticated;
grant execute on function public.list_event_participants(uuid) to authenticated;

commit;
