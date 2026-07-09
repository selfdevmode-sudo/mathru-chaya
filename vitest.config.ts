import { defineConfig } from 'vitest/config';
// Unit tests only — must always pass on a clean checkout with no `dist/`.
// Smoke tests (tests/smoke.test.ts) read built output and require `astro
// build` first; they're excluded here and run separately via
// `npm run test:smoke`, which points vitest at vitest.smoke.config.ts.
export default defineConfig({ test: { include: ['tests/i18n.test.ts'] } });
