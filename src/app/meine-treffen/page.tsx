// Route "/meine-treffen": eigene Teilnahmen und organisierte Treffen (F-24).
import type { Metadata } from 'next';
import { PageFrame } from '@/components/app/page-frame';
import { MyEventsView } from '@/components/my-events/my-events-view';

export const metadata: Metadata = { title: 'Meine Treffen' };

export default function MyEventsPage() {
  return (
    <PageFrame>
      <MyEventsView />
    </PageFrame>
  );
}
