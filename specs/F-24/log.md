# Protokoll F-24

## Frühere Schritte (aus `git log`)
- Keine eigenen Commits vor diesem Schritt. „Meine Treffen mit Reitern“ ist Teil von `90cf99b`, Tests in `d93e8de`.

## 2026-11-23 · coder (Nacharbeit)
- `f2cc500` Profil zeigt „Treffen dabei“ / „organisiert“ und Link „Deine Treffen ansehen“ (Text nicht „Meine Treffen …“, weil bestehende E2E-Locators `getByRole('link', { name: 'Meine Treffen' })` sonst doppelt träfen). Aufteilung als Kernlogik `splitViewerEvents` (`src/lib/events/viewer-events.ts`), auch in „Meine Treffen“ genutzt. Tests zuerst: 2 Unit-Tests, E2E `F-24 AK4` (vorher rot).
- Testbefehl: `npx playwright test e2e/f-22-teilnahme.spec.ts e2e/f-01-anmeldung.spec.ts e2e/smoke.spec.ts` 34 bestanden.
- Gesamtlauf am Ende: `npx tsc --noEmit` 0 Fehler · `npx eslint src e2e tests` 0 Befunde · `npx vitest run` 28 Dateien bestanden, 1 übersprungen; 283 Tests bestanden, 2 übersprungen (Supabase-Integration ohne Zugangsdaten) · `npx playwright test` 117 bestanden, 1 übersprungen (nur-mobil-Test im Desktop-Projekt). E2E lief in einer Kopie des Arbeitsstands auf Port 3040, weil im Repo bereits ein Dev-Server des Orchestrators lief.
- Offen für planner: `F-24 AK4` (Profilzähler) fehlt im Backlog.
