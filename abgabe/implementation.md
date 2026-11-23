# SportMate – Implementierung

| | |
| --- | --- |
| Projekt | SportMate – Hochschul-Softwareprojekt, Wintersemester 2026/27 |
| Team | Julien, Renat, Paulo, Niklas |
| Hauptverantwortlich | Paulo (Rolle „Implementierung“ laut Präsentation 1 vom 30.09.2026; vom Team zu bestätigen) |
| Autorinnen und Autoren mit Anteil in % | |
| Stand | Entwurf vom 23.11.2026, zusammengestellt von der Agentenrolle reporter |
| Repository | <https://github.com/Paulo-Temme/SportMate> (Branch `develop`; Quellen gelesen auf Stand `4fd94ad`, Zählungen auf `d5d8a62`) |
| Live-App | <https://sportmate-gamma.vercel.app> |

<div class="pagebreak"></div>

## Inhalt

1. Repository, gehostete Version, Start und Installation
2. Aufbau des Projekts
3. Coding-Standards mit Begründung und Durchsetzung
4. Dokumentation im Code
5. Übereinstimmung mit der Architektur
6. Technische Schulden
7. Einsatz von KI bei der Programmierung
8. Lücken

## 1. Repository, gehostete Version, Start und Installation

| | |
| --- | --- |
| Repository | <https://github.com/Paulo-Temme/SportMate>, Arbeitsbranch `develop` |
| Gehostete Version | <https://sportmate-gamma.vercel.app> (Vercel; Antwort HTTP 200 am 23.11.2026 geprüft) |
| Stack | Next.js 16.4.6 (App Router), React 19.3, TypeScript strict, MapLibre GL 6, `motion`, `lucide-react`, `@supabase/supabase-js` 2; Tests mit Vitest 5, Testing Library, Playwright 1.65 |
| Laufzeit | Node.js ab 22 (`package.json`, `engines`) |

Kurzanleitung (ausführlich im separaten Dokument „Installation“ und im `README.md`):

```bash
git clone https://github.com/Paulo-Temme/SportMate.git
cd SportMate
git switch develop
npm ci
npm run dev          # http://localhost:3000, ohne Konfiguration im Demo-Modus
```

Supabase-Modus: `.env.example` nach `.env.local` kopieren und `NEXT_PUBLIC_SUPABASE_URL` sowie
`NEXT_PUBLIC_SUPABASE_ANON_KEY` eintragen; Schema nach `supabase/README.md` einspielen.

Befehlsvertrag (`Makefile`, gleichnamige npm-Skripte): `make setup | lint | typecheck | test | coverage | check | build | e2e | trace | stats`.
Die CI (`.github/workflows/ci.yml`) führt bei jedem Pull Request und Push auf `main`/`develop` aus:
`make trace` (zeigt Lücken, blockiert nicht), `make setup`, `make lint`, `make typecheck`, `make coverage`, `make build`
auf Ubuntu mit Node 22, ohne Supabase-Variablen.

## 2. Aufbau des Projekts

Die Ordner folgen den Bausteinen der Architektur (`docs/architecture.md`, Ordnerstruktur; ADR-0001, ADR-0003):

