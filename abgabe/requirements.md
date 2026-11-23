# SportMate – Anforderungen

| | |
| --- | --- |
| Projekt | SportMate – Hochschul-Softwareprojekt, Wintersemester 2026/27 |
| Team | Julien, Renat, Paulo, Niklas |
| Hauptverantwortlich | Julien (Rolle „Anforderungen“ laut Präsentation 1 vom 30.09.2026; vom Team zu bestätigen) |
| Autorinnen und Autoren mit Anteil in % | |
| Stand | Entwurf vom 23.11.2026, zusammengestellt von der Agentenrolle reporter aus den Projektdokumenten |
| Repository | <https://github.com/Paulo-Temme/SportMate> (Branch `develop`) |
| Live-App | <https://sportmate-gamma.vercel.app> |

<div class="pagebreak"></div>

## Inhalt

1. Überblick
2. Vorgehen: Erhebung und Validierung
3. Stakeholder und Ziele
4. Notation
5. Anforderungen je Epic und Story
6. Qualitätsanforderungen und Randbedingungen
7. Priorisierung und bewusst nicht Gebautes
8. Nachvollziehbarkeit Feedback → Story
9. Änderungen an den Anforderungen über die Laufzeit
10. Lücken
- Anhang A: Altanforderungen (DR, NFR, SM-R) → Stories

Abkürzungen: **AK** = Akzeptanzkriterium · **FB-xx** = Eintrag im Feedback-Register · **F-xx** = Story (Feature) ·
**E-x** = Epic · **DR** = detaillierte funktionale Anforderung, **NFR** = nicht-funktionale (Qualitäts-)Anforderung,
**SM-R** = ergänzende Systemanforderung (alle drei aus Präsentation 3) · **MoSCoW** = Priorisierung Must/Should/Could/Won't ·
**MVP** = Minimum Viable Product, erste vorführbare Version · **RLS** = Row Level Security (Zugriffsschutz in der Datenbank).

## 1. Überblick

**Problem.** Wer spontan Sport machen will, findet oft keine passende Gruppe; Ort und Termin brauchen zusätzliche
Abstimmung (Präsentation 1, Folie 2; `docs/vision.md`, Abschnitt Problem). Absprachen laufen heute über Freunde und
WhatsApp-Gruppen, die bei vielen Personen unübersichtlich werden; Fremde lernt man so kaum kennen (FB-29).

**Wertversprechen.** SportMate zeigt offene Sporttreffen in Flensburg mit allen Angaben, die man vor dem Mitmachen mit
Fremden braucht (Niveau, Alter, Kosten, Mitbringen, Treffpunkt, Organisator, freie Plätze). Man tritt mit einem Klick
bei. Wer Mitspieler sucht, stellt ein Treffen in wenigen Schritten ein und sieht automatisch, wer kommt
(`docs/vision.md`, Abschnitt Wertversprechen).

**Umfang.** Die Anforderungen sind in 8 Epics mit 35 Stories (F-01 bis F-35) gegliedert. Release 1 (Präsentation 5,
25.11.2026) umfasst 14 Stories (13 Must, 1 Should) (`docs/backlog.md`).

## 2. Vorgehen: Erhebung und Validierung

### 2.1 Methoden und Runden

| Datum | Was wurde gezeigt | Wer (Rolle) | Methode | Ergebnis |
| --- | --- | --- | --- | --- |
| 2026-10-10 | Produktidee (keine Software) | Studentin und Anfängerin (INT-01), Organisator einer Basketball-Freizeitgruppe (INT-02), Betreiberin einer kleinen Sporthalle (INT-03) | halbstrukturierte Interviews, je 7 Fragen | FB-12 – FB-28 |
| 2026-10-11 | Produktidee | 4 Studierende in Flensburg, anonym | Online-Umfrage (Google Forms), 21 Fragen | FB-01 – FB-11 |
| spätestens 2026-10-11 | Produktidee, Idee Hallenbuchung | Studentin, 23, Volleyball (INT-04) | halbstrukturiertes Interview, 14 Fragen | FB-29 – FB-42 |
| spätestens 2026-10-27 | MVP-Demo (Next.js mit Demodaten: Liste, Filter, Karte, Details) | 2 Studenten, 1 Berufstätige, 1 Organisator | Ersteindruck mit Note 1–5 und Änderungswünschen | FB-43 – FB-58 |
| offen (Präsentation 6) | Release 1 | Ziel: 5 Personen | Nutzertest nach Szenario FB-42 | – |

Quelle: `docs/feedback.md`, Abschnitt „Feedback-Runden“; Rohmaterial in `docs/feedback/roh/`.

### 2.2 Status der Quellen (wichtig für die Bewertung)

- Die Interviews INT-01 bis INT-04 gelten laut **verbindlicher Teamentscheidung** (dokumentiert am 23.11.2026) als reale
  Gespräche. Die Befragten antworteten oft nur kurz; das Team hat die Transkripte nachträglich mit KI sprachlich
  ausformuliert. In den Originaldateien und in den Unterlagen zu Präsentation 2 und 3 waren diese Interviews als
  „KI-Simulation“ (SIM-01 bis SIM-04) vermerkt; laut Team ist dieser Vermerk falsch (`docs/feedback.md`,
  „Hinweis zum Status der Quellen“). Die genauen Gesprächsdaten sind offen; die Datumsangaben sind die der Transkripte.
- Die Umfrage (4 Antworten) und die Feedbackrunde zum MVP sind reale Erhebungen.
- Das Interview mit einem Hallenbetreiber (SIM-05) ist eine KI-Simulation. Es zählt nicht als Feedback und wird nur als
  „Annahme (SIM-05)“ genannt.
- Aussagekraft: Die Umfrage hat n = 4 und ist nicht repräsentativ. Niemand hat eine Kontaktmöglichkeit für einen
  Prototyptest hinterlassen (FB-11).

### 2.3 Validierung

| Maßnahme | Wie | Nachweis |
| --- | --- | --- |
| Hypothesen an echten Personen prüfen | fünf Hypothesen H-1 bis H-5 mit Prüfmethode und Status | `docs/vision.md`, Abschnitt Hypothesen |
| Feedbackrunde mit lauffähiger Demo | vier Personen bewerten die MVP-Demo | FB-43 – FB-58 |
| Eindeutige, prüfbare Kriterien | jedes AK im Format Gegeben–Wenn–Dann mit konkreten Werten; Regeln des planner gegen Mehrdeutigkeit | `docs/backlog.md`, `specs/F-XX/spec.md` |
| Freigabe durch Menschen | Vision, Konsequenz je Feedback, Story-Liste je Epic und Spec je Story werden vom Team freigegeben | `docs/prozess.md`, Freigabepunkte 1, 2, 4, 5 |
| Prüfung der Kriterien durch Tests | jedes AK hat einen Test auf festgelegter Ebene, Testname nennt `F-XX AKn` | `docs/testing/testfaelle.md` |
| Nutzertest | 5 Personen, Ziel mindestens 4 von 5 ohne Hilfe in höchstens 2 Minuten (NFR-1) | offen, geplant für Präsentation 6 |

Stand der Freigaben: Vision, Backlog und Specs tragen den Status „Entwurf, Freigabe offen“ (`docs/vision.md`,
`docs/backlog.md`, `specs/F-01/spec.md`, `specs/F-22/spec.md`). Alle Feedback-Zeilen haben den Status „Vorschlag“.

## 3. Stakeholder und Ziele

### 3.1 Stakeholder

| Wer | Interesse | Wie eingebunden |
| --- | --- | --- |
| SH1 Sportinteressierte (zuerst Studierende in Flensburg) | spontan Mitspieler und Treffen finden, vorher wissen, worauf sie sich einlassen | Umfrage (4), Interviews INT-01, INT-04, Feedbackrunde MVP (drei Personen) |
| SH2 Organisierende eines Treffens | fehlende Mitspieler gewinnen, Überblick über Zu- und Absagen ohne WhatsApp-Chaos | Interview INT-02, Feedbackrunde MVP (eine Person), Umfrage-Frage 16 |
| SH3 Betreiber von Sportstätten | vollständige Anfragen, keine Doppelbuchung, kein Mehraufwand | Interview INT-03; SIM-05 nur Annahme |
| SH4 Entwicklungsteam (Julien, Renat, Paulo, Niklas) | im Semester umsetzbar, wartbar, testbar | Retros, Board |
| SH5 Lehrende des Software-Projekts | nachvollziehbare Software-Engineering-Artefakte, feste Präsentationstermine | Präsentationen P1–P7 |
| DSGVO (Quelle ohne Person) | Datensparsamkeit, Einwilligung, Löschung | Randbedingung C-1 |

Quelle: `docs/vision.md`, Abschnitt Stakeholder.

### 3.2 Zielbaum

- **Z0:** Menschen in Flensburg treiben spontan gemeinsam Sport.
- **Z1:** Passende Treffen in der Nähe schnell finden (messbar über NFR-1).
- **Z2:** Fehlende Mitspieler selbst gewinnen und Sicherheit, dass ein Treffen stattfindet (NFR-2, NFR-5).
- **Z3:** Vertrauen gegenüber Unbekannten durch aussagekräftige Angaben zu Treffen und Organisator
  (Bewertungen zurückgestellt: 0 von 4 Nennungen in der Umfrage).
- **Z4 (optional):** Eine Sportfläche kommt ohne Hin und Her zustande (Anfrage statt Direktbuchung).
- **Z5 (Projekt):** Lauffähige Web-App auf Vercel mit echtem Konto (Supabase) und lokalem Demo-Modus; jede Must-Story
  mit mindestens einem automatisierten Test (NFR-8).

Quelle: `docs/vision.md`, Abschnitt Ziele (Zielbaum aus `SportMate – Anforderungen.docx`, §3).

### 3.3 Hypothesen

| ID | Annahme | Prüfung | Status | Beleg |
| --- | --- | --- | --- | --- |
| H-1 | Bedarf: Sportinteressierte in Flensburg haben Schwierigkeiten, passende Mitspieler oder Treffen zu finden. | Umfrage, Interviews | bestätigt (vorläufig, n = 4 + Interviews) | FB-01, FB-02, FB-29, FB-12 |
| H-2 | Bedienbarkeit: Neue Personen finden ohne Hilfe in höchstens 2 Minuten ein Treffen und treten bei. | Nutzertest mit 5 Personen | offen; Gegenhinweise zur MVP-Version | FB-44, FB-58, FB-54, FB-11 |
| H-3a | Organisierende würden selbst ein Treffen einstellen. | Umfrage, Interviews | als Absicht bestätigt (3 von 4 „Ja“) | FB-05, FB-37, FB-53, FB-21 |
| H-3b | Betreiber sind offen für einen Buchungstest. | Gespräch mit realem Betreiber | offen; keine Kooperationszusage | FB-24, FB-25, FB-28 |
| H-4 | Klare Angaben senken die Hemmschwelle, mit Fremden Sport zu machen. | Interviews, Feedbackrunde | bestätigt durch mehrere Aussagen | FB-03, FB-12, FB-15, FB-31, FB-49, FB-51 |
| H-5 | Personen bleiben nur, wenn sie regelmäßig passende Treffen finden. | Nutzung nach Pilot | offen (im Semester nicht prüfbar) | FB-41, FB-21, FB-17 |

## 4. Notation

Die Anforderungen sind in mehreren, sich ergänzenden Formen dokumentiert:

| Form | Wo | Warum diese Form |
| --- | --- | --- |
| Vision mit Problem, Zielbaum, Hypothesen, Stakeholdern | `docs/vision.md` | Gemeinsames Verständnis, Quelle aller Epics; Hypothesen machen prüfbar, was noch Annahme ist |
| User Story „Als … möchte ich …, damit …“ | je Story im Backlog und in der Spec | beschreibt Bedarf aus Nutzersicht und klein genug für eine Umsetzungseinheit (Cohn 2004, laut `docs/management/praktiken.md`) |
| Herkunft je Story | Feld „Quelle“ (FB-xx, H-x, Z-x, DR/NFR/SM-R oder „Annahme“) | macht sichtbar, ob eine Anforderung belegt ist |
| Szenario | Abschnitt „Szenario“ der Spec | konkreter Ablauf mit Personen und Werten, verständlich für Außenstehende |
| Akzeptanzkriterien im Format Gegeben–Wenn–Dann | je Story, nummeriert AK1 … AKn | eindeutig prüfbar mit konkreten Werten; jedes AK wird zu einem Test mit gleichem Namen |
| Messbare Qualitätsanforderungen | NFR-Tabelle mit Prüfmethode | Qualität wird überprüfbar statt Wunsch |
| MoSCoW-Priorität und Größe S/M/L | Backlog-Übersicht | Verhandlung des Umfangs bei festen Terminen |
| Traceability-Tabellen | `docs/requirements/traceability.md`, Feedback-Register | Herkunft und Verbleib jeder Anforderung |

Gemeinsame Begriffe für alle Akzeptanzkriterien (`docs/backlog.md`): Niveaus „Alle Niveaus“, „Anfänger“,
„Fortgeschritten“, „Erfahren“; Altersgruppen „unter 20“, „20–25“, „26–30“, „31–40“, „über 40“, leer = offen für alle;
Kapazität 2–50 Plätze einschließlich organisierender Person; freie Plätze = Kapazität − Teilnehmende; Zeiten in
Europe/Berlin; „jetzt“ ist in jedem Testfall fest vorgegeben; jede Story funktioniert im Supabase- und im Demo-Modus.

Beispiel einer vollständigen Spec (F-22, `specs/F-22/spec.md`): Story, Herkunft, Szenario („Lea öffnet ein Treffen mit
4 von 5 belegten Plätzen und tritt bei … Tom erhält ‚Leider gerade ausgebucht.‘“), Akzeptanzkriterien mit Testebene,
Qualitätsanforderung Q1 (NFR-5: keine Überbuchung), Randbedingungen, Nicht enthalten, Entwurf, offene Fragen und
Zuordnung Kriterium → Ebene → Test → Datei.

## 5. Anforderungen je Epic und Story

Vollständig übernommen aus `docs/backlog.md` (Stand nach dem Endlauf vom 23.11.2026, Commit `004a9fa`). Specs mit zusätzlichem
Szenario und Testzuordnung liegen für F-01 und F-22 vor (`specs/`). Status-Regel: „umgesetzt“ nur, wenn zu jedem AK ein Test
existiert und im Endlauf grün war; „teilweise“, wenn einzelne AKs fehlen, abweichen oder ungetestet sind. Übersicht in Abschnitt 7.2.

### E-1 Konto und Anmeldung
Ziel: Z3, Z5. Besondere Vorsicht: Login und Rechte (im Protokoll markieren).

#### F-01 Registrieren, anmelden, abmelden
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

#### F-02 Ohne Konto stöbern, Anmeldung erst beim Mitmachen
- **User Story:** Als neue Besucherin möchte ich Treffen ohne Konto ansehen und erst beim Mitmachen zur Anmeldung geleitet werden, damit ich vorher prüfen kann, ob es passende Angebote gibt.
- **Quelle:** DR-1.1.4, SM-R27 (Rücksprung), SM-R21; FB-35.
- **Priorität / Größe / Release 1:** Must / S / ja · **Status:** umgesetzt (AK1–AK4 Akzeptanztests grün)
- **Akzeptanzkriterien:**
  - AK1: Gegeben eine nicht angemeldete Person und 3 kommende Treffen. Wenn sie die Treffenübersicht öffnet, dann sieht sie alle 3 Treffen und deren Details ohne Anmeldeaufforderung.
  - AK2: Gegeben eine nicht angemeldete Person in den Details von Treffen `t-volleyball-1`. Wenn sie „Jetzt teilnehmen“ wählt, dann erscheint die Anmeldung und sie ist nicht Teilnehmerin.
  - AK3: Gegeben AK2. Wenn sie sich erfolgreich anmeldet, dann ist sie zurück in den Details von `t-volleyball-1` (Teilnahme wird nicht automatisch ausgelöst).
  - AK4: Gegeben eine nicht angemeldete Person. Wenn sie „Treffen erstellen“ wählt, dann erscheint die Anmeldung statt des Formulars.

#### F-03 Profil mit Anzeigename, Sportarten, Niveau, Altersgruppe
- **User Story:** Als Sportinteressierte möchte ich einen Anzeigenamen sowie meine Sportarten mit Niveau und meine Altersgruppe angeben, damit andere sehen, wer ich bin, ohne private Daten preiszugeben.
- **Quelle:** DR-1.2.1, DR-1.2.2, DR-1.2.3, SM-R02 (Konflikt F07: Umfang öffentlicher Felder); FB-38, FB-35 (kein Pflicht-Langprofil).
- **Priorität / Größe / Release 1:** Should / M / nein · **Status:** offen
- **Akzeptanzkriterien:**
  - AK1: Gegeben eine angemeldete Person. Wenn sie Anzeigename `Lea`, Sportart Volleyball mit Niveau „Anfänger“ und Altersgruppe „20–25“ speichert, dann zeigt ihr Profil genau diese Werte.
  - AK2: Gegeben das Profilformular. Wenn der Anzeigename `L` (1 Zeichen) lautet, dann wird nicht gespeichert und „2–40 Zeichen“ erscheint.
  - AK3: Gegeben ein gespeichertes Profil. Wenn eine andere Person es ansieht, dann sieht sie Anzeigename, Sportarten mit Niveau und Altersgruppe, aber weder E-Mail noch Geburtsdatum.
  - AK4: Gegeben eine neu registrierte Person ohne Profilangaben. Wenn sie einem Treffen beitreten will, dann ist das ohne Ausfüllen des Profils möglich.

#### F-04 Konto und eigene Daten löschen
- **User Story:** Als Nutzerin möchte ich mein Konto löschen, damit meine Daten nicht weiter gespeichert werden.
- **Quelle:** C-1 (DSGVO, Löschmöglichkeit). Kein Feedback, rechtliche Vorgabe.
- **Priorität / Größe / Release 1:** Could / S / nein · **Status:** offen
- **Akzeptanzkriterien:**
  - AK1: Gegeben eine angemeldete Person mit Teilnahme an einem kommenden Treffen. Wenn sie „Konto löschen“ bestätigt, dann ist sie abgemeldet, die Anmeldung mit ihren Zugangsdaten schlägt fehl und das Treffen hat einen Teilnehmenden weniger.
  - AK2: Gegeben eine Person, die ein kommendes Treffen organisiert. Wenn sie „Konto löschen“ wählt, dann erscheint der Hinweis „Sage zuerst deine Treffen ab“ und nichts wird gelöscht.

### E-2 Treffen entdecken
Ziel: Z1.

#### F-05 Liste kommender Treffen
- **User Story:** Als Sportinteressierter möchte ich alle kommenden Treffen in einer Liste mit freien Plätzen sehen, damit ich schnell ein Treffen finde, bei dem noch Platz ist.
- **Quelle:** SM-R03, DR-2.1.3, DR-2.1.4 (Konflikt F03: begonnene Treffen werden nicht gezeigt); FB-33, FB-46, FB-47, FB-29.
- **Priorität / Größe / Release 1:** Must / M / ja · **Status:** umgesetzt (AK1–AK3, AK5 E2E grün, AK4 Unit (TC-U-14) grün)
- **Akzeptanzkriterien:**
  - AK1: Gegeben jetzt = 2026-11-25 10:00 und Treffen A (heute 18:00), B (morgen 12:00), C (gestern 18:00), D (heute 12:00, abgesagt). Wenn die Liste geladen wird, dann zeigt sie genau A, dann B.
  - AK2: Gegeben Treffen A mit Kapazität 10 und 5 Teilnehmenden. Wenn die Liste angezeigt wird, dann steht auf der Karte von A „5 von 10 Plätzen frei“.
  - AK3: Gegeben Treffen A (heute 18:00, ausgebucht 10 von 10) und B (morgen 12:00, 3 frei) und Sortierung „Ausgebuchte zuletzt“ (Standard). Wenn die Liste angezeigt wird, dann steht B vor A und A trägt „Ausgebucht“.
  - AK4: Gegeben jetzt = 2026-11-25 18:00 und Treffen A mit Beginn 18:00. Wenn die Liste geladen wird, dann ist A nicht enthalten.
  - AK5 (ergänzt 23.11.2026, Test TC-A-56): Gegeben die Startseite. Wenn nacheinander „Meine Treffen“, „Treffen erstellen“, „Profil“ und „Entdecken“ in der Tab-Leiste angeklickt werden, dann öffnet sich jeweils das Ziel und „Entdecken“ ist am Ende als aktuelle Seite markiert.

#### F-06 Filter Sportart und Zeitraum mit Leerzustand
- **User Story:** Als Sportinteressierte möchte ich nach Sportarten und Zeitraum filtern, damit ich nicht durch unpassende Treffen scrollen muss.
- **Quelle:** DR-2.2.1, DR-2.2.2, DR-2.2.3, SM-R04, SM-R28; FB-32, FB-43, FB-21.
- **Priorität / Größe / Release 1:** Must / M / ja · **Status:** umgesetzt (AK1, AK2, AK4, AK5 E2E grün, AK2/AK3 zusätzlich Unit/Komponente)
- **Akzeptanzkriterien:**
  - AK1: Gegeben Treffen Fußball, Volleyball, Laufen. Wenn die Sportarten Volleyball und Laufen gewählt sind, dann zeigt die Liste genau Volleyball und Laufen (ODER-Verknüpfung).
  - AK2: Gegeben jetzt = Mittwoch 2026-11-25 10:00 und Treffen am 25.11. 18:00, 26.11. 18:00, 29.11. 10:00, 02.12. 10:00. Wenn „Heute“ gewählt ist, dann nur 25.11.; „Morgen“ nur 26.11.; „Diese Woche“ 25.11., 26.11. und 29.11.
  - AK3: Gegeben dieselben Treffen. Wenn das Datum 2026-12-02 gewählt ist, dann zeigt die Liste nur das Treffen vom 02.12.
  - AK4: Gegeben Sportart Basketball gewählt und kein Basketball-Treffen. Wenn gefiltert wird, dann erscheint „Keine Treffen gefunden“ mit dem Link „Selbst ein Treffen erstellen“.
  - AK5: Gegeben Filter Volleyball + „Heute“. Wenn „Filter zurücksetzen“ gewählt wird, dann zeigt die Liste wieder alle kommenden Treffen.

#### F-07 Filter Niveau und Altersgruppe
- **User Story:** Als Sportinteressierte möchte ich nach Niveau und Altersgruppe filtern, damit ich mit Leuten spiele, die zu mir passen.
- **Quelle:** DR-2.3.1, DR-2.3.2; FB-03 (Alter 3/4, Niveau 2/4), FB-12, FB-50.
- **Priorität / Größe / Release 1:** Must / S / ja · **Status:** umgesetzt (AK1–AK3 E2E grün)
- **Akzeptanzkriterien:**
  - AK1: Gegeben Treffen mit Niveau „Anfänger“, „Fortgeschritten“, „Alle Niveaus“. Wenn „Anfänger“ gewählt ist, dann zeigt die Liste „Anfänger“ und „Alle Niveaus“.
  - AK2: Gegeben Treffen mit Altersgruppe „20–25“, „31–40“ und ohne Altersgruppe. Wenn „20–25“ gewählt ist, dann zeigt die Liste „20–25“ und das Treffen ohne Altersgruppe.
  - AK3: Gegeben Niveau „Erfahren“ und Altersgruppe „unter 20“ gewählt, kein passendes Treffen. Wenn gefiltert wird, dann erscheint der Leerzustand aus F-06 AK4.

