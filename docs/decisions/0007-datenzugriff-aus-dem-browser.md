# ADR-0007: Datenzugriff direkt aus dem Browser (supabase-js + RLS)

Status: vorgeschlagen · Datum: 2026-11-23 · Rolle: architect · Weicht ab von: P3-Entwurf (C2 Next.js-Server mit Route Handlern)

## Kontext
P3 sah eigene HTTP-Routen in Next.js (`/api/events/...`) vor, die Sitzung prüfen und RPCs aufrufen.
Inzwischen gilt: Die Datenbank ist mit RLS und security-definer-Funktionen selbst die Sicherheitsgrenze
(ADR-0002, ADR-0006), und der lokale Demo-Modus läuft ohnehin vollständig im Browser (ADR-0003).

## Entscheidung
`SupabaseEventRepository` läuft im Browser und spricht mit `@supabase/supabase-js` (anon key + Nutzer-JWT)
direkt die Supabase Data API an: Lesen über Tabellen (`events`, eigene `participations`), Schreiben über
`rpc('join_event', …)` usw. Keine eigenen Route Handler, kein `service_role`-Schlüssel in der App.
Seiten sind Client-Komponenten für alles mit Daten; Server-Komponenten nur für statische Hülle/Layout.

## Alternativen
| Alternative | Vorteil | Warum nicht |
| --- | --- | --- |
| Next.js Route Handler / Server Actions als Zwischenschicht (P3) | Fehlerübersetzung und Logging serverseitig | doppelte Schicht ohne zusätzlichen Schutz; Demo-Modus bräuchte trotzdem Browser-Variante |
| Server-Komponenten mit `@supabase/ssr` für alles | SEO, schneller erster Inhalt | Cookie-Sitzung, mehr Konfiguration; Karte ist ohnehin Client-only |

## Konsequenzen
- Alles, was im Browser läuft, ist nicht vertrauenswürdig: Jede Regel, die schützen soll, steht in RLS
  oder in einer Funktion. Die Kernlogik im Browser ist nur Bedienhilfe.
- Anon key ist öffentlich (beabsichtigt); Sicherheit hängt vollständig an korrekten Grants/RLS → Review.
- Sitzung liegt im Browser-Speicher von supabase-js. Für spätere serverseitige Seiten ggf. `@supabase/ssr`
  ergänzen (neu prüfen, wenn SEO oder geschützte Server-Seiten nötig werden).
