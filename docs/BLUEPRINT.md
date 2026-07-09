# Project Blueprint — Temple Construction Showcase Website

> **This file is the source of truth.** It describes what the project is, how it's built, and the status of every feature. Workflow rule: **before** implementing a feature, add/update its ledger entry (plan + intent); **after** implementing, update the entry (what was actually done, deviations, verification). Decisions with lasting consequences get an ADR in `docs/adr/`.

## What this project is

A white-label static website showcasing the work of a traditional temple/pond construction contractor — Ankit's relative, a traditionally trained builder (guru-parampara lineage, not an engineer), based in coastal Karnataka. The site presents projects, awards, lineage story, services, and testimonials in a modern, minimal, quietly traditional style. The owners manage content themselves through a simple photo-upload form; Ankit manages everything else.

Full approved design: [`docs/superpowers/specs/2026-07-09-temple-website-design.md`](superpowers/specs/2026-07-09-temple-website-design.md)

## Core requirements (from the owner brief)

1. Showcase work — projects with photos; awards section.
2. Modern, minimal, effective; traditional temple feel; **not flashy or boastful**.
3. Mobile friendly (audience browses on phones).
4. Static and stable — no server, no customer login, nothing to maintain.
5. Admin simple enough for non-technical, semi-literate owners: form + photo upload.
6. White-label: easy to change theme, records, and **whose** site it is — one version per relative.
7. Every project field beyond title + one photo is optional and **plug-n-play**: missing data ⇒ block not rendered, never a broken layout.
8. Languages: English primary, Kannada secondary, Tulu/Tamil optional later.

## Architecture (summary)

```
GitHub repo ──push──▶ Cloudflare Pages build ──▶ live static site
     ▲                                                │
     └────── /admin (Sveltia CMS form) ◀── owner's phone
```

- **Astro** static site; content as markdown/YAML + images, validated by zod schemas (content collections).
- **Sveltia CMS** at `/admin` — GitHub-backed form UI, no server of ours.
- **Cloudflare Pages** free hosting; failed builds keep the previous deploy live.
- **White-label** via per-instance `site.config.ts` (name, contacts, theme preset, enabled languages) — see ADR-0005.
- **Themes** as CSS custom-property presets: `stone` (default), `terracotta`, `ink` — see ADR-0006.

See `docs/adr/` for why each of these was chosen and what was rejected.

## Decision index

| ADR | Decision |
|---|---|
| [0001](adr/0001-static-site-with-git-based-cms.md) | Static site + git-based CMS (over Sheets-backend or dynamic CMS) |
| [0002](adr/0002-astro-as-static-site-generator.md) | Astro as the static site generator |
| [0003](adr/0003-sveltia-cms-for-admin.md) | Sveltia CMS for the owner-facing admin |
| [0004](adr/0004-cloudflare-pages-hosting.md) | Cloudflare Pages for hosting |
| [0005](adr/0005-white-label-via-site-config.md) | White-labeling via one config file per instance |
| [0006](adr/0006-theme-presets-css-custom-properties.md) | Themes as CSS custom-property presets |
| [0007](adr/0007-plug-n-play-optional-content-blocks.md) | Plug-n-play optional content blocks |
| [0008](adr/0008-multilingual-static-routes.md) | Multilingual via static routes with English fallback |

## Feature ledger

Statuses: `planned` → `in progress` → `done` (or `dropped`). Update **before** starting (intent/plan) and **after** finishing (outcome, deviations, how verified).

