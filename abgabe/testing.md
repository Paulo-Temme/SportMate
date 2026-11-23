# SportMate – Testen und Qualitätssicherung

| | |
| --- | --- |
| Projekt | SportMate – Hochschul-Softwareprojekt, Wintersemester 2026/27 |
| Team | Julien, Renat, Paulo, Niklas |
| Hauptverantwortlich | Niklas (Rolle „Management und Qualitätssicherung“ laut Präsentation 1 vom 30.09.2026; vom Team zu bestätigen) |
| Autorinnen und Autoren mit Anteil in % | |
| Stand | Entwurf vom 23.11.2026 (Präsentation 5 „Qualität & Tests“), zusammengestellt von der Agentenrolle reporter; Zahlen aus dem Endlauf vom 23.11.2026, Commit `004a9fa` |
| Repository | <https://github.com/Paulo-Temme/SportMate> (Branch `develop`); Testcode in `src/**/*.test.ts(x)`, `tests/`, `e2e/` |
| Live-App | <https://sportmate-gamma.vercel.app> |

<div class="pagebreak"></div>

## Inhalt

1. Teststrategie: Ebenen, Werkzeuge, Regeln
2. Testfälle je Ebene
3. Manuelle Testfälle und Ergebnisse
4. Ausführung, Ergebnis des letzten Laufs, Coverage
5. Leitfaden für Reviews und Inspektionen
6. Ergebnisse der Reviews
7. Gefundene Fehler
8. Nutzertests mit echten Personen
9. Qualität über die Zeit (SE-Eval)
10. Grenzen
11. Lücken

Abkürzungen: **E2E** = End-to-End-Test durch die laufende App · **AK** = Akzeptanzkriterium · **TC** = Testfall
(TC-U Unit, TC-K Komponente, TC-I Integration, TC-A Akzeptanz, TC-M manuell) · **REV** = Review-Befund · **BUG** = Fehler ·
**RLS** = Row Level Security · **RPC** = Postgres-Funktion · **SE-Eval** = externes Messwerkzeug für Softwarequalität.

## 1. Teststrategie: Ebenen, Werkzeuge, Regeln

Quelle: `docs/teststrategie.md` (Stand 23.11.2026).

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

### Testdaten

| Quelle | Inhalt | Genutzt von |
| --- | --- | --- |
| `src/lib/events/demo-events.ts`, `demo-people.ts` | Demotreffen **relativ zu „jetzt“** (heute/morgen, Berliner Zeit), darunter ein ausgebuchtes (`Volleyball an der Hafenspitze`), ein abgesagtes (`Beachvolleyball am Ostseebad`), eines ohne Altersgruppe, eines mit Kosten (`Badminton zu zweit`, 3,50 €); Demopersonen Lea, Tom usw. ohne E-Mail | lokaler Modus, alle Akzeptanztests, Unit-Tests |
| `tests/fixtures/sample-events.ts` | gültige `EventInput` (`validInput`) und Beispieltreffen | Unit- und Integrationstests |
| `src/components/test-support/sample-viewer-event.ts` | Treffen aus Sicht einer Person (Teilnahme/Organisation) | Komponententests |
| feste Zeitpunkte im Test | z. B. `jetzt = 2026-10-26 08:00` inkl. Zeitumstellung 25.10./29.03. | `event-search`, `demo-events`, `event-presentation` |
| Wegwerf-Konten `*@sportmate-test.de` | zwei Konten je Lauf, zufälliges Passwort zur Laufzeit | Supabase-Integrationstests (jedes angelegte Treffen wird nach jedem Test abgesagt, BUG-03 behoben; Konten bleiben) |

Regeln: Keine echten personenbezogenen Daten, keine Passwörter im Code. Akzeptanztests starten jede Seite frisch
(Treffen liegen im lokalen Modus nur im Arbeitsspeicher, F-32 AK3) und hängen nicht voneinander ab.

### Regeln für Testfälle

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

### Eintritts- und Austrittskriterien

| | Kriterium |
| --- | --- |
| Eintritt Testentwurf (tester) | Spec freigegeben, AK eindeutig mit Ebene; Testdaten vorhanden |
| Eintritt Umsetzung (coder) | neue Tests committet und **aus dem richtigen Grund** rot, alte grün |
| Austritt Story („getestet“) | `make check` grün (Lint, Typen, Unit/Komponente/Integration); `make e2e` grün in beiden Projekten; jedes AK hat einen Test auf der festgelegten Ebene; Coverage der geänderten `src/lib`-Dateien genannt, Ziel ≥ 80 % Zeilen; kein offener Befund „blockierend“ im Review |
| Zusätzlich bei Schema/RPC/Datenzugriff | Supabase-Integrationstests gegen echte DB grün, Ergebnis im Testbericht; Mensch hat Migration gelesen |
| Austritt Release (Präsentation) | Testbericht mit echtem Lauf, alle BUG-xx mit Schweregrad kritisch/hoch behoben oder begründet zurückgestellt |

## 2. Testfälle je Ebene

Quelle: Testfallkatalog `docs/testing/testfaelle.md` (Stand Endlauf 23.11.2026, Commit `004a9fa`). Jede Zeile nennt Story/AK,
Vorbedingung, Eingabe, erwartetes Ergebnis (Orakel, steht so im Test) und die Fundstelle.

| Ebene | IDs | Anzahl Testfälle (automatisch) | davon im Katalog einzeln |
| --- | --- | --- | --- |
| Unit (`src/lib`) | TC-U-01 … TC-U-37 | 243 in 20 Dateien | 37 (repräsentativ) |
| Unit/Komponente (`src/components`) | TC-K-01 … TC-K-21 | 34 in 6 Dateien (21 Komponententests in jsdom, 13 Unit-Tests reiner Hilfsfunktionen) | 21 (repräsentativ) |
| Integration (`tests/integration`) | TC-I-01 … TC-I-08 | 8 in 3 Dateien (2 davon nur gegen echte DB) | 8 (vollständig) |
| Akzeptanz / E2E (`e2e`) | TC-A-01 … TC-A-59 | 59 Tests × 2 Projekte = 118 Läufe (1 davon gewollt übersprungen) | 59 (vollständig) |
| Manuell / explorativ | TC-M-01 … TC-M-10 | – | 10 |

Vitest gesamt: 243 + 34 + 8 = 285 Fälle in 29 Dateien; im Standardlauf 283 bestanden, 2 übersprungen (Supabase ohne
`SUPABASE_INTEGRATION=1`); mit echter DB 285/285 (Orchestrator, 23.11.2026). Hinweis: `sheet-snap.test.ts` und `map-theme.test.ts`
liegen seit `ebe3eb4` unter `src/lib/ui` bzw. `src/lib/map` und zählen jetzt zu `src/lib` (im ersten Katalog unter Komponente).

### 2.1 Unit-Tests: Anzahl je Datei

| Datei | Tests | Gegenstand |
| --- | ---: | --- |
| `src/lib/events/event-creation.test.ts` | 48 | Erstellen, Feldvalidierung, Randwerte, Höchstdauer 12 h (BUG-04) |
| `src/lib/data/supabase-error-translation.test.ts` | 33 | Datenbank- und Auth-Codes → deutsche Meldungen |
| `src/lib/events/event-presentation.test.ts` | 30 | Plätze, Status, Alter, Kosten, Termin mit Dauer, Heute/Morgen |
| `src/lib/events/demo-events.test.ts` | 14 | Demodaten relativ zu „jetzt“, Zeitumstellung |
| `src/lib/auth/credential-validation.test.ts` | 13 | Registrierungseingaben |
| `src/lib/map/marker-grouping.test.ts` | 12 | Marker-Gruppen ohne Überlappung, Auffächern, Offline-Projektion |
| `src/lib/data/supabase-gateways.test.ts` | 12 | Supabase-Gateways mit gemocktem Client, Abbestellen (REV-12) |
| `src/lib/events/event-search.test.ts` | 11 | Suche, Filter, Zeitraum, Berliner Kalendertag |
| `src/lib/events/participation.test.ts` | 11 | Teilnehmen, Verlassen, Absagen, Vorabprüfung |
| `src/lib/data/local-auth-gateway.test.ts` | 11 | lokale Anmeldung |
| `src/lib/data/local-event-repository.test.ts` | 10 | lokaler Datenzugriff |
| `src/lib/data/data-services.test.ts` | 9 | Wahl lokal/Supabase |
| `src/lib/ui/sheet-snap.test.ts` | 7 | Rastpunkte des Bottom Sheets |
| `src/lib/data/local-session.test.ts` | 6 | geteilte Sitzung |
| `src/lib/data/event-row-mapping.test.ts` | 5 | Zeile ↔ Modell |
| `src/lib/ui/focus-trap.test.ts` | 3 | Fokusfalle für Dialoge (REV-05/06) |
| `src/lib/map/map-theme.test.ts` | 2 | Kartenfarben aus Tokens |
| `src/lib/events/failure-message.test.ts` | 2 | Fehlertexte nie roh |
| `src/lib/events/list-order.test.ts` | 2 | Ausgebuchte zuletzt |
| `src/lib/events/viewer-events.test.ts` | 2 | Aufteilung organisiert/dabei (F-24) |
| **Summe** | **243** | |

### 2.2 Unit-Tests (Auswahl)