| Ordner | Baustein | Inhalt |
| --- | --- | --- |
| `src/app/` | Seiten/Routen | Entdecken (`(entdecken)/page.tsx`), Detail (`(entdecken)/treffen/[id]`), `meine-treffen`, `erstellen`, `profil`, `anmelden`; `globals.css` mit Design-Tokens |
| `src/components/map/` | Kartenbühne | MapLibre-Karte, Marker, Ortswahl, Offline-Karte |
| `src/components/sheet/` | Bottom Sheet | Rastpunkte, Gesten, Tastatur |
| `src/components/discover/` | Entdecken | Suchleiste, Sportarten-Chips, Filterdialog, Trefferliste, Erstbesuch-Hinweis |
| `src/components/event/` | Treffen | Trefferkarte, Detailansicht, Teilnehmen-Knopf, Bestätigungsdialog, Belegungsbalken |
| `src/components/create-event/` | Erstellen-Assistent | drei Schritte, Feldfehler |
| `src/components/auth/`, `profile/`, `my-events/`, `navigation/`, `app/` | weitere Oberfläche | Anmelden/Registrieren, Profil, Meine Treffen, Tab-Leiste, App-Rahmen, Toasts, Verdrahtung der Dienste |
| `src/lib/events/` | Kernlogik (rein, ohne I/O) | Modell, Validierung, Erstellen, Suche/Filter, Teilnahmeregeln, Anzeige, Listenreihenfolge, Demodaten |
| `src/lib/auth/` | Kernlogik Anmeldung | Prüfung der Anmeldedaten, Fehler- und Nutzertypen |
| `src/lib/data/` | Datenzugriff | `EventRepository`, `AuthGateway` (Schnittstellen), lokale und Supabase-Umsetzungen, Fehlerübersetzung, Zeilenabbildung, `data-services` (Wahl lokal/Supabase) |
| `src/lib/map/`, `src/lib/ui/` | reine Hilfslogik | Kartenfarben, Rastpunkte des Sheets (testbar ohne DOM) |
| `e2e/` | Akzeptanztests | Playwright, eine Datei je Story |
| `tests/integration/`, `tests/fixtures/` | Integrationstests | lokal und gegen echte Supabase-DB |
| `supabase/` | Datenbank | Migration `0001_initial_schema.sql`, `seed.sql`, Anleitung |
| `scripts/` | Werkzeuge | `trace.mjs` (Nachvollziehbarkeit), `stats.mjs` (Statistik) |
| `docs/`, `specs/` | Dokumentation | Vision, Backlog, Architektur, ADRs, Tests, Prozess; Spec/Protokoll je Story |
| `.claude/` | Agentenprozess | Rollen, Befehle, Schutz-Hook `hooks/guard.mjs` |

Größe (gezählt am 23.11.2026 mit `git ls-files`, Commit `d5d8a62`): 251 versionierte Dateien, davon 140 unter `src/`;
7.614 Zeilen in `src/**/*.ts(x)` einschließlich der Unit- und Komponententests.

## 3. Coding-Standards mit Begründung und Durchsetzung

Die Regeln stehen kurz in `CLAUDE.md` (für Agenten) und ausführlich mit Begründung in `docs/coding-standards.md`.
Durchsetzung über vier Wege: Lint und Typprüfung (`make check`, CI) · Schutz-Hook (`.claude/hooks/guard.mjs`) ·
Review nach `docs/review-leitfaden.md` (Prüfpunkt in Klammern) · SE-Eval (Messung je Epic).

### Entwurf
| Regel | Begründung | Durchgesetzt durch |
| --- | --- | --- |
| Eine Datei, eine Aufgabe | Hohe Kohäsion: Änderungen bleiben an einer Stelle | Review (E4) |
| Kernlogik in `src/lib/`, kennt die Oberfläche nicht | Lose Kopplung: Kernlogik ist ohne Browser testbar und austauschbar | Review (E2, E5), Mutation Testing in SE-Eval |
| Abhängigkeiten nur Oberfläche → Kernlogik → Datenzugriff | Keine Zyklen, Änderungen wirken nur nach oben | Review (E2) |
| Module geben nur frei, was andere brauchen | Information Hiding: Interna können sich ändern, ohne andere zu brechen (Parnas 1972) | Review (E3) |
| Nichts doppelt | Ein Fehler wird an einer Stelle behoben | Review (E6), Duplikate in SE-Eval |
| Einfachste Lösung, Muster nur bei vorhandenem Problem | Unnötige Abstraktion kostet Verständnis | Review (E6) |

### Namen
| Regel | Begründung | Durchgesetzt durch |
| --- | --- | --- |
| Variablen und Funktionen `camelCase`, Funktionen beginnen mit Verb | Üblich in TypeScript; Verb zeigt, dass etwas getan wird | Review (C1) |
| Typen und Komponenten `PascalCase`, Substantiv | Üblich in TypeScript und React; unterscheidet Typ von Wert | Review (C1) |
| Dateien `kebab-case` | Keine Probleme zwischen Dateisystemen mit und ohne Groß-/Kleinschreibung | Review (C1) |
| Keine Abkürzungen, keine Namen wie `data`, `utils2`, `tmp` | Namen sind die häufigste Dokumentation (Martin 2008, Kap. 2) | Review (C1) |

