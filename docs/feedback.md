# Feedback-Register

Jede Aussage einer echten Person außerhalb des Teams bekommt eine Zeile. Eingetragen wird mit `/feedback`.
Simulierte Interviews und Meinungen aus dem Team gehören nicht hierher.
Rolle und Bezug zur Zielgruppe genügen; Vornamen nur dort, wo das Team sie freigegeben hat. Rohmaterial liegt in `docs/feedback/roh/`.

Status: Vorschlag (analyst hat eine Konsequenz vorgeschlagen) · entschieden (Mensch hat entschieden) · umgesetzt (Story fertig).
Freigabe der Konsequenzen durch das Team: **offen** (alle Einträge weiterhin „Vorschlag“). Unabhängig davon zeigt die Spalte
„Umsetzung“ den Stand im Code nach dem Endlauf vom 23.11.2026 (Story-Status aus `docs/backlog.md`: umgesetzt / teilweise / offen).
Konsequenz: neue Story · Story geändert · Vision geändert · keine Änderung (mit Grund) · verworfen (mit Grund).

## Hinweis zum Status der Quellen

Verbindliche Teamentscheidung (an den analyst übergeben am 2026-11-23): Die Interviews INT-01 bis INT-04, die Umfrage
und die Feedbackrunde zum MVP gelten als reale Erhebungen. Die Befragten antworteten oft nur kurz; das Team hat die
Transkripte nachträglich mit KI sprachlich ausformuliert. Bei INT-01 bis INT-04 gilt deshalb:
**Transkript sprachlich überarbeitet (KI-gestützt), Inhalte aus realem Gespräch.**

Zur Nachvollziehbarkeit: In den Originaldateien und in den Unterlagen zu P2/P3 waren diese Interviews als
„KI-Simulation“ geführt (Dateien `SIM-01` bis `SIM-03`, `Studentin Interview.docx` als SIM-04; Konfliktregister P3 F12).
Laut Team ist dieser Vermerk falsch. Die neuen Kennungen INT-01 bis INT-04 ersetzen SIM-01 bis SIM-04.

**Kein Feedback:** `Hallenbetreiberinterview.docx` (SIM-05, Hallenbetreiber) ist eine KI-Simulation. Es steht nicht
im Register und wird im Backlog nur als „Annahme (SIM-05)“ genannt. Rohtext: `roh/2026-10-11-sim-05-hallenbetreiber-ki-simulation.md`.

Rohmaterial-Kürzel: U = `roh/2026-10-11-umfrage.md` · I1 = `roh/2026-10-10-int-01-studentin.md` ·
I2 = `roh/2026-10-10-int-02-organisator.md` · I3 = `roh/2026-10-10-int-03-betreiberin.md` ·
I4 = `roh/2026-10-11-int-04-studentin.md` · M = `roh/2026-10-27-feedbackrunde-mvp.md`

## Register