| ID | Story/AK | Vorbedingung | Eingabe | Erwartetes Ergebnis (Orakel) | Datei › Test |
| --- | --- | --- | --- | --- | --- |
| TC-U-01 | F-00 AK1 / F-17 AK1 | gültiger `EventInput`, angemeldete Person | Treffen erstellen | Organisator zählt mit (Belegung 1), Zeit normalisiert | `event-creation.test.ts › F-00 AK1: zählt die organisierende Person automatisch mit und normalisiert die Zeit` |
| TC-U-02 | F-00 AK1 | Gast | Kennung `""` bzw. `"   "` | Fehler, kein Treffen | `event-creation.test.ts › F-00 AK1: verweigert das Erstellen für Gäste (Kennung "")` |
| TC-U-03 | F-17 AK4 | gültiger Entwurf | `capacity` 1, 51, 2.5 | Fehler mit Feld `capacity` | `event-creation.test.ts › F-00 AK1: weist ungültige Daten mit Feldangabe ab: {"capacity":51}` (u. a.) |
| TC-U-04 | F-17 AK4 | gültiger Entwurf | Randwerte `capacity` 2 und 50, Titel 3 und 80 Zeichen | akzeptiert | `event-creation.test.ts › F-00 AK1: akzeptiert Randwerte: {"capacity":50}` (u. a.) |
| TC-U-05 | F-13 | gültiger Entwurf | `costCents` −1, 5001, 1.5 | Fehler mit Feld `costCents` | `event-creation.test.ts › F-00 AK1: weist ungültige Daten mit Feldangabe ab: {"costCents":5001}` |
| TC-U-06 | F-25 AK3 | Kapazität 10 | Mindestzahl 11 | verständliche Feldmeldung „Mindestzahl darf die Plätze nicht übersteigen.“ | `event-creation.test.ts › F-25 AK3: meldet eine Mindestzahl über der Kapazität verständlich` |
| TC-U-07 | F-00 AK2 / F-22 AK2 | Treffen mit 1 freien Platz | Lea tritt bei, Lea erneut, dann Tom | Lea dabei; Wiederholung liefert dasselbe Objekt; Tom → „Leider gerade ausgebucht.“; Status „Ausgebucht“ | `participation.test.ts › F-00 AK2: verhindert Doppelteilnahme und Überbelegung, ohne die Eingabe zu ändern` |
| TC-U-08 | F-18 AK3 | Treffen von Alex | `cancelEvent` durch Lea; Alex verlässt | Fehler „Nur …“ bzw. „organisierende …“; Absage durch Alex → `cancelled`, idempotent | `participation.test.ts › F-00 AK2: prüft die Rechte der organisierenden Person unabhängig von der Oberfläche` |
| TC-U-09 | F-00 AK2 | jetzt = Beginn | beitreten, verlassen, absagen | jeweils Fehler „begonnen“ | `participation.test.ts › F-00 AK2: sperrt Änderungen ab Beginn des Treffens` |
| TC-U-10 | F-22 AK2 | 6 Treffen in je einem Sperrzustand | `checkJoinAvailability` | `{canJoin:false, reason, message}` je Fall, Eingabe unverändert | `participation.test.ts › F-22 AK2: nennt den Grund, warum Beitritt nicht geht (0…5)` |
| TC-U-11 | F-06 AK1 | 3 Treffen | Sportarten Fußball+Badminton; kombiniert mit Niveau | 2 Treffer (ODER); kombiniert nur `badminton` (UND) | `event-search.test.ts › F-00 AK3: verknüpft Sportarten per ODER und Filtergruppen per UND` |
| TC-U-12 | F-06 AK2/AK3 | jetzt fest (26.10.2026) | Zeitraum heute/morgen/Woche/Datum 2026-10-28 | 0 / 2 / 3 / `['badminton']` | `event-search.test.ts › F-00 AK3: filtert heute, morgen, Woche und konkretes Datum` |
| TC-U-13 | F-06 AK2 | Treffen Sonntag und Montag | Zeitraum „Woche“ | nur `sonntag` | `event-search.test.ts › F-00 AK3: Woche endet am Sonntag` |
| TC-U-14 | F-05 AK4 | Treffen hat begonnen | keine Filter | leere Liste | `event-search.test.ts › F-00 AK3: blendet begonnene Treffen aus` |
| TC-U-15 | F-05 | UTC-Grenzen | `2026-10-26T23:30:00Z`, `2026-07-01T22:30:00Z`, `…21:59:00Z` | `2026-10-27`, `2026-07-02`, `2026-07-01` | `event-search.test.ts › F-00 AK3: berechnet den Kalendertag in Europe/Berlin auch an UTC-Grenzen` |
| TC-U-16 | F-05 AK3 | Liste mit vollen und freien Treffen | Sortierung | nur volle ans Ende, relative Reihenfolge bleibt | `list-order.test.ts › F-00 AK5: verschiebt nur volle Treffen und lässt Quelle und relative Reihenfolge unverändert` |
| TC-U-17 | F-12 AK2 (FB-45) | Treffen ohne Altersgruppe | `describeAgeGroup('')` | „Alter: offen für alle“ | `event-presentation.test.ts › F-12 AK2 (FB-45): Treffen ohne Altersgrenze heißt "Alter: offen für alle"` |
| TC-U-18 | F-00 AK4 | unvollständige Daten, z. B. `{capacity:10}`, `{capacity:2,participantCount:"1"}` | `summarizePlaces` | keine erfundene Verfügbarkeit | `event-presentation.test.ts › F-00 AK4: erfindet keine Verfügbarkeit für unvollständige Daten` (12 Fälle) |
| TC-U-19 | F-13 AK2 | `costCents` 350 | `describeCost` | Betrag in Euro „pro Person“ | `event-presentation.test.ts › F-13 AK2: zeigt Kosten in Euro pro Person` |
| TC-U-20 | F-01 AK2 | Registrierung | Passwort `kurz12` | Fehler „Mindestens 8 Zeichen“ | `credential-validation.test.ts › F-01 AK2: lehnt Passwörter unter 8 Zeichen ab` |
| TC-U-21 | F-01 | Registrierung | E-Mail `""`, `lea`, `lea@`, `@example.org`, `lea example@org.de`, `lea@example` | jeweils abgelehnt | `credential-validation.test.ts › F-01: lehnt ungültige E-Mail ab (…)` (6 Fälle) |
| TC-U-22 | F-01 AK1 | leerer Speicher | Registrierung Lea | Speicher enthält E-Mail, aber nicht das Klartext-Passwort | `local-auth-gateway.test.ts › F-01 AK1: speichert das Passwort nur als Hash` |
| TC-U-23 | F-22 AK4 | DB-Fehler `EVENT_FULL` | `translateEventError` | `EventError` „Leider gerade ausgebucht.“ | `supabase-error-translation.test.ts › F-22 AK4: übersetzt EVENT_FULL` |
| TC-U-24 | F-17 AK4 | DB-Fehler `INVALID_INPUT`, detail `events_capacity_range` | `translateEventError` | Feldmeldung für `capacity` aus `event-validation` | `supabase-error-translation.test.ts › F-17 AK4: INVALID_INPUT mit events_capacity_range ergibt eine Feldmeldung` |
| TC-U-25 | F-22 | Supabase-Repository mit Mock-Client | `getEvent('demo-fussball')`, `joinEvent('kein-uuid')` | `null` bzw. „Dieses Treffen gibt es nicht.“, kein RPC-Aufruf | `supabase-gateways.test.ts › F-22: unbekannte Kennungen ohne UUID-Form gibt es nicht` |
| TC-U-26 | F-17 AK4 (BUG-04) | gültiger Entwurf | Dauer 12 h bzw. 12 h 1 min | 12 h akzeptiert; 12 h 1 min abgelehnt mit eigener Meldung zur Höchstdauer | `event-creation.test.ts › F-17 AK4: 12 Stunden sind erlaubt, 12 Stunden und 1 Minute nicht – mit eigener Meldung` |
| TC-U-27 | F-17 AK3/AK4 (BUG-04) | gültiger Entwurf | Ende vor Beginn | Meldung zur Reihenfolge, nicht zur Dauer | `event-creation.test.ts › F-17 AK4: Ende vor Beginn meldet weiterhin die Reihenfolge, nicht die Dauer` |
| TC-U-28 | F-17 AK4 (BUG-04) | DB-Fehler `INVALID_INPUT`, detail `events_max_duration` | `translateEventError` | Meldung zur Höchstdauer statt „Das Ende muss nach dem Beginn liegen.“ | `supabase-error-translation.test.ts › F-17 AK4 (BUG-04): events_max_duration ergibt die Meldung zur Höchstdauer, nicht die zur Reihenfolge` |
| TC-U-29 | F-12 AK1 | Beginn/Ende in Berliner Zeit | `formatEventSchedule` | Wochentag, Datum, Uhrzeit und Dauer, z. B. „… 17:00–19:00 Uhr · 2 Std.“; Minuten, „1 Std.“, Sommerzeit, über Mitternacht; ohne Dauer, wenn Ende ≤ Beginn; Fehler bei ungültigem Datum | `event-presentation.test.ts › F-12 AK1: zeigt Wochentag, Datum, Uhrzeit und Dauer in Stunden` (+ 4 weitere) |
| TC-U-30 | F-05 AK1 (REV-04) | festes „jetzt“ | `describeDayLabel` heute/morgen/später, Herbst- und Frühjahrsumstellung | „Heute“, „Morgen“, sonst kurzes Datum; über die Zeitumstellung richtig; Fehler bei ungültigem Datum | `event-presentation.test.ts › F-05 AK1: rechnet über die Zeitumstellung im Herbst und Frühjahr richtig` (+ 2 weitere) |
| TC-U-31 | F-08 AK5 | Marker mit Bildschirmfeldern | `groupOverlappingMarkers` | weit entfernte bleiben einzeln, überlappende werden Gruppe, Feldgrenze ist keine Überlappung, Gruppe im Mittel, wachsende Gruppe nimmt Nachzügler auf, Ergebnis ohne Überlappung, leere Eingabe → keine Gruppen | `marker-grouping.test.ts › F-08 AK5: im Ergebnis überlappt keine Gruppe eine andere` (+ 6 weitere) |
| TC-U-32 | F-08 AK6 | Gruppe mit verschiedenen bzw. gleichen Orten | `canSpreadGroup`, `findMarkerBounds` | verschiedene Orte auffächerbar, gleicher Ort nicht; Ausdehnung korrekt | `marker-grouping.test.ts › F-08 AK6: Gruppe mit verschiedenen Orten lässt sich auffächern, gleicher Ort nicht` (+ 1) |
| TC-U-33 | F-08 AK3 | Offline-Karte, Fläche fester Größe | `placeOnOfflinePlane` | Ecken/Mitte auf feste Anteile, Norden oben, skaliert mit Fläche, Einzelort mittig | `marker-grouping.test.ts › F-08 AK3: legt Ecken und Mitte auf feste Anteile der Fläche (Norden oben)` (+ 2) |
| TC-U-34 | F-24 AK1/AK3 | Treffen eigener, besuchter, fremder Art | `splitViewerEvents` | organisiert / dabei getrennt, fremde ignoriert; ohne eigene beide leer | `viewer-events.test.ts › F-24 AK1: trennt organisierte von besuchten Treffen und ignoriert fremde` |
| TC-U-35 | F-18 AK1 (REV-05) | Dialog mit fokussierbaren Elementen | `findTrapTarget`: Tab am letzten / Shift+Tab am ersten, Fokus außerhalb | springt zyklisch; Fokus wird hineingeholt; ohne Ziele bleibt er im Dialog | `focus-trap.test.ts › F-18 AK1: springt vom letzten zum ersten Element und rückwärts vom ersten zum letzten` (+ 2) |
| TC-U-36 | F-01 AK5 (REV-12) | Supabase-Auth-Gateway mit Mock | Listener abbestellen, bevor der geplante Rückruf läuft | Listener wird nicht mehr aufgerufen | `supabase-gateways.test.ts › F-01 AK5: nach dem Abbestellen erreicht ein schon geplanter Rückruf den Listener nicht mehr` |
| TC-U-37 | F-22 AK4 | Fach- bzw. technischer Fehler | `describeActionFailure` | Fachfehler behalten deutsche Meldung; Netz-/unbekannte Fehler zeigen nie die Rohmeldung | `failure-message.test.ts › F-22 AK4: technische Fehler (Netz, unbekannt) zeigen nie die Rohmeldung` |

