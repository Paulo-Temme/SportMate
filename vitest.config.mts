// Vitest: Unit-Tests neben den Dateien (*.test.ts[x]), Integrationstests unter tests/integration/ oder *.int.test.ts[x].
// Komponententests wählen die Browser-Umgebung je Datei mit dem Kopfkommentar "@vitest-environment jsdom".
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.{ts,tsx}', 'tests/integration/**/*.test.{ts,tsx}'],
    exclude: ['node_modules', '.next', 'e2e'],
    coverage: {
      provider: 'v8',
      include: ['src/lib/**/*.{ts,tsx}'],
      exclude: ['src/**/*.test.{ts,tsx}'],
      reporter: ['text', 'html', 'json-summary'],
    },
  },
});
