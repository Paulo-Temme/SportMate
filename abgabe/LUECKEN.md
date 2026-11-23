# Lücken für die Abgabe

Stand: 23.11.2026, zusammengestellt von der Agentenrolle reporter. Grundlage: Repository auf Branch `develop`
(Quellen gelesen auf Commit `4fd94ad`, Zählungen auf `d5d8a62`), alte Unterlagen in `Dokumentationen/`, `P3 Neu/`,
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
| A10 | **Freigaben** fehlen: Vision, Architektur, ADR 0001–0010, Backlog, Specs „Freigabe offen“; alle 58 Feedback-Konsequenzen „Vorschlag“ | alle | Freigaben mit Datum und Name eintragen; Konsequenzen entscheiden |
| A11 | **Menschliches Review** der Migration und der Dateien zu Login/Rechten steht aus (Review-Protokoll) | Testen, Implementierung | Review durchführen und vermerken |
| A12 | Startanleitung nicht von einer Person außerhalb des Teams ausprobiert (Checkliste `docs/abgabe.md`) | Lauffähige Software | ausprobieren lassen, Ergebnis vermerken |

## B. Inhaltliche Lücken je Dokument

| Dokument | Lücke |
| --- | --- |
| Anforderungen | Specs nur für F-01 und F-22; Backlog-Status aller Stories „offen“, obwohl Release 1 umgesetzt ist; F-32 AK1 im Backlog nennt den alten Bannertext („nichts wird gespeichert“), umgesetzt ist „Änderungen gehen beim Neuladen verloren“ (ADR-0010); offene Entscheidungen Passwortlänge 8/12 (F04), Messdefinition NFR-2; `docs/traceability.md` (aus `make trace`) liegt nicht im Repo |
| Architektur und Entwurf | Klassendiagramm und Ordnerstruktur in `docs/architecture.md` zeigen den Stand vor F-01/F-22 (kein `AuthGateway`, `data-services`, neue Modellfelder; `localStorage` statt Arbeitsspeicher); Tabelle „Anforderung → Realisierung“ mit Platzhalter-IDs (im Abgabedokument vom reporter zugeordnet, vom Team zu prüfen); kein Aktivitätsdiagramm; Literatur für ADR-0002, 0007, 0008, 0009, 0010 fehlt; neue npm-Abhängigkeiten ohne ADR |
| Implementierung | `docs/tech-debt.md` leer (Vorschläge aus dem Review nicht eingetragen); Review-Befunde REV-01 … REV-15 offen; kein Branch/PR je Story nachweisbar (alle Commits direkt auf `develop`) |
| Lauffähige Software | ob Vercel von `main` oder `develop` baut, ist nicht dokumentiert |
| Testen | letzter Playwright-Lauf auf `9f79927`, nicht auf dem Abgabestand; Fehlerprotokoll nicht auf BUG-02/BUG-03-Behebungen nachgezogen; BUG-04 offen; kein automatischer Paralleltest (NFR-5); nur eine SE-Eval-Messung, Mutation Score nicht verwertbar; keine `specs/F-XX/review.md`; ISTQB-Quelle ohne Version |
| Management | Vergleich des Vorgehensmodells mit einer Alternative fehlt; Rollen-Tabelle mit Vertretung leer; Sprints geplant/erreicht nicht dokumentiert; Termine P4, P6, P7 fehlen; „Quelle offen“ bei mehreren Praktiken; Statistik zeigt fast alle Commits über ein Git-Konto an einem Tag – Beiträge der anderen Personen müssen anders belegt werden (Zeiterfassung, Board) |
| Feedback | Wirkungsbelege aus dem Prototyp (`FEEDBACK-01.md`, `LANDINGPAGE.md`, `Interviews/04_Interviewauswertung_und_Einfluss.md`) liegen nicht im Repository |

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
- Das Repository wurde während der Zusammenstellung weiter verändert (Commits nach `4fd94ad`). Vor der Abgabe Zahlen
  (Commits, Testläufe) auf dem Abgabestand neu erheben.
