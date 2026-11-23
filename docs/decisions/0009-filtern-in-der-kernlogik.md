# ADR-0009: Suche und Filter in der Kernlogik statt in der Datenbank

Status: vorgeschlagen · Datum: 2026-11-23 · Rolle: architect

## Kontext
Suchen (Text, Sportart, Niveau, Altersgruppe, Zeitraum, "Meine Treffen") muss im lokalen Modus und im
Supabase-Modus gleich funktionieren, und Karte und Liste müssen immer dieselben Treffer zeigen. Die
Datenmenge ist klein (Treffen einer Stadt, nur kommende).

## Entscheidung
- Der Server liefert alle kommenden, veröffentlichten Treffen (begrenzt, z. B. 500) plus eigene Treffen.
- Gefiltert und sortiert wird mit derselben reinen Funktion `searchEvents` aus `src/lib/events/event-search.ts`
  in beiden Modi. Karte und Liste rendern dasselbe Ergebnis.
- Wertelisten (Sportarten, Niveaus, Altersgruppen) stehen als Klartext in `event-model.ts`; die
  SQL-Check-Constraints spiegeln sie wörtlich (eine Übersetzungstabelle entfällt).

## Alternativen
| Alternative | Vorteil | Warum nicht |
| --- | --- | --- |
| Filtern per SQL/PostgREST im Supabase-Modus | skaliert | zweite Umsetzung der Filterregeln, Abweichungen zwischen Modi |
| PostGIS-Umkreissuche | echte Geo-Abfrage | Umkreis-Story gibt es noch nicht; Einrichtung und Tests aufwendiger |
| Technische Schlüssel (`football`) in der DB + Mapping | sprachneutral | zusätzliche Abbildung ohne Nutzen, App ist nur deutsch |

## Konsequenzen
- Wertelisten an zwei Stellen (TS und SQL-Check) → bei Änderung beide anpassen; ein Test kann die
  Migration gegen `event-model.ts` prüfen (Vorschlag, offen).
- Neu prüfen ab einigen tausend kommenden Treffen oder wenn eine Umkreissuche verlangt wird.
