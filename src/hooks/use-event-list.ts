'use client';
// Lädt die Trefferliste zu den Filtern, ausgebuchte Treffen zuletzt; Karte und Liste nutzen dieselbe Liste (F-05, F-08).
import { useEffect, useState } from 'react';
import { useAppServices } from '@/components/app/app-services';
import type { EventFilters, SportEvent } from '@/lib/events/event-model';
import { orderEventCards } from '@/lib/events/list-order';

/** Ladezustand einer Trefferliste. */
export type EventListState = { status: 'loading' | 'ready' | 'error'; events: SportEvent[] };

/**
 * Lädt Treffen passend zu den Filtern und lädt nach jeder Datenänderung neu.
 * Eingaben: Filter, Reihenfolge (Standard: ausgebuchte zuletzt). Rückgabe: Zustand mit Liste.
 * Feature: F-05
 */
export function useEventList(filters: EventFilters, order: 'available-first' | 'chronological' = 'available-first'): EventListState {
  const { events, dataVersion } = useAppServices();
  const [state, setState] = useState<EventListState>({ status: 'loading', events: [] });

  useEffect(() => {
    let active = true;
    events
      .listEvents(filters)
      .then((list) => active && setState({ status: 'ready', events: orderEventCards(list, order) }))
      .catch(() => active && setState((current) => ({ status: 'error', events: current.events })));
    return () => {
      active = false;
    };
  }, [events, filters, order, dataVersion]);

  return state;
}
