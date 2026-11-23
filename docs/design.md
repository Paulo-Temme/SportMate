# Designleitlinien SportMate

Stand: 23.11.2026 · Entscheidung: Orchestrator im Auftrag des Teams · verbindlich für alle UI-Arbeiten

## Ziel
SportMate soll sich wie eine echte, ruhige Mobile-App anfühlen: hell, klar, minimalistisch, mit spürbaren, aber
zurückhaltenden Animationen. Kein "KI-Look". Die Karte ist kein eingebettetes Fremdelement, sondern die Bühne der App.

## Was wir ausdrücklich NICHT machen (Anti-Slop-Liste)
- Keine Verläufe auf Flächen oder Text, kein Glassmorphism, keine bunten "Blobs", keine Glow-Schatten.
- Keine Emojis in der Oberfläche, keine Funkel-/Sparkle-Icons, keine Floskeln ("Entdecke deine Leidenschaft!").
- Keine Karten-in-Karten-in-Karten, keine übergroßen Schatten, keine zufälligen Akzentfarben pro Element.
- Keine Platzhalter-Avatare von Stockfotos. Initialen statt Fotos.
- Kein Lorem ipsum, keine englischen Reste. Alle Texte deutsch, kurz, konkret ("Noch 3 Plätze", "Heute, 18:00").

## Grundprinzipien
1. **Mobile first.** Entwurf für 360–430 px Breite. Desktop ist eine Erweiterung (Liste links, Karte rechts).
2. **Karte als Startbildschirm.** Auf Mobil füllt die Karte den ganzen Bildschirm (`100dvh`). Alle Bedienelemente
   schweben darüber: Suchleiste oben, Sportarten-Chips darunter, Bottom Sheet mit der Trefferliste, Tab-Leiste unten.
3. **Ein Akzent.** Farbe nur für Handlung und Zustand, nicht zur Dekoration.
4. **Bewegung erklärt.** Animationen zeigen Herkunft und Ziel (Sheet fährt hoch, Karte fliegt zum Treffen, Marker
   wächst bei Auswahl). Dauer 150–350 ms, Federn statt linearer Kurven. `prefers-reduced-motion` schaltet sie ab.
5. **Ehrliche Zustände.** Leer-, Lade- und Fehlerzustände sind gestaltet, nicht vergessen.

## Tokens
| Token | Wert | Verwendung |
| --- | --- | --- |
| `--bg` | `#F7F6F2` | App-Hintergrund (warmes Off-White) |
| `--surface` | `#FFFFFF` | Sheets, Karten, Eingaben |
| `--ink` | `#15171A` | Haupttext, primäre Buttons |
| `--ink-2` | `#5B6068` | Sekundärtext |
| `--line` | `#E7E5DF` | Trennlinien, Rahmen (1 px) |
| `--accent` | `#E8552B` | Akzent "Signalorange": Teilnehmen, aktive Auswahl, ausgewählter Marker |
| `--accent-soft` | `#FCE9E2` | Hintergrund aktiver Chips |
| `--ok` | `#1F8A5B` | "Plätze frei", bestätigt |
| `--warn` | `#B7791F` | "Fast voll", Mindestteilnehmer noch nicht erreicht |
| `--accent-strong` | `#D2441B` | Flächen mit weißer Schrift: "Jetzt teilnehmen", ausgewählter Marker (Kontrast Weiß darauf 4,6:1) |
| `--ok-ink` | `#1B7A50` | Text in Ok-Farbe auf Weiß, z. B. "5 von 10 Plätzen frei", "Dabei" (5,3:1) |
| `--warn-ink` | `#8F5C12` | Text in Warnfarbe auf Weiß, z. B. "Sucht noch Mitspielende" (5,7:1) |
| `--on-accent` | `#FFFFFF` | Text und Icons auf dunklen Flächen (`--ink`) und Akzentflächen |
| `--map-bg` | `#F2F1EC` | Kartengrund, Karten-Platzhalter, Offline-Karte |
| `--surface-muted` | `#EFEDE8` | Lade-Skelette, gedämpfte (ausgebuchte) Marker |
| `--surface-hover` | `#FBFAF8` | Hover auf weißen Listenzeilen |
| `--danger-soft` / `--danger-line` | `#F7E6E2` / `#ECD1CB` | Hintergrund und Rahmen von Fehler- und Absagehinweisen |
| `--ok-soft` | `#E8F3ED` | Hintergrund positiver Hinweise ("Anfänger willkommen", Teilnahme bestätigt) |
| `--ok-on-dark` | `#7FD3AD` | Erfolgssymbol auf dunklem Toast (10:1 zu `--ink`) |
| Radius | 12 px (Elemente), 24 px (Sheets), 999 px (Chips, Suchleiste) | |
| Schatten | nur `0 1px 2px rgba(21,23,26,.06), 0 8px 24px rgba(21,23,26,.08)` für schwebende Elemente | |
| Abstand | 4er-Raster (4, 8, 12, 16, 24, 32) | |

