# Architektur

Wird vom architect erstellt und bei jedem Epic geprüft. Vom Menschen freigegeben.
Status: Entwurf vom 23.11.2026 (architect) · Freigabe offen

> **Besondere Vorsicht:** Abschnitte "Datenmodell", "Sicherheitskonzept" und die Dateien
> `supabase/migrations/0001_initial_schema.sql` und `supabase/seed.sql` betreffen Rechte und Schema.
> Ein Mensch liest sie vor der Freigabe selbst.

## Änderungen
| Datum | Epic | Was hat sich geändert |
| --- | --- | --- |
| 2026-11-23 | Endstand P5 (reporter, Abgleich mit Commit `004a9fa`) | Bausteine, Klassendiagramm, Ordnerstruktur und Anforderungstabelle an den Code angepasst: `src/lib/map` (Kartenfarben, Marker-Gruppen) und `src/lib/ui` (Bottom-Sheet-Rastpunkte, Fokusfalle) existieren; `src/lib/auth` und `AuthGateway` umgesetzt; `data-services` statt `repository-factory`; Demo-Modus hält Treffen im Arbeitsspeicher (ADR-0010); Hooks unter `src/hooks`; 12-h-Regel in der Kernlogik (BUG-04); Migration `0002_cost_limit.sql`. |
| 2026-11-23 | Projektstart | Erster Entwurf. Übernommen aus P3 (27.10.2026): Monolith, Supabase, atomare Teilnahme, abgeleitete Zustände, Organisator nimmt automatisch teil. Geändert: MapLibre statt Leaflet (ADR-0004), Datenzugriff aus dem Browser statt Route Handler (ADR-0007), Belegungszähler (ADR-0006), Repository + Demo-Modus (ADR-0003). Zurückgestellt: Hinweise/Benachrichtigungen, Treffen bearbeiten, Buchungspilot, Profile mit Sportarten. |

## Notation
Alle Diagramme in Mermaid, damit sie im Repo versioniert und im Pull Request geprüft werden.

| Sicht | Diagrammart | Warum diese |
| --- | --- | --- |
| Bausteine und Abhängigkeiten | Komponentendiagramm (Flowchart) | zeigt Module und die erlaubten Abhängigkeitsrichtungen auf einen Blick |
| Abläufe zwischen Bausteinen | Sequenzdiagramm | zeigt Reihenfolge der Aufrufe über Modul- und Systemgrenzen, auch Nebenläufigkeit (`par`) |
| Zustände eines Treffens | Zustandsdiagramm | ein Treffen hat gespeicherte und abgeleitete Zustände mit klaren Übergängen |
| Struktur der Kernlogik | Klassendiagramm | zeigt Typen, Schnittstelle und Umsetzungen; Module ohne Klassen als `<<module>>` |
| Daten | ER-Diagramm + Feldtabelle | Beziehungen und Kardinalitäten; Regeln stehen in der Tabelle |
| Verteilung | Flowchart mit Knoten je Laufzeitumgebung | Mermaid hat kein eigenes Verteilungsdiagramm; Subgraphen stellen Knoten dar |

## Architekturtreiber
`docs/vision.md` ist noch eine Vorlage. Die Qualitätsziele unten sind daher **Annahmen des architect**
auf Basis von `docs/design.md`, den Vorgaben des Teams und der P3-Vorarbeit. Mit der Vision abgleichen (offen).

| Qualitätsmerkmal | Konkrete Anforderung | Folge für die Architektur |
| --- | --- | --- |
| 1. Bedienbarkeit (mobil) | Treffen in der Nähe in wenigen Sekunden finden; App wirkt wie eine native Mobile-App; Karte nicht fremd (Prototyp-Kritik, design.md) | Mobile-first, Karte als Startbildschirm, Bottom Sheet (ADR-0005); Vektorkarte mit Tokens (ADR-0004); Karte und Liste aus einer Trefferquelle |
| 2. Korrektheit/Zuverlässigkeit der Teilnahme | Ein Treffen wird nie überbucht, auch wenn zwei Personen gleichzeitig den letzten Platz nehmen | Atomare Postgres-Funktionen mit Zeilensperre + Check-Constraint (ADR-0006) |
| 3. Sicherheit und Datenschutz | Nur eigene Teilnahmen lesbar; Fremde sehen Belegung, nicht Namen; keine E-Mail öffentlich; keine Demo-Identitäten auf dem Server | RLS je Tabelle, Schreiben nur per RPC mit `auth.uid()` (ADR-0002, ADR-0007); Profile nur mit Anzeigename |
| 4. Wartbarkeit/Testbarkeit | Kernlogik per Mutation Testing prüfbar; Tests ohne Server und Netz; Agenten arbeiten parallel | Reine Kernlogik in `src/lib/events` ohne I/O; Repository-Schnittstelle mit lokaler Umsetzung (ADR-0003); kleine Dateien mit einer Aufgabe |
| 5. Verfügbarkeit in der Demo | Präsentation funktioniert ohne Netz und ohne Supabase | Lokaler Demo-Modus, Karten-Fallback "Karte offline" |

Quelle für Qualitätsmerkmale als Architekturtreiber: Len Bass, Paul Clements, Rick Kazman,
"Software Architecture in Practice", 3. Auflage, 2012.

### Randbedingungen
- Technik: Next.js (App Router) + TypeScript, Vitest, Playwright; SE-Eval misst ohne Umbau (CLAUDE.md).
- Backend Supabase (Auth, Postgres, RLS), Hosting Vercel, Karte MapLibre GL + OpenFreeMap, Animation `motion`.
- Budget: kostenlose Tarife; kein kostenpflichtiger Kartendienst, kein API-Key für die Karte.
- Zeit: Semesterprojekt, kleines Team; Agentenprozess mit Freigabepunkten (`docs/prozess.md`).
- Recht: DSGVO – Datensparsamkeit, keine Standortspeicherung, Hinweis auf externe Kartenkacheln (offen).
- Keine Secrets im Code, kein `service_role`-Schlüssel in der App.
- Alle Texte deutsch; Gestaltung verbindlich nach `docs/design.md`.

