# SportMate – Feedback-Dokumentation

| | |
| --- | --- |
| Projekt | SportMate – Hochschul-Softwareprojekt, Wintersemester 2026/27 |
| Team | Julien, Renat, Paulo, Niklas |
| Hauptverantwortlich | Julien (Rolle „Anforderungen … Kundenfeedback dokumentieren“ laut Präsentation 1 vom 30.09.2026; vom Team zu bestätigen) |
| Autorinnen und Autoren mit Anteil in % | |
| Stand | Entwurf vom 23.11.2026, zusammengestellt von der Agentenrolle reporter aus `docs/feedback.md` und `docs/feedback/roh/` |
| Repository | <https://github.com/Paulo-Temme/SportMate> (Branch `develop`) |
| Live-App | <https://sportmate-gamma.vercel.app> |

<div class="pagebreak"></div>

## Inhalt

1. Grundsätze und Status der Quellen
2. Feedback-Runden über die Laufzeit
3. Ergebnisse und Konsequenzen je Runde
4. Hypothesen: bestätigt, widerlegt, offen
5. Register: Aussage, Konsequenz, Story und Stand im Produkt
6. Widersprüche und Feedback ohne oder mit verworfener Konsequenz
7. Geplante nächste Runde
8. Lücken

Abkürzungen: **FB-xx** = Eintrag im Feedback-Register · **F-xx** = Story · **H-x** = Hypothese aus der Vision ·
**MVP** = erste vorführbare Version (Minimum Viable Product) · **INT** = Interview · **U** = Umfrage · **M** = Feedbackrunde MVP.

## 1. Grundsätze und Status der Quellen

- Als Feedback zählen nur Aussagen echter Personen außerhalb des Teams (`CLAUDE.md`, „Ehrlichkeit“). Jede Aussage
  bekommt eine Zeile im Register `docs/feedback.md` mit Datum, Rolle, Methode, Rohmaterial, Konsequenz und Stories.
- Rolle und Bezug zur Zielgruppe genügen; Vornamen nur, wo das Team sie freigegeben hat.
- **Status der Interviews:** Die Interviews INT-01 bis INT-04 gelten laut verbindlicher Teamentscheidung (23.11.2026)
  als reale Gespräche. Die Befragten antworteten oft nur kurz; das Team hat die Transkripte nachträglich mit KI
  sprachlich ausformuliert. In den Originaldateien und in den Unterlagen zu Präsentation 2 und 3 waren sie als
  „KI-Simulation“ (SIM-01 bis SIM-04) vermerkt; laut Team ist dieser Vermerk falsch. Gesprächsdaten: offen (Datum der
  Transkripte angegeben).
- **Kein Feedback:** Das Hallenbetreiber-Interview SIM-05 ist eine KI-Simulation. Es steht nicht im Register und wird
  nur als „Annahme (SIM-05)“ genannt.
- Rohmaterial: `docs/feedback/roh/` – I1 `2026-10-10-int-01-studentin.md`, I2 `…-int-02-organisator.md`,
  I3 `…-int-03-betreiberin.md`, I4 `2026-10-11-int-04-studentin.md`, U `2026-10-11-umfrage.md`,
  M `2026-10-27-feedbackrunde-mvp.md`.
- Status der Konsequenzen im Register: alle **„Vorschlag“** (analyst hat vorgeschlagen, Entscheidung des Teams offen).

## 2. Feedback-Runden über die Laufzeit

| Datum | Was wurde gezeigt | Wie viele Personen, welche Rollen | Methode | Einträge |
| --- | --- | --- | --- | --- |
| 2026-10-10 | Produktidee (noch keine Software) | 3: Studentin, Organisator einer Freizeitgruppe, Hallenbetreiberin | halbstrukturierte Interviews, je 7 Fragen | FB-12 – FB-28 |
| 2026-10-11 | Produktidee | 4 Studierende (anonym) | Online-Umfrage (Google Forms), 21 Fragen | FB-01 – FB-11 |
| spätestens 2026-10-11 | Produktidee, Idee Hallenbuchung | 1 Studentin | halbstrukturiertes Interview, 14 Fragen | FB-29 – FB-42 |
| spätestens 2026-10-27 | MVP-Demo (Next.js, Demodaten: Liste, Filter, Karte, Details) | 4: zwei Studenten, eine Berufstätige, ein Organisator | Ersteindruck mit Note 1–5 und Änderungswünschen | FB-43 – FB-58 |
| offen (P6) | Release 1 (lauffähige App) | Ziel 5 Personen | Nutzertest NFR-1 nach Szenario FB-42 | – |