#### F-08 Karte mit denselben Treffen wie die Liste
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

#### F-09 Freitextsuche
- **User Story:** Als Sportinteressierter möchte ich nach einem Wort suchen, damit ich ein Treffen wiederfinde, von dem ich gehört habe.
- **Quelle:** Annahme des Teams, nicht validiert (Suchfeld bereits im Datenmodell F-00).
- **Priorität / Größe / Release 1:** Could / S / nein · **Status:** umgesetzt (AK1–AK2 E2E grün (vorgezogen, nicht Release 1))
- **Akzeptanzkriterien:**
  - AK1: Gegeben Treffen „Beachvolleyball Solitüde“ und „Feierabendlauf Hafen“. Wenn `hafen` eingegeben wird, dann zeigt die Liste nur „Feierabendlauf Hafen“ (Groß-/Kleinschreibung egal, Suche in Titel, Treffpunkt, Beschreibung).
  - AK2: Gegeben Suchtext `   ` (nur Leerzeichen). Wenn gesucht wird, dann zeigt die Liste alle Treffen.

#### F-10 Ortssuche und Umkreis ohne Standortfreigabe
- **User Story:** Als Studentin möchte ich einen Stadtteil eingeben und einen Umkreis wählen, ohne meinen Standort freizugeben, damit ich nur Treffen in erreichbarer Nähe sehe.
- **Quelle:** DR-2.1.2, DR-2.4.1, SM-R06, SM-R22; FB-14, FB-04 (2–10 km), FB-32.
- **Priorität / Größe / Release 1:** Should / M / nein · **Status:** offen
- **Akzeptanzkriterien:**
  - AK1: Gegeben der Umkreisfilter. Wenn er geöffnet wird, dann bietet er 2, 5, 10 und 20 km an, 5 km ist vorausgewählt.
  - AK2: Gegeben Suchpunkt Flensburg-Mürwik und Treffen in 1,8 km, 4,9 km und 7 km Entfernung, Umkreis 5 km. Wenn gefiltert wird, dann zeigt die Liste die Treffen in 1,8 km und 4,9 km.
  - AK3: Gegeben keine Standortfreigabe. Wenn `Weiche` als Stadtteil gewählt wird, dann wird die Karte auf Weiche zentriert und der Umkreis von dort berechnet.
  - AK4: Gegeben eine Suche mit Suchpunkt. Wenn sie ausgeführt wurde, dann ist der Suchpunkt weder im Konto noch in der Datenbank gespeichert (Integrationstest, SM-R22).

#### F-11 Optional eigenen Gerätestandort verwenden
- **User Story:** Als Sportinteressierter möchte ich für eine einzelne Suche meinen Standort freigeben können, damit ich keinen Ort eintippen muss.
- **Quelle:** DR-2.1.1, SM-R22; FB-14 (nur für eine einzelne Suche, nicht dauerhaft).
- **Priorität / Größe / Release 1:** Could / S / nein · **Status:** offen
- **Akzeptanzkriterien:**
  - AK1: Gegeben die Freigabe wird erteilt (Position 54.79 N, 9.43 O simuliert). Wenn „Meinen Standort verwenden“ gewählt wird, dann wird die Karte darauf zentriert.
  - AK2: Gegeben die Freigabe wird verweigert. Wenn „Meinen Standort verwenden“ gewählt wird, dann erscheint „Standort nicht freigegeben – gib einen Ort ein“ und die Ortssuche aus F-10 ist fokussiert.
  - AK3: Gegeben eine Suche mit Gerätestandort. Wenn eine andere Person das Treffen ansieht, dann sieht sie diesen Standort nirgends.

### E-3 Treffen-Details
Ziel: Z3. Hypothese H-4.

#### F-12 Detailansicht mit Treffpunkt, Niveau, eindeutiger Altersangabe und freien Plätzen
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

#### F-13 Kosten, Mitbringen und „Was erwartet dich?“
- **User Story:** Als Neue in Flensburg möchte ich sehen, ob ein Treffen etwas kostet, was ich mitbringen muss und was mich erwartet, damit ich ohne Überraschungen hingehe.
- **Quelle:** FB-49, FB-31, FB-15, FB-52, FB-30, FB-22, H-4. Neue Felder gegenüber DR/SM-R (Datenbankschema: im Protokoll markieren).
- **Priorität / Größe / Release 1:** Must / S / ja · **Status:** teilweise (AK1, AK3 grün; AK2 ohne Kostenhinweis „(Hallenmiete)“ geprüft, AK4 (reiner Text, `<b>` wörtlich) ohne Test)
- **Akzeptanzkriterien:**
  - AK1: Gegeben ein Treffen mit Kosten 0. Wenn die Details angezeigt werden, dann steht dort „Kostenlos“; in der Liste ebenfalls „Kostenlos“.
  - AK2: Gegeben Kosten 3,50 € pro Person mit Hinweis „Hallenmiete“. Wenn die Details angezeigt werden, dann steht dort „3,50 € pro Person (Hallenmiete)“.
  - AK3: Gegeben Mitbringen „Hallenschuhe, Wasser“. Wenn die Details angezeigt werden, dann steht dort „Mitbringen: Hallenschuhe, Wasser“; bei leerem Feld „Mitbringen: nichts Besonderes“.
  - AK4: Gegeben Beschreibung „Lockeres Spiel, Neue sind willkommen“. Wenn die Details angezeigt werden, dann steht der Text unter „Was erwartet dich?“ als reiner Text (eingegebenes `<b>` erscheint wörtlich, SM-R23).

#### F-14 Organisator im Treffen erkennen
- **User Story:** Als Sportinteressierte möchte ich sehen, wer ein Treffen organisiert, damit ich nicht zu völlig Unbekannten an einen unbekannten Ort gehe.
- **Quelle:** SM-R05; FB-51, FB-38, FB-15.
- **Priorität / Größe / Release 1:** Should / S / nein · **Status:** teilweise (AK2 grün; AK1 nur „Organisiert von …“, ohne Anzahl organisierter Treffen)
- **Akzeptanzkriterien:**
  - AK1: Gegeben Organisator mit Anzeigename `Max`, der 3 weitere vergangene Treffen organisiert hat. Wenn die Details angezeigt werden, dann steht dort „Organisiert von Max · 4 Treffen organisiert“.
  - AK2: Gegeben derselbe Organisator. Wenn die Details angezeigt werden, dann erscheinen weder E-Mail noch andere Kontaktdaten.

#### F-15 Link zu einem Treffen teilen
- **User Story:** Als Organisator möchte ich einen Link zu meinem Treffen kopieren, damit meine bestehende WhatsApp-Gruppe sich direkt dort anmelden kann.
- **Quelle:** SM-R27; FB-21.
- **Priorität / Größe / Release 1:** Should / S / nein · **Status:** teilweise (nur AK3 (unbekannter Link) umgesetzt und grün; „Link kopieren“ fehlt)
- **Akzeptanzkriterien:**
  - AK1: Gegeben Treffen `t-volleyball-1`. Wenn „Link kopieren“ gewählt wird, dann enthält die Zwischenablage `<Basis-URL>/treffen/t-volleyball-1` und „Link kopiert“ erscheint.
  - AK2: Gegeben dieser Link. Wenn er in einem neuen Browser ohne Anmeldung geöffnet wird, dann erscheinen die Details von `t-volleyball-1`.
  - AK3: Gegeben ein Link `/treffen/gibt-es-nicht`. Wenn er geöffnet wird, dann erscheint „Treffen nicht gefunden“ mit Link zur Übersicht.

#### F-16 Route zum Treffpunkt in Karten-App öffnen
- **User Story:** Als Teilnehmerin möchte ich die Route zum Treffpunkt öffnen, damit ich den Ort finde.
- **Quelle:** DR-2.5.2.
- **Priorität / Größe / Release 1:** Could / S / nein · **Status:** offen
- **Akzeptanzkriterien:**
  - AK1: Gegeben ein Treffen bei 54.7749 N, 9.4500 O. Wenn „Route öffnen“ gewählt wird, dann öffnet sich in neuem Tab eine OpenStreetMap-Routen-URL mit diesen Zielkoordinaten.

### E-4 Treffen organisieren
Ziel: Z2. Hypothese H-3a. Besondere Vorsicht: Rechte (RLS) – im Protokoll markieren.

#### F-17 Treffen erstellen
- **User Story:** Als Organisatorin möchte ich ein Treffen mit Sportart, Ort, Zeit, Plätzen und Niveau veröffentlichen, damit mir fehlende Mitspieler beitreten.
- **Quelle:** DR-3.1.1–3.1.5, SM-R07, SM-R23, NFR-2; FB-05, FB-37, FB-22, FB-13, FB-54, FB-53.
- **Priorität / Größe / Release 1:** Must / M / ja · **Status:** umgesetzt (AK1–AK5 grün, Höchstdauer 12 h (BUG-04) ergänzt)
- **Akzeptanzkriterien:**
  - AK1: Gegeben jetzt = 2026-11-25 10:00, angemeldete Person `lea`. Wenn sie Titel „Volleyball am Abend“, Volleyball, Treffpunkt „Halle Sandberg, Eingang Nord“, Kartenpunkt, 2026-11-26 18:00–20:00, Kapazität 8, Niveau „Alle Niveaus“, Kosten 0 eingibt und veröffentlicht, dann erscheint das Treffen in der Liste mit „7 von 8 Plätzen frei“ und `lea` ist erste Teilnehmerin.
  - AK2: Gegeben dasselbe Formular ohne Treffpunkttext. Wenn veröffentlicht wird, dann wird nichts gespeichert und das Feld Treffpunkt ist mit „Pflichtfeld“ markiert.
  - AK3: Gegeben Beginn 2026-11-25 09:00 (vor jetzt). Wenn veröffentlicht wird, dann erscheint „Der Termin muss in der Zukunft liegen“; bei Ende 17:00 vor Beginn 18:00 erscheint „Das Ende muss nach dem Beginn liegen“.
  - AK4: Gegeben Kapazität 1 oder 51. Wenn veröffentlicht wird, dann erscheint „2 bis 50 Plätze“ und nichts wird gespeichert.
  - AK5: Gegeben die Übersicht auf 360 px Breite. Wenn sie angezeigt wird, dann ist „Treffen erstellen“ ohne Scrollen sichtbar und als aktiver Button gestaltet (Kontrast mind. 4,5:1).

#### F-18 Eigenes Treffen absagen
- **User Story:** Als Organisator möchte ich mein Treffen absagen, damit niemand umsonst zum Treffpunkt kommt.
- **Quelle:** DR-3.3.2, SM-R09, SM-R21; FB-20, FB-41.
- **Priorität / Größe / Release 1:** Must / S / ja · **Status:** umgesetzt (AK1 E2E, AK2 Unit/Integration, AK3 Supabase-Integration (echte DB, 285/285) grün)
- **Akzeptanzkriterien:**
  - AK1: Gegeben `max` organisiert ein kommendes Treffen mit 4 Teilnehmenden. Wenn er „Treffen absagen“ bestätigt, dann ist der Status „Abgesagt“, das Treffen verschwindet aus Liste und Karte und erscheint bei den 4 Teilnehmenden unter „Meine Treffen“ als „Abgesagt“.
  - AK2: Gegeben ein abgesagtes Treffen. Wenn jemand beitreten will, dann wird das abgelehnt.
  - AK3: Gegeben `lea` ist nicht Organisatorin. Wenn sie per direktem Datenbankaufruf (Supabase-Client mit ihrem Token) das Treffen absagen will, dann lehnt die RLS-Regel ab und der Status bleibt unverändert (Integrationstest).

