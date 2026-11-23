# Leitfaden für Reviews und Inspektionen

Gilt für die Selbstprüfung (coder), den reviewer (Agent, vor dem Push) und die zweite Person im Pull Request (Mensch, vor dem Merge).
Ergebnisse: Agent je Story `specs/F-XX/review.md`; Gesamt-Review eines Stands `docs/testing/review-protokoll.md`;
Mensch: Review im Pull Request. Verhaltensfehler zusätzlich als `BUG-xx` in `docs/testing/fehlerprotokoll.md`.

## Ablauf

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

## Schweregrade

| Grad | Bedeutung | Beispiele | Folge |
| --- | --- | --- | --- |
| **blockierend** | AK nicht erfüllt, Fehler im Verhalten mit Datenverlust oder Sicherheitsfolge, Architekturregel verletzt, Regel umgangen | Schreibrecht ohne RLS/RPC, `any`/`eslint-disable`, AK ohne Test, Kernlogik importiert Oberfläche | kein Merge |
| **wichtig** | Fehlverhalten mit Umweg, spürbar schlechtere Wartbarkeit, Barrierefreiheit eingeschränkt, Testlücke an riskanter Stelle | doppelte Logik, harte Farbwerte statt Token, Fokus verlässt Dialog, Datenzugriff nur durch übersprungene Tests gedeckt | beheben oder als technische Schuld eintragen |
| **Hinweis** | Verbesserungsidee, veralteter Kommentar, Geschmack | doppelter Meldungstext, Kommentar passt nicht mehr | Autorin oder Autor entscheidet |

(Der reviewer-Agent nennt „wichtig“ in älteren Reviews „sollte“; beide Wörter bedeuten dasselbe.)

## Checkliste Stufe 1: Spec-Konformität
- **A1** Jedes Akzeptanzkriterium hat einen Test auf der festgelegten Ebene; der Testname nennt `F-XX AKn`.
- **A2** Jeder Test prüft ein Ergebnis mit sichtbarem Orakel (Text, Zahl, URL, `aria-invalid`), nicht nur „kein Absturz“. Er würde bei falscher Umsetzung rot.
- **A3** Fehlerfälle und Randwerte der Spec sind getestet (leer, Minimum, Maximum, eins darüber).
- **A4** Nichts gebaut, was nicht in der Spec steht. Nichts aus der Spec fehlt.
- **A5** Tests wurden vor dem Code committet. Alle Commits beginnen mit der Feature-ID.
- **A6** Keine umgangenen Regeln: `skip`, `todo`, `only`, `any`, `@ts-ignore`, `@ts-expect-error`, `eslint-disable`. Erlaubt ist nur `describe.skipIf(!enabled)` für die Supabase-Integration.
- **A7** Manuelle Testfälle sind ausführbar beschrieben (Vorbedingung, Schritte, Eingaben, erwartetes Ergebnis).

## Checkliste Stufe 2: Entwurf (Architekturregeln)
- **E1** Der Code liegt im Baustein, den `docs/architecture.md` vorsieht (Fachregeln in `src/lib/events`, Datenzugriff in `src/lib/data`, UI in `src/components`/`src/app`).
- **E2** Abhängigkeitsrichtung (ADR-0003): Oberfläche → Kernlogik; Oberfläche → Datenzugriff **nur über die Schnittstellen** `EventRepository`/`AuthGateway`/`data-services`; Datenzugriff → Kernlogik. `src/lib/events` und `src/lib/auth` importieren nichts aus `src/lib/data`, `src/components`, `src/app`, `src/hooks`. Prüfung: `grep -rn "from '" src/lib/events src/lib/auth`.
- **E3** Information Hiding: Tabellen- und Spaltennamen, SQL-Fehlercodes und `supabase-js` erscheinen nur in `src/lib/data`. Keine Komponente importiert `@supabase/*`.
- **E4** Hohe Kohäsion: jede Datei, jede Funktion hat eine Aufgabe; Kopfkommentar nennt sie.
- **E5** Lose Kopplung: Kernlogik bekommt Zeit (`now`) und Daten als Parameter, liest keine Uhr, keinen Speicher, kein Netz.
- **E6** Nichts doppelt: Fachlogik (Datum „Heute/Morgen“, freie Plätze, Teilnahmeregeln, Meldungstexte) einmal in `src/lib`, UI nutzt sie. Bewusste Doppelungen TS ↔ SQL nur mit ADR (ADR-0006, ADR-0009) und gleichen Grenzwerten.
- **E7** Abweichungen von der Architektur haben eine Notiz in `docs/decisions/`.