### 2.3 Komponententests (Auswahl)

Anzahl je Datei: `event-draft.test.ts` 11 · `event-card.test.tsx` 8 · `filter-controls.test.tsx` 7 · `confirm-dialog.test.tsx` 3 ·
`step-fields.test.tsx` 3 · `return-path.test.ts` 2 = **34** (davon 21 Komponententests in jsdom).

| ID | Story/AK | Vorbedingung | Eingabe | Erwartetes Ergebnis (Orakel) | Datei › Test |
| --- | --- | --- | --- | --- | --- |
| TC-K-01 | F-05 AK2 | Treffen Kapazität 10, Belegung 5 | `EventCard` rendern | Text „5 von 10 Plätzen frei“ | `event-card.test.tsx › F-05 AK2: zeigt die freien Plätze als "5 von 10 Plätzen frei"` |
| TC-K-02 | F-12 AK2 | Altersgruppe „20–25“ | rendern | Altersangabe mit „Jahre“ | `event-card.test.tsx › F-12 AK2: beschriftet die Altersangabe eindeutig mit Jahren` |
| TC-K-03 | F-22 AK5 | freie Plätze | rendern | sichtbarer Button „Jetzt teilnehmen“ | `event-card.test.tsx › F-22 AK5: trägt bei freien Plätzen einen sichtbaren Button "Jetzt teilnehmen"` |
| TC-K-04 | F-22 AK2 | ausgebucht | rendern | „Ausgebucht“, kein Beitritt möglich | `event-card.test.tsx › F-22 AK2: ausgebuchtes Treffen zeigt "Ausgebucht" ohne Beitrittsmöglichkeit` |
| TC-K-05 | F-22 AK1 | Person nimmt teil | rendern | „Dabei“ statt Button | `event-card.test.tsx › F-22 AK1: wer schon teilnimmt, sieht "Dabei" statt des Buttons` |
| TC-K-06 | F-08 AK2 | Liste | Klick auf Karte | Auswahl-Callback mit dem Treffen | `event-card.test.tsx › F-08 AK2: Klick auf die Karte wählt das Treffen aus` |
| TC-K-07 | F-17 AK2 | Assistent Schritt 3 | Treffpunkt leer, Veröffentlichen | Feld `aria-invalid`, Meldung verknüpft | `step-fields.test.tsx › F-17 AK2: fehlender Treffpunkt markiert das Feld und verknüpft die Meldung` |
| TC-K-08 | F-17 AK4 | Schritt 3 | Kapazität 51 | Grenze am Feld „Plätze insgesamt“ | `step-fields.test.tsx › F-17 AK4: Kapazität 51 zeigt die Grenze am Feld "Plätze insgesamt"` |
| TC-K-09 | F-17 AK3 | Entwurf | Ende vor Beginn | Fehler in Schritt 2 | `event-draft.test.ts › findStepErrors F-17 AK3: Ende vor Beginn wird in Schritt 2 gemeldet` |
| TC-K-10 | F-17 AK1 | Entwurf | Datum, Uhrzeit, Zahlen, Kosten als Text | korrekter `EventInput` | `event-draft.test.ts › buildEventInput F-17 AK1: wandelt Datum, Uhrzeit, Zahlen und Kosten in die Eingabe der Kernlogik um` |
| TC-K-11 | F-06 AK1 | Filterleiste | Volleyball an, Laufen an, Volleyball aus | Filter `sports` entsprechend | `filter-controls.test.tsx › F-06 AK1: Sportarten lassen sich mehrfach wählen und wieder abwählen` |
| TC-K-12 | F-06 AK5 | gesetzte Filter | „Filter zurücksetzen“ | alle Filter leer | `filter-controls.test.tsx › F-06 AK5: "Filter zurücksetzen" leert alle Filter` |
| TC-K-13 | F-02 AK3 | Rücksprungziel | `weiter=/treffen/<id>` bzw. fremdes Ziel (z. B. andere Domain) | Rücksprung zu den Details bzw. Ersatzziel (kein offener Redirect) | `return-path.test.ts › F-02 AK3: lehnt fremde Ziele ab und nutzt das Ersatzziel` |
| TC-K-14 | F-05 AK1 | Sheet (jetzt `src/lib/ui`) | Tastatur Pfeil hoch/runter | ein Rastpunkt weiter | `sheet-snap.test.ts › stepSnapPoint F-05 AK1: Tastatur bewegt das Sheet um einen Rastpunkt` |
| TC-K-15 | F-08 AK1 | Positron-Stil (jetzt `src/lib/map`) | `buildMapTheme` | Wasser bläulich-grau, Grün blass, Straßen weiß (Token-Farben) | `map-theme.test.ts › F-08 AK1: Wasser bläulich-grau, Grünflächen blass, Straßen weiß` |
| TC-K-16 | F-18 AK1 (REV-05) | Bestätigungsdialog offen | Tab / Shift+Tab | Fokus bleibt im Dialog | `confirm-dialog.test.tsx › F-18 AK1 (REV-05): Tab und Shift+Tab bleiben im Dialog` |
| TC-K-17 | F-18 AK1 (REV-05) | Dialog über Auslöser geöffnet | Schließen | Fokus wieder auf dem Auslöser | `confirm-dialog.test.tsx › F-18 AK1 (REV-05): nach dem Schließen liegt der Fokus wieder auf dem Auslöser` |
| TC-K-18 | F-18 AK1 (REV-05) | Dialog, Aktion läuft bzw. nicht | Escape | bricht ab, außer während die Aktion läuft | `confirm-dialog.test.tsx › F-18 AK1 (REV-05): Escape bricht ab, außer während die Aktion läuft` |
| TC-K-19 | F-06 AK1 (REV-06) | Filterdialog offen | Tab am letzten Element | Fokus bleibt im Filterdialog | `filter-controls.test.tsx › F-06 AK1 (REV-06): Tab bleibt im Filterdialog` |
| TC-K-20 | F-12 AK2 (FB-45) | Treffen ohne Altersgruppe | `EventCard` rendern | „Alter: offen für alle“ | `event-card.test.tsx › F-12 AK2 (FB-45): ohne Altersgrenze steht "Alter: offen für alle"` |
| TC-K-21 | F-06 AK2/AK3 | Filterleiste | „Heute“, „Morgen“, „Diese Woche“; Datum wählen | Zeitraum-Filter entsprechend bzw. `date` mit diesem Tag | `filter-controls.test.tsx › F-06 AK2: Zeitraum "Heute", "Morgen" und "Diese Woche" setzen den Filter` (+ AK3) |

### 2.4 Integrationstests (vollständig)

| ID | Story/AK | Vorbedingung | Eingabe | Erwartetes Ergebnis (Orakel) | Datei › Test |
| --- | --- | --- | --- | --- | --- |
| TC-I-01 | F-02 AK2, F-01, F-22 | lokale Dienste, Gast, ≥ 6 Demotreffen | Gast tritt `demo-badminton-halle` bei; dann Registrierung „Lea Neu“ und Beitritt | Gast: Fehler „anmelden“, Belegung 1; danach Belegung 2, Teilnehmende `['Alex','Lea Neu']` | `local-auth-flow.int.test.ts › F-02 AK2: Gast stöbert, wird beim Mitmachen abgewiesen und kann nach der Registrierung beitreten` |
| TC-I-02 | F-22 AK2 | angemeldet, `demo-volleyball-hafen` voll (4/4) | beitreten | „Leider gerade ausgebucht.“, Belegung bleibt 4 | `local-auth-flow.int.test.ts › F-22 AK2: lehnt Beitritt bei vollem Treffen ab` |
| TC-I-03 | F-22 AK3 | angemeldet | zweimal `demo-laufen-volkspark` beitreten | Belegung 3 bleibt 3 | `local-auth-flow.int.test.ts › F-22 AK3: erneuter Beitritt ändert die Teilnehmerzahl nicht` |
| TC-I-04 | F-23 AK3 | Lea und Tom nehmen teil | Lea zieht zurück | Belegung 3, Tom bleibt Teilnehmer | `local-auth-flow.int.test.ts › F-23 AK3: Rückzug von lea lässt tom als Teilnehmer` |
| TC-I-05 | F-18 AK1 | eigenes Treffen mit Teilnehmenden | absagen, dann Beitritt versuchen | unter „Meine Treffen“ mit Status `cancelled`; Beitritt → „abgesagt“ | `local-auth-flow.int.test.ts › F-18 AK1: abgesagtes Treffen bleibt bei Teilnehmenden unter "Meine Treffen"` |
| TC-I-06 | F-22 AK1, F-23, F-18 | lokales Repository | erstellen → finden → beitreten → verlassen → absagen | jeder Schritt liefert den erwarteten Stand | `local-event-repository.int.test.ts › F-22 AK1: erstellen, finden, beitreten, verlassen und absagen greifen ineinander` |
| TC-I-07 | F-17 AK1, F-20, F-22 AK1/AK3, F-23 AK1, F-24 AK1, F-18 AK1–AK3 | **echte Supabase-DB**, `SUPABASE_INTEGRATION=1`; zwei Wegwerf-Konten | Organisator erstellt (Kapazität 2), Mitglied tritt zweimal bei, Gast liest, Liste der Namen, Meine Treffen, Rückzug, Absage durch Fremde per RPC **und** direktem `update`, Absage durch Organisator, Beitritt danach | Belegung 1 → 2 → 2; Gast sieht „voll“; Namen `['Test orga','Test mitglied']`, Gast `[]`; Rückzug → 1; Fremde: „Nur die organisierende Person darf das Treffen absagen.“, direktes Update wirkungslos (`published`); danach `cancelled`, Beitritt „Das Treffen ist abgesagt.“ | `supabase-event-repository.int.test.ts › F-22 AK1: Beitritt, Vollstand, Rückzug und Absage mit Rechteprüfung` |
| TC-I-08 | F-22 AK2 | echte DB, volles Treffen | dritter Beitritt | Ablehnung `EVENT_FULL` → „Leider gerade ausgebucht.“ | `supabase-event-repository.int.test.ts › F-22 AK2: lehnt Beitritt bei vollem Treffen ab (EVENT_FULL)` |

### 2.5 Akzeptanztests (vollständig)

Spalte „Vorbedingung“: „Entdecken“ = Startseite geöffnet, Erstbesuch-Hinweis geschlossen; „Lea/Tom“ = als Demo-Person angemeldet.

