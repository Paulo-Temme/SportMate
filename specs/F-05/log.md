# Protokoll F-05

## Frühere Schritte (aus `git log`, Testergebnisse dieser Schritte hier nicht nachvollzogen: offen)
- `e72b938` Tests für Sheet-Rastpunkte, Treffen-Karte und Akzeptanztests der Liste
- `f3d2545` Designsystem, App-Rahmen, Navigation, Bottom Sheet und Trefferliste
- `9f79927` Screenshots (Stand vor der Nacharbeit)

## 2026-11-23 · coder (Nacharbeit)
- `ebe3eb4` (mit F-08) `sheet-snap.ts` nach `src/lib/ui/` verschoben, Tests mitgenommen.
- `07b700f` Meta-Zeile der Treffen-Karte: Trennpunkt per `::before` in abgeschnittenem Rand, nie am Zeilenanfang; Elemente brechen nicht in sich um. Test zuerst: `e2e/f-05-liste.spec.ts` (320 px, Orakel prüft Trennpunkt am Zeilenanfang; vorher rot, danach grün) und „Niveau, Alter, Kosten in einer Zeile“ (mobil).
- `9bce767` `devIndicators: false`; neuer E2E-Test `F-05 AK5` navigiert per Klick über die Tab-Leiste (vorher rot, danach grün).
- `126600d` REV-04: `describeDayLabel` aus `components/event/day-label.ts` nach `src/lib/events/event-presentation.ts`, nutzt `buildCalendarWindow` der Suche; Unit-Tests inkl. Zeitumstellung (vorher rot).
- `c369461` REV-07: feste Farbwerte in 20 CSS-Modulen durch neue Tokens ersetzt, Tokens in `docs/design.md`.
- `9203db4` Gestaltungsdetails nach Screenshot-Durchsicht (Demo-Hinweis neutral, Datum bricht nach dem Wochentag um, Profilzahlen).
- `ff85956` Screenshots neu (8 Dateien, Demo-Modus, Online-Karte), selbst angesehen.
- Testbefehle je Schritt: `npx vitest run` grün; `npx playwright test e2e/f-05-liste.spec.ts e2e/smoke.spec.ts` grün.
- Gesamtlauf am Ende: `npx tsc --noEmit` 0 Fehler · `npx eslint src e2e tests` 0 Befunde · `npx vitest run` 28 Dateien bestanden, 1 übersprungen; 283 Tests bestanden, 2 übersprungen (Supabase-Integration ohne Zugangsdaten) · `npx playwright test` 117 bestanden, 1 übersprungen (nur-mobil-Test im Desktop-Projekt). E2E lief in einer Kopie des Arbeitsstands auf Port 3040, weil im Repo bereits ein Dev-Server des Orchestrators lief.
- Offen für planner: `F-05 AK5` (Tab-Leiste per Klick) ist als Testname neu und steht noch nicht im Backlog.
