# Teststrategie SportMate

Was auf welcher Ebene getestet wird, mit welchen Werkzeugen und Daten, wie Tests heißen, wann eine Story als getestet gilt,
wo Ergebnisse stehen und wie Fehler verfolgt werden. Stand: 23.11.2026 (Präsentation 5 „Qualität & Tests“).

Zugehörige Dokumente: Testfallkatalog `docs/testing/testfaelle.md` · Testbericht `docs/testing/testbericht.md` ·
Fehlerprotokoll `docs/testing/fehlerprotokoll.md` · Review-Protokoll `docs/testing/review-protokoll.md` ·
Review-Leitfaden `docs/review-leitfaden.md`.

## 1. Testebenen

| Ebene | ID im Katalog | Was wird geprüft | Wo | Werkzeug / Umgebung | Läuft wann |
| --- | --- | --- | --- | --- | --- |
| Unit | TC-U-xx | eine Funktion der Kernlogik ohne Oberfläche, Netz und Uhr: Validierung, Suche/Filter, Teilnahmeregeln, Anzeigetexte, Fehlerübersetzung, Zeilen-Abbildung, lokaler Datenzugriff | `src/lib/**/*.test.ts` neben der Datei | Vitest, Umgebung `node` | `make test`, `make check`, CI |
| Komponente | TC-K-xx | eine React-Komponente oder reine UI-Hilfsfunktion: Beschriftung, Zustände, Ereignisse, Feldfehler mit `aria-invalid` | `src/components/**/*.test.ts(x)` | Vitest + Testing Library, Kopfkommentar `@vitest-environment jsdom` | `make test`, `make check`, CI |
| Integration | TC-I-xx | Zusammenspiel mehrerer Bausteine: Anmeldung + Repository + Sitzung im lokalen Modus; Supabase-Repository gegen die **echte Datenbank** (RLS, RPC, Trigger, Überbuchungsschutz) | `tests/integration/*.int.test.ts` | Vitest; Supabase-Tests nur mit `SUPABASE_INTEGRATION=1` und gesetzten `NEXT_PUBLIC_SUPABASE_*`, sonst `skipIf` (übersprungen, nicht rot) | lokal: `make test`; Supabase: von Hand vor Änderungen an Schema, RPC oder Datenzugriff |
| Akzeptanz (E2E) | TC-A-xx | ein Akzeptanzkriterium als Nutzerweg durch die laufende App | `e2e/*.spec.ts`, gemeinsame Schritte in `e2e/support.ts` | Playwright 1.65, Projekte „Mobile Chrome“ (Pixel 7) und „Desktop Chrome“; Dev-Server Port 3010 im **lokalen Modus** (Supabase-Variablen leer) mit **Offline-Karte** (`NEXT_PUBLIC_MAP_MODE=offline`), `locale de-DE`, `timezoneId Europe/Berlin` | `make e2e`, vor jedem Merge |
| Manuell / explorativ | TC-M-xx | was automatisch nicht sinnvoll oder noch nicht prüfbar ist: Supabase-Modus im Browser, Smoke-Test der RPCs, Darstellung | Katalog `docs/testing/testfaelle.md`, Ergebnis im Testbericht | Browser (mobil 375×812), Skript gegen die DB | vor Präsentationen, nach Schemaänderungen |
| Nutzertest | – | echte Personen lösen Aufgaben | `docs/feedback/roh/`, Register `docs/feedback.md` | Aufgabenliste, SUS | ab P6 (siehe Grenzen) |

Warum diese Verteilung: Die Fachregeln liegen rein in `src/lib/events` (ADR-0003) und sind deshalb billig und
vollständig auf Unit-Ebene prüfbar; dort misst SE-Eval auch die Mutation. Die Oberfläche wird über wenige
Komponententests und vor allem über Akzeptanztests je Akzeptanzkriterium geprüft. Was nur die Datenbank leisten
kann (RLS, Zeilensperre, Constraints), prüfen ausschließlich die Supabase-Integrationstests – ein gemockter Client
hätte BUG-01 nicht gefunden.

## 2. Befehle

| Zweck | Befehl |
| --- | --- |
| Unit + Komponente + lokale Integration | `make test` (= `npx vitest run`) |
| mit Coverage (nur `src/lib/**`) | `make coverage` (= `npx vitest run --coverage`) |
| Supabase-Integration gegen echte DB | `SUPABASE_INTEGRATION=1 npx vitest run tests/integration/supabase-event-repository.int.test.ts` (Variablen aus der eigenen Umgebung; `.env` lesen Agenten nicht) |
| Akzeptanz (beide Projekte) | `make e2e` (= `npx playwright test`); einzeln: `npx playwright test --project="Mobile Chrome"` |
| Typen, Lint | `npx tsc --noEmit`, `npx eslint src e2e tests` (`make check` = lint + typecheck + test) |
| Nachvollziehbarkeit AK → Test | `make trace` |

