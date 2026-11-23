# ADR-0003: Repository-Schnittstelle und lokaler Demo-Modus

Status: vorgeschlagen · Datum: 2026-11-23 · Rolle: architect

## Kontext
Präsentationen und Nutzertests müssen auch ohne Netz und ohne Supabase-Projekt funktionieren.
Tests (Vitest, Playwright) sollen ohne Server und reproduzierbar laufen. Gleichzeitig ist Supabase
das Ziel-Backend. Die Oberfläche darf nicht wissen, wo die Daten liegen.

## Entscheidung
- Eine Schnittstelle `EventRepository` in `src/lib/data/event-repository.ts` mit zwei Umsetzungen:
  `LocalEventRepository` (localStorage, fiktive Demopersonen) und `SupabaseEventRepository`.
- `createEventRepository()` in `repository-factory.ts` wählt: Supabase, wenn `NEXT_PUBLIC_SUPABASE_URL`
  und `NEXT_PUBLIC_SUPABASE_ANON_KEY` gesetzt sind, sonst lokal.
- Die Fachregeln liegen als reine Funktionen in `src/lib/events` (Kernlogik ohne I/O). Der lokale
  Modus wendet sie direkt an; im Supabase-Modus setzen die Postgres-Funktionen dieselben Regeln
  verbindlich durch (ADR-0006), die Kernlogik dient dort nur der Vorabprüfung und Anzeige.
- Demo-Identitäten existieren nur im Browser. Der Supabase-Modus kennt nur echte Konten aus Supabase Auth.

Muster: Repository nach Martin Fowler, "Patterns of Enterprise Application Architecture" (2002).

## Abhängigkeitsrichtung (bewusste Präzisierung von CLAUDE.md)
CLAUDE.md nennt "Oberfläche → Kernlogik → Datenzugriff". Umgesetzt wird:
Oberfläche → Datenzugriff (über die Schnittstelle), Oberfläche → Kernlogik, Datenzugriff → Kernlogik
(Typen und Regeln). Die Kernlogik hängt von nichts ab. Grund: Die lokale Umsetzung braucht die
Fachregeln; zeigte die Kernlogik auf den Datenzugriff, entstünde ein Zyklus. Die Richtung bleibt
einseitig und zyklenfrei; die Kernlogik ist dadurch rein und gut mutationstestbar.
**Freigabe durch den Menschen nötig**, weil es vom Wortlaut der Projektregel abweicht.

## Alternativen
| Alternative | Vorteil | Warum nicht |
| --- | --- | --- |
| Nur Supabase, Demo mit eigenem Demo-Projekt | eine Umsetzung | Präsentation hängt von Netz und Dienst ab, Tests brauchen Server |
| Supabase lokal per Docker für Tests/Demo | echte DB überall | schwere Einrichtung auf Team-Rechnern und in CI |
| Mock-Service-Worker statt zweiter Umsetzung | realistische HTTP-Ebene | Supabase-Protokoll nachbauen ist aufwendiger als eine Schnittstelle |

## Konsequenzen
- **Bewusste Doppelung** (Verstoß gegen "Nichts doppelt"): Teilnahme-/Absageregeln stehen in TypeScript
  und in SQL. Gegenmaßnahme: dieselben Fehlerfälle (voll, abgesagt, begonnen, Organisator) als
  gemeinsame Vertragstests für beide Umsetzungen; SQL-Seite manuell bzw. später per Integrationstest.
- Das Domänenmodell `SportEvent` muss aus beiden Quellen befüllbar sein. Im Supabase-Modus ist die
  Teilnehmerliste fremder Personen nicht lesbar (RLS); das Modell braucht dafür eine Belegungszahl
  (`participantCount`) statt nur `participants: string[]` (offen, siehe docs/architecture.md).
- Anmelden/Registrieren gehört nicht in `EventRepository`; dafür folgt eine eigene Schnittstelle
  (`AuthGateway`), sobald die Anmelde-Story ansteht.