### Dokumentation im Code
| Regel | Begründung | Durchgesetzt durch |
| --- | --- | --- |
| Jede Datei beginnt mit einem Satz zu ihrer Aufgabe | Rolle der Datei ist ohne Lesen des Codes erkennbar | Review (C2) |
| Jede öffentliche Funktion: Zweck, Eingaben, Rückgabe, Fehlerfälle, Feature-ID | Schnittstelle ist ohne Lesen des Rumpfs nutzbar; Feature-ID führt zur Spec | Review (C2) |
| Kommentare erklären das Warum, nicht das Was | Das Was steht im Code und veraltet im Kommentar | Review (C2) |

### Komplexität und Typen
| Regel | Begründung | Durchgesetzt durch |
| --- | --- | --- |
| Kognitive Komplexität je Funktion höchstens 15 | Misst, wie schwer Code zu verstehen ist (Campbell 2018); 15 ist der Standardwert von SonarSource | Review (C3), SE-Eval (sonarjs). **Nicht** im Projekt-ESLint (kein `sonarjs`-Plugin, REV-14) |
| `as unknown as` nur an der Grenze zu Supabase-Antworten, mit Kommentar | Eine Typbehauptung ohne Prüfung verschiebt Fehler in die Laufzeit (vgl. BUG-01) | Review (C7, REV-13) |
| Kein `any`, `@ts-ignore`, `@ts-expect-error`, `eslint-disable` | Schaltet genau die Prüfung ab, die Fehler vor der Laufzeit findet | Lint, Review (A6), SE-Eval zählt Umgehungen |
| `strict` in `tsconfig.json` | Findet fehlende Werte und falsche Typen beim Übersetzen | Typprüfung |

### Tests und Ablauf
| Regel | Begründung | Durchgesetzt durch |
| --- | --- | --- |
| Tests zuerst, getrennter Commit | Test beschreibt die Anforderung, bevor die Lösung sie verbiegt (Beck 2002) | Rollen tester und coder, Schutz-Hook, Review (A5) |
| Wer umsetzt, ändert keine Tests | Sonst wird der Test der Umsetzung angepasst statt umgekehrt | Schutz-Hook |
| Testname nennt `F-XX AKn` | Nachvollziehbarkeit von Anforderung zu Test | `make trace`, Review (A1) |
| Commit beginnt mit Feature-ID, eine Story = ein Branch = ein Pull Request | Jede Änderung führt zu ihrer Anforderung; kleine Pull Requests sind prüfbar | Review (A5), geschützter `main` |
| Kein Commit auf `main`, kein Push oder Merge durch Agenten | Der Mensch verantwortet, was ins Projekt kommt | Schutz-Hook, Rechte in `.claude/settings.json` |
| Keine Secrets im Code, `.env` für Agenten gesperrt | Zugangsdaten gehören nicht ins Repo und nicht in Sitzungen | Schutz-Hook, Rechte |

### Projektspezifische Regeln SportMate

#### Schichten und Datenzugriff
| Regel | Begründung | Durchgesetzt durch |
| --- | --- | --- |
| `src/lib/events` und `src/lib/auth` importieren nichts aus `src/lib/data`, `src/components`, `src/app`, `src/hooks` | Kernlogik bleibt rein und ohne Browser testbar; Mutation Testing zielt auf `src/lib` (ADR-0003) | Review (E2, Prüfbefehl im Leitfaden) |
| Oberfläche nutzt Daten nur über `EventRepository`, `AuthGateway`, `data-services`; kein `@supabase/*` außerhalb `src/lib/data` | Lokaler Demo-Modus und Supabase bleiben austauschbar; Tabellen- und Fehlercodes bleiben verborgen | Review (E3) |
| Fachlogik (Datum, Plätze, Teilnahme, Filter) nur in `src/lib/events`, nicht in Komponenten | Einmal schreiben, einmal testen, mit Mutation messen (Gegenbeispiel REV-04) | Review (E1, E6) |
| Zeit wird übergeben (`now`), Kernlogik liest keine Uhr | Wiederholbare Tests mit festem Zeitpunkt, Zeitumstellung prüfbar | Review (E5), Unit-Tests mit festem `now` |
| Grenzwerte und Wertelisten einmal in `event-model.ts`/`eventLimits`; SQL-Checks nennen dieselben Werte | TS und SQL prüfen dieselben Regeln doppelt (ADR-0009); weichen sie ab, verhalten sich die Modi verschieden (BUG-04, REV-08) | Review (E6), Supabase-Integrationstests |