| ID | Datum | Wer (Rolle, Bezug) | Wie | Aussage | Rohmaterial | Konsequenz | Stories | Status (Freigabe) | Umsetzung (Stand 23.11.2026) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| FB-01 | 2026-10-11 | 4 Studierende in Flensburg (U1–U4) | Umfrage | 3 von 4 finden Mitspieler „gar nicht – ich finde oft niemanden“; Schwierigkeit spontan Leute zu finden: 4 von 4 mit 4 oder 5 (von 5). | U, F7/F9 | Kernumfang Finden, Erstellen, Beitreten bleibt Must; stützt H-1 | F-05, F-17, F-22 | Vorschlag | umgesetzt (F-05, F-17); teilweise (F-22) |
| FB-02 | 2026-10-11 | 4 Studierende (U1–U4) | Umfrage | In den letzten 3 Monaten fiel Sport wegen fehlender Mitspieler/Platz aus: 3× „1–2 Mal“, 1× „öfter als 5 Mal“. | U, F8 | keine Änderung, stützt H-1 | – | Vorschlag | – |
| FB-03 | 2026-10-11 | 4 Studierende (U1–U4) | Umfrage | Vor einem Treffen mit Fremden wollen sie wissen: Altersgruppe 3/4, Spielniveau 2/4, Anzahl Teilnehmende 2/4, genauer Ort 2/4. Bewertungen nennt niemand. | U, F13 | Details und Filter für Alter/Niveau/Plätze/Ort; Bewertungen verworfen, weil 0 von 4 Nennungen | F-07, F-12 | Vorschlag | umgesetzt (F-07); teilweise (F-12) |
| FB-04 | 2026-10-11 | 4 Studierende (U1–U4) | Umfrage | Entfernung für spontanes Treffen: bis 2 km 1×, bis 5 km 2×, bis 10 km 1×. | U, F14 | Umkreis 2/5/10/20 km, Standard 5 km | F-10 | Vorschlag | offen |
| FB-05 | 2026-10-11 | 4 Studierende (U1–U4) | Umfrage | Würden ein Treffen in einer App einstellen: 3× „Ja“, 1× „Vielleicht“. | U, F16 | Treffen erstellen Must; stützt H-3a | F-17 | Vorschlag | umgesetzt (F-17) |
| FB-06 | 2026-10-11 | Studentin/Student, 20–25 (U1) | Umfrage | Hinderungsgrund: „Die angst das niemand mit macht“. | U, F17 | Mindestteilnehmerzahl mit Status und Hinweis an Organisator | F-25, F-27 | Vorschlag | umgesetzt (F-25); offen (F-27) |
| FB-07 | 2026-10-11 | 4 Studierende (U1–U4) | Umfrage | Was am meisten nervt: Mitspieler finden 2×, freien Platz finden/buchen 1×, gemeinsamen Termin finden 1×. | U, F10 | Buchung ist Nebenproblem (1/4): Buchungspilot nur Could | F-33 | Vorschlag | offen |
| FB-08 | 2026-10-11 | 4 Studierende (U1–U4) | Umfrage | Platz zuletzt gebucht: 2× „noch nie“, 2× „länger her“; Bezahlung: 2× eine Person zahlt, andere schicken Geld (PayPal), 1× online beim Betreiber. | U, F18/F19 | verworfen: Bezahlung/Kostenaufteilung in der App, weil bestehende Lösung genügt und kein Bedarf genannt wurde | – | Vorschlag | – |
| FB-09 | 2026-10-11 | Studierende (U1, U4) | Umfrage | Haben bisher keine Apps/Websites zum Finden von Mitspielern genutzt („nein“, 2 ohne Angabe). | U, F12 | keine Änderung, kein Vorbild für Wettbewerb ableitbar | – | Vorschlag | – |
| FB-10 | 2026-10-11 | Studentin/Student, 20–25 (U1) | Umfrage | App muss leisten: „das man wirklich leute kennen lernt und sich trifft“. | U, F20 | stützt Fokus auf Beitreten mit Fremden; H-5 | F-22 | Vorschlag | teilweise (F-22) |
| FB-11 | 2026-10-11 | 4 Studierende (U1–U4) | Umfrage | Niemand hat eine Kontaktmöglichkeit für einen 10-Minuten-Prototyptest hinterlassen (0 von 4). | U, F21 | keine Story; Nutzertest für H-2/NFR-1 muss anders rekrutiert werden (offen) | – | Vorschlag | – |
| FB-12 | 2026-10-10 | Studentin, neu in Flensburg, Basketball-Anfängerin (INT-01) | Interview | Ohne Niveauangabe geht sie nicht hin: „Ich muss vorher sehen, ob Anfänger willkommen sind.“ | I1, Frage 2 | Niveau Pflichtangabe und sichtbar; Hinweis „Anfänger willkommen“ | F-12, F-13, F-17 | Vorschlag | umgesetzt (F-17); teilweise (F-12, F-13) |
| FB-13 | 2026-10-10 | Studentin (INT-01) | Interview | Ein Kartenpunkt reicht nicht, sie braucht Eingang oder klaren Treffpunkt (z. B. „am nördlichen Tor“). | I1, Frage 4 | Treffpunkttext Pflichtfeld und in Details | F-12, F-17 | Vorschlag | umgesetzt (F-17 AK2 Pflichtfeld, F-12 AK1 Treffpunkt in Details) |
| FB-14 | 2026-10-10 | Studentin (INT-01) | Interview | Will einen Stadtteil eingeben, ohne Standort freizugeben; nicht dauerhaft; andere sollen ihren Aufenthaltsort nicht sehen. | I1, Frage 5 | Ortssuche ohne Standort; Standort nur optional und nicht gespeichert (SM-R22) | F-10, F-11 | Vorschlag | offen |
| FB-15 | 2026-10-10 | Studentin (INT-01) | Interview | Vor Anmeldung braucht sie Sportart, Niveau, Dauer, freie Plätze, Kosten, Mitbringen und wer organisiert. | I1, Frage 3 | Detailansicht mit allen Angaben | F-12, F-13, F-14 | Vorschlag | teilweise (F-12, F-13, F-14) |
| FB-16 | 2026-10-10 | Studentin (INT-01) | Interview | Will sich wieder abmelden können, damit der Platz frei wird; Änderungen/Absagen in der App sehen. | I1, Frage 6 | Zurückziehen Must; Hinweis bei Änderung | F-23, F-26 | Vorschlag | umgesetzt (F-23); offen (F-26) |
| FB-17 | 2026-10-10 | Studentin (INT-01) | Interview | Für den ersten Versuch reichen offene Treffen und einfache Anmeldung; Hallenbuchung später; Feed braucht sie nicht. | I1, Frage 7 | Social Feed verworfen (Nicht-Ziel); Buchung Could | F-33 | Vorschlag | offen |
| FB-18 | 2026-10-10 | Organisator offener Basketballtreffen (INT-02) | Interview | Braucht eindeutige Teilnehmerliste und Obergrenze; bei vollem Treffen klare Voll-Meldung; Warteliste erst später. | I2, Frage 2 | Kapazität, Ausgebucht-Zustand, Teilnehmerliste; Warteliste verworfen für Version 1, weil laut Aussage nicht nötig | F-17, F-20, F-22 | Vorschlag | umgesetzt (F-17); teilweise (F-20, F-22) |
| FB-19 | 2026-10-10 | Organisator (INT-02) | Interview | Letzter Platz bei zwei gleichzeitigen Klicks: nur eine Zusage. Grenze erhöhen ja, unter die Zahl Angemeldeter senken nein. | I2, Frage 3 | atomarer Beitritt (NFR-5); Kapazitätsregel beim Bearbeiten | F-22, F-19 | Vorschlag | teilweise (F-22); offen (F-19) |
| FB-20 | 2026-10-10 | Organisator (INT-02) | Interview | Bei Absage oder neuem Treffpunkt müssen die Angemeldeten es mitbekommen; Eintrag allein reicht nicht. | I2, Frage 4 | In-App-Hinweis; Benachrichtigung außerhalb der App als Could | F-26, F-29 | Vorschlag | offen |
| FB-21 | 2026-10-10 | Organisator (INT-02) | Interview | „Für eine leere Karte wechselt meine Gruppe nicht von WhatsApp.“ Braucht teilbaren Link; Chat-Ersatz nicht nötig. | I2, Frage 5 | Link teilen; Leerzustand mit „Treffen erstellen“; kein Chat | F-15, F-06 | Vorschlag | umgesetzt (F-06); teilweise (F-15) |
| FB-22 | 2026-10-10 | Organisator (INT-02) | Interview | Will Sportart, Niveau, Treffpunkt und Ausrüstung angeben; für den Prototyp sind nur öffentliche Treffen okay. | I2, Frage 6 | Felder beim Erstellen; private Treffen verworfen für Version 1 | F-17, F-13 | Vorschlag | umgesetzt (F-17); teilweise (F-13) |
| FB-23 | 2026-10-10 | Organisator (INT-02) | Interview | Risiko: Wenn die Anmeldung zu aufwendig ist, schreiben Leute weiter „bin dabei“ in WhatsApp und er pflegt doppelt. | I2, Frage 7 | keine eigene Story; Beitritt mit einem Klick (F-22) und Test mit echter Gruppe offen | F-22 | Vorschlag | teilweise (F-22) |
| FB-24 | 2026-10-10 | Betreiberin einer kleinen Sporthalle (INT-03) | Interview | „Eine Anfrage ist noch keine Zusage; verbindlich wird es erst nach unserer Bestätigung.“ | I3, Frage 2 | Status „Angefragt – noch keine verbindliche Buchung“ | F-33, F-35 | Vorschlag | offen |
| FB-25 | 2026-10-10 | Betreiberin (INT-03) | Interview | Ohne Kalenderabgleich darf die App freie Zeiten nicht als garantiert anzeigen. | I3, Frage 3 | keine Verfügbarkeitsgarantie; Kalenderintegration verworfen (kein Partner) | F-33, F-35 | Vorschlag | offen |
| FB-26 | 2026-10-10 | Betreiberin (INT-03) | Interview | Braucht Feld, Datum, Startzeit, Dauer, Sportart, Gruppengröße und eine verantwortliche Person; keine Daten aller Mitspielenden. | I3, Frage 4 | Pflichtangaben der Anfrage; NFR-7 | F-33 | Vorschlag | offen |
| FB-27 | 2026-10-10 | Betreiberin (INT-03) | Interview | „Gesamtpreis und Stornobedingungen müssen vor dem Absenden der Anfrage sichtbar sein.“ | I3, Frage 5 | Konditionen vor Absenden | F-34 | Vorschlag | offen |
| FB-28 | 2026-10-10 | Betreiberin (INT-03) | Interview | Pflegt keinen zweiten Kalender; höchstens Test mit wenigen Anfragen; keine Kooperationszusage. | I3, Fragen 6–7 | H-3b nicht bestätigt; Buchungspilot bleibt Could/Won't | F-33, F-34, F-35 | Vorschlag | offen |
| FB-29 | ≤ 2026-10-11 | Studentin, 23, Volleyball, kein Verein (Mara, INT-04) | Interview | Volleyball scheiterte, weil nicht genug Leute zusammenkamen; WhatsApp-Gruppen werden unübersichtlich; Fremde findet man so nicht. | I4, Fragen 1–2, 13 | stützt H-1 und Wertversprechen | F-05, F-22 | Vorschlag | umgesetzt (F-05); teilweise (F-22) |
| FB-30 | ≤ 2026-10-11 | Studentin (Mara, INT-04) | Interview | Möchte sehen, ob für Anfänger, Fortgeschrittene oder alle, und dass neue Leute willkommen sind. | I4, Frage 3 | Niveau inkl. „Alle Niveaus“; Hinweis „Neue willkommen“ | F-12, F-13 | Vorschlag | teilweise (F-12, F-13) |
| FB-31 | ≤ 2026-10-11 | Studentin (Mara, INT-04) | Interview | Vor Anmeldung: Datum, Uhrzeit, genauer Treffpunkt, Dauer, wie viele schon dabei, was mitbringen, ob es etwas kostet. | I4, Frage 4 | Detailansicht inkl. Kosten und Mitbringen | F-12, F-13 | Vorschlag | teilweise (F-12, F-13) |
| FB-32 | ≤ 2026-10-11 | Studentin (Mara, INT-04) | Interview | Sucht zuerst nach Sportart, dann nach Tag/Uhrzeit, dann Ort. | I4, Frage 5 | Filter Sportart und Zeitraum Must, Ort Should | F-06, F-10 | Vorschlag | umgesetzt (F-06); offen (F-10) |
| FB-33 | ≤ 2026-10-11 | Studentin (Mara, INT-04) | Interview | Eine Liste mit Stadtteil und Treffpunkt reicht ihr; Karte praktisch, aber nicht nötig. **Widerspruch zu FB-48.** | I4, Frage 5 | Liste Must, Karte Should | F-05, F-08 | Vorschlag | umgesetzt (F-05, F-08) |
| FB-34 | ≤ 2026-10-11 | Studentin (Mara, INT-04) | Interview | Anmeldung per Button; vorher klar, ob Plätze frei; danach Bestätigung „Du bist angemeldet“; wieder abmelden können. | I4, Frage 6 | Beitreten mit Bestätigung, Zurückziehen | F-22, F-23 | Vorschlag | umgesetzt (F-23); teilweise (F-22) |
| FB-35 | ≤ 2026-10-11 | Studentin (Mara, INT-04) | Interview | Will ohne Registrierung stöbern; Konto erst zum Mitmachen okay; kein langes Profil vorab. | I4, Frage 7 | Stöbern ohne Konto; Profil optional und nachrangig | F-02, F-03 | Vorschlag | umgesetzt (F-02); offen (F-03) |
| FB-36 | ≤ 2026-10-11 | Studentin (Mara, INT-04) | Interview | Bei kurzfristiger Absage Benachrichtigung aufs Handy; bei Tagen Vorlauf reicht Info in der App. | I4, Frage 8 | In-App-Hinweis Should; E-Mail/Push Could | F-26, F-29 | Vorschlag | offen |
| FB-37 | ≤ 2026-10-11 | Studentin (Mara, INT-04) | Interview | Würde kleines Treffen (6–8 Leute) erstellen: Sportart, Zeit, Ort, Maximalzahl; App soll automatisch zeigen, wer kommt und wie viele Plätze frei sind. | I4, Frage 9 | Erstellen, Teilnehmerliste, Meine Treffen; stützt H-3a | F-17, F-20, F-24 | Vorschlag | umgesetzt (F-17, F-24); teilweise (F-20) |
| FB-38 | ≤ 2026-10-11 | Studentin (Mara, INT-04) | Interview | Über Teilnehmende reicht Name/Benutzername, evtl. Niveau; keine Wohnorte/Telefonnummern; Organisator soll erkennbar sein. | I4, Frage 10 | Teilnehmerliste nur mit Anzeigenamen; Organisator sichtbar | F-14, F-20, F-03 | Vorschlag | teilweise (F-14, F-20); offen (F-03) |
| FB-39 | ≤ 2026-10-11 | Studentin (Mara, INT-04) | Interview | Hallenbuchung nur in der Gruppe praktisch; Kosten und echte Verfügbarkeit vorher sehen; richtige Bestätigung. | I4, Frage 11 | Buchungspilot Could, Konditionen vor Absenden | F-33, F-34 | Vorschlag | offen |
| FB-40 | ≤ 2026-10-11 | Studentin (Mara, INT-04) | Interview | Social-Media-Bereich und Chat braucht sie nicht (WhatsApp); wichtiger, dass Grundfunktionen gut funktionieren. **Widerspruch zu FB-56.** | I4, Frage 12 | Chat/Nachrichten Won't; Vorrang Kernabläufe | F-30 | Vorschlag | offen |
| FB-41 | ≤ 2026-10-11 | Studentin (Mara, INT-04) | Interview | Hört auf, wenn es kaum Veranstaltungen gibt oder angemeldete Treffen ständig ausfallen. | I4, Frage 13 | H-5 (offen); Mindestzahl-Status zeigt Ausfallrisiko | F-25 | Vorschlag | umgesetzt (F-25) |
| FB-42 | ≤ 2026-10-11 | Studentin (Mara, INT-04) | Interview | Testvorschlag: Volleyball-Treffen finden, Infos prüfen, anmelden, abmelden – ohne Erklärung. | I4, Frage 14 | Szenario für Nutzertest NFR-1/H-2 und E2E-Test | F-22, F-23 | Vorschlag | umgesetzt (F-23); teilweise (F-22) |
| FB-43 | ≤ 2026-10-27 | Student, 22, spielt gelegentlich Fußball (Lukas) | Feedbackrunde MVP | Seite modern und übersichtlich; Filter nach Sportart gefällt. Erster Eindruck 4/5. | M, Feedback 1 | bestätigt Filter | F-06 | Vorschlag | umgesetzt (F-06) |
| FB-44 | ≤ 2026-10-27 | Student (Lukas) | Feedbackrunde MVP | Sieht freie Plätze, aber nicht, wie er mitmachen kann; wünscht Button „Jetzt teilnehmen“ auf jeder Karte. | M, Feedback 1 | Teilnahme-Button auf Karte und in Details; Gegenhinweis zu H-2 | F-22 | Vorschlag | umgesetzt (F-22 AK5 Button auf der Karte, F-12/F-22 in Details) |
| FB-45 | ≤ 2026-10-27 | Student (Lukas) | Feedbackrunde MVP | „20–25“ unklar: Altersbeschränkung oder Alter der Teilnehmenden? Wunsch: „Alter: 20–25 Jahre“. | M, Feedback 1 | Altersangabe eindeutig beschriften | F-12 | Vorschlag | umgesetzt (F-12 AK2/AK3: „Alter: 20–25 Jahre“ / „Alter: offen für alle“, `18af5af`) |
| FB-46 | ≤ 2026-10-27 | Student (Lukas) | Feedbackrunde MVP | Freie Plätze hervorheben: „5 von 10 Plätzen frei“ statt „5 von 10 dabei“. | M, Feedback 1 | Platzanzeige in Liste und Details | F-05, F-12 | Vorschlag | umgesetzt (F-05 AK2 Liste, F-12 AK1/AK4 Details) |
| FB-47 | ≤ 2026-10-27 | Student (Lukas) | Feedbackrunde MVP | Ausgebuchte Treffen optional nach unten sortieren, wenn Alternativen existieren. | M, Feedback 1 | Sortierung „Ausgebuchte zuletzt“ | F-05 | Vorschlag | umgesetzt (F-05) |
| FB-48 | ≤ 2026-10-27 | Berufstätige, 34, neu in Flensburg (Sarah) | Feedbackrunde MVP | Die Karte gefällt besonders, weil sie sieht, wo Treffen stattfinden. Erster Eindruck 3/5. **Widerspruch zu FB-33.** | M, Feedback 2 | Karte bleibt (Should, Release 1) | F-08 | Vorschlag | umgesetzt (F-08) |
| FB-49 | ≤ 2026-10-27 | Berufstätige (Sarah) | Feedbackrunde MVP | Will wissen, ob kostenlos, ob sie etwas mitbringen muss und ob wirklich jeder teilnehmen kann. | M, Feedback 2 | Kosten, Mitbringen, Teilnahmevoraussetzung in Details | F-13 | Vorschlag | teilweise (F-13) |
| FB-50 | ≤ 2026-10-27 | Berufstätige (Sarah) | Feedbackrunde MVP | „Anfänger“ beim Fußball hilft; bei anderen Treffen unsicher, ob sie als Anfängerin willkommen ist. | M, Feedback 2 | Niveau bei jedem Treffen Pflicht und sichtbar | F-12, F-17 | Vorschlag | umgesetzt (F-17); teilweise (F-12) |
| FB-51 | ≤ 2026-10-27 | Berufstätige (Sarah) | Feedbackrunde MVP | Will vorher wissen, wer organisiert (Vorname, Profil, bisherige Treffen). | M, Feedback 2 | Organisator in Details | F-14 | Vorschlag | teilweise (F-14) |
| FB-52 | ≤ 2026-10-27 | Berufstätige (Sarah) | Feedbackrunde MVP | Kurze Beschreibung „Was erwartet dich?“ und genauer Treffpunkt mit weiteren Infos. | M, Feedback 2 | Beschreibung und Treffpunkttext | F-12, F-13 | Vorschlag | teilweise (F-12, F-13) |
| FB-53 | ≤ 2026-10-27 | Organisiert regelmäßig Volleyballtreffen, 28 (Max) | Feedbackrunde MVP | Gut, dass man selbst Treffen erstellen kann; praktisch für seine Gruppe. Erster Eindruck 3/5. | M, Feedback 3 | stützt H-3a | F-17 | Vorschlag | umgesetzt (F-17) |
| FB-54 | ≤ 2026-10-27 | Organisator (Max) | Feedbackrunde MVP | Button „Treffen erstellen“ oben rechts unauffällig, wirkt fast deaktiviert. | M, Feedback 3 | Button sichtbar gestalten (AK in F-17) | F-17 | Vorschlag | umgesetzt (F-17) |
| FB-55 | ≤ 2026-10-27 | Organisator (Max) | Feedbackrunde MVP | Will Teilnehmerzahl festlegen, Teilnehmende entfernen und wissen, was bei kurzfristiger Absage passiert. | M, Feedback 3 | Kapazität; Entfernen (Could); Hinweis bei Absage (Could) | F-17, F-21, F-27 | Vorschlag | umgesetzt (F-17); offen (F-21, F-27) |
| FB-56 | ≤ 2026-10-27 | Organisator (Max) | Feedbackrunde MVP | Will sehen, wer angemeldet ist, und eine Nachricht an alle schicken, sonst bleibt WhatsApp. **Widerspruch zu FB-40/FB-21.** | M, Feedback 3 | Teilnehmerliste Should; Nachricht an alle verworfen für Version 1 (Won't), weil andere Befragte WhatsApp behalten wollen und Chat Moderation/Datenschutz erfordert | F-20, F-30 | Vorschlag | teilweise (F-20); offen (F-30) |
| FB-57 | ≤ 2026-10-27 | Organisator (Max) | Feedbackrunde MVP | Wünscht übersichtliche Verwaltung eigener Treffen. | M, Feedback 3 | Meine Treffen, Bearbeiten | F-24, F-19 | Vorschlag | umgesetzt (F-24); offen (F-19) |
| FB-58 | ≤ 2026-10-27 | Student, 24, erstmals auf der Seite (Tim) | Feedbackrunde MVP | Wusste nicht, worum es geht; wünscht Startseite mit Erklärung, „So funktioniert's“ in drei Schritten und zwei Buttons. Erster Eindruck 3/5. | M, Feedback 4 | Startseite; Gegenhinweis zu H-2 | F-31 | Vorschlag | teilweise (F-31) |

## Feedback-Runden

Eine Zeile je Runde, damit sichtbar bleibt, dass Feedback die ganze Laufzeit begleitet.

| Datum | Was wurde gezeigt (Idee, Mock-up, Version) | Wie viele Personen, welche Rollen | Methode | Einträge |
| --- | --- | --- | --- | --- |
| 2026-10-10 | Produktidee (noch keine Software) | 3: Studentin, Organisator einer Freizeitgruppe, Hallenbetreiberin | halbstrukturierte Interviews, je 7 Fragen | FB-12 – FB-28 |
| 2026-10-11 | Produktidee | 4 Studierende (anonym) | Online-Umfrage (Google Forms) | FB-01 – FB-11 |
| ≤ 2026-10-11 | Produktidee, Idee Hallenbuchung | 1 Studentin | halbstrukturiertes Interview, 14 Fragen | FB-29 – FB-42 |
| ≤ 2026-10-27 | MVP-Demo (Next.js, Demodaten: Liste, Filter, Karte, Details) | 4: zwei Studenten, eine Berufstätige, ein Organisator | Ersteindruck mit Note 1–5 und Änderungswünschen | FB-43 – FB-58 |
| offen (P6) | Release 1 (lauffähige App) | Ziel 5 Personen | Nutzertest NFR-1 nach Szenario FB-42 | – |

## Feedback-Dokumentation für die Abgabe

Zusammenstellung des über die Laufzeit gesammelten Feedbacks und seiner Konsequenzen, chronologisch.
Belegte Wirkungen stehen in den genannten Projektdokumenten; Vorschläge für das neue Backlog sind als solche gekennzeichnet.

### 1. Interviews zur Produktidee (P2, 10./11.10.2026)
- **Wer:** Studentin und Anfängerin (INT-01), Organisator einer Basketball-Freizeitgruppe (INT-02), Betreiberin
  einer kleinen Sporthalle (INT-03), Studentin und Volleyballerin (INT-04).
- **Status:** reale Gespräche, Transkripte sprachlich KI-gestützt überarbeitet (Teamentscheidung). In P2/P3 noch
  als KI-Simulation geführt, siehe „Hinweis zum Status der Quellen“.
- **Kernaussagen:** Anfänger brauchen Niveauangabe (FB-12, FB-30); Kartenpunkt reicht nicht, klarer Treffpunkt
  nötig (FB-13); Suche ohne Standortfreigabe (FB-14); Obergrenze, eindeutige Liste, nur eine Zusage für den letzten
  Platz (FB-18, FB-19); Änderungen müssen Angemeldete erreichen (FB-20, FB-36); leere Plattform ersetzt WhatsApp
  nicht, Link teilen (FB-21); Anfrage ist keine Buchung, Preis und Storno vorab (FB-24 – FB-27); stöbern ohne
  Konto (FB-35); kein Chat/Feed nötig (FB-17, FB-40).
- **Belegte Konsequenzen (P2-Dokumente, `Interviews/04_Interviewauswertung_und_Einfluss.md`, D01–D09):** Niveau
  als Pflichtangabe und Treffpunkttext (SM-R05/07), manuelle Ortswahl (SM-R06/22), Kapazität und atomarer letzter
  Platz (SM-R10–13), Absage und In-App-Hinweise (SM-R08/09/14), Eventlink als Should (SM-R27), Buchung nur als
  optionaler Pilot mit Zustand „angefragt“ (SM-R15–19, 29).

### 2. Umfrage (P2, 11.10.2026, 4 Antworten)
- **Ergebnisse:** 3 von 4 finden oft niemanden, 4 von 4 empfinden das als schwer (4–5 von 5) (FB-01); Altersgruppe
  3/4, Niveau 2/4, Teilnehmerzahl 2/4, genauer Ort 2/4 vor dem ersten Treffen (FB-03); 3 von 4 würden ein Treffen
  einstellen (FB-05); Angst, dass niemand mitmacht (FB-06); Bewertungen 0 von 4.
- **Belegte Konsequenzen (Präsentation 2, Folie 7):** Kern Finden/Erstellen/Beitreten bleibt Must; Profil und Filter
  für Alter und Niveau (US-1.2, US-2.3); Mindestteilnehmerzahl und Benachrichtigung (US-3.2, US-4.3); Bewertungen
  nicht in Version 1. Grenze: n = 4, nicht repräsentativ; kein Freiwilliger für den Prototyptest (FB-11).

### 3. Feedbackrunde zur MVP-Demo (P4, bis 27.10.2026, 4 Personen)
- **Ergebnisse:** Teilnahme-Weg unklar (FB-44), Altersangabe missverständlich (FB-45), freie Plätze zu schwach
  sichtbar (FB-46); Kosten, Mitbringen, Organisator fehlen (FB-49, FB-51, FB-52); Erstellen-Button unauffällig
  (FB-54); Organisator will Teilnehmerliste und Verwaltung (FB-56, FB-57); Zweck der Seite unklar ohne Startseite (FB-58).
- **Belegte Konsequenzen im Vorgängerprototyp:** `project/docs/architecture/FEEDBACK-01.md` (27.10.2026):
  Button „Jetzt teilnehmen“ (ohne Backend deaktiviert), eindeutige Altersgruppe, „x von y Plätzen frei“,
  Sortierung „Ausgebuchte zuletzt“; `LANDINGPAGE.md`: Startseite nach Tims Feedback; Präsentation 4, Folie 5
  (Einstieg, Teilnahme, Informationen).
- **Vorschlag für das neue Backlog (dieses Dokument):** Altersangabe, Plätze und Treffpunkt in F-12; Kosten,
  Mitbringen, „Was erwartet dich?“ in F-13 (neu, Must); Organisator in F-14; sichtbarer Erstellen-Button als AK von
  F-17; Teilnehmerliste F-20; Startseite F-31; Nachricht an alle als Won't (F-30) wegen Widerspruch zu FB-40/FB-21.

### 4. Offen
- Nutzertest mit 5 realen Personen für NFR-1/H-2 (Präsentation 6), Szenario aus FB-42.
- Gespräch mit einem weiteren realen Betreiber, bevor der Buchungspilot über Could hinausgeht (H-3b).
