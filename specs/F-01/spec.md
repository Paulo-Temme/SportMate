# F-01: Registrieren, anmelden, abmelden

Epic: E-1 Konto und Anmeldung · Priorität: hoch · Größe: M
Status: Entwurf (Datenschicht) · Freigabe offen

## Story
Als Sportinteressierte möchte ich mich mit E-Mail und Passwort registrieren und anmelden, damit ich Treffen erstellen und ihnen beitreten kann.

## Herkunft
Quelle: DR-1.1.1–3, SM-R01, FB-35 (siehe `docs/backlog.md`).
Stakeholder: Nutzende, Team (Präsentation im Demo-Modus).
Begründung: Teilnehmen und Erstellen brauchen eine Identität; Rechte prüft Supabase anhand des Kontos.

## Szenario
Lea registriert sich mit `lea@example.org`, Passwort `sportmate1` und Anzeigename „Lea“. Sie ist sofort angemeldet.
Später meldet sie sich ab und mit falschem Passwort wieder an; das schlägt mit „E-Mail oder Passwort falsch.“ fehl.

## Akzeptanzkriterien (funktional)
Übernommen aus dem Backlog; hier die Ebene der Datenschicht.
- AK1 (Unit + Integration): Registrierung mit gültigen Daten meldet an (`AuthGateway.signUp` liefert `AuthUser`).
- AK2 (Unit): Passwort `kurz12` → `AuthError` „Mindestens 8 Zeichen.“, kein Konto.
- AK3 (Unit): bestehende E-Mail (auch andere Schreibweise) → „Diese E-Mail wird bereits verwendet.“
- AK4 (Unit): falsches Passwort → „E-Mail oder Passwort falsch.“, Person bleibt Gast.
- AK5 (Unit): `signOut` → Gast; `onAuthChange` meldet `null`.

## Qualitätsanforderungen
- Q1 Sicherheit: Supabase-Modus speichert keine Passwörter in der App; lokal nur SHA-256-Hash mit Salz (Demo, keine Sicherheitsgrenze).

## Randbedingungen
- Mindestlänge 8 (DR-1.1.2), Konflikt F04 (8 oder 12) offen. Anzeigename 2–40 wie `profiles_display_name_length`.

## Nicht enthalten
- Passwort vergessen, E-Mail-Bestätigung (für die Demo aus), Profilbearbeitung (F-03).

## Entwurf
Betroffene Bausteine: `AuthGateway` (neu), `LocalSession`, `data-services`.
Neue Dateien: `src/lib/data/auth-gateway.ts`, `local-auth-gateway.ts`, `supabase-auth-gateway.ts`, `local-session.ts`,
`supabase-client.ts`, `data-services.ts`, `src/lib/auth/auth-error.ts`, `auth-user.ts`, `credential-validation.ts`.
Öffentliche Funktionen: `AuthGateway` (`getCurrentUser`, `signUp`, `signIn`, `signOut`, `onAuthChange`, `listDemoAccounts`,
`signInAsDemo`), `createDataServices(): { events, auth, mode }`, `findSignUpError`, `validateSignUp`, `normalizeEmail`.
Änderungen am Datenmodell: keine (Schema 0001 unverändert).

## Offene Fragen
- Mindestlänge 8 oder 12 (F04).
- Lokale Konten bleiben im localStorage, Treffen nicht (F-32 AK3). Passt das zum Banner „nichts wird gespeichert“?

## Zuordnung Kriterium → Ebene → Test → Datei
| Kriterium | Ebene | Test | Datei |
| --- | --- | --- | --- |
| AK1 | Unit, Integration | `F-01 AK1: Registrierung meldet sofort an`, `F-22 AK1: …` | `src/lib/data/local-auth-gateway.test.ts`, `tests/integration/supabase-event-repository.int.test.ts` |
| AK2 | Unit | `F-01 AK2: …` | `src/lib/auth/credential-validation.test.ts`, `local-auth-gateway.test.ts`, `supabase-gateways.test.ts` |
| AK3 | Unit | `F-01 AK3: …` | `local-auth-gateway.test.ts`, `supabase-error-translation.test.ts`, `supabase-gateways.test.ts` |
| AK4 | Unit | `F-01 AK4: …` | `local-auth-gateway.test.ts`, `supabase-error-translation.test.ts` |
| AK5 | Unit | `F-01 AK5: …` | `local-auth-gateway.test.ts`, `local-session.test.ts` |

## Änderungen
