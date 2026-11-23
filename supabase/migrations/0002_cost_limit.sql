-- 0002: Kostenobergrenze an die Kernlogik angleichen (REV-08).
-- TypeScript (event-validation.ts) erlaubt 0–5000 Cent; das Schema erlaubte bisher 0–10000.
-- Besondere Vorsicht: Schemaänderung – vom Orchestrator geprüft und am 23.11.2026 angewendet.
alter table public.events drop constraint if exists events_cost_range;
alter table public.events add constraint events_cost_range check (cost_cents between 0 and 5000);
