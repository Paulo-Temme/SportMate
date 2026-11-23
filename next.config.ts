import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // Kein schwebender Entwicklerknopf: er verdeckte mobil den Tab "Entdecken" (Screenshots, E2E-Klicks).
  devIndicators: false,
};

export default nextConfig;
