# Protokoll F-12

## Frühere Schritte (aus `git log`, Testergebnisse hier nicht nachvollzogen: offen)
- `d6034eb` Akzeptanztests Detailansicht · `5ae44f4` Detailansicht im Sheet

## 2026-11-23 · coder (Nacharbeit)
- `18af5af` FB-45: `describeAgeGroup` liefert „Alter: 20–25 Jahre“, „Alter: offen für alle“, „Alter: nicht angegeben“. Unit-, Komponenten- und E2E-Orakel auf exakten Wortlaut geschärft (vorher Regex auf „20–25 Jahre“), neuer E2E-Test für „offen für alle“. Vorher rot (4 Tests), danach grün.
- `b780306` AK1: `formatEventSchedule` (z. B. „Do, 26.11., 18:00–20:00 Uhr · 2 Std.“, Berliner Zeit, Dauer in Std./Min., ohne Dauer bei Ende ≤ Beginn, RangeError bei ungültigem Datum) in der Detailansicht. 5 Unit-Tests vorher rot; E2E AK1 prüft das ganze Format.
- Testbefehl: `npx playwright test e2e/f-12-details.spec.ts` 22 bestanden.
- Gesamtlauf am Ende: `npx tsc --noEmit` 0 Fehler · `npx eslint src e2e tests` 0 Befunde · `npx vitest run` 28 Dateien bestanden, 1 übersprungen; 283 Tests bestanden, 2 übersprungen (Supabase-Integration ohne Zugangsdaten) · `npx playwright test` 117 bestanden, 1 übersprungen (nur-mobil-Test im Desktop-Projekt). E2E lief in einer Kopie des Arbeitsstands auf Port 3040, weil im Repo bereits ein Dev-Server des Orchestrators lief.
