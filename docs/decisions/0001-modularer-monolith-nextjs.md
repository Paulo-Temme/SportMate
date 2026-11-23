# ADR-0001: Modularer Monolith mit Next.js (App Router)

Status: vorgeschlagen · Datum: 2026-11-23 · Rolle: architect · Vorarbeit: P3 ADR-01

## Kontext
SportMate ist eine Web-App für ein kleines Hochschulteam mit begrenzter Zeit. Die Kernabläufe
(Suchen, Erstellen, Teilnehmen) sind eng gekoppelt und teilen ein Datenmodell. SE-Eval misst das
Projekt mit Next.js/TypeScript/Vitest/Playwright ohne Umbau (CLAUDE.md, Stack). Agenten arbeiten
parallel und brauchen klare Modulgrenzen.

## Entscheidung
Eine Next.js-Anwendung (App Router, TypeScript), intern in Module mit festen Abhängigkeitsrichtungen
gegliedert: Oberfläche (`src/app`, `src/components`), Kernlogik (`src/lib/events`, ohne I/O),
Datenzugriff (`src/lib/data`). Eine Auslieferung auf Vercel.

## Alternativen
| Alternative | Vorteil | Warum nicht |
| --- | --- | --- |
| Getrennte React-SPA + eigenes REST-Backend | unabhängige Deployments | zwei Projekte, API-Pflege, kein belegter Nutzen bei diesem Umfang |
| Microservices je Fachbereich | unabhängige Skalierung | verteilte Transaktionen für eng gekoppelte Abläufe, viel Betrieb |
| Reine statische Seite ohne Framework | minimal | kein Routing/Build-Komfort, SE-Eval-Stack nicht erfüllt |

Begründung für "Monolith zuerst": Martin Fowler, "MonolithFirst" (Blogbeitrag, 2015).

## Konsequenzen
- Modulgrenzen werden nicht vom Deployment, sondern von Regeln (CLAUDE.md, Review, Lint) erzwungen.
- Fachregeln gehören nicht in React-Komponenten; sie liegen in `src/lib/events` und sind ohne UI testbar
  (Mutation Testing durch SE-Eval).
- Neu prüfen, wenn ein zweiter Client (z. B. native App) eine dauerhafte HTTP-API braucht.
