// ESLint: Next.js-Regeln (Core Web Vitals, TypeScript) plus Projektregeln aus docs/coding-standards.md.
import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // Inline-Abschaltungen (eslint-disable) sind verboten und werden ignoriert.
    linterOptions: { noInlineConfig: true, reportUnusedDisableDirectives: 'error' },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/ban-ts-comment': ['error', { 'ts-ignore': true, 'ts-expect-error': true, 'ts-nocheck': true }],
    },
  },
  globalIgnores(['.next/**', 'out/**', 'build/**', 'coverage/**', 'test-results/**', 'playwright-report/**', 'next-env.d.ts']),
]);

export default eslintConfig;