| # | Feature | Status | Notes |
|---|---|---|---|
| F1 | Project scaffold (Astro, content collections, config, CI-ready build) | done | Astro 5.18 project scaffolded: `package.json` (dev/build/preview/check/test/test:smoke scripts), `astro.config.ts`, `tsconfig.json` (extends `astro/tsconfigs/strict`), `site.config.ts` (placeholder `Shri Builders` identity, typed `SiteConfig`/`Lang`/`ThemeName`), `.nvmrc` (20), placeholder `src/pages/index.astro` rendering `{site.name}` (replaced in F3/Task 6). Task 3 added content collections: `src/content.config.ts` defines `projects`/`awards`/`testimonials`/`about`/`services` via the `glob`/`file` loaders (`astro/loaders`) with zod schemas — a project needs only `title` + ≥1 `photos` entry, every other field optional (ADR-0007 layer 1). Sample fixtures under `src/content/`: `projects/sample-temple.md` (maximal, all fields incl. `beforeAfter`, `facts`, links) and `projects/sample-pond.md` (minimal, title + one photo), plus `awards/sample-award.md`, `testimonials/sample-testimonial.md`, `pages/about.md`, `pages/services.yml`. Placeholder SVG images under `_images/` stand in for real photos per instance. Verified: `npm run build` succeeds and `dist/index.html` contains "Shri Builders"; `npm run check` reports 0 errors/warnings/hints; content schemas confirmed working (see 2026-07-09 Task 3 log entry for the negative-test evidence). |
| F2 | Theme system + `stone` preset (layout, header/footer, typography, motifs) | planned | `terracotta`, `ink` presets after |
| F3 | Home page (hero, featured projects, about teaser, awards strip, contact block) | planned | |
| F4 | Projects listing + type filter | planned | |
| F5 | Project detail page (all optional blocks: gallery, description, materials, facts, map, video, before/after) | planned | plug-n-play guarantee, ADR-0007 |
| F6 | Awards page | planned | |
| F7 | About page (lineage story) + testimonials section | planned | |
| F8 | Contact page + sticky mobile call/WhatsApp bar | planned | |
| F9 | Multilingual (EN/KN routes, strings files, fallback) | in progress | Task 2 done: i18n core module shipped — `src/lib/i18n.ts` with EN/KN strings, `t()` (English fallback), `pickText()` (empty/whitespace fields fall back to English), `localePath()`, `otherLangs()`; 6 unit tests passing (`tests/i18n.test.ts`). EN/KN static routing (consuming this module in pages/layouts) lands in Tasks 5+, so F9 stays `in progress`. |
| F10 | Sveltia CMS admin (`/admin`, collections, bilingual labels) | planned | ADR-0003 |
| F11 | Image pipeline (compression, responsive sizes, dimensions) | planned | |
| F12 | 404 page, meta/OG tags | planned | |
| F13 | Smoke tests (minimal + maximal fixture projects) + schema tests | planned | verifies req. 7 |
| F14 | Deployment (Cloudflare Pages, first instance) | planned | |
| F15 | Owner onboarding (phone login setup, bookmark, walkthrough) | planned | non-code |

## Work log

- **2026-07-09** — Brainstormed and approved design (theme direction "Warm Stone" chosen from 3 mockups; project detail blocks approved incl. optional video + before/after). Spec committed. ADRs and this blueprint created. No code yet.
- **2026-07-09** — Task 1 (F1): Scaffolded Astro 5 project skeleton — `package.json`, `astro.config.ts`, `tsconfig.json`, `site.config.ts`, placeholder `src/pages/index.astro`, `.nvmrc`; added `.astro/` to `.gitignore`. Installed `astro@^5`, `typescript`, `@astrojs/check`, `vitest@^3`. Verified with `npm run build && npm run check` (build succeeds, `dist/index.html` contains "Shri Builders", check reports 0 errors).
- **2026-07-09** — Task 2 (F9 core): TDD'd the i18n strings module. Wrote `vitest.config.ts` and `tests/i18n.test.ts` first, confirmed RED (`Cannot find module '../src/lib/i18n'`), then implemented `src/lib/i18n.ts` (EN + KN string tables, `t()` with English fallback for missing langs/keys, `pickText()` for CMS-entry bilingual fields, `localePath()`, `otherLangs()`). Confirmed GREEN: `npm test` → 6/6 passing (includes a regression test that a blank preferred-language field falls back to English); `npm run check` → 0 errors/warnings/hints.
- **2026-07-09** — Task 3 (F1 content layer): Added `src/content.config.ts` with zod schemas for `projects`, `awards`, `testimonials`, `about`, `services` (Astro 5 `glob`/`file` loaders from `astro/loaders`, matching the current installed astro@5.18.2 API exactly — no version-drift adjustments needed). Added sample content and placeholder SVG images: `projects/sample-temple.md` (maximal fixture, every optional field populated) and `projects/sample-pond.md` (minimal fixture, title + one photo only) prove ADR-0007's "title + 1 photo is the only requirement" contract; also `awards/sample-award.md`, `testimonials/sample-testimonial.md`, `pages/about.md`, `pages/services.yml`. Verified `npm run build && npm run check` pass clean. Performed the manual negative test required by ADR-0007 layer 1: set `year: "twenty21"` in `sample-pond.md` → `npm run build` failed (exit 1) with `[InvalidContentEntryDataError] projects → sample-pond data does not match collection schema. year: Expected type "number", received "string"`, naming both the file and field; reverted the edit → build passed again (exit 0), `npm run check` still 0 errors/warnings/hints, `npm test` still 6/6. F1 stays `done` (content-collections portion now complete); lays the foundation for F13 (smoke tests), not yet started.
