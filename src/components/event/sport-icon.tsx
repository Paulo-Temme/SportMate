// Neutrales Linien-Icon je Sportart; eigene Zeichnungen im Lucide-Stil, wo Lucide keine passende Form hat (F-05).
import { Feather, Footprints, Volleyball } from 'lucide-react';
import type { SVGProps } from 'react';
import type { Sport } from '@/lib/events/event-model';

type IconProps = { size?: number; className?: string };

function LineIcon({ size = 20, className, children }: IconProps & { children: React.ReactNode }) {
  const props: SVGProps<SVGSVGElement> = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  };
  return (
    <svg {...props} className={className} aria-hidden="true" focusable="false">
      {children}
    </svg>
  );
}

function SoccerIcon(props: IconProps) {
  return (
    <LineIcon {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="m12 7 4.2 3-1.6 5h-5.2l-1.6-5Z" />
      <path d="M12 2v5M16.2 10l5.3-1.7M14.6 15l3.2 4.3M9.4 15l-3.2 4.3M7.8 10 2.5 8.3" />
    </LineIcon>
  );
}

function BasketballIcon(props: IconProps) {
  return (
    <LineIcon {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2v20" />
      <path d="M5 4.9a10 10 0 0 1 0 14.2M19 4.9a10 10 0 0 0 0 14.2" />
    </LineIcon>
  );
}

function TableTennisIcon(props: IconProps) {
  return (
    <LineIcon {...props}>
      <circle cx="10" cy="10" r="7" />
      <path d="m15 15 5.5 5.5" />
      <circle cx="19" cy="5" r="2" />
    </LineIcon>
  );
}

/**
 * Zeigt das Icon einer Sportart. Dekorativ (`aria-hidden`); die Sportart steht immer zusätzlich als Text daneben.
 * Eingaben: Sportart, Größe in Pixeln, optionale CSS-Klasse. Rückgabe: SVG-Element.
 * Feature: F-05
 */
export function SportIcon({ sport, size = 20, className }: IconProps & { sport: Sport }) {
  const shared = { size, className, 'aria-hidden': true, strokeWidth: 2 } as const;
  switch (sport) {
    case 'Volleyball':
      return <Volleyball {...shared} />;
    case 'Laufen':
      return <Footprints {...shared} />;
    case 'Badminton':
      return <Feather {...shared} />;
    case 'Basketball':
      return <BasketballIcon size={size} className={className} />;
    case 'Tischtennis':
      return <TableTennisIcon size={size} className={className} />;
    default:
      return <SoccerIcon size={size} className={className} />;
  }
}