#### F-19 Eigenes Treffen bearbeiten
- **User Story:** Als Organisator möchte ich Zeit, Ort und Plätze meines Treffens ändern, damit es zu geänderten Bedingungen passt.
- **Quelle:** DR-3.3.1, SM-R08; FB-19, FB-57.
- **Priorität / Größe / Release 1:** Should / M / nein · **Status:** offen
- **Akzeptanzkriterien:**
  - AK1: Gegeben ein Treffen mit Kapazität 10 und 6 Teilnehmenden. Wenn der Organisator die Kapazität auf 12 ändert, dann zeigt es „6 von 12 Plätzen frei“.
  - AK2: Gegeben dasselbe Treffen. Wenn er die Kapazität auf 5 ändert, dann wird nicht gespeichert und „Mindestens 6 – so viele sind schon angemeldet“ erscheint.
  - AK3: Gegeben ein bereits begonnenes Treffen. Wenn er es bearbeiten will, dann ist „Bearbeiten“ nicht verfügbar.
  - AK4: Gegeben eine andere Person als der Organisator. Wenn sie die Änderung per Datenbankaufruf versucht, dann lehnt die RLS-Regel ab.

#### F-20 Teilnehmerliste sehen
- **User Story:** Als Organisatorin möchte ich sehen, wer zugesagt hat, damit ich ohne Rückfragen weiß, wer kommt.
- **Quelle:** SM-R13; FB-18, FB-37, FB-56, FB-38 (nur Namen).
- **Priorität / Größe / Release 1:** Should / S / nein · **Status:** teilweise (AK1/AK2 Unit und Supabase-Integration grün; AK3 ohne eigenen Test)
- **Akzeptanzkriterien:**
  - AK1: Gegeben ein Treffen mit Teilnehmenden `Lea`, `Max`, `Tom`. Wenn die Organisatorin oder eine Teilnehmende die Details öffnet, dann sieht sie die drei Anzeigenamen.
  - AK2: Gegeben eine nicht teilnehmende Person. Wenn sie die Details öffnet, dann sieht sie nur „3 Teilnehmende“, keine Namen.
  - AK3: Gegeben die Liste. Wenn sie angezeigt wird, dann enthält sie keine E-Mail-Adressen.

#### F-21 Teilnehmende aus eigenem Treffen entfernen
- **User Story:** Als Organisator möchte ich eine Person aus meinem Treffen entfernen, damit der Platz wieder frei wird, wenn sie nicht kommt.
- **Quelle:** FB-55.
- **Priorität / Größe / Release 1:** Could / S / nein · **Status:** offen
- **Akzeptanzkriterien:**
  - AK1: Gegeben ein Treffen mit 8 von 8 Plätzen belegt, darunter `Tom`. Wenn der Organisator `Tom` entfernt, dann zeigt es „1 von 8 Plätzen frei“ und `Tom` sieht das Treffen nicht mehr unter „Meine Treffen“.
  - AK2: Gegeben der Organisator selbst. Wenn er sich entfernen will, dann ist das nicht möglich (Hinweis: „Sage das Treffen stattdessen ab“, P3-Regel F02).

### E-5 Teilnahme
Ziel: Z1, Z2. Hypothese H-2.

#### F-22 Einem Treffen beitreten („Jetzt teilnehmen“)
- **User Story:** Als Sportinteressierte möchte ich mit einem Klick auf „Jetzt teilnehmen“ beitreten und eine Bestätigung sehen, damit ich sicher weiß, dass ich dabei bin.
- **Quelle:** DR-4.1.1–4.1.4, SM-R10, SM-R11, NFR-5; FB-44, FB-34, FB-19, FB-18, FB-23.
- **Priorität / Größe / Release 1:** Must / M / ja · **Status:** teilweise (AK1–AK3, AK5 grün; AK4 nur sequenziell (EVENT_FULL) geprüft, kein Paralleltest)
- **Akzeptanzkriterien:**
  - AK1: Gegeben angemeldete `lea`, Treffen mit 4 von 5 Plätzen belegt. Wenn sie „Jetzt teilnehmen“ wählt, dann erscheint „Du bist dabei“ (geändert 23.11.2026 wegen BUG-02, vorher „Du bist angemeldet“), das Treffen zeigt „Ausgebucht“ (5 von 5) und steht unter „Meine Treffen“.
  - AK2: Gegeben ein ausgebuchtes Treffen. Wenn die Details angezeigt werden, dann ist statt „Jetzt teilnehmen“ „Ausgebucht“ zu sehen und kein Beitritt möglich.
  - AK3: Gegeben `lea` ist bereits Teilnehmerin. Wenn der Beitritt erneut ausgelöst wird (Doppelklick oder Wiederholung nach Netzfehler), dann bleibt die Teilnehmerzahl gleich.
  - AK4: Gegeben 1 freier Platz und zwei Personen treten gleichzeitig bei. Wenn beide Anfragen an Supabase gehen, dann wird genau eine angenommen, die andere sieht „Leider gerade ausgebucht“ (Integrationstest, NFR-5).
  - AK5: Gegeben die Liste. Wenn ein Treffen mit freien Plätzen angezeigt wird, dann trägt seine Karte einen sichtbaren Button „Jetzt teilnehmen“.

#### F-23 Teilnahme zurückziehen
- **User Story:** Als Teilnehmerin möchte ich meine Zusage zurückziehen, damit mein Platz frei wird, wenn etwas dazwischenkommt.
- **Quelle:** DR-4.2.1, SM-R12; FB-34, FB-16.
- **Priorität / Größe / Release 1:** Must / S / ja · **Status:** umgesetzt (AK1 E2E, AK2 Unit, AK3 Integration grün)
- **Akzeptanzkriterien:**
  - AK1: Gegeben `lea` nimmt an einem Treffen mit 5 von 5 teil. Wenn sie „Teilnahme zurückziehen“ bestätigt, dann zeigt es „1 von 5 Plätzen frei“ und es steht nicht mehr unter ihren „Meine Treffen“.
  - AK2: Gegeben jetzt ist nach Beginn des Treffens. Wenn sie zurückziehen will, dann ist das nicht möglich.
  - AK3: Gegeben `tom` nimmt am selben Treffen teil. Wenn `lea` zurückzieht, dann bleibt `tom` Teilnehmer.

#### F-24 Meine Treffen
- **User Story:** Als Nutzerin möchte ich unter „Meine Treffen“ sehen, was ich organisiere und wo ich zugesagt habe, damit ich den Überblick behalte.
- **Quelle:** DR-4.1.2; FB-57, FB-37.
- **Priorität / Größe / Release 1:** Must / S / ja · **Status:** umgesetzt (AK1–AK4 E2E grün)
- **Akzeptanzkriterien:**
  - AK1: Gegeben `lea` organisiert Treffen A und nimmt an B teil; C kennt sie nicht. Wenn sie „Meine Treffen“ öffnet, dann sieht sie A mit „Organisiert von dir“ und B mit „Angemeldet“, nicht C.
  - AK2: Gegeben B wurde abgesagt. Wenn sie „Meine Treffen“ öffnet, dann steht B mit „Abgesagt“ dort.
  - AK3: Gegeben `lea` hat keine Treffen. Wenn sie „Meine Treffen“ öffnet, dann erscheint „Noch keine Treffen“ mit Link zur Übersicht.
  - AK4 (ergänzt 23.11.2026, Test TC-A-59): Gegeben `lea` organisiert 2 Treffen und nimmt an keinem teil. Wenn sie einem Treffen beitritt und ihr Profil öffnet, dann zeigt es „1“ Treffen dabei und „2“ organisiert, und „Deine Treffen ansehen“ führt zu „Meine Treffen“.

#### F-25 Mindestteilnehmerzahl mit Status „Sucht Mitspieler“ / „Findet statt“
- **User Story:** Als Organisatorin möchte ich eine Mindestzahl festlegen, damit alle sehen, ob das Treffen stattfindet.
- **Quelle:** DR-3.2.1, DR-3.2.2 (Benachrichtigungsanteil in F-26/F-27); FB-06, FB-41.
- **Priorität / Größe / Release 1:** Should / S / nein · **Status:** umgesetzt (AK1 E2E, AK2/AK3 Unit grün (vorgezogen, nicht Release 1))
- **Akzeptanzkriterien:**
  - AK1: Gegeben Mindestzahl 4 und 3 Teilnehmende. Wenn die Details angezeigt werden, dann steht dort „Sucht Mitspieler (noch 1)“.
  - AK2: Gegeben dasselbe Treffen. Wenn eine vierte Person beitritt, dann steht dort „Findet statt“.
  - AK3: Gegeben Mindestzahl 9 bei Kapazität 8. Wenn veröffentlicht wird, dann erscheint „Mindestzahl darf die Plätze nicht übersteigen“.

### E-6 Hinweise
Ziel: Z2.2. Kanal ist Annahme (FB-20, FB-36: In-App reicht nicht immer).

#### F-26 In-App-Hinweis bei Änderung oder Absage
- **User Story:** Als Teilnehmer möchte ich in der App einen Hinweis bekommen, wenn sich Zeit oder Ort meines Treffens ändert oder es abgesagt wird, damit ich nicht umsonst losgehe.
- **Quelle:** SM-R14, DR-3.3.1, DR-3.3.2; FB-20, FB-36, FB-16.
- **Priorität / Größe / Release 1:** Should / M / nein · **Status:** offen
- **Akzeptanzkriterien:**
  - AK1: Gegeben `lea` nimmt an Treffen A teil. Wenn der Organisator den Beginn von 18:00 auf 19:00 ändert, dann zeigt ihr Glockensymbol 1 neuen Hinweis „Treffen A: Beginn jetzt 19:00 Uhr“ mit Link zu A.
  - AK2: Gegeben A wird abgesagt. Wenn `lea` die App öffnet, dann sieht sie „Treffen A wurde abgesagt“.
  - AK3: Gegeben `tom` ist nicht angemeldet. Wenn A geändert wird, dann erhält `tom` keinen Hinweis.
  - AK4: Gegeben ein gelesener Hinweis. Wenn die Seite neu geladen wird, dann bleibt er in der Liste, aber ohne Neu-Markierung.

#### F-27 Hinweis an Organisator bei Zu- und Absage
- **User Story:** Als Organisatorin möchte ich erfahren, wenn jemand zusagt oder absagt, damit ich weiß, ob mein Treffen angenommen wird.
- **Quelle:** DR-4.3.1 (60-Sekunden-Ziel offen), DR-4.2.1; FB-06, FB-55.
- **Priorität / Größe / Release 1:** Could / S / nein · **Status:** offen
- **Akzeptanzkriterien:**
  - AK1: Gegeben Treffen mit 3 von 8. Wenn `tom` beitritt, dann erhält die Organisatorin den In-App-Hinweis „Tom ist dabei – 4 von 8“.
  - AK2: Gegeben `tom` zieht zurück. Wenn das gespeichert ist, dann erhält sie „Tom hat abgesagt – 3 von 8“.

