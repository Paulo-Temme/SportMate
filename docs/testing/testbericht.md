# Testbericht SportMate – Stand Präsentation 5

## Endlauf 23.11.2026 (maßgeblich für Präsentation 5)

| | |
| --- | --- |
| Datum / Uhrzeit | 23.11.2026, 14:00–14:07 |
| Commit | `004a9fa` (Branch `develop`, Arbeitsbaum sauber) |
| Durchgeführt von | tester/reporter (Agent); Supabase-Integrationslauf und Live-Prüfung BUG-03: Orchestrator (ca. 14:00) |
| Umgebung | wie unten; Playwright lief in einer sauberen Arbeitskopie (`git worktree add`, `npm ci`), weil im Projektordner ein fremder Next-Dev-Server (Port 3020) lief. Vor dem Lauf fehlten die Playwright-Browser auf dem Rechner (1. Versuch: 118 Abbrüche „Executable doesn't exist“, kein Testergebnis); nach `npx playwright install chromium` lief die Suite vollständig. |

### Ergebnis je Ebene

| Ebene | Befehl | bestanden | fehlgeschlagen | übersprungen | Bemerkung |
| --- | --- | ---: | ---: | ---: | --- |
| Unit + Komponente + Integration (lokal) | `npx vitest run --coverage` | 283 | 0 | 2 | 28 von 29 Dateien bestanden, 1 übersprungen (Supabase-Integration ohne `SUPABASE_INTEGRATION=1`); Dauer 2,4 s |
| davon Unit `src/lib` | (JSON-Auswertung desselben Stands) | 243 | 0 | 0 | 20 Dateien |
| davon Unit/Komponente `src/components` | | 34 | 0 | 0 | 21 Komponententests (jsdom, 4 Dateien) + 13 Unit-Tests reiner Hilfsfunktionen (2 Dateien) |
| davon Integration `tests/integration` | | 6 | 0 | 2 | 2 Supabase-Fälle nur mit echter DB |
| Integration gegen echte Supabase-DB | `SUPABASE_INTEGRATION=1 npx vitest run` (Orchestrator) | 285 | 0 | 0 | 29 Dateien; danach alle 4 neu angelegten „[Test] …“-Treffen in der DB `cancelled` (BUG-03 live verifiziert) |
| Akzeptanz / E2E | `npx playwright test --reporter=list` | 117 | 0 | 1 | 59 Tests × 2 Projekte = 118 Läufe, 48,1 s; übersprungen: `F-05 AK2: Niveau, Alter und Kosten passen auf Mobilgeräten in eine Zeile` im Projekt Desktop Chrome (`test.skip(!isMobile)`, gewollt) |
| Typprüfung | `npx tsc --noEmit` | – | 0 Fehler | – | Exit 0 |
| Lint | `npx eslint src e2e tests` | – | 0 Befunde | – | Exit 0 |

Coder-Endlauf (vom Orchestrator übermittelt, gleicher Stand): tsc 0, ESLint 0, Vitest 283/2 übersprungen, Playwright 117/1 übersprungen – stimmt mit diesem Lauf überein.

### Coverage (`npx vitest run --coverage`, Messbereich `src/lib/**`, ohne Supabase-Integration)

| Bereich | Anweisungen | Zweige | Funktionen | Zeilen |
| --- | ---: | ---: | ---: | ---: |
| **gesamt = `src/lib`** | 89,80 % (555/618) | 85,31 % (366/429) | 95,57 % (216/226) | 90,66 % (447/493) |
| `src/lib/events` | 100 % | 98,80 % | 100 % | 100 % |
| `src/lib/data` | 79,63 % | 72,44 % | 89,69 % | 80,36 % |
| `src/lib/map` | 90,14 % | 80 % | 100 % | 94,23 % |
| `src/lib/ui` | 100 % | 100 % | 100 % | 100 % |
| `src/lib/auth` | 100 % | 100 % | 100 % | 100 % |

Schwach gedeckt im Standardlauf (Zeilen / Zweige): `supabase-event-repository.ts` 36,95 % / 32,43 %, `supabase-auth-gateway.ts`
71,42 % / 28,12 %, `supabase-client.ts` 75 % / 90 %, `data-services.ts` 81,81 % / 71,42 %. Diese Teile laufen im Integrationslauf
gegen die echte DB mit (285/285), dessen Coverage wurde nicht gemessen (REV-02 offen).

### Vorher / Nachher (Stand Review `9f79927`, 13:13 → Endlauf `004a9fa`, 14:05)

| Kennzahl | vorher | nachher |
| --- | ---: | ---: |
| Vitest bestanden / übersprungen | 243 / 2 | 283 / 2 |
| Vitest-Dateien | 24 | 29 |
| Vitest mit echter DB | 2/2 Integrationsfälle (Einzellauf) | 285/285 (voller Lauf) |
| Akzeptanztests (Titel) / Läufe bestanden | 51 / 102 | 59 / 117 (+1 gewollt übersprungen) |
| Coverage `src/lib` Zeilen / Zweige | 87,59 % / 84,01 % | 90,66 % / 85,31 % |
| Coverage `src/lib/data` Zeilen / Zweige | 77,83 % / 70,96 % | 80,36 % / 72,44 % |
| tsc / ESLint | 0 / 0 | 0 / 0 |
| Fehler offen (BUG) | 3 von 4 | 0 von 4 |
| Review-Befunde offen | 15 | 5 (REV-02, -09, -10, -13, -14) |

Neue Tests seit dem Review: F-08 AK5/AK6 (Marker-Gruppen, `marker-grouping.test.ts` 12 + 2 E2E), F-01 AK6 (Hinweis für Angemeldete),
F-24 AK4 (Profilzähler) und `viewer-events.test.ts`, F-05 AK5 (Tab-Leiste per Klick), F-05 AK2 (Meta-Zeile 320 px, mobil eine Zeile),
F-12 AK1 (Termin mit Dauer, 5 Unit-Tests), F-12 AK2 (FB-45, „Alter: offen für alle“, E2E + Komponente), BUG-04 (2 Unit-Tests),
REV-04 (3), REV-05/06 (Fokusfalle 3 + 3 + 1), REV-12 (2), F-22 AK4 (Fehlertexte nie roh, 2). Einzelheiten: `docs/testing/testfaelle.md`.

### SE-Eval (erneut gemessen 23.11.2026 14:07, `--skip mutation --refresh`, Snapshot `004a9fa`)

| Kennzahl | erste Messung (`8e4f171`, vor den UI-Stories) | Endstand (`004a9fa`) |
| --- | ---: | ---: |
| Codezeilen App (SLOC) | 814 | 4.990 |
| ESLint-Befunde je KLOC (neutrale Konfiguration) | 18,43 | 4,41 |
| Kognitive Komplexität Median / P90 / Funktionen > 15 | 1 / 3 / 0 | 1 / 4 / 0 |
| tsc-strict-Fehler je KLOC / Typ-Umgehungen je KLOC | 0 / 0 | 0 / 0 |
| Duplizierte Zeilen | 0 % | 0,33 % |
| Testfälle Unit / Integration / E2E (gezählt) | 97 / 1 / 1 | 277 / 8 / 59 |
| Anteil Testcode | 39,21 % | 34,13 % |
| Line / Branch Coverage (SE-Eval-Messbereich: gesamte App) | 92,71 % / 97,26 % | 44,54 % / 46,46 % |
| App-Dateien ohne Coverage | – | 44 |
| Fehlgeschlagene Tests 1. Lauf / instabile Tests | 0 / 0 | 0 / 0 |
| Commits (ohne Merges) | – | 55 (alle mit KI-Co-Autor) |
| Mutation Score | 7,69 % (nicht verwertbar) | nicht gemessen (`--skip mutation`); der Bericht zeigt weiter den alten Wert |

Die SE-Eval-Coverage bezieht die Oberfläche (`src/components`, `src/app`, `src/hooks`) ein, die nur durch Playwright geprüft
wird; daher der Abstand zu den 90,66 % auf `src/lib`. „Fertige Punkte 0“ im SE-Eval-Bericht: `data/agentisch/abnahme.csv` ist
vom Team nicht gefüllt, keine Aussage über den Umsetzungsstand.

---

## Erster Lauf vor den Korrekturen (Review-Stand `9f79927`)

| | |
| --- | --- |
| Datum / Uhrzeit | 23.11.2026, 13:13–13:17 (automatische Läufe); manuelle Tests und Supabase-Integration am 23.11.2026 durch den Orchestrator |
| Commit | `9f79927` (Branch `develop`) |
| Arbeitsstand | Vitest, tsc und ESLint liefen im Projektordner über `9f79927` **plus** nicht committete Änderungen des Coders (`src/lib/events/event-presentation.ts`, `event-presentation.test.ts`, `event-card.test.tsx`, `e2e/f-12-details.spec.ts`). Playwright lief auf einer sauberen Kopie genau dieses Commits (`git archive HEAD`, `npm ci`), siehe „Ablauf“. |
| Umgebung | Windows 11 Pro (10.0.26200), Node.js v22.22.3, Vitest 5 mit `@vitest/coverage-v8`, Playwright 1.65.1 mit Chromium (Projekte „Mobile Chrome“ = Pixel 7, „Desktop Chrome“), Next.js 16.4.6 Dev-Server Port 3010, lokaler Modus, Offline-Karte, `de-DE`, `Europe/Berlin` |
| Durchgeführt von | tester/reviewer (Agent); manuelle Fälle: Orchestrator |
| Testfälle | Katalog `docs/testing/testfaelle.md` |

### Ergebnis je Ebene (erster Lauf)

| Ebene | Befehl | bestanden | fehlgeschlagen | übersprungen | Bemerkung |
| --- | --- | ---: | ---: | ---: | --- |
| Unit + Komponente + Integration (lokal) | `npx vitest run --coverage` (13:13) | 243 | 0 | 2 | 23 Dateien bestanden, 1 übersprungen (Supabase-Integration ohne `SUPABASE_INTEGRATION=1`); Dauer 2,4 s |
| dasselbe, Wiederholung als JSON | `npx vitest run --reporter=json` (13:15) | 245 | 0 | 2 | 2 neue Tests aus den laufenden Coder-Änderungen; Aufteilung: Unit 200, Komponente 39, Integration 6 + 2 übersprungen |
| Integration gegen echte Supabase-DB | `SUPABASE_INTEGRATION=1 npx vitest run tests/integration/supabase-event-repository.int.test.ts` (Orchestrator, 23.11.2026) | 0 → 2 | 2 → 0 | 0 | 1. Lauf: 2/2 rot (**BUG-01**, PostgREST `PGRST201`); nach Behebung 2/2 grün |
| Akzeptanz Mobile Chrome | `npx playwright test --reporter=list` | 51 | 0 | 0 | |
| Akzeptanz Desktop Chrome | (derselbe Lauf) | 51 | 0 | 0 | gesamt **102 passed (59,1 s)** |
| Typprüfung | `npx tsc --noEmit` | – | 0 Fehler | – | Exit 0 |
| Lint | `npx eslint src e2e tests` | – | 0 Befunde | – | Exit 0, Inline-Abschaltungen gesperrt (`noInlineConfig`) |
| Manuell/explorativ (Supabase-Modus) | TC-M-01 … TC-M-10 | 10 | 0 | 0 | funktional alle bestanden; Befunde BUG-02 (Text), BUG-03 (Testdaten sichtbar) |

#### Ablauf Playwright (ehrlich festgehalten)
1. 13:13 im Projektordner: **kein Testergebnis**, Abbruch vor dem ersten Test: „Another next dev server is already running“
   (Dev-Server des parallel arbeitenden Coders, Port 3020). Next.js 16 erlaubt je Ordner nur einen Dev-Server; der fremde Server
   wurde nicht beendet. Kein Testfehler.
2. 13:14–13:15 auf einer sauberen Kopie von `9f79927` im Scratch-Verzeichnis (`git archive HEAD`, `npm ci` exit 0): 102/102 bestanden.
   Der neue, noch nicht committete Test `F-12 AK2 (FB-45)` war daher nicht enthalten.

### Coverage erster Lauf (`npx vitest run --coverage`, 13:13, Messbereich `src/lib/**`)

| Bereich | Anweisungen | Zweige | Funktionen | Zeilen |
| --- | ---: | ---: | ---: | ---: |
| **gesamt = `src/lib`** | 87,07 % (411/472) | 84,01 % (289/344) | 92,22 % (166/180) | 87,59 % (332/379) |
| `src/lib/events` | 100 % | 99,32 % | 100 % | 100 % |
| `src/lib/data` | 77,15 % | 70,96 % | 85,41 % | 77,83 % |
| `src/lib/auth` | 100 % (ausführbarer Code) | 100 % | 100 % | 100 % |

Auffällige Dateien (Zeilen / Zweige): `supabase-event-repository.ts` 38,3 % / 32,4 % · `supabase-auth-gateway.ts` 51,7 % / 17,9 % ·
`supabase-client.ts` 75 % / 90 % · `data-services.ts` 81,8 % / 71,4 %. Diese Teile sind nur durch die Supabase-Integrationstests
gedeckt, die im Standardlauf übersprungen werden (REV-02). Reine Typdateien (`auth-user.ts`, `auth-gateway.ts`, `event-repository.ts`)
enthalten keinen ausführbaren Code und erscheinen mit 0 %. Die Oberfläche (`src/components`, `src/app`) liegt außerhalb des Messbereichs.

## Gefundene Fehler (Stand Endlauf)

| ID | Kurzbeschreibung | Gefunden durch | Schweregrad | Status |
| --- | --- | --- | --- | --- |
| BUG-01 | Supabase-Modus lud keine Treffen (`PGRST201`, mehrdeutige Einbettung `profiles`) | Supabase-Integrationstest | kritisch (Kernablauf) | behoben, 2/2 grün |
| BUG-02 | Toast nach Beitritt „Du bist angemeldet“ mehrdeutig | TC-M-03 | Hinweis / niedrig | behoben `49eb701` + `6b9a4d9` |
| BUG-03 | Integrationstest hinterlässt sichtbare „Integrationstest Treffen“ in der echten DB | TC-M-01 | wichtig / mittel | behoben `d5d8a62`, live verifiziert |
| BUG-04 | Treffen > 12 h: lokal angenommen, im Supabase-Modus mit falscher Meldung „Das Ende muss nach dem Beginn liegen.“ abgelehnt | Code-Review REV-01 | mittel | behoben `ded1894`, durch Unit-Tests belegt |

Details: `docs/testing/fehlerprotokoll.md`.

## Review-Ergebnis (Zusammenfassung)
Stand Endlauf: 10 von 15 Befunden behoben (mit Commit), 5 offen (REV-02, REV-09, REV-10, REV-13, REV-14); Einzelheiten im Review-Protokoll, Abschnitt „Nachprüfung Endstand“.

Ursprüngliches Ergebnis:
Review des Commits `9f79927` nach `docs/review-leitfaden.md`, Protokoll `docs/testing/review-protokoll.md`:
0 blockierend, 6 wichtig, 9 Hinweise. Sicherheitsmodell schlüssig (RLS auf allen Tabellen, Schreiben nur per RPC mit
`security definer` + `search_path = ''` + `auth.uid()`, Überbuchungsschutz per Zeilensperre und Check-Constraint, keine Typ-Umgehungen,
Abhängigkeitsrichtung eingehalten). Wichtige Befunde: fehlende 12-h-Regel in der Kernlogik (REV-01/BUG-04), geringe Standard-Coverage
des Supabase-Datenzugriffs (REV-02), Testdaten in der echten DB (REV-03/BUG-03), doppelte Tageslogik in der Oberfläche (REV-04),
fehlende Fokusfalle im Bestätigungsdialog (REV-05), harte Farbwerte statt Tokens (REV-07).
Menschliches Review der Migration und der Auth-/Repository-Dateien steht aus.

## SE-Eval-Kennzahlen (erste Messung)
Quelle: `evaluation/results/bericht.md`, erzeugt 23.11.2026 12:41, gemessener Commit `8e4f171` (Stand **vor** den UI-Stories; die Zahlen
beschreiben nicht den hier getesteten Commit).

| Kennzahl | Wert |
| --- | --- |
| Codezeilen App (SLOC) | 814 |
| Kognitive Komplexität Median / P90 / Funktionen > 15 | 1 / 3 / 0 |
| tsc-strict-Fehler je KLOC / Typ-Umgehungen je KLOC / duplizierte Zeilen | 0 / 0 / 0 % |
| ESLint-Befunde je KLOC (neutrale Konfiguration) | 18,43 |
| Testfälle Unit / Integration / E2E (gezählt) | 97 / 1 / 1 |
| Anteil Testcode | 39,21 % |
| Line / Branch Coverage | 92,71 % / 97,26 % |
| Fehlgeschlagene Tests 1. Lauf / instabile Tests | 0 / 0 |
| Mutation Score gesamt (767 Mutanten, 59 getötet, 696 überlebt) | 7,69 % – **nicht verwertbar** (siehe Grenzen) |

## Bekannte Grenzen
- **Mutation Score:** 7,69 % bei 100 % Zeilen-Coverage in `src/lib/events` und exakten Orakeln ist nicht plausibel; sehr wahrscheinlich
  ein Messfehler der Stryker-Vitest-Kopplung (perTest-Coverage) unter Windows, Ursache nicht abschließend geklärt. Keine Aussage über
  Testwirksamkeit daraus ableiten; Wiederholung unter Linux/CI offen.
- **Kein Lasttest, kein automatischer Paralleltest** auf den letzten Platz; Schutz durch Zeilensperre `select … for update` und
  Check-Constraint, geprüft im Review; sequenzieller Vollstand getestet (TC-I-08, TC-M-06).
- **Supabase-Integration nicht in CI** und im Standardlauf übersprungen (REV-02).
- **E2E nur lokaler Modus, Offline-Karte, nur Chromium.** Supabase-Modus und Online-Karte nur manuell (TC-M-01 … TC-M-03).
- **Barrierefreiheit** nur über Rollen/Beschriftungen und Review, kein axe-Audit, kein Screenreader-Test.
- **Kein realer Nutzertest bis P6.**
- BUG-04 wurde aus dem Code abgeleitet; der Nachweis der Behebung erfolgt über Unit-Tests der Kernlogik, nicht über einen Supabase-E2E-Lauf.
- Supabase-Integrationslauf (285/285) vom Orchestrator übernommen, in diesem Endlauf nicht selbst wiederholt (keine `.env`-Zugriffe für Agenten).
