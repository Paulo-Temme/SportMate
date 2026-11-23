# Protokoll F-08

## Frühere Schritte (aus `git log`, Testergebnisse hier nicht nachvollzogen: offen)
- `18fc909` Tests · `90abdd2` MapLibre-Karte, Marker, Offline-Karte · `8d5d439` Karte holt alle Treffer ins Bild

## 2026-11-23 · coder (Nacharbeit)
- `ebe3eb4` `map-theme.ts` nach `src/lib/map/` (ADR-Konformität), Tests mitgenommen.
- `b84e77d` Marker-Überlappung: reine Funktion `groupOverlappingMarkers` (Pixelabstand, rechteckige Kollisionsfläche) in `src/lib/map/marker-grouping.ts`, gemeinsam für MapLibre- und Offline-Karte; Gruppen-Pille mit Anzahl, Klick zoomt auf die Ausdehnung (online) bzw. fächert auf (offline, „Alle zeigen“ zurück). Abweichung vom Vorschlag „MapLibre-GeoJSON-Cluster“: eine getestete Logik für beide Karten, Kollisionsfläche passt zur Pillenform.
- Tests zuerst: `src/lib/map/marker-grouping.test.ts` (12 Tests), E2E `F-08 AK5` (keine Überlappung der Pillen) und `F-08 AK6` (Gruppe auffächern), `F-08 AK1/AK2` an Gruppen angepasst (Orakel: Kennungen Karte = Liste).
- Karten-Ladezeit (Befund Orchestrator): Messung auf Produktion im eingebauten Browser – Stil nach 0,6 s, Schriften erst nach 8,8 s beim ersten Aufruf, Marker nach 1,5 s bei warmem Cache. Hauptverzögerung beim Kachelabruf (kalter Cache/Netz). Trotzdem: Kartencode wird beim Modulladen angefordert, `preconnect` zu OpenFreeMap, Platzhalter in Kartenfarbe bis `load`, Marker blenden danach ein.
- Online-Gruppierung lokal mit Headless-Chromium (Swiftshader) geprüft: 1 Marker + 2 Gruppen in der Übersicht, nach Klick 5 Marker + 1 Gruppe.
- Testbefehl: `npx playwright test e2e/f-08-karte.spec.ts e2e/f-06-filter.spec.ts e2e/f-22-teilnahme.spec.ts` 46 bestanden.
- Gesamtlauf am Ende: `npx tsc --noEmit` 0 Fehler · `npx eslint src e2e tests` 0 Befunde · `npx vitest run` 28 Dateien bestanden, 1 übersprungen; 283 Tests bestanden, 2 übersprungen (Supabase-Integration ohne Zugangsdaten) · `npx playwright test` 117 bestanden, 1 übersprungen (nur-mobil-Test im Desktop-Projekt). E2E lief in einer Kopie des Arbeitsstands auf Port 3040, weil im Repo bereits ein Dev-Server des Orchestrators lief.
- Offen für planner: Backlog-AK1 sagt „genau 4 Markierungen“; mit Gruppen gilt „genau diese 4 Treffen, einzeln oder gruppiert“. AK5/AK6 sind als Testnamen neu und fehlen im Backlog. `docs/architecture.md` nennt `src/lib/map` noch „geplant“ (architect).