#### F-28 Hinweis, wenn Mindestzahl 2 Stunden vor Beginn fehlt
- **User Story:** Als Organisator möchte ich 2 Stunden vor Beginn erinnert werden, wenn die Mindestzahl fehlt, damit ich rechtzeitig absagen kann.
- **Quelle:** DR-3.2.3 (Zeitgrenze Teamfestlegung).
- **Priorität / Größe / Release 1:** Could / M / nein · **Status:** offen
- **Akzeptanzkriterien:**
  - AK1: Gegeben Beginn 18:00, Mindestzahl 4, 3 Teilnehmende. Wenn die Prüfung um 16:00 läuft, dann erhält der Organisator „Mindestzahl noch nicht erreicht (3 von 4)“.
  - AK2: Gegeben 4 Teilnehmende. Wenn die Prüfung um 16:00 läuft, dann wird kein Hinweis erzeugt.

#### F-29 E-Mail bei kurzfristiger Absage
- **User Story:** Als Teilnehmerin möchte ich bei einer Absage kurz vor Beginn eine E-Mail bekommen, damit ich es auch ohne geöffnete App erfahre.
- **Quelle:** FB-36, FB-20. Kanal E-Mail statt Push: Annahme (kein kostenloser Push-Dienst festgelegt, C-4).
- **Priorität / Größe / Release 1:** Could / M / nein · **Status:** offen
- **Akzeptanzkriterien:**
  - AK1: Gegeben Treffen mit Beginn in 3 Stunden und Teilnehmerin `lea@example.org`. Wenn der Organisator absagt, dann wird genau eine E-Mail „Abgesagt: <Titel>“ an `lea@example.org` versandt (Test mit E-Mail-Attrappe).
  - AK2: Gegeben Beginn in 3 Tagen. Wenn abgesagt wird, dann wird keine E-Mail versandt, nur der In-App-Hinweis aus F-26.

#### F-30 Nachricht an alle Teilnehmenden
- **User Story:** Als Organisator möchte ich allen Teilnehmenden eine Nachricht schicken, damit ich nicht über WhatsApp organisieren muss.
- **Quelle:** FB-56. **Won't (Version 1)**, weil FB-40 und FB-21 ausdrücklich keinen Chat wollen und WhatsApp behalten, und weil Nachrichten Moderation und zusätzliche Datenschutzregeln brauchen. Erneut prüfen nach dem Nutzertest (P6).
- **Priorität / Größe / Release 1:** Won't / M / nein · **Status:** offen
- **Akzeptanzkriterien:** werden erst bei Aufnahme formuliert.

### E-7 Einstieg und Betrieb

#### F-31 Startseite mit Erklärung und zwei Einstiegen
- **User Story:** Als neuer Besucher möchte ich auf einer Startseite kurz erfahren, was SportMate ist, damit ich nicht mitten in die Anwendung geworfen werde.
- **Quelle:** FB-58, H-2.
- **Priorität / Größe / Release 1:** Should / S / nein · **Status:** teilweise (als Erstbesuch-Hinweis auf Entdecken umgesetzt (E2E AK1/AK2 grün), keine eigene Startseite unter `/`)
- **Akzeptanzkriterien:**
  - AK1: Gegeben die Adresse `/`. Wenn sie geöffnet wird, dann zeigt sie eine Überschrift mit Erklärung, die drei Schritte „Sportart auswählen → Treffen finden → Gemeinsam Sport machen“ und die Buttons „Treffen entdecken“ und „Treffen erstellen“.
  - AK2: Gegeben die Startseite. Wenn „Treffen entdecken“ gewählt wird, dann öffnet sich die Treffenübersicht.
  - AK3: Gegeben eine nicht angemeldete Person. Wenn sie „Treffen erstellen“ wählt, dann erscheint die Anmeldung (F-02 AK4).

#### F-32 Lokaler Demo-Modus ohne Server
- **User Story:** Als Team möchte ich die App ohne Server mit gekennzeichneten Demodaten starten, damit Präsentationen und Tests unabhängig von Netz und Supabase funktionieren.
- **Quelle:** C-2, Z5, SM-R30; Präsentation 4 („Demodaten werden transparent gekennzeichnet“). Kein Nutzerfeedback.
- **Priorität / Größe / Release 1:** Must / M / ja · **Status:** umgesetzt (AK1 E2E, AK2–AK4 Unit grün; AK4 zusätzlich manuell (TC-M-01))
- **Akzeptanzkriterien:**
  - AK1: Gegeben keine Supabase-Konfiguration. Wenn die App gestartet wird, dann läuft sie im Demo-Modus und zeigt oben dauerhaft „Demo-Modus – Beispieldaten, Änderungen gehen beim Neuladen verloren“ (Text angepasst 23.11.2026 nach ADR-0010).
  - AK2: Gegeben der Demo-Modus. Wenn die Übersicht geladen wird, dann zeigt sie mindestens 6 Demotreffen mit allen Sportarten aus F-00, darunter mindestens ein ausgebuchtes und eines ohne Altersgruppe.
  - AK3: Gegeben der Demo-Modus. Wenn eine Demo-Person einem Treffen beitritt und die Seite neu lädt, dann ist der Ausgangszustand wiederhergestellt.
  - AK4: Gegeben Supabase-Konfiguration vorhanden. Wenn die App startet, dann erscheint kein Demo-Hinweis und Daten kommen aus Supabase.

### E-8 Sportstätten-Buchungspilot
Ziel: Z4 (optional). Hypothese H-3b offen. Grundlage: INT-03 (real laut Teamentscheidung) und SIM-05 (KI-Simulation, nur Annahme).
Kein realer Betreiber hat eine Kooperation zugesagt (FB-28), nur 1 von 4 Befragten nennt Platzsuche als Hauptproblem (FB-07).
Deshalb höchstens Could; die Betreiberseite ist Won't.

#### F-33 Hallenanfrage mit Status „Angefragt“
- **User Story:** Als Gruppenverantwortliche möchte ich eine Halle mit allen nötigen Angaben anfragen und sehen, dass sie noch nicht bestätigt ist, damit wir nicht vor einer belegten Halle stehen.
- **Quelle:** DR-5.1.1, DR-5.1.2, DR-5.2.1, SM-R16, NFR-7; FB-24, FB-25, FB-26, FB-39; Annahme (SIM-05).
- **Priorität / Größe / Release 1:** Could / L / nein · **Status:** offen
- **Akzeptanzkriterien:**
  - AK1: Gegeben Testhalle „Halle Demo (Testdaten)“. Wenn Datum 2026-12-05, 18:00–20:00, Volleyball, 10 Personen, verantwortlich `Lea`, Kontakt `lea@example.org` abgesendet werden, dann steht die Anfrage mit „Angefragt – noch keine verbindliche Buchung“ unter „Meine Anfragen“.
  - AK2: Gegeben Ende 17:00 vor Beginn 18:00. Wenn abgesendet wird, dann erscheint „Das Ende muss nach dem Beginn liegen“ und nichts wird gespeichert.
  - AK3: Gegeben eine gesendete Anfrage. Wenn ihr Inhalt für den Betreiber erzeugt wird, dann enthält er nur Name und Kontakt der verantwortlichen Person, keine Daten weiterer Teilnehmender (NFR-7).
  - AK4: Gegeben eine angezeigte freie Zeit. Wenn sie angezeigt wird, dann steht dabei „Verfügbarkeit nicht garantiert – der Betreiber bestätigt“.

#### F-34 Preis und Stornobedingungen vor dem Absenden
- **User Story:** Als Gruppenverantwortlicher möchte ich Preis und Stornobedingungen vor dem Absenden sehen, damit es später keine Überraschung gibt.
- **Quelle:** DR-5.4.1, DR-5.4.2, SM-R15; FB-27, FB-39.
- **Priorität / Größe / Release 1:** Could / S / nein · **Status:** offen
- **Akzeptanzkriterien:**
  - AK1: Gegeben Richtpreis 25 € pro Stunde für 2 Stunden. Wenn die Anfrage vorbereitet wird, dann steht vor dem Absenden „Richtpreis 50 € – endgültiger Preis laut Angebot des Betreibers“.
  - AK2: Gegeben Stornobedingungen sind hinterlegt. Wenn „Anfrage senden“ ohne bestätigtes Häkchen „Hallenregeln und Stornobedingungen gelesen“ gewählt wird, dann wird nicht gesendet.

#### F-35 Betreiber bestätigt oder lehnt ab, keine Doppelbestätigung
- **User Story:** Als Betreiber möchte ich Anfragen bestätigen oder ablehnen, damit nur von mir bestätigte Termine verbindlich sind.
- **Quelle:** DR-5.2.2, DR-5.3.1, SM-R17, SM-R18, SM-R19, SM-R20, SM-R29, NFR-6; FB-24, FB-28. **Won't (Version 1)**, weil kein realer Betreiber als Partner zugesagt hat, kein E-Mail-Versand mit sicheren Aktionslinks festgelegt ist und die Betreiberin keinen zweiten Kalender pflegen will.
- **Priorität / Größe / Release 1:** Won't / L / nein · **Status:** offen
- **Akzeptanzkriterien:** werden erst bei Aufnahme formuliert (Orientierung: NFR-6, SM-R18).

## 6. Qualitätsanforderungen und Randbedingungen

### 6.1 Qualitätsziele (Reihenfolge nach Bedeutung)

1. **Bedienbarkeit:** Die Feedbackrunde zeigt, dass schon kleine Unklarheiten (Teilnahme-Button, Altersangabe, Einstieg)
   den Ablauf stoppen (FB-44, FB-45, FB-58).
2. **Zuverlässigkeit:** Organisierende brauchen eine verlässliche Teilnehmerzahl (FB-18, FB-19); ein Treffen, das
   ausfällt oder überbucht ist, kostet Vertrauen (FB-41).
3. **Sicherheit und Datenschutz:** Nur Berechtigte ändern Treffen; Standort und persönliche Daten bleiben privat
   (FB-14, FB-38, DSGVO).
4. **Wartbarkeit:** Messung durch SE-Eval und Tests auf mehreren Ebenen.

### 6.2 Messbare Qualitätsanforderungen

| ID | Merkmal | Anforderung | Prüfung | Stand 23.11.2026 |
| --- | --- | --- | --- | --- |
| NFR-1 | Bedienbarkeit | Neue Nutzer finden ohne Hilfe in höchstens 2 Minuten ein passendes Treffen und treten bei. | Nutzertest, erfüllt bei mind. 4 von 5 Personen | offen (Nutzertest P6) |
| NFR-2 | Bedienbarkeit | Ein Treffen ist in höchstens 6 Eingabeschritten erstellt. | Klickpfad zählen | offen; Messdefinition „Eingabeschritt“ offen |
| NFR-3 | Kompatibilität | Alle Kernabläufe ab 360 px Breite ohne horizontales Scrollen bedienbar. | Playwright mit 360-px-Viewport | Akzeptanztests F-08 AK4 und F-17 AK5 vorhanden |
| NFR-4 | Performance | Karte mit bis zu 100 Treffen über 4G in höchstens 3 Sekunden geladen. | Lighthouse | offen, nicht gemessen |
| NFR-5 | Zuverlässigkeit | Ein Platz wird auch bei gleichzeitigem Beitritt nie doppelt vergeben. | Paralleltest mit 2 Clients gegen Supabase | durch Zeilensperre und Check-Constraint entworfen und im Review geprüft; automatischer Paralleltest fehlt |
| NFR-6 | Zuverlässigkeit | Eine Hallenzeit hat nie zweimal den Status „Bestätigt“. | nur bei Buchungspilot | Won't |
| NFR-7 | Datenschutz | An Betreiber gehen nur Name und Kontakt der verantwortlichen Person. | Inhalt der Anfrage prüfen | nur bei Buchungspilot |
| NFR-8 | Wartbarkeit | Jede Must-Story hat mindestens einen automatisierten Test. | CI-Bericht | Akzeptanztests für alle Release-1-Must-Stories vorhanden (`docs/testing/testfaelle.md`) |
| SM-R25 | Zugänglichkeit | Suchen, Details, Anmelden, Absagen per Tastatur mit sichtbarem Fokus. | Playwright-Tastaturtest | offen; Fokusfalle in Dialogen fehlt (REV-05) |
| SM-R22 | Datenschutz | Suchkoordinaten werden nur für die aktuelle Suche verarbeitet, nicht im Konto gespeichert. | Code-Review, Integrationstest | offen (Umkreissuche F-10 nicht umgesetzt) |

