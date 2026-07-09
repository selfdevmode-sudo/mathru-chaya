import { defineConfig } from 'vitest/config';
// Smoke tests only — reads dist/, so it must run AFTER `astro build`.
// Invoked via `npm run test:smoke`, never picked up by the default `npm test`.
export default defineConfig({ test: { include: ['tests/smoke.test.ts'] } });