Feedback begleitet damit die Phasen Idee (Interviews, Umfrage) und erster Prototyp (MVP-Demo). Zur lauffähigen
Release-1-Version (Vercel, Supabase) gibt es noch kein Feedback.

## 3. Ergebnisse und Konsequenzen je Runde

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

## 4. Hypothesen: bestätigt, widerlegt, offen

| ID | Annahme | Status | Beleg |
| --- | --- | --- | --- |
| H-1 | Bedarf: Sportinteressierte in Flensburg haben Schwierigkeiten, passende Mitspieler oder Treffen zu finden. | bestätigt (vorläufig, n = 4 Umfrage + Interviews) | FB-01, FB-02, FB-29, FB-12 |
| H-2 | Bedienbarkeit: Neue Personen finden ohne Hilfe in höchstens 2 Minuten ein Treffen und treten bei (NFR-1). | offen; Gegenhinweise zur MVP-Version: Teilnahme-Weg und Zweck der Seite waren unklar | FB-44, FB-58, FB-54, FB-11 |
| H-3a | Organisierende würden selbst ein Treffen einstellen. | bestätigt als Absicht (3 von 4 „Ja“, 1 „Vielleicht“); tatsächliches Verhalten offen | FB-05, FB-37, FB-53, FB-21 |
| H-3b | Betreiber sind offen für einen Buchungstest über SportMate. | offen; Betreiberin will keine doppelte Datenpflege, keine Kooperationszusage (SIM-05 zählt nicht) | FB-24, FB-25, FB-28 |
| H-4 | Klare Angaben zu Niveau, Kosten, Mitbringen, Treffpunkt und Organisator senken die Hemmschwelle. | bestätigt durch mehrere unabhängige Aussagen | FB-03, FB-12, FB-15, FB-31, FB-49, FB-51 |
| H-5 | Personen bleiben nur, wenn sie regelmäßig passende Treffen finden, die nicht ausfallen. | offen (im Semester nicht prüfbar) | FB-41, FB-21, FB-17 |

Widerlegt ist bisher keine Hypothese. Quelle: `docs/vision.md`, Abschnitt Hypothesen.

## 5. Register: Aussage, Konsequenz, Story und Stand im Produkt

Spalten „Aussage“ und „Konsequenz“ aus `docs/feedback.md` (Register, gekürzt auf Wer/Aussage/Konsequenz). Spalte
„Stand im Produkt“: vom reporter aus den Akzeptanztests in `e2e/` (Commit `4fd94ad`) abgeleitet –
**umgesetzt** = Story hat Akzeptanztests für ihre Kernkriterien; **teilweise** = nur einzelne Kriterien; **offen** = nicht
umgesetzt; **verworfen/Won't** = bewusst nicht geplant. Der Backlog-Status selbst steht noch überall auf „offen“.

