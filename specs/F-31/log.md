# Protokoll F-31

Jeder Agent hängt nach seinem Schritt einen Eintrag an.

## Frühere Schritte (aus `git log`)
- Erstbesuch-Hinweis im Sheet auf Entdecken (`first-visit-hint.tsx`, E2E `F-31 AK1/AK2` in `f-02-gast.spec.ts`). Durch diesen Schritt ersetzt.

## 2026-11-23 · coder (Oberfläche), Auftrag Orchestrator
- Routing (Entscheidung Orchestrator): Startseite unter `/` (`src/app/page.tsx`), Entdecken unter `/entdecken`
  (`src/app/(entdecken)/entdecken/page.tsx`, Route-Gruppe bleibt, `/treffen/[id]` unverändert). Tab/Seitenleiste
  „Entdecken“ → `/entdecken` (aktiv auch auf `/treffen/…`), Logo → `/` („SportMate, zur Startseite“), „Alle Treffen“
  im Sheet → `/entdecken`, „Zur Übersicht“ (Treffen nicht gefunden) → `/entdecken`, Leerzustand „Meine Treffen“ →
  `/entdecken`. Rücksprung nach Anmeldung unverändert (Ziel aus `?weiter=`, Ersatz `/profil`). Filter-Reset bleibt
  innerhalb der Ansicht. Auf `/` keine Tab-Leiste (App-Rahmen liest den Pfad in einer Suspense-Grenze), eigener Kopf.
- Seitentitel: `/` „SportMate – Sporttreffen in Flensburg“, `/entdecken` „Treffen entdecken · SportMate“, je mit Beschreibung.
- Aufbau Startseite: Kopf (Bildmarke + „SportMate“, „Anmelden“ bzw. Initiale + „Profil“) · Hero mit großer Überschrift
  „Sport in Flensburg. Mit Leuten, die heute auch Lust haben.“, Erklärsatz, „Treffen entdecken“ (primär) und
  „Treffen erstellen“, Hinweis „Stöbern geht ohne Konto“ · gezeichnete Flensburg-Karte (Förde vereinfacht nach OSM,
  zwei Grünflächen, feines Raster) mit bis zu 4 echten kommenden Treffen aus `events.listEvents()` als Marker-Pillen
  (Links zu `/treffen/[id]`), reihum hervorgehoben (3,2 s, pausiert bei Hover/Fokus, aus bei reduzierter Bewegung),
  darunter Karte mit Titel, Tag/Uhrzeit/Ort und freien Plätzen; Lade-, Leer- und Fehlerzustand gestaltet ·
  „So funktioniert's“ Finden → Mitmachen → Spielen als nummerierte Zeitleiste (mobil senkrecht, Desktop waagerecht)
  mit kleinen dekorativen App-Ausschnitten · „Was SportMate nicht ist“ (kein Verein, kein Gruppenchat, keine
  Hallenbuchung) · Fußzeile (Hochschulprojekt WS 2026/27, © OpenStreetMap-Mitwirkende, OpenFreeMap, Beispieltreffen fiktiv).
- Neue Kernlogik `src/lib/map/preview-frame.ts` (Projektion in festen Ausschnitt, Auswahl: freie Plätze, im Ausschnitt,
  Mindestabstand gegen überlappende Pillen, höchstens 4), Tests `preview-frame.test.ts` (9).
- Entfernt: `first-visit-hint.tsx/.module.css`, `src/hooks/use-stored-flag.ts` (nur dort genutzt). Bildmarke als
  `navigation/brand-mark.tsx` geteilt (Seitenleiste und Startseitenkopf).
- Tests zuerst (`d35b95e`): Komponententest `landing-view.test.tsx` (11), E2E `e2e/f-31-landing.spec.ts` (9 je Projekt),
  alter F-31-Hinweistest in `f-02-gast.spec.ts` durch die Startseiten-Tests ersetzt; alle E2E auf `/entdecken`
  umgestellt; `F-15 AK3` prüft jetzt `href="/entdecken"`, `F-18 AK1` die URL nach „Alle Treffen“.
  Beim Test-Commit war `tsc` erwartungsgemäß rot (Module fehlten), ESLint grün, Vitest 2 Dateien rot.
- Gefundene und behobene Fehler beim Umsetzen: (1) Hydration-Unterschied bei reduzierter Bewegung (motion-`initial`
  vom Server ≠ Browser) → Hero-Einblenden per CSS-Keyframes; (2) Next meldete `new Date()` beim Vorab-Rendern →
  Vorschau in Suspense; (3) `usePathname()` außerhalb Suspense im App-Rahmen → eigene Komponente in Suspense,
  Demo-Hinweis-Versatz per `:has([data-page='startseite'])`.
