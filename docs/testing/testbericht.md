# Testbericht SportMate – Stand Präsentation 5

| | |
| --- | --- |
| Datum / Uhrzeit | 23.11.2026, 13:13–13:17 (automatische Läufe); manuelle Tests und Supabase-Integration am 23.11.2026 durch den Orchestrator |
| Commit | `9f79927` (Branch `develop`) |
| Arbeitsstand | Vitest, tsc und ESLint liefen im Projektordner über `9f79927` **plus** nicht committete Änderungen des Coders (`src/lib/events/event-presentation.ts`, `event-presentation.test.ts`, `event-card.test.tsx`, `e2e/f-12-details.spec.ts`). Playwright lief auf einer sauberen Kopie genau dieses Commits (`git archive HEAD`, `npm ci`), siehe „Ablauf“. |
| Umgebung | Windows 11 Pro (10.0.26200), Node.js v22.22.3, Vitest 5 mit `@vitest/coverage-v8`, Playwright 1.65.1 mit Chromium (Projekte „Mobile Chrome“ = Pixel 7, „Desktop Chrome“), Next.js 16.4.6 Dev-Server Port 3010, lokaler Modus, Offline-Karte, `de-DE`, `Europe/Berlin` |
| Durchgeführt von | tester/reviewer (Agent); manuelle Fälle: Orchestrator |
| Testfälle | Katalog `docs/testing/testfaelle.md` |

## Ergebnis je Ebene

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

### Ablauf Playwright (ehrlich festgehalten)
1. 13:13 im Projektordner: **kein Testergebnis**, Abbruch vor dem ersten Test: „Another next dev server is already running“
   (Dev-Server des parallel arbeitenden Coders, Port 3020). Next.js 16 erlaubt je Ordner nur einen Dev-Server; der fremde Server
   wurde nicht beendet. Kein Testfehler.
2. 13:14–13:15 auf einer sauberen Kopie von `9f79927` im Scratch-Verzeichnis (`git archive HEAD`, `npm ci` exit 0): 102/102 bestanden.
   Der neue, noch nicht committete Test `F-12 AK2 (FB-45)` war daher nicht enthalten.

## Coverage (`npx vitest run --coverage`, 13:13, Messbereich `src/lib/**`)

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

## Gefundene Fehler

| ID | Kurzbeschreibung | Gefunden durch | Schweregrad | Status |
| --- | --- | --- | --- | --- |
| BUG-01 | Supabase-Modus lud keine Treffen (`PGRST201`, mehrdeutige Einbettung `profiles`) | Supabase-Integrationstest | kritisch (Kernablauf) | behoben, 2/2 grün |
| BUG-02 | Toast nach Beitritt „Du bist angemeldet“ mehrdeutig | TC-M-03 | Hinweis / niedrig | in Bearbeitung (Coder) |
| BUG-03 | Integrationstest hinterlässt sichtbare „Integrationstest Treffen“ in der echten DB | TC-M-01 | wichtig / mittel | Altdaten gelöscht, Aufräumen im Test in Bearbeitung |
| BUG-04 | Treffen > 12 h: lokal angenommen, im Supabase-Modus mit falscher Meldung „Das Ende muss nach dem Beginn liegen.“ abgelehnt | Code-Review REV-01 (noch nicht durch Test belegt) | mittel | offen |

Details: `docs/testing/fehlerprotokoll.md`.

## Review-Ergebnis (Zusammenfassung)
Review des Commits `9f79927` nach `docs/review-leitfaden.md`, Protokoll `docs/testing/review-protokoll.md`:
0 blockierend, 6 wichtig, 9 Hinweise. Sicherheitsmodell schlüssig (RLS auf allen Tabellen, Schreiben nur per RPC mit
`security definer` + `search_path = ''` + `auth.uid()`, Überbuchungsschutz per Zeilensperre und Check-Constraint, keine Typ-Umgehungen,
Abhängigkeitsrichtung eingehalten). Wichtige Befunde: fehlende 12-h-Regel in der Kernlogik (REV-01/BUG-04), geringe Standard-Coverage
des Supabase-Datenzugriffs (REV-02), Testdaten in der echten DB (REV-03/BUG-03), doppelte Tageslogik in der Oberfläche (REV-04),
fehlende Fokusfalle im Bestätigungsdialog (REV-05), harte Farbwerte statt Tokens (REV-07).
Menschliches Review der Migration und der Auth-/Repository-Dateien steht aus.

## SE-Eval-Kennzahlen
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
- **Supabase-Integration nicht in CI** und im Standardlauf übersprungen; Ergebnis hier vom Orchestrator übernommen, nicht in diesem Lauf wiederholt.
- **E2E nur lokaler Modus, Offline-Karte, nur Chromium.** Supabase-Modus und Online-Karte nur manuell (TC-M-01 … TC-M-03).
- **Barrierefreiheit** nur über Rollen/Beschriftungen und Review, kein axe-Audit, kein Screenreader-Test.
- **Kein realer Nutzertest bis P6.**
- BUG-04 ist aus dem Code abgeleitet, nicht durch einen ausgeführten Test reproduziert.
