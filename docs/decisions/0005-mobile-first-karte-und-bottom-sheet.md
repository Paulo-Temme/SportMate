# ADR-0005: Mobile-first mit Karte als Startbildschirm und Bottom Sheet

Status: vorgeschlagen · Datum: 2026-11-23 · Rolle: architect · Grundlage: `docs/design.md` (verbindlich)

## Kontext
Die Zielgruppe sucht spontan unterwegs nach Treffen in Flensburg, überwiegend am Smartphone (Annahme,
noch nicht mit echtem Feedback belegt). Das Team hat in `docs/design.md` entschieden: Karte füllt den
Bildschirm, Bedienelemente schweben darüber, Trefferliste im Bottom Sheet mit drei Rastpunkten.

## Entscheidung
- Layout für 360–430 px zuerst, Desktop als Erweiterung (Liste links, Karte rechts).
- Route `/` = Entdecken: Kartenbühne + Bottom Sheet. Die Detailansicht eines Treffens öffnet im selben
  Sheet; die URL spiegelt die Auswahl (Suchparameter oder Unterroute), damit Zurück-Taste und Direktlinks
  funktionieren.
- Ein gemeinsamer Zustand für Treffer und Auswahl speist Karte und Liste (eine Quelle, keine zweite Suche).
- Animation mit `motion`; `prefers-reduced-motion` schaltet Bewegung ab.

## Alternativen
| Alternative | Vorteil | Warum nicht |
| --- | --- | --- |
| Liste als Startseite, Karte als Tab | einfacher, barrierearm | widerspricht design.md; Karte wäre wieder Nebenelement |
| Desktop-first mit Sidebar | einfaches Layout | Zielgerät Smartphone |
| Separate Seiten für Liste/Detail ohne Sheet | einfaches Routing | Kontextverlust (Karte verschwindet) |

## Konsequenzen
- Bottom Sheet und Karte sind die komplexesten UI-Bausteine; Gesten-Logik (Rastpunkt aus Position und
  Geschwindigkeit) wird als reine Funktion in `src/lib/` gehalten, damit sie testbar ist.
- Barrierefreiheit: Listenalternative zur Karte ist Pflicht; Sheet per Tastatur bedienbar.
- E2E-Tests laufen mit Mobil-Viewport und mit Desktop-Viewport.
