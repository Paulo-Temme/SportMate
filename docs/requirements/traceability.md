# Traceability: Altanforderungen → Stories

Quelle der Altanforderungen: `project/P3/traceability.csv` (43 DR, 8 NFR, 30 SM-R; Stand P3, 27.10.2026). Stories: `docs/backlog.md`.
Status-Spalte: übernommen · geändert · Could/Won't (bewusst zurückgestellt) · bewusst offen (mit Grund). IDs der Altanforderungen bleiben unverändert (P3, F11).
Konflikte F01–F13 aus `project/P3/06_Quellen_Scope_und_offene_Punkte.md` sind in der Spalte vermerkt, wo sie eine Story betreffen.

## Detaillierte funktionale Anforderungen (DR)

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

## Qualitätsanforderungen (NFR)

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

## Ergänzende Systemanforderungen (SM-R)

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

## Stories ohne Altanforderung

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

## Zusammenfassung

- 81 Altanforderungen, alle zugeordnet. Bewusst offen ohne Story: DR-5.1.3, SM-R24, SM-R26 (Querschnitt).
- Won't (Buchungspilot Betreiberseite, F-35): DR-5.2.2, DR-5.3.1, NFR-6, SM-R17–R20, SM-R29.
- Querschnitt über Definition of Done statt eigener Story: NFR-3, NFR-8, SM-R25; RLS (SM-R21) und Eingabeprüfung (SM-R23) als AK in den Stories.