## Stil
**Modularer Monolith** (eine Next.js-Anwendung) mit **Schichten innerhalb des Browsers** und einem
verwalteten Backend (Supabase) als zweitem Laufzeitknoten. Innerhalb der App: Oberfläche → Kernlogik,
Oberfläche → Datenzugriff (Schnittstelle), Datenzugriff → Kernlogik; die Kernlogik hängt von nichts ab
(Präzisierung der CLAUDE.md-Regel, Freigabe nötig: ADR-0003).

Verworfene Alternativen: getrenntes REST-Backend oder Microservices (zu viel Betrieb für eng gekoppelte
Abläufe, ADR-0001); eigene Route-Handler-Schicht zwischen Browser und Supabase (kein Sicherheitsgewinn
gegenüber RLS, ADR-0007). Quellen: Martin Fowler, "MonolithFirst" (2015); Repository-Muster nach
Martin Fowler, "Patterns of Enterprise Application Architecture" (2002).

## Bausteine
```mermaid
flowchart TD
  subgraph UI["Oberfläche (src/app, src/components, src/hooks)"]
    Pages["Seiten / Routen<br/>Entdecken, Treffen-Detail, Meine Treffen, Erstellen, Profil, Anmelden"]
    MapStage["Kartenbühne<br/>components/map (MapLibre, Offline-Karte, Marker-/Gruppen-Pillen)"]
    Sheet["Bottom Sheet + Trefferliste + Detail<br/>components/sheet, discover, event"]
    Form["Erstellen-Assistent<br/>components/create-event"]
    Nav["Tab-Leiste / Seitenleiste<br/>components/navigation"]
    Hooks["Hooks<br/>use-event-list, use-event-detail, use-participation, use-dialog-focus"]
    Services["app-services<br/>stellt DataServices bereit"]
  end
  subgraph CORE["Kernlogik (src/lib/events, src/lib/auth, src/lib/map, src/lib/ui) – rein, ohne I/O"]
    Model["event-model, stored-event<br/>Typen, Wertelisten"]
    Validation["event-validation<br/>inkl. Höchstdauer 12 h"]
    Search["event-search<br/>Filter, Kalenderfenster"]
    Participation["participation<br/>Teilnahmeregeln"]
    Presentation["event-presentation<br/>Plätze, Zustand, Termin mit Dauer, Heute/Morgen"]
    AuthCore["auth<br/>credential-validation, AuthError"]
    MapLogic["map<br/>map-theme, marker-grouping"]
    UiLogic["ui<br/>sheet-snap, focus-trap"]
  end
  subgraph DATA["Datenzugriff (src/lib/data)"]
    Port["EventRepository<br/>(Schnittstelle)"]
    AuthPort["AuthGateway<br/>(Schnittstelle)"]
    Factory["data-services<br/>Wahl lokal/Supabase"]
    Local["LocalEventRepository + LocalAuthGateway<br/>Treffen im Arbeitsspeicher, Konten/Sitzung in localStorage (ADR-0010)"]
    Remote["SupabaseEventRepository + SupabaseAuthGateway<br/>supabase-js, Fehlerübersetzung"]
  end
  Supa[("Supabase<br/>Auth + Postgres/RLS + RPC")]
  Tiles["OpenFreeMap<br/>Vektorkacheln + Stil"]

  Pages --> Sheet & MapStage & Form & Nav & Hooks
  Hooks -->|K1 Methodenaufruf| Services
  Services --> Factory
  Sheet --> Presentation & UiLogic
  Form --> Validation
  MapStage --> MapLogic
  Factory --> Local & Remote
  Local -.implementiert.-> Port & AuthPort
  Remote -.implementiert.-> Port & AuthPort
  Local --> Participation & Search & Validation
  Remote --> Search & Validation & AuthCore
  Remote -->|K2 HTTPS REST/RPC, JWT| Supa
  Remote -->|K3 HTTPS Auth| Supa
  MapStage -->|K4 HTTPS Kacheln| Tiles
  Validation & Search & Participation & Presentation --> Model
```

Konnektoren: **K1** TypeScript-Aufruf über die Schnittstelle (asynchron, Promise); **K2** HTTPS zur
Supabase Data API (PostgREST: Tabellenlesen, `rpc()`), Nutzer-JWT im Header; **K3** HTTPS zu Supabase Auth
(E-Mail/Passwort, Sitzung im Browser); **K4** HTTPS zu OpenFreeMap (Stil-JSON, Vektorkacheln, Schriften).

| Baustein | Aufgabe | Darf abhängen von | Verbirgt (Information Hiding) |
| --- | --- | --- | --- |
| Seiten (`src/app`) | Routen, Seitenzustand, Verdrahtung der Komponenten | Komponenten, Hooks, Kernlogik | – |
| Hooks (`src/hooks`) | Laden der Treffer/Details, Teilnahme-Aktionen mit Rückmeldung, Dialog-Fokus, Medienabfrage | `DataServices` (über `app-services`), Kernlogik | Ladezustand, Fehlerbehandlung |
| Kartenbühne (`components/map`) | MapLibre initialisieren, Tokens anwenden, Marker und Gruppen mit Anzahl, Auffächern, Flug zum Treffen, Offline-Karte | `src/lib/map`, Kernlogik-Typen | MapLibre-API, Stil-Layer-Namen |
| Bottom Sheet / Liste / Detail | Rastpunkte, Gesten, Trefferliste, Detailansicht, Teilnehmen-Knopf, Bestätigungsdialog | Kernlogik (Presentation, Participation-Vorabprüfung, `src/lib/ui`) | Gestenberechnung, Animation (`motion`) |
| Erstellen-Assistent | Drei Schritte, Feldvalidierung, Ortswahl per Karte | `event-validation`, `EventRepository` | Schrittzustand |
| `src/lib/events` | Fachregeln: Validierung, Suche/Filter, Teilnahmeregeln, abgeleitete Zustände, Anzeigetexte, Demodaten | nichts (nur Standard-JS, `Intl`) | Regeldetails hinter wenigen exportierten Funktionen |
| `src/lib/auth` | Prüfung der Registrierungseingaben, `AuthError`, Typ `AuthUser` | nichts | Regeln für E-Mail/Passwort |
| `src/lib/map` | reine Kartenlogik: Kartenfarben aus Tokens (`buildMapTheme`), Marker-Gruppen ohne Überlappung (`groupOverlappingMarkers`, `canSpreadGroup`, `findMarkerBounds`), Offline-Projektion (`placeOnOfflinePlane`) | Kernlogik-Typen | Gruppierungsverfahren |
| `src/lib/ui` | reine Bedienlogik: Rastpunkte des Bottom Sheets (`sheet-snap`), Fokusfalle (`findTrapTarget`) | nichts | Berechnung |
| `EventRepository` / `AuthGateway` | Verträge für Treffen bzw. Anmeldung | Kernlogik-Typen | Speicherort |
| `LocalEventRepository`, `LocalAuthGateway`, `LocalSession` | Demo-Modus: Treffen nur im Arbeitsspeicher (Neuladen = Ausgangszustand, ADR-0010), Demo-Konten und Sitzung in `localStorage`, Demopersonen | Kernlogik | Speicherschlüssel, JSON-Format |
| `SupabaseEventRepository`, `SupabaseAuthGateway` | Supabase-Modus: Abfragen, RPC-Aufrufe, Abbildung Zeile ↔ `SportEvent` (`event-row-mapping`), Fehlercode → deutsche Meldung (`supabase-error-translation`) | Kernlogik, `@supabase/supabase-js` | Tabellen-/Spaltennamen, SQL-Fehlercodes |
| `data-services` | Wahl lokal/Supabase anhand der Umgebungsvariablen; eine Instanz je Browser | beide Umsetzungen | Konfiguration |
| Supabase (extern) | Konten, Sitzungen, Daten, RLS, atomare Fachoperationen | – | Passwörter, Sperren, Rechte |

