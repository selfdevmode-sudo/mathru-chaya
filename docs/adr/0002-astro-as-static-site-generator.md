# ADR-0002: Astro as static site generator

**Status:** Accepted (2026-07-09)

## Context

Need a static site generator that outputs plain, fast HTML/CSS for cheap phones and weak connections, validates content at build time, and supports multiple languages and an image pipeline without custom plumbing.

## Decision

Use **Astro** with content collections.

## Reasons

- **Zero JS by default** — output is plain HTML/CSS; JS is opt-in per component. Matches the "stable, fast on mobile" requirement directly.
- **Content collections with zod schemas** — build-time validation of every project/award file with clear error messages; the backbone of the plug-n-play guarantee (ADR-0007).
- **Built-in image optimization** — compression + responsive sizes without extra tooling (feature F11).
- **First-class i18n routing** for `/kn/...` pages (ADR-0008).
- Mature, widely used, well documented — safe bet for a project meant to last years untouched.

## Alternatives considered

1. **Eleventy** — similarly lightweight, but schema validation, image pipeline, and i18n all require assembling plugins; more custom glue to maintain. Rejected.
2. **Next.js / Nuxt static export** — heavier framework, ships more JS, framework churn risk over the years; overkill with no dynamic needs. Rejected.
3. **Hand-written HTML** — no build validation, no templating across 15+ pages, painful multilingual duplication. Rejected.

## Consequences

- Build step requires Node at build time only (on Cloudflare Pages); the served site has no runtime dependencies.
- Templates are `.astro` components; contributors need minimal Astro knowledge (it's HTML-like).
