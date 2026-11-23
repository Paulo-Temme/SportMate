// Wurzellayout: Sprache, Schrift Schibsted Grotesk, Metadaten, Dienste und App-Rahmen mit Navigation (F-00, F-05).
import type { Metadata, Viewport } from 'next';
import { Schibsted_Grotesk } from 'next/font/google';
import { AppShell } from '@/components/app/app-shell';
import './globals.css';

const schibstedGrotesk = Schibsted_Grotesk({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: { default: 'SportMate – Sporttreffen in Flensburg', template: '%s · SportMate' },
  description: 'Sporttreffen in Flensburg finden, erstellen und mitmachen – ohne Verein, ohne Gruppenchat.',
  applicationName: 'SportMate',
};

export const viewport: Viewport = {
  themeColor: '#F7F6F2',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="de" className={schibstedGrotesk.variable}>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