**Warum drei zusätzliche Farbtöne (eingeführt vom UI-Agenten, 23.11.2026):** Der Akzent `#E8552B` erreicht mit
weißer Schrift nur 3,6:1 und verfehlt damit WCAG AA (4,5:1 für normalen Text). `--accent-strong` ist derselbe
Farbton, dunkler, und erreicht 4,6:1; `--accent` bleibt für Flächen ohne Text (Auswahlbalken, Fokus-Akzente).
Ebenso sind `--ok` (4,3:1) und `--warn` (3,6:1) als Textfarbe auf Weiß zu hell für AA; `--ok-ink` und `--warn-ink` sind die
dunkleren Textvarianten desselben Tons. Es bleibt bei einem Akzent: Die neuen Werte sind Abstufungen, keine neuen
Farben. Kontrastwerte nach der WCAG-2.1-Formel für relative Leuchtdichte, nachgerechnet am 23.11.2026 (coder).

Sportarten bekommen **keine** eigenen Knallfarben, sondern ein Lucide-Icon im neutralen Kreis. Ausnahme: der
ausgewählte Marker nutzt den Akzent.

## Typografie
- Schrift: **Schibsted Grotesk** (über `next/font/google`, selbst gehostet), Fallback system-ui.
- Größen: 28/22/17/15/13 px. Ausnahme Landing Page (`/`): Hero bis 80 px, Abschnittsüberschriften bis 44 px, Abschluss bis 56 px (Entscheidung 23.11.2026, F-31). Auf der Landing ist das Sport-Icon der wechselnden Sportzeile der einzige dekorative Akzent. Überschriften 600, Fließtext 400, Zahlen tabellarisch (`font-variant-numeric: tabular-nums`).
- Keine Großbuchstaben-Überschriften mit Sperrung, außer kleinen Labels (12 px, 500).

## Karte
- **MapLibre GL JS** mit dem hellen Vektorstil *OpenFreeMap Positron* (`https://tiles.openfreemap.org/styles/positron`), kein API-Key.
  Begründung: Vektorkarte ist farblich anpassbar und wirkt wie Teil der App; Rasterkacheln wirkten im Prototyp fremd.
- Kartenfarben werden nach dem Laden an die Tokens angepasst (Wasser leicht bläulich-grau, Grünflächen sehr blass,
  Labels in `--ink-2`). Keine Standard-Kontrollen von MapLibre sichtbar; eigene runde Buttons (Standort, Zoom auf Desktop).
- Marker: eigene HTML-Marker, weiße Pille mit Sport-Icon und Uhrzeit; ausgewählt = Akzentfarbe, leicht vergrößert
  (Federanimation). Bei hoher Dichte Clustering mit Anzahl.
- Attribution klein und dezent unten links über dem Sheet (Pflicht laut Lizenz).
- Fallback ohne Netz oder in Tests: neutrale Fläche mit Rasterlinien und Markern an relativen Positionen,
  ausdrücklich als "Karte offline" gekennzeichnet.

## Navigation (Mobil)
Tab-Leiste unten, 4 Ziele: **Entdecken** (Karte + Sheet), **Meine Treffen**, **Erstellen** (mittig, primär),
**Profil**. Desktop: gleiche Ziele als schmale linke Leiste.

## Bottom Sheet
Drei Rastpunkte: *Spitze* (Griff + "12 Treffen in der Nähe"), *halb* (Liste), *voll*. Ziehen mit Finger und Maus,
Fortsetzen der Geschwindigkeit (Motion). Ausgewähltes Treffen öffnet die Detailansicht im selben Sheet,
die Karte fliegt gleichzeitig zum Treffpunkt.

## Treffen erstellen
Drei Schritte mit Fortschrittsanzeige: 1. Sportart und Titel, 2. Ort (Vollbildkarte mit fester Nadel in der Mitte,
Karte darunter verschieben) und Zeit, 3. Details (Plätze, Niveau, Alter, Kosten, Mitbringen, Treffpunktbeschreibung).
Validierung direkt am Feld, verständliche Fehlermeldungen.

## Animationsbibliothek
`motion` (ehemals Framer Motion). Verwendung: Sheet, Seitenwechsel (leichtes Gleiten/Überblenden), Listen
(gestaffeltes Einblenden nur beim ersten Laden), Buttons (Druck: scale .97), Teilnahme-Bestätigung (Zähler zählt hoch).

## Barrierefreiheit
Kontrast mindestens WCAG AA, Fokusring sichtbar (2 px `--ink`), Trefferflächen ≥ 44 px, alle Icons mit Label,
Karte mit Listenalternative (die Liste zeigt immer dieselben Treffer wie die Karte).
