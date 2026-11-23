# Lücken für die Abgabe

Stand: 23.11.2026 (aktualisiert nach dem Endlauf auf Commit `004a9fa`), zusammengestellt von der Agentenrolle reporter.
Grundlage: Repository auf Branch `develop`, alte Unterlagen in `Dokumentationen/`, `P3 Neu/`,
`SportMate_Praesentation_1.pptx`, `P4.pptx`. Was hier steht, darf nicht geschönt in die Dokumente; das Team liefert es nach
oder streicht die Aussage.

## A. Muss vor der Abgabe erledigt werden

| # | Lücke | Betrifft | Was zu tun ist |
| --- | --- | --- | --- |
| A1 | **Hauptverantwortliche bestätigen.** Die Dateinamen nutzen die Rollen aus Präsentation 1 (Folie 5, 30.09.2026): Julien = Anforderungen und Kundenfeedback, Renat = Architektur und Entwurf, Paulo = Implementierung, Niklas = Management und Qualitätssicherung (daher auch Testen). | alle Dateinamen | bestätigen oder in `abgabe/build_pdfs.mjs` (`OWNERS`) ändern und neu bauen |
| A2 | **Autorinnen und Autoren mit Anteil in %** in jedem Dokument leer | alle | je Dokument eintragen |
| A3 | **Projekt-Board:** kein Link, keine Einladung | Management, Testen (Bug-Tickets) | Board-Link eintragen, Einladung an die Lehrenden verschicken, Bug-Tickets BUG-01 … BUG-04 im Board |
| A4 | **Zeiterfassung leer** (`docs/management/zeiterfassung.csv` nur Kopfzeile) | Management (Aufwand je Person und Tätigkeit) | nur echte Stunden nachtragen; danach `make stats`; sonst bleibt „offen“ |
| A5 | **Gesprächsdaten der Interviews** INT-01 … INT-04 und der Feedbackrunde zum MVP unbekannt (Datum der Transkripte statt Gesprächsdatum) | Anforderungen, Feedback | Datum, Form (persönlich/online/telefonisch), Dauer je Gespräch nachtragen |
| A6 | **Status der Interviews:** Originaldateien und P2/P3-Unterlagen vermerken „KI-Simulation – keine reale Erhebung“; Teamentscheidung vom 23.11.2026 stuft sie als reale, KI-gestützt ausformulierte Gespräche ein | Anforderungen, Feedback, Bewertung „Belege für Erhebung“ | Teamentscheidung belegen (z. B. Notizen der Originalantworten) oder Einordnung ändern; die Dokumente nennen den Widerspruch offen |
| A7 | **Nutzertest mit echten Personen (P6)** nicht durchgeführt (NFR-1, H-2) | Testen, Feedback, Anforderungen | 5 Personen, Szenario FB-42, Protokoll in `docs/feedback/roh/`, `/feedback` |
| A8 | **Feedback zur lauffähigen Software** fehlt (letzte Runde zur MVP-Demo bis 27.10.2026) | Feedback | Runde mit der Live-Version durchführen |
| A9 | **Reflexion/Retrospektiven** fehlen (`docs/management/retros/` nur Vorlage, `probleme.md` leer); P7-Reflexion offen | Management | `/retro` je Iteration; Reflexion zu P7 |
| A10 | **Freigaben** fehlen: Vision, Architektur, ADR 0001–0010, Backlog (inkl. neuer AKs F-01 AK6, F-05 AK5, F-08 AK5/AK6, F-24 AK4 und geändertem F-08 AK1), Specs „Freigabe offen“; alle 58 Feedback-Konsequenzen „Vorschlag“ (Umsetzungsstand ist separat eingetragen) | alle | Freigaben mit Datum und Name eintragen; Konsequenzen entscheiden |
| A11 | **Menschliches Review** der Migrationen `0001` und `0002` und der Dateien zu Login/Rechten steht aus (Review-Protokoll) | Testen, Implementierung | Review durchführen und vermerken |
| A12 | Startanleitung nicht von einer Person außerhalb des Teams ausprobiert (Checkliste `docs/abgabe.md`) | Lauffähige Software | ausprobieren lassen, Ergebnis vermerken |
| A13 | **F-12 AK1/AK2 Wortlaut** weicht von der Umsetzung ab (Termin „Do, 26.11., 18:00–20:00 Uhr · 2 Std.“ ohne Jahr; Alter ohne „(Wunsch des Organisators)“); F-13 AK2-Hinweis und AK4 ohne Test; F-22 AK4 ohne Paralleltest | Anforderungen, Testen | AK anpassen oder Umsetzung/Tests nachziehen; bis dahin bleiben die drei Stories „teilweise“ |

