# Protokoll F-06

## Frühere Schritte (aus `git log`, Testergebnisse hier nicht nachvollzogen: offen)
- `787d9f8` Tests für Filterleiste · `08cd177` Suchleiste, Sportarten-Chips, Filterdialog

## 2026-11-23 · coder (Nacharbeit)
- `b84e77d` (F-08) Akzeptanztests vergleichen Karte und Liste jetzt über die Treffen-Kennungen (einzeln oder gruppiert) statt über die reine Markerzahl.
- `41fe6e9` (F-18) REV-06: Fokusfalle im Filterdialog über `useDialogFocus`; Komponententest `F-06 AK1 (REV-06)` vorher rot.
- Testbefehl: `npx playwright test e2e/f-06-filter.spec.ts` grün (in mehreren Läufen dieses Schritts).
- Gesamtlauf am Ende: `npx tsc --noEmit` 0 Fehler · `npx eslint src e2e tests` 0 Befunde · `npx vitest run` 28 Dateien bestanden, 1 übersprungen; 283 Tests bestanden, 2 übersprungen (Supabase-Integration ohne Zugangsdaten) · `npx playwright test` 117 bestanden, 1 übersprungen (nur-mobil-Test im Desktop-Projekt). E2E lief in einer Kopie des Arbeitsstands auf Port 3040, weil im Repo bereits ein Dev-Server des Orchestrators lief.
