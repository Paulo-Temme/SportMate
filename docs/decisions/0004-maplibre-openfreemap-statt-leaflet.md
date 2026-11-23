# ADR-0004: MapLibre GL + OpenFreeMap statt Leaflet-Rasterkarte

Status: vorgeschlagen · Datum: 2026-11-23 · Rolle: architect · Ersetzt: P3 ADR-06 (Leaflet 1.9.4 + OSM-Standardkacheln)

## Kontext
Der P3-Prototyp nutzte Leaflet mit OSM-Rasterkacheln. Die Kritik am Prototyp (festgehalten in
`docs/design.md`): Die Karte wirkte wie ein eingebettetes Fremdelement. Das Design macht die Karte zum
Startbildschirm und verlangt, dass ihre Farben an die App-Tokens angepasst werden. Außerdem sind die
OSM-Standardkacheln laut Tile-Nutzungsrichtlinie der OSMF nicht für den Produktivbetrieb von Apps gedacht.
Kein Budget für kostenpflichtige Kartendienste, kein API-Key gewünscht.

## Entscheidung
MapLibre GL JS (Vektorkarte, WebGL) mit dem Stil *OpenFreeMap Positron*
(`https://tiles.openfreemap.org/styles/positron`). Nach dem Laden werden Stil-Layer an die Tokens
angepasst. Eigene HTML-Marker, eigene Bedienknöpfe, dezente Pflicht-Attribution. Bei fehlendem Netz
oder in Tests: neutrale Fallback-Fläche mit Markern, gekennzeichnet "Karte offline".

## Alternativen
| Alternative | Vorteil | Warum nicht |
| --- | --- | --- |
| Leaflet + OSM-Rasterkacheln (P3) | bekannt, klein | Rasterbild nicht umfärbbar, wirkte fremd; Tile-Richtlinie |
| Leaflet + Vektor-Plugin | bleibt bei Leaflet | zusätzliche Plugin-Schicht, weniger gepflegt als MapLibre |
| Mapbox GL / Google Maps | sehr ausgereift | API-Key, Kosten, Nutzungsbedingungen |
| Eigener Tile-Server | volle Kontrolle | Betrieb nicht leistbar |

## Konsequenzen
- MapLibre braucht WebGL und das DOM: Kartenkomponente nur im Browser laden (dynamischer Import ohne SSR).
- Abhängigkeit von einem kostenlosen Dienst ohne Verfügbarkeitszusage → Fallback ist Pflicht, Liste zeigt
  immer dieselben Treffer wie die Karte.
- Kachelabrufe übertragen IP-Adresse und Kartenausschnitt an OpenFreeMap (Datenschutzhinweis nötig, offen).
- Kartenlogik ohne DOM (z. B. Stil-Anpassung, Marker-Daten aus Treffen) liegt testbar in `src/lib/map`;
  die MapLibre-Anbindung in `src/components/map`. Playwright-Tests nutzen den Fallback.
- Neu prüfen bei öffentlichem Betrieb mit Last oder wenn OpenFreeMap seine Bedingungen ändert.
