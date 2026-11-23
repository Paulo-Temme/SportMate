# Vision

Quelle aller Epics. Inhalt aus den Projektunterlagen (Präsentation 1–4, `SportMate – Anforderungen.docx`,
`P3/traceability.csv`), den Interviews, der Umfrage und der Feedbackrunde zum MVP. Nichts davon ist neu erfunden;
Lücken stehen als „offen“ da.
Status: Entwurf vom 2026-11-23 (analyst/planner) · freigegeben am <Datum> von <Name>

## Problem
Wer spontan Sport machen will, findet oft keine passende Gruppe. Ort und Termin brauchen zusätzliche Abstimmung
(Präsentation 1, Folie 2). Die Umfrage bestätigt das für die Zielgruppe: 3 von 4 Befragten finden „oft niemanden“,
alle 4 bewerten das spontane Finden von Mitspielern mit 4 oder 5 von 5 (schwer), bei allen 4 ist in den letzten
drei Monaten mindestens einmal Sport ausgefallen, weil Mitspieler oder ein Platz fehlten (FB-01, FB-02).
Heute laufen Absprachen über Freunde und WhatsApp-Gruppen; große Gruppen werden unübersichtlich, Fremde lernt man
so kaum kennen (FB-29).

## Zielgruppe
- Zuerst Studierende und Freizeitsportler in Flensburg (Präsentation 1). Umfrage: 4 von 4 studieren in Flensburg,
  3 von 4 sind 20–25 Jahre alt.
- Personen, die selbst kleine Treffen organisieren (Teilrolle der Sportinteressierten).
- Als möglicher Partner: lokale Betreiber von Hallen und Plätzen (nur Pilot, siehe Nicht-Ziele und H-3b).

## Wertversprechen
SportMate zeigt offene Sporttreffen in Flensburg mit allen Angaben, die man vor dem Mitmachen mit Fremden braucht
(Niveau, Alter, Kosten, Mitbringen, Treffpunkt, Organisator, freie Plätze), und man tritt mit einem Klick bei.
Wer Mitspieler sucht, stellt ein Treffen in wenigen Schritten ein und sieht automatisch, wer kommt.

## Hypothesen
Herkunft: drei Hypothesen aus Präsentation 1, Folie 4 (Bedarf, Bedienbarkeit, Lokales Angebot), ergänzt um zwei
Annahmen, die erst im Feedback sichtbar wurden. Status: offen · bestätigt · widerlegt, jeweils mit Feedback-ID.

| ID | Annahme | Wie prüfen wir sie | Status | Beleg |
| --- | --- | --- | --- | --- |
| H-1 | Bedarf: Sportinteressierte in Flensburg haben Schwierigkeiten, passende Mitspieler oder Treffen zu finden. | Umfrage und Interviews nach vergangenem Verhalten | bestätigt (vorläufig, n = 4 Umfrage + Interviews) | FB-01, FB-02, FB-29, FB-12 |
| H-2 | Bedienbarkeit: Neue Personen finden ohne Hilfe in höchstens 2 Minuten ein passendes Treffen und treten bei (NFR-1). | Nutzertest mit 5 Personen, Ziel mindestens 4 von 5 | offen; Gegenhinweise zur MVP-Version: Teilnahme-Weg und Zweck der Seite waren unklar | FB-44, FB-58, FB-54, FB-11 (keine Testfreiwilligen) |
| H-3a | Lokales Angebot (Organisatoren): Personen würden selbst ein Treffen einstellen, wenn Mitspieler fehlen. | Umfrage; Interviews; später Pilot-Treffen | bestätigt als Absicht (3 von 4 „Ja“, 1 „Vielleicht“); tatsächliches Verhalten offen | FB-05, FB-37, FB-53, FB-21 |
| H-3b | Lokales Angebot (Betreiber): Betreiber sind offen für einen Buchungstest über SportMate. | Gespräch mit realem Betreiber | offen; Betreiberin will keine doppelte Datenpflege und gibt keine Kooperationszusage. SIM-05 ist KI-Simulation und zählt nicht | FB-24, FB-25, FB-28 |
| H-4 | Vertrauen: Klare Angaben zu Niveau, Kosten, Mitbringen, Treffpunkt und Organisator senken die Hemmschwelle, mit Fremden Sport zu machen. | Interviews, Feedbackrunde, Nutzertest | bestätigt durch mehrere unabhängige Aussagen | FB-03, FB-12, FB-15, FB-31, FB-49, FB-51 |
| H-5 | Kritische Masse: Personen bleiben nur, wenn sie regelmäßig passende Treffen finden und diese nicht ausfallen. | Nutzung nach Pilot beobachten | offen (im Semester nicht prüfbar) | FB-41, FB-21, FB-17 |

