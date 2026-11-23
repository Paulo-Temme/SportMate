# Protokoll F-17

## Frühere Schritte (aus `git log`, Testergebnisse hier nicht nachvollzogen: offen)
- `1c0ee48` Tests Erstellen · `ce2a7d4` Erstellen-Assistent in drei Schritten

## 2026-11-23 · coder (Nacharbeit)
- `2b5bc33` (F-22) Fehler beim Veröffentlichen zeigen nie die Rohmeldung (gemeinsame `describeActionFailure`).
- `ded1894` BUG-04/REV-01: Höchstdauer 12 Stunden (`eventLimits.durationHoursMax`) mit eigener Meldung „Ein Treffen darf höchstens 12 Stunden dauern.“; `events_max_duration` wird auf diese Meldung übersetzt. Tests zuerst (3 rot): 12 h erlaubt, 12 h 1 min abgelehnt, Übersetzung.
- REV-08: Kostenobergrenze – TS (`eventLimits.costCentsMax` 5000) ist führend und unverändert. **Offene Schemaänderung für den Orchestrator:** `supabase/migrations/0001_initial_schema.sql` (`events_cost_range`, 10000 Cent) auf 5000 angleichen – nicht vom coder geändert (Schema, menschliches Review).
- Gesamtlauf am Ende: `npx tsc --noEmit` 0 Fehler · `npx eslint src e2e tests` 0 Befunde · `npx vitest run` 28 Dateien bestanden, 1 übersprungen; 283 Tests bestanden, 2 übersprungen (Supabase-Integration ohne Zugangsdaten) · `npx playwright test` 117 bestanden, 1 übersprungen (nur-mobil-Test im Desktop-Projekt). E2E lief in einer Kopie des Arbeitsstands auf Port 3040, weil im Repo bereits ein Dev-Server des Orchestrators lief.