#### Sicherheit (immer mit menschlichem Review)
| Regel | Begründung | Durchgesetzt durch |
| --- | --- | --- |
| RLS auf jeder Tabelle; Schreiben nur über RPC-Funktionen | Der Browser spricht direkt mit Supabase (ADR-0007); nur die Datenbank ist Sicherheitsgrenze | Review (S1, S2), Integrationstest „direktes Update wirkungslos“ (TC-I-07), TC-M-10 |
| `security definer` nur mit `set search_path = ''`, voll qualifizierten Namen, Identität aus `auth.uid()`; `EXECUTE` nur für `authenticated` | Verhindert Rechteausweitung über Suchpfad oder gefälschte Parameter | Review (S2), Mensch liest jede Migration |
| Fachliche Invarianten in der DB: Zeilensperre plus Check-Constraint | Zwei gleichzeitige Beitritte auf den letzten Platz werden serialisiert (ADR-0006) | Review (S3) |
| Datenbankfehler als stabiler Code, Übersetzung nur in `supabase-error-translation.ts` | Keine internen Details an Nutzende; eine Stelle für alle Texte | Review (S4, C5), Unit-Tests der Übersetzung |

#### Texte und Oberfläche
| Regel | Begründung | Durchgesetzt durch |
| --- | --- | --- |
| Alle sichtbaren Texte und Fehlermeldungen deutsch, kurz, mit Handlungshinweis; eine Quelle je Meldung | Zielgruppe deutschsprachig; doppelte Texte laufen auseinander (REV-11) | Review (C5, U5), Akzeptanztests prüfen Texte wörtlich |
| Farben, Abstände, Radien, Schatten nur über Tokens aus `src/app/globals.css`, neue Farbe = neues Token in `docs/design.md` | Einheitliches Erscheinungsbild, Anti-Slop-Regeln (`docs/design.md`); harte Werte sind nicht änderbar (REV-07) | Review (U4) |
| Bedienelemente sind `button`/`a`/`input` mit Beschriftung; Fehler mit `aria-invalid`; Dialoge mit Fokusfalle, Escape und Fokus-Rückgabe; kein `outline: none` ohne sichtbaren Ersatz | Tastatur- und Screenreader-Bedienung; Tests finden Elemente über Rollen | Review (U2, U3), Testing-Library- und Playwright-Abfragen per Rolle |
| `prefers-reduced-motion` respektieren; kein horizontales Scrollen bei 360 px | Barrierefreiheit, NFR-3 | Review (U6), TC-A-27, TC-A-43 |

#### Tests
| Regel | Begründung | Durchgesetzt durch |
| --- | --- | --- |
| Orakel (erwarteter Text, Zahl, URL, Attribut) steht im Test, Hilfsfunktionen bedienen nur | Ein Test ist ohne Nachschlagen prüfbar und kann nicht still „immer grün“ werden | Review (A2), Rolle tester |
| Supabase-Integrationstests nur bedingt (`describe.skipIf`), nie gegen Produktivdaten ohne Aufräumen | Echte DB findet Fehler, die Mocks nicht finden (BUG-01); Testdaten dürfen nicht sichtbar bleiben (BUG-03) | Review (A6), Teststrategie |
| Testdaten ohne echte personenbezogene Daten; Passwörter in Tests zur Laufzeit erzeugt | Datenschutz, keine Secrets im Repo | Review (C6), Schutz-Hook |

Konkrete technische Durchsetzung:

- ESLint: `@typescript-eslint/no-explicit-any` und `ban-ts-comment` als Fehler, `noInlineConfig` – ein `eslint-disable`
  im Code wirkt nicht (`specs/F-00/log.md`, Schritt 10).
- TypeScript `strict` (`tsconfig.json`); `make typecheck` = `next typegen && tsc --noEmit`.
- Schutz-Hook: lehnt für Agenten Schreiben außerhalb ihrer Rolle ab, außerdem `git push`, `git pull`, `git merge`,
  Commits auf `main`, `--no-verify` und `.env`-Dateien (`docs/prozess.md`).
- Kognitive Komplexität ≤ 15 wird **nicht** von ESLint im Projekt geprüft, sondern im Review und durch SE-Eval
  (letzte Messung: Median 1, P90 3, 0 Funktionen über 15; `docs/teststrategie.md` Abschnitt 7).

