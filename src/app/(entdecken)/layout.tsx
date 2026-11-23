// Gemeinsames Layout von Entdecken (/entdecken) und Treffen-Details: Karte und Sheet bleiben beim Wechsel bestehen (F-05, F-12).
import { Suspense, type ReactNode } from 'react';
import { DiscoverScreen } from '@/components/discover/discover-screen';
import { DiscoverSkeleton } from '@/components/discover/discover-skeleton';

export default function DiscoverLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Suspense fallback={<DiscoverSkeleton />}>
        <DiscoverScreen />
      </Suspense>
      {children}
    </>
  );
}
