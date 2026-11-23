'use client';
// Lädt ein Treffen und seine sichtbare Teilnehmerliste; lädt nach jeder Datenänderung neu (F-12, F-20).
import { useEffect, useState } from 'react';
import { useAppServices } from '@/components/app/app-services';
import type { ParticipantEntry, SportEvent } from '@/lib/events/event-model';

/** Ladezustand der Detailansicht. */
export type EventDetailState =
  | { status: 'loading' }
  | { status: 'missing' }
  | { status: 'error' }
  | { status: 'ready'; event: SportEvent; participants: ParticipantEntry[] };

/**
 * Lädt ein Treffen nach Kennung.
 * Eingaben: Kennung. Rückgabe: Zustand; "missing", wenn es das Treffen nicht gibt, "error" bei technischen Fehlern.
 * Feature: F-12
 */
export function useEventDetail(eventId: string): EventDetailState {
  const { events, dataVersion } = useAppServices();
  const [state, setState] = useState<{ id: string; value: EventDetailState }>({ id: eventId, value: { status: 'loading' } });

  useEffect(() => {
    let active = true;
    Promise.all([events.getEvent(eventId), events.listParticipants(eventId)])
      .then(([event, participants]) => {
        if (!active) return;
        setState({ id: eventId, value: event ? { status: 'ready', event, participants } : { status: 'missing' } });
      })
      .catch(() => active && setState({ id: eventId, value: { status: 'error' } }));
    return () => {
      active = false;
    };
  }, [events, eventId, dataVersion]);

  return state.id === eventId ? state.value : { status: 'loading' };
}