## Ziele
Zielbaum aus `SportMate – Anforderungen.docx` §3. Messgrößen aus den NFR, soweit vorhanden.
- Z0: Menschen in Flensburg treiben spontan gemeinsam Sport.
- Z1: Passende Treffen in der Nähe schnell finden. Messbar über NFR-1 (≤ 2 Minuten, 4 von 5 Testpersonen ohne Hilfe).
- Z2: Fehlende Mitspieler selbst gewinnen und Sicherheit, dass ein Treffen stattfindet. Messbar über NFR-2
  (Treffen in höchstens 6 Eingabeschritten erstellen) und NFR-5 (kein doppelt vergebener Platz).
- Z3: Vertrauen gegenüber Unbekannten herstellen durch aussagekräftige Angaben zu Treffen und Organisator
  (Bewertungen zurückgestellt: 0 von 4 Nennungen).
- Z4 (optional, vorläufig): Eine Sportfläche kommt ohne Hin und Her zustande (Anfrage statt Direktbuchung).
- Z5 (Projekt): Lauffähige Web-App auf Vercel mit echtem Konto (Supabase) und einem lokalen Demo-Modus, gezeigt
  in Präsentation 5 (25.11.2026) und folgenden; jede Must-Story mit mindestens einem automatisierten Test (NFR-8).

## Stakeholder und Nutzergruppen
| Wer | Interesse | Wie eingebunden |
| --- | --- | --- |
| SH1 Sportinteressierte (zuerst Studierende in Flensburg) | spontan Mitspieler und Treffen finden, vorher wissen, worauf sie sich einlassen | Umfrage (4), Interviews INT-01, INT-04, Feedbackrunde MVP (Lukas, Sarah, Tim) |
| SH2 Organisierende eines Treffens | fehlende Mitspieler gewinnen, Überblick über Zu- und Absagen ohne WhatsApp-Chaos | Interview INT-02, Feedbackrunde MVP (Max), Umfrage-Frage 16 |
| SH3 Betreiber von Sportstätten | vollständige Anfragen, keine Doppelbuchung, kein Mehraufwand | Interview INT-03 (real laut Teamentscheidung), SIM-05 (KI-Simulation, nur Annahme) |
| SH4 Entwicklungsteam (Julien, Renat, Paulo, Niklas) | im Semester umsetzbar, wartbar, testbar | Retros, Board |
| SH5 Lehrende des Software-Projekts | nachvollziehbare SE-Artefakte, feste Präsentationstermine | Präsentationen P1–P7 |
| Weitere Quelle ohne Person: DSGVO | Datensparsamkeit, Einwilligung, Löschung | Randbedingung C-1 |

## Kontext
- Kartendaten: OpenStreetMap-Kacheln (Leaflet) wie im Vorgängerprototyp; Online-Kacheln übertragen IP und Ausschnitt (P3, F08).
- Backend: Supabase (Auth mit E-Mail und Passwort, Postgres mit Row Level Security). Hosting: Vercel.
- Lokaler Demo-Modus ohne Server mit klar gekennzeichneten Demodaten (P4: „Demodaten werden transparent gekennzeichnet“).
- Bestehende Kommunikationswege der Zielgruppe: WhatsApp-Gruppen (FB-29, FB-21, FB-56). SportMate ersetzt sie nicht.
- Betreiber arbeiten mit eigenem Kalender, Telefon und E-Mail (INT-03); keine Kalenderschnittstelle vorhanden.

## Erhebung
- 2026-10-10/11: drei Interviews (INT-01 Studentin, INT-02 Organisator, INT-03 Betreiberin) und INT-04 (Studentin).
  Laut Teamentscheidung reale Gespräche; Transkripte sprachlich KI-gestützt überarbeitet. In P2/P3 waren sie als
  KI-Simulation geführt (siehe `docs/feedback.md`, Abschnitt „Hinweis zum Status“).
- 2026-10-11: anonyme Online-Umfrage (Google Forms), 4 Antworten.
- bis 2026-10-27: Feedbackrunde mit vier Personen zur MVP-Demo, Grundlage für Präsentation 4.
- SIM-05 Hallenbetreiber: KI-Simulation, nur Annahme.
- Geplant, offen: Nutzertest für NFR-1 mit 5 Personen (Präsentation 6), Gespräch mit einem realen Betreiber.
Die Ergebnisse stehen im Register `docs/feedback.md`, das Rohmaterial in `docs/feedback/roh/`.

## Qualitätsziele
Reihenfolge nach Bedeutung für die Zielgruppe und die Bewertung.
1. Bedienbarkeit: Die Feedbackrunde zeigt, dass schon kleine Unklarheiten (Teilnahme-Button, Altersangabe,
   Einstieg) den Ablauf stoppen (FB-44, FB-45, FB-58).
2. Zuverlässigkeit: Organisierende brauchen eine verlässliche Teilnehmerzahl (FB-18, FB-19); ein Treffen, das
   ausfällt oder überbucht ist, kostet Vertrauen (FB-41).