Hinweis: Next.js 16 erlaubt je Projektordner nur einen Dev-Server. Läuft bereits `npm run dev` (anderer Port),
startet Playwright seinen Server nicht („Another next dev server is already running“). Dann den eigenen Server
beenden oder den Lauf auf einer sauberen Kopie des Commits ausführen (so im Testbericht vom 23.11.2026).

## 3. Testdaten und Fixtures

| Quelle | Inhalt | Genutzt von |
| --- | --- | --- |
| `src/lib/events/demo-events.ts`, `demo-people.ts` | Demotreffen **relativ zu „jetzt“** (heute/morgen, Berliner Zeit), darunter ein ausgebuchtes (`Volleyball an der Hafenspitze`), ein abgesagtes (`Beachvolleyball am Ostseebad`), eines ohne Altersgruppe, eines mit Kosten (`Badminton zu zweit`, 3,50 €); Demopersonen Lea, Tom usw. ohne E-Mail | lokaler Modus, alle Akzeptanztests, Unit-Tests |
| `tests/fixtures/sample-events.ts` | gültige `EventInput` (`validInput`) und Beispieltreffen | Unit- und Integrationstests |
| `src/components/test-support/sample-viewer-event.ts` | Treffen aus Sicht einer Person (Teilnahme/Organisation) | Komponententests |
| feste Zeitpunkte im Test | z. B. `jetzt = 2026-10-26 08:00` inkl. Zeitumstellung 25.10./29.03. | `event-search`, `demo-events`, `event-presentation` |
| Wegwerf-Konten `*@sportmate-test.de` | zwei Konten je Lauf, zufälliges Passwort zur Laufzeit | Supabase-Integrationstests (Aufräumen offen: BUG-03) |

Regeln: Keine echten personenbezogenen Daten, keine Passwörter im Code. Akzeptanztests starten jede Seite frisch
(Treffen liegen im lokalen Modus nur im Arbeitsspeicher, F-32 AK3) und hängen nicht voneinander ab.

## 4. Testfälle und Orakel

- **Name:** Jeder Test nennt das Akzeptanzkriterium: `F-XX AKn: <was geprüft wird>`, z. B.
  `F-22 AK2: lehnt Beitritt bei vollem Treffen ab`. Mehrere Kriterien: `F-12 AK1/AK3`. Feedback-Bezug in Klammern: `F-12 AK2 (FB-45)`.
- **Orakel sichtbar im Test:** Eingabe und erwartetes Ergebnis stehen im Testrumpf (z. B. `5 von 10 Plätzen frei`,
  Fehlermeldung wörtlich, `aria-invalid="true"`, URL `/anmelden?weiter=%2Ferstellen`). Hilfsfunktionen in `e2e/support.ts`
  bedienen nur, sie prüfen kein Ergebnis.
- **Gutfall + Fehlerfälle + Randwerte:** je Kriterium mindestens ein Gutfall; Randwerte (Minimum, Maximum, eins darüber/darunter,
  leer, nur Leerzeichen) als eigene, meist tabellarische Fälle (`it.each`), z. B. Kapazität 1/2/50/51.
- **Wiederholbar:** keine Abhängigkeit von Reihenfolge, echter Uhrzeit, Zufall oder Netz. Zeit wird übergeben (`now`),
  E2E läuft mit fester Zeitzone und Offline-Karte. Ausnahme mit Absicht: Supabase-Integration (echtes Netz, eigene Freigabe).
- **Fehler zuerst als Test:** Ein gefundener Fehler bekommt zuerst einen Test, der ihn zeigt (rot), dann die Behebung.
- Kein `skip`/`todo`/`only` außer dem bedingten `describe.skipIf(!enabled)` der Supabase-Tests.

## 5. Eintritts- und Austrittskriterien

| | Kriterium |
| --- | --- |
| Eintritt Testentwurf (tester) | Spec freigegeben, AK eindeutig mit Ebene; Testdaten vorhanden |
| Eintritt Umsetzung (coder) | neue Tests committet und **aus dem richtigen Grund** rot, alte grün |
| Austritt Story („getestet“) | `make check` grün (Lint, Typen, Unit/Komponente/Integration); `make e2e` grün in beiden Projekten; jedes AK hat einen Test auf der festgelegten Ebene; Coverage der geänderten `src/lib`-Dateien genannt, Ziel ≥ 80 % Zeilen; kein offener Befund „blockierend“ im Review |
| Zusätzlich bei Schema/RPC/Datenzugriff | Supabase-Integrationstests gegen echte DB grün, Ergebnis im Testbericht; Mensch hat Migration gelesen |
| Austritt Release (Präsentation) | Testbericht mit echtem Lauf, alle BUG-xx mit Schweregrad kritisch/hoch behoben oder begründet zurückgestellt |