## Checkliste Stufe 2: Code
- **C1** Namen nach `docs/coding-standards.md` (camelCase mit Verb, PascalCase, kebab-case-Dateien, keine Abkürzungen).
- **C2** Jede Datei beginnt mit einem Satz zur Aufgabe und der Feature-ID; jede exportierte Funktion hat einen Kommentar mit Zweck, Eingaben, Rückgabe, Fehlerfällen, Feature-ID.
- **C3** Kognitive Komplexität ≤ 15, höchstens drei Ebenen Verschachtelung (Messung: SE-Eval/sonarjs; ESLint prüft das im Projekt nicht).
- **C4** Eingaben von außen (Formular, URL-Parameter wie `weiter=`, Antworten von Supabase) werden geprüft, bevor sie verwendet werden.
- **C5** Fehler werden behandelt oder weitergegeben, nicht verschluckt. **Fehlertexte für Nutzende sind deutsch**, kurz, sagen, was zu tun ist, und stammen aus genau einer Stelle (`supabase-error-translation.ts`, `event-validation.ts`, `auth-error.ts`).
- **C6** Keine Secrets, keine echten personenbezogenen Daten in Code, Logs, Testdaten; `.env` nicht im Repo.
- **C7** Keine Typ-Umgehungen (`any`, `as unknown as` nur an der Grenze zu Supabase-Antworten mit Kommentar), `strict` bleibt an.
- **C8** Kein toter Code, keine auskommentierten Blöcke, kein `console.log`.
- **C9** Tests: Name mit `F-XX AKn`, Orakel im Test, unabhängig von Uhrzeit/Netz/Reihenfolge.
- **C10** Neue Abhängigkeiten (npm) haben eine Entscheidungsnotiz.

## Checkliste Stufe 2: Oberfläche (U)
- **U1** Zustände leer, lädt, Fehler, Erfolg sind gestaltet (`docs/design.md` „Ehrliche Zustände“).
- **U2** Barrierefreiheit: alle Bedienelemente sind echte `button`/`a`/`input` mit sichtbarer oder `aria-label`-Beschriftung; Formularfehler mit `aria-invalid` und verknüpfter Meldung; Statusmeldungen mit `role="status"`.
- **U3** Tastatur: alles erreichbar; sichtbarer Fokus (`:focus-visible`, kein `outline: none` ohne Ersatz); modale Dialoge setzen den Fokus hinein, halten ihn dort (Fokusfalle), schließen mit Escape und geben den Fokus an den Auslöser zurück.
- **U4** Design-Tokens: Farben, Abstände, Radien, Schatten nur über die Variablen aus `src/app/globals.css` (`--bg`, `--ink`, `--accent` …). Keine harten Hex-Werte in `*.module.css`; neue Farbe = neues Token in `docs/design.md`.
- **U5** Anti-Slop (`docs/design.md`): keine Verläufe, kein Glassmorphism, keine Emojis, keine Floskeln, keine englischen Reste; ein Akzent nur für Handlung/Zustand.
- **U6** `prefers-reduced-motion` schaltet Animationen ab; keine horizontale Scrollleiste bei 360 px.

## Checkliste Stufe 2: Sicherheit (S) – immer mit menschlichem Review
- **S1** Jede Tabelle hat RLS. Lesen nur, was öffentlich sein soll; fremde Teilnahmen nur über eine prüfende Funktion.
- **S2** Schreiben ausschließlich über RPC-Funktionen. `security definer` nur mit `set search_path = ''`, voll qualifizierten Namen und Identität **nur** aus `auth.uid()` (nie aus Parametern). `EXECUTE` für `public`/`anon` entzogen, nur `authenticated` erlaubt.
- **S3** Fachliche Invarianten liegen in der Datenbank: Überbuchung per Zeilensperre (`select … for update`) **und** Check-Constraint; Rechte (nur Organisator sagt ab) in der Funktion, nicht nur in der Oberfläche.
- **S4** Fehler der Datenbank als stabiler Code (`EVENT_FULL`), Übersetzung ins Deutsche an einer Stelle; keine internen Details an Nutzende.

## Protokollformat

Jeder Befund ist eine Tabellenzeile:

| ID | Datei:Zeile | Prüfpunkt | Schweregrad | Beschreibung | Empfehlung | Status |
| --- | --- | --- | --- | --- | --- | --- |
| REV-01 | `src/…/datei.ts:42` | E6 | wichtig | was ist falsch, mit Beleg | was konkret tun | offen / behoben (Commit) / akzeptiert (Begründung) |

Kopf des Protokolls: Datum, geprüfter Commit (`git rev-parse --short HEAD`), Umfang (Dateien/Ordner), Prüfende Rolle,
Ergebnis der Prüfläufe. Fuß: Zusammenfassung (Anzahl je Schweregrad), technische Schulden, Hinweis auf menschliches Review.
Verhaltensfehler bekommen zusätzlich eine `BUG-xx`-Zeile im Fehlerprotokoll (Schritte, erwartet, tatsächlich).

## Inspektion von Dokumenten
- **D1** Spec: Herkunft belegt, jedes Kriterium eindeutig und prüfbar, keine mehrdeutigen Wörter, Fehlerfälle vorhanden.
- **D2** Architektur: jede Sicht vorhanden, Notation einheitlich, Entscheidung gegen eine Alternative begründet, jede Story in „Anforderung → Realisierung“.
- **D3** Migration: Kopfkommentar aktuell (Zustand „ausgeführt am …“), jede Rechte-Änderung kommentiert, Prüfschritte in `supabase/README.md`.

## Grundlage
Vorbereitung, Prüfung mit Checkliste, Befundliste und Nacharbeit folgen der Inspektion nach Fagan (1976), „Design and code
inspections to reduce errors in program development“, IBM Systems Journal 15(3). Die Größenbegrenzung und das leichtgewichtige
Vorgehen im Pull Request: Quelle offen, vom Team zu belegen.
