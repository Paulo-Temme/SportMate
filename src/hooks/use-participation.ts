'use client';
// Teilnehmen, Zurückziehen und Absagen mit Rückmeldung; Gäste werden zur Anmeldung mit Rücksprung geführt (F-02, F-18, F-22, F-23).
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { useAppServices } from '@/components/app/app-services';
import { useToast } from '@/components/app/toast-provider';
import { describeActionFailure } from '@/lib/events/failure-message';
import type { SportEvent } from '@/lib/events/event-model';

type ParticipationAction = 'join' | 'leave' | 'cancel';

const successMessages: Record<ParticipationAction, string> = {
  join: 'Du bist dabei',
  leave: 'Du bist nicht mehr dabei',
  cancel: 'Treffen abgesagt',
};

/**
 * Liefert Aktionen rund um die Teilnahme. Jede Aktion meldet Erfolg oder Fehler als Toast und lädt Listen neu.
 * Rückgabe: `join`, `leave`, `cancel` (je mit Treffen) und die Kennung des gerade laufenden Treffens.
 * Feature: F-22
 */
export function useParticipation() {
  const { events, user, notifyDataChanged } = useAppServices();
  const showToast = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const [pendingId, setPendingId] = useState<string | null>(null);

  const run = useCallback(
    async (action: ParticipationAction, event: SportEvent) => {
      if (pendingId) return false;
      setPendingId(event.id);
      try {
        if (action === 'join') await events.joinEvent(event.id);
        if (action === 'leave') await events.leaveEvent(event.id);
        if (action === 'cancel') await events.cancelEvent(event.id);
        showToast(successMessages[action]);
        notifyDataChanged();
        return true;
      } catch (error) {
        showToast(describeActionFailure(error), 'error');
        notifyDataChanged();
        return false;
      } finally {
        setPendingId(null);
      }
    },
    [events, notifyDataChanged, pendingId, showToast],
  );

  const join = useCallback(
    (event: SportEvent) => {
      if (!user) {
        const back = pathname?.startsWith('/treffen/') ? pathname : `/treffen/${event.id}`;
        router.push(`/anmelden?weiter=${encodeURIComponent(back)}`);
        return Promise.resolve(false);
      }
      return run('join', event);
    },
    [pathname, router, run, user],
  );

  return {
    join,
    leave: (event: SportEvent) => run('leave', event),
    cancel: (event: SportEvent) => run('cancel', event),
    pendingId,
  };
}