## 6. Ergebnisse und Fehlerverfolgung

| Was | Wo |
| --- | --- |
| Lauf mit Datum, Commit, Umgebung, Zahlen je Ebene, Coverage | `docs/testing/testbericht.md` |
| Testfallkatalog (ID, AK, Vorbedingung, Eingabe, Orakel, Datei:Test) | `docs/testing/testfaelle.md` |
| Review-Befunde `REV-xx` | `docs/testing/review-protokoll.md`, je Story zusätzlich `specs/F-XX/review.md` |
| Fehler `BUG-xx` | `docs/testing/fehlerprotokoll.md` |
| CI je Pull Request | CI-Lauf am Pull Request |
| Qualität über die Zeit | SE-Eval-Bericht (`evaluation/results/bericht.md`) |

Ablauf eines Fehlers: (1) Eintrag `BUG-xx` im Fehlerprotokoll mit Datum, Fundquelle, Beschreibung (Schritte, erwartet, tatsächlich),
Ursache, Schweregrad, Status `offen`. (2) Test, der den Fehler zeigt. (3) Behebung im Commit mit Feature-ID und `BUG-xx`.
(4) Status `behoben` mit Nachweis (welcher Test grün). (5) Ursache und Regel in `docs/learnings.md`.

Schweregrade für Fehler: **kritisch** (Datenverlust, Sicherheit, Kernablauf nicht nutzbar) · **hoch** (Funktion falsch, kein Umweg) ·
**mittel** (Funktion falsch, Umweg möglich) · **niedrig** (Darstellung, Text). Review-Befunde nutzen die Grade aus `docs/review-leitfaden.md`.

## 7. Messung mit SE-Eval

SE-Eval misst von außen ohne KI (Ablauf `docs/se-eval.md`). Letzte Messung: 23.11.2026, Commit `8e4f171` (vor den UI-Stories):

| Kennzahl | Wert |
| --- | --- |
| Kognitive Komplexität Median / P90 / Funktionen > 15 | 1 / 3 / 0 |
| tsc-strict-Fehler, Typ-Umgehungen, duplizierte Zeilen | 0 / 0 / 0 % |
| ESLint-Befunde je KLOC (neutrale Konfiguration) | 18,43 |
| Testfälle Unit / Integration / E2E (gezählt) | 97 / 1 / 1 |
| Line / Branch Coverage | 92,71 % / 97,26 % |
| Fehlgeschlagene / instabile Tests | 0 / 0 |
| Mutation Score (767 Mutanten) | 7,69 % – **nicht verwertbar**, siehe Grenzen |

## 8. Grenzen (bewusst nicht oder nicht automatisch getestet)

- **Mutation Score unter Windows:** Der Wert 7,69 % (696 von 767 Mutanten „überlebt“, Lauf 46 s) widerspricht 100 % Zeilen-Coverage
  in `src/lib/events` mit exakten Orakeln. Sehr wahrscheinlich ein Messfehler der Stryker-Vitest-Kopplung (perTest-Coverage) unter
  Windows; die Ursache ist nicht abschließend geklärt. Der Wert wird nicht als Aussage über die Testwirksamkeit verwendet.
  Wiederholung unter Linux/CI: offen.
- **Kein Last- oder Performancetest.** Erwartete Nutzerzahl im Kurs ist klein; Supabase-Grenzen im kostenlosen Tarif nicht gemessen.
- **Kein automatischer Paralleltest auf den letzten Platz.** Gleichzeitige Beitritte lassen sich mit Vitest nicht zuverlässig
  erzwingen. Stattdessen: Zeilensperre `select … for update` in `join_event` plus Check-Constraint `events_not_overbooked`
  (zweites Netz), per Code-Review geprüft (`docs/testing/review-protokoll.md`); sequenzieller Vollstand ist getestet (TC-I-08, TC-M-06).
- **Supabase-Integration nicht in CI:** braucht echte Zugangsdaten; läuft von Hand. Ohne Variablen werden die 2 Fälle übersprungen.
- **E2E nur im lokalen Modus und mit Offline-Karte;** Supabase-Modus und Online-Vektorkarte sind manuell geprüft (TC-M-01).
- **Nur Chromium** (Mobile Chrome, Desktop Chrome); Safari/Firefox nicht automatisch.
- **Barrierefreiheit** nur über Rollen/Beschriftungen in den Tests und Review; kein automatischer Audit (axe), kein Screenreader-Test.
- **Kein realer Nutzertest bis P6.** Akzeptanztests prüfen die Spezifikation, nicht die Brauchbarkeit für echte Personen.

## Grundlage
Testebenen und Orakel-Begriff nach ISTQB-Lehrplan Foundation Level (Version und Seitenangabe vom Team zu belegen).
