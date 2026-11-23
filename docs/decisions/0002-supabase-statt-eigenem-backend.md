# ADR-0002: Supabase statt eigenem Backend

Status: vorgeschlagen · Datum: 2026-11-23 · Rolle: architect · Vorarbeit: P3 ADR-02, ADR-04

## Kontext
Die App braucht Konten (E-Mail/Passwort), dauerhafte Treffen und Teilnahmen mit Integritätsregeln
(keine Doppelteilnahme, keine Überbuchung) und Zugriffsschutz. Das Team soll keine eigene
Passwortverwaltung bauen und keinen Server betreiben. Budget: kostenlose Tarife.

## Entscheidung
Supabase als Backend: Supabase Auth für Konten und Sitzungen, PostgreSQL für Fachdaten mit
Constraints, Row Level Security (RLS) als Zugriffsschutz und Postgres-Funktionen (RPC) für
zusammengesetzte Schreibvorgänge. Schema und Rechte liegen versioniert in `supabase/migrations/`.

## Alternativen
| Alternative | Vorteil | Warum nicht |
| --- | --- | --- |
| Eigenes Backend (Next.js Route Handlers + ORM + eigene Auth) | volle Kontrolle | Passwort-/Sitzungssicherheit selbst bauen, DB-Betrieb nötig |
| Firebase (Firestore + Auth) | ähnlich bequem | dokumentenorientiert, Kapazitätsregel und Eindeutigkeit schwerer als mit SQL-Constraints |
| Selbst betriebenes PostgreSQL | keine Anbieterbindung | Betrieb, Backups, Hosting im Semester nicht leistbar |

## Konsequenzen
- Sicherheitsgrenze ist die Datenbank (RLS + Funktionsrechte), nicht die Oberfläche. Jede neue Tabelle
  bekommt RLS und ausdrückliche Grants; Review durch einen Menschen (CLAUDE.md "Besondere Vorsicht").
- Fachregeln für Schreibvorgänge stehen in SQL (siehe ADR-0006) und zusätzlich in TypeScript für den
  Demo-Modus (siehe ADR-0003).
- Anbieterbindung und Grenzen des kostenlosen Tarifs (z. B. Pausieren inaktiver Projekte) sind Risiken;
  konkrete Grenzwerte werden hier nicht angenommen (offen, bei Einrichtung prüfen).
- Neu prüfen, wenn Anforderungen an Betrieb/Region/Datenschutz den Tarif übersteigen.