| ID | Wer (Rolle) | Aussage | Konsequenz (Vorschlag) | Stories | Stand im Produkt |
| --- | --- | --- | --- | --- | --- |
| FB-01 | 4 Studierende in Flensburg (U1–U4) | 3 von 4 finden Mitspieler „gar nicht – ich finde oft niemanden“; Schwierigkeit spontan Leute zu finden: 4 von 4 mit 4 oder 5 (von 5). | Kernumfang Finden, Erstellen, Beitreten bleibt Must; stützt H-1 | F-05, F-17, F-22 | F-05 umgesetzt; F-17 umgesetzt; F-22 umgesetzt |
| FB-02 | 4 Studierende (U1–U4) | In den letzten 3 Monaten fiel Sport wegen fehlender Mitspieler/Platz aus: 3× „1–2 Mal“, 1× „öfter als 5 Mal“. | keine Änderung, stützt H-1 | – | – |
| FB-03 | 4 Studierende (U1–U4) | Vor einem Treffen mit Fremden wollen sie wissen: Altersgruppe 3/4, Spielniveau 2/4, Anzahl Teilnehmende 2/4, genauer Ort 2/4. Bewertungen nennt niemand. | Details und Filter für Alter/Niveau/Plätze/Ort; Bewertungen verworfen, weil 0 von 4 Nennungen | F-07, F-12 | F-07 umgesetzt; F-12 umgesetzt |
| FB-04 | 4 Studierende (U1–U4) | Entfernung für spontanes Treffen: bis 2 km 1×, bis 5 km 2×, bis 10 km 1×. | Umkreis 2/5/10/20 km, Standard 5 km | F-10 | F-10 offen |
| FB-05 | 4 Studierende (U1–U4) | Würden ein Treffen in einer App einstellen: 3× „Ja“, 1× „Vielleicht“. | Treffen erstellen Must; stützt H-3a | F-17 | F-17 umgesetzt |
| FB-06 | Studentin/Student, 20–25 (U1) | Hinderungsgrund: „Die angst das niemand mit macht“. | Mindestteilnehmerzahl mit Status und Hinweis an Organisator | F-25, F-27 | F-25 teilweise (AK1); F-27 offen |
| FB-07 | 4 Studierende (U1–U4) | Was am meisten nervt: Mitspieler finden 2×, freien Platz finden/buchen 1×, gemeinsamen Termin finden 1×. | Buchung ist Nebenproblem (1/4): Buchungspilot nur Could | F-33 | F-33 offen |
| FB-08 | 4 Studierende (U1–U4) | Platz zuletzt gebucht: 2× „noch nie“, 2× „länger her“; Bezahlung: 2× eine Person zahlt, andere schicken Geld (PayPal), 1× online beim Betreiber. | verworfen: Bezahlung/Kostenaufteilung in der App, weil bestehende Lösung genügt und kein Bedarf genannt wurde | – | – |
| FB-09 | Studierende (U1, U4) | Haben bisher keine Apps/Websites zum Finden von Mitspielern genutzt („nein“, 2 ohne Angabe). | keine Änderung, kein Vorbild für Wettbewerb ableitbar | – | – |
| FB-10 | Studentin/Student, 20–25 (U1) | App muss leisten: „das man wirklich leute kennen lernt und sich trifft“. | stützt Fokus auf Beitreten mit Fremden; H-5 | F-22 | F-22 umgesetzt |
| FB-11 | 4 Studierende (U1–U4) | Niemand hat eine Kontaktmöglichkeit für einen 10-Minuten-Prototyptest hinterlassen (0 von 4). | keine Story; Nutzertest für H-2/NFR-1 muss anders rekrutiert werden (offen) | – | – |
| FB-12 | Studentin, neu in Flensburg, Basketball-Anfängerin (INT-01) | Ohne Niveauangabe geht sie nicht hin: „Ich muss vorher sehen, ob Anfänger willkommen sind.“ | Niveau Pflichtangabe und sichtbar; Hinweis „Anfänger willkommen“ | F-12, F-13, F-17 | F-12 umgesetzt; F-13 umgesetzt; F-17 umgesetzt |
| FB-13 | Studentin (INT-01) | Ein Kartenpunkt reicht nicht, sie braucht Eingang oder klaren Treffpunkt (z. B. „am nördlichen Tor“). | Treffpunkttext Pflichtfeld und in Details | F-12, F-17 | F-12 umgesetzt; F-17 umgesetzt |
| FB-14 | Studentin (INT-01) | Will einen Stadtteil eingeben, ohne Standort freizugeben; nicht dauerhaft; andere sollen ihren Aufenthaltsort nicht sehen. | Ortssuche ohne Standort; Standort nur optional und nicht gespeichert (SM-R22) | F-10, F-11 | F-10 offen; F-11 offen |
| FB-15 | Studentin (INT-01) | Vor Anmeldung braucht sie Sportart, Niveau, Dauer, freie Plätze, Kosten, Mitbringen und wer organisiert. | Detailansicht mit allen Angaben | F-12, F-13, F-14 | F-12 umgesetzt; F-13 umgesetzt; F-14 teilweise (AK1) |
| FB-16 | Studentin (INT-01) | Will sich wieder abmelden können, damit der Platz frei wird; Änderungen/Absagen in der App sehen. | Zurückziehen Must; Hinweis bei Änderung | F-23, F-26 | F-23 umgesetzt; F-26 offen |
| FB-17 | Studentin (INT-01) | Für den ersten Versuch reichen offene Treffen und einfache Anmeldung; Hallenbuchung später; Feed braucht sie nicht. | Social Feed verworfen (Nicht-Ziel); Buchung Could | F-33 | F-33 offen |
| FB-18 | Organisator offener Basketballtreffen (INT-02) | Braucht eindeutige Teilnehmerliste und Obergrenze; bei vollem Treffen klare Voll-Meldung; Warteliste erst später. | Kapazität, Ausgebucht-Zustand, Teilnehmerliste; Warteliste verworfen für Version 1, weil laut Aussage nicht nötig | F-17, F-20, F-22 | F-17 umgesetzt; F-20 teilweise (Datenschicht, Anzeige in Details; kein Akzeptanztest); F-22 umgesetzt |
| FB-19 | Organisator (INT-02) | Letzter Platz bei zwei gleichzeitigen Klicks: nur eine Zusage. Grenze erhöhen ja, unter die Zahl Angemeldeter senken nein. | atomarer Beitritt (NFR-5); Kapazitätsregel beim Bearbeiten | F-22, F-19 | F-22 umgesetzt; F-19 offen |
| FB-20 | Organisator (INT-02) | Bei Absage oder neuem Treffpunkt müssen die Angemeldeten es mitbekommen; Eintrag allein reicht nicht. | In-App-Hinweis; Benachrichtigung außerhalb der App als Could | F-26, F-29 | F-26 offen; F-29 offen |
| FB-21 | Organisator (INT-02) | „Für eine leere Karte wechselt meine Gruppe nicht von WhatsApp.“ Braucht teilbaren Link; Chat-Ersatz nicht nötig. | Link teilen; Leerzustand mit „Treffen erstellen“; kein Chat | F-15, F-06 | F-15 teilweise (AK3); F-06 umgesetzt |
| FB-22 | Organisator (INT-02) | Will Sportart, Niveau, Treffpunkt und Ausrüstung angeben; für den Prototyp sind nur öffentliche Treffen okay. | Felder beim Erstellen; private Treffen verworfen für Version 1 | F-17, F-13 | F-17 umgesetzt; F-13 umgesetzt |
| FB-23 | Organisator (INT-02) | Risiko: Wenn die Anmeldung zu aufwendig ist, schreiben Leute weiter „bin dabei“ in WhatsApp und er pflegt doppelt. | keine eigene Story; Beitritt mit einem Klick (F-22) und Test mit echter Gruppe offen | F-22 | F-22 umgesetzt |
| FB-24 | Betreiberin einer kleinen Sporthalle (INT-03) | „Eine Anfrage ist noch keine Zusage; verbindlich wird es erst nach unserer Bestätigung.“ | Status „Angefragt – noch keine verbindliche Buchung“ | F-33, F-35 | F-33 offen; F-35 Won't |
| FB-25 | Betreiberin (INT-03) | Ohne Kalenderabgleich darf die App freie Zeiten nicht als garantiert anzeigen. | keine Verfügbarkeitsgarantie; Kalenderintegration verworfen (kein Partner) | F-33, F-35 | F-33 offen; F-35 Won't |
| FB-26 | Betreiberin (INT-03) | Braucht Feld, Datum, Startzeit, Dauer, Sportart, Gruppengröße und eine verantwortliche Person; keine Daten aller Mitspielenden. | Pflichtangaben der Anfrage; NFR-7 | F-33 | F-33 offen |
| FB-27 | Betreiberin (INT-03) | „Gesamtpreis und Stornobedingungen müssen vor dem Absenden der Anfrage sichtbar sein.“ | Konditionen vor Absenden | F-34 | F-34 offen |
| FB-28 | Betreiberin (INT-03) | Pflegt keinen zweiten Kalender; höchstens Test mit wenigen Anfragen; keine Kooperationszusage. | H-3b nicht bestätigt; Buchungspilot bleibt Could/Won't | F-33, F-34, F-35 | F-33 offen; F-34 offen; F-35 Won't |
| FB-29 | Studentin, 23, Volleyball, kein Verein (Mara, INT-04) | Volleyball scheiterte, weil nicht genug Leute zusammenkamen; WhatsApp-Gruppen werden unübersichtlich; Fremde findet man so nicht. | stützt H-1 und Wertversprechen | F-05, F-22 | F-05 umgesetzt; F-22 umgesetzt |
| FB-30 | Studentin (Mara, INT-04) | Möchte sehen, ob für Anfänger, Fortgeschrittene oder alle, und dass neue Leute willkommen sind. | Niveau inkl. „Alle Niveaus“; Hinweis „Neue willkommen“ | F-12, F-13 | F-12 umgesetzt; F-13 umgesetzt |
| FB-31 | Studentin (Mara, INT-04) | Vor Anmeldung: Datum, Uhrzeit, genauer Treffpunkt, Dauer, wie viele schon dabei, was mitbringen, ob es etwas kostet. | Detailansicht inkl. Kosten und Mitbringen | F-12, F-13 | F-12 umgesetzt; F-13 umgesetzt |
| FB-32 | Studentin (Mara, INT-04) | Sucht zuerst nach Sportart, dann nach Tag/Uhrzeit, dann Ort. | Filter Sportart und Zeitraum Must, Ort Should | F-06, F-10 | F-06 umgesetzt; F-10 offen |
| FB-33 | Studentin (Mara, INT-04) | Eine Liste mit Stadtteil und Treffpunkt reicht ihr; Karte praktisch, aber nicht nötig. **Widerspruch zu FB-48.** | Liste Must, Karte Should | F-05, F-08 | F-05 umgesetzt; F-08 umgesetzt |
| FB-34 | Studentin (Mara, INT-04) | Anmeldung per Button; vorher klar, ob Plätze frei; danach Bestätigung „Du bist angemeldet“; wieder abmelden können. | Beitreten mit Bestätigung, Zurückziehen | F-22, F-23 | F-22 umgesetzt; F-23 umgesetzt |
| FB-35 | Studentin (Mara, INT-04) | Will ohne Registrierung stöbern; Konto erst zum Mitmachen okay; kein langes Profil vorab. | Stöbern ohne Konto; Profil optional und nachrangig | F-02, F-03 | F-02 umgesetzt; F-03 offen |
| FB-36 | Studentin (Mara, INT-04) | Bei kurzfristiger Absage Benachrichtigung aufs Handy; bei Tagen Vorlauf reicht Info in der App. | In-App-Hinweis Should; E-Mail/Push Could | F-26, F-29 | F-26 offen; F-29 offen |
| FB-37 | Studentin (Mara, INT-04) | Würde kleines Treffen (6–8 Leute) erstellen: Sportart, Zeit, Ort, Maximalzahl; App soll automatisch zeigen, wer kommt und wie viele Plätze frei sind. | Erstellen, Teilnehmerliste, Meine Treffen; stützt H-3a | F-17, F-20, F-24 | F-17 umgesetzt; F-20 teilweise (Datenschicht, Anzeige in Details; kein Akzeptanztest); F-24 umgesetzt |
| FB-38 | Studentin (Mara, INT-04) | Über Teilnehmende reicht Name/Benutzername, evtl. Niveau; keine Wohnorte/Telefonnummern; Organisator soll erkennbar sein. | Teilnehmerliste nur mit Anzeigenamen; Organisator sichtbar | F-14, F-20, F-03 | F-14 teilweise (AK1); F-20 teilweise (Datenschicht, Anzeige in Details; kein Akzeptanztest); F-03 offen |
| FB-39 | Studentin (Mara, INT-04) | Hallenbuchung nur in der Gruppe praktisch; Kosten und echte Verfügbarkeit vorher sehen; richtige Bestätigung. | Buchungspilot Could, Konditionen vor Absenden | F-33, F-34 | F-33 offen; F-34 offen |
| FB-40 | Studentin (Mara, INT-04) | Social-Media-Bereich und Chat braucht sie nicht (WhatsApp); wichtiger, dass Grundfunktionen gut funktionieren. **Widerspruch zu FB-56.** | Chat/Nachrichten Won't; Vorrang Kernabläufe | F-30 | F-30 Won't |
| FB-41 | Studentin (Mara, INT-04) | Hört auf, wenn es kaum Veranstaltungen gibt oder angemeldete Treffen ständig ausfallen. | H-5 (offen); Mindestzahl-Status zeigt Ausfallrisiko | F-25 | F-25 teilweise (AK1) |
| FB-42 | Studentin (Mara, INT-04) | Testvorschlag: Volleyball-Treffen finden, Infos prüfen, anmelden, abmelden – ohne Erklärung. | Szenario für Nutzertest NFR-1/H-2 und E2E-Test | F-22, F-23 | F-22 umgesetzt; F-23 umgesetzt |
| FB-43 | Student, 22, spielt gelegentlich Fußball (Lukas) | Seite modern und übersichtlich; Filter nach Sportart gefällt. Erster Eindruck 4/5. | bestätigt Filter | F-06 | F-06 umgesetzt |
| FB-44 | Student (Lukas) | Sieht freie Plätze, aber nicht, wie er mitmachen kann; wünscht Button „Jetzt teilnehmen“ auf jeder Karte. | Teilnahme-Button auf Karte und in Details; Gegenhinweis zu H-2 | F-22 | F-22 umgesetzt |
| FB-45 | Student (Lukas) | „20–25“ unklar: Altersbeschränkung oder Alter der Teilnehmenden? Wunsch: „Alter: 20–25 Jahre“. | Altersangabe eindeutig beschriften | F-12 | F-12 umgesetzt |
| FB-46 | Student (Lukas) | Freie Plätze hervorheben: „5 von 10 Plätzen frei“ statt „5 von 10 dabei“. | Platzanzeige in Liste und Details | F-05, F-12 | F-05 umgesetzt; F-12 umgesetzt |
| FB-47 | Student (Lukas) | Ausgebuchte Treffen optional nach unten sortieren, wenn Alternativen existieren. | Sortierung „Ausgebuchte zuletzt“ | F-05 | F-05 umgesetzt |
| FB-48 | Berufstätige, 34, neu in Flensburg (Sarah) | Die Karte gefällt besonders, weil sie sieht, wo Treffen stattfinden. Erster Eindruck 3/5. **Widerspruch zu FB-33.** | Karte bleibt (Should, Release 1) | F-08 | F-08 umgesetzt |
| FB-49 | Berufstätige (Sarah) | Will wissen, ob kostenlos, ob sie etwas mitbringen muss und ob wirklich jeder teilnehmen kann. | Kosten, Mitbringen, Teilnahmevoraussetzung in Details | F-13 | F-13 umgesetzt |
| FB-50 | Berufstätige (Sarah) | „Anfänger“ beim Fußball hilft; bei anderen Treffen unsicher, ob sie als Anfängerin willkommen ist. | Niveau bei jedem Treffen Pflicht und sichtbar | F-12, F-17 | F-12 umgesetzt; F-17 umgesetzt |
| FB-51 | Berufstätige (Sarah) | Will vorher wissen, wer organisiert (Vorname, Profil, bisherige Treffen). | Organisator in Details | F-14 | F-14 teilweise (AK1) |
| FB-52 | Berufstätige (Sarah) | Kurze Beschreibung „Was erwartet dich?“ und genauer Treffpunkt mit weiteren Infos. | Beschreibung und Treffpunkttext | F-12, F-13 | F-12 umgesetzt; F-13 umgesetzt |
| FB-53 | Organisiert regelmäßig Volleyballtreffen, 28 (Max) | Gut, dass man selbst Treffen erstellen kann; praktisch für seine Gruppe. Erster Eindruck 3/5. | stützt H-3a | F-17 | F-17 umgesetzt |
| FB-54 | Organisator (Max) | Button „Treffen erstellen“ oben rechts unauffällig, wirkt fast deaktiviert. | Button sichtbar gestalten (AK in F-17) | F-17 | F-17 umgesetzt |
| FB-55 | Organisator (Max) | Will Teilnehmerzahl festlegen, Teilnehmende entfernen und wissen, was bei kurzfristiger Absage passiert. | Kapazität; Entfernen (Could); Hinweis bei Absage (Could) | F-17, F-21, F-27 | F-17 umgesetzt; F-21 offen; F-27 offen |
| FB-56 | Organisator (Max) | Will sehen, wer angemeldet ist, und eine Nachricht an alle schicken, sonst bleibt WhatsApp. **Widerspruch zu FB-40/FB-21.** | Teilnehmerliste Should; Nachricht an alle verworfen für Version 1 (Won't), weil andere Befragte WhatsApp behalten wollen und Chat Moderation/Datenschutz erfordert | F-20, F-30 | F-20 teilweise (Datenschicht, Anzeige in Details; kein Akzeptanztest); F-30 Won't |
| FB-57 | Organisator (Max) | Wünscht übersichtliche Verwaltung eigener Treffen. | Meine Treffen, Bearbeiten | F-24, F-19 | F-24 umgesetzt; F-19 offen |
| FB-58 | Student, 24, erstmals auf der Seite (Tim) | Wusste nicht, worum es geht; wünscht Startseite mit Erklärung, „So funktioniert's“ in drei Schritten und zwei Buttons. Erster Eindruck 3/5. | Startseite; Gegenhinweis zu H-2 | F-31 | F-31 teilweise (Erstbesuch-Hinweis) |

## 6. Widersprüche und Feedback ohne oder mit verworfener Konsequenz

### 6.1 Widersprüche zwischen Befragten

| Widerspruch | Entscheidung (Vorschlag) | Begründung |
| --- | --- | --- |
| FB-33 (Liste reicht, Karte nicht nötig) vs. FB-48 (Karte gefällt besonders) | Liste Must, Karte Should, beide in Release 1 | beide Bedürfnisse bedient; Liste zeigt immer dieselben Treffer wie die Karte |
| FB-56 (Nachricht an alle, sonst bleibt WhatsApp) vs. FB-40, FB-21 (kein Chat, WhatsApp bleibt) | Nachricht an alle als Won't (F-30) | Mehrheit will keinen Chat; Chat erfordert Moderation und Datenschutzregeln; nach Nutzertest P6 erneut prüfen |

### 6.2 Keine Änderung oder verworfen

| ID | Aussage (kurz) | Konsequenz | Begründung |
| --- | --- | --- | --- |
| FB-02 | Sport fiel in 3 Monaten wegen fehlender Mitspieler/Platz aus | keine Änderung | stützt H-1, keine neue Anforderung |
| FB-03 (Teil) | Bewertungen nennt niemand | Bewertungen verworfen | 0 von 4 Nennungen |
| FB-08 | Bezahlung per PayPal unter Freunden | Bezahlung/Kostenaufteilung verworfen | bestehende Lösung genügt, kein Bedarf genannt |
| FB-09 | keine Apps zum Finden von Mitspielern genutzt | keine Änderung | kein Vorbild für Wettbewerb ableitbar |
| FB-11 | niemand hinterließ Kontakt für Prototyptest | keine Story | Nutzertest muss anders rekrutiert werden (offen) |
| FB-17 (Teil) | Feed braucht sie nicht | Social Feed verworfen | Nicht-Ziel |
| FB-18 (Teil) | Warteliste erst später | Warteliste verworfen für Version 1 | laut Aussage nicht nötig |
| FB-22 (Teil) | nur öffentliche Treffen okay | private Treffen verworfen für Version 1 | laut Aussage für den Prototyp ausreichend |
| FB-23 | Risiko Doppelpflege in WhatsApp | keine eigene Story | Beitritt mit einem Klick (F-22), Test mit echter Gruppe offen |
| FB-25 (Teil) | ohne Kalenderabgleich keine Garantie | Kalenderintegration verworfen | kein Partner |
| FB-28 | Betreiberin pflegt keinen zweiten Kalender | H-3b nicht bestätigt; Buchungspilot bleibt Could/Won't | keine Kooperationszusage |

## 7. Geplante nächste Runde

- Nutzertest mit 5 realen Personen für NFR-1/H-2 (Präsentation 6) mit der Live-Version
  <https://sportmate-gamma.vercel.app>, Szenario aus FB-42: Volleyball-Treffen finden, Infos prüfen, anmelden,
  abmelden – ohne Erklärung. Erfolgskriterium: mindestens 4 von 5 in höchstens 2 Minuten ohne Hilfe.
- Gespräch mit einem weiteren realen Betreiber, bevor der Buchungspilot über Could hinausgeht (H-3b).
- Nach jeder Runde: `/feedback` mit dem Rohmaterial, Konsequenzen vom Team entscheiden lassen.

## 8. Lücken

Siehe auch `abgabe/LUECKEN.md`.

| Was fehlt | Was das Team nachliefern muss |
| --- | --- |
| Feedback zur lauffähigen Software (Release 1) | Nutzertest/Feedbackrunde mit der Live-Version, Protokoll in `docs/feedback/roh/`, Register ergänzen |
| Verifizierte Gesprächsdaten der Interviews INT-01 – INT-04 und der Feedbackrunde (Datum, Form, Dauer) | Daten nachtragen; Widerspruch zum Originalvermerk „KI-Simulation“ erklären und belegen |
| Entschiedene Konsequenzen | alle 58 Einträge stehen auf „Vorschlag“; Team entscheidet und setzt Status „entschieden“/„umgesetzt“ |
| Stand im Produkt | Backlog-Status nachziehen, damit die Spalte nicht aus Tests abgeleitet werden muss |
| Wirkung in Prototyp-Dokumenten (`FEEDBACK-01.md`, `LANDINGPAGE.md`, `Interviews/04_Interviewauswertung_und_Einfluss.md`) | liegen nicht im Repository; bei Bedarf als Anhang beilegen |
