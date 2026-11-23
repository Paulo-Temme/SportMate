# Coding-Standards

Die Regeln aus `CLAUDE.md`, mit Begründung und der Stelle, an der sie durchgesetzt werden.
`CLAUDE.md` bleibt die Kurzfassung für Agenten. Ändert sich eine Regel, werden beide Dateien geändert.

Welche Lint-Regeln aktiv sind, steht in `eslint.config.mjs` des Projekts. Was dort nicht geprüft wird, prüft das Review.

Durchsetzung: Lint und Typprüfung (`make check`, CI) · Schutz-Hook (`.claude/hooks/guard.mjs`) ·
Review (`docs/review-leitfaden.md`, Prüfpunkt in Klammern) · SE-Eval (Messung je Epic).

## Entwurf
| Regel | Begründung | Durchgesetzt durch |
| --- | --- | --- |
| Eine Datei, eine Aufgabe | Hohe Kohäsion: Änderungen bleiben an einer Stelle | Review (E4) |
| Kernlogik in `src/lib/`, kennt die Oberfläche nicht | Lose Kopplung: Kernlogik ist ohne Browser testbar und austauschbar | Review (E2, E5), Mutation Testing in SE-Eval |
| Abhängigkeiten nur Oberfläche → Kernlogik → Datenzugriff | Keine Zyklen, Änderungen wirken nur nach oben | Review (E2) |
| Module geben nur frei, was andere brauchen | Information Hiding: Interna können sich ändern, ohne andere zu brechen (Parnas 1972) | Review (E3) |
| Nichts doppelt | Ein Fehler wird an einer Stelle behoben | Review (E6), Duplikate in SE-Eval |
| Einfachste Lösung, Muster nur bei vorhandenem Problem | Unnötige Abstraktion kostet Verständnis | Review (E6) |

## Namen
| Regel | Begründung | Durchgesetzt durch |
| --- | --- | --- |
| Variablen und Funktionen `camelCase`, Funktionen beginnen mit Verb | Üblich in TypeScript; Verb zeigt, dass etwas getan wird | Review (C1) |
| Typen und Komponenten `PascalCase`, Substantiv | Üblich in TypeScript und React; unterscheidet Typ von Wert | Review (C1) |
| Dateien `kebab-case` | Keine Probleme zwischen Dateisystemen mit und ohne Groß-/Kleinschreibung | Review (C1) |
| Keine Abkürzungen, keine Namen wie `data`, `utils2`, `tmp` | Namen sind die häufigste Dokumentation (Martin 2008, Kap. 2) | Review (C1) |

## Dokumentation im Code
| Regel | Begründung | Durchgesetzt durch |
| --- | --- | --- |
| Jede Datei beginnt mit einem Satz zu ihrer Aufgabe | Rolle der Datei ist ohne Lesen des Codes erkennbar | Review (C2) |
| Jede öffentliche Funktion: Zweck, Eingaben, Rückgabe, Fehlerfälle, Feature-ID | Schnittstelle ist ohne Lesen des Rumpfs nutzbar; Feature-ID führt zur Spec | Review (C2) |
| Kommentare erklären das Warum, nicht das Was | Das Was steht im Code und veraltet im Kommentar | Review (C2) |

## Komplexität und Typen
| Regel | Begründung | Durchgesetzt durch |
| --- | --- | --- |
| Kognitive Komplexität je Funktion höchstens 15 | Misst, wie schwer Code zu verstehen ist (Campbell 2018); 15 ist der Standardwert von SonarSource | Review (C3), SE-Eval (sonarjs). **Nicht** im Projekt-ESLint (kein `sonarjs`-Plugin, REV-14) |
| `as unknown as` nur an der Grenze zu Supabase-Antworten, mit Kommentar | Eine Typbehauptung ohne Prüfung verschiebt Fehler in die Laufzeit (vgl. BUG-01) | Review (C7, REV-13) |
| Kein `any`, `@ts-ignore`, `@ts-expect-error`, `eslint-disable` | Schaltet genau die Prüfung ab, die Fehler vor der Laufzeit findet | Lint, Review (A6), SE-Eval zählt Umgehungen |
| `strict` in `tsconfig.json` | Findet fehlende Werte und falsche Typen beim Übersetzen | Typprüfung |

## Tests und Ablauf
| Regel | Begründung | Durchgesetzt durch |
| --- | --- | --- |
| Tests zuerst, getrennter Commit | Test beschreibt die Anforderung, bevor die Lösung sie verbiegt (Beck 2002) | Rollen tester und coder, Schutz-Hook, Review (A5) |
| Wer umsetzt, ändert keine Tests | Sonst wird der Test der Umsetzung angepasst statt umgekehrt | Schutz-Hook |
| Testname nennt `F-XX AKn` | Nachvollziehbarkeit von Anforderung zu Test | `make trace`, Review (A1) |
| Commit beginnt mit Feature-ID, eine Story = ein Branch = ein Pull Request | Jede Änderung führt zu ihrer Anforderung; kleine Pull Requests sind prüfbar | Review (A5), geschützter `main` |
| Kein Commit auf `main`, kein Push oder Merge durch Agenten | Der Mensch verantwortet, was ins Projekt kommt | Schutz-Hook, Rechte in `.claude/settings.json` |
| Keine Secrets im Code, `.env` für Agenten gesperrt | Zugangsdaten gehören nicht ins Repo und nicht in Sitzungen | Schutz-Hook, Rechte |

## Projektspezifische Regeln SportMate