| ID | Story/AK | Vorbedingung | Eingabe | Erwartetes Ergebnis (Orakel) | Datei › Test |
| --- | --- | --- | --- | --- | --- |
| TC-A-01 | F-00 AK8 | – | `/` öffnen | Titel enthält „SportMate“, Navigation „Hauptnavigation“, Trefferzahl sichtbar | `smoke.spec.ts › F-00 AK8: Startseite lädt mit Titel und Hauptnavigation` |
| TC-A-02 | F-01 AK1 | `/anmelden`, Reiter Registrieren | Lea, `lea@example.org`, `sportmate1` | URL `/profil`, E-Mail sichtbar, Button „Abmelden“ | `f-01-anmeldung.spec.ts › F-01 AK1: Registrierung meldet an und zeigt "Abmelden"` |
| TC-A-03 | F-01 AK2 | Registrieren | Passwort `kurz12` | „Mindestens 8 Zeichen“, URL bleibt `/anmelden` | `f-01-anmeldung.spec.ts › F-01 AK2: zu kurzes Passwort legt kein Konto an` |
| TC-A-04 | F-01 AK3 | Konto `lea@example.org` vorhanden, abgemeldet | erneut registrieren | „Diese E-Mail wird bereits verwendet.“ | `f-01-anmeldung.spec.ts › F-01 AK3: bereits verwendete E-Mail legt kein zweites Konto an` |
| TC-A-05 | F-01 AK4 | Konto vorhanden, abgemeldet | Anmeldung mit `falsch123` | „E-Mail oder Passwort falsch.“ | `f-01-anmeldung.spec.ts › F-01 AK4: falsches Passwort lässt die Person abgemeldet` |
| TC-A-06 | F-01 AK5 | registriert | „Abmelden“, dann „Treffen erstellen“ | Link „Anmelden“ sichtbar; URL `/anmelden?weiter=%2Ferstellen` | `f-01-anmeldung.spec.ts › F-01 AK5: nach dem Abmelden führt "Treffen erstellen" wieder zur Anmeldung` |
| TC-A-07 | F-02 AK1 | Gast, Entdecken | Details „Basketball auf dem Exe“ | ≥ 3 Treffer; Details offen; URL ohne `anmelden` | `f-02-gast.spec.ts › F-02 AK1: Gäste sehen Treffen und Details ohne Anmeldeaufforderung` |
| TC-A-08 | F-02 AK2/AK3 | Gast, Details „Badminton zu zweit“ | „Jetzt teilnehmen“; Anmeldung als Lea; erneut „Jetzt teilnehmen“ | URL `/anmelden?weiter=%2Ftreffen%2Fdemo-badminton-halle`; danach `/treffen/demo-badminton-halle` mit „1 von 2 Plätzen frei“ (kein Auto-Beitritt); nach Klick Status „Du bist dabei“ (BUG-02 behoben), Hinweis „Du bist dabei“ in den Details | `f-02-gast.spec.ts › F-02 AK2/AK3: "Jetzt teilnehmen" führt zur Anmeldung und danach zurück, ohne automatisch beizutreten` |
| TC-A-09 | F-02 AK4 | Gast, Entdecken | „Treffen erstellen“ | URL `/anmelden`, Überschrift „Anmelden“ | `f-02-gast.spec.ts › F-02 AK4: Gäste landen bei "Treffen erstellen" in der Anmeldung` |
| TC-A-10 | F-31 AK1/AK2 | Erstbesuch | Hinweis lesen, „Treffen entdecken“, neu laden | drei Schritte „Sportart auswählen“, „Treffen finden“, „Gemeinsam Sport machen“; nach Schließen und Neuladen kein Hinweis | `f-02-gast.spec.ts › F-31 AK1/AK2: Erstbesuch-Hinweis erklärt SportMate in drei Schritten und bleibt nach dem Schließen weg` |
| TC-A-11 | F-32 AK1 | lokaler Modus | `/` und `/profil` | „Demo-Modus – Beispieldaten, Änderungen gehen beim Neuladen verloren“ auf beiden | `f-02-gast.spec.ts › F-32 AK1: im lokalen Modus steht dauerhaft der Demo-Hinweis` |
| TC-A-12 | F-05 AK1 | Entdecken | – | Karten sichtbar; abgesagtes „Beachvolleyball am Ostseebad“ fehlt | `f-05-liste.spec.ts › F-05 AK1: zeigt nur kommende, nicht abgesagte Treffen` |
| TC-A-13 | F-05 AK2 | Entdecken | Karte „Fußball am Campus“ | „5 von 10 Plätzen frei“ | `f-05-liste.spec.ts › F-05 AK2: Karte zeigt "x von y Plätzen frei"` |
| TC-A-14 | F-05 AK3 | Entdecken | letzte Karte | „Volleyball an der Hafenspitze“ mit „Ausgebucht“ | `f-05-liste.spec.ts › F-05 AK3: ausgebuchte Treffen stehen am Ende und tragen "Ausgebucht"` |
| TC-A-15 | F-06 AK1 | Entdecken | Chips Volleyball + Laufen | kein Basketball; Kartenzahl = Trefferzahl > 1; jede Karte Volleyball oder Laufen; Marker = Trefferzahl | `f-06-filter.spec.ts › F-06 AK1: Volleyball und Laufen zeigen genau diese Sportarten (Liste = Karte)` |
| TC-A-16 | F-06 AK2 | Entdecken | Filter „Morgen“ | jede Karte trägt Tag „Morgen“ | `f-06-filter.spec.ts › F-06 AK2: "Morgen" zeigt nur Treffen von morgen` |
| TC-A-17 | F-06 AK4 | Entdecken | Tischtennis + „Heute“ | „Keine Treffen gefunden“, Link „Selbst ein Treffen erstellen“, 0 Marker | `f-06-filter.spec.ts › F-06 AK4: ohne Treffer erscheint der Leerzustand mit "Selbst ein Treffen erstellen"` |
| TC-A-18 | F-06 AK5 | Filter Tischtennis + Heute | „Filter zurücksetzen“ | Trefferzahl und Marker = Ausgangszahl | `f-06-filter.spec.ts › F-06 AK5: "Filter zurücksetzen" zeigt wieder alle Treffen` |
| TC-A-19 | F-07 AK1 | Entdecken | Niveau „Anfänger“ | Basketball und Strandlauf fehlen; „Fußball am Campus“, „Lockere Laufrunde im Volkspark“ sichtbar | `f-06-filter.spec.ts › F-07 AK1: "Anfänger" zeigt Anfänger- und Alle-Niveaus-Treffen` |
| TC-A-20 | F-07 AK2 | Entdecken | Alter „20–25“ | Tischtennis fehlt; Basketball und Laufrunde (ohne Altersgruppe) sichtbar | `f-06-filter.spec.ts › F-07 AK2: "20–25" zeigt passende Treffen und solche ohne Altersgruppe` |
| TC-A-21 | F-07 AK3 | Entdecken | Tischtennis + „Fortgeschritten“ | „Keine Treffen gefunden“ | `f-06-filter.spec.ts › F-07 AK3: kein passendes Treffen ergibt den Leerzustand` |
| TC-A-22 | F-09 AK1 | Entdecken | Suche `duburg` | Trefferzahl 1, „Tischtennis in der Duburg“ | `f-06-filter.spec.ts › F-09 AK1: "duburg" findet nur das Treffen in der Duburg` |
| TC-A-23 | F-09 AK2 | Entdecken | Suche `"   "` | Trefferzahl = Ausgangszahl | `f-06-filter.spec.ts › F-09 AK2: nur Leerzeichen zeigt alle Treffen` |
| TC-A-24 | F-08 AK1 | Entdecken | Chip Fußball | Kennungen auf der Karte (Marker und Gruppen) = Kennungen der Liste = Trefferzahl; nach Filter weniger, wieder gleich | `f-08-karte.spec.ts › F-08 AK1: Karte zeigt genau die Treffen der Liste (einzeln oder gruppiert), auch nach dem Filtern` |
| TC-A-25 | F-08 AK2 | Entdecken, mobil Sheet auf „peek“ | Klick Marker `demo-tischtennis-duburg` | URL `/treffen/demo-tischtennis-duburg`, Überschrift, Marker `aria-pressed="true"` | `f-08-karte.spec.ts › F-08 AK2: Klick auf einen Marker öffnet die Details und markiert ihn` |
| TC-A-26 | F-08 AK3 | Offline-Karte | Details über die Liste öffnen | „Karte offline“, „Karte nicht verfügbar“; Liste bedienbar | `f-08-karte.spec.ts › F-08 AK3: ohne Kartenkacheln bleibt die Liste bedienbar und die Karte ist als offline gekennzeichnet` |
| TC-A-27 | F-08 AK4 | Viewport 360×740 | Entdecken, Details, `/anmelden` | `scrollWidth − clientWidth ≤ 0` auf allen drei | `f-08-karte.spec.ts › F-08 AK4: bei 360 px Breite gibt es kein seitliches Scrollen` |
| TC-A-28 | F-12 AK1 | Entdecken | Details „Fußball am Campus – Anfänger willkommen“ | „Fußball“, Termin im Format `Wt, TT.MM., 17:00–19:00 Uhr · 2 Std.` (regulärer Ausdruck), „Campus Flensburg, Sportplatz (Beispiel)“, „Niveau: Anfänger“, „Anfänger willkommen“, „5 von 10 Plätzen frei“ | `f-12-details.spec.ts › F-12 AK1: zeigt Sportart, Zeit, Treffpunkt, Niveau und freie Plätze` |
| TC-A-29 | F-12 AK2 | Entdecken | Details „Basketball auf dem Exe“ | „Alter: 20–25 Jahre“ | `f-12-details.spec.ts › F-12 AK2: Altersangabe ist eindeutig mit Jahren beschriftet` |
| TC-A-30 | F-12 AK4 | Entdecken | Details „Volleyball an der Hafenspitze“ | Button „Ausgebucht“ deaktiviert; kein „0 von 4 Plätzen frei“ | `f-12-details.spec.ts › F-12 AK4: ausgebuchtes Treffen zeigt "Ausgebucht" statt "0 von 4 Plätzen frei"` |
| TC-A-31 | F-12 AK5 | – | Direktlink `/treffen/demo-volleyball-ostseebad` | „Abgesagt“, kein „Jetzt teilnehmen“ | `f-12-details.spec.ts › F-12 AK5: abgesagtes Treffen per Direktlink zeigt "Abgesagt" ohne Teilnahme-Button` |
| TC-A-32 | F-13 AK1/AK3 | Entdecken | Details Fußball am Campus | „Kostenlos“, „Mitbringen: Sportschuhe, Getränk“, Überschrift „Was erwartet dich?“ | `f-12-details.spec.ts › F-13 AK1/AK3: kostenloses Treffen zeigt "Kostenlos" und was mitzubringen ist` |
| TC-A-33 | F-13 AK2 | Entdecken | Details „Badminton zu zweit“ | „3,50 € pro Person“ | `f-12-details.spec.ts › F-13 AK2: kostenpflichtiges Treffen zeigt den Preis pro Person` |
| TC-A-34 | F-13 AK3 | Entdecken | Details Volleyball an der Hafenspitze | „Mitbringen: nichts Besonderes“ | `f-12-details.spec.ts › F-13 AK3: ohne Angabe steht "Mitbringen: nichts Besonderes"` |
| TC-A-35 | F-14 AK1 | Entdecken | Details Basketball | „Organisiert von Tom“; kein „@“ in den Details | `f-12-details.spec.ts › F-14 AK1: Details nennen den Organisator ohne Kontaktdaten` |
| TC-A-36 | F-15 AK3 | – | `/treffen/gibt-es-nicht` | Überschrift „Treffen nicht gefunden“, Link „Zur Übersicht“ | `f-12-details.spec.ts › F-15 AK3: unbekannter Link zeigt "Treffen nicht gefunden" mit Weg zur Übersicht` |
| TC-A-37 | F-25 AK1 | Entdecken | Details Fußball am Campus | „(noch 1)“ | `f-12-details.spec.ts › F-25 AK1: Mindestzahl nicht erreicht zeigt "noch 1"` |
| TC-A-38 | F-17 AK1 | Lea, Assistent | Volleyball, „Volleyball am Abend“, Treffpunkt „Halle Sandberg, Eingang Nord“, 8 Plätze, Veröffentlichen | URL `/treffen/<id>`, Überschrift, „7 von 8 Plätzen frei“, „Organisiert von dir“ | `f-17-erstellen.spec.ts › F-17 AK1: veröffentlichtes Treffen erscheint mit "7 von 8 Plätzen frei", Lea ist dabei` |
| TC-A-39 | F-17 AK1 | Lea, Schritt 1 | Titel `V`, Weiter | „Bitte einen Titel mit 3–80 Zeichen“, Titel `aria-invalid="true"` | `f-17-erstellen.spec.ts › F-17 AK1: zu kurzer Titel wird in Schritt 1 am Feld gemeldet` |
| TC-A-40 | F-17 AK2 | Lea, Schritt 3 | Treffpunkt leer, Veröffentlichen | „Bitte den Treffpunkt …“, `aria-invalid="true"`, URL bleibt `/erstellen` | `f-17-erstellen.spec.ts › F-17 AK2: ohne Treffpunkt wird nichts gespeichert und das Feld ist markiert` |
| TC-A-41 | F-17 AK3 | Lea, Schritt 2 | Beginn 18:00, Ende 17:00 | „Das Ende muss nach dem Beginn liegen.“ | `f-17-erstellen.spec.ts › F-17 AK3: Ende vor Beginn wird in Schritt 2 gemeldet` |
| TC-A-42 | F-17 AK4 | Lea, Schritt 3 | Plätze 51 | „zwischen 2 und 50“, URL bleibt `/erstellen` | `f-17-erstellen.spec.ts › F-17 AK4: 51 Plätze werden abgelehnt` |
| TC-A-43 | F-17 AK5 | 360×740 | `/` | Link „Treffen erstellen“ im sichtbaren Bereich | `f-17-erstellen.spec.ts › F-17 AK5: "Treffen erstellen" ist auf 360 px ohne Scrollen sichtbar` |
| TC-A-44 | F-22 AK5 | Gast | Karte Basketball | Button „Jetzt teilnehmen“ sichtbar | `f-22-teilnahme.spec.ts › F-22 AK5: Karten mit freien Plätzen tragen "Jetzt teilnehmen"` |
| TC-A-45 | F-22 AK1, F-24 | Lea, Details Badminton zu zweit | „Jetzt teilnehmen“, dann Meine Treffen | Status „Du bist dabei“; „Ausgebucht“; Eintrag mit „Angemeldet“ | `f-22-teilnahme.spec.ts › F-22 AK1: Beitritt zeigt "Du bist dabei", danach ausgebucht und unter Meine Treffen` |
| TC-A-46 | F-22 AK1 | Lea, Entdecken | „Jetzt teilnehmen“ auf Karte Basketball | Status „Du bist dabei“, „Dabei“, „5 von 10 Plätzen frei“ | `f-22-teilnahme.spec.ts › F-22 AK1: Beitritt direkt aus der Liste` |
| TC-A-47 | F-22 AK2 | Lea | Karte und Details Volleyball an der Hafenspitze | Button „Ausgebucht“ deaktiviert, kein „Jetzt teilnehmen“ | `f-22-teilnahme.spec.ts › F-22 AK2: ausgebuchtes Treffen bietet keinen Beitritt` |
| TC-A-48 | F-23 AK1 | Tom, Details „Strandlauf Solitüde“ (10 von 12 frei) | „Teilnahme zurückziehen“, Dialog „Zurückziehen“ | Status „Du bist nicht mehr dabei“, „11 von 12 Plätzen frei“, nicht mehr unter Meine Treffen | `f-22-teilnahme.spec.ts › F-23 AK1: Teilnahme zurückziehen gibt den Platz frei und entfernt das Treffen aus Meine Treffen` |
| TC-A-49 | F-24 AK1/AK2 | Lea | Meine Treffen › „Ich organisiere“ | Strandlauf mit „Organisiert von dir“, Beachvolleyball mit „Abgesagt“ | `f-22-teilnahme.spec.ts › F-24 AK1/AK2: zeigt organisierte Treffen mit "Organisiert von dir" und abgesagte mit "Abgesagt"` |
| TC-A-50 | F-24 AK3 | Lea ohne Teilnahmen | Meine Treffen | „Noch keine Treffen“, Link „Zur Übersicht“ | `f-22-teilnahme.spec.ts › F-24 AK3: ohne Teilnahmen erscheint "Noch keine Treffen" mit Link zur Übersicht` |
| TC-A-51 | F-18 AK1 | Lea, Details Strandlauf Solitüde | „Treffen absagen“, Dialog bestätigen, „Alle Treffen“ | Status „Treffen abgesagt“, „Abgesagt“; nicht mehr in Liste, kein Marker `demo-laufen-solitude` | `f-22-teilnahme.spec.ts › F-18 AK1: Organisatorin sagt ab; Treffen ist abgesagt und verschwindet aus Liste und Karte` |
| TC-A-52 | F-12 AK3 (FB-45) | Entdecken | Details „Lockere Laufrunde im Volkspark“ | „Alter: offen für alle“ (exakt) | `f-12-details.spec.ts › F-12 AK2 (FB-45): Treffen ohne Altersgrenze zeigt "Alter: offen für alle"` |
| TC-A-53 | F-01 AK6 | Lea angemeldet | `/anmelden` erneut öffnen, „Zum Profil“ | „Du bist bereits angemeldet als Lea.“, kein E-Mail-Feld; Link führt zu `/profil` | `f-01-anmeldung.spec.ts › F-01 AK6: wer angemeldet ist und /anmelden öffnet, sieht einen Hinweis mit Link zum Profil statt des Formulars` |
| TC-A-54 | F-05 AK2 | Viewport 320×640 | Entdecken | mindestens eine Meta-Zeile bricht um; Trennpunkt am Zeilenanfang liegt im abgeschnittenen Rand (unsichtbar); kein Element bricht in sich um (< 24 px hoch) | `f-05-liste.spec.ts › F-05 AK2: Meta-Angaben brechen ohne Trennpunkt am Zeilenanfang um (320 px)` |
| TC-A-55 | F-05 AK2 | nur Mobile Chrome (Desktop: gewollt übersprungen) | Karte „Basketball auf dem Exe“ | Niveau, „Alter: 20–25 Jahre“ und Kosten: 3 Elemente auf gleicher Höhe | `f-05-liste.spec.ts › F-05 AK2: Niveau, Alter und Kosten passen auf Mobilgeräten in eine Zeile` |
| TC-A-56 | F-05 AK5 | `/` | Tab-Leiste: Meine Treffen → Treffen erstellen → Profil → Entdecken (echte Klicks) | jeweils passende URL; „Entdecken“ mit `aria-current="page"`; kein Next.js-Dev-Tools-Knopf | `smoke.spec.ts › F-05 AK5: Tab-Leiste führt per Klick zu allen vier Zielen und zurück zu Entdecken` |
| TC-A-57 | F-08 AK5 | Entdecken, Karte sichtbar | – | Karte = Liste; keine zwei Marker-/Gruppen-Pillen überlappen (Bounding Boxes paarweise) | `f-08-karte.spec.ts › F-08 AK5: Marker und Gruppen überlappen sich nicht` |
| TC-A-58 | F-08 AK6 | Entdecken, Karte sichtbar | Klick auf erste Gruppe, dann „Alle Treffen auf der Karte zeigen“ | Gruppe trägt ihre Anzahl; danach jedes Mitglied als einzelner Marker sichtbar; zurück: Karte = Liste | `f-08-karte.spec.ts › F-08 AK6: Klick auf eine Gruppe mit Anzahl fächert ihre Treffen einzeln auf` |
| TC-A-59 | F-24 AK4 | Lea angemeldet | Profil; dann Beitritt Basketball; Profil; „Deine Treffen ansehen“ | Zähler „dabei“ 0 → 1, „organisiert“ 2; Link führt zu `/meine-treffen` mit 1 Eintrag | `f-22-teilnahme.spec.ts › F-24 AK4: Profil zählt Treffen "dabei" und "organisiert" wie Meine Treffen und verlinkt dorthin` |

