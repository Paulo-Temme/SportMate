// Gemeinsames Layout von Entdecken und Treffen-Details: Karte und Sheet bleiben beim Wechsel bestehen (F-05, F-12).
import { Suspense } from 'react';
import { DiscoverScreen } from '@/components/discover/discover-screen';
import { DiscoverSkeleton } from '@/components/discover/discover-skeleton';

export default function DiscoverLayout({ children }: LayoutProps<'/'>) {
  return (
    <>
      <Suspense fallback={<DiscoverSkeleton />}>
        <DiscoverScreen />
      </Suspense>
      {children}
    </>
  );
}