Quelle der Anforderungen: `docs/vision.md` (aus `P3/traceability.csv`, Werte sind Teamfestlegungen). Spalte „Stand“:
`docs/testing/testbericht.md`, `docs/testing/review-protokoll.md`.

### 6.3 Randbedingungen

- **C-1 Recht:** DSGVO – personenbezogene Daten nur mit Einwilligung und Löschmöglichkeit; Geburtsdatum nie öffentlich.
- **C-2 Technik:** Next.js mit TypeScript, Vitest, Playwright; Supabase (Auth E-Mail/Passwort, Postgres mit RLS);
  Hosting auf Vercel; zusätzlich lokaler Demo-Modus ohne Server.
- **C-3 Zeit:** Iterationen von zwei Wochen; feste Präsentationstermine (P5 „Qualität & Tests“ am 25.11.2026; P6/P7 laut Kursplan).
- **C-4 Ressourcen:** 4 Teammitglieder, kein Budget (Free-Tarife von Supabase und Vercel).
- **C-5 Prozess:** Tests zuerst, eine Story = ein Branch = ein Pull Request, Review durch eine zweite Person.
- **A-1 Annahme:** Nicht alle geben den Standort frei; die Suche muss ohne Standortfreigabe funktionieren (FB-14).

## 7. Priorisierung und bewusst nicht Gebautes

### 7.1 Regeln

Priorisiert wird nach MoSCoW. Abwägung laut Vision: **Umfang weicht vor Qualität** – lieber wenige Kernabläufe
(finden, Details, beitreten, erstellen) verlässlich und getestet als viele halbfertige Funktionen (FB-40: „dass die
grundlegenden Sachen gut funktionieren“). Bei Zeitnot wird zuerst Could, dann Should verschoben. Nur kostenfreie Dienste.

### 7.2 Übersicht mit Umsetzungsstand

Spalten aus `docs/backlog.md`. Release 1: 11 von 14 Stories umgesetzt, 3 teilweise (F-12, F-13, F-22); außerhalb von Release 1
vorgezogen: F-09, F-25 umgesetzt, F-14, F-15, F-20, F-31 teilweise.

| Epic | Story | Priorität | Release 1 | Status (Endlauf 23.11.2026) | Begründung / Tests |
| --- | --- | --- | --- | --- | --- |
| E-1 Konto und Anmeldung | F-01 Registrieren, anmelden, abmelden | Must | ja | umgesetzt | AK1–AK6 Akzeptanztests grün (Endlauf 23.11.2026) |
| E-1 | F-02 Ohne Konto stöbern, Anmeldung erst beim Mitmachen | Must | ja | umgesetzt | AK1–AK4 Akzeptanztests grün |
| E-1 | F-03 Profil mit Anzeigename, Sportarten, Niveau, Altersgruppe | Should | nein | offen | – |
| E-1 | F-04 Konto und eigene Daten löschen | Could | nein | offen | – |
| E-2 Treffen entdecken | F-05 Liste kommender Treffen | Must | ja | umgesetzt | AK1–AK3, AK5 E2E grün, AK4 Unit (TC-U-14) grün |
| E-2 | F-06 Filter Sportart und Zeitraum mit Leerzustand | Must | ja | umgesetzt | AK1, AK2, AK4, AK5 E2E grün, AK2/AK3 zusätzlich Unit/Komponente |
| E-2 | F-07 Filter Niveau und Altersgruppe | Must | ja | umgesetzt | AK1–AK3 E2E grün |
| E-2 | F-08 Karte mit denselben Treffen wie die Liste | Should | ja | umgesetzt | AK1–AK6 E2E grün, AK3/AK5/AK6 zusätzlich Unit |
| E-2 | F-09 Freitextsuche | Could | nein | umgesetzt | AK1–AK2 E2E grün (vorgezogen, nicht Release 1) |
| E-2 | F-10 Ortssuche und Umkreis ohne Standortfreigabe | Should | nein | offen | – |
| E-2 | F-11 Optional eigenen Gerätestandort verwenden | Could | nein | offen | – |
| E-3 Treffen-Details | F-12 Detailansicht mit Treffpunkt, Niveau, eindeutiger Altersangabe und freien Plätzen | Must | ja | teilweise | AK3–AK5 grün; AK1 und AK2 weichen im Wortlaut ab (siehe Hinweis) |
| E-3 | F-13 Kosten, Mitbringen und „Was erwartet dich?“ | Must | ja | teilweise | AK1, AK3 grün; AK2 ohne Kostenhinweis „(Hallenmiete)“ geprüft, AK4 (reiner Text, `<b>` wörtlich) ohne Test |
| E-3 | F-14 Organisator im Treffen erkennen | Should | nein | teilweise | AK2 grün; AK1 nur „Organisiert von …“, ohne Anzahl organisierter Treffen |
| E-3 | F-15 Link zu einem Treffen teilen | Should | nein | teilweise | nur AK3 (unbekannter Link) umgesetzt und grün; „Link kopieren“ fehlt |
| E-3 | F-16 Route zum Treffpunkt in Karten-App öffnen | Could | nein | offen | – |
| E-4 Treffen organisieren | F-17 Treffen erstellen | Must | ja | umgesetzt | AK1–AK5 grün, Höchstdauer 12 h (BUG-04) ergänzt |
| E-4 | F-18 Eigenes Treffen absagen | Must | ja | umgesetzt | AK1 E2E, AK2 Unit/Integration, AK3 Supabase-Integration (echte DB, 285/285) grün |
| E-4 | F-19 Eigenes Treffen bearbeiten | Should | nein | offen | – |
| E-4 | F-20 Teilnehmerliste sehen | Should | nein | teilweise | AK1/AK2 Unit und Supabase-Integration grün; AK3 ohne eigenen Test |
| E-4 | F-21 Teilnehmende aus eigenem Treffen entfernen | Could | nein | offen | – |
| E-5 Teilnahme | F-22 Einem Treffen beitreten („Jetzt teilnehmen“) | Must | ja | teilweise | AK1–AK3, AK5 grün; AK4 nur sequenziell (EVENT_FULL) geprüft, kein Paralleltest |
| E-5 | F-23 Teilnahme zurückziehen | Must | ja | umgesetzt | AK1 E2E, AK2 Unit, AK3 Integration grün |
| E-5 | F-24 Meine Treffen | Must | ja | umgesetzt | AK1–AK4 E2E grün |
| E-5 | F-25 Mindestteilnehmerzahl mit Status „Sucht Mitspieler“ / „Findet statt“ | Should | nein | umgesetzt | AK1 E2E, AK2/AK3 Unit grün (vorgezogen, nicht Release 1) |
| E-6 Hinweise | F-26 In-App-Hinweis bei Änderung oder Absage | Should | nein | offen | – |
| E-6 | F-27 Hinweis an Organisator bei Zu- und Absage | Could | nein | offen | – |
| E-6 | F-28 Hinweis, wenn Mindestzahl 2 Stunden vor Beginn fehlt | Could | nein | offen | – |
| E-6 | F-29 E-Mail bei kurzfristiger Absage | Could | nein | offen | – |
| E-6 | F-30 Nachricht an alle Teilnehmenden | Won't | nein | offen | – |
| E-7 Einstieg und Betrieb | F-31 Startseite mit Erklärung und zwei Einstiegen | Should | nein | teilweise | als Erstbesuch-Hinweis auf Entdecken umgesetzt (E2E AK1/AK2 grün), keine eigene Startseite unter `/` |
| E-7 | F-32 Lokaler Demo-Modus ohne Server | Must | ja | umgesetzt | AK1 E2E, AK2–AK4 Unit grün; AK4 zusätzlich manuell (TC-M-01) |
| E-8 Sportstätten-Buchungspilot | F-33 Hallenanfrage mit Status „Angefragt“ | Could | nein | offen | – |
| E-8 | F-34 Preis und Stornobedingungen vor dem Absenden | Could | nein | offen | – |
| E-8 | F-35 Betreiber bestätigt oder lehnt ab, keine Doppelbestätigung | Won't | nein | offen | – |

### 7.3 Nicht-Ziele (bewusst nicht gebaut)

| Was | Begründung | Quelle |
| --- | --- | --- |
| Bezahlung, Kostenaufteilung, direkte Hallenbuchung | bestehende Lösung per PayPal genügt, kein Bedarf genannt | FB-08, Präsentation 1/2 |
| Verbindliche Hallenreservierung, Kalenderintegration | Betreiberin: „Anfrage ist keine Zusage“, kein zweiter Kalender | FB-24, FB-25, FB-28 |
| Chat, Gruppennachrichten, Social Feed | WhatsApp bleibt; Grundfunktionen wichtiger; Gegenwunsch FB-56 bewusst zurückgestellt | FB-40, FB-17, FB-21 |
| Bewertungen von Personen | 0 von 4 Nennungen in der Umfrage | FB-03 |
| Private Treffen, Warteliste in Version 1 | laut Organisator für den Prototyp nicht nötig | FB-22, FB-18 |
| Native App | mobile Web-App genügt | `docs/vision.md` |

## 8. Nachvollziehbarkeit Feedback → Story

Jede Feedback-Aussage hat eine vorgeschlagene Konsequenz und die betroffenen Stories (`docs/feedback.md`, Register).
Eine automatisch erzeugte Datei `docs/traceability.md` (Kriterium → Test, `make trace`) liegt im Repository nicht vor;
die Zuordnung Kriterium → Test steht im Testfallkatalog `docs/testing/testfaelle.md`.