## Schnittstellen
Was ein Baustein anderen anbietet. Alles andere ist intern.

### EventRepository (`src/lib/data/event-repository.ts`)
Stand: so vom Datenzugriffs-Agenten am 23.11.2026 angelegt; Vor-/Nachbedingungen hier verbindlich ergänzt.
Alle Methoden asynchron. Fachfehler: `EventError` mit deutscher Meldung (optional `field`);
technische Fehler (Netz, unerwartet): `Error`.

| Funktion (Signatur) | Vorbedingung | Nachbedingung | Fehlerfälle (SQL-Code → Meldung) |
| --- | --- | --- | --- |
| `getCurrentUserId(): Promise<string \| null>` | – | Kennung der angemeldeten Person oder `null` (Gast) | Netzfehler → `Error` |
| `listEvents(filters?: EventFilters): Promise<SportEvent[]>` | – | Treffer nach `searchEvents` (ADR-0009), aufsteigend nach Beginn; ohne `mine`: nur veröffentlichte, noch nicht begonnene | Netzfehler → `Error` |
| `getEvent(eventId: string): Promise<SportEvent \| null>` | – | Treffen oder `null`, wenn unbekannt; auch abgesagte | Netzfehler → `Error` |
| `createEvent(input: EventInput): Promise<SportEvent>` | angemeldet; `input` erfüllt `validateEventInput` | neues Treffen `published`, Organisator = aktuelle Person, Belegung 1 | `AUTH_REQUIRED` → "Bitte zuerst anmelden."; `PROFILE_MISSING` → "Profil fehlt. Bitte neu anmelden."; `START_IN_PAST` → "Der Termin muss in der Zukunft liegen." (field `startsAt`); `INVALID_INPUT` (detail = Constraint) → Feldmeldung aus `event-validation` |
| `joinEvent(eventId: string): Promise<SportEvent>` | angemeldet | Person ist Teilnehmende; bereits dabei → unverändert (idempotent); Belegung ≤ Kapazität | `AUTH_REQUIRED`; `EVENT_NOT_FOUND` → "Dieses Treffen gibt es nicht."; `EVENT_CANCELLED` → "Das Treffen ist abgesagt."; `EVENT_STARTED` → "Das Treffen hat bereits begonnen."; `EVENT_FULL` → "Ausgebucht" |
| `leaveEvent(eventId: string): Promise<SportEvent>` | angemeldet, nicht Organisator | Person ist nicht mehr Teilnehmende; war nicht dabei → unverändert | `AUTH_REQUIRED`; `EVENT_NOT_FOUND`; `ORGANIZER_CANNOT_LEAVE` → "Als organisierende Person kannst du das gesamte Treffen absagen."; `EVENT_CANCELLED`; `EVENT_STARTED` |
| `cancelEvent(eventId: string): Promise<SportEvent>` | angemeldet, Organisator | Status `cancelled` (endgültig); bereits abgesagt → unverändert | `AUTH_REQUIRED`; `EVENT_NOT_FOUND`; `NOT_ORGANIZER` → "Nur die organisierende Person darf das Treffen absagen."; `EVENT_STARTED` |

`listParticipants(eventId): Promise<ParticipantEntry[]>` (umgesetzt in beiden Repositories): Namen nur für Mitglieder, sonst
leere Liste (Supabase: RPC `list_event_participants`, `NOT_PARTICIPANT` → leere Liste). Die Wahl einer Demoperson liegt beim
`AuthGateway` (`listDemoAccounts`, `signInAsDemo`; im Supabase-Modus ohne Demo-Konten). Die Meldung zu `EVENT_FULL` lautet
„Leider gerade ausgebucht.“; `INVALID_INPUT` mit `events_max_duration` ergibt die Meldung zur Höchstdauer (BUG-04).

### Kernlogik (`src/lib/events`, Auswahl)
| Modul | Funktion | Zweck | Fehlerfälle |
| --- | --- | --- | --- |
| event-validation | `findEventInputError(input, now): EventError \| null`, `validateEventInput(input, now): void`, `describeFieldRule(field)` | erstes ungültiges Feld in Formularreihenfolge; Dauer höchstens 12 h | wirft `EventError` (nur `validate…`) |
| event-search | `searchEvents(events, filters, now): SportEvent[]`, `toBerlinDay(moment)`, `buildCalendarWindow(now)` | Filtern/Sortieren, Kalendertag Berlin | `RangeError` bei ungültigem Datum |
| participation | `checkJoinAvailability(event, now)`, `addParticipant`, `removeParticipant`, `cancelEvent` | Vorabprüfung für Knopf; Regeln im Demo-Modus | `EventError` |
| event-creation | `createEvent(input, organizer, eventId, now): StoredEvent` | neues Treffen, Organisator nimmt teil | `EventError` |
| event-presentation | `summarizePlaces`, `describeAgeGroup`, `describeEventStatus`, `describeCost`, `describeBringAlong`, `formatEventSchedule`, `describeDayLabel`, `countMissingParticipants` | Anzeigetexte („5 von 10 Plätzen frei“, „Alter: offen für alle“, „… 17:00–19:00 Uhr · 2 Std.“, „Heute“) | `RangeError` bei ungültigem Datum (Termin, Tagesangabe) |
| viewer-events, list-order, failure-message | `splitViewerEvents`, `orderEventCards`, `describeActionFailure` | Meine Treffen/Profilzähler, „Ausgebuchte zuletzt“, Fehlertexte nie roh | wirft nicht |

