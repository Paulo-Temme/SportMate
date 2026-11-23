# Protokoll F-22

## 2026-11-23 · coder (Datenschicht)
- Geänderte Dateien: `src/lib/data/event-row-mapping.ts`, `supabase-error-translation.ts`, `supabase-event-repository.ts`, `src/lib/events/participation.ts`, `stored-event.ts`, Tests `event-row-mapping.test.ts`, `supabase-error-translation.test.ts`, `supabase-gateways.test.ts`, `tests/integration/supabase-event-repository.int.test.ts`, `tests/integration/local-auth-flow.int.test.ts`.
- Ausgeführte Befehle und Ergebnis: siehe `specs/F-01/log.md` (gemeinsamer Lauf); Integrationstest gegen Supabase lokal übersprungen (keine Zugangsdaten).
- Versuche: 1.
- Auffälligkeiten / Mensch muss selbst lesen: **Besondere Vorsicht: Login/Rechte – menschliches Review nötig.** Betroffen: `src/lib/data/supabase-auth-gateway.ts`, `local-auth-gateway.ts` (Passwort-Hash), `supabase-event-repository.ts`, `supabase-error-translation.ts`, `tests/integration/supabase-event-repository.int.test.ts`.
- Hinweis: Der Integrationstest legt Wegwerf-Konten `*@sportmate-test.de` an und kann sie ohne service_role nicht löschen; Treffen bleiben abgesagt zurück. Der Fall „voll“ braucht ein drittes Konto.
- Offen: AK4 Paralleltest; Supabase-Klassen nur per Integrationstest abgedeckt (Unit-Coverage dort niedrig).

## 2026-11-23 · coder (Nacharbeit)
- `2b5bc33` Supabase-Modus geprüft (Code, ohne Zugangsdaten): Banner und Demo-Personen nur bei `mode === 'local'` (`app-shell.tsx`, `auth-form.tsx`, `profile-view.tsx`), Supabase-Gateway liefert keine Demo-Konten. Gefunden und behoben: Erstellen zeigte bei Nicht-Fachfehlern `error.message` roh, Abmelden hatte keine Fehlerbehandlung. Neu: `describeActionFailure` (`src/lib/events/failure-message.ts`, 2 Unit-Tests vorher rot) für Teilnahme, Erstellen, Anmelden, Abmelden. Live-Prüfung offen (Orchestrator).
- `49eb701` BUG-02/REV-15: Akzeptanztests auf „Du bist dabei“ / „Du bist nicht mehr dabei“ umgestellt und **bewusst rot committet** (8 E2E rot, Unit/Lint/Typen grün), dann `6b9a4d9` Umsetzung (26 E2E grün).
- `d5d8a62` BUG-03/REV-03: Integrationstest sagt jedes erstellte Treffen in `afterEach` ab (auch bei Fehlschlag), Titel „[Test] Integrationstest Treffen“. **Nicht gegen Supabase ausgeführt** (keine Zugangsdaten); im Standardlauf übersprungen.
- `7fa4ade` REV-11: „Dieses Treffen gibt es nicht.“ nur noch in `supabase-error-translation.ts`.
- **Besondere Vorsicht – Mensch muss selbst lesen:** `src/lib/data/supabase-event-repository.ts`, `tests/integration/supabase-event-repository.int.test.ts`.
- Gesamtlauf am Ende: `npx tsc --noEmit` 0 Fehler · `npx eslint src e2e tests` 0 Befunde · `npx vitest run` 28 Dateien bestanden, 1 übersprungen; 283 Tests bestanden, 2 übersprungen (Supabase-Integration ohne Zugangsdaten) · `npx playwright test` 117 bestanden, 1 übersprungen (nur-mobil-Test im Desktop-Projekt). E2E lief in einer Kopie des Arbeitsstands auf Port 3040, weil im Repo bereits ein Dev-Server des Orchestrators lief.