| ID | Konsequenz (Vorschlag, Freigabe offen) | Stories | Umsetzung (Stand 23.11.2026) |
| --- | --- | --- | --- |
| FB-01 | Kernumfang Finden, Erstellen, Beitreten bleibt Must; stützt H-1 | F-05, F-17, F-22 | umgesetzt (F-05, F-17); teilweise (F-22) |
| FB-02 | keine Änderung, stützt H-1 | – | – |
| FB-03 | Details und Filter für Alter/Niveau/Plätze/Ort; Bewertungen verworfen, weil 0 von 4 Nennungen | F-07, F-12 | umgesetzt (F-07); teilweise (F-12) |
| FB-04 | Umkreis 2/5/10/20 km, Standard 5 km | F-10 | offen |
| FB-05 | Treffen erstellen Must; stützt H-3a | F-17 | umgesetzt (F-17) |
| FB-06 | Mindestteilnehmerzahl mit Status und Hinweis an Organisator | F-25, F-27 | umgesetzt (F-25); offen (F-27) |
| FB-07 | Buchung ist Nebenproblem (1/4): Buchungspilot nur Could | F-33 | offen |
| FB-08 | verworfen: Bezahlung/Kostenaufteilung in der App, weil bestehende Lösung genügt und kein Bedarf genannt wurde | – | – |
| FB-09 | keine Änderung, kein Vorbild für Wettbewerb ableitbar | – | – |
| FB-10 | stützt Fokus auf Beitreten mit Fremden; H-5 | F-22 | teilweise (F-22) |
| FB-11 | keine Story; Nutzertest für H-2/NFR-1 muss anders rekrutiert werden (offen) | – | – |
| FB-12 | Niveau Pflichtangabe und sichtbar; Hinweis „Anfänger willkommen“ | F-12, F-13, F-17 | umgesetzt (F-17); teilweise (F-12, F-13) |
| FB-13 | Treffpunkttext Pflichtfeld und in Details | F-12, F-17 | umgesetzt (F-17 AK2 Pflichtfeld, F-12 AK1 Treffpunkt in Details) |
| FB-14 | Ortssuche ohne Standort; Standort nur optional und nicht gespeichert (SM-R22) | F-10, F-11 | offen |
| FB-15 | Detailansicht mit allen Angaben | F-12, F-13, F-14 | teilweise (F-12, F-13, F-14) |
| FB-16 | Zurückziehen Must; Hinweis bei Änderung | F-23, F-26 | umgesetzt (F-23); offen (F-26) |
| FB-17 | Social Feed verworfen (Nicht-Ziel); Buchung Could | F-33 | offen |
| FB-18 | Kapazität, Ausgebucht-Zustand, Teilnehmerliste; Warteliste verworfen für Version 1, weil laut Aussage nicht nötig | F-17, F-20, F-22 | umgesetzt (F-17); teilweise (F-20, F-22) |
| FB-19 | atomarer Beitritt (NFR-5); Kapazitätsregel beim Bearbeiten | F-22, F-19 | teilweise (F-22); offen (F-19) |
| FB-20 | In-App-Hinweis; Benachrichtigung außerhalb der App als Could | F-26, F-29 | offen |
| FB-21 | Link teilen; Leerzustand mit „Treffen erstellen“; kein Chat | F-15, F-06 | umgesetzt (F-06); teilweise (F-15) |
| FB-22 | Felder beim Erstellen; private Treffen verworfen für Version 1 | F-17, F-13 | umgesetzt (F-17); teilweise (F-13) |
| FB-23 | keine eigene Story; Beitritt mit einem Klick (F-22) und Test mit echter Gruppe offen | F-22 | teilweise (F-22) |
| FB-24 | Status „Angefragt – noch keine verbindliche Buchung“ | F-33, F-35 | offen |
| FB-25 | keine Verfügbarkeitsgarantie; Kalenderintegration verworfen (kein Partner) | F-33, F-35 | offen |
| FB-26 | Pflichtangaben der Anfrage; NFR-7 | F-33 | offen |
| FB-27 | Konditionen vor Absenden | F-34 | offen |
| FB-28 | H-3b nicht bestätigt; Buchungspilot bleibt Could/Won't | F-33, F-34, F-35 | offen |
| FB-29 | stützt H-1 und Wertversprechen | F-05, F-22 | umgesetzt (F-05); teilweise (F-22) |
| FB-30 | Niveau inkl. „Alle Niveaus“; Hinweis „Neue willkommen“ | F-12, F-13 | teilweise (F-12, F-13) |
| FB-31 | Detailansicht inkl. Kosten und Mitbringen | F-12, F-13 | teilweise (F-12, F-13) |
| FB-32 | Filter Sportart und Zeitraum Must, Ort Should | F-06, F-10 | umgesetzt (F-06); offen (F-10) |
| FB-33 | Liste Must, Karte Should | F-05, F-08 | umgesetzt (F-05, F-08) |
| FB-34 | Beitreten mit Bestätigung, Zurückziehen | F-22, F-23 | umgesetzt (F-23); teilweise (F-22) |
| FB-35 | Stöbern ohne Konto; Profil optional und nachrangig | F-02, F-03 | umgesetzt (F-02); offen (F-03) |
| FB-36 | In-App-Hinweis Should; E-Mail/Push Could | F-26, F-29 | offen |
| FB-37 | Erstellen, Teilnehmerliste, Meine Treffen; stützt H-3a | F-17, F-20, F-24 | umgesetzt (F-17, F-24); teilweise (F-20) |
| FB-38 | Teilnehmerliste nur mit Anzeigenamen; Organisator sichtbar | F-14, F-20, F-03 | teilweise (F-14, F-20); offen (F-03) |
| FB-39 | Buchungspilot Could, Konditionen vor Absenden | F-33, F-34 | offen |
| FB-40 | Chat/Nachrichten Won't; Vorrang Kernabläufe | F-30 | offen |
| FB-41 | H-5 (offen); Mindestzahl-Status zeigt Ausfallrisiko | F-25 | umgesetzt (F-25) |
| FB-42 | Szenario für Nutzertest NFR-1/H-2 und E2E-Test | F-22, F-23 | umgesetzt (F-23); teilweise (F-22) |
| FB-43 | bestätigt Filter | F-06 | umgesetzt (F-06) |
| FB-44 | Teilnahme-Button auf Karte und in Details; Gegenhinweis zu H-2 | F-22 | umgesetzt (F-22 AK5 Button auf der Karte, F-12/F-22 in Details) |
| FB-45 | Altersangabe eindeutig beschriften | F-12 | umgesetzt (F-12 AK2/AK3: „Alter: 20–25 Jahre“ / „Alter: offen für alle“, `18af5af`) |
| FB-46 | Platzanzeige in Liste und Details | F-05, F-12 | umgesetzt (F-05 AK2 Liste, F-12 AK1/AK4 Details) |
| FB-47 | Sortierung „Ausgebuchte zuletzt“ | F-05 | umgesetzt (F-05) |
| FB-48 | Karte bleibt (Should, Release 1) | F-08 | umgesetzt (F-08) |
| FB-49 | Kosten, Mitbringen, Teilnahmevoraussetzung in Details | F-13 | teilweise (F-13) |
| FB-50 | Niveau bei jedem Treffen Pflicht und sichtbar | F-12, F-17 | umgesetzt (F-17); teilweise (F-12) |
| FB-51 | Organisator in Details | F-14 | teilweise (F-14) |
| FB-52 | Beschreibung und Treffpunkttext | F-12, F-13 | teilweise (F-12, F-13) |
| FB-53 | stützt H-3a | F-17 | umgesetzt (F-17) |
| FB-54 | Button sichtbar gestalten (AK in F-17) | F-17 | umgesetzt (F-17) |
| FB-55 | Kapazität; Entfernen (Could); Hinweis bei Absage (Could) | F-17, F-21, F-27 | umgesetzt (F-17); offen (F-21, F-27) |
| FB-56 | Teilnehmerliste Should; Nachricht an alle verworfen für Version 1 (Won't), weil andere Befragte WhatsApp behalten wollen und Chat Moderation/Datenschutz erfordert | F-20, F-30 | teilweise (F-20); offen (F-30) |
| FB-57 | Meine Treffen, Bearbeiten | F-24, F-19 | umgesetzt (F-24); offen (F-19) |
| FB-58 | Startseite; Gegenhinweis zu H-2 | F-31 | teilweise (F-31) |

## 9. Änderungen an den Anforderungen über die Laufzeit

| Zeitpunkt | Änderung | Auslöser | Quelle |
| --- | --- | --- | --- |
| P1, 30.09.2026 | Erste Version: Profil, Karte mit Sportart- und Zeitfilter, Events erstellen, zu- und absagen; Buchungsanfrage mit Testpartner; später direkte Buchung, Bezahlung, Social Feed | Produktidee | Präsentation 1, Folie 3 |
| P2, 14.10.2026 | Kern Finden/Erstellen/Beitreten bleibt Must; Profil und Filter für Alter und Niveau; Mindestteilnehmerzahl; Bewertungen nicht in Version 1 | Umfrage (FB-01 – FB-11) | Präsentation 2, Folie 7 (laut `docs/feedback.md`) |
| P2/P3 | Niveau als Pflichtangabe und Treffpunkttext, manuelle Ortswahl, Kapazität und atomarer letzter Platz, Absage und In-App-Hinweise, Eventlink als Should, Buchung nur als optionaler Pilot mit Zustand „angefragt“ | Interviews (FB-12 – FB-28) | `Interviews/04_Interviewauswertung_und_Einfluss.md`, D01–D09 (laut `docs/feedback.md`) |
| P3, 27.10.2026 | 81 Altanforderungen (43 DR, 8 NFR, 30 SM-R) mit 13 Konflikten F01–F13; Kapazität 2–50 statt 2–100 (F01); begonnene Treffen verschwinden ab Beginn (F03) | Architekturarbeit P3 | `docs/requirements/traceability.md` |
| bis 27.10.2026 (P4) | Button „Jetzt teilnehmen“, eindeutige Altersangabe, „x von y Plätzen frei“, Ausgebuchte zuletzt, Startseite | Feedbackrunde MVP (FB-43 – FB-58) | `project/docs/architecture/FEEDBACK-01.md`, `LANDINGPAGE.md` (laut `docs/feedback.md`) |
| 23.11.2026 | Neues Backlog mit 35 Stories: F-13 neu (Kosten, Mitbringen, „Was erwartet dich?“), F-31 Startseite, F-30 Nachricht an alle als Won't, Buchungspilot höchstens Could; Profil Should statt Must (FB-35) | Feedbackrunde MVP, Interviews | `docs/backlog.md`, `docs/requirements/traceability.md` |
| 23.11.2026 | Karte als Startbildschirm (Vektorkarte statt Rasterkarte) | Kritik am Prototyp, `docs/design.md` | ADR-0004, ADR-0005 |

## 10. Lücken

Siehe auch `abgabe/LUECKEN.md`.

| Bewertungskriterium | Was fehlt | Was das Team nachliefern muss |
| --- | --- | --- |
| Belege für Erhebung | genaue Gesprächsdaten der Interviews INT-01 – INT-04 und der Feedbackrunde; Widerspruch zwischen Originalvermerk „KI-Simulation“ und Teamentscheidung | Gesprächsdaten, Form (persönlich/online) und Bestätigung je Interview; Erklärung zum Vermerk |
| Belege für Validierung | Nutzertest (NFR-1, H-2) nicht durchgeführt; alle Feedback-Konsequenzen nur „Vorschlag“ | Nutzertest P6 durchführen und dokumentieren; Konsequenzen entscheiden |
| Detailgrad | Specs nur für F-01 und F-22; übrige Stories nur im Backlog ohne Szenario | Specs für alle Release-1-Stories oder Hinweis, dass das Backlog als Spec dient |
| Freigaben | Vision, Backlog, Specs „Freigabe offen“ | Freigaben mit Datum und Name eintragen |
| Konsistenz | erledigt: Backlog-Status nach Endlauf gesetzt. Offen: F-12 AK1/AK2 Wortlaut weicht von der Umsetzung ab (Termin ohne Jahr, Alter ohne „Wunsch des Organisators“) | Team entscheidet: AK anpassen oder Umsetzung nachziehen |
| Offene Entscheidungen | Passwortlänge 8 oder 12 (F04), Messdefinition NFR-2 | Teamentscheidung |

<div class="pagebreak"></div>

## Anhang A: Altanforderungen → Stories

Vollständig aus `docs/requirements/traceability.md` (Quelle der Altanforderungen: `P3/traceability.csv`, Stand 27.10.2026).

### Detaillierte funktionale Anforderungen (DR)

| ID | Anforderung (Kurzname) | Story | Entscheidung |
| --- | --- | --- | --- |
| DR-1.1.1 | Konto mit E-Mail/Passwort | F-01 | übernommen |
| DR-1.1.2 | Passwort mindestens 8 Zeichen | F-01 | übernommen; Konflikt F04 (8 vs. 12 Zeichen) offen, bis Teamentscheidung gilt 8 |
| DR-1.1.3 | Bereits registrierte E-Mail ablehnen | F-01 | übernommen; Wortlaut prüfen (P3 empfiehlt allgemeine Fehlermeldung, F04) |
| DR-1.1.4 | Anmeldung vor schreibender Aktion | F-02 | übernommen, mit Rücksprung zum Treffen |
| DR-1.2.1 | Eine oder mehrere Profilsportarten | F-03 | übernommen (Should statt Must, FB-35: kein Pflichtprofil vorab) |
| DR-1.2.2 | Niveau je Profilsportart | F-03 | übernommen |
| DR-1.2.3 | Nur Altersgruppe öffentlich | F-03 | übernommen |
| DR-2.1.1 | Karte am freigegebenen Standort zentrieren | F-11 | übernommen als Could (FB-14: Standort nur optional) |
| DR-2.1.2 | Ortsname statt GPS möglich | F-10 | übernommen (Ort/Stadtteil statt Standort) |
| DR-2.1.3 | Zukünftige Treffen im Umkreis als Sportsymbole | F-05, F-08 | übernommen; Liste Must, Karte Should (FB-33 vs. FB-48) |
| DR-2.1.4 | Treffen ab Endzeit von Karte entfernen | F-05 | geändert: begonnene Treffen verschwinden schon ab Beginn (P3-Regel F03) |
| DR-2.2.1 | Mehrere Sportarten mit ODER filtern | F-06 | übernommen |
| DR-2.2.2 | Heute/Morgen/Woche/freies Datum | F-06 | übernommen |
| DR-2.2.3 | Keine Treffer und Erstelllink | F-06 | übernommen (AK4) |
| DR-2.3.1 | Niveaufilter einschließlich Alle Niveaus | F-07 | übernommen |
| DR-2.3.2 | Altersgruppenfilter einschließlich ohne Angabe | F-07 | übernommen |
| DR-2.4.1 | Radius 2/5/10/20 km, Standard 5 | F-10 | übernommen (Should), gestützt durch FB-04 |
| DR-2.5.1 | Vollständige Treffendetails | F-12 | übernommen und erweitert (Altersangabe eindeutig FB-45, Plätze frei FB-46) |
| DR-2.5.2 | Navigation in externer Karten-App | F-16 | übernommen als Could |
| DR-3.1.1 | Treffen anlegen, Kapazität 2–50 | F-17 | übernommen, Kapazität 2–50 (F01) |
| DR-3.1.2 | Optionale Altersgruppe/Niveau/Beschreibung ≤300 | F-17, F-13 | übernommen; Beschreibung als „Was erwartet dich?“ |
| DR-3.1.3 | Fehlende Pflichtfelder verhindern Veröffentlichung | F-17 | übernommen |
| DR-3.1.4 | Vergangener Beginn abgewiesen | F-17 | übernommen |
| DR-3.1.5 | Ersteller automatisch erste Teilnahme | F-17 | übernommen |
| DR-3.2.1 | Sucht Mitspieler unter Mindestzahl | F-25 | übernommen (Should) |
| DR-3.2.2 | Findet statt ab Mindestzahl und Hinweis | F-25, F-26 | Status in F-25; Benachrichtigung über In-App-Hinweise |
| DR-3.2.3 | Hinweis 2 Stunden vor Beginn bei Unterbelegung | F-28 | übernommen als Could |
| DR-3.3.1 | Zeit-/Ortänderung informiert alle Teilnehmenden | F-19, F-26 | Bearbeiten Should, Hinweis Should |
| DR-3.3.2 | Absage entfernt Treffen und informiert Teilnehmer | F-18, F-26 | Absage Must, Hinweis Should |
| DR-4.1.1 | Beitreten bei freier Kapazität | F-22 | übernommen |
| DR-4.1.2 | Zahl erhöhen und Meine Treffen anzeigen | F-22, F-24 | übernommen |
| DR-4.1.3 | Ausgebucht verhindert Beitritt | F-22 | übernommen |
| DR-4.1.4 | Keine Mehrfachteilnahme | F-22 | übernommen |
| DR-4.2.1 | Absage gibt Platz frei und informiert Ersteller | F-23, F-27 | Zurückziehen Must; Organisator-Hinweis Could |
| DR-4.3.1 | Organisator binnen 60s über Beitritt informieren | F-27 | übernommen als Could; 60-Sekunden-Ziel offen |
| DR-5.1.1 | Nur vollständige Hallenanfrage absenden | F-33 | Could (Buchungspilot) |
| DR-5.1.2 | Anfrage-Ende nach Beginn | F-33 | Could |
| DR-5.1.3 | Betreiber erhält Anfrage-E-Mail | – | bewusst offen: E-Mail an Betreiber erst mit realem Partner und E-Mail-Dienst (F-35 Won't) |
| DR-5.2.1 | Angefragt ist keine verbindliche Buchung | F-33 | Could |
| DR-5.2.2 | Nur Betreiber bestätigt | F-35 | Won't: kein realer Betreiber (FB-28) |
| DR-5.3.1 | Bestätigen/Ablehnen per E-Mail-Link ohne Konto | F-35 | Won't: keine sicheren Aktionslinks/E-Mail-Dienst |
| DR-5.4.1 | Richtpreis mit Angebotsvorbehalt | F-34 | Could |
| DR-5.4.2 | Hallen-/Stornoregeln vor Absenden bestätigen | F-34 | Could |

### Qualitätsanforderungen (NFR)

| ID | Anforderung (Kurzname) | Story | Entscheidung |
| --- | --- | --- | --- |
| NFR-1 | Neue Nutzer müssen ohne Hilfe in höchstens 2 Minuten ein passendes Treffen finden und beitreten können. | F-05, F-12, F-22, F-31 | Qualitätsziel; Prüfung im Nutzertest P6 (offen) |
| NFR-2 | Das Erstellen eines Treffens muss in höchstens 6 Eingabeschritten möglich sein. | F-17 | Qualitätsziel; Messdefinition „Eingabeschritt“ offen |
| NFR-3 | Alle Kernabläufe müssen ab 360 px Bildschirmbreite ohne horizontales Scrollen bedienbar sein. | alle Stories mit Oberfläche (AK in F-08, F-17) | Definition of Done: Playwright 360 px |
| NFR-4 | Die Karte mit bis zu 100 Treffen muss über 4G in höchstens 3 Sekunden geladen sein. | F-08 | Qualitätsziel, Messung offen |
| NFR-5 | Ein Platz in einem Treffen darf auch bei gleichzeitigem Beitritt nie doppelt vergeben werden. | F-22 (AK4) | übernommen, Integrationstest gegen Supabase |
| NFR-6 | Eine Hallenzeit darf nie zweimal den Status Bestätigt haben. | F-35 | Won't mit Buchungspilot |
| NFR-7 | An Betreiber dürfen nur Name und Kontakt der verantwortlichen Person gehen, keine Daten weiterer Teilnehmender. | F-33 (AK3) | nur bei Buchungspilot |
| NFR-8 | Jede Must-Story muss durch mindestens einen automatisierten Test (Vitest oder Playwright) abgedeckt sein. | alle Must-Stories | Definition of Done |

### Ergänzende Systemanforderungen (SM-R)

| ID | Anforderung (Kurzname) | Story | Entscheidung |
| --- | --- | --- | --- |
| SM-R01 | Konto und Anmeldung | F-01, F-02 | übernommen |
| SM-R02 | Öffentliches Kurzprofil | F-03 | übernommen; Feldumfang öffentlich (F07) offen |
| SM-R03 | Events auf Karte und Liste | F-05, F-08 | übernommen |
| SM-R04 | Sportart und Zeitraum filtern | F-06, F-10 | übernommen |
| SM-R05 | Eventdetails und Spielniveau | F-12, F-14 | übernommen; Niveau zusätzlich „Erfahren“ wie DR/F-00 |
| SM-R06 | Suche ohne Standortfreigabe | F-10 | übernommen |
| SM-R07 | Event veröffentlichen | F-17 | übernommen mit Kapazität 2–50 statt 2–100 (F01) |
| SM-R08 | Event bearbeiten | F-19 | übernommen |
| SM-R09 | Event absagen | F-18 | übernommen |
| SM-R10 | Event beitreten | F-22 | übernommen |
| SM-R11 | Kapazität bei Parallelzugriff | F-22 | übernommen (NFR-5) |
| SM-R12 | Teilnahme absagen | F-23 | übernommen |
| SM-R13 | Teilnehmerliste | F-20 | übernommen (Should) |
| SM-R14 | Änderungshinweise | F-26 | übernommen (Should) |
| SM-R15 | Sportstätten und Konditionen | F-34 | Could |
| SM-R16 | Buchungsanfrage senden | F-33 | Could |
| SM-R17 | Betreiberentscheidung | F-35 | Won't |
| SM-R18 | Buchungskonflikte | F-35 | Won't |
| SM-R19 | Anfrage zurückziehen | F-35 | Won't: Rücknahme erst mit Betreiberablauf sinnvoll |
| SM-R20 | Event mit Buchung verknüpfen | F-35 | Won't: Verknüpfung Treffen–Buchung erst mit bestätigten Buchungen |
| SM-R21 | Serverseitige Berechtigungen | F-18, F-19, F-02 | als AK (RLS) in den betroffenen Stories, keine eigene Story |
| SM-R22 | Standortdatensparsamkeit | F-10, F-11 | übernommen (AK4 bzw. AK3) |
| SM-R23 | Eingaben und sichere Ausgabe | F-17, F-13 | als AK (serverseitige Prüfung, Ausgabe als Text) |
| SM-R24 | Antwortzeit der Suche | – | bewusst offen: Such-API-Lastmessung (p95) nicht im Semesterumfang; NFR-4 bleibt Messziel |
| SM-R25 | Tastaturbedienung und Mobilansicht | alle Stories mit Oberfläche | Definition of Done: Tastatur und 360 px (Vision, Qualitätsziele) |
| SM-R26 | Fehler und Wiederholung | – | bewusst offen als Querschnitt: Fehlermeldung/Wiederholung je Story im Zustand „Fehler“ der Spec; keine eigene Story |
| SM-R27 | Eventlink teilen | F-15, F-02 | Link teilen Should; Rücksprung nach Anmeldung in F-02 |
| SM-R28 | Keine Treffer | F-06 | übernommen (AK4) |
| SM-R29 | Bestätigte Buchung stornieren | F-35 | Won't |
| SM-R30 | Reproduzierbarer Start | F-32 | Startanleitung und Demodaten; Abgabe-Anleitung beim reporter |

### Stories ohne Altanforderung

| Story | Herkunft |
| --- | --- |
| F-04 Konto löschen | C-1 DSGVO (Randbedingung, keine DR) |
| F-09 Freitextsuche | Annahme des Teams, nicht validiert |
| F-13 Kosten, Mitbringen, „Was erwartet dich?“ | neu aus Feedback FB-49, FB-31, FB-15, FB-52 (teilweise DR-3.1.2) |
| F-21 Teilnehmende entfernen | neu aus FB-55 |
| F-29 E-Mail bei kurzfristiger Absage | neu aus FB-36, FB-20 |
| F-30 Nachricht an alle (Won't) | neu aus FB-56 |
| F-31 Startseite | neu aus FB-58 |
| F-32 Demo-Modus | Randbedingung C-2, Ziel Z5 |

### Zusammenfassung

- 81 Altanforderungen, alle zugeordnet. Bewusst offen ohne Story: DR-5.1.3, SM-R24, SM-R26 (Querschnitt).
- Won't (Buchungspilot Betreiberseite, F-35): DR-5.2.2, DR-5.3.1, NFR-6, SM-R17–R20, SM-R29.
- Querschnitt über Definition of Done statt eigener Story: NFR-3, NFR-8, SM-R25; RLS (SM-R21) und Eingabeprüfung (SM-R23) als AK in den Stories.