### Supabase-RPC (Postgres-Funktionen, `supabase/migrations/0001_initial_schema.sql`)
Alle `security definer`, `set search_path = ''`, nur `authenticated` darf ausführen, Identität aus `auth.uid()`.

| Funktion | Rückgabe | Fehlercodes |
| --- | --- | --- |
| `create_event(p_sport text, p_title text, p_meeting_point text, p_latitude float8, p_longitude float8, p_starts_at timestamptz, p_ends_at timestamptz, p_capacity int, p_min_participants int = 2, p_level text = 'Alle Niveaus', p_age_group text = '', p_description text = '', p_location_name text = '', p_cost_cents int = 0, p_bring_along text = '')` | `events`-Zeile | `AUTH_REQUIRED`, `PROFILE_MISSING`, `START_IN_PAST`, `INVALID_INPUT` (detail: Constraint-Name) |
| `join_event(p_event_id uuid)` | `events`-Zeile | `AUTH_REQUIRED`, `PROFILE_MISSING`, `EVENT_NOT_FOUND`, `EVENT_CANCELLED`, `EVENT_STARTED`, `EVENT_FULL` |
| `leave_event(p_event_id uuid)` | `events`-Zeile | `AUTH_REQUIRED`, `PROFILE_MISSING`, `EVENT_NOT_FOUND`, `ORGANIZER_CANNOT_LEAVE`, `EVENT_CANCELLED`, `EVENT_STARTED` |
| `cancel_event(p_event_id uuid)` | `events`-Zeile | `AUTH_REQUIRED`, `PROFILE_MISSING`, `EVENT_NOT_FOUND`, `NOT_ORGANIZER`, `EVENT_STARTED` |
| `list_event_participants(p_event_id uuid)` | `table(user_id uuid, display_name text, is_organizer boolean)` | `AUTH_REQUIRED`, `PROFILE_MISSING`, `EVENT_NOT_FOUND`, `NOT_PARTICIPANT` |

Fehlerformat: supabase-js liefert `error.message === '<CODE>'` (SQLSTATE `P0001`), bei `INVALID_INPUT`
zusätzlich `error.details`. Unbekannte Codes → allgemeine Meldung "Das hat nicht geklappt. Bitte später
erneut versuchen." Die Abbildung Code → Meldung steht genau einmal in `SupabaseEventRepository`.

## Verhalten

### Treffen suchen (Entdecken)
```mermaid
sequenceDiagram
  actor N as Nutzerin
  participant P as Seite Entdecken
  participant R as EventRepository
  participant S as event-search (Kernlogik)
  participant DB as Supabase (nur Supabase-Modus)
  participant M as Kartenbühne
  participant L as Bottom Sheet
  N->>P: App öffnen
  P->>R: listEvents(filters)
  alt Supabase-Modus
    R->>DB: select events veröffentlicht, Beginn in Zukunft, max. 500
    DB-->>R: Zeilen (RLS: öffentlich lesbar)
    R->>DB: select eigene participations (falls angemeldet)
    DB-->>R: eigene Zeilen
    R->>R: Zeilen auf SportEvent abbilden
  else Lokaler Modus
    R->>R: Treffen aus dem Arbeitsspeicher lesen (ADR-0010)
  end
  R->>S: searchEvents(events, filters, userId, now)
  S-->>R: gefilterte, sortierte Treffer
  R-->>P: SportEvent[]
  par gleiche Treffer an beide Ansichten
    P->>M: Marker setzen, überlappende zu Gruppen mit Anzahl (marker-grouping)
  and
    P->>L: Liste "12 Treffen in der Nähe"
  end
  N->>L: Sportart-Chip wählen
  L->>P: filters geändert
  P->>R: listEvents(neue filters)
  Note over P,L: Auswahl eines Treffens: Sheet zeigt Detail, Karte fliegt zum Treffpunkt
```

### Treffen erstellen
```mermaid
sequenceDiagram
  actor O as Organisator
  participant F as Erstellen-Assistent
  participant V as event-validation
  participant R as EventRepository
  participant DB as Supabase create_event
  O->>F: Schritt 1-3 ausfüllen
  F->>V: findEventInputError(input, now) je Feld
  V-->>F: null oder EventError(field)
  F-->>O: Fehler direkt am Feld
  O->>F: Veröffentlichen
  F->>R: createEvent(input)
  alt Supabase-Modus
    R->>DB: rpc create_event(...)
    DB->>DB: auth.uid() und Profil prüfen, Start in Zukunft
    DB->>DB: insert events (Constraints), insert participations (Organisator)
    DB->>DB: Trigger: participant_count = 1
    DB-->>R: events-Zeile
  else Lokaler Modus
    R->>R: createEvent aus Kernlogik, im Arbeitsspeicher ablegen
  end
  R-->>F: SportEvent
  F-->>O: Detailansicht, Karte fliegt zum Treffpunkt
  Note over R,DB: Fehlercode, z. B. START_IN_PAST, wird zu EventError mit field
```

