# Protokoll F-00

F-00 ist das technische Grundgerüst (Setup), keine fachliche Story. Quelle: Auftrag des Orchestrators im Auftrag
des Teams. Eine `spec.md` gibt es noch nicht; die Akzeptanzkriterien unten sind die Arbeitsliste des Setups und
müssen vom planner in eine Spec übernommen werden, sonst meldet `make trace` sie als Lücke.

Arbeitsliste (in den Testnamen als `F-00 AKn` referenziert):
- AK1 (Unit): Treffen erstellen, Eingaben prüfen (Grenzwerte, Feldangabe im Fehler).
- AK2 (Unit): Teilnehmen, Verlassen, Absagen; Vorabprüfung des Teilnehmen-Knopfs.
- AK3 (Unit): Suche und Filter (Text, Sportart, Niveau, Alter, Zeitraum in Europe/Berlin, Meine Treffen).
- AK4 (Unit): Anzeigeangaben (freie Plätze, Altersgruppe, Status, Datum/Uhrzeit).
- AK5 (Unit): Reihenfolge der Trefferliste (volle Treffen ans Ende).
- AK6 (Unit): Demodaten relativ zum aktuellen Datum, "heute" und "morgen" haben Treffer.
- AK7 (Unit, Integration): Datenzugriff über `EventRepository`, lokal mit localStorage, Auswahl über Umgebungsvariablen.
- AK8 (E2E): Startseite lädt und zeigt den Platzhalter.

## 23.11.2026 12:25 · coder (Setup)
- Schritte:
  1. Next.js 16.4.6 mit `create-next-app@latest` (App Router, TypeScript, ESLint, `src/`, npm, ohne Tailwind) im Scratchpad
     erzeugt und ins Repo kopiert: `package.json`, `package-lock.json`, `tsconfig.json`, `eslint.config.mjs`,
     `next.config.ts`, `AGENTS.md`, `src/app/layout.tsx`, `globals.css`, `favicon.ico`. Vorlagendateien nicht überschrieben,
     README der Vorlage bleibt.
  2. Abhängigkeiten. Dev: `@types/node@^22`, `vitest`, `@vitest/coverage-v8`, `@vitejs/plugin-react`, `@playwright/test`,
     `prettier`, `@testing-library/react`, `@testing-library/dom`, `jsdom`. Laufzeit: `motion`, `lucide-react`,
     `maplibre-gl`, `@supabase/supabase-js`, `@supabase/ssr`.
  3. `vitest.config.mts` (Unit `src/**/*.test.ts(x)`, Integration `tests/integration/**`, Coverage für `src/lib/`),
     `playwright.config.ts` (`e2e/`, Webserver `npm run dev -- --port 3010`, Projekte Pixel 7 und Desktop Chrome),
     `e2e/smoke.spec.ts`.
  4. Fachlogik aus `project/src/features/events/` nach `src/lib/events/` portiert und in einzelne Aufgaben zerlegt:
     `event-model.ts`, `event-error.ts`, `acting-user.ts`, `event-validation.ts`, `event-creation.ts`, `participation.ts`,
     `event-search.ts`, `event-presentation.ts`, `list-order.ts`, `demo-people.ts`, `demo-events.ts`.
     Geändert gegenüber der Demo: `changeParticipation(action)` aufgeteilt in `addParticipant`, `removeParticipant`,
     `cancelEvent`; `unavailableParticipation` (Text "keine echte Anmeldung") ersetzt durch `checkJoinAvailability`,
     weil der lokale Speicher jetzt echte Teilnahme erlaubt; Prüfung "bekannte Demoperson" aus der Kernlogik in den
     lokalen Datenzugriff verschoben (Kernlogik prüft nur "angemeldet"), damit später Supabase-Kennungen funktionieren;
     `validateEvent` und `searchEvents` in Regel-/Prädikatlisten zerlegt (kognitive Komplexität).
  5. Unit-Tests portiert und ergänzt (neben den Dateien), feste Testdaten in `tests/fixtures/sample-events.ts`,
     Integrationstest `tests/integration/local-event-repository.int.test.ts`.
  6. Datenzugriff: `src/lib/data/event-repository.ts` (Schnittstelle), `local-event-repository.ts` (localStorage,
     Demodaten, an jedem neuen Tag frische Demotreffen, eigene Treffen bleiben), `supabase-event-repository.ts`
     (Platzhalter, wirft "noch nicht umgesetzt"), `repository-factory.ts` (Supabase nur bei beiden Variablen).
  7. `Makefile` ruft npm-Skripte auf (`lint`, `typecheck` = `next typegen && tsc --noEmit`, `test`, `coverage`, `build`,
     `test:e2e`, `trace`, `stats`); `package.json` spiegelt die Ziele, dazu `check`, `format`, `format:check`.
     `.github/workflows/ci.yml`: Node 22 mit npm-Cache, `make setup lint typecheck coverage build`, auch auf `develop`.
  8. `src/app/page.tsx` Platzhalter "SportMate / im Aufbau", Schibsted Grotesk über `next/font/google`, Tokens aus
     `docs/design.md` in `src/app/globals.css`.
  9. `.gitignore`, `.env.example` (zwei leere Supabase-Variablen), `.prettierrc.json`, `.prettierignore`.
  10. ESLint: `no-explicit-any`, `ban-ts-comment` als Fehler, `noInlineConfig` (eslint-disable wirkt nicht).
- Ausgeführte Befehle und Ergebnis (23.11.2026, Windows, Git Bash, Node 22.22, GNU Make 4.4.1 aus winget):
  - `npm run lint` / `make lint`: ohne Befund.
  - `npm run typecheck` / `make typecheck`: "Types generated successfully", tsc ohne Fehler.
  - `npm test` / `make test`: 9 Testdateien, 98 Tests bestanden. Zusätzlich mit `TZ=UTC` und
    `TZ=America/New_York`: 98 bestanden.
  - `npm run coverage`: Anweisungen 95,06 %, Zweige 97,26 %, Funktionen 93,13 %, Zeilen 95,02 % (`src/lib/`);
    `src/lib/events/` 100 % Zeilen; Lücke nur im Supabase-Platzhalter.
  - `make check`: grün (lint, typecheck, 98 Tests).
  - `npm run build`: erfolgreich, Route `/` statisch; ohne `.env`.
  - `npx prettier --check .`: alle Dateien formatiert.
  - `npx playwright test`: nicht gelaufen. Playwright 1.65.1 braucht Chromium-Build 1255, installiert ist 1248.
    Der Mensch führt einmal `npx playwright install chromium` aus, danach `make e2e`.
  - `make trace`: läuft; meldet F-00 AK1–AK8 als "Kriterium in keiner Spec" (siehe oben).
- Versuche: 1 (alle Prüfungen beim ersten Lauf grün).
- Auffälligkeiten / Mensch muss selbst lesen:
  - Rechte: `participation.ts` (nur organisierende Person sagt ab) und `acting-user.ts` sind Rechteprüfungen der
    Kernlogik; der lokale Modus hat keine echte Anmeldung, die Person wird aus einer Demo-Liste gewählt.
  - `next.config.ts` aus der Vorlage aktiviert `cacheComponents` und `partialPrefetching` (Standard von Next 16.4).
  - Neue Abhängigkeiten ohne Notiz in `docs/decisions/` (Ordner gehört dem architect): offen.
  - Kognitive Komplexität wird lokal nicht per Lint geprüft (kein `eslint-plugin-sonarjs`), nur im Review und SE-Eval.
  - Demodaten: in den letzten fünf Minuten vor Mitternacht hat "heute" keinen Treffer mehr.
