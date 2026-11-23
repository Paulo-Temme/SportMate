# ADR-0010: Demo-Modus hält Treffen nur im Arbeitsspeicher, Produktion nutzt Supabase

Status: vorgeschlagen · Datum: 2026-11-23 · Rolle: coder (im Auftrag des Orchestrators)

## Kontext
ADR-0003 sah für den lokalen Demo-Modus vor, Treffen in `localStorage` zu halten. Bei Präsentationen und
Nutzertests sollen aber alle Teilnehmenden denselben Ausgangszustand sehen: Wer ein Treffen erstellt, beitritt
oder absagt, soll nach dem Neuladen wieder die Beispieldaten vorfinden (F-32 AK3). Gespeicherte Zustände aus
früheren Sitzungen würden sonst jede Vorführung mit einem anderen Stand beginnen lassen.
Gleichzeitig ist die echte App (Vercel-Deployment) mit Supabase verbunden und muss dauerhaft speichern.

## Entscheidung
- Im lokalen Modus (keine Supabase-Umgebungsvariablen) liegen Treffen und Teilnahmen nur im Arbeitsspeicher
  (`createMemoryStorage()` in `src/lib/data/data-services.ts`). Neuladen stellt die Beispieldaten wieder her.
- Demo-Konten und die Sitzung (wer angemeldet ist) liegen weiter im `localStorage`, damit die Anmeldung einen
  Seitenwechsel und ein Neuladen übersteht.
- Die Oberfläche sagt das offen: Banner "Demo-Modus – Beispieldaten, Änderungen gehen beim Neuladen verloren".
- Produktion nutzt ausschließlich Supabase (ADR-0002, ADR-0003); dort gibt es weder Banner noch Demo-Personen.

## Alternativen
| Alternative | Vorteil | Warum nicht |
| --- | --- | --- |
| Treffen in `localStorage` (ursprünglich ADR-0003) | Änderungen bleiben im Browser erhalten | jede Vorführung beginnt mit anderem Stand; Tests brauchen Aufräumschritte |
| `sessionStorage` | übersteht Neuladen im selben Tab | Verhalten je Tab schwer zu erklären; Ausgangszustand für Tests trotzdem unklar |
| Demo ebenfalls gegen Supabase (eigenes Demo-Projekt) | ein Datenpfad | Demo hängt von Netz und Dienst ab, widerspricht Qualitätsziel 5 (docs/architecture.md) |

## Konsequenzen
- Positiv: reproduzierbare Vorführungen und E2E-Tests ohne Aufräumen.
- Negativ: Im Demo-Modus erstellte Treffen gehen beim Neuladen verloren; das Banner muss das deutlich sagen.
- Präzisiert ADR-0003 (Speicherort im Demo-Modus). `docs/architecture.md` nennt beim `LocalEventRepository`
  noch `localStorage` und sollte vom architect angepasst werden (offen).
- Neu prüfen, wenn Nutzertests zeigen, dass Personen im Demo-Modus eigene Treffen über ein Neuladen hinweg brauchen.