### Teilnehmen inkl. Konkurrenzfall "letzter Platz"
```mermaid
sequenceDiagram
  actor A as Person A
  actor B as Person B
  participant RA as Repository (Browser A)
  participant RB as Repository (Browser B)
  participant DB as Postgres join_event
  Note over A,B: Treffen 7 von 8 belegt, beide sehen "Noch 1 Platz"
  par gleichzeitig
    A->>RA: Teilnehmen
    RA->>DB: rpc join_event(id) mit JWT A
  and
    B->>RB: Teilnehmen
    RB->>DB: rpc join_event(id) mit JWT B
  end
  DB->>DB: Transaktion A: select events for update (Sperre erhalten)
  DB->>DB: Transaktion B: select events for update (wartet auf A)
  DB->>DB: A: Status, Beginn, nicht schon dabei, 7 von 8 belegt
  DB->>DB: A: insert participations, Trigger participant_count = 8
  DB-->>RA: events-Zeile (8 von 8), Commit, Sperre frei
  RA-->>A: "Du bist dabei", Zähler zählt hoch
  DB->>DB: B: liest neuen Stand 8 von 8
  DB-->>RB: Fehler EVENT_FULL
  RB-->>B: EventError "Leider gerade ausgebucht.", Liste neu laden
  Note over DB: Zweites Netz: Check events_not_overbooked verhindert Überbuchung auch bei Codefehler
```

### Anmeldung (Supabase-Modus; Demo-Modus: Demoperson wählen)
```mermaid
sequenceDiagram
  actor N as Nutzer
  participant P as Seite Anmelden
  participant G as AuthGateway
  participant SA as Supabase Auth
  participant DB as Postgres
  alt Registrieren
    N->>P: Anzeigename, E-Mail, Passwort
    P->>G: signUp(email, password, displayName)
    G->>SA: auth.signUp mit options.data.display_name
    SA->>DB: insert auth.users
    DB->>DB: Trigger on_auth_user_created: insert profiles
    SA-->>G: Sitzung (E-Mail-Bestätigung für Demo aus)
  else Anmelden
    N->>P: E-Mail, Passwort
    P->>G: signIn(email, password)
    G->>SA: auth.signInWithPassword
    SA-->>G: Sitzung mit JWT oder Fehler
  end
  G-->>P: aktuelle Person oder Meldung "E-Mail oder Passwort falsch"
  P-->>N: zurück zur vorherigen Ansicht (z. B. Teilnehmen)
  Note over G,SA: JWT liegt im Browser, supabase-js sendet es bei jeder Anfrage mit
```

### Zustände eines Treffens
Gespeichert sind nur `published` und `cancelled`. Alle anderen Zustände leitet `event-presentation`
aus Zeit, Belegung und Mindestzahl ab (keine doppelte Speicherung, P3 ADR-07).

```mermaid
stateDiagram-v2
  [*] --> Veroeffentlicht: create_event (Organisator nimmt teil)
  state Veroeffentlicht {
    [*] --> SuchtMitspieler
    SuchtMitspieler --> FindetStatt: Belegung erreicht Mindestzahl
    FindetStatt --> SuchtMitspieler: Abmeldung, Belegung unter Mindestzahl
    FindetStatt --> Ausgebucht: Belegung = Kapazität
    Ausgebucht --> FindetStatt: Abmeldung
  }
  Veroeffentlicht --> Abgesagt: cancel_event vor Beginn (nur Organisator)
  Veroeffentlicht --> Laeuft: Beginn erreicht
  Laeuft --> Beendet: Ende erreicht
  Abgesagt --> [*]
  Beendet --> [*]
  note right of Veroeffentlicht
    Teilnehmen und Abmelden nur hier
    Suche zeigt nur noch nicht begonnene Treffen
  end note
```

## Detailentwurf
Typen und Dienste der Kernlogik und des Datenzugriffs. `<<module>>` = Datei mit exportierten Funktionen,
keine Klasse.

```mermaid
classDiagram
  class SportEvent {
    <<type>>
    +id: string
    +organizerId: string
    +organizerName: string
    +status: EventStatus
    +participantCount: number
    +isViewerParticipant: boolean
    +isViewerOrganizer: boolean
    +isDemo: boolean
  }
  class EventInput {
    <<type>>
    +title, sport, locationName, meetingPoint
    +latitude, longitude, startsAt, endsAt
    +capacity, minParticipants, level, ageGroup
    +costCents, bringAlong, description
  }
  class StoredEvent {
    <<type>>
    +members: EventMember[]
  }
  class EventFilters {
    +query: string
    +sports: Sport[]
    +level: string
    +ageGroup: string
    +period: PeriodFilter
    +date: string
    +mine: boolean
  }
  class EventError {
    +message: string
    +field: keyof EventInput
  }
  class EventRepository {
    <<interface>>
    +getCurrentUserId() Promise~string or null~
    +listEvents(filters) Promise~SportEvent[]~
    +getEvent(eventId) Promise~SportEvent or null~
    +createEvent(input) Promise~SportEvent~
    +joinEvent(eventId) Promise~SportEvent~
    +leaveEvent(eventId) Promise~SportEvent~
    +cancelEvent(eventId) Promise~SportEvent~
    +listParticipants(eventId) Promise~ParticipantEntry[]~
  }
  class AuthGateway {
    <<interface>>
    +getCurrentUser() Promise~AuthUser or null~
    +signUp(input) Promise~AuthUser~
    +signIn(input) Promise~AuthUser~
    +signOut() Promise~void~
    +onAuthChange(listener) Unsubscribe
    +listDemoAccounts() AuthUser[]
    +signInAsDemo(userId) Promise~AuthUser~
  }
  class LocalEventRepository {
    -storage: KeyValueStorage im Arbeitsspeicher
    -session: LocalSession
    -now: Clock
  }
  class LocalAuthGateway {
    -storage: KeyValueStorage in localStorage
    -session: LocalSession
  }
  class LocalSession {
    +getUser() AuthUser or null
    +setUser(user)
    +subscribe(listener)
  }
  class SupabaseEventRepository {
    -client: SupabaseClient
  }
  class SupabaseAuthGateway {
    -client: SupabaseClient
  }
  class DataServices {
    <<module data-services>>
    +createDataServices() DataServices
    +buildDataServices(environment, persistent) DataServices
  }
  class EventRowMapping {
    <<module>>
    +mapEventRow(row, viewer) SportEvent
  }
  class ErrorTranslation {
    <<module supabase-error-translation>>
    +translateEventError(error) EventError
  }
  class EventValidation {
    <<module>>
    +findEventInputError(input, now) EventError or null
    +validateEventInput(input, now) void
  }
  class EventSearch {
    <<module>>
    +searchEvents(events, filters, now) SportEvent[]
    +buildCalendarWindow(now) CalendarWindow
  }
  class Participation {
    <<module>>
    +checkJoinAvailability(event, now) JoinAvailability
    +addParticipant(event, member, now) StoredEvent
    +removeParticipant(event, userId, now) StoredEvent
    +cancelEvent(event, userId, now) StoredEvent
  }
  class EventPresentation {
    <<module>>
    +summarizePlaces(event) PlaceSummary
    +formatEventSchedule(startsAt, endsAt) string
    +describeDayLabel(iso, now) string
  }
  class MarkerGrouping {
    <<module src/lib/map>>
    +groupOverlappingMarkers(markers, box) MarkerGroup[]
    +canSpreadGroup(members) boolean
    +placeOnOfflinePlane(points, size) ScreenPosition[]
  }
  SportEvent --|> EventInput
  StoredEvent --|> EventInput
  EventRepository <|.. LocalEventRepository
  EventRepository <|.. SupabaseEventRepository
  AuthGateway <|.. LocalAuthGateway
  AuthGateway <|.. SupabaseAuthGateway
  LocalEventRepository --> LocalSession
  LocalAuthGateway --> LocalSession
  DataServices ..> LocalEventRepository : erzeugt
  DataServices ..> SupabaseEventRepository : erzeugt
  LocalEventRepository ..> Participation
  LocalEventRepository ..> EventSearch
  SupabaseEventRepository ..> EventSearch
  SupabaseEventRepository ..> EventRowMapping
  SupabaseEventRepository ..> ErrorTranslation
  ErrorTranslation ..> EventValidation
  EventRepository ..> SportEvent
  EventRepository ..> EventFilters
  Participation ..> EventError
  EventValidation ..> EventError
  EventPresentation ..> SportEvent
  EventPresentation ..> EventSearch
```