- Gestaltung geprüft an Screenshots (Dev-Server Port 3011, Online-Karte, lokaler Modus): korrigiert waagerechte
  Schrittausrichtung (`align-content: start`), tabellarische Ziffern entfernt (Schibsted setzt dabei Doppelpunkt/Komma
  sichtbar gesperrt), Fußzeile an Inhaltsrand ausgerichtet, Förde-Innenteil schmaler, Raster für Kartenanmutung.
  `/entdecken` mit Online-Karte geladen (`data-map-mode="online"`, Titel korrekt).
- Screenshots: `docs/testing/screenshots/landing-mobil.png` (Pixel 7, ganze Seite), `landing-desktop.png` (1440×900).
- Befehle (Endstand, Commit `2843d70`): `npx tsc --noEmit` 0 Fehler · `npx eslint src e2e tests` 0 Befunde ·
  `npx vitest run` 30 Dateien bestanden, 1 übersprungen; 303 Tests bestanden, 2 übersprungen ·
  `npx playwright test` 132 bestanden, 2 übersprungen (nur-Desktop-Test F-31 AK7 im Mobil-Projekt, bestehender nur-mobil-Test F-05 AK2 im Desktop-Projekt).
- Abweichungen / offen:
  - Überschrift der Startseite `clamp(34px, 9.4vw, 60px)` liegt über der Typo-Skala aus `docs/design.md` (max. 28 px);
    bewusst nur auf der Startseite (großer Typo-Hero laut Auftrag). Für `docs/design.md` vorschlagen (Orchestrator).
  - Backlog-AK1 nennt noch die Schritte „Sportart auswählen → Treffen finden → Gemeinsam Sport machen“; umgesetzt laut
    Auftrag „Finden → Mitmachen → Spielen“. AK-Vorschläge an den Orchestrator übergeben, Backlog nicht geändert.
  - `docs/architecture.md` nennt noch `use-stored-flag` und kennt `/entdecken`, `src/components/landing`,
    `src/lib/map/preview-frame.ts` nicht (architect). `docs/testing/testfaelle.md` TC-A-10 verweist auf den entfernten Test.
  - Bestehend, nicht Teil von F-31: Der Demo-Hinweis wird bei 360 px Breite links/rechts abgeschnitten (`white-space: nowrap`).
- Login/Rechte: nicht verändert (nur Links auf `/anmelden` und `/profil`).

## 2026-11-23 · coder (Oberfläche), Überarbeitung nach Team-Feedback
- Auftrag: Inhalt am Prototyp (`project/src/components/landing/LandingPage.tsx`) ausrichten, Flensburg entfernen, Text
  deutlich kürzen (keine doppelten Untertexte), Vorschau als echte MapLibre-Karte mit Kamerafahrt.