### Schichten und Datenzugriff
| Regel | Begründung | Durchgesetzt durch |
| --- | --- | --- |
| `src/lib/events` und `src/lib/auth` importieren nichts aus `src/lib/data`, `src/components`, `src/app`, `src/hooks` | Kernlogik bleibt rein und ohne Browser testbar; Mutation Testing zielt auf `src/lib` (ADR-0003) | Review (E2, Prüfbefehl im Leitfaden) |
| Oberfläche nutzt Daten nur über `EventRepository`, `AuthGateway`, `data-services`; kein `@supabase/*` außerhalb `src/lib/data` | Lokaler Demo-Modus und Supabase bleiben austauschbar; Tabellen- und Fehlercodes bleiben verborgen | Review (E3) |
| Fachlogik (Datum, Plätze, Teilnahme, Filter) nur in `src/lib/events`, nicht in Komponenten | Einmal schreiben, einmal testen, mit Mutation messen (Gegenbeispiel REV-04) | Review (E1, E6) |
| Zeit wird übergeben (`now`), Kernlogik liest keine Uhr | Wiederholbare Tests mit festem Zeitpunkt, Zeitumstellung prüfbar | Review (E5), Unit-Tests mit festem `now` |
| Grenzwerte und Wertelisten einmal in `event-model.ts`/`eventLimits`; SQL-Checks nennen dieselben Werte | TS und SQL prüfen dieselben Regeln doppelt (ADR-0009); weichen sie ab, verhalten sich die Modi verschieden (BUG-04, REV-08) | Review (E6), Supabase-Integrationstests |

### Sicherheit (immer mit menschlichem Review)
| Regel | Begründung | Durchgesetzt durch |
| --- | --- | --- |
| RLS auf jeder Tabelle; Schreiben nur über RPC-Funktionen | Der Browser spricht direkt mit Supabase (ADR-0007); nur die Datenbank ist Sicherheitsgrenze | Review (S1, S2), Integrationstest „direktes Update wirkungslos“ (TC-I-07), TC-M-10 |
| `security definer` nur mit `set search_path = ''`, voll qualifizierten Namen, Identität aus `auth.uid()`; `EXECUTE` nur für `authenticated` | Verhindert Rechteausweitung über Suchpfad oder gefälschte Parameter | Review (S2), Mensch liest jede Migration |
| Fachliche Invarianten in der DB: Zeilensperre plus Check-Constraint | Zwei gleichzeitige Beitritte auf den letzten Platz werden serialisiert (ADR-0006) | Review (S3) |
| Datenbankfehler als stabiler Code, Übersetzung nur in `supabase-error-translation.ts` | Keine internen Details an Nutzende; eine Stelle für alle Texte | Review (S4, C5), Unit-Tests der Übersetzung |

### Texte und Oberfläche
| Regel | Begründung | Durchgesetzt durch |
| --- | --- | --- |
| Alle sichtbaren Texte und Fehlermeldungen deutsch, kurz, mit Handlungshinweis; eine Quelle je Meldung | Zielgruppe deutschsprachig; doppelte Texte laufen auseinander (REV-11) | Review (C5, U5), Akzeptanztests prüfen Texte wörtlich |
| Farben, Abstände, Radien, Schatten nur über Tokens aus `src/app/globals.css`, neue Farbe = neues Token in `docs/design.md` | Einheitliches Erscheinungsbild, Anti-Slop-Regeln (`docs/design.md`); harte Werte sind nicht änderbar (REV-07) | Review (U4) |
| Bedienelemente sind `button`/`a`/`input` mit Beschriftung; Fehler mit `aria-invalid`; Dialoge mit Fokusfalle, Escape und Fokus-Rückgabe; kein `outline: none` ohne sichtbaren Ersatz | Tastatur- und Screenreader-Bedienung; Tests finden Elemente über Rollen | Review (U2, U3), Testing-Library- und Playwright-Abfragen per Rolle |
| `prefers-reduced-motion` respektieren; kein horizontales Scrollen bei 360 px | Barrierefreiheit, NFR-3 | Review (U6), TC-A-27, TC-A-43 |

### Tests
| Regel | Begründung | Durchgesetzt durch |
| --- | --- | --- |
| Orakel (erwarteter Text, Zahl, URL, Attribut) steht im Test, Hilfsfunktionen bedienen nur | Ein Test ist ohne Nachschlagen prüfbar und kann nicht still „immer grün“ werden | Review (A2), Rolle tester |
| Supabase-Integrationstests nur bedingt (`describe.skipIf`), nie gegen Produktivdaten ohne Aufräumen | Echte DB findet Fehler, die Mocks nicht finden (BUG-01); Testdaten dürfen nicht sichtbar bleiben (BUG-03) | Review (A6), Teststrategie |
| Testdaten ohne echte personenbezogene Daten; Passwörter in Tests zur Laufzeit erzeugt | Datenschutz, keine Secrets im Repo | Review (C6), Schutz-Hook |

## Quellen
- Beck, K. (2002): Test-Driven Development: By Example. Addison-Wesley.
- Campbell, G. A. (2018): Cognitive Complexity. A new way of measuring understandability. SonarSource.
- Martin, R. C. (2008): Clean Code. A Handbook of Agile Software Craftsmanship. Prentice Hall.
- Parnas, D. L. (1972): On the criteria to be used in decomposing systems into modules. Communications of the ACM 15(12).

Das Team prüft diese Angaben vor der Abgabe und ergänzt eigene Quellen.
