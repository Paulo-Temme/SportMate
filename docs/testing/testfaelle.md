# Testfallkatalog SportMate

Stand: 23.11.2026, ermittelt aus den Testdateien: Akzeptanztests von Commit `9f79927`; Vitest-Zahlen aus dem JSON-Lauf über den
Arbeitsstand vom 23.11.2026, 13:15 (Commit `9f79927` plus nicht committete Änderungen des Coders an
`event-presentation.test.ts` und `event-card.test.tsx`; der Coverage-Lauf um 13:13 zählte noch 245 statt 247 Fälle). Strategie und Regeln: `docs/teststrategie.md`. Ergebnisse der Läufe: `docs/testing/testbericht.md`.

Jede Zeile nennt Story/AK, Vorbedingung, Eingabe, das erwartete Ergebnis (Test-Orakel, steht so im Test) und die Fundstelle
`Datei › Testname`. Gemeinsame Vorbedingung aller Akzeptanztests: Dev-Server im lokalen Modus mit Demodaten relativ zu „jetzt“,
Offline-Karte, `de-DE`, `Europe/Berlin`; jeder Test läuft in beiden Projekten (Mobile Chrome = Pixel 7, Desktop Chrome).

## Übersicht

| Ebene | IDs | Anzahl Testfälle (automatisch) | davon im Katalog einzeln |
| --- | --- | --- | --- |
| Unit (`src/lib`) | TC-U-01 … TC-U-25 | 200 in 14 Dateien | 25 (repräsentativ) |
| Komponente (`src/components`) | TC-K-01 … TC-K-15 | 39 in 7 Dateien | 15 (repräsentativ) |
| Integration (`tests/integration`) | TC-I-01 … TC-I-08 | 8 in 3 Dateien (2 davon nur gegen echte DB) | 8 (vollständig) |
| Akzeptanz / E2E (`e2e`) | TC-A-01 … TC-A-51 | 51 Tests × 2 Projekte = 102 Läufe | 51 (vollständig) |
| Manuell / explorativ | TC-M-01 … TC-M-10 | – | 10 |

Hinweis: Im Arbeitsstand nach `9f79927` kam ein weiterer Akzeptanztest hinzu (`e2e/f-12-details.spec.ts › F-12 AK2 (FB-45): Treffen
ohne Altersgrenze zeigt "Alter: offen für alle"`, nicht committet, im Lauf vom 23.11.2026 noch nicht enthalten). Er wird nach dem Commit als TC-A-52 geführt.

## Unit-Tests: Anzahl je Datei

| Datei | Tests | Gegenstand |
| --- | ---: | --- |
| `src/lib/events/event-creation.test.ts` | 44 | Erstellen, Feldvalidierung, Randwerte |
| `src/lib/data/supabase-error-translation.test.ts` | 32 | Datenbank- und Auth-Codes → deutsche Meldungen |
| `src/lib/events/event-presentation.test.ts` | 22 | Plätze, Status, Alter, Kosten, Datum |
| `src/lib/events/demo-events.test.ts` | 14 | Demodaten relativ zu „jetzt“, Zeitumstellung |
| `src/lib/auth/credential-validation.test.ts` | 13 | Registrierungseingaben |
| `src/lib/events/event-search.test.ts` | 11 | Suche, Filter, Zeitraum, Berliner Kalendertag |
| `src/lib/events/participation.test.ts` | 11 | Teilnehmen, Verlassen, Absagen, Vorabprüfung |
| `src/lib/data/local-auth-gateway.test.ts` | 11 | lokale Anmeldung |
| `src/lib/data/local-event-repository.test.ts` | 10 | lokaler Datenzugriff |
| `src/lib/data/supabase-gateways.test.ts` | 10 | Supabase-Gateways mit gemocktem Client |
| `src/lib/data/data-services.test.ts` | 9 | Wahl lokal/Supabase |
| `src/lib/data/local-session.test.ts` | 6 | geteilte Sitzung |
| `src/lib/data/event-row-mapping.test.ts` | 5 | Zeile ↔ Modell |
| `src/lib/events/list-order.test.ts` | 2 | Ausgebuchte zuletzt |
| **Summe** | **200** | |

