# Backlog

Status: offen · in Arbeit · teilweise · umgesetzt. „umgesetzt“ nur, wenn zu jedem AK ein Test existiert und im Endlauf grün war;
„teilweise“, wenn einzelne AKs fehlen, abweichen oder ungetestet sind. Jede Person hat höchstens eine Story "in Arbeit".
Quelle: Feedback-ID (`FB-03`), Hypothese (`H-1`), Ziel aus der Vision (`Z1`), Altanforderung aus `P3/traceability.csv`
(`DR-…`, `NFR-…`, `SM-R…`) oder "Annahme" (noch nicht mit echten Personen geprüft).
Priorität: MoSCoW (Must / Should / Could / Won't). Größe: S / M / L. Ticket: Nummer im Projekt-Board.
Release 1 = Umfang für Präsentation 5 (25.11.2026). Das Board zeigt den Fortschritt, diese Datei steuert die Agenten.
Stand: Entwurf vom 2026-11-23 (analyst/planner), Freigabe durch das Team offen. Status aktualisiert nach dem Endlauf vom
23.11.2026 (Commit `004a9fa`, Vitest 283/2 übersprungen, mit DB 285/285, Playwright 117/1 übersprungen).

Gemeinsame Begriffe für alle Akzeptanzkriterien:
- Sportarten, Niveaus und Altersgruppen wie in `src/lib/events/event-model.ts` (F-00): Niveaus „Alle Niveaus“,
  „Anfänger“, „Fortgeschritten“, „Erfahren“; Altersgruppen „unter 20“, „20–25“, „26–30“, „31–40“, „über 40“, leer = offen für alle.
- Kapazität 2–50 Plätze einschließlich organisierender Person (P3-Entscheidung F01). Freie Plätze = Kapazität − Teilnehmende.
- Zeiten in Europe/Berlin. „Jetzt“ ist in jedem Testfall fest vorgegeben.
- Datenquelle: Supabase (Auth E-Mail/Passwort, Postgres mit RLS) oder lokaler Demo-Modus (F-32). Jede Story
  funktioniert in beiden Modi, wenn nicht anders angegeben.

## Übersicht

| Epic | ID | Story | Quelle | Größe | Priorität | Release 1 | Status | Wer | Ticket |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| E-1 Konto und Anmeldung | F-01 | Registrieren, anmelden, abmelden | DR-1.1.1–3, SM-R01, FB-35 | M | Must | ja | umgesetzt | | |
| E-1 | F-02 | Ohne Konto stöbern, Anmeldung erst beim Mitmachen | DR-1.1.4, SM-R27, FB-35 | S | Must | ja | umgesetzt | | |
| E-1 | F-03 | Profil mit Anzeigename, Sportarten, Niveau, Altersgruppe | DR-1.2.1–3, SM-R02, FB-38 | M | Should | nein | offen | | |
| E-1 | F-04 | Konto und eigene Daten löschen | C-1 DSGVO | S | Could | nein | offen | | |
| E-2 Treffen entdecken | F-05 | Liste kommender Treffen | SM-R03, DR-2.1.3–4, FB-33, FB-46, FB-47 | M | Must | ja | umgesetzt | | |
| E-2 | F-06 | Filter Sportart und Zeitraum mit Leerzustand | DR-2.2.1–3, SM-R04, SM-R28, FB-32, FB-21 | M | Must | ja | umgesetzt | | |
| E-2 | F-07 | Filter Niveau und Altersgruppe | DR-2.3.1–2, FB-03 | S | Must | ja | umgesetzt | | |
| E-2 | F-08 | Karte mit denselben Treffen wie die Liste | DR-2.1.3, SM-R03, FB-48, FB-33 | M | Should | ja | umgesetzt | | |
| E-2 | F-09 | Freitextsuche | Annahme | S | Could | nein | umgesetzt | | |
| E-2 | F-10 | Ortssuche und Umkreis ohne Standortfreigabe | DR-2.1.2, DR-2.4.1, SM-R06, SM-R22, FB-14, FB-04 | M | Should | nein | offen | | |
| E-2 | F-11 | Optional eigenen Gerätestandort verwenden | DR-2.1.1, SM-R22, FB-14 | S | Could | nein | offen | | |
| E-3 Treffen-Details | F-12 | Detailansicht mit Treffpunkt, Niveau, eindeutiger Altersangabe und freien Plätzen | DR-2.5.1, SM-R05, FB-45, FB-46, FB-13, FB-31 | M | Must | ja | teilweise | | |
| E-3 | F-13 | Kosten, Mitbringen und „Was erwartet dich?“ | FB-49, FB-31, FB-15, FB-52, FB-30, H-4 | S | Must | ja | teilweise | | |
| E-3 | F-14 | Organisator im Treffen erkennen | SM-R05, FB-51, FB-38, FB-15 | S | Should | nein | teilweise | | |
| E-3 | F-15 | Link zu einem Treffen teilen | SM-R27, FB-21 | S | Should | nein | teilweise | | |
| E-3 | F-16 | Route zum Treffpunkt in Karten-App öffnen | DR-2.5.2 | S | Could | nein | offen | | |
| E-4 Treffen organisieren | F-17 | Treffen erstellen | DR-3.1.1–5, SM-R07, SM-R23, NFR-2, FB-05, FB-37, FB-54 | M | Must | ja | umgesetzt | | |
| E-4 | F-18 | Eigenes Treffen absagen | DR-3.3.2, SM-R09, SM-R21, FB-20 | S | Must | ja | umgesetzt | | |
| E-4 | F-19 | Eigenes Treffen bearbeiten | DR-3.3.1, SM-R08, FB-19, FB-57 | M | Should | nein | offen | | |
| E-4 | F-20 | Teilnehmerliste sehen | SM-R13, FB-18, FB-37, FB-56 | S | Should | nein | teilweise | | |
| E-4 | F-21 | Teilnehmende aus eigenem Treffen entfernen | FB-55 | S | Could | nein | offen | | |
| E-5 Teilnahme | F-22 | Einem Treffen beitreten („Jetzt teilnehmen“) | DR-4.1.1–4, SM-R10–11, NFR-5, FB-44, FB-34, FB-19 | M | Must | ja | teilweise | | |
| E-5 | F-23 | Teilnahme zurückziehen | DR-4.2.1, SM-R12, FB-34, FB-16 | S | Must | ja | umgesetzt | | |
| E-5 | F-24 | Meine Treffen | DR-4.1.2, FB-57, FB-37 | S | Must | ja | umgesetzt | | |
| E-5 | F-25 | Mindestteilnehmerzahl mit Status „Sucht Mitspieler“ / „Findet statt“ | DR-3.2.1–2, FB-06, FB-41 | S | Should | nein | umgesetzt | | |
| E-6 Hinweise | F-26 | In-App-Hinweis bei Änderung oder Absage | SM-R14, DR-3.3.1–2, FB-20, FB-36, FB-16 | M | Should | nein | offen | | |
| E-6 | F-27 | Hinweis an Organisator bei Zu- und Absage | DR-4.3.1, DR-4.2.1, FB-06, FB-55 | S | Could | nein | offen | | |
| E-6 | F-28 | Hinweis, wenn Mindestzahl 2 Stunden vor Beginn fehlt | DR-3.2.3 | M | Could | nein | offen | | |
| E-6 | F-29 | E-Mail bei kurzfristiger Absage | FB-36, FB-20 | M | Could | nein | offen | | |
| E-6 | F-30 | Nachricht an alle Teilnehmenden | FB-56 (Widerspruch FB-40, FB-21) | M | Won't | nein | offen | | |
| E-7 Einstieg und Betrieb | F-31 | Startseite mit Erklärung und zwei Einstiegen | FB-58, H-2 | S | Should | nein | teilweise | | |
| E-7 | F-32 | Lokaler Demo-Modus ohne Server | C-2, Z5, SM-R30 | M | Must | ja | umgesetzt | | |
| E-8 Sportstätten-Buchungspilot | F-33 | Hallenanfrage mit Status „Angefragt“ | DR-5.1.1–2, DR-5.2.1, SM-R16, FB-24, FB-26, FB-39 | L | Could | nein | offen | | |
| E-8 | F-34 | Preis und Stornobedingungen vor dem Absenden | DR-5.4.1–2, SM-R15, FB-27, FB-39 | S | Could | nein | offen | | |
| E-8 | F-35 | Betreiber bestätigt oder lehnt ab, keine Doppelbestätigung | DR-5.2.2, DR-5.3.1, SM-R17–20, SM-R29, NFR-6, NFR-7, FB-28 | L | Won't | nein | offen | | |

Release 1: 14 Stories (13 Must, 1 Should). Stand Endlauf: 11 umgesetzt, 3 teilweise (F-12, F-13, F-22). Außerhalb
von Release 1 vorgezogen: F-09, F-25 umgesetzt; F-14, F-15, F-20, F-31 teilweise. Vorgeschlagene Reihenfolge der Umsetzung:
F-32 → F-05 → F-12 → F-13 → F-06 → F-07 → F-08 → F-01 → F-02 → F-17 → F-22 → F-23 → F-24 → F-18.
Hinweis: Bis 25.11.2026 bleiben zwei Tage. Was davon tatsächlich fertig wird, entscheidet das Team; Reihenfolge so,
dass jeder Zwischenstand vorführbar ist (Demo-Modus zuerst, Supabase-Konto danach).

---

## E-1 Konto und Anmeldung
Ziel: Z3, Z5. Besondere Vorsicht: Login und Rechte (im Protokoll markieren).

### F-01 Registrieren, anmelden, abmelden
- **User Story:** Als Sportinteressierte möchte ich mich mit E-Mail und Passwort registrieren und anmelden, damit ich Treffen erstellen und ihnen beitreten kann.
- **Quelle:** DR-1.1.1, DR-1.1.2, DR-1.1.3, SM-R01; FB-35 (Konto zum Mitmachen okay). Offener Konflikt F04: 8 oder 12 Zeichen Mindestlänge – hier gilt DR-1.1.2 (8), bis das Team entscheidet.
- **Priorität / Größe / Release 1:** Must / M / ja · **Status:** umgesetzt (AK1–AK6 Akzeptanztests grün (Endlauf 23.11.2026))
- **Akzeptanzkriterien:**
  - AK1: Gegeben keine Person mit `lea@example.org`. Wenn sie sich mit dieser E-Mail und dem Passwort `sportmate1` registriert, dann ist sie angemeldet und die Kopfzeile zeigt „Abmelden“.
  - AK2: Gegeben das Registrierformular. Wenn das Passwort `kurz12` (6 Zeichen) eingegeben wird, dann wird kein Konto angelegt und „Mindestens 8 Zeichen“ erscheint.
  - AK3: Gegeben ein bestehendes Konto `lea@example.org`. Wenn sich jemand erneut mit dieser E-Mail registriert, dann wird kein zweites Konto angelegt und „Diese E-Mail wird bereits verwendet“ erscheint.
  - AK4: Gegeben ein Konto `lea@example.org` / `sportmate1`. Wenn die Anmeldung mit dem Passwort `falsch123` erfolgt, dann bleibt die Person abgemeldet und „E-Mail oder Passwort falsch“ erscheint.
  - AK5: Gegeben eine angemeldete Person. Wenn sie „Abmelden“ wählt, dann ist sie abgemeldet und „Treffen erstellen“ führt wieder zur Anmeldung.
  - AK6 (ergänzt 23.11.2026, Test TC-A-53): Gegeben angemeldete `Lea`. Wenn sie `/anmelden` öffnet, dann sieht sie „Du bist bereits angemeldet als Lea.“ mit Link „Zum Profil“ statt des Formulars.

### F-02 Ohne Konto stöbern, Anmeldung erst beim Mitmachen
- **User Story:** Als neue Besucherin möchte ich Treffen ohne Konto ansehen und erst beim Mitmachen zur Anmeldung geleitet werden, damit ich vorher prüfen kann, ob es passende Angebote gibt.
- **Quelle:** DR-1.1.4, SM-R27 (Rücksprung), SM-R21; FB-35.
- **Priorität / Größe / Release 1:** Must / S / ja · **Status:** umgesetzt (AK1–AK4 Akzeptanztests grün)
- **Akzeptanzkriterien:**
  - AK1: Gegeben eine nicht angemeldete Person und 3 kommende Treffen. Wenn sie die Treffenübersicht öffnet, dann sieht sie alle 3 Treffen und deren Details ohne Anmeldeaufforderung.
  - AK2: Gegeben eine nicht angemeldete Person in den Details von Treffen `t-volleyball-1`. Wenn sie „Jetzt teilnehmen“ wählt, dann erscheint die Anmeldung und sie ist nicht Teilnehmerin.
  - AK3: Gegeben AK2. Wenn sie sich erfolgreich anmeldet, dann ist sie zurück in den Details von `t-volleyball-1` (Teilnahme wird nicht automatisch ausgelöst).
  - AK4: Gegeben eine nicht angemeldete Person. Wenn sie „Treffen erstellen“ wählt, dann erscheint die Anmeldung statt des Formulars.

### F-03 Profil mit Anzeigename, Sportarten, Niveau, Altersgruppe
- **User Story:** Als Sportinteressierte möchte ich einen Anzeigenamen sowie meine Sportarten mit Niveau und meine Altersgruppe angeben, damit andere sehen, wer ich bin, ohne private Daten preiszugeben.
- **Quelle:** DR-1.2.1, DR-1.2.2, DR-1.2.3, SM-R02 (Konflikt F07: Umfang öffentlicher Felder); FB-38, FB-35 (kein Pflicht-Langprofil).
- **Priorität / Größe / Release 1:** Should / M / nein · **Status:** offen
- **Akzeptanzkriterien:**
  - AK1: Gegeben eine angemeldete Person. Wenn sie Anzeigename `Lea`, Sportart Volleyball mit Niveau „Anfänger“ und Altersgruppe „20–25“ speichert, dann zeigt ihr Profil genau diese Werte.
  - AK2: Gegeben das Profilformular. Wenn der Anzeigename `L` (1 Zeichen) lautet, dann wird nicht gespeichert und „2–40 Zeichen“ erscheint.
  - AK3: Gegeben ein gespeichertes Profil. Wenn eine andere Person es ansieht, dann sieht sie Anzeigename, Sportarten mit Niveau und Altersgruppe, aber weder E-Mail noch Geburtsdatum.
  - AK4: Gegeben eine neu registrierte Person ohne Profilangaben. Wenn sie einem Treffen beitreten will, dann ist das ohne Ausfüllen des Profils möglich.

### F-04 Konto und eigene Daten löschen
- **User Story:** Als Nutzerin möchte ich mein Konto löschen, damit meine Daten nicht weiter gespeichert werden.
- **Quelle:** C-1 (DSGVO, Löschmöglichkeit). Kein Feedback, rechtliche Vorgabe.
- **Priorität / Größe / Release 1:** Could / S / nein · **Status:** offen
- **Akzeptanzkriterien:**
  - AK1: Gegeben eine angemeldete Person mit Teilnahme an einem kommenden Treffen. Wenn sie „Konto löschen“ bestätigt, dann ist sie abgemeldet, die Anmeldung mit ihren Zugangsdaten schlägt fehl und das Treffen hat einen Teilnehmenden weniger.
  - AK2: Gegeben eine Person, die ein kommendes Treffen organisiert. Wenn sie „Konto löschen“ wählt, dann erscheint der Hinweis „Sage zuerst deine Treffen ab“ und nichts wird gelöscht.

## E-2 Treffen entdecken
Ziel: Z1.

### F-05 Liste kommender Treffen
- **User Story:** Als Sportinteressierter möchte ich alle kommenden Treffen in einer Liste mit freien Plätzen sehen, damit ich schnell ein Treffen finde, bei dem noch Platz ist.
- **Quelle:** SM-R03, DR-2.1.3, DR-2.1.4 (Konflikt F03: begonnene Treffen werden nicht gezeigt); FB-33, FB-46, FB-47, FB-29.
- **Priorität / Größe / Release 1:** Must / M / ja · **Status:** umgesetzt (AK1–AK3, AK5 E2E grün, AK4 Unit (TC-U-14) grün)
- **Akzeptanzkriterien:**
  - AK1: Gegeben jetzt = 2026-11-25 10:00 und Treffen A (heute 18:00), B (morgen 12:00), C (gestern 18:00), D (heute 12:00, abgesagt). Wenn die Liste geladen wird, dann zeigt sie genau A, dann B.
  - AK2: Gegeben Treffen A mit Kapazität 10 und 5 Teilnehmenden. Wenn die Liste angezeigt wird, dann steht auf der Karte von A „5 von 10 Plätzen frei“.
  - AK3: Gegeben Treffen A (heute 18:00, ausgebucht 10 von 10) und B (morgen 12:00, 3 frei) und Sortierung „Ausgebuchte zuletzt“ (Standard). Wenn die Liste angezeigt wird, dann steht B vor A und A trägt „Ausgebucht“.
  - AK4: Gegeben jetzt = 2026-11-25 18:00 und Treffen A mit Beginn 18:00. Wenn die Liste geladen wird, dann ist A nicht enthalten.
  - AK5 (ergänzt 23.11.2026, Test TC-A-56): Gegeben die Startseite. Wenn nacheinander „Meine Treffen“, „Treffen erstellen“, „Profil“ und „Entdecken“ in der Tab-Leiste angeklickt werden, dann öffnet sich jeweils das Ziel und „Entdecken“ ist am Ende als aktuelle Seite markiert.

### F-06 Filter Sportart und Zeitraum mit Leerzustand
- **User Story:** Als Sportinteressierte möchte ich nach Sportarten und Zeitraum filtern, damit ich nicht durch unpassende Treffen scrollen muss.
- **Quelle:** DR-2.2.1, DR-2.2.2, DR-2.2.3, SM-R04, SM-R28; FB-32, FB-43, FB-21.
- **Priorität / Größe / Release 1:** Must / M / ja · **Status:** umgesetzt (AK1, AK2, AK4, AK5 E2E grün, AK2/AK3 zusätzlich Unit/Komponente)
- **Akzeptanzkriterien:**
  - AK1: Gegeben Treffen Fußball, Volleyball, Laufen. Wenn die Sportarten Volleyball und Laufen gewählt sind, dann zeigt die Liste genau Volleyball und Laufen (ODER-Verknüpfung).
  - AK2: Gegeben jetzt = Mittwoch 2026-11-25 10:00 und Treffen am 25.11. 18:00, 26.11. 18:00, 29.11. 10:00, 02.12. 10:00. Wenn „Heute“ gewählt ist, dann nur 25.11.; „Morgen“ nur 26.11.; „Diese Woche“ 25.11., 26.11. und 29.11.
  - AK3: Gegeben dieselben Treffen. Wenn das Datum 2026-12-02 gewählt ist, dann zeigt die Liste nur das Treffen vom 02.12.
  - AK4: Gegeben Sportart Basketball gewählt und kein Basketball-Treffen. Wenn gefiltert wird, dann erscheint „Keine Treffen gefunden“ mit dem Link „Selbst ein Treffen erstellen“.
  - AK5: Gegeben Filter Volleyball + „Heute“. Wenn „Filter zurücksetzen“ gewählt wird, dann zeigt die Liste wieder alle kommenden Treffen.

### F-07 Filter Niveau und Altersgruppe
- **User Story:** Als Sportinteressierte möchte ich nach Niveau und Altersgruppe filtern, damit ich mit Leuten spiele, die zu mir passen.
- **Quelle:** DR-2.3.1, DR-2.3.2; FB-03 (Alter 3/4, Niveau 2/4), FB-12, FB-50.
- **Priorität / Größe / Release 1:** Must / S / ja · **Status:** umgesetzt (AK1–AK3 E2E grün)
- **Akzeptanzkriterien:**
  - AK1: Gegeben Treffen mit Niveau „Anfänger“, „Fortgeschritten“, „Alle Niveaus“. Wenn „Anfänger“ gewählt ist, dann zeigt die Liste „Anfänger“ und „Alle Niveaus“.
  - AK2: Gegeben Treffen mit Altersgruppe „20–25“, „31–40“ und ohne Altersgruppe. Wenn „20–25“ gewählt ist, dann zeigt die Liste „20–25“ und das Treffen ohne Altersgruppe.
  - AK3: Gegeben Niveau „Erfahren“ und Altersgruppe „unter 20“ gewählt, kein passendes Treffen. Wenn gefiltert wird, dann erscheint der Leerzustand aus F-06 AK4.

### F-08 Karte mit denselben Treffen wie die Liste
- **User Story:** Als Neue in Flensburg möchte ich die Treffen auf einer Karte sehen, damit ich erkenne, wo sie stattfinden.
- **Quelle:** DR-2.1.3, SM-R03; FB-48 (Karte gefällt); Widerspruch FB-33 (Liste reicht) – deshalb Should, Liste ist Must.
- **Priorität / Größe / Release 1:** Should / M / ja · **Status:** umgesetzt (AK1–AK6 E2E grün, AK3/AK5/AK6 zusätzlich Unit)
- **Akzeptanzkriterien:**
  - AK1: Gegeben 4 Treffen nach Filtern. Wenn die Karte angezeigt wird, dann zeigt sie genau diese 4 Treffen, einzeln oder gruppiert (angepasst 23.11.2026 wegen AK5).
  - AK2: Gegeben die Karte mit Treffen `t-volleyball-1`. Wenn die Markierung gewählt wird, dann öffnen sich die Details von `t-volleyball-1`.
  - AK3: Gegeben die Kartenkacheln laden nicht (Netzwerkfehler simuliert). Wenn die Seite angezeigt wird, dann bleibt die Liste vollständig bedienbar und die Karte zeigt „Karte nicht verfügbar“.
  - AK4: Gegeben Bildschirmbreite 360 px. Wenn Karte und Liste angezeigt werden, dann gibt es kein horizontales Scrollen (NFR-3).
  - AK5 (ergänzt 23.11.2026, Tests TC-A-57, TC-U-31): Gegeben mehrere Treffen nah beieinander. Wenn die Karte angezeigt wird, dann überlappen sich keine Markierungen; überlappende werden zu einer Gruppe mit Anzahl zusammengefasst.
  - AK6 (ergänzt 23.11.2026, Tests TC-A-58, TC-U-32): Gegeben eine Gruppe mit Anzahl. Wenn sie angeklickt wird, dann erscheinen ihre Treffen einzeln; „Alle Treffen auf der Karte zeigen“ stellt die Gesamtansicht wieder her.

### F-09 Freitextsuche
- **User Story:** Als Sportinteressierter möchte ich nach einem Wort suchen, damit ich ein Treffen wiederfinde, von dem ich gehört habe.
- **Quelle:** Annahme des Teams, nicht validiert (Suchfeld bereits im Datenmodell F-00).
- **Priorität / Größe / Release 1:** Could / S / nein · **Status:** umgesetzt (AK1–AK2 E2E grün (vorgezogen, nicht Release 1))
- **Akzeptanzkriterien:**
  - AK1: Gegeben Treffen „Beachvolleyball Solitüde“ und „Feierabendlauf Hafen“. Wenn `hafen` eingegeben wird, dann zeigt die Liste nur „Feierabendlauf Hafen“ (Groß-/Kleinschreibung egal, Suche in Titel, Treffpunkt, Beschreibung).
  - AK2: Gegeben Suchtext `   ` (nur Leerzeichen). Wenn gesucht wird, dann zeigt die Liste alle Treffen.

### F-10 Ortssuche und Umkreis ohne Standortfreigabe
- **User Story:** Als Studentin möchte ich einen Stadtteil eingeben und einen Umkreis wählen, ohne meinen Standort freizugeben, damit ich nur Treffen in erreichbarer Nähe sehe.
- **Quelle:** DR-2.1.2, DR-2.4.1, SM-R06, SM-R22; FB-14, FB-04 (2–10 km), FB-32.
- **Priorität / Größe / Release 1:** Should / M / nein · **Status:** offen
- **Akzeptanzkriterien:**
  - AK1: Gegeben der Umkreisfilter. Wenn er geöffnet wird, dann bietet er 2, 5, 10 und 20 km an, 5 km ist vorausgewählt.
  - AK2: Gegeben Suchpunkt Flensburg-Mürwik und Treffen in 1,8 km, 4,9 km und 7 km Entfernung, Umkreis 5 km. Wenn gefiltert wird, dann zeigt die Liste die Treffen in 1,8 km und 4,9 km.
  - AK3: Gegeben keine Standortfreigabe. Wenn `Weiche` als Stadtteil gewählt wird, dann wird die Karte auf Weiche zentriert und der Umkreis von dort berechnet.
  - AK4: Gegeben eine Suche mit Suchpunkt. Wenn sie ausgeführt wurde, dann ist der Suchpunkt weder im Konto noch in der Datenbank gespeichert (Integrationstest, SM-R22).

### F-11 Optional eigenen Gerätestandort verwenden
- **User Story:** Als Sportinteressierter möchte ich für eine einzelne Suche meinen Standort freigeben können, damit ich keinen Ort eintippen muss.
- **Quelle:** DR-2.1.1, SM-R22; FB-14 (nur für eine einzelne Suche, nicht dauerhaft).
- **Priorität / Größe / Release 1:** Could / S / nein · **Status:** offen
- **Akzeptanzkriterien:**
  - AK1: Gegeben die Freigabe wird erteilt (Position 54.79 N, 9.43 O simuliert). Wenn „Meinen Standort verwenden“ gewählt wird, dann wird die Karte darauf zentriert.
  - AK2: Gegeben die Freigabe wird verweigert. Wenn „Meinen Standort verwenden“ gewählt wird, dann erscheint „Standort nicht freigegeben – gib einen Ort ein“ und die Ortssuche aus F-10 ist fokussiert.
  - AK3: Gegeben eine Suche mit Gerätestandort. Wenn eine andere Person das Treffen ansieht, dann sieht sie diesen Standort nirgends.

## E-3 Treffen-Details
Ziel: Z3. Hypothese H-4.

### F-12 Detailansicht mit Treffpunkt, Niveau, eindeutiger Altersangabe und freien Plätzen
- **User Story:** Als Sportinteressierte möchte ich alle wichtigen Angaben eines Treffens auf einen Blick sehen, damit ich vor der Zusage entscheiden kann.
- **Quelle:** DR-2.5.1, SM-R05; FB-45 (Altersangabe), FB-46 (Plätze), FB-13 (Treffpunkt), FB-31, FB-15, FB-50.
- **Priorität / Größe / Release 1:** Must / M / ja · **Status:** teilweise (AK3–AK5 grün; AK1 und AK2 weichen im Wortlaut ab (siehe Hinweis))
- **Akzeptanzkriterien:**
  - AK1: Gegeben Treffen Volleyball, 2026-11-26 18:00–20:00, Treffpunkt „Sporthalle Sandberg, Eingang Nord“, Niveau „Anfänger“, Kapazität 12, 7 Teilnehmende. Wenn die Details geöffnet werden, dann stehen dort Sportart, „Do, 26.11.2026, 18:00–20:00 Uhr (2 Std.)“, der Treffpunkttext, „Niveau: Anfänger“ und „5 von 12 Plätzen frei“.
  - AK2: Gegeben Altersgruppe „20–25“. Wenn die Details angezeigt werden, dann steht dort „Alter: 20–25 Jahre (Wunsch des Organisators)“.
  - AK3: Gegeben keine Altersgruppe. Wenn die Details angezeigt werden, dann steht dort „Alter: offen für alle“.
  - AK4: Gegeben ein Treffen mit 12 von 12 Teilnehmenden. Wenn die Details angezeigt werden, dann steht dort „Ausgebucht“ statt „0 von 12 Plätzen frei“.
  - AK5: Gegeben ein abgesagtes Treffen über einen direkten Link. Wenn die Details geöffnet werden, dann steht „Abgesagt“ und es gibt keinen Teilnahme-Button.
- **Hinweis Umsetzung (23.11.2026):** Die App zeigt den Termin als „Do, 26.11., 18:00–20:00 Uhr · 2 Std.“ (ohne Jahr, Dauer nach Mittelpunkt) und die Altersangabe als „Alter: 20–25 Jahre“ ohne „(Wunsch des Organisators)“. Ob AK1/AK2 an die Umsetzung angepasst oder die Umsetzung nachgezogen wird, entscheidet das Team (offen).

### F-13 Kosten, Mitbringen und „Was erwartet dich?“
- **User Story:** Als Neue in Flensburg möchte ich sehen, ob ein Treffen etwas kostet, was ich mitbringen muss und was mich erwartet, damit ich ohne Überraschungen hingehe.
- **Quelle:** FB-49, FB-31, FB-15, FB-52, FB-30, FB-22, H-4. Neue Felder gegenüber DR/SM-R (Datenbankschema: im Protokoll markieren).
- **Priorität / Größe / Release 1:** Must / S / ja · **Status:** teilweise (AK1, AK3 grün; AK2 ohne Kostenhinweis „(Hallenmiete)“ geprüft, AK4 (reiner Text, `<b>` wörtlich) ohne Test)
- **Akzeptanzkriterien:**
  - AK1: Gegeben ein Treffen mit Kosten 0. Wenn die Details angezeigt werden, dann steht dort „Kostenlos“; in der Liste ebenfalls „Kostenlos“.
  - AK2: Gegeben Kosten 3,50 € pro Person mit Hinweis „Hallenmiete“. Wenn die Details angezeigt werden, dann steht dort „3,50 € pro Person (Hallenmiete)“.
  - AK3: Gegeben Mitbringen „Hallenschuhe, Wasser“. Wenn die Details angezeigt werden, dann steht dort „Mitbringen: Hallenschuhe, Wasser“; bei leerem Feld „Mitbringen: nichts Besonderes“.
  - AK4: Gegeben Beschreibung „Lockeres Spiel, Neue sind willkommen“. Wenn die Details angezeigt werden, dann steht der Text unter „Was erwartet dich?“ als reiner Text (eingegebenes `<b>` erscheint wörtlich, SM-R23).

### F-14 Organisator im Treffen erkennen
- **User Story:** Als Sportinteressierte möchte ich sehen, wer ein Treffen organisiert, damit ich nicht zu völlig Unbekannten an einen unbekannten Ort gehe.
- **Quelle:** SM-R05; FB-51, FB-38, FB-15.
- **Priorität / Größe / Release 1:** Should / S / nein · **Status:** teilweise (AK2 grün; AK1 nur „Organisiert von …“, ohne Anzahl organisierter Treffen)
- **Akzeptanzkriterien:**
  - AK1: Gegeben Organisator mit Anzeigename `Max`, der 3 weitere vergangene Treffen organisiert hat. Wenn die Details angezeigt werden, dann steht dort „Organisiert von Max · 4 Treffen organisiert“.
  - AK2: Gegeben derselbe Organisator. Wenn die Details angezeigt werden, dann erscheinen weder E-Mail noch andere Kontaktdaten.

### F-15 Link zu einem Treffen teilen
- **User Story:** Als Organisator möchte ich einen Link zu meinem Treffen kopieren, damit meine bestehende WhatsApp-Gruppe sich direkt dort anmelden kann.
- **Quelle:** SM-R27; FB-21.
- **Priorität / Größe / Release 1:** Should / S / nein · **Status:** teilweise (nur AK3 (unbekannter Link) umgesetzt und grün; „Link kopieren“ fehlt)
- **Akzeptanzkriterien:**
  - AK1: Gegeben Treffen `t-volleyball-1`. Wenn „Link kopieren“ gewählt wird, dann enthält die Zwischenablage `<Basis-URL>/treffen/t-volleyball-1` und „Link kopiert“ erscheint.
  - AK2: Gegeben dieser Link. Wenn er in einem neuen Browser ohne Anmeldung geöffnet wird, dann erscheinen die Details von `t-volleyball-1`.
  - AK3: Gegeben ein Link `/treffen/gibt-es-nicht`. Wenn er geöffnet wird, dann erscheint „Treffen nicht gefunden“ mit Link zur Übersicht.

### F-16 Route zum Treffpunkt in Karten-App öffnen
- **User Story:** Als Teilnehmerin möchte ich die Route zum Treffpunkt öffnen, damit ich den Ort finde.
- **Quelle:** DR-2.5.2.
- **Priorität / Größe / Release 1:** Could / S / nein · **Status:** offen
- **Akzeptanzkriterien:**
  - AK1: Gegeben ein Treffen bei 54.7749 N, 9.4500 O. Wenn „Route öffnen“ gewählt wird, dann öffnet sich in neuem Tab eine OpenStreetMap-Routen-URL mit diesen Zielkoordinaten.

## E-4 Treffen organisieren
Ziel: Z2. Hypothese H-3a. Besondere Vorsicht: Rechte (RLS) – im Protokoll markieren.

### F-17 Treffen erstellen
- **User Story:** Als Organisatorin möchte ich ein Treffen mit Sportart, Ort, Zeit, Plätzen und Niveau veröffentlichen, damit mir fehlende Mitspieler beitreten.
- **Quelle:** DR-3.1.1–3.1.5, SM-R07, SM-R23, NFR-2; FB-05, FB-37, FB-22, FB-13, FB-54, FB-53.
- **Priorität / Größe / Release 1:** Must / M / ja · **Status:** umgesetzt (AK1–AK5 grün, Höchstdauer 12 h (BUG-04) ergänzt)
- **Akzeptanzkriterien:**
  - AK1: Gegeben jetzt = 2026-11-25 10:00, angemeldete Person `lea`. Wenn sie Titel „Volleyball am Abend“, Volleyball, Treffpunkt „Halle Sandberg, Eingang Nord“, Kartenpunkt, 2026-11-26 18:00–20:00, Kapazität 8, Niveau „Alle Niveaus“, Kosten 0 eingibt und veröffentlicht, dann erscheint das Treffen in der Liste mit „7 von 8 Plätzen frei“ und `lea` ist erste Teilnehmerin.
  - AK2: Gegeben dasselbe Formular ohne Treffpunkttext. Wenn veröffentlicht wird, dann wird nichts gespeichert und das Feld Treffpunkt ist mit „Pflichtfeld“ markiert.
  - AK3: Gegeben Beginn 2026-11-25 09:00 (vor jetzt). Wenn veröffentlicht wird, dann erscheint „Der Termin muss in der Zukunft liegen“; bei Ende 17:00 vor Beginn 18:00 erscheint „Das Ende muss nach dem Beginn liegen“.
  - AK4: Gegeben Kapazität 1 oder 51. Wenn veröffentlicht wird, dann erscheint „2 bis 50 Plätze“ und nichts wird gespeichert.
  - AK5: Gegeben die Übersicht auf 360 px Breite. Wenn sie angezeigt wird, dann ist „Treffen erstellen“ ohne Scrollen sichtbar und als aktiver Button gestaltet (Kontrast mind. 4,5:1).

### F-18 Eigenes Treffen absagen
- **User Story:** Als Organisator möchte ich mein Treffen absagen, damit niemand umsonst zum Treffpunkt kommt.
- **Quelle:** DR-3.3.2, SM-R09, SM-R21; FB-20, FB-41.
- **Priorität / Größe / Release 1:** Must / S / ja · **Status:** umgesetzt (AK1 E2E, AK2 Unit/Integration, AK3 Supabase-Integration (echte DB, 285/285) grün)
- **Akzeptanzkriterien:**
  - AK1: Gegeben `max` organisiert ein kommendes Treffen mit 4 Teilnehmenden. Wenn er „Treffen absagen“ bestätigt, dann ist der Status „Abgesagt“, das Treffen verschwindet aus Liste und Karte und erscheint bei den 4 Teilnehmenden unter „Meine Treffen“ als „Abgesagt“.
  - AK2: Gegeben ein abgesagtes Treffen. Wenn jemand beitreten will, dann wird das abgelehnt.
  - AK3: Gegeben `lea` ist nicht Organisatorin. Wenn sie per direktem Datenbankaufruf (Supabase-Client mit ihrem Token) das Treffen absagen will, dann lehnt die RLS-Regel ab und der Status bleibt unverändert (Integrationstest).

### F-19 Eigenes Treffen bearbeiten
- **User Story:** Als Organisator möchte ich Zeit, Ort und Plätze meines Treffens ändern, damit es zu geänderten Bedingungen passt.
- **Quelle:** DR-3.3.1, SM-R08; FB-19, FB-57.
- **Priorität / Größe / Release 1:** Should / M / nein · **Status:** offen
- **Akzeptanzkriterien:**
  - AK1: Gegeben ein Treffen mit Kapazität 10 und 6 Teilnehmenden. Wenn der Organisator die Kapazität auf 12 ändert, dann zeigt es „6 von 12 Plätzen frei“.
  - AK2: Gegeben dasselbe Treffen. Wenn er die Kapazität auf 5 ändert, dann wird nicht gespeichert und „Mindestens 6 – so viele sind schon angemeldet“ erscheint.
  - AK3: Gegeben ein bereits begonnenes Treffen. Wenn er es bearbeiten will, dann ist „Bearbeiten“ nicht verfügbar.
  - AK4: Gegeben eine andere Person als der Organisator. Wenn sie die Änderung per Datenbankaufruf versucht, dann lehnt die RLS-Regel ab.

### F-20 Teilnehmerliste sehen
- **User Story:** Als Organisatorin möchte ich sehen, wer zugesagt hat, damit ich ohne Rückfragen weiß, wer kommt.
- **Quelle:** SM-R13; FB-18, FB-37, FB-56, FB-38 (nur Namen).
- **Priorität / Größe / Release 1:** Should / S / nein · **Status:** teilweise (AK1/AK2 Unit und Supabase-Integration grün; AK3 ohne eigenen Test)
- **Akzeptanzkriterien:**
  - AK1: Gegeben ein Treffen mit Teilnehmenden `Lea`, `Max`, `Tom`. Wenn die Organisatorin oder eine Teilnehmende die Details öffnet, dann sieht sie die drei Anzeigenamen.
  - AK2: Gegeben eine nicht teilnehmende Person. Wenn sie die Details öffnet, dann sieht sie nur „3 Teilnehmende“, keine Namen.
  - AK3: Gegeben die Liste. Wenn sie angezeigt wird, dann enthält sie keine E-Mail-Adressen.

### F-21 Teilnehmende aus eigenem Treffen entfernen
- **User Story:** Als Organisator möchte ich eine Person aus meinem Treffen entfernen, damit der Platz wieder frei wird, wenn sie nicht kommt.
- **Quelle:** FB-55.
- **Priorität / Größe / Release 1:** Could / S / nein · **Status:** offen
- **Akzeptanzkriterien:**
  - AK1: Gegeben ein Treffen mit 8 von 8 Plätzen belegt, darunter `Tom`. Wenn der Organisator `Tom` entfernt, dann zeigt es „1 von 8 Plätzen frei“ und `Tom` sieht das Treffen nicht mehr unter „Meine Treffen“.
  - AK2: Gegeben der Organisator selbst. Wenn er sich entfernen will, dann ist das nicht möglich (Hinweis: „Sage das Treffen stattdessen ab“, P3-Regel F02).

## E-5 Teilnahme
Ziel: Z1, Z2. Hypothese H-2.

### F-22 Einem Treffen beitreten („Jetzt teilnehmen“)
- **User Story:** Als Sportinteressierte möchte ich mit einem Klick auf „Jetzt teilnehmen“ beitreten und eine Bestätigung sehen, damit ich sicher weiß, dass ich dabei bin.
- **Quelle:** DR-4.1.1–4.1.4, SM-R10, SM-R11, NFR-5; FB-44, FB-34, FB-19, FB-18, FB-23.
- **Priorität / Größe / Release 1:** Must / M / ja · **Status:** teilweise (AK1–AK3, AK5 grün; AK4 nur sequenziell (EVENT_FULL) geprüft, kein Paralleltest)
- **Akzeptanzkriterien:**
  - AK1: Gegeben angemeldete `lea`, Treffen mit 4 von 5 Plätzen belegt. Wenn sie „Jetzt teilnehmen“ wählt, dann erscheint „Du bist dabei“ (geändert 23.11.2026 wegen BUG-02, vorher „Du bist angemeldet“), das Treffen zeigt „Ausgebucht“ (5 von 5) und steht unter „Meine Treffen“.
  - AK2: Gegeben ein ausgebuchtes Treffen. Wenn die Details angezeigt werden, dann ist statt „Jetzt teilnehmen“ „Ausgebucht“ zu sehen und kein Beitritt möglich.
  - AK3: Gegeben `lea` ist bereits Teilnehmerin. Wenn der Beitritt erneut ausgelöst wird (Doppelklick oder Wiederholung nach Netzfehler), dann bleibt die Teilnehmerzahl gleich.
  - AK4: Gegeben 1 freier Platz und zwei Personen treten gleichzeitig bei. Wenn beide Anfragen an Supabase gehen, dann wird genau eine angenommen, die andere sieht „Leider gerade ausgebucht“ (Integrationstest, NFR-5).
  - AK5: Gegeben die Liste. Wenn ein Treffen mit freien Plätzen angezeigt wird, dann trägt seine Karte einen sichtbaren Button „Jetzt teilnehmen“.

### F-23 Teilnahme zurückziehen
- **User Story:** Als Teilnehmerin möchte ich meine Zusage zurückziehen, damit mein Platz frei wird, wenn etwas dazwischenkommt.
- **Quelle:** DR-4.2.1, SM-R12; FB-34, FB-16.
- **Priorität / Größe / Release 1:** Must / S / ja · **Status:** umgesetzt (AK1 E2E, AK2 Unit, AK3 Integration grün)
- **Akzeptanzkriterien:**
  - AK1: Gegeben `lea` nimmt an einem Treffen mit 5 von 5 teil. Wenn sie „Teilnahme zurückziehen“ bestätigt, dann zeigt es „1 von 5 Plätzen frei“ und es steht nicht mehr unter ihren „Meine Treffen“.
  - AK2: Gegeben jetzt ist nach Beginn des Treffens. Wenn sie zurückziehen will, dann ist das nicht möglich.
  - AK3: Gegeben `tom` nimmt am selben Treffen teil. Wenn `lea` zurückzieht, dann bleibt `tom` Teilnehmer.

### F-24 Meine Treffen
- **User Story:** Als Nutzerin möchte ich unter „Meine Treffen“ sehen, was ich organisiere und wo ich zugesagt habe, damit ich den Überblick behalte.
- **Quelle:** DR-4.1.2; FB-57, FB-37.
- **Priorität / Größe / Release 1:** Must / S / ja · **Status:** umgesetzt (AK1–AK4 E2E grün)
- **Akzeptanzkriterien:**
  - AK1: Gegeben `lea` organisiert Treffen A und nimmt an B teil; C kennt sie nicht. Wenn sie „Meine Treffen“ öffnet, dann sieht sie A mit „Organisiert von dir“ und B mit „Angemeldet“, nicht C.
  - AK2: Gegeben B wurde abgesagt. Wenn sie „Meine Treffen“ öffnet, dann steht B mit „Abgesagt“ dort.
  - AK3: Gegeben `lea` hat keine Treffen. Wenn sie „Meine Treffen“ öffnet, dann erscheint „Noch keine Treffen“ mit Link zur Übersicht.
  - AK4 (ergänzt 23.11.2026, Test TC-A-59): Gegeben `lea` organisiert 2 Treffen und nimmt an keinem teil. Wenn sie einem Treffen beitritt und ihr Profil öffnet, dann zeigt es „1“ Treffen dabei und „2“ organisiert, und „Deine Treffen ansehen“ führt zu „Meine Treffen“.

### F-25 Mindestteilnehmerzahl mit Status „Sucht Mitspieler“ / „Findet statt“
- **User Story:** Als Organisatorin möchte ich eine Mindestzahl festlegen, damit alle sehen, ob das Treffen stattfindet.
- **Quelle:** DR-3.2.1, DR-3.2.2 (Benachrichtigungsanteil in F-26/F-27); FB-06, FB-41.
- **Priorität / Größe / Release 1:** Should / S / nein · **Status:** umgesetzt (AK1 E2E, AK2/AK3 Unit grün (vorgezogen, nicht Release 1))
- **Akzeptanzkriterien:**
  - AK1: Gegeben Mindestzahl 4 und 3 Teilnehmende. Wenn die Details angezeigt werden, dann steht dort „Sucht Mitspieler (noch 1)“.
  - AK2: Gegeben dasselbe Treffen. Wenn eine vierte Person beitritt, dann steht dort „Findet statt“.
  - AK3: Gegeben Mindestzahl 9 bei Kapazität 8. Wenn veröffentlicht wird, dann erscheint „Mindestzahl darf die Plätze nicht übersteigen“.

## E-6 Hinweise
Ziel: Z2.2. Kanal ist Annahme (FB-20, FB-36: In-App reicht nicht immer).

### F-26 In-App-Hinweis bei Änderung oder Absage
- **User Story:** Als Teilnehmer möchte ich in der App einen Hinweis bekommen, wenn sich Zeit oder Ort meines Treffens ändert oder es abgesagt wird, damit ich nicht umsonst losgehe.
- **Quelle:** SM-R14, DR-3.3.1, DR-3.3.2; FB-20, FB-36, FB-16.
- **Priorität / Größe / Release 1:** Should / M / nein · **Status:** offen
- **Akzeptanzkriterien:**
  - AK1: Gegeben `lea` nimmt an Treffen A teil. Wenn der Organisator den Beginn von 18:00 auf 19:00 ändert, dann zeigt ihr Glockensymbol 1 neuen Hinweis „Treffen A: Beginn jetzt 19:00 Uhr“ mit Link zu A.
  - AK2: Gegeben A wird abgesagt. Wenn `lea` die App öffnet, dann sieht sie „Treffen A wurde abgesagt“.
  - AK3: Gegeben `tom` ist nicht angemeldet. Wenn A geändert wird, dann erhält `tom` keinen Hinweis.
  - AK4: Gegeben ein gelesener Hinweis. Wenn die Seite neu geladen wird, dann bleibt er in der Liste, aber ohne Neu-Markierung.

### F-27 Hinweis an Organisator bei Zu- und Absage
- **User Story:** Als Organisatorin möchte ich erfahren, wenn jemand zusagt oder absagt, damit ich weiß, ob mein Treffen angenommen wird.
- **Quelle:** DR-4.3.1 (60-Sekunden-Ziel offen), DR-4.2.1; FB-06, FB-55.
- **Priorität / Größe / Release 1:** Could / S / nein · **Status:** offen
- **Akzeptanzkriterien:**
  - AK1: Gegeben Treffen mit 3 von 8. Wenn `tom` beitritt, dann erhält die Organisatorin den In-App-Hinweis „Tom ist dabei – 4 von 8“.
  - AK2: Gegeben `tom` zieht zurück. Wenn das gespeichert ist, dann erhält sie „Tom hat abgesagt – 3 von 8“.

### F-28 Hinweis, wenn Mindestzahl 2 Stunden vor Beginn fehlt
- **User Story:** Als Organisator möchte ich 2 Stunden vor Beginn erinnert werden, wenn die Mindestzahl fehlt, damit ich rechtzeitig absagen kann.
- **Quelle:** DR-3.2.3 (Zeitgrenze Teamfestlegung).
- **Priorität / Größe / Release 1:** Could / M / nein · **Status:** offen
- **Akzeptanzkriterien:**
  - AK1: Gegeben Beginn 18:00, Mindestzahl 4, 3 Teilnehmende. Wenn die Prüfung um 16:00 läuft, dann erhält der Organisator „Mindestzahl noch nicht erreicht (3 von 4)“.
  - AK2: Gegeben 4 Teilnehmende. Wenn die Prüfung um 16:00 läuft, dann wird kein Hinweis erzeugt.

### F-29 E-Mail bei kurzfristiger Absage
- **User Story:** Als Teilnehmerin möchte ich bei einer Absage kurz vor Beginn eine E-Mail bekommen, damit ich es auch ohne geöffnete App erfahre.
- **Quelle:** FB-36, FB-20. Kanal E-Mail statt Push: Annahme (kein kostenloser Push-Dienst festgelegt, C-4).
- **Priorität / Größe / Release 1:** Could / M / nein · **Status:** offen
- **Akzeptanzkriterien:**
  - AK1: Gegeben Treffen mit Beginn in 3 Stunden und Teilnehmerin `lea@example.org`. Wenn der Organisator absagt, dann wird genau eine E-Mail „Abgesagt: <Titel>“ an `lea@example.org` versandt (Test mit E-Mail-Attrappe).
  - AK2: Gegeben Beginn in 3 Tagen. Wenn abgesagt wird, dann wird keine E-Mail versandt, nur der In-App-Hinweis aus F-26.

### F-30 Nachricht an alle Teilnehmenden
- **User Story:** Als Organisator möchte ich allen Teilnehmenden eine Nachricht schicken, damit ich nicht über WhatsApp organisieren muss.
- **Quelle:** FB-56. **Won't (Version 1)**, weil FB-40 und FB-21 ausdrücklich keinen Chat wollen und WhatsApp behalten, und weil Nachrichten Moderation und zusätzliche Datenschutzregeln brauchen. Erneut prüfen nach dem Nutzertest (P6).
- **Priorität / Größe / Release 1:** Won't / M / nein · **Status:** offen
- **Akzeptanzkriterien:** werden erst bei Aufnahme formuliert.

## E-7 Einstieg und Betrieb

### F-31 Startseite mit Erklärung und zwei Einstiegen
- **User Story:** Als neuer Besucher möchte ich auf einer Startseite kurz erfahren, was SportMate ist, damit ich nicht mitten in die Anwendung geworfen werde.
- **Quelle:** FB-58, H-2.
- **Priorität / Größe / Release 1:** Should / S / nein · **Status:** teilweise (als Erstbesuch-Hinweis auf Entdecken umgesetzt (E2E AK1/AK2 grün), keine eigene Startseite unter `/`)
- **Akzeptanzkriterien:**
  - AK1: Gegeben die Adresse `/`. Wenn sie geöffnet wird, dann zeigt sie eine Überschrift mit Erklärung, die drei Schritte „Sportart auswählen → Treffen finden → Gemeinsam Sport machen“ und die Buttons „Treffen entdecken“ und „Treffen erstellen“.
  - AK2: Gegeben die Startseite. Wenn „Treffen entdecken“ gewählt wird, dann öffnet sich die Treffenübersicht.
  - AK3: Gegeben eine nicht angemeldete Person. Wenn sie „Treffen erstellen“ wählt, dann erscheint die Anmeldung (F-02 AK4).

### F-32 Lokaler Demo-Modus ohne Server
- **User Story:** Als Team möchte ich die App ohne Server mit gekennzeichneten Demodaten starten, damit Präsentationen und Tests unabhängig von Netz und Supabase funktionieren.
- **Quelle:** C-2, Z5, SM-R30; Präsentation 4 („Demodaten werden transparent gekennzeichnet“). Kein Nutzerfeedback.
- **Priorität / Größe / Release 1:** Must / M / ja · **Status:** umgesetzt (AK1 E2E, AK2–AK4 Unit grün; AK4 zusätzlich manuell (TC-M-01))
- **Akzeptanzkriterien:**
  - AK1: Gegeben keine Supabase-Konfiguration. Wenn die App gestartet wird, dann läuft sie im Demo-Modus und zeigt oben dauerhaft „Demo-Modus – Beispieldaten, nichts wird gespeichert“.
  - AK2: Gegeben der Demo-Modus. Wenn die Übersicht geladen wird, dann zeigt sie mindestens 6 Demotreffen mit allen Sportarten aus F-00, darunter mindestens ein ausgebuchtes und eines ohne Altersgruppe.
  - AK3: Gegeben der Demo-Modus. Wenn eine Demo-Person einem Treffen beitritt und die Seite neu lädt, dann ist der Ausgangszustand wiederhergestellt.
  - AK4: Gegeben Supabase-Konfiguration vorhanden. Wenn die App startet, dann erscheint kein Demo-Hinweis und Daten kommen aus Supabase.

## E-8 Sportstätten-Buchungspilot
Ziel: Z4 (optional). Hypothese H-3b offen. Grundlage: INT-03 (real laut Teamentscheidung) und SIM-05 (KI-Simulation, nur Annahme).
Kein realer Betreiber hat eine Kooperation zugesagt (FB-28), nur 1 von 4 Befragten nennt Platzsuche als Hauptproblem (FB-07).
Deshalb höchstens Could; die Betreiberseite ist Won't.

### F-33 Hallenanfrage mit Status „Angefragt“
- **User Story:** Als Gruppenverantwortliche möchte ich eine Halle mit allen nötigen Angaben anfragen und sehen, dass sie noch nicht bestätigt ist, damit wir nicht vor einer belegten Halle stehen.
- **Quelle:** DR-5.1.1, DR-5.1.2, DR-5.2.1, SM-R16, NFR-7; FB-24, FB-25, FB-26, FB-39; Annahme (SIM-05).
- **Priorität / Größe / Release 1:** Could / L / nein · **Status:** offen
- **Akzeptanzkriterien:**
  - AK1: Gegeben Testhalle „Halle Demo (Testdaten)“. Wenn Datum 2026-12-05, 18:00–20:00, Volleyball, 10 Personen, verantwortlich `Lea`, Kontakt `lea@example.org` abgesendet werden, dann steht die Anfrage mit „Angefragt – noch keine verbindliche Buchung“ unter „Meine Anfragen“.
  - AK2: Gegeben Ende 17:00 vor Beginn 18:00. Wenn abgesendet wird, dann erscheint „Das Ende muss nach dem Beginn liegen“ und nichts wird gespeichert.
  - AK3: Gegeben eine gesendete Anfrage. Wenn ihr Inhalt für den Betreiber erzeugt wird, dann enthält er nur Name und Kontakt der verantwortlichen Person, keine Daten weiterer Teilnehmender (NFR-7).
  - AK4: Gegeben eine angezeigte freie Zeit. Wenn sie angezeigt wird, dann steht dabei „Verfügbarkeit nicht garantiert – der Betreiber bestätigt“.

### F-34 Preis und Stornobedingungen vor dem Absenden
- **User Story:** Als Gruppenverantwortlicher möchte ich Preis und Stornobedingungen vor dem Absenden sehen, damit es später keine Überraschung gibt.
- **Quelle:** DR-5.4.1, DR-5.4.2, SM-R15; FB-27, FB-39.
- **Priorität / Größe / Release 1:** Could / S / nein · **Status:** offen
- **Akzeptanzkriterien:**
  - AK1: Gegeben Richtpreis 25 € pro Stunde für 2 Stunden. Wenn die Anfrage vorbereitet wird, dann steht vor dem Absenden „Richtpreis 50 € – endgültiger Preis laut Angebot des Betreibers“.
  - AK2: Gegeben Stornobedingungen sind hinterlegt. Wenn „Anfrage senden“ ohne bestätigtes Häkchen „Hallenregeln und Stornobedingungen gelesen“ gewählt wird, dann wird nicht gesendet.

### F-35 Betreiber bestätigt oder lehnt ab, keine Doppelbestätigung
- **User Story:** Als Betreiber möchte ich Anfragen bestätigen oder ablehnen, damit nur von mir bestätigte Termine verbindlich sind.
- **Quelle:** DR-5.2.2, DR-5.3.1, SM-R17, SM-R18, SM-R19, SM-R20, SM-R29, NFR-6; FB-24, FB-28. **Won't (Version 1)**, weil kein realer Betreiber als Partner zugesagt hat, kein E-Mail-Versand mit sicheren Aktionslinks festgelegt ist und die Betreiberin keinen zweiten Kalender pflegen will.
- **Priorität / Größe / Release 1:** Won't / L / nein · **Status:** offen
- **Akzeptanzkriterien:** werden erst bei Aufnahme formuliert (Orientierung: NFR-6, SM-R18).
