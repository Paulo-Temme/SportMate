# Protokoll F-32

## 2026-11-23 · coder (Datenschicht)
- Geänderte Dateien: `src/lib/data/local-event-repository.ts`, `local-auth-gateway.ts`, `local-session.ts`, `key-value-storage.ts`, `data-services.ts`, `src/lib/events/demo-events.ts` (Ortsname, Kosten, Mitbringen, „Anfänger willkommen“, `isDemo`).
- Entscheidung: lokale Treffen liegen nur im Arbeitsspeicher (Neuladen = Ausgangszustand, AK3); Konten und Sitzung im localStorage (Auftrag). Start als Gast.
- Ausgeführte Befehle und Ergebnis: siehe `specs/F-01/log.md`.
- Versuche: 1.
- Auffälligkeiten / Mensch muss selbst lesen: **Besondere Vorsicht: Login/Rechte – menschliches Review nötig** (lokale Konten mit Passwort-Hash, nur Demo).
