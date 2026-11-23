# ADR-0008: Seed-Treffen ohne Konto

Status: vorgeschlagen · Datum: 2026-11-23 · Rolle: architect

## Kontext
Eine leere Karte überzeugt in Demo und Nutzertest nicht. Demotreffen brauchen einen Organisator und eine
Belegung (z. B. "noch 1 Platz"). `profiles` und `participations` verweisen aber auf `auth.users`; fiktive
Personen haben dort keinen Eintrag, und Demo-Identitäten sollen nie serverseitig existieren.

## Entscheidung
- `events.organizer_id` darf NULL sein, aber nur wenn `is_demo = true` und `organizer_name` gesetzt ist
  (Constraint `events_has_organizer`).
- `events.external_participants` zählt Plätze, die außerhalb der App belegt sind (bei Seed-Treffen inkl.
  fiktivem Organisator). Belegung = `participant_count + external_participants`.
- `create_event` setzt `external_participants` nie; echte Treffen haben immer `organizer_id`.
- `supabase/seed.sql` löscht und erzeugt nur Zeilen mit `is_demo = true`; Zeiten relativ zu `now()`.
- Die Oberfläche kennzeichnet `is_demo`-Treffen als "Beispiel".

## Alternativen
| Alternative | Vorteil | Warum nicht |
| --- | --- | --- |
| Fiktive Konten direkt in `auth.users` einfügen | echtes Datenmodell | greift in von Supabase verwaltete Tabellen ein, Passwort-Hashes nötig, Demo-Identitäten serverseitig |
| Seed-Konten über Admin-API per Skript | sauber über Auth | braucht `service_role`-Schlüssel und ein Skript; Konten mit Passwort existieren dauerhaft |
| Keine Seed-Daten in Supabase | einfach | leere Karte bei Demo im Supabase-Modus |

## Konsequenzen
- Zwei kleine Sonderfelder im Schema, die nur für Demo-Daten gebraucht werden (bewusst, dokumentiert).
- Treffen ohne `organizer_id` kann niemand absagen (`cancel_event` → `NOT_ORGANIZER`); gewollt.
- Neu prüfen, wenn es echte Partner/Vereine gibt, die Treffen ohne persönliches Konto anbieten.