- Aufbau neu: Kopf (Logo, ab 768 px Sprungziele „So funktioniert's“/„Sportarten“, „Anmelden“/„Profil“) · Hero
  „Die Stadt ist das Spielfeld.“ + wechselnde Sportzeile (Fußball „Zusammen auf den Platz.“, Volleyball „Ein Team.
  Viele gute Bälle.“, Basketball „Zeit für ein paar Körbe.“, Badminton „Einfach den Ball ins Spiel bringen.“; 3,2 s,
  Gleiten/Überblenden, bei reduzierter Bewegung steht die erste Zeile) + „Treffen entdecken“/„Treffen erstellen“, kein
  Absatz, kein Kleingedrucktes · Kartenvorschau (Desktop rechts, 7/12 Breite, Höhe bis 760 px, Radius 32 px; mobil
  unter dem Hero, 58vh, Radius 24 px) · „So funktioniert's“ 01 Sportart wählen / 02 Treffen finden / 03 Bin dabei, je
  ein Satz · „Was bringt dich in Bewegung?“ alle sechs Sportarten als Zeilenliste mit Icon, Anzahl kommender Treffen und
  Pfeil, Link `/entdecken?sport=<Sportart>` · Abschluss „Zusammen geht mehr“ + „Jetzt Treffen entdecken“ · Fußzeile
  (Marke, Sprungziele, Hochschulprojekt, OSM/OpenFreeMap, Beispieltreffen fiktiv). „Was SportMate nicht ist“ entfällt.
- Seitentitel „SportMate – Sporttreffen in deiner Nähe“, Beschreibung ohne Ortsnamen. Kein „Flensburg“ im Text der
  Startseite (Treffen-Karte zeigt Titel/Zeit/Plätze, nicht den Treffpunkt; Kartenbeschriftungen ausgeblendet).
- Vorschau: `preview-map.tsx` (Rahmen, Wahl Karte/Ersatzfläche), `preview-map-canvas.tsx` (MapLibre, per `next/dynamic`
  erst geladen, wenn das Panel 300 px vor dem Bild ist; `interactive: false`, ohne Beschriftungen; Übersicht per
  `fitBounds`, dann `flyTo` je Treffen mit Zoom 13,9, Neigung 40°, wechselnder Blickrichtung, 4,2 s), `use-preview-tour.ts`
  (Station alle 6,5 s; startet erst nach `load`; steht bei Hover, Fokus, < 25 % sichtbar, reduzierter Bewegung),
  `preview-marker.tsx` (gleiche Pille wie Entdecken über neues `MarkerPillFace`, Link `/treffen/[id]`; Zeigen hebt
  hervor, ohne die Kamera zu bewegen), `preview-caption.tsx` (eine Treffen-Karte, echte Überblendung, Link zum Treffen;
  Lade-, Leer-, Fehlerzustand). Ersatzfläche ohne WebGL/Netz/`NEXT_PUBLIC_MAP_MODE=offline`: Kartenfarbe, Marker relativ
  verteilt, kein Raster, keine gezeichnete Landschaft. Gezeichnete Förde (`preview-shape.ts`) entfernt.
- Kernlogik: `src/lib/map/preview-frame.ts` neu geschnitten (Auswahl: freie Plätze, ≥ 300 m Abstand, ≤ 15 km vom ersten,
  höchstens 4; `placeInPreview` für die Ersatzfläche; fester Flensburg-Ausschnitt entfällt), neu
  `src/lib/events/discover-link.ts` (`buildDiscoverHref`, `readSportParam`). Entdecken liest `?sport=` beim Öffnen und
  wählt die Sportart vor (`discover-screen.tsx`). `createThemedMap` hat optionale Einstellungen `interactive`, `labels`.
- Tests zuerst (`eac3b43`): `landing-view.test.tsx` (13), `preview-frame.test.ts` (8), `discover-link.test.ts` (4),
  `e2e/f-31-landing.spec.ts` (14 je Projekt). Beim Test-Commit: ESLint grün, Vitest 3 Dateien / 14 Tests rot (erwartet).
- Gefunden beim Umsetzen: MapLibre setzt `position: relative` auf den Container (Karte 0 px hoch) → width/height 100 %;
  Rundgang lief schon während des Ladens (Treffen-Karte und Kamera auseinander) → Start erst nach `load`; Treffen-Karte
  war beim Wechsel kurz leer (`mode="wait"`) → übereinanderliegende Überblendung; Unterstreichung der Marker-Links;
  tabellarische Ziffern sperren bei Schibsted „Heute , 22:15“ → entfernt.
- Screenshots (Dev-Server Port 3011, Online-Karte mit echten Tiles, Demo-Modus, Chromium mit SwiftShader):
  `docs/testing/screenshots/landing-desktop.png` (1440×900, nach erster Kamerafahrt), `landing-mobil.png` (Pixel 7, ganze Seite).
- Befehle (Endstand): `npx tsc --noEmit` 0 Fehler · `npx eslint src e2e tests` 0 Befunde · `npx vitest run` 31 Dateien
  bestanden, 1 übersprungen; 308 Tests bestanden, 2 übersprungen · `npx playwright test` 142 bestanden, 2 übersprungen
  (wie bisher F-31 AK7 nur Desktop, F-05 AK2 nur mobil).
- Offen / für den Orchestrator:
  - Abschnittsüberschriften `clamp(28px, 7vw, 44px)`, Abschluss bis 56 px, Hero bis 80 px: über der Typo-Skala;
    `docs/design.md` (Ausnahme Landing, dort noch „Zeile 2 in --ink-2“ und „Fallback mit Rasterlinien“) anpassen.
  - Sport-Icon der Sportzeile in `--accent-strong` (einziger dekorativer Akzent auf der Seite) – Teamentscheidung.
  - Backlog-AKs F-31 (neu AK9), `docs/architecture.md` (neue Dateien, `?sport=`), `testfaelle.md` nachziehen.
  - Kamerafahrt mit echter Karte nur manuell geprüft (E2E läuft mit Offline-Karte).
- Login/Rechte: nicht verändert.
