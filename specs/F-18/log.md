# Protokoll F-18

## Frühere Schritte (aus `git log`)
- Keine eigenen Commits vor diesem Schritt. Absagen ist Teil von `d93e8de` (Akzeptanztests) und `90cf99b` (Teilnehmen, Zurückziehen und Absagen).

## 2026-11-23 · coder (Nacharbeit)
- `41fe6e9` REV-05/REV-06: `useDialogFocus` (Startfokus, Fokusfalle, Escape, Fokus-Rückgabe) in `ConfirmDialog` und `FilterPanel`; reine Logik `src/lib/ui/focus-trap.ts`. Escape und Klick auf den Hintergrund brechen während `busy` nicht ab. Tests zuerst: `confirm-dialog.test.tsx` (3), `focus-trap.test.ts` (3), Filterdialog (1) – vorher rot.
- Testbefehl: `npx playwright test e2e/f-22-teilnahme.spec.ts e2e/f-06-filter.spec.ts` 36 bestanden.
- Gesamtlauf am Ende: `npx tsc --noEmit` 0 Fehler · `npx eslint src e2e tests` 0 Befunde · `npx vitest run` 28 Dateien bestanden, 1 übersprungen; 283 Tests bestanden, 2 übersprungen (Supabase-Integration ohne Zugangsdaten) · `npx playwright test` 117 bestanden, 1 übersprungen (nur-mobil-Test im Desktop-Projekt). E2E lief in einer Kopie des Arbeitsstands auf Port 3040, weil im Repo bereits ein Dev-Server des Orchestrators lief.
