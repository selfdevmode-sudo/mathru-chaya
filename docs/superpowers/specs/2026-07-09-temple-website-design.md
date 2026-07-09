# Temple Construction Showcase Website — Design

**Date:** 2026-07-09
**Status:** Approved by Ankit (brainstorming session)

## Purpose

A white-label static website that showcases the work of a traditional temple/pond construction contractor (Ankit's relative), with a dead-simple admin so the (non-technical, traditionally trained) owners can add projects and awards themselves. Must be stable, free to run, mobile-friendly, and reusable for other relatives with different names/themes.

Tone: modern, minimal, respectful — not flashy or boastful. The craft and photos do the talking.

## Architecture

- **Static site generator:** Astro. Output is plain HTML/CSS with minimal JS.
- **Content:** Markdown/YAML files + images in the repo (`content/`, `public/images/`), validated via Astro content collections (zod schemas).
- **Admin:** Sveltia CMS served at `/admin` — a form-based UI that commits to the GitHub repo. No server of our own.
- **Hosting:** Cloudflare Pages free tier (auto-build on push). `*.pages.dev` subdomain for now; custom domain later. Failed builds keep the previous deploy live.
- **White-label:** one template codebase. Per-relative site = repo copy with its own `site.config.ts` + `content/`. No code edits needed to rebrand.

```
GitHub repo ──push──▶ Cloudflare Pages build ──▶ live static site
     ▲                                                │
     └────── /admin (Sveltia CMS form) ◀── owner's phone
```

### site.config.ts (per instance)

- Business name, tagline, owner name(s)
- Phone, WhatsApp number, address/region, optional email
- Theme preset name (see Themes)
- Enabled languages (e.g. `["en", "kn"]`)
- Optional logo path (text-based monogram fallback if absent)

## Pages

1. **Home** — hero (name, tagline, CTA "View our work"), featured projects, brief about teaser, awards strip, contact block.
2. **Projects** — grid of all projects, filterable by type (temple / pond-kalyani / gopura / renovation / other).
3. **Project detail** — see content model below; blocks render only when data exists.
4. **About** — lineage/guru-parampara story, years of experience, region.
5. **Awards** — cards: title, given by, year, photo, optional note.
6. **Contact** — click-to-call, WhatsApp deep link, region/address. Sticky call/WhatsApp bar on mobile.
7. **404** — friendly custom page.

Testimonials appear as a section on Home and/or About (not a separate page).

## Content model (all plug-n-play)

**Rule: every field beyond the minimum is optional. A missing field means its block is not rendered — no gaps, no errors.** This is enforced by template guards and verified by smoke tests.

### Project

| Field | Required | Notes |
|---|---|---|
| title | ✅ | |
| photos | ✅ (≥1) | first photo = cover; auto-compressed at build |
| type | – | temple / pond / gopura / renovation / other; drives filter |
| year | – | |
| place | – | town, district |
| builtFor | – | temple trust / committee name |
| description (en) | – | free text |
| description (kn) | – | falls back to English on Kannada pages |
| materials | – | list of chips (laterite, granite, lime mortar…) |
| duration / teamSize / ledBy / status | – | facts grid; grid hides entirely if all empty |
| mapLink | – | Google Maps URL; rendered as link + lightweight preview |
| videoLink | – | YouTube URL, embedded lazily |
| beforeAfter | – | pair of photos (before, after) with slider/side-by-side |
| featured | – | boolean; surfaces on Home |

### Award
title ✅ · givenBy – · year – · photo – · note –

### Testimonial
name ✅ · quote ✅ · place – · role/committee –

### About page
Single markdown document (en + optional kn body).

## Themes

Theme presets defined as CSS custom-property sets; switching = one word in config.

- **`stone` (default, chosen):** cream/sand background (#faf7f0-ish), deep maroon accent, gold hairline motifs (❖ dividers), serif headings.
- **`terracotta`:** deep terracotta hero/header, turmeric-gold accents, temple-roofline motif.
- **`ink`:** near-white, charcoal, single saffron accent line.

All presets: mobile-first, high readability, subtle traditional motifs only.

## Languages

- English primary; Kannada secondary via header toggle (EN / ಕನ್ನಡ). Tulu/Tamil addable later by adding a strings file.
- UI chrome strings live in per-language translation files; enabled languages come from config.
- Free-text content falls back to English when a translation is absent.
- Kannada pages served at `/kn/...` routes (static, no JS required for switching).

## Admin (Sveltia CMS)

- `/admin` on the same site; GitHub-backed; one-time login set up by Ankit on the owner's phone, bookmarked, stays logged in.
- Collections: Projects, Awards, Testimonials, About. Site settings (`site.config.ts`) are deliberately NOT in the CMS — only Ankit edits them, directly in the repo.
- Form labels short and bilingual (English + Kannada).
- Photo upload from phone gallery; images compressed/resized at build time (not by the user).
- Every save = git commit → full history; Ankit can recover anything.

## Stability & error handling

- **Build-time:** zod schema validation on all content; clear error messages; bad content fails the build and the previous deploy stays live (Cloudflare Pages behavior).
- **Render-time:** every optional block guarded; missing image files caught at build; external embeds (map, video) lazy-loaded and wrapped so failure shows nothing rather than a broken box.
- **Client JS is optional enhancement only** (lightbox, filter, mobile menu, before/after slider): site is fully usable with JS disabled or broken.
- **404 page**; correct meta/OG tags; images with dimensions to avoid layout shift.

## Testing

- Content schema tests (valid/invalid fixtures).
- Smoke build with two fixture projects: **minimal** (title + 1 photo) and **maximal** (every field) — verifies plug-n-play rendering both ways.
- `astro check` + build in CI (Cloudflare Pages build acts as the gate).

## Out of scope (YAGNI)

- Customer login, comments, enquiry database, analytics dashboards.
- CMS-based theme editing (theme is config, changed by Ankit).
- Server-side anything.

## Rollout

1. Build template with placeholder config + sample content.
2. Deploy first relative's instance to `*.pages.dev`, load real content.
3. Set up owner's phone: admin login + bookmark; short walkthrough.
4. Later: custom domain; additional relatives = new repo from template.