3. Sicherheit und Datenschutz: Nur Berechtigte ändern Treffen; Standort und persönliche Daten bleiben privat (FB-14, FB-38, DSGVO).
4. Wartbarkeit: Messung durch SE-Eval und Tests auf mehreren Ebenen (Präsentation 5).

Messbare Qualitätsanforderungen (aus `P3/traceability.csv`, Werte sind Teamfestlegungen):

| ID | Merkmal | Anforderung | Prüfung | Stand |
| --- | --- | --- | --- | --- |
| NFR-1 | Bedienbarkeit | Neue Nutzer finden ohne Hilfe in höchstens 2 Minuten ein passendes Treffen und treten bei. | Nutzertest, erfüllt bei mind. 4 von 5 Personen | offen |
| NFR-2 | Bedienbarkeit | Ein Treffen ist in höchstens 6 Eingabeschritten erstellt. | Klickpfad zählen (Messdefinition offen) | offen |
| NFR-3 | Kompatibilität | Alle Kernabläufe ab 360 px Breite ohne horizontales Scrollen bedienbar. | Playwright mit 360-px-Viewport | offen |
| NFR-4 | Performance | Karte mit bis zu 100 Treffen über 4G in höchstens 3 Sekunden geladen. | Lighthouse | offen |
| NFR-5 | Zuverlässigkeit | Ein Platz wird auch bei gleichzeitigem Beitritt nie doppelt vergeben. | Paralleltest mit 2 Clients gegen Supabase | offen |
| NFR-6 | Zuverlässigkeit | Eine Hallenzeit hat nie zweimal den Status „Bestätigt“. | nur bei Buchungspilot | Won't (Pilot) |
| NFR-7 | Datenschutz | An Betreiber gehen nur Name und Kontakt der verantwortlichen Person. | Inhalt der Anfrage prüfen | nur bei Buchungspilot |
| NFR-8 | Wartbarkeit | Jede Must-Story hat mindestens einen automatisierten Test (Vitest oder Playwright). | CI-Bericht | offen |
| SM-R25 | Zugänglichkeit | Suchen, Details, Anmelden, Absagen per Tastatur mit sichtbarem Fokus. | Playwright Tastaturtest | offen |
| SM-R22 | Datenschutz | Suchkoordinaten werden nur für die aktuelle Suche verarbeitet, nicht im Konto gespeichert. | Code-Review, Integrationstest | offen |

## Randbedingungen
- C-1 Recht: DSGVO – personenbezogene Daten nur mit Einwilligung, mit Löschmöglichkeit; Geburtsdatum nie öffentlich (DR-1.2.3).
- C-2 Technik: Next.js mit TypeScript, Vitest, Playwright (SE-Eval-tauglich); Supabase (Auth E-Mail/Passwort,
  Postgres mit RLS); Hosting auf Vercel; zusätzlich lokaler Demo-Modus ohne Server.
- C-3 Zeit: Iterationen von zwei Wochen; feste Präsentationstermine, nächste: P5 „Qualität & Tests“ am 25.11.2026.
  Termine P6/P7: offen (laut Kursplan).
- C-4 Ressourcen: 4 Teammitglieder, kein Budget für kostenpflichtige Dienste (Free-Tarife von Supabase und Vercel).
- C-5 Prozess: Tests zuerst, eine Story = ein Branch = ein Pull Request, Review durch zweite Person (CLAUDE.md).
- A-1 Annahme: Nicht alle Nutzer geben den Standort frei; Suche muss ohne Standortfreigabe funktionieren (FB-14).

## Abwägungen
Umfang weicht vor Qualität: Lieber wenige Kernabläufe (finden, Details, beitreten, erstellen) verlässlich und
getestet als viele halbfertige Funktionen (FB-40: „dass die grundlegenden Sachen gut funktionieren“).
Termine sind fest, deshalb wird bei Zeitnot zuerst Could, dann Should verschoben. Kosten: nur kostenfreie Dienste.

## Nicht-Ziele
- Bezahlung, Kostenaufteilung in der Gruppe und direkte Hallenbuchung (Präsentation 1/2; Umfrage zeigt bestehende
  Lösung per PayPal, FB-08).
- Verbindliche Hallenreservierung ohne Bestätigung des Betreibers; Kalenderintegration (FB-24, FB-25).
- Eigener Chat, Gruppen-Nachrichten und Social Feed (FB-40, FB-17, FB-21; Gegenwunsch FB-56 bewusst zurückgestellt).
- Bewertungen von Personen (0 von 4 Nennungen in der Umfrage).
- Private, nicht öffentliche Treffen und Wartelisten in Version 1 (FB-22, FB-18).
- Native App; SportMate bleibt eine mobile Web-App.
