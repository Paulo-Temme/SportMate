# Protokoll F-22

## 2026-11-23 · coder (Datenschicht)
- Geänderte Dateien: `src/lib/data/event-row-mapping.ts`, `supabase-error-translation.ts`, `supabase-event-repository.ts`, `src/lib/events/participation.ts`, `stored-event.ts`, Tests `event-row-mapping.test.ts`, `supabase-error-translation.test.ts`, `supabase-gateways.test.ts`, `tests/integration/supabase-event-repository.int.test.ts`, `tests/integration/local-auth-flow.int.test.ts`.
- Ausgeführte Befehle und Ergebnis: siehe `specs/F-01/log.md` (gemeinsamer Lauf); Integrationstest gegen Supabase lokal übersprungen (keine Zugangsdaten).
- Versuche: 1.
- Auffälligkeiten / Mensch muss selbst lesen: **Besondere Vorsicht: Login/Rechte – menschliches Review nötig.** Betroffen: `src/lib/data/supabase-auth-gateway.ts`, `local-auth-gateway.ts` (Passwort-Hash), `supabase-event-repository.ts`, `supabase-error-translation.ts`, `tests/integration/supabase-event-repository.int.test.ts`.
- Hinweis: Der Integrationstest legt Wegwerf-Konten `*@sportmate-test.de` an und kann sie ohne service_role nicht löschen; Treffen bleiben abgesagt zurück. Der Fall „voll“ braucht ein drittes Konto.
- Offen: AK4 Paralleltest; Supabase-Klassen nur per Integrationstest abgedeckt (Unit-Coverage dort niedrig).
