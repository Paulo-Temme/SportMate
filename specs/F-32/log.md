# Protokoll F-32

## 2026-11-23 · coder (Datenschicht)
- Geänderte Dateien: `src/lib/data/local-event-repository.ts`, `local-auth-gateway.ts`, `local-session.ts`, `key-value-storage.ts`, `data-services.ts`, `src/lib/events/demo-events.ts` (Ortsname, Kosten, Mitbringen, „Anfänger willkommen“, `isDemo`).
- Entscheidung: lokale Treffen liegen nur im Arbeitsspeicher (Neuladen = Ausgangszustand, AK3); Konten und Sitzung im localStorage (Auftrag). Start als Gast.
- Ausgeführte Befehle und Ergebnis: siehe `specs/F-01/log.md`.
- Versuche: 1.
- Auffälligkeiten / Mensch muss selbst lesen: **Besondere Vorsicht: Login/Rechte – menschliches Review nötig** (lokale Konten mit Passwort-Hash, nur Demo).

## 2026-11-23 · coder (Nacharbeit)
- `5d0e2bd` Banner „Demo-Modus – Beispieldaten, Änderungen gehen beim Neuladen verloren“ (E2E `F-32 AK1` zuerst umgestellt); ADR-0010 (Demo-Modus hält Treffen nur im Arbeitsspeicher); Tokens `--accent-strong`, `--ok-ink`, `--warn-ink` mit nachgerechneten Kontrasten in `docs/design.md`.
- Offen für architect: `docs/architecture.md` nennt beim `LocalEventRepository` noch localStorage (ADR-0010).
- Gesamtlauf am Ende: `npx tsc --noEmit` 0 Fehler · `npx eslint src e2e tests` 0 Befunde · `npx vitest run` 28 Dateien bestanden, 1 übersprungen; 283 Tests bestanden, 2 übersprungen (Supabase-Integration ohne Zugangsdaten) · `npx playwright test` 117 bestanden, 1 übersprungen (nur-mobil-Test im Desktop-Projekt). E2E lief in einer Kopie des Arbeitsstands auf Port 3040, weil im Repo bereits ein Dev-Server des Orchestrators lief.