Die früher als „nötige Erweiterung“ genannten Felder (`participantCount`, `isViewerParticipant`, `locationName`, `costCents`,
`bringAlong`, `organizerName`, `isDemo`) sind umgesetzt. Teilnehmende stehen nur in `StoredEvent` (lokaler Modus), nie in
`SportEvent`; Namen liefert `listParticipants`.

## Datenmodell
Quelle: `supabase/migrations/0001_initial_schema.sql`. Konten selbst liegen in `auth.users` (Supabase).

```mermaid
erDiagram
  AUTH_USERS ||--|| PROFILES : "hat"
  PROFILES ||--o{ EVENTS : "organisiert (organizer_id, optional bei Demo)"
  PROFILES ||--o{ PARTICIPATIONS : "nimmt teil"
  EVENTS ||--o{ PARTICIPATIONS : "hat"
  AUTH_USERS {
    uuid id PK
    text email
  }
  PROFILES {
    uuid id PK "FK auth.users"
    text display_name
    timestamptz created_at
  }
  EVENTS {
    uuid id PK
    uuid organizer_id FK "null nur bei is_demo"
    text organizer_name "nur Demo"
    boolean is_demo
    text sport
    text title
    text description
    text meeting_point
    text location_name
    float8 latitude
    float8 longitude
    timestamptz starts_at
    timestamptz ends_at
    smallint capacity
    smallint min_participants
    text level
    text age_group
    int cost_cents
    text bring_along
    smallint participant_count "nur Trigger"
    smallint external_participants "nur Demo"
    text status
    timestamptz cancelled_at
    timestamptz created_at
    timestamptz updated_at
  }
  PARTICIPATIONS {
    uuid event_id PK "FK events"
    uuid user_id PK "FK profiles"
    timestamptz joined_at
  }
```

| Entität | Feld | Typ | Regel |
| --- | --- | --- | --- |
| profiles | id | uuid | PK, FK `auth.users`, `on delete cascade` |
| profiles | display_name | text | 2–40 Zeichen (getrimmt); Trigger setzt ihn bei Registrierung |
| events | organizer_id | uuid | FK `profiles`, `on delete cascade`; NULL nur wenn `is_demo` und `organizer_name` gesetzt |
| events | sport | text | `Fußball`, `Volleyball`, `Badminton`, `Basketball`, `Laufen`, `Tischtennis` (wie `event-model.ts`) |
| events | title | text | 3–80 Zeichen |
| events | description | text | ≤ 300 Zeichen, Standard leer |
| events | meeting_point | text | 5–200 Zeichen (Treffpunktbeschreibung) |
| events | location_name | text | ≤ 80 Zeichen, Standard leer (Ortsname für Liste/Marker) |
| events | latitude / longitude | float8 | −90…90 / −180…180 |
| events | starts_at / ends_at | timestamptz | `ends_at > starts_at`, Dauer ≤ 12 h; Start in Zukunft (in `create_event`) |
| events | capacity | smallint | 2–50, inkl. Organisator |
| events | min_participants | smallint | 2…capacity, Standard 2 |
| events | level | text | `Alle Niveaus`, `Anfänger`, `Fortgeschritten`, `Erfahren` |
| events | age_group | text | leer (= alle), `unter 20`, `20–25`, `26–30`, `31–40`, `über 40` |
| events | cost_cents | int | 0–5000, 0 = kostenlos (Migration `0002_cost_limit.sql`, REV-08) |
| events | bring_along | text | ≤ 200 Zeichen |
| events | participant_count | smallint | ≥ 0, nur Trigger schreibt |
| events | external_participants | smallint | ≥ 0, nur Seed (ADR-0008) |
| events | (Tabelle) | – | `participant_count + external_participants <= capacity` |
| events | status / cancelled_at | text / timestamptz | `published`/`cancelled`; `cancelled_at` genau bei `cancelled` gesetzt |
| participations | (event_id, user_id) | uuid, uuid | PK (keine Doppelteilnahme); beide `on delete cascade` |

Indizes: `events(starts_at) where status='published'` (Suche), `events(organizer_id)`,
`participations(user_id)` (Meine Treffen).

## Sicherheitskonzept
Grundsatz: Der Browser ist nicht vertrauenswürdig. Schutz entsteht ausschließlich in Supabase durch
Grants, RLS und geprüfte Funktionen (ADR-0007). Kernlogik im Browser ist nur Bedienhilfe.

