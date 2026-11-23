# Entscheidungen (ADR)

Jede Entscheidung zwischen Alternativen bekommt eine Notiz. Format nach Michael Nygard,
"Documenting Architecture Decisions" (Blogbeitrag, 2011). Dateiname `NNNN-kurzname.md`.
Eine verworfene Entscheidung bleibt stehen und verweist auf ihre Nachfolgerin.

## Vorlage

```markdown
# ADR-NNNN: <Titel>

Status: vorgeschlagen | angenommen | ersetzt durch ADR-XXXX · Datum: JJJJ-MM-TT · Rolle: <wer>

## Kontext
Welches Problem, welche Kräfte, welche Randbedingungen.

## Entscheidung
Was wir tun.

## Alternativen
| Alternative | Vorteil | Warum nicht |
| --- | --- | --- |

## Konsequenzen
Positiv, negativ, was jetzt beachtet werden muss. Wann die Entscheidung neu geprüft wird.
```

## Übersicht

| Nr. | Titel | Status |
| --- | --- | --- |
| [0001](0001-modularer-monolith-nextjs.md) | Modularer Monolith mit Next.js (App Router) | vorgeschlagen |
| [0002](0002-supabase-statt-eigenem-backend.md) | Supabase statt eigenem Backend | vorgeschlagen |
| [0003](0003-repository-schnittstelle-und-demo-modus.md) | Repository-Schnittstelle und lokaler Demo-Modus | vorgeschlagen |
| [0004](0004-maplibre-openfreemap-statt-leaflet.md) | MapLibre GL + OpenFreeMap statt Leaflet-Rasterkarte | vorgeschlagen |
| [0005](0005-mobile-first-karte-und-bottom-sheet.md) | Mobile-first: Karte als Startbildschirm mit Bottom Sheet | vorgeschlagen |
| [0006](0006-atomare-teilnahme-per-postgres-funktion.md) | Atomare Teilnahme per Postgres-Funktion | vorgeschlagen |
| [0007](0007-datenzugriff-aus-dem-browser.md) | Datenzugriff direkt aus dem Browser (supabase-js + RLS) | vorgeschlagen |
| [0008](0008-seed-treffen-ohne-konto.md) | Seed-Treffen ohne Konto | vorgeschlagen |
| [0009](0009-filtern-in-der-kernlogik.md) | Suche und Filter in der Kernlogik statt in der Datenbank | vorgeschlagen |

Alle Notizen vom 23.11.2026 (architect), Freigabe durch das Team offen.
