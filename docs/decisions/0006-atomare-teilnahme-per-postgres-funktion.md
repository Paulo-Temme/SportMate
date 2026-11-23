# ADR-0006: Atomare Teilnahme per Postgres-Funktion

Status: vorgeschlagen · Datum: 2026-11-23 · Rolle: architect · Vorarbeit: P3 ADR-03, ADR-07

## Kontext
Bei einem freien Platz können zwei Personen gleichzeitig "Teilnehmen" drücken. Eine Prüfung im Browser
oder ein "erst zählen, dann schreiben" in zwei Aufrufen verhindert keine Überbuchung. Anonyme Besucher
sollen die Belegung sehen, aber nicht, wer teilnimmt.

## Entscheidung
- `join_event`, `leave_event`, `cancel_event` und `create_event` sind PL/pgSQL-Funktionen mit
  `security definer`, `set search_path = ''` und Identität aus `auth.uid()`.
- Jede Mutation eines Treffens sperrt die Eventzeile mit `select ... for update`. Bei READ COMMITTED liest
  die wartende Transaktion nach der Freigabe den neuen Stand und erhält `EVENT_FULL`.
- Belegung als Zähler `events.participant_count`, gepflegt ausschließlich vom Trigger auf `participations`
  (auch bei Kaskadenlöschung eines Kontos). Zweites Netz: Check-Constraint
  `participant_count + external_participants <= capacity`.
- Fehler als `raise exception '<CODE>'` (z. B. `EVENT_FULL`); der Datenzugriff übersetzt Codes in Meldungen.
- Wiederholtes Beitreten/Abmelden/Absagen ist idempotent (liefert den aktuellen Stand).

**Abweichung von P3:** P3 ADR-07 verzichtete auf einen gespeicherten Zähler. Hier wird er eingeführt, weil
(1) anonyme Leser die Belegung brauchen, ohne `participations` lesen zu dürfen, (2) so keine
security-definer-View nötig ist und (3) der Check-Constraint Überbuchung auch bei Fehlern im Funktionscode
verhindert. Konsistenz sichert der Trigger als einzige Schreibstelle.

**Abweichung von P3 (vereinfacht):** Teilnahmen haben keinen Status `withdrawn`; Abmelden löscht die Zeile.
Hinweise/Benachrichtigungen (P3 ADR-05) und `update_event` sind nicht Teil des ersten Schemas, weil noch
keine Story sie verlangt.

## Alternativen
| Alternative | Vorteil | Warum nicht |
| --- | --- | --- |
| Button bei "voll" deaktivieren | gute Bedienhilfe | kein Schutz bei veraltetem Stand oder direktem API-Aufruf |
| Zählen und Einfügen in zwei Aufrufen aus dem Client | einfach | Konkurrenzfenster zwischen den Aufrufen |
| Nur Check-Constraint, keine Sperre | wenig Code | Fehler wäre ein generischer Constraint-Fehler statt `EVENT_FULL`; Idempotenz-Prüfung unsauber |
| SERIALIZABLE-Isolation | kein expliziter Lock | Client müsste Serialisierungsfehler wiederholen |

Grundlage: PostgreSQL-Dokumentation, Kapitel "Explicit Locking" (Zeilensperren `FOR UPDATE`).

## Konsequenzen
- Teil der Fachlogik liegt in SQL und muss mit den Specs versioniert und von einem Menschen gelesen werden.
- Direkte Schreibrechte auf `events`/`participations` sind entzogen; neue Schreibwege nur als Funktion.
- Ein automatisierter Paralleltest gegen eine echte Datenbank fehlt noch (Risiko, `supabase/README.md`).
