// Route "/": Startseite mit Sportzeile, Kartenvorschau kommender Treffen, drei Schritten, Sportarten und den Einstiegen (F-31).
import type { Metadata } from 'next';
import { LandingPage } from '@/components/landing/landing-page';

export const metadata: Metadata = {
  title: { absolute: 'SportMate – Sporttreffen in deiner Nähe' },
  description: 'Offene Sporttreffen in deiner Nähe finden und mitmachen: Sportart wählen, Treffen finden, dabei sein.',
};

export default function HomePage() {
  return <LandingPage />;
}
