# Fehlerprotokoll

Gefundene Fehler mit Fundort, Ursache, Behebung und Nachweis. IDs `BUG-XX` werden in Commits und im Testbericht referenziert.

| ID | Datum | Gefunden durch | Beschreibung | Ursache | Behebung | Status |
| --- | --- | --- | --- | --- | --- | --- |
| BUG-01 | 23.11.2026 | Integrationstest `tests/integration/supabase-event-repository.int.test.ts` (gegen echte Supabase-DB) | Im Supabase-Modus konnten keine Treffen geladen werden („Die Treffen konnten nicht geladen werden“). 2 von 2 Integrationstests rot, alle 85 Unit-Tests grün. | PostgREST-Fehler `PGRST201`: Einbettung `organizer:profiles(...)` mehrdeutig, da `events` über `organizer_id` und über `participations` mit `profiles` verbunden ist. Unit-Tests mit gemocktem Client konnten das nicht erkennen. | Beziehung explizit benannt: `profiles!events_organizer_id_fkey` in `src/lib/data/event-row-mapping.ts`. | behoben, Integrationstests 2/2 grün |
