# Protokoll F-07

## Frühere Schritte (aus `git log`)
- Keine eigenen Commits. Niveau- und Altersfilter sind Teil von `787d9f8` (Tests) und `08cd177` (Filterdialog „Zeitraum, Niveau und Alter“).

## 2026-11-23 · coder (Nacharbeit)
- Keine Änderung an der Filterlogik. Die Altersangabe in Liste und Details lautet jetzt „Alter: …“ (`18af5af`, F-12); der Filter selbst heißt weiter „Altersgruppe“.
- Gesamtlauf am Ende: `npx tsc --noEmit` 0 Fehler · `npx eslint src e2e tests` 0 Befunde · `npx vitest run` 28 Dateien bestanden, 1 übersprungen; 283 Tests bestanden, 2 übersprungen (Supabase-Integration ohne Zugangsdaten) · `npx playwright test` 117 bestanden, 1 übersprungen (nur-mobil-Test im Desktop-Projekt). E2E lief in einer Kopie des Arbeitsstands auf Port 3040, weil im Repo bereits ein Dev-Server des Orchestrators lief.