## 3. Manuelle Testfälle und Ergebnisse

Durchgeführt vom Orchestrator am 23.11.2026 im **Supabase-Modus** (Dev-Server mit echter DB, Browser mobil 375×812) bzw. per Skript
gegen die DB. Ergebnisse im Testbericht.

| ID | Story/AK | Vorbedingung | Schritte / Eingabe | Erwartetes Ergebnis | Ergebnis 23.11.2026 |
| --- | --- | --- | --- | --- | --- |
| TC-M-01 | F-05, F-08, F-32 AK4 | Supabase-Variablen gesetzt, Seed eingespielt | Startseite öffnen | Treffen aus Supabase in Liste, Vektorkarte lädt, kein Demo-Hinweis | bestanden (11 Treffen, Vektorkarte). Befund: Treffen „Integrationstest Treffen“ aus TC-I-07/08 sichtbar → BUG-03 |
| TC-M-02 | F-01 AK1 | Supabase-Modus, Gast | Testkonto registrieren | Weiterleitung `/profil`, Toast „Angemeldet als …“ | bestanden |
| TC-M-03 | F-22 AK1 | angemeldet | „Spontanes Kicken an der Hafenspitze“ → „Jetzt teilnehmen“; DB prüfen | Teilnahme in der App sichtbar; in der DB Teilnahme vorhanden, `participant_count` erhöht | bestanden (DB: `participant_count` 1). Befund: Toast „Du bist angemeldet“ mehrdeutig → BUG-02 |
| TC-M-04 | F-17 AK1 | Skript, angemeldetes Konto A | RPC `create_event` | neues Treffen, `participant_count` 1 | bestanden |
| TC-M-05 | F-22 AK1 | Treffen aus TC-M-04, Konto B | RPC `join_event` | `participant_count` 2 | bestanden |
| TC-M-06 | F-22 AK2 | Treffen nach TC-M-05 voll (laut Skriptablauf Kapazität 2) | dritter Beitritt (Konto C) | Fehler `EVENT_FULL`, Zähler bleibt 2 | bestanden |
| TC-M-07 | F-23 AK1 | Konto B nimmt teil | RPC `leave_event` | `participant_count` 1 | bestanden |
| TC-M-08 | F-18 AK3 | Konto B ist nicht Organisator | RPC `cancel_event` | Fehler `NOT_ORGANIZER`, Treffen bleibt veröffentlicht | bestanden |
| TC-M-09 | F-18 AK1 | Konto A ist Organisator | RPC `cancel_event` | Status `cancelled` | bestanden |
| TC-M-10 | Sicherheit (S2) | anonymer Client | direktes `insert` in `events` | „permission denied“ | bestanden |

