// Playwright: E2E-Tests in e2e/ gegen den Entwicklungsserver auf Port 3010, mobil (Pixel 7) und Desktop.
// Lokaler Modus (ohne Supabase-Variablen) und Offline-Karte, damit die Tests ohne Netz laufen.
import { defineConfig, devices } from '@playwright/test';

const port = 3010;
const baseURL = `http://localhost:${port}`;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: { baseURL, trace: 'retain-on-failure', locale: 'de-DE', timezoneId: 'Europe/Berlin' },
  projects: [
    { name: 'Mobile Chrome', use: { ...devices['Pixel 7'] } },
    { name: 'Desktop Chrome', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: `npm run dev -- --port ${port}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: { NEXT_PUBLIC_MAP_MODE: 'offline', NEXT_PUBLIC_SUPABASE_URL: '', NEXT_PUBLIC_SUPABASE_ANON_KEY: '' },
  },
});