## B. Inhaltliche Lücken je Dokument

| Dokument | Lücke |
| --- | --- |
| Anforderungen | Specs nur für F-01 und F-22; Release 1: 11 umgesetzt, 3 teilweise (F-12, F-13, F-22, siehe A13); offene Entscheidungen Passwortlänge 8/12 (F04), Messdefinition NFR-2; `docs/traceability.md` (aus `make trace`) liegt nicht im Repo. Erledigt: Backlog-Status nach Endlauf, F-32 AK1 mit tatsächlichem Bannertext |
| Architektur und Entwurf | kein Aktivitätsdiagramm; Literatur für ADR-0002, 0007, 0008, 0009, 0010 fehlt; neue npm-Abhängigkeiten ohne ADR; REV-10 (öffentliche `organizer_id`) ohne Entscheidung. Erledigt: Klassendiagramm, Ordnerstruktur, Bausteine, Tabelle „Anforderung → Realisierung“ an den Code (`004a9fa`) angeglichen |
| Implementierung | `docs/tech-debt.md` leer (offene Befunde REV-02, -09, -10, -13, -14 nicht eingetragen); kein Branch/PR je Story nachweisbar (alle Commits direkt auf `develop`); `ded1894` (BUG-04) Test und Code in einem Commit |
| Lauffähige Software | ob Vercel von `main` oder `develop` baut, ist nicht dokumentiert; Produktion wird nach diesem Stand neu bereitgestellt (Orchestrator) |
| Testen | kein automatischer Paralleltest (NFR-5); Supabase-Integration nicht in CI (REV-02, von Hand 285/285); Mutation Score nicht verwertbar (Linux-Lauf offen); keine `specs/F-XX/review.md`; ISTQB-Quelle ohne Version. Erledigt: Endlauf auf dem Abgabestand (Vitest 283/2, Playwright 117/1, tsc 0, ESLint 0), Fehlerprotokoll 4/4 behoben, zweite SE-Eval-Messung |
| Management | Vergleich des Vorgehensmodells mit einer Alternative fehlt; Rollen-Tabelle mit Vertretung leer; Sprints geplant/erreicht nicht dokumentiert; Termine P4, P6, P7 fehlen; „Quelle offen“ bei mehreren Praktiken; alle 55 Agenten-Commits über ein Git-Konto an einem Tag – Beiträge der anderen Personen müssen anders belegt werden (Zeiterfassung, Board) |
| Feedback | Wirkungsbelege aus dem Prototyp (`FEEDBACK-01.md`, `LANDINGPAGE.md`, `Interviews/04_Interviewauswertung_und_Einfluss.md`) liegen nicht im Repository; Freigabe der Konsequenzen offen |

## C. Hinweise zur PDF-Erzeugung

- Erzeugen: `node abgabe/build_pdfs.mjs` im Projektordner (braucht Netz für `marked@12.0.2` und `mermaid@10.9.1` von
  cdn.jsdelivr.net sowie `npx playwright install chromium`).
- Ausgabe: `abgabe/pdf/` – `Julien_requirements.pdf`, `Renat_design.pdf`, `Paulo_implementation/` (PDF, `REPOSITORY.txt`,
  Quellcode-Archiv des committeten Stands), `Paulo_installation.pdf`, `Niklas_testing.pdf`, `Niklas_testing/`
  (Testcode-Archiv), `Niklas_management.pdf`, `Julien_feedback.pdf`, `LINKS.txt`. Diagramme zusätzlich als SVG in
  `abgabe/diagramme/`.
- Die Abschnitte, die wörtlich aus `docs/` übernommen sind (Backlog, Architektur, Teststrategie, Testfälle, Review,
  Feedback-Register), wurden beim Erstellen eingefügt. Ändern sich die Quellen, müssen diese Abschnitte in den
  Markdown-Dateien von Hand nachgezogen werden.
- Zahlen (Tests, Coverage, Commits) beziehen sich auf den Endlauf-Commit `004a9fa`; danach folgten nur Dokumentations-Commits.
  Wird vor der Abgabe noch Code geändert, Endlauf und Zählungen wiederholen.