Alle Befunde aus den manuellen Tests (BUG-02, BUG-03) sind inzwischen behoben (Abschnitt 7).

## 4. Ausführung, Ergebnis des letzten Laufs, Coverage

### 4.1 So startet man alle Tests

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
beenden oder den Lauf auf einer sauberen Kopie des Commits ausführen (`git worktree add`, `npm ci`; so im Endlauf vom 23.11.2026).

Vorbereitung einmalig: `npm ci` und `npx playwright install chromium`. Playwright startet selbst einen Dev-Server auf
Port 3010 im Demo-Modus mit Offline-Karte. Läuft bereits `npm run dev`, diesen vorher beenden (Next.js 16 erlaubt nur
einen Dev-Server je Projektordner).

### 4.2 Letzter dokumentierter Lauf

Quelle: `docs/testing/testbericht.md`, Abschnitt „Endlauf 23.11.2026“. Umgebung: Windows 11 Pro, Node.js 22.22.3, Vitest 5,
Playwright 1.65.1 mit Chromium, Next.js 16 Dev-Server Port 3010.

| | |
| --- | --- |
| Datum / Uhrzeit | 23.11.2026, 14:00–14:07 |
| Commit | `004a9fa` (Branch `develop`, Arbeitsbaum sauber) |
| Durchgeführt von | tester/reporter (Agent); Supabase-Integrationslauf und Live-Prüfung BUG-03: Orchestrator (ca. 14:00) |
| Umgebung | siehe oben; Playwright lief in einer sauberen Arbeitskopie (`git worktree add`, `npm ci`), weil im Projektordner ein fremder Next-Dev-Server (Port 3020) lief. Vor dem Lauf fehlten die Playwright-Browser auf dem Rechner (1. Versuch: 118 Abbrüche „Executable doesn't exist“, kein Testergebnis); nach `npx playwright install chromium` lief die Suite vollständig. |

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

#### Vorher / Nachher (Review-Stand `9f79927` → Endlauf `004a9fa`)

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

### 4.3 Coverage

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

## 5. Leitfaden für Reviews und Inspektionen

Quelle: `docs/review-leitfaden.md`. Grundlage: Inspektion nach Fagan (1976), „Design and code inspections to reduce
errors in program development“, IBM Systems Journal 15(3).

| Schritt | Wer | Was | Ergebnis |
| --- | --- | --- | --- |
| 0 Selbstprüfung | coder | `make check` grün, eigene Änderung gegen Checkliste C1–C10 und S1–S4 gelesen, keine Ausgaben zur Fehlersuche | Eintrag in `specs/F-XX/log.md` |
| 1 Vorbereitung | reviewer | Spec, `docs/architecture.md`, `docs/design.md` und Diff lesen (`git diff main...HEAD`, `git log --oneline main..HEAD`). Erst die Anforderung, dann den Code | – |
| 2 Stufe 1: Spec-Konformität | reviewer | Wurde das Richtige gebaut? Checkliste A1–A7. Besteht Stufe 1 nicht, endet das Review hier mit „blockierend“ | Befunde |
| 3 Stufe 2: Entwurf und Code | reviewer | Wurde es richtig gebaut? Checklisten E, C, U, S Punkt für Punkt | Befunde |
| 4 Prüfläufe | reviewer | `make check`, `make coverage` (Coverage der geänderten `src/lib`-Dateien nennen), `make e2e` | Zahlen im Review |
| 5 Menschliches Review | Mensch (nicht die Person, die umgesetzt hat) | **Pflicht** bei Login/Anmeldung, Rechten (RLS, RPC, `security definer`), Datenbankschema/Migrationen, Seed, Secrets. Der Agent schreibt dann: „Mensch muss diesen Code selbst lesen.“ | Review im Pull Request |
| 6 Nacharbeit | coder | Blockierendes beheben, erneut prüfen lassen. „wichtig“ beheben oder in `docs/tech-debt.md` | Status je Befund |

Größe: höchstens etwa 400 geänderte Zeilen je Review. Ist der Diff größer, war die Story zu groß: teilen oder in Teilen prüfen.
Geprüft wird der Code, nicht die Person. Jeder Befund braucht einen Beleg (Datei:Zeile), keine Befunde aus dem Gedächtnis.

### Schweregrade

| Grad | Bedeutung | Beispiele | Folge |
| --- | --- | --- | --- |
| **blockierend** | AK nicht erfüllt, Fehler im Verhalten mit Datenverlust oder Sicherheitsfolge, Architekturregel verletzt, Regel umgangen | Schreibrecht ohne RLS/RPC, `any`/`eslint-disable`, AK ohne Test, Kernlogik importiert Oberfläche | kein Merge |
| **wichtig** | Fehlverhalten mit Umweg, spürbar schlechtere Wartbarkeit, Barrierefreiheit eingeschränkt, Testlücke an riskanter Stelle | doppelte Logik, harte Farbwerte statt Token, Fokus verlässt Dialog, Datenzugriff nur durch übersprungene Tests gedeckt | beheben oder als technische Schuld eintragen |
| **Hinweis** | Verbesserungsidee, veralteter Kommentar, Geschmack | doppelter Meldungstext, Kommentar passt nicht mehr | Autorin oder Autor entscheidet |

(Der reviewer-Agent nennt „wichtig“ in älteren Reviews „sollte“; beide Wörter bedeuten dasselbe.)

### Checklisten

- **A1** Jedes Akzeptanzkriterium hat einen Test auf der festgelegten Ebene; der Testname nennt `F-XX AKn`.
- **A2** Jeder Test prüft ein Ergebnis mit sichtbarem Orakel (Text, Zahl, URL, `aria-invalid`), nicht nur „kein Absturz“. Er würde bei falscher Umsetzung rot.
- **A3** Fehlerfälle und Randwerte der Spec sind getestet (leer, Minimum, Maximum, eins darüber).
- **A4** Nichts gebaut, was nicht in der Spec steht. Nichts aus der Spec fehlt.
- **A5** Tests wurden vor dem Code committet. Alle Commits beginnen mit der Feature-ID.
- **A6** Keine umgangenen Regeln: `skip`, `todo`, `only`, `any`, `@ts-ignore`, `@ts-expect-error`, `eslint-disable`. Erlaubt ist nur `describe.skipIf(!enabled)` für die Supabase-Integration.
- **A7** Manuelle Testfälle sind ausführbar beschrieben (Vorbedingung, Schritte, Eingaben, erwartetes Ergebnis).

**Stufe 2: Entwurf (E1–E7)** – Code im vorgesehenen Baustein; Abhängigkeitsrichtung nach ADR-0003; Information Hiding
(kein `@supabase/*` außerhalb `src/lib/data`); hohe Kohäsion; lose Kopplung (Zeit `now` als Parameter); nichts doppelt;
Abweichungen mit ADR.
**Stufe 2: Code (C1–C10)** – Namen, Kopf- und Funktionskommentare, kognitive Komplexität ≤ 15, Eingaben prüfen, Fehler
deutsch und aus einer Stelle, keine Secrets, keine Typ-Umgehungen, kein toter Code, Testnamen mit `F-XX AKn`, neue
Abhängigkeiten mit Notiz.
**Stufe 2: Oberfläche (U1–U6)** – gestaltete Zustände (leer, lädt, Fehler), Barrierefreiheit, Tastatur und Fokusfalle,
Design-Tokens, Anti-Slop-Regeln, `prefers-reduced-motion` und 360 px.
**Stufe 2: Sicherheit (S1–S4), immer mit menschlichem Review** – RLS je Tabelle, Schreiben nur per RPC mit
`security definer` + `search_path = ''` + `auth.uid()`, Invarianten in der Datenbank (Zeilensperre und Check-Constraint),
stabile Fehlercodes.
Dokumente (D1–D3): Spec, Architektur, Migration.

Vollständige Checklisten mit allen Punkten: `docs/review-leitfaden.md`.

## 6. Ergebnisse der Reviews

Gesamt-Review vom 23.11.2026 über Commit `9f79927` (Rolle reviewer nach Leitfaden; `docs/testing/review-protokoll.md`).
Ergebnis: **0 blockierend, 6 wichtig, 9 Hinweise.** Sicherheitsmodell schlüssig; Freigabe für die Präsentation unter
Vorbehalt des menschlichen Reviews der Migration und der Anmelde-/Datenzugriffsdateien.

**Stand nach Nachprüfung auf `004a9fa`: 10 behoben (je Befund ein Commit), 5 offen.**

Geprüfter Commit `004a9fa` (Branch `develop`). Status je Befund aus `git log` und Lesen des Codes; Prüfläufe siehe
`docs/testing/testbericht.md`, Abschnitt „Endlauf 23.11.2026“ (Vitest 283/2 übersprungen, mit DB 285/285; Playwright 117/1 übersprungen; tsc 0; ESLint 0).

| Status | Anzahl | Befunde |
| --- | ---: | --- |
| behoben (mit Commit) | 10 | REV-01, REV-03, REV-04, REV-05, REV-06, REV-07, REV-08, REV-11, REV-12, REV-15 |
| offen | 5 | REV-02 (wichtig, durch Integrationslauf ausgeglichen), REV-09, REV-10, REV-13, REV-14 (Hinweise) |

Anmerkungen:
- `ded1894` (BUG-04/REV-01) enthält Test und Umsetzung in einem Commit; die Regel „erst Tests, dann Code“ (A5) ist dort nicht
  durch getrennte Commits belegt. BUG-02 wurde regelkonform abgewickelt (`49eb701` Tests rot, dann `6b9a4d9`).
- Menschliches Review der Migrationen (`0001`, `0002`) und der Auth-/Repository-Dateien steht weiter aus.

| ID | Datei:Zeile | Prüfpunkt | Schweregrad | Beschreibung | Empfehlung | Status |
| --- | --- | --- | --- | --- | --- | --- |
| REV-01 | `src/lib/events/event-validation.ts:79-82`; `src/lib/data/supabase-error-translation.ts:35`; `supabase/migrations/0001_initial_schema.sql:115` | E6, C5 | wichtig | Die Datenbank erlaubt höchstens 12 h Dauer (`events_max_duration`, auch `docs/architecture.md` Z. 486), die Kernlogik kennt diese Regel nicht. Folge: Im lokalen Modus werden Treffen > 12 h angenommen, im Supabase-Modus lehnt die DB ab, und die Übersetzung liefert für `events_max_duration` die erste Regel des Feldes `endsAt`: „Das Ende muss nach dem Beginn liegen.“ – falsch für z. B. 06:00–19:00. Verhaltensfehler → **BUG-04**. | Regel „höchstens 12 Stunden“ mit eigener Meldung in `event-validation.ts` (Grenzwert in `eventLimits`), Übersetzung auf diese Meldung abbilden; zuerst Test (Unit: 12 h ok, 12 h 1 min abgelehnt; Übersetzung `events_max_duration`). | behoben `ded1894` (= BUG-04) |
| REV-02 | `src/lib/data/supabase-event-repository.ts` (38,3 % Zeilen, 32,4 % Zweige); `src/lib/data/supabase-auth-gateway.ts` (51,7 % / 17,9 %) | A3, Teststrategie | wichtig | Der Supabase-Datenzugriff ist im Standardlauf (`make check`, CI) nur zu einem Drittel bis zur Hälfte abgedeckt; der Rest nur durch die beiden Integrationstests, die ohne `SUPABASE_INTEGRATION=1` übersprungen werden. Ungedeckt u. a. `listEvents` mit `mine`, Fehlerzweige `loadFailedMessage`, `onAuthChange`, `signUp` ohne Sitzung/Identität. BUG-01 zeigte, dass genau hier Fehler entstehen. | Unit-Tests mit gemocktem Client für die fehlenden Zweige; Supabase-Integrationstests vor jedem Merge mit Änderungen in `src/lib/data` oder `supabase/` von Hand laufen lassen und im Testbericht nennen. | offen – ausgeglichen durch Integrationslauf mit echter DB am 23.11.2026 (285/285); CI und `make check` überspringen ihn weiter, Standard-Coverage `supabase-event-repository.ts` 36,95 % Zeilen |
| REV-03 | `tests/integration/supabase-event-repository.int.test.ts:2, 33` | C6, Teststrategie (Testdaten) | wichtig | Der Test legt veröffentlichte Treffen „Integrationstest Treffen“ in der echten DB an und räumt im Fall TC-I-08 nicht auf; sie waren in der App sichtbar. = **BUG-03** (vom Orchestrator gefunden). | Testtreffen im Test immer absagen (`finally`) oder als `is_demo`/eigenes Testprojekt; langfristig eigene Supabase-Instanz für Tests. | behoben `d5d8a62` (= BUG-03, live geprüft) |
| REV-04 | `src/components/event/day-label.ts:11-17` vs. `src/lib/events/event-search.ts:23-38` | E1, E6 | wichtig | „Heute/Morgen“-Berechnung (Mittag-UTC-Anker, +1 Tag) ist eine zweite Kopie der Kalenderlogik aus `buildCalendarWindow` und liegt in der Oberfläche. Sie hat keinen eigenen Test und fällt aus der Mutationsmessung (`src/lib`). | Funktion in `src/lib/events` (z. B. `event-presentation.ts`) verschieben, `addDays`/Kalenderfenster wiederverwenden, Unit-Test mit festem `now` inkl. Zeitumstellung. | behoben `126600d` (`describeDayLabel` in `src/lib/events/event-presentation.ts`, `day-label.ts` entfernt) |
| REV-05 | `src/components/event/confirm-dialog.tsx:33-39, 66-71` | U3 | wichtig | Modaler `alertdialog` setzt den Fokus auf „Abbrechen“, hat aber keine Fokusfalle (Tab verlässt den Dialog in die verdeckte Seite) und gibt den Fokus nach dem Schließen nicht an den Auslöser zurück. Escape ruft `onCancel` auch während `busy`. | Fokusfalle (Tab/Shift+Tab zwischen beiden Buttons), vorheriges `document.activeElement` merken und zurückgeben (wie `filter-panel.tsx:109-116`); Escape bei `busy` ignorieren. Komponententest mit Tastatur. | behoben `41fe6e9` (`src/lib/ui/focus-trap.ts`, `src/hooks/use-dialog-focus.ts`) |
| REV-06 | `src/components/discover/filter-panel.tsx:107-117` | U3 | Hinweis | Filterdialog gibt den Fokus zurück, hat aber ebenfalls keine Fokusfalle. | Gemeinsame kleine Hilfsfunktion für Fokusfalle in beiden Dialogen (keine Doppelung). | behoben `41fe6e9` (gemeinsame Fokusfalle) |
| REV-07 | z. B. `src/components/discover/discover-screen.module.css:6`, `src/components/event/event-detail.module.css:46,159,231`, `src/components/map/event-map.module.css:13-21`, `src/components/auth/auth-form.module.css:25,99` (23 Stellen in 13 Dateien, zusätzlich 21× `#ffffff`) | U4 | wichtig | Harte Farbwerte statt Design-Tokens: wiederkehrend `#f2f1ec` (Kartenhintergrund, 8×), `#efede8` (5×), `#f7e6e2` (3×), `#e8f3ed` (2×), `#7fd3ad`, `#fbfaf8`, `#ecd1cb`, `#f1f0ec`. Keiner davon steht in `docs/design.md`; `#ffffff` entspricht `--surface`. | Fehlende Tokens anlegen (z. B. `--map-bg`, `--surface-muted`, `--danger-soft`, `--ok-soft`) in `globals.css` und `docs/design.md`, Module umstellen. | behoben `c369461` (0 Hex-Werte mehr in `src/components/**/*.css`) |
| REV-08 | `src/lib/events/event-validation.ts:15` vs. `supabase/migrations/0001_initial_schema.sql:97` | E6 (ADR-0009) | Hinweis | Kostenobergrenze: TS 5000 Cent, SQL 10000 Cent. Kein Fehlverhalten (TS ist strenger), aber zwei Wahrheiten für denselben Grenzwert. | Grenzwerte im SQL an `eventLimits` angleichen oder Abweichung in ADR-0009 begründen. | behoben `004a9fa` (Migration `0002_cost_limit.sql`, vom Orchestrator geprüft und angewendet) |
| REV-09 | `supabase/migrations/0001_initial_schema.sql:10-11` | D3 | Hinweis | Kopfkommentar „NICHT gegen eine Datenbank ausgeführt“ ist seit 23.11.2026 überholt (Integrationstests und Smoke-Test liefen gegen die DB). | Zustand mit Datum aktualisieren (Änderung an Migrationen nur mit menschlichem Review). | offen (Kopfkommentar unverändert) |
| REV-10 | `supabase/migrations/0001_initial_schema.sql:245-246`; `src/lib/data/event-row-mapping.ts:32-35` | S1, Datenschutz | Hinweis | `events` ist für `anon` vollständig lesbar, inkl. `organizer_id` (Konto-UUID). Keine Kontaktdaten, aber Kennungen sind öffentlich verknüpfbar. Entspricht der Architektur (öffentliche Karte); bewusst entscheiden. | Entscheidung in ADR festhalten oder Spalte über View ohne `organizer_id` für `anon` ausliefern. | offen (keine ADR, `organizer_id` weiter für `anon` lesbar) |
| REV-11 | `src/lib/data/supabase-event-repository.ts:12`; `src/lib/data/supabase-error-translation.ts:18` | E6, C5 | Hinweis | Meldung „Dieses Treffen gibt es nicht.“ steht zweimal. | Repository nutzt die Übersetzung (`translateEventError({ message: 'EVENT_NOT_FOUND' })`) oder eine gemeinsame Konstante. | behoben `7fa4ade` |
| REV-12 | `src/lib/data/supabase-auth-gateway.ts:60-68` | C5 | Hinweis | `onAuthChange` ruft den Listener per `setTimeout` auf; nach dem Abbestellen kann ein bereits geplanter Rückruf noch eintreffen (Zustandsänderung nach dem Aushängen einer Komponente). | Flag `active` beim Abbestellen auf `false` setzen und im Rückruf prüfen. | behoben `df3522f` |
| REV-13 | `src/lib/data/supabase-event-repository.ts:49, 62` | C7 | Hinweis | `data as unknown as EventRow` ohne Laufzeitprüfung; eine umbenannte Spalte fiele erst in der Oberfläche als `undefined` auf (vgl. BUG-01, ebenfalls nur gegen echte DB sichtbar). | Generierte Typen (`supabase gen types`) und typisierten Client nutzen; bis dahin Kommentar mit Begründung an der Stelle. | offen (`data as unknown as EventRow` weiter in `supabase-event-repository.ts:47, 60`) |
| REV-14 | `eslint.config.mjs:9-16` | C3 | Hinweis | Die Regel „kognitive Komplexität ≤ 15“ wird von ESLint im Projekt nicht geprüft (kein `sonarjs`/`complexity`); nur SE-Eval misst sie (letzte Messung: 0 Funktionen > 15). | Entweder `eslint-plugin-sonarjs` mit `cognitive-complexity: 15` aufnehmen (neue Abhängigkeit → ADR) oder in `docs/coding-standards.md` klarstellen, dass Review und SE-Eval durchsetzen (erledigt im Dokument). | offen (in `docs/coding-standards.md` klargestellt: Review und SE-Eval setzen durch; keine Lint-Regel) |
| REV-15 | `e2e/f-22-teilnahme.spec.ts:26, 36`; `e2e/f-02-gast.spec.ts:23` | A2, Vorgehen | Hinweis | Akzeptanztests prüfen den mehrdeutigen Toast „Du bist angemeldet“ (BUG-02). Die Behebung ändert ein Orakel: zuerst müssen die Tests (Rolle tester) auf den neuen Text umgestellt und rot sein, dann die Umsetzung. | BUG-02 als Mini-Story mit Test-Commit vor Code-Commit abwickeln. | behoben `49eb701` (Tests rot) + `6b9a4d9` (Umsetzung) |

Review je Story (`specs/F-XX/review.md`): bisher nicht vorhanden; nur die Vorlage `specs/_vorlage/review.md`.

## 7. Gefundene Fehler

Quelle: `docs/testing/fehlerprotokoll.md` (Stand Endlauf 23.11.2026). Bug-Tickets im Projekt-Board: Link offen.

| ID | Datum | Gefunden durch | Beschreibung | Ursache | Behebung | Status |
| --- | --- | --- | --- | --- | --- | --- |
| BUG-01 | 23.11.2026 | Integrationstest `tests/integration/supabase-event-repository.int.test.ts` (gegen echte Supabase-DB) | Im Supabase-Modus konnten keine Treffen geladen werden („Die Treffen konnten nicht geladen werden“). 2 von 2 Integrationstests rot, alle 85 Unit-Tests grün. | PostgREST-Fehler `PGRST201`: Einbettung `organizer:profiles(...)` mehrdeutig, da `events` über `organizer_id` und über `participations` mit `profiles` verbunden ist. Unit-Tests mit gemocktem Client konnten das nicht erkennen. | Beziehung explizit benannt: `profiles!events_organizer_id_fkey` in `src/lib/data/event-row-mapping.ts`. | behoben, Integrationstests 2/2 grün |
| BUG-02 | 23.11.2026 | Manueller explorativer Test im Supabase-Modus (TC-M-03, Orchestrator, Browser mobil 375×812) | Nach dem Beitritt zu „Spontanes Kicken an der Hafenspitze“ lautet der Toast „Du bist angemeldet“. Erwartet: eindeutige Bestätigung der Teilnahme; tatsächlich klingt der Text nach Login. Beitritt selbst korrekt (DB: `participant_count` 1). Schweregrad: Hinweis (Fehler-Grad niedrig, Text). | Meldungstext mehrdeutig gewählt; die Akzeptanztests prüfen denselben Text (`e2e/f-22-teilnahme.spec.ts`, `e2e/f-02-gast.spec.ts`, siehe REV-15). | Akzeptanztests zuerst auf „Du bist dabei“ / „Du bist nicht mehr dabei“ umgestellt (`49eb701`, rot), dann Toast-Text in `src/hooks/use-participation.ts` geändert (`6b9a4d9`). | behoben; Nachweis: TC-A-08, TC-A-45, TC-A-46, TC-A-48 grün im Endlauf 23.11.2026 (Playwright 117/117 ausgeführte bestanden) |
| BUG-03 | 23.11.2026 | Manueller explorativer Test im Supabase-Modus (TC-M-01, Orchestrator) | Veröffentlichte Treffen „Integrationstest Treffen“ aus den Supabase-Integrationstests waren in der App für alle sichtbar. Erwartet: Testläufe hinterlassen keine sichtbaren Daten. Schweregrad: wichtig (Fehler-Grad mittel, Testdaten in Produktivdaten). | `tests/integration/supabase-event-repository.int.test.ts` legt Treffen in der echten DB an und sagt sie nicht in jedem Fall ab (Kopfkommentar Z. 2; Fall „EVENT_FULL“). Siehe REV-03. | Altdaten vom Orchestrator gelöscht; Test sagt jedes erstellte Treffen in `afterEach` ab (auch bei Fehlschlag), Titel mit Präfix „[Test]“ (`d5d8a62`). | behoben; Nachweis: Integrationslauf mit echter DB (Orchestrator, 23.11.2026, 285/285 bestanden) – alle 4 neu angelegten „[Test] …“-Treffen in der DB `cancelled`, keine sichtbaren Testtreffen |
| BUG-04 | 23.11.2026 | Code-Review (REV-01, reviewer) – durch Lesen gefunden, noch nicht durch Test belegt | Treffen länger als 12 Stunden: Schritte: im Supabase-Modus Treffen anlegen mit Beginn 06:00 und Ende 19:00 am selben Tag, sonst gültig. Erwartet: verständliche Meldung „höchstens 12 Stunden“ bereits im Formular (wie im lokalen Modus jede andere Regel). Tatsächlich (aus dem Code abgeleitet): Kernlogik nimmt an, die DB lehnt mit `INVALID_INPUT`/`events_max_duration` ab, angezeigt wird „Das Ende muss nach dem Beginn liegen.“ Im lokalen Modus wird das Treffen gespeichert (unterschiedliches Verhalten der Modi). Schweregrad: mittel. | Regel „Dauer ≤ 12 h“ steht nur in der Migration (Z. 115) und `docs/architecture.md`, nicht in `src/lib/events/event-validation.ts`; `supabase-error-translation.ts:35` bildet den Constraint auf das Feld `endsAt` ab und nimmt dessen erste Meldung. | Regel „höchstens 12 Stunden“ mit eigener Meldung in `src/lib/events/event-validation.ts`, `events_max_duration` in `supabase-error-translation.ts` darauf abgebildet (`ded1894`; Test und Umsetzung in einem Commit). | behoben; Nachweis: `event-creation.test.ts › F-17 AK4 (BUG-04): 12 Stunden sind erlaubt, 12 Stunden und 1 Minute nicht`, `supabase-error-translation.test.ts › F-17 AK4 (BUG-04): events_max_duration ergibt die Meldung zur Höchstdauer` grün im Endlauf |

4 Fehler gefunden, 4 behoben (BUG-01 … BUG-04). Gefunden durch: Integrationstest gegen echte DB (1), manuelle explorative Tests (2), Code-Review (1). Keiner der vier wäre durch die Unit-Tests mit gemocktem Client allein aufgefallen.

## 8. Nutzertests mit echten Personen

Noch nicht durchgeführt. Geplant für Präsentation 6: Nutzertest für NFR-1/H-2 mit 5 Personen (Ziel: mindestens 4 von 5
finden ohne Hilfe in höchstens 2 Minuten ein passendes Treffen und treten bei), Szenario aus FB-42: „Volleyball-Treffen
finden, Infos prüfen, anmelden, abmelden – ohne Erklärung“ (`docs/feedback.md`, `docs/vision.md`). Laut Teststrategie
zusätzlich SUS-Fragebogen (System Usability Scale). Rekrutierung offen: Bei der Umfrage hinterließ niemand eine
Kontaktmöglichkeit für einen Prototyptest (FB-11).

Vorhanden ist die Feedbackrunde mit vier Personen zur MVP-Demo (bis 27.10.2026, FB-43 – FB-58); sie war ein Ersteindruck
mit Note 1–5, kein aufgabenbasierter Nutzertest (Details im Dokument „Feedback“).

## 9. Qualität über die Zeit (SE-Eval)

SE-Eval misst das Projekt von außen ohne KI: statische Analyse, Tests, Coverage, Mutation Testing, Git (`docs/se-eval.md`).
Zwei Messpunkte liegen vor (Bericht `evaluation/results/bericht.md` außerhalb dieses Repositories): 23.11.2026 12:41 auf `8e4f171`
(vor den UI-Stories) und 23.11.2026 14:07 auf `004a9fa` (Endstand, ohne Mutation Testing).

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

## 10. Grenzen

- **Mutation Score unter Windows:** Der Wert 7,69 % (696 von 767 Mutanten „überlebt“, Lauf 46 s) widerspricht 100 % Zeilen-Coverage
  in `src/lib/events` mit exakten Orakeln. Sehr wahrscheinlich ein Messfehler der Stryker-Vitest-Kopplung (perTest-Coverage) unter
  Windows; die Ursache ist nicht abschließend geklärt. Der Wert wird nicht als Aussage über die Testwirksamkeit verwendet.
  Wiederholung unter Linux/CI: offen.
- **Kein Last- oder Performancetest.** Erwartete Nutzerzahl im Kurs ist klein; Supabase-Grenzen im kostenlosen Tarif nicht gemessen.
- **Kein automatischer Paralleltest auf den letzten Platz.** Gleichzeitige Beitritte lassen sich mit Vitest nicht zuverlässig
  erzwingen. Stattdessen: Zeilensperre `select … for update` in `join_event` plus Check-Constraint `events_not_overbooked`
  (zweites Netz), per Code-Review geprüft (`docs/testing/review-protokoll.md`); sequenzieller Vollstand ist getestet (TC-I-08, TC-M-06).
- **Supabase-Integration nicht in CI:** braucht echte Zugangsdaten; läuft von Hand (zuletzt voller Lauf 285/285, Orchestrator 23.11.2026). Ohne Variablen werden die 2 Fälle übersprungen (REV-02).
- **E2E nur im lokalen Modus und mit Offline-Karte;** Supabase-Modus und Online-Vektorkarte sind manuell geprüft (TC-M-01).
- **Nur Chromium** (Mobile Chrome, Desktop Chrome); Safari/Firefox nicht automatisch.
- **Barrierefreiheit** nur über Rollen/Beschriftungen in den Tests und Review; kein automatischer Audit (axe), kein Screenreader-Test.
- **Kein realer Nutzertest bis P6.** Akzeptanztests prüfen die Spezifikation, nicht die Brauchbarkeit für echte Personen.

## 11. Lücken

Siehe auch `abgabe/LUECKEN.md`.

| Bewertungskriterium | Was fehlt | Was das Team nachliefern muss |
| --- | --- | --- |
| Nutzertests | kein Test mit echten Personen | Nutzertest P6 mit 5 Personen durchführen, Protokoll und Ergebnis |
| Fehlerbeschreibungen im Board | Bug-Tickets im Projekt-Board nicht verlinkt | Board-Link und Tickets zu BUG-01 … BUG-04 |
| Reviews je Story | keine `specs/F-XX/review.md`; menschliches Review der Migration offen | Story-Reviews bzw. Pull-Request-Reviews nachweisen |
| Qualität über die Zeit | zwei SE-Eval-Messungen (`8e4f171`, `004a9fa`); Mutation Score nur in der ersten, dort unbrauchbar | Mutation unter Linux/CI messen; weitere Messpunkte je Epic |
| Paralleltest NFR-5 | kein automatischer Test auf den letzten Platz | Paralleltest gegen Supabase oder dokumentierter `psql`-Test (Anleitung in `supabase/README.md`) |
| Offene Review-Befunde | REV-02 (Supabase-Tests nicht in CI), REV-09, REV-10, REV-13, REV-14 | beheben oder in `docs/tech-debt.md` eintragen; Endlauf-Zahlen gelten für `004a9fa`, spätere Commits ändern nur Dokumentation |
| Quellen | ISTQB-Lehrplan ohne Version und Seite | Quelle belegen |
