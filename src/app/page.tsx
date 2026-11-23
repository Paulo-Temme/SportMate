// Route "/": Startseite mit Erklärung, Vorschau kommender Treffen und den Einstiegen Entdecken und Erstellen (F-31).
import type { Metadata } from 'next';
import { LandingPage } from '@/components/landing/landing-page';

export const metadata: Metadata = {
  title: { absolute: 'SportMate – Sporttreffen in Flensburg' },
  description: 'Offene Sporttreffen in Flensburg finden und mitmachen – ohne Verein, ohne Gruppenchat. Stöbern geht ohne Konto.',
};

export default function HomePage() {
  return <LandingPage />;
}
