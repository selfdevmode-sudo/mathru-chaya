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
| F1 | Project scaffold (Astro, content collections, config, CI-ready build) | planned | |
| F2 | Theme system + `stone` preset (layout, header/footer, typography, motifs) | planned | `terracotta`, `ink` presets after |
| F3 | Home page (hero, featured projects, about teaser, awards strip, contact block) | planned | |
| F4 | Projects listing + type filter | planned | |
| F5 | Project detail page (all optional blocks: gallery, description, materials, facts, map, video, before/after) | planned | plug-n-play guarantee, ADR-0007 |
| F6 | Awards page | planned | |
| F7 | About page (lineage story) + testimonials section | planned | |
| F8 | Contact page + sticky mobile call/WhatsApp bar | planned | |
| F9 | Multilingual (EN/KN routes, strings files, fallback) | planned | ADR-0008 |
| F10 | Sveltia CMS admin (`/admin`, collections, bilingual labels) | planned | ADR-0003 |
| F11 | Image pipeline (compression, responsive sizes, dimensions) | planned | |
| F12 | 404 page, meta/OG tags | planned | |
| F13 | Smoke tests (minimal + maximal fixture projects) + schema tests | planned | verifies req. 7 |
| F14 | Deployment (Cloudflare Pages, first instance) | planned | |
| F15 | Owner onboarding (phone login setup, bookmark, walkthrough) | planned | non-code |

## Work log

- **2026-07-09** — Brainstormed and approved design (theme direction "Warm Stone" chosen from 3 mockups; project detail blocks approved incl. optional video + before/after). Spec committed. ADRs and this blueprint created. No code yet.