| Tabelle | anon | authenticated | Policy / Begründung |
| --- | --- | --- | --- |
| profiles | SELECT | SELECT; UPDATE nur Spalte `display_name` der eigenen Zeile | `profiles_select_all` (Organisatorname öffentlich, keine E-Mail); `profiles_update_own`: `id = auth.uid()` |
| events | SELECT | SELECT | `events_select_all`: Karte ohne Anmeldung. Kein INSERT/UPDATE/DELETE-Recht; nur per RPC |
| participations | – | SELECT eigene Zeilen | `participations_select_own`: `user_id = auth.uid()`. Teilnehmerliste fremder Personen nur per `list_event_participants` (nur Mitglieder) |

Weitere Regeln:
- Tabellenrechte werden in der Migration ausdrücklich entzogen (`revoke all … from anon, authenticated`) und
  nur das Nötige gewährt; Supabase-Standardrechte gelten nicht.
- RPCs: `security definer`, `set search_path = ''`, alle Objekte schemaqualifiziert, Identität nur aus
  `auth.uid()` (nie als Parameter), `EXECUTE` nur für `authenticated`. Hilfs- und Triggerfunktionen im
  Schema `private`, das die Data API nicht freigibt.
- **Demo-Identitäten nie serverseitig:** Demopersonen (`demo-people.ts`) existieren nur im lokalen Modus
  im localStorage. Der Supabase-Modus kennt keine Demopersonen; Seed-Treffen haben kein Konto
  (`organizer_id` NULL, ADR-0008) und sind daher nicht steuerbar. Es gibt keine Demo-Passwörter.
- Kein `service_role`-Schlüssel in der App oder in `NEXT_PUBLIC_*`. Der anon key ist öffentlich (beabsichtigt).
- Passwörter verwaltet Supabase Auth. Mindestlänge in Supabase und Oberfläche gleich (8 oder 12, offen).
- E-Mail-Bestätigung für die Demo aus (`supabase/README.md`), vor echtem Betrieb ein (offen).
- Datenschutz: kein Gerätestandort gespeichert; Kartenkacheln von OpenFreeMap übertragen IP und Ausschnitt
  (Hinweis in der App, offen). Konto löschen kaskadiert auf Profil, eigene Treffen und Teilnahmen.
- Eingaben werden als Text gerendert (React escaped); keine HTML-Einbettung von Nutzertexten.

## Verteilungssicht
```mermaid
flowchart LR
  subgraph Device["Gerät der Nutzerin (Smartphone/Desktop)"]
    Browser["Browser<br/>Next.js-Client-Bundle, MapLibre GL (WebGL)<br/>localStorage: Demo-Modus, Supabase-Sitzung"]
  end
  subgraph Vercel["Vercel"]
    Next["Next.js-Auslieferung<br/>statische Seiten + JS-Bundles<br/>Umgebungsvariablen NEXT_PUBLIC_SUPABASE_*"]
  end
  subgraph Supabase["Supabase (Region EU, Projekt des Teams)"]
    SAuth["Supabase Auth"]
    API["Data API (PostgREST)"]
    PG[("PostgreSQL<br/>Tabellen, RLS, RPC, Trigger")]
  end
  OFM["OpenFreeMap<br/>Stil Positron, Vektorkacheln, Schriften"]
  Browser -->|HTTPS: HTML, JS, CSS| Next
  Browser -->|HTTPS: Anmelden, Token| SAuth
  Browser -->|HTTPS: REST + rpc, JWT| API
  API --> PG
  SAuth --> PG
  Browser -->|HTTPS: Kacheln| OFM
```

Im lokalen Demo-Modus entfallen die Verbindungen zu Supabase; ohne Netz zusätzlich OpenFreeMap
(Fallback "Karte offline"). Vercel führt keine eigene Fachlogik aus.

## Ordnerstruktur
```
src/
  app/                      Routen (App Router): (entdecken)/page.tsx = Entdecken, (entdecken)/treffen/[id]/ = Detail,
                            meine-treffen/, erstellen/, profil/, anmelden/
  components/
    app/                    App-Rahmen, Seitenrahmen, Toasts, app-services (DataServices für die Oberfläche)
    auth/                   Anmelde-/Registrierformular, Rücksprungziel
    create-event/           Erstellen-Assistent (3 Schritte), Entwurf → EventInput
    discover/               Entdecken: Suchleiste, Sportarten-Chips, Filterdialog, Trefferliste, Erstbesuch-Hinweis
    event/                  Trefferkarte, Detailansicht, Teilnehmen-Knopf, Bestätigungsdialog, Belegungsbalken
    map/                    Kartenbühne (MapLibre, Offline-Karte, Marker- und Gruppen-Pillen, Ortswahl), nur Client
    my-events/              Meine Treffen
    navigation/             Tab-Leiste (mobil), Seitenleiste (Desktop)
    profile/                Profil mit Zählern „dabei“ / „organisiert“
    sheet/                  Bottom Sheet mit Rastpunkten
  hooks/                    use-event-list, use-event-detail, use-participation, use-dialog-focus, use-media-query, use-stored-flag
  lib/
    events/                 Kernlogik Treffen (rein): event-model, stored-event, event-validation, event-search,
                            participation, event-creation, event-presentation, list-order, viewer-events,
                            failure-message, event-error, acting-user, demo-events, demo-people
    auth/                   credential-validation, auth-error, auth-user
    map/                    map-theme (Kartenfarben aus Tokens), marker-grouping (Gruppen, Auffächern, Offline-Projektion)
    ui/                     sheet-snap (Rastpunkte), focus-trap (Fokusfalle der Dialoge)
    data/                   Datenzugriff: event-repository und auth-gateway (Schnittstellen), local-event-repository,
                            local-auth-gateway, local-session, key-value-storage, supabase-event-repository,
                            supabase-auth-gateway, supabase-client, event-row-mapping, supabase-error-translation, data-services
e2e/                        Playwright-Akzeptanztests (lokaler Modus, Offline-Karte), 59 Tests × 2 Projekte
tests/integration/          Vitest-Integrationstests (lokal; Supabase nur mit SUPABASE_INTEGRATION=1)
supabase/
  migrations/0001_initial_schema.sql, 0002_cost_limit.sql
  seed.sql
  README.md
docs/decisions/             ADRs 0001–0010
```
Mutation Testing (SE-Eval/Stryker) zielt auf `src/lib/`. `demo-events.ts`/`demo-people.ts` sind Daten
und können dort ausgenommen werden (Vorschlag).

