# Protokoll F-01

## 2026-11-23 · coder (Datenschicht)
- Geänderte Dateien: `src/lib/events/*` (Modell auf `participantCount`/Sichtfelder umgestellt), `src/lib/auth/*` (neu), `src/lib/data/*` (AuthGateway, LocalSession, LocalAuthGateway, SupabaseAuthGateway, supabase-client, data-services; repository-factory durch data-services ersetzt, Tests mitgezogen), `tests/fixtures/sample-events.ts`.
- Commits: 2dc0205 (Vertrag), 39b6d01 (Tests F-32/F-01 lokal), 4c43005 (lokale Anmeldung), 27cf0c1 (Tests Supabase), 4d031b5 (Supabase).
- Ausgeführte Befehle und Ergebnis: `npx vitest run src/lib tests` 205 bestanden, 2 übersprungen (Supabase-Integration ohne Zugangsdaten); `npx tsc --noEmit` ohne Fehler in src/lib/tests; `npx eslint src/lib tests` ohne Befund.
- Versuche: 1 (ein eigener Testfehler: Datum von `validInput` lag in der Vergangenheit, im Test korrigiert).
- Auffälligkeiten / Mensch muss selbst lesen: **Besondere Vorsicht: Login/Rechte – menschliches Review nötig.** Betroffen: `src/lib/data/supabase-auth-gateway.ts`, `local-auth-gateway.ts` (Passwort-Hash), `supabase-event-repository.ts`, `supabase-error-translation.ts`, `tests/integration/supabase-event-repository.int.test.ts`.
- Offen: Supabase-Integrationstest muss der Orchestrator mit `SUPABASE_INTEGRATION=1` ausführen. Mindestlänge 8/12 (F04).

## 2026-11-23 · coder (Nacharbeit)
- `a604df3` `/anmelden` zeigt Angemeldeten „Du bist bereits angemeldet als …“ mit Link „Zum Profil“; nach eigener Anmeldung bleibt das Formular bis zum Rücksprung stehen. E2E `F-01 AK6` zuerst (rot), dann grün (12 bestanden in `e2e/f-01-anmeldung.spec.ts`).
- `df3522f` REV-12: `onAuthChange` meldet nach dem Abbestellen nichts mehr; 2 Unit-Tests mit Fake-Timern (1 vorher rot).
- **Besondere Vorsicht – Login: Mensch muss selbst lesen:** `src/components/auth/auth-form.tsx`, `src/lib/data/supabase-auth-gateway.ts`.
- Offen für planner: `F-01 AK6` fehlt im Backlog.
- Gesamtlauf am Ende: `npx tsc --noEmit` 0 Fehler · `npx eslint src e2e tests` 0 Befunde · `npx vitest run` 28 Dateien bestanden, 1 übersprungen; 283 Tests bestanden, 2 übersprungen (Supabase-Integration ohne Zugangsdaten) · `npx playwright test` 117 bestanden, 1 übersprungen (nur-mobil-Test im Desktop-Projekt). E2E lief in einer Kopie des Arbeitsstands auf Port 3040, weil im Repo bereits ein Dev-Server des Orchestrators lief.
