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