## Entwurfsprinzipien
- **Modularisierung / hohe Kohäsion:** Eine Datei, eine Aufgabe (Validierung, Suche, Teilnahme, Anzeige
  getrennt). UI-Bausteine nach Bildschirmbereich (Karte, Sheet, Erstellen).
- **Information Hiding** (David L. Parnas, "On the Criteria To Be Used in Decomposing Systems into
  Modules", 1972): Speicherort, Tabellen- und Fehlercodes verbirgt das Repository; MapLibre-Details
  verbirgt die Kartenbühne; Sperren und Rechte verbirgt die Datenbank.
- **Lose Kopplung:** Oberfläche kennt nur `EventRepository`; Umschaltung an genau einer Stelle (Factory).
  Kernlogik ohne Abhängigkeiten.
- **Bewusste Abweichungen:** (1) Fachregeln für Teilnahme doppelt in TS und SQL (ADR-0003, ADR-0006),
  abgesichert durch gleiche Fehlerfälle in Vertragstests. (2) Wertelisten doppelt in TS und SQL-Check
  (ADR-0009). (3) Abhängigkeitsrichtung Datenzugriff → Kernlogik (ADR-0003, Freigabe nötig).
  (4) Belegungszähler als gespeicherte Ableitung (ADR-0006).

## Anforderung → Realisierung
Story-IDs aus `docs/backlog.md`, Status nach dem Endlauf vom 23.11.2026.

| Story | Bausteine | Schnittstellen | Daten |
| --- | --- | --- | --- |
| F-05 Liste, F-08 Karte (Marker-Gruppen) | Entdecken, Kartenbühne, Bottom Sheet, `src/lib/map` | `listEvents`, `searchEvents`, `summarizePlaces`, `groupOverlappingMarkers` | events (SELECT anon) |
| F-06/F-07/F-09 Filtern und Suche | Suchleiste, Chips, Filterdialog, event-search | `listEvents(filters)` | events |
| F-12/F-13/F-14 Details | Detail, event-presentation | `getEvent`, `formatEventSchedule`, `describeCost` | events, profiles (Organisatorname) |
| F-17 Treffen erstellen | Erstellen-Assistent, event-validation | `createEvent` → `create_event` | events, participations |
| F-22 Teilnehmen (inkl. letzter Platz) | Teilnehmen-Knopf, `use-participation`, participation | `joinEvent` → `join_event` | participations, events.participant_count |
| F-23 Teilnahme zurückziehen | Detail, Bestätigungsdialog | `leaveEvent` → `leave_event` | participations |
| F-18 Treffen absagen | Detail, Bestätigungsdialog | `cancelEvent` → `cancel_event` | events.status |
| F-01/F-02 Registrieren, anmelden, Gast | Seite Anmelden, `AuthGateway` | `signUp`, `signIn`, `signOut`, `onAuthChange` | auth.users, profiles (Trigger) |
| F-24 Meine Treffen, Profilzähler | Meine Treffen, Profil, viewer-events | `listEvents({ mine: true })`, `splitViewerEvents` | participations (eigene) |
| F-32 Demo-Modus ohne Server | data-services, LocalEventRepository, LocalAuthGateway | `createDataServices`, `signInAsDemo` | Arbeitsspeicher (Treffen), localStorage (Konten, Sitzung) |
| F-20 Teilnehmerliste | Detail | `listParticipants` → `list_event_participants` | participations, profiles |

## Betrieb
- Hosting: Vercel, Produktion https://sportmate-gamma.vercel.app (Supabase-Modus).
- Daten: Supabase-Projekt des Teams (Region EU, Projekt-URL offen). Schema per Migration, Demodaten per
  `supabase/seed.sql` (vor jeder Präsentation erneut ausführen). Anleitung: `supabase/README.md`.
- Auslieferung: Vercel baut bei Merge auf `main` (Einrichtung offen); Preview je Pull Request möglich.
- Ohne `NEXT_PUBLIC_SUPABASE_URL`/`_ANON_KEY` läuft jede Bereitstellung im lokalen Demo-Modus.

## Risiken und offene Punkte
- **Freigaben des Menschen:** Abhängigkeitsrichtung (ADR-0003); Migration und Seed (Rechte/Schema) lesen.
- **SQL angewendet und getestet:** Migrationen `0001` und `0002` laufen auf der Supabase-DB; Integrationslauf mit echter DB
  285/285 (23.11.2026). Menschliches Review der Migrationen steht weiter aus. Kopfkommentar in `0001` nennt noch „nicht
  ausgeführt“ (REV-09).
- **Paralleltest fehlt:** Überbuchungsschutz ist durch Entwurf, Review und sequenziellen Vollstand (Integrationstest) belegt, nicht durch einen automatischen Paralleltest.
- **Ungeprüfte Zeilentypen:** `data as unknown as EventRow` ohne Laufzeitprüfung (REV-13); `organizer_id` für `anon` lesbar (REV-10, Entscheidung offen).
- **Doppelte Regeln TS/SQL:** Abweichungen möglich; Kostenobergrenze angeglichen (Migration `0002`, REV-08), Höchstdauer 12 h jetzt auch in der Kernlogik (BUG-04).
- **Koordinaten der Demotreffen** nicht nachgemessen; vor Demo prüfen (lokal und Seed gleich halten).
- **OpenFreeMap** ohne Verfügbarkeitszusage; Fallback ist Pflicht. Datenschutzhinweis zu Kacheln offen.
- **Supabase kostenloser Tarif:** Pausieren inaktiver Projekte möglich (Grenzen bei Einrichtung prüfen).
- **Passwortlänge** (8 vs. 12) und E-Mail-Bestätigung für echten Betrieb offen.
- **Vision und Qualitätsziele** noch Vorlage; Treiber oben sind Annahmen.
- Zurückgestellt (Stories offen): Treffen bearbeiten, Hinweise/Benachrichtigungen, Umkreissuche/GPS,
  Profile mit Sportarten, Buchungspilot, Bewertungen.