Vitest gesamt: 200 Unit + 39 Komponente + 8 Integration = 247 Fälle (davon 2 Supabase-Fälle ohne `SUPABASE_INTEGRATION=1` übersprungen).

## Unit-Tests (repräsentative Auswahl)

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

## Komponententests

Anzahl je Datei: `event-draft.test.ts` 11 · `event-card.test.tsx` 8 · `sheet-snap.test.ts` 7 · `filter-controls.test.tsx` 6 ·
`step-fields.test.tsx` 3 · `return-path.test.ts` 2 · `map-theme.test.ts` 2 = **39**.

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
| TC-K-14 | F-05 AK1 | Sheet | Tastatur Pfeil hoch/runter | ein Rastpunkt weiter | `sheet-snap.test.ts › stepSnapPoint F-05 AK1: Tastatur bewegt das Sheet um einen Rastpunkt` |
| TC-K-15 | F-08 AK1 | Positron-Stil | `buildMapTheme` | Wasser bläulich-grau, Grün blass, Straßen weiß (Token-Farben) | `map-theme.test.ts › F-08 AK1: Wasser bläulich-grau, Grünflächen blass, Straßen weiß` |

## Integrationstests (vollständig)

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

## Akzeptanztests (vollständig)

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
| TC-A-08 | F-02 AK2/AK3 | Gast, Details „Badminton zu zweit“ | „Jetzt teilnehmen“; Anmeldung als Lea; erneut „Jetzt teilnehmen“ | URL `/anmelden?weiter=%2Ftreffen%2Fdemo-badminton-halle`; danach `/treffen/demo-badminton-halle` mit „1 von 2 Plätzen frei“ (kein Auto-Beitritt); nach Klick Status „Du bist angemeldet“, „Du bist dabei“ | `f-02-gast.spec.ts › F-02 AK2/AK3: "Jetzt teilnehmen" führt zur Anmeldung und danach zurück, ohne automatisch beizutreten` |
| TC-A-09 | F-02 AK4 | Gast, Entdecken | „Treffen erstellen“ | URL `/anmelden`, Überschrift „Anmelden“ | `f-02-gast.spec.ts › F-02 AK4: Gäste landen bei "Treffen erstellen" in der Anmeldung` |
| TC-A-10 | F-31 AK1/AK2 | Erstbesuch | Hinweis lesen, „Treffen entdecken“, neu laden | drei Schritte „Sportart auswählen“, „Treffen finden“, „Gemeinsam Sport machen“; nach Schließen und Neuladen kein Hinweis | `f-02-gast.spec.ts › F-31 AK1/AK2: Erstbesuch-Hinweis erklärt SportMate in drei Schritten und bleibt nach dem Schließen weg` |
| TC-A-11 | F-32 AK1 | lokaler Modus | `/` und `/profil` | „Demo-Modus – Beispieldaten, nichts wird gespeichert“ auf beiden | `f-02-gast.spec.ts › F-32 AK1: im lokalen Modus steht dauerhaft der Demo-Hinweis` |
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
| TC-A-24 | F-08 AK1 | Entdecken | Chip Fußball | Marker = Karten = Trefferzahl; nach Filter weniger und Marker = neue Zahl | `f-08-karte.spec.ts › F-08 AK1: Anzahl der Marker entspricht der Trefferzahl, auch nach dem Filtern` |
| TC-A-25 | F-08 AK2 | Entdecken, mobil Sheet auf „peek“ | Klick Marker `demo-tischtennis-duburg` | URL `/treffen/demo-tischtennis-duburg`, Überschrift, Marker `aria-pressed="true"` | `f-08-karte.spec.ts › F-08 AK2: Klick auf einen Marker öffnet die Details und markiert ihn` |
| TC-A-26 | F-08 AK3 | Offline-Karte | Details über die Liste öffnen | „Karte offline“, „Karte nicht verfügbar“; Liste bedienbar | `f-08-karte.spec.ts › F-08 AK3: ohne Kartenkacheln bleibt die Liste bedienbar und die Karte ist als offline gekennzeichnet` |
| TC-A-27 | F-08 AK4 | Viewport 360×740 | Entdecken, Details, `/anmelden` | `scrollWidth − clientWidth ≤ 0` auf allen drei | `f-08-karte.spec.ts › F-08 AK4: bei 360 px Breite gibt es kein seitliches Scrollen` |
| TC-A-28 | F-12 AK1 | Entdecken | Details „Fußball am Campus – Anfänger willkommen“ | „Fußball“, „17:00–19:00 Uhr“, „Campus Flensburg, Sportplatz (Beispiel)“, „Niveau: Anfänger“, „Anfänger willkommen“, „5 von 10 Plätzen frei“ | `f-12-details.spec.ts › F-12 AK1: zeigt Sportart, Zeit, Treffpunkt, Niveau und freie Plätze` |
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
| TC-A-45 | F-22 AK1, F-24 | Lea, Details Badminton zu zweit | „Jetzt teilnehmen“, dann Meine Treffen | Status „Du bist angemeldet“ (Text betroffen von BUG-02); „Ausgebucht“; Eintrag mit „Angemeldet“ | `f-22-teilnahme.spec.ts › F-22 AK1: Beitritt zeigt "Du bist angemeldet", danach ausgebucht und unter Meine Treffen` |
| TC-A-46 | F-22 AK1 | Lea, Entdecken | „Jetzt teilnehmen“ auf Karte Basketball | Status „Du bist angemeldet“, „Dabei“, „5 von 10 Plätzen frei“ | `f-22-teilnahme.spec.ts › F-22 AK1: Beitritt direkt aus der Liste` |
| TC-A-47 | F-22 AK2 | Lea | Karte und Details Volleyball an der Hafenspitze | Button „Ausgebucht“ deaktiviert, kein „Jetzt teilnehmen“ | `f-22-teilnahme.spec.ts › F-22 AK2: ausgebuchtes Treffen bietet keinen Beitritt` |
| TC-A-48 | F-23 AK1 | Tom, Details „Strandlauf Solitüde“ (10 von 12 frei) | „Teilnahme zurückziehen“, Dialog „Zurückziehen“ | Status „Teilnahme zurückgezogen“, „11 von 12 Plätzen frei“, nicht mehr unter Meine Treffen | `f-22-teilnahme.spec.ts › F-23 AK1: Teilnahme zurückziehen gibt den Platz frei und entfernt das Treffen aus Meine Treffen` |
| TC-A-49 | F-24 AK1/AK2 | Lea | Meine Treffen › „Ich organisiere“ | Strandlauf mit „Organisiert von dir“, Beachvolleyball mit „Abgesagt“ | `f-22-teilnahme.spec.ts › F-24 AK1/AK2: zeigt organisierte Treffen mit "Organisiert von dir" und abgesagte mit "Abgesagt"` |
| TC-A-50 | F-24 AK3 | Lea ohne Teilnahmen | Meine Treffen | „Noch keine Treffen“, Link „Zur Übersicht“ | `f-22-teilnahme.spec.ts › F-24 AK3: ohne Teilnahmen erscheint "Noch keine Treffen" mit Link zur Übersicht` |
| TC-A-51 | F-18 AK1 | Lea, Details Strandlauf Solitüde | „Treffen absagen“, Dialog bestätigen, „Alle Treffen“ | Status „Treffen abgesagt“, „Abgesagt“; nicht mehr in Liste, kein Marker `demo-laufen-solitude` | `f-22-teilnahme.spec.ts › F-18 AK1: Organisatorin sagt ab; Treffen ist abgesagt und verschwindet aus Liste und Karte` |

## Manuelle und explorative Testfälle

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