Nachweis der Einhaltung (Lauf am 23.11.2026, `npx tsc --noEmit` 0 Fehler, `npx eslint src e2e tests` 0 Befunde;
`docs/testing/testbericht.md`). Ein erneuter Lauf `npm run check` am 23.11.2026 durch den reporter über den Arbeitsstand
(Commit `4fd94ad` plus nicht committete Änderungen) war grün: Lint ohne Befund, Typprüfung ohne Fehler,
262 Tests bestanden, 2 übersprungen.

## 4. Dokumentation im Code

Regeln (`CLAUDE.md`, „Nachvollziehbarkeit“; `docs/coding-standards.md`, „Dokumentation im Code“):

- Jede Datei beginnt mit einem Satz zu ihrer Aufgabe und der Feature-ID.
- Jede öffentliche Funktion hat einen Kommentar mit Zweck, Eingaben, Rückgabe, Fehlerfällen und Feature-ID.
- Kommentare erklären das Warum, nicht das Was.
- Jeder Testname nennt das Akzeptanzkriterium (`F-22 AK2: …`), damit Anforderung und Test verbunden sind.

**Beispiel 1 – Kopfkommentar und Funktionskommentar** (`src/lib/events/participation.ts`):

```ts
// Fachregeln für Teilnehmen, Verlassen und Absagen eines Treffens. Liefert neue Objekte, ändert nichts an der Eingabe (F-00).

/**
 * Prüft vorab, ob eine Person beitreten kann, ohne etwas zu ändern.
 * Eingaben: Treffen aus Sicht der betrachtenden Person (`isViewerParticipant`, `participantCount`), aktueller Zeitpunkt.
 * Rückgabe: `canJoin: true` oder Grund mit deutscher Meldung. Gäste werden hier nicht abgewiesen,
 * damit die Oberfläche zur Anmeldung führen kann.
 * Feature: F-22, F-02
 */
export function checkJoinAvailability(event: SportEvent, now = new Date()): JoinAvailability {
  const reason = findJoinBlockReason(event, now);
  return reason === null ? { canJoin: true } : { canJoin: false, reason, message: blockMessages[reason] };
}
```

Sichtbar: Zeit wird als Parameter übergeben (testbar, Regel E5), der Kommentar erklärt das Warum („Gäste werden hier
nicht abgewiesen, damit die Oberfläche zur Anmeldung führen kann“).

**Beispiel 2 – Konfiguration mit Begründung** (`playwright.config.ts`, Kopf):

```ts
// Playwright: E2E-Tests in e2e/ gegen den Entwicklungsserver auf Port 3010, mobil (Pixel 7) und Desktop.
// Lokaler Modus (ohne Supabase-Variablen) und Offline-Karte, damit die Tests ohne Netz laufen.
```

**Beispiel 3 – Testname als Dokumentation** (`docs/testing/testfaelle.md`, TC-U-07):
`participation.test.ts › F-00 AK2: verhindert Doppelteilnahme und Überbelegung, ohne die Eingabe zu ändern`.

Zur Datenbank: Die Migration `supabase/migrations/0001_initial_schema.sql` kommentiert Rechte und Funktionen; ihr
Kopfkommentar „NICHT gegen eine Datenbank ausgeführt“ ist laut Review überholt (REV-09).

## 5. Übereinstimmung mit der Architektur

Ergebnis des Gesamt-Reviews vom 23.11.2026 über Commit `9f79927` (`docs/testing/review-protokoll.md`):
0 blockierend, 6 wichtig, 9 Hinweise. Nachprüfung auf `004a9fa`: 10 behoben (je Befund ein Commit), 5 offen
(REV-02, REV-09, REV-10, REV-13, REV-14).

| Architekturregel | Ergebnis | Beleg |
| --- | --- | --- |
| Abhängigkeitsrichtung (ADR-0003) | eingehalten | Kernlogik importiert weder Datenzugriff noch Oberfläche (E2) |
| Information Hiding | eingehalten | kein `@supabase/*` außerhalb `src/lib/data` (E3) |
| Sicherheitsgrenze in der Datenbank (ADR-0002, ADR-0006, ADR-0007) | eingehalten | RLS auf allen Tabellen, Schreiben nur per RPC, Zeilensperre und Check-Constraint (S1–S3) |
| Kernlogik in `src/lib`, nicht in Komponenten | behoben | „Heute/Morgen“-Berechnung als `describeDayLabel` in `src/lib/events` (REV-04, `126600d`) |
| Gleiche Regeln in TS und SQL (ADR-0009) | behoben | 12-h-Regel in der Kernlogik (REV-01/BUG-04, `ded1894`); Kostenobergrenze 5000 Cent auch im Schema (REV-08, Migration `0002`) |
| Design-Tokens (`docs/design.md`) | behoben | neue Tokens, keine festen Farbwerte mehr in `src/components/**/*.css` (REV-07, `c369461`) |
| Reine Logik in `src/lib` statt in der Oberfläche (ADR-0004, ADR-0005) | nachträglich behoben | Commit `ebe3eb4`: `sheet-snap` nach `src/lib/ui`, `map-theme` nach `src/lib/map` verschoben |

