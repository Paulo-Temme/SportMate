# Supabase für SportMate

Schema, Rechte und Demodaten für den Betrieb mit Supabase. Ohne Supabase läuft die App im
lokalen Demo-Modus (localStorage), siehe `docs/architecture.md` und ADR-0003.

> **Besondere Vorsicht:** Migration und Seed betreffen Rechte und Datenbankschema.
> Vor dem ersten Anwenden liest ein Mensch beide Dateien (CLAUDE.md, "Besondere Vorsicht").
> Stand 23.11.2026: Die SQL-Dateien sind ein Entwurf und wurden noch **nicht** gegen eine
> Datenbank ausgeführt.

## Dateien

| Datei | Inhalt |
| --- | --- |
| `migrations/0001_initial_schema.sql` | Tabellen `profiles`, `events`, `participations`, Constraints, Indizes, Trigger, RLS, RPC-Funktionen |
| `seed.sql` | Fiktive Demotreffen in Flensburg (Organisatoren ohne Konto, `is_demo = true`), Zeiten relativ zu `now()` |

## Einmalig: Projekt anlegen und Auth einstellen

1. Neues Supabase-Projekt anlegen (Region EU, z. B. Frankfurt).
2. **Authentication → Providers → Email:** aktiviert.
3. **Authentication → Sign In / Providers → "Confirm email": für die Demo AUS.**
   Begründung: In Nutzertests soll Registrieren sofort zur Anmeldung führen, ohne Postfach.
   Folge: E-Mail-Adressen sind nicht bestätigt. Vor einem echten Betrieb wieder einschalten (offen).
4. **Mindestlänge Passwort:** 8 Zeichen (Vorgabe aus den früheren Anforderungen; P3 schlug 12 vor,
   Entscheidung offen). Derselbe Wert muss in der Validierung der Oberfläche stehen.
5. **Authentication → URL Configuration:** Site URL = Adresse der Vercel-Bereitstellung;
   Redirect URLs zusätzlich `http://localhost:3000/**` und die Vercel-Preview-Domain.
6. Anzeigename bei der Registrierung über `supabase.auth.signUp({ email, password, options: { data: { display_name } } })`
   übergeben. Der Trigger `on_auth_user_created` legt daraus das Profil an.

## Schema und Seed anwenden

Reihenfolge immer: erst Migration, dann Seed.

### Variante A: SQL-Editor im Supabase-Dashboard (am einfachsten)

1. **SQL Editor → New query**, Inhalt von `migrations/0001_initial_schema.sql` einfügen, **Run**.
2. Neue Abfrage, Inhalt von `seed.sql` einfügen, **Run**.
3. Der Seed ist wiederholbar: er löscht vorher alle Treffen mit `is_demo = true`.
   Vor einer Präsentation erneut ausführen, damit die Zeiten wieder in der Zukunft liegen.

### Variante B: `psql`

Verbindungszeichenkette aus **Project Settings → Database → Connection string** (Session-Modus)
in eine Umgebungsvariable der eigenen Shell legen, nicht ins Repo:

```sh
psql "$SUPABASE_DB_URL" -v ON_ERROR_STOP=1 -f supabase/migrations/0001_initial_schema.sql
psql "$SUPABASE_DB_URL" -v ON_ERROR_STOP=1 -f supabase/seed.sql
```

### Variante C: Supabase CLI (optional, lokal mit Docker)

`supabase start` und `supabase db reset` wenden alle Dateien in `migrations/` an und danach `seed.sql`.
Hinweis: Die CLI erwartet Dateinamen `<Version>_<Name>.sql`; `0001` wird als Version gelesen.
Falls die CLI einen Zeitstempel verlangt, die Datei umbenennen und hier vermerken (offen, nicht geprüft).

## App verbinden

Die App liest öffentliche Werte aus Umgebungsvariablen (in Vercel und lokal in der eigenen,
nicht eingecheckten Env-Datei; Agenten lesen und schreiben keine `.env`-Dateien):

| Variable | Wert |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon / publishable key |

Umschaltung (`src/lib/data/repository-factory.ts`): Sind beide Variablen gesetzt, nutzt die App
Supabase, sonst den lokalen Demo-Modus. Für eine Präsentation ohne Netz die Variablen leer lassen.

Der `service_role`-Schlüssel wird von der App **nie** verwendet und gehört in keine
`NEXT_PUBLIC_`-Variable. Alle Rechte entstehen aus dem Nutzer-JWT und RLS.

## Prüfschritte nach dem Anwenden (manuell, Ergebnis im Protokoll vermerken)

1. **Seed sichtbar ohne Anmeldung:** In der App (mit Supabase-Variablen) erscheinen die Demotreffen auf der Karte.
2. **Profil-Trigger:** Neues Konto registrieren → in `public.profiles` steht eine Zeile mit dem Anzeigenamen.
3. **Direktes Schreiben gesperrt:** Im Browser mit anon key `supabase.from('events').insert({...})` → Fehler (keine Rechte).
4. **create_event:** Treffen anlegen → `participant_count = 1`, eigene Zeile in `participations`.
5. **Fehlercodes:** Beitritt zu "Streetball an der Exe" (voll) → Fehlermeldung `EVENT_FULL`.
6. **Letzter Platz parallel:** Im SQL-Editor zwei Sitzungen simulieren ist dort nicht möglich; mit `psql` in zwei Terminals:

```sql
-- Terminal 1 und 2 jeweils (mit zwei verschiedenen echten Konto-IDs aus auth.users):
begin;
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"<KONTO-ID>","role":"authenticated"}', true);
select participant_count, capacity from public.join_event('<EVENT-ID mit einem freien Platz>');
-- Terminal 1: noch NICHT committen. Terminal 2 führt join_event aus und wartet.
commit; -- in Terminal 1
-- Erwartung: Terminal 2 erhält danach EVENT_FULL.
```

Ein automatisierter Paralleltest gegen eine Datenbank ist noch offen (siehe `docs/architecture.md`, Risiken).

## Rechte im Überblick

| Tabelle | anon | authenticated |
| --- | --- | --- |
| `profiles` | lesen | lesen, eigenen `display_name` ändern |
| `events` | lesen | lesen; schreiben nur über RPC |
| `participations` | – | nur eigene Zeilen lesen; schreiben nur über RPC |

| RPC | Wer | Ergebnis |
| --- | --- | --- |
| `create_event(...)` | authenticated | neue `events`-Zeile |
| `join_event(p_event_id)` | authenticated | aktualisierte `events`-Zeile |
| `leave_event(p_event_id)` | authenticated | aktualisierte `events`-Zeile |
| `cancel_event(p_event_id)` | authenticated (nur Organisator) | aktualisierte `events`-Zeile |
| `list_event_participants(p_event_id)` | authenticated (nur Organisator/Teilnehmende) | Tabelle `user_id, display_name, is_organizer` |
