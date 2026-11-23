// Wurzellayout: Sprache, Schrift Schibsted Grotesk und globale Design-Tokens für alle Seiten (F-00).
import type { Metadata, Viewport } from 'next';
import { Schibsted_Grotesk } from 'next/font/google';
import './globals.css';

const schibstedGrotesk = Schibsted_Grotesk({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SportMate',
  description: 'Sportpartnerinnen und Sportpartner in der Nähe finden.',
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
      <body>{children}</body>
    </html>
  );
}
