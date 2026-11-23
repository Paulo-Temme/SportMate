# F-22: Einem Treffen beitreten („Jetzt teilnehmen“)

Epic: E-5 Teilnahme · Priorität: hoch · Größe: M
Status: Entwurf (Datenschicht) · Freigabe offen

## Story
Als Sportinteressierte möchte ich mit einem Klick auf „Jetzt teilnehmen“ beitreten und eine Bestätigung sehen, damit ich sicher weiß, dass ich dabei bin.

## Herkunft
Quelle: DR-4.1.1–4, SM-R10–11, NFR-5, FB-44, FB-34, FB-19 (siehe `docs/backlog.md`).
Stakeholder: Teilnehmende, Organisierende.
Begründung: Kernfunktion; Überbuchung muss auch bei gleichzeitigen Anfragen ausgeschlossen sein (ADR-0006).

## Szenario
Lea öffnet ein Treffen mit 4 von 5 belegten Plätzen und tritt bei. Das Treffen zeigt danach 5 von 5 (ausgebucht)
und steht unter „Meine Treffen“. Tom versucht danach beizutreten und erhält „Leider gerade ausgebucht.“

## Akzeptanzkriterien (funktional)
- AK1 (Unit + Integration): Beitritt erhöht `participantCount`, setzt `isViewerParticipant`, Treffen erscheint bei `mine`.
- AK2 (Unit + Integration): volles Treffen → `checkJoinAvailability` = `full`; Beitritt → `EventError` „Leider gerade ausgebucht.“
- AK3 (Unit + Integration): erneuter Beitritt ändert `participantCount` nicht (idempotent).
- AK4 (Integration, offen): zwei gleichzeitige Anfragen auf den letzten Platz → genau eine angenommen. Datenbank sperrt die Zeile
  (ADR-0006); ein automatisierter Paralleltest fehlt noch. Übersetzung `EVENT_FULL` → Meldung ist per Unit-Test geprüft.
- AK5: Oberfläche (UI-Agent).

## Qualitätsanforderungen
- Q1 (NFR-5): keine Überbuchung; geschützt durch `join_event` (Zeilensperre) und Check-Constraint.

## Randbedingungen
- Schreiben nur über RPC (`join_event`, `leave_event`, `cancel_event`, `create_event`, `list_event_participants`), ADR-0007.

## Nicht enthalten
- Warteliste, Benachrichtigungen.

## Entwurf
Betroffene Bausteine: `EventRepository`, `SupabaseEventRepository`, `LocalEventRepository`, Kernlogik `participation`.
Neue Dateien: `src/lib/data/event-row-mapping.ts` (`mapEventRow`, `toCreateEventParams`),
`src/lib/data/supabase-error-translation.ts` (`translateEventError`, `translateAuthError`), `src/lib/events/stored-event.ts`.
Modell: `SportEvent` ohne öffentliche Teilnehmerliste; neu `participantCount`, `isViewerParticipant`, `isViewerOrganizer`,
`organizerName`, `locationName`, `costCents`, `bringAlong`, `isDemo`. Neu `EventRepository.listParticipants`.
Änderungen am Datenmodell: keine.

## Offene Fragen
- Paralleltest für AK4 gegen echte Datenbank.
- Architektur nennt für `EVENT_FULL` „Ausgebucht“; umgesetzt ist „Leider gerade ausgebucht.“ nach AK4.

## Zuordnung Kriterium → Ebene → Test → Datei
| Kriterium | Ebene | Test | Datei |
| --- | --- | --- | --- |
| AK1 | Integration | `F-22 AK1: …` | `tests/integration/local-event-repository.int.test.ts`, `tests/integration/supabase-event-repository.int.test.ts` |
| AK2 | Unit, Integration | `F-22 AK2: …` | `src/lib/events/participation.test.ts`, `tests/integration/local-auth-flow.int.test.ts`, `supabase-event-repository.int.test.ts` |
| AK3 | Integration | `F-22 AK3: …` | `tests/integration/local-auth-flow.int.test.ts`, `supabase-event-repository.int.test.ts` |
| AK4 | Unit | `F-22 AK4: übersetzt EVENT_FULL…` | `src/lib/data/supabase-error-translation.test.ts`, `supabase-gateways.test.ts` |

## Änderungen