Bekannte bewusste Abweichungen laut Architektur: Teilnahmeregeln doppelt in TypeScript und SQL (ADR-0003, ADR-0006),
Wertelisten doppelt (ADR-0009), Abhängigkeitsrichtung Datenzugriff → Kernlogik (ADR-0003), gespeicherter
Belegungszähler (ADR-0006).

## 6. Technische Schulden

`docs/tech-debt.md` enthält noch keine Einträge. Das Review vom 23.11.2026 schlägt folgende Einträge vor
(`docs/testing/review-protokoll.md`, Abschnitt „Technische Schulden“); eingetragen hat sie der Orchestrator noch nicht.
REV-07 ist inzwischen behoben (`c369461`); offen bleiben:

| Befund | Was | Warum aufschiebbar (laut Review) |
| --- | --- | --- |
| REV-10 | `organizer_id` (Konto-Kennung) für anonyme Leser sichtbar | solange nur Kursbetrieb mit Testkonten; vor dem Nutzertest P6 entscheiden |
| REV-13 | Typbehauptung `as unknown as EventRow` statt generierter Supabase-Typen | Risiko durch Integrationstests abgefedert |
| REV-14 | Komplexitätsregel nicht im Lint | SE-Eval misst |

Weiterer offener Befund mit Wirkung auf den Code: REV-02 (Supabase-Datenzugriff im Standardlauf: `supabase-event-repository.ts`
36,95 % Zeilen, `supabase-auth-gateway.ts` 71,42 %; der volle Lauf gegen die echte DB war grün, 285/285, läuft aber nicht in der CI)
und REV-09 (veralteter Kopfkommentar der Migration). Behoben: REV-01, -03, -04, -05, -06, -07, -08, -11, -12, -15.

## 7. Einsatz von KI bei der Programmierung

Der Code entsteht mit Claude Code in festen Agentenrollen (`docs/prozess.md`): tester schreibt aus der Spec fehlschlagende
Tests, coder macht sie grün (darf Tests nicht ändern), reviewer prüft gegen Spec, Architektur und Regeln. Der Mensch gibt
Spec, Push und Merge frei. Sichtbar im Repository: getrennte Commits „Tests für …“ vor den Umsetzungs-Commits
(z. B. `d93e8de` vor `90cf99b` für F-22) und Protokolle je Story (`specs/F-XX/log.md`) mit ausgeführten Befehlen und
Auffälligkeiten. Bei Login, Rechten und Schema markiert der Agent „Mensch muss diesen Code selbst lesen“
(z. B. `specs/F-01/log.md`).

## 8. Lücken

Siehe auch `abgabe/LUECKEN.md`.

| Bewertungskriterium | Was fehlt | Was das Team nachliefern muss |
| --- | --- | --- |
| Übereinstimmung mit der Architektur | 5 Befunde offen (REV-02, -09, -10, -13, -14); menschliches Review von Migration und Auth-Dateien steht aus | Befunde beheben oder als technische Schuld eintragen; Review vermerken |
| Technische Schulden | `docs/tech-debt.md` leer | Vorschläge aus dem Review eintragen und entscheiden |
| Begründete Standards | einige Quellen „offen“ (`docs/management/praktiken.md`, Review-Leitfaden zur Größenbegrenzung) | Quellen prüfen und ergänzen |
| Projektstruktur | `docs/architecture.md` nennt noch `repository-factory`, `auth-gateway (geplant)` | Ordnerstruktur in der Architektur aktualisieren |
| Konfigurationsmanagement | Arbeit lief am 23.11.2026 auf `develop` in Einzelcommits, nicht als ein Branch und Pull Request je Story | erklären oder ab jetzt Branch/PR je Story nachweisen |
