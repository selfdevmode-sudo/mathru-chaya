# Temple Construction Showcase Website — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the white-label static showcase site (Astro) with a dead-simple Sveltia CMS admin, per `docs/superpowers/specs/2026-07-09-temple-website-design.md`.

**Architecture:** Astro 5 static site; content as markdown/YAML validated by zod content collections; per-instance `site.config.ts`; themes as CSS custom-property presets; English at root routes + Kannada at `/kn/` via a `[lang]` dynamic route; Sveltia CMS at `/admin` committing to the repo; Cloudflare Pages hosting.

**Tech Stack:** Astro ^5, TypeScript, Vitest ^3, Sveltia CMS (CDN script), Cloudflare Pages + sveltia-cms-auth worker (deploy time). Node ≥ 20, npm.

## Global Constraints

- **Docs workflow (CLAUDE.md):** before starting a task, set its feature row in `docs/BLUEPRINT.md` ledger to `in progress` with a one-line intent; after finishing, set `done` + outcome + verification, and append a dated work-log line. This applies to EVERY task below even though not repeated as a step.
- Git: local commits only, **never add a remote or push**. Author already configured (ankitv / ankit.vashe@gmail.com).
- Anything identifying a person/business comes from `site.config.ts` (ADR-0005). No literal brand colors in components — theme variables only (ADR-0006). Never render a label/wrapper without checking its data exists (ADR-0007). No hardcoded UI text — strings files only (ADR-0008). Client JS is enhancement-only; every page must work with JS disabled.
- Project content minimum: `title` + 1 photo. Everything else optional.
- All shell commands run from repo root: `/Users/ankitv/Desktop/ankit/personal project/temple`.
- Pin dependency versions at install time (`npm i` exact latest of the stated major) — do not use `latest` tags in committed files.

### File structure (target)

```
site.config.ts                      # per-instance identity/branding (ADR-0005)
astro.config.ts
package.json / tsconfig.json / vitest.config.ts
src/
  content.config.ts                 # zod schemas (ADR-0007)
  lib/i18n.ts                       # strings + t()/pickText()/localePath()
  styles/global.css                 # resets + layout tokens
  styles/themes/{stone,terracotta,ink}.css
  layouts/BaseLayout.astro          # head/meta/theme/header/footer/sticky bar
  components/                       # Header, Footer, SectionDivider, ProjectCard,
                                    # PhotoGallery, MaterialsChips, FactsGrid, MapLink,
                                    # VideoEmbed, BeforeAfter, AwardCard, TestimonialCard,
                                    # ContactBlock, Seo
  views/                            # HomeView, ProjectsView, ProjectDetailView,
                                    # AwardsView, AboutView, ContactView (lang-agnostic)
  pages/                            # en routes + [lang]/ mirrors + 404
  content/
    projects/*.md  (+ _images/)
    awards/*.md    (+ _images/)
    testimonials/*.md
    pages/{about.md,services.yml} (+ _images/)
public/admin/{index.html,config.yml}  # Sveltia CMS
tests/{i18n.test.ts,smoke.test.ts}
docs/{DEPLOYMENT.md,ONBOARDING.md}
```

---

### Task 1: Scaffold Astro project + site config (F1)

**Files:**
- Create: `package.json`, `astro.config.ts`, `tsconfig.json`, `site.config.ts`, `src/pages/index.astro` (placeholder), `.nvmrc`
- Modify: `.gitignore`

**Interfaces:**
- Produces: `site` object from `site.config.ts` — `{ name, tagline, owners, phone, whatsapp, email?, region, url, logo?, theme: 'stone'|'terracotta'|'ink', languages: Lang[] }`. Every later task imports this as `import { site } from '../../site.config'` (adjust relative depth).

- [ ] **Step 1: Create package.json and install**

```json
{
  "name": "temple-showcase",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check",
    "test": "vitest run",
    "test:smoke": "astro build && vitest run tests/smoke.test.ts"
  }
}
```

Run: `npm i astro@^5 && npm i -D typescript @astrojs/check vitest@^3`
Expected: versions written to package.json (pinned by npm with `^`), `node_modules/` created.

- [ ] **Step 2: Create config files**

`.nvmrc`: `20`

`site.config.ts` (repo root — placeholder identity; real instance edits only this file):

```ts
export type Lang = 'en' | 'kn' | 'tu' | 'ta';
export type ThemeName = 'stone' | 'terracotta' | 'ink';

export interface SiteConfig {
  name: string;
  tagline: string;
  owners: string[];
  phone: string;      // E.164, e.g. +919800000000
  whatsapp: string;   // E.164 without '+', e.g. 919800000000
  email?: string;
  region: string;     // e.g. "Udupi, Karnataka"
  url: string;        // canonical site URL
  logo?: string;      // path under /public; text monogram fallback if absent
  theme: ThemeName;
  languages: Lang[];  // first MUST be 'en' (default locale)
}

export const site: SiteConfig = {
  name: 'Shri Builders',
  tagline: 'Traditional temple & pond construction',
  owners: ['Owner Name'],
  phone: '+919800000000',
  whatsapp: '919800000000',
  region: 'Udupi, Karnataka',
  url: 'https://example.pages.dev',
  theme: 'stone',
  languages: ['en', 'kn'],
};
```

`astro.config.ts`:

```ts
import { defineConfig } from 'astro/config';
import { site } from './site.config';

export default defineConfig({
  site: site.url,
});
```

`tsconfig.json`:

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

`src/pages/index.astro` (temporary, replaced in Task 6):

```astro
---
import { site } from '../../site.config';
---
<h1>{site.name}</h1>
```

Append to `.gitignore`: `.astro/`

- [ ] **Step 3: Verify build**

Run: `npm run build && npm run check`
Expected: build succeeds, `dist/index.html` contains "Shri Builders"; check reports 0 errors.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: scaffold Astro project with site config (F1)"
```

---

### Task 2: i18n module with tests (part of F9)

**Files:**
- Create: `src/lib/i18n.ts`, `tests/i18n.test.ts`, `vitest.config.ts`

**Interfaces:**
- Consumes: `Lang` from `site.config.ts`.
- Produces: `strings` (per-lang records), `t(lang, key): string`, `pickText(lang, obj, base): string | undefined`, `localePath(lang, path): string`, `otherLangs(current): Lang[]`. All UI text in later tasks goes through `t()`.

- [ ] **Step 1: Write failing tests**

`vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';
export default defineConfig({ test: { include: ['tests/**/*.test.ts'] } });
```

`tests/i18n.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { t, pickText, localePath } from '../src/lib/i18n';

describe('i18n', () => {
  it('returns English strings', () => {
    expect(t('en', 'nav_projects')).toBe('Projects');
  });
  it('returns Kannada strings', () => {
    expect(t('kn', 'nav_projects')).toBe('ಯೋಜನೆಗಳು');
  });
  it('falls back to English for missing translations', () => {
    // 'tu' has no strings file yet — must not crash, must show English
    expect(t('tu' as never, 'nav_projects')).toBe('Projects');
  });
  it('pickText prefers requested lang, falls back to en, else undefined', () => {
    const entry = { description_en: 'hello', description_kn: 'ನಮಸ್ಕಾರ' };
    expect(pickText('kn', entry, 'description')).toBe('ನಮಸ್ಕಾರ');
    expect(pickText('kn', { description_en: 'hello' }, 'description')).toBe('hello');
    expect(pickText('en', {}, 'description')).toBeUndefined();
  });
  it('localePath leaves en at root and prefixes others', () => {
    expect(localePath('en', '/projects/')).toBe('/projects/');
    expect(localePath('kn', '/projects/')).toBe('/kn/projects/');
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npm test`
Expected: FAIL — cannot resolve `../src/lib/i18n`.

- [ ] **Step 3: Implement `src/lib/i18n.ts`**

```ts
import type { Lang } from '../../site.config';
import { site } from '../../site.config';

const en = {
  nav_home: 'Home', nav_projects: 'Projects', nav_about: 'About',
  nav_awards: 'Awards', nav_contact: 'Contact',
  cta_view_work: 'View our work', cta_call: 'Call', cta_whatsapp: 'WhatsApp',
  home_featured: 'Our work', home_awards: 'Recognition', home_testimonials: 'Kind words',
  projects_all: 'All', projects_filter: 'Filter by type',
  type_temple: 'Temple', type_pond: 'Pond / Kalyani', type_gopura: 'Gopura',
  type_renovation: 'Renovation', type_other: 'Other',
  detail_about: 'About this work', detail_materials: 'Method & materials',
  detail_details: 'Details', detail_duration: 'Duration', detail_team: 'Team',
  detail_led_by: 'Led by', detail_status: 'Status', detail_location: 'Location',
  detail_open_map: 'Open in Google Maps', detail_video: 'Watch video',
  detail_before: 'Before', detail_after: 'After', detail_built_for: 'Built for',
  detail_more_projects: 'More projects',
  awards_given_by: 'Given by', about_services: 'What we build',
  contact_region: 'Region', contact_title: 'Get in touch',
  notfound_title: 'Page not found', notfound_body: 'The page you are looking for does not exist.',
  notfound_home: 'Go to home page',
  footer_rights: 'All rights reserved.',
};

const kn: Partial<Record<keyof typeof en, string>> = {
  nav_home: 'ಮುಖಪುಟ', nav_projects: 'ಯೋಜನೆಗಳು', nav_about: 'ನಮ್ಮ ಬಗ್ಗೆ',
  nav_awards: 'ಪ್ರಶಸ್ತಿಗಳು', nav_contact: 'ಸಂಪರ್ಕ',
  cta_view_work: 'ನಮ್ಮ ಕೆಲಸ ನೋಡಿ', cta_call: 'ಕರೆ ಮಾಡಿ', cta_whatsapp: 'ವಾಟ್ಸಾಪ್',
  home_featured: 'ನಮ್ಮ ಕೆಲಸ', home_awards: 'ಮನ್ನಣೆ', home_testimonials: 'ಅಭಿಪ್ರಾಯಗಳು',
  projects_all: 'ಎಲ್ಲಾ', projects_filter: 'ಪ್ರಕಾರದಂತೆ ಆಯ್ಕೆ',
  type_temple: 'ದೇವಸ್ಥಾನ', type_pond: 'ಕಲ್ಯಾಣಿ / ಕೆರೆ', type_gopura: 'ಗೋಪುರ',
  type_renovation: 'ಜೀರ್ಣೋದ್ಧಾರ', type_other: 'ಇತರೆ',
  detail_about: 'ಈ ಕೆಲಸದ ಬಗ್ಗೆ', detail_materials: 'ವಿಧಾನ ಮತ್ತು ಸಾಮಗ್ರಿಗಳು',
  detail_details: 'ವಿವರಗಳು', detail_duration: 'ಅವಧಿ', detail_team: 'ತಂಡ',
  detail_led_by: 'ನೇತೃತ್ವ', detail_status: 'ಸ್ಥಿತಿ', detail_location: 'ಸ್ಥಳ',
  detail_open_map: 'ಗೂಗಲ್ ನಕ್ಷೆಯಲ್ಲಿ ತೆರೆಯಿರಿ', detail_video: 'ವೀಡಿಯೊ ನೋಡಿ',
  detail_before: 'ಮೊದಲು', detail_after: 'ನಂತರ', detail_built_for: 'ಯಾರಿಗಾಗಿ',
  detail_more_projects: 'ಇನ್ನಷ್ಟು ಯೋಜನೆಗಳು',
  awards_given_by: 'ನೀಡಿದವರು', about_services: 'ನಾವು ಏನು ಕಟ್ಟುತ್ತೇವೆ',
  contact_region: 'ಪ್ರದೇಶ', contact_title: 'ಸಂಪರ್ಕಿಸಿ',
  notfound_title: 'ಪುಟ ಸಿಗಲಿಲ್ಲ', notfound_body: 'ನೀವು ಹುಡುಕುತ್ತಿರುವ ಪುಟ ಇಲ್ಲ.',
  notfound_home: 'ಮುಖಪುಟಕ್ಕೆ ಹೋಗಿ',
  footer_rights: 'ಎಲ್ಲಾ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.',
};

export type StringKey = keyof typeof en;
const strings: Partial<Record<Lang, Partial<Record<StringKey, string>>>> = { en, kn };

export function t(lang: Lang, key: StringKey): string {
  return strings[lang]?.[key] ?? en[key];
}

export function pickText(
  lang: Lang, entry: Record<string, unknown>, base: string,
): string | undefined {
  const v = entry[`${base}_${lang}`] ?? entry[`${base}_en`];
  return typeof v === 'string' && v.trim() !== '' ? v : undefined;
}

export function localePath(lang: Lang, path: string): string {
  return lang === 'en' ? path : `/${lang}${path}`;
}

export function otherLangs(current: Lang): Lang[] {
  return site.languages.filter((l) => l !== current);
}
```

- [ ] **Step 4: Run tests**

Run: `npm test`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: i18n strings module with English fallback (F9 core)"
```

---

### Task 3: Content collections, schemas, sample content (F1/F13 foundation)

**Files:**
- Create: `src/content.config.ts`; sample content: `src/content/projects/sample-temple.md` (maximal), `src/content/projects/sample-pond.md` (minimal), `src/content/awards/sample-award.md`, `src/content/testimonials/sample-testimonial.md`, `src/content/pages/about.md`, `src/content/pages/services.yml`; placeholder images under `src/content/projects/_images/` and `src/content/pages/_images/`.

**Interfaces:**
- Produces: collections `projects`, `awards`, `testimonials`, `about`, `services` via `getCollection()/getEntry()`. Project data shape (all later tasks rely on these exact names): `title, photos[], type?, year?, place?, builtFor?, description_en?, description_kn?, materials?[], facts?{duration?,teamSize?,ledBy?,status?}, mapLink?, videoLink?, beforeAfter?{before,after}, featured`.

- [ ] **Step 1: Write `src/content.config.ts`**

```ts
import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

const optionalTrimmed = z.string().trim().min(1).optional();

const projects = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string().trim().min(1),
      photos: z.array(image()).min(1),
      type: z.enum(['temple', 'pond', 'gopura', 'renovation', 'other']).optional(),
      year: z.number().int().gte(1900).lte(2100).optional(),
      place: optionalTrimmed,
      builtFor: optionalTrimmed,
      description_en: optionalTrimmed,
      description_kn: optionalTrimmed,
      materials: z.array(z.string().trim().min(1)).optional(),
      facts: z
        .object({
          duration: optionalTrimmed,
          teamSize: optionalTrimmed,
          ledBy: optionalTrimmed,
          status: optionalTrimmed,
        })
        .optional(),
      mapLink: z.string().url().optional(),
      videoLink: z.string().url().optional(),
      beforeAfter: z.object({ before: image(), after: image() }).optional(),
      featured: z.boolean().default(false),
    }),
});

const awards = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/awards' }),
  schema: ({ image }) =>
    z.object({
      title: z.string().trim().min(1),
      givenBy: optionalTrimmed,
      year: z.number().int().gte(1900).lte(2100).optional(),
      photo: image().optional(),
      note_en: optionalTrimmed,
      note_kn: optionalTrimmed,
    }),
});

const testimonials = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/testimonials' }),
  schema: z.object({
    name: z.string().trim().min(1),
    quote_en: z.string().trim().min(1),
    quote_kn: optionalTrimmed,
    place: optionalTrimmed,
    role: optionalTrimmed,
  }),
});

const about = defineCollection({
  loader: glob({ pattern: 'about.md', base: './src/content/pages' }),
  schema: ({ image }) =>
    z.object({
      heroPhoto: image().optional(),
      yearsExperience: z.number().int().positive().optional(),
      body_kn: optionalTrimmed, // markdown body of the file is the English text
    }),
});

const services = defineCollection({
  loader: file('./src/content/pages/services.yml'),
  schema: z.object({
    id: z.string(),
    name_en: z.string().trim().min(1),
    name_kn: optionalTrimmed,
    blurb_en: optionalTrimmed,
    blurb_kn: optionalTrimmed,
  }),
});

export const collections = { projects, awards, testimonials, about, services };
```

- [ ] **Step 2: Create placeholder images (SVG, replaced by real photos per instance)**

Create `src/content/projects/_images/temple-1.svg` (repeat the pattern for `temple-2.svg`, `temple-before.svg`, `temple-after.svg`, `pond-1.svg`, and `src/content/pages/_images/award-1.svg` with different fill colors):

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800"><rect width="1200" height="800" fill="#b09b78"/><rect y="400" width="1200" height="400" fill="#7d6a4d"/></svg>
```

Note: awards photo lives in `src/content/awards/_images/award-1.svg` — create that file too.

- [ ] **Step 3: Create sample content**

`src/content/projects/sample-temple.md` (maximal — exercises EVERY field):

```md
---
title: Shri Durgaparameshwari Temple (Sample)
photos:
  - _images/temple-1.svg
  - _images/temple-2.svg
type: temple
year: 2021
place: Kaup, Udupi
builtFor: Shri Durga Seva Trust
description_en: Full reconstruction of the garbhagriha and outer mandapa in laterite and granite, following the original plan.
description_kn: ಮೂಲ ನಕ್ಷೆಯಂತೆ ಗರ್ಭಗುಡಿ ಮತ್ತು ಮಂಟಪದ ಪೂರ್ಣ ಪುನರ್ನಿರ್ಮಾಣ.
materials: [Laterite stone, Granite pillars, Lime mortar]
facts:
  duration: 14 months
  teamSize: 12 artisans
  ledBy: Shri Ramanna Acharya
  status: Completed 2021
mapLink: https://maps.google.com/?q=Kaup
videoLink: https://www.youtube.com/watch?v=dQw4w9WgXcQ
beforeAfter:
  before: _images/temple-before.svg
  after: _images/temple-after.svg
featured: true
---
```

`src/content/projects/sample-pond.md` (minimal — title + one photo ONLY):

```md
---
title: Temple Pond (Sample)
photos:
  - _images/pond-1.svg
---
```

`src/content/awards/sample-award.md`:

```md
---
title: Shilpa Kala Award (Sample)
givenBy: District Heritage Council
year: 2019
photo: _images/award-1.svg
---
```

`src/content/testimonials/sample-testimonial.md`:

```md
---
name: Temple Trust Committee (Sample)
quote_en: They rebuilt our temple with great care and respect for tradition.
place: Karkala
---
```

`src/content/pages/about.md`:

```md
---
yearsExperience: 40
---
Trained in the traditional guru-shishya way, our family has built and restored
temples, kalyanis and gopuras across coastal Karnataka for two generations.
```

`src/content/pages/services.yml`:

```yml
- id: temples
  name_en: Temple construction
  name_kn: ದೇವಸ್ಥಾನ ನಿರ್ಮಾಣ
- id: ponds
  name_en: Temple ponds (kalyani)
  name_kn: ಕಲ್ಯಾಣಿ ನಿರ್ಮಾಣ
- id: gopura
  name_en: Gopura & stone work
  name_kn: ಗೋಪುರ ಮತ್ತು ಕಲ್ಲಿನ ಕೆಲಸ
- id: renovation
  name_en: Renovation & restoration
  name_kn: ಜೀರ್ಣೋದ್ಧಾರ
```

- [ ] **Step 4: Verify schema catches bad content (negative test, manual)**

Temporarily add `year: "twenty21"` to `sample-pond.md`, run `npm run build` — Expected: build FAILS with a zod error naming the file and field. Revert the change, run `npm run build` — Expected: PASS. This confirms ADR-0007 layer 1.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: content collections with zod schemas and sample content (F1)"
```

---

### Task 4: Theme system + base layout + header/footer/sticky bar (F2, F8-bar)

**Files:**
- Create: `src/styles/global.css`, `src/styles/themes/stone.css`, `src/styles/themes/terracotta.css`, `src/styles/themes/ink.css`, `src/layouts/BaseLayout.astro`, `src/components/Header.astro`, `src/components/Footer.astro`, `src/components/StickyContact.astro`, `src/components/SectionDivider.astro`, `src/components/Seo.astro`

**Interfaces:**
- Consumes: `site`, `t/localePath/otherLangs`.
- Produces: `<BaseLayout lang={Lang} title={string} description={string | undefined}>` wrapping all pages; CSS custom properties every component must use: `--c-bg, --c-bg-alt, --c-text, --c-text-soft, --c-accent, --c-accent-contrast, --c-gold, --c-border, --font-head, --font-body, --motif` (motif = short decorative string, may be empty).

- [ ] **Step 1: Theme presets**

`src/styles/themes/stone.css` (chosen default — Warm Stone from mockup A):

```css
:root {
  --c-bg: #faf7f0; --c-bg-alt: #f3ecdd;
  --c-text: #3d3529; --c-text-soft: #8a7c66;
  --c-accent: #7a2e1d; --c-accent-contrast: #faf7f0;
  --c-gold: #c9a86a; --c-border: #e5ddcc;
  --font-head: Georgia, 'Times New Roman', serif;
  --font-body: Georgia, 'Times New Roman', serif;
  --motif: '❖';
}
```

`src/styles/themes/terracotta.css`:

```css
:root {
  --c-bg: #fdf6ee; --c-bg-alt: #f7ecd9;
  --c-text: #40302a; --c-text-soft: #8a6f5f;
  --c-accent: #5c2a1e; --c-accent-contrast: #f7ecd9;
  --c-gold: #d9a441; --c-border: #ecd9c2;
  --font-head: Georgia, 'Times New Roman', serif;
  --font-body: Georgia, 'Times New Roman', serif;
  --motif: '▲';
}
```

`src/styles/themes/ink.css`:

```css
:root {
  --c-bg: #fcfcfa; --c-bg-alt: #f1f1ed;
  --c-text: #26241f; --c-text-soft: #75705f;
  --c-accent: #d9822b; --c-accent-contrast: #fcfcfa;
  --c-gold: #26241f; --c-border: #e2e0da;
  --font-head: system-ui, sans-serif;
  --font-body: system-ui, sans-serif;
  --motif: '';
}
```

- [ ] **Step 2: `src/styles/global.css`** — reset, typography, layout primitives, mobile-first

```css
* { box-sizing: border-box; margin: 0; }
html { scroll-behavior: smooth; }
body {
  background: var(--c-bg); color: var(--c-text);
  font-family: var(--font-body); line-height: 1.6; font-size: 1rem;
}
img { max-width: 100%; height: auto; display: block; }
h1, h2, h3 { font-family: var(--font-head); color: var(--c-accent); line-height: 1.2; }
a { color: var(--c-accent); }
.wrap { max-width: 64rem; margin-inline: auto; padding-inline: 1rem; }
.section { padding-block: 2.5rem; }
.label {
  font-size: .72rem; letter-spacing: .15em; text-transform: uppercase;
  color: var(--c-gold); font-family: system-ui, sans-serif;
}
.btn {
  display: inline-block; background: var(--c-accent); color: var(--c-accent-contrast);
  padding: .6rem 1.4rem; border-radius: 4px; text-decoration: none;
  letter-spacing: .08em; font-size: .85rem;
}
.btn-outline { background: transparent; color: var(--c-accent); border: 1px solid var(--c-accent); }
.chip {
  display: inline-block; background: var(--c-bg-alt); border: 1px solid var(--c-border);
  border-radius: 999px; padding: .1rem .7rem; font-size: .8rem; margin: 0 .3rem .3rem 0;
}
.grid-cards { display: grid; gap: 1rem; grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr)); }
```

- [ ] **Step 3: Components**

`src/components/SectionDivider.astro` (motif hidden when theme has none — plug-n-play for themes):

```astro
<div class="divider" aria-hidden="true"></div>
<style>
  .divider { text-align: center; color: var(--c-gold); letter-spacing: .6em; padding-block: .5rem; }
  .divider::before { content: var(--motif); }
</style>
```

`src/components/Header.astro` — logo/monogram (text fallback when `site.logo` absent), nav links via `t()` + `localePath()`, `<details class="menu">` pattern for the mobile menu (works without JS), language toggle links to the same path in `otherLangs()`:

```astro
---
import { site } from '../../site.config';
import { t, localePath, otherLangs, type StringKey } from '../lib/i18n';
import type { Lang } from '../../site.config';
const { lang, path = '/' } = Astro.props as { lang: Lang; path?: string };
const nav: [StringKey, string][] = [
  ['nav_projects', '/projects/'], ['nav_about', '/about/'],
  ['nav_awards', '/awards/'], ['nav_contact', '/contact/'],
];
---
<header class="wrap">
  <a class="brand" href={localePath(lang, '/')}>
    {site.logo ? <img src={site.logo} alt={site.name} height="36" /> : <span class="mono">{site.name.slice(0, 1)}</span>}
    <b>{site.name}</b>
  </a>
  <details class="menu">
    <summary aria-label="Menu">☰</summary>
    <nav>
      {nav.map(([key, p]) => <a href={localePath(lang, p)}>{t(lang, key)}</a>)}
      {otherLangs(lang).map((l) => <a class="lang" href={localePath(l, path)}>{l === 'en' ? 'English' : 'ಕನ್ನಡ'}</a>)}
    </nav>
  </details>
</header>
<style>
  header { display: flex; justify-content: space-between; align-items: center; padding-block: .8rem; border-bottom: 1px solid var(--c-border); }
  .brand { display: flex; gap: .5rem; align-items: center; text-decoration: none; color: var(--c-accent); }
  .mono { border: 1px solid var(--c-gold); border-radius: 4px; padding: .1rem .5rem; font-family: var(--font-head); }
  summary { cursor: pointer; list-style: none; font-size: 1.3rem; }
  nav { display: flex; flex-direction: column; gap: .6rem; position: absolute; right: 1rem; background: var(--c-bg); border: 1px solid var(--c-border); padding: 1rem; border-radius: 6px; z-index: 10; }
  nav a { text-decoration: none; }
  @media (min-width: 48rem) {
    summary { display: none; }
    .menu, nav { position: static; display: flex; flex-direction: row; border: 0; padding: 0; background: none; }
  }
</style>
```

Note: `path` prop = current logical path (e.g. `/projects/`) so the language toggle lands on the same page. Every view passes it.

`src/components/Footer.astro` — name, region, phone link, `t('footer_rights')`, current year via `new Date().getFullYear()` (build-time).

`src/components/StickyContact.astro` (mobile-only sticky bar, F8):

```astro
---
import { site } from '../../site.config';
import { t } from '../lib/i18n';
import type { Lang } from '../../site.config';
const { lang } = Astro.props as { lang: Lang };
---
<div class="sticky-contact">
  <a href={`tel:${site.phone}`}>📞 {t(lang, 'cta_call')}</a>
  <a href={`https://wa.me/${site.whatsapp}`}>🟢 {t(lang, 'cta_whatsapp')}</a>
</div>
<style>
  .sticky-contact { position: fixed; bottom: 0; inset-inline: 0; display: flex; z-index: 20; }
  .sticky-contact a { flex: 1; text-align: center; padding: .8rem; background: var(--c-accent); color: var(--c-accent-contrast); text-decoration: none; border-top: 1px solid var(--c-gold); }
  @media (min-width: 48rem) { .sticky-contact { display: none; } }
</style>
```

`src/components/Seo.astro` — `<title>`, meta description (only if provided — guard!), canonical from `Astro.url`, OG title/description/site_name, `og:image` only when passed.

- [ ] **Step 4: `src/layouts/BaseLayout.astro`**

```astro
---
import '../styles/global.css';
import { site } from '../../site.config';
import type { Lang } from '../../site.config';
import Seo from '../components/Seo.astro';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import StickyContact from '../components/StickyContact.astro';

const themes = import.meta.glob('../styles/themes/*.css', { query: '?url', import: 'default', eager: true });
const themeHref = themes[`../styles/themes/${site.theme}.css`] as string;

const { lang, title, description, path = '/' } =
  Astro.props as { lang: Lang; title: string; description?: string; path?: string };
---
<!doctype html>
<html lang={lang}>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="stylesheet" href={themeHref} />
    <Seo {title} {description} />
  </head>
  <body>
    <Header {lang} {path} />
    <main><slot /></main>
    <Footer {lang} />
    <StickyContact {lang} />
  </body>
</html>
```

- [ ] **Step 5: Verify** — update placeholder `src/pages/index.astro` to use `<BaseLayout lang="en" title={site.name}>`, run `npm run dev`, check `/` renders with stone theme; flip `site.theme` to `'ink'`, confirm the look changes, flip back. Run `npm run build && npm run check` — PASS.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: theme presets, base layout, header/footer, sticky contact bar (F2)"
```

---

### Task 5: Bilingual routing skeleton (F9)

**Files:**
- Create: `src/pages/[lang]/index.astro`, `src/lib/routes.ts`

**Interfaces:**
- Produces: `nonDefaultLangs(): { params: { lang } }[]` used by every `[lang]` route's `getStaticPaths`. Pattern established here is copied for every page pair in later tasks: root page renders view with `lang="en"`; `[lang]` page renders same view with `lang=Astro.params.lang`.

- [ ] **Step 1: `src/lib/routes.ts`**

```ts
import { site } from '../../site.config';

export function nonDefaultLangs() {
  return site.languages.filter((l) => l !== 'en').map((lang) => ({ params: { lang } }));
}
```

- [ ] **Step 2: `src/pages/[lang]/index.astro`**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import { site, type Lang } from '../../../site.config';
import { nonDefaultLangs } from '../../lib/routes';
export const getStaticPaths = nonDefaultLangs;
const lang = Astro.params.lang as Lang;
---
<BaseLayout {lang} title={site.name} path="/">
  <h1 class="wrap">{site.name}</h1>
</BaseLayout>
```

- [ ] **Step 3: Verify** — `npm run build`; Expected: `dist/kn/index.html` exists. Remove `'kn'` from `site.languages`, rebuild — Expected: no `dist/kn/`. Restore.

- [ ] **Step 4: Commit** — `git add -A && git commit -m "feat: [lang] routing skeleton driven by enabled languages (F9)"`

---

### Task 6: Home page (F3)

**Files:**
- Create: `src/views/HomeView.astro`, `src/components/ProjectCard.astro`, `src/components/TestimonialCard.astro`
- Modify: `src/pages/index.astro`, `src/pages/[lang]/index.astro` (both become 3-line wrappers rendering `<HomeView lang={...} />`)

**Interfaces:**
- Consumes: collections, `t/pickText/localePath`, BaseLayout.
- Produces: `ProjectCard` props `{ project: CollectionEntry<'projects'>, lang: Lang }` (reused by Task 7).

- [ ] **Step 1: `src/components/ProjectCard.astro`** — cover = `project.data.photos[0]` via `<Image>` from `astro:assets` (`widths={[400, 800]}`, `alt={title}`), title, and a meta line with type/place/year **rendered only from the parts that exist**:

```astro
---
import { Image } from 'astro:assets';
import type { CollectionEntry } from 'astro:content';
import { t, localePath } from '../lib/i18n';
import type { Lang } from '../../site.config';
const { project, lang } = Astro.props as { project: CollectionEntry<'projects'>; lang: Lang };
const d = project.data;
const meta = [d.type ? t(lang, `type_${d.type}`) : null, d.place, d.year].filter(Boolean).join(' · ');
---
<a class="card" href={localePath(lang, `/projects/${project.id}/`)}>
  <Image src={d.photos[0]} alt={d.title} widths={[400, 800]} sizes="(max-width: 48rem) 100vw, 20rem" />
  <h3>{d.title}</h3>
  {meta && <p class="label">{meta}</p>}
</a>
<style>
  .card { text-decoration: none; }
  .card img { border-radius: 6px; aspect-ratio: 4/3; object-fit: cover; }
  .card h3 { font-size: 1.05rem; margin-top: .5rem; }
</style>
```

- [ ] **Step 2: `src/views/HomeView.astro`** — hero (`site.name`, `site.tagline`, CTA `t('cta_view_work')` → projects), `SectionDivider`, featured projects grid (`featured: true`, fall back to newest 3 when none featured — **section always guarded**: skip when zero projects), about teaser (first 160 chars of about body via `render()`, link), awards strip (**only if awards exist**: `label` + up to 3 titles/years), testimonials (**only if any**), contact block (phone/WhatsApp buttons + region). Every section: `{items.length > 0 && <section>…</section>}`.

- [ ] **Step 3: Wire both routes**, delete placeholder markup. `npm run build` → inspect `dist/index.html`: hero + sample project present; `dist/kn/index.html`: Kannada nav/labels, English description fallback visible.

- [ ] **Step 4: Commit** — `git add -A && git commit -m "feat: home page with guarded sections (F3)"`

---

### Task 7: Projects listing + filter (F4)

**Files:**
- Create: `src/views/ProjectsView.astro`, `src/pages/projects/index.astro`, `src/pages/[lang]/projects/index.astro`

- [ ] **Step 1: `ProjectsView`** — all projects sorted by `year` desc (undefined years last), rendered as `ProjectCard` grid. Each card wrapper gets `data-type={d.type ?? 'other'}`. Filter bar of `<button data-filter=…>` for All + only the types actually present (guard: no filter bar if <2 distinct types). The bar is rendered with `hidden` attribute; a small inline `<script>` removes `hidden` and wires clicks toggling `[data-type]` visibility — **no JS ⇒ no filter bar, all projects shown** (enhancement-only, ADR-0007).

```astro
<script>
  const bar = document.querySelector('.filters') as HTMLElement | null;
  if (bar) {
    bar.hidden = false;
    bar.addEventListener('click', (e) => {
      const btn = (e.target as HTMLElement).closest('button');
      if (!btn) return;
      const f = btn.dataset.filter!;
      bar.querySelectorAll('button').forEach((b) => b.classList.toggle('active', b === btn));
      document.querySelectorAll<HTMLElement>('[data-type]').forEach((el) => {
        el.hidden = f !== 'all' && el.dataset.type !== f;
      });
    });
  }
</script>
```

- [ ] **Step 2: Routes** (root + `[lang]` wrappers, same pattern as Task 6). Build; verify `dist/projects/index.html` lists both samples; filter bar markup has `hidden`.

- [ ] **Step 3: Commit** — `git add -A && git commit -m "feat: projects listing with progressive-enhancement filter (F4)"`

---

### Task 8: Project detail page — all guarded blocks (F5)

**Files:**
- Create: `src/views/ProjectDetailView.astro`, `src/components/PhotoGallery.astro`, `src/components/MaterialsChips.astro`, `src/components/FactsGrid.astro`, `src/components/MapLink.astro`, `src/components/VideoEmbed.astro`, `src/components/BeforeAfter.astro`, `src/pages/projects/[slug].astro`, `src/pages/[lang]/projects/[slug].astro`

**Interfaces:**
- Consumes: `ProjectCard` shape from Task 6; project data names from Task 3 (exact).

- [ ] **Step 1: Leaf components** (each returns nothing meaningful if its prop is absent — but the VIEW does the guarding; components may assume valid props):
  - `PhotoGallery.astro`: props `{ photos, title }`. First photo large (`<Image widths={[800,1200]}>`), rest in a thumb grid. Enhancement: inline script opens a `<dialog>` lightbox on click; without JS images are simply visible (no links, no dead UI).
  - `MaterialsChips.astro`: props `{ items: string[] }` → `.chip` list.
  - `FactsGrid.astro`: props `{ facts, lang }` → 2-col grid of the facts **that exist**: `{facts.duration && <div><b class="label">{t(lang,'detail_duration')}</b>{facts.duration}</div>}` etc. for teamSize/ledBy/status.
  - `MapLink.astro`: props `{ href, lang }` → styled block link `📍 {t(lang,'detail_open_map')}`, `rel="noopener"`, `target="_blank"`. No third-party embed at all (nothing to fail).
  - `VideoEmbed.astro`: props `{ href, lang }`. Renders a plain external link; enhancement script swaps it for a lazy YouTube iframe on click **only if** the URL parses as YouTube (`youtube.com/watch?v=` or `youtu.be/`); otherwise it stays a link. Failure mode = still a working link.
  - `BeforeAfter.astro`: props `{ pair, lang }` → two `<figure>` side by side (grid), captions `t('detail_before')/t('detail_after')`. No slider JS (YAGNI, robust).

- [ ] **Step 2: `ProjectDetailView.astro`** — assembles per approved mockup, EVERY block guarded:

```astro
---
import type { CollectionEntry } from 'astro:content';
import type { Lang } from '../../site.config';
import BaseLayout from '../layouts/BaseLayout.astro';
import PhotoGallery from '../components/PhotoGallery.astro';
import MaterialsChips from '../components/MaterialsChips.astro';
import FactsGrid from '../components/FactsGrid.astro';
import MapLink from '../components/MapLink.astro';
import VideoEmbed from '../components/VideoEmbed.astro';
import BeforeAfter from '../components/BeforeAfter.astro';
import SectionDivider from '../components/SectionDivider.astro';
import { t, pickText, localePath } from '../lib/i18n';

const { project, lang } = Astro.props as { project: CollectionEntry<'projects'>; lang: Lang };
const d = project.data;
const description = pickText(lang, d, 'description');
const headline = [d.type ? t(lang, `type_${d.type}`) : null, d.year].filter(Boolean).join(' · ');
const metaLine = [d.place, d.builtFor ? `${t(lang, 'detail_built_for')}: ${d.builtFor}` : null].filter(Boolean).join(' · ');
const hasFacts = d.facts && Object.values(d.facts).some(Boolean);
---
<BaseLayout {lang} title={`${d.title}`} description={description} path={`/projects/${project.id}/`}>
  <article class="wrap section">
    {headline && <p class="label">{headline}</p>}
    <h1>{d.title}</h1>
    {metaLine && <p class="label" style="color: var(--c-text-soft)">{metaLine}</p>}
    <PhotoGallery photos={d.photos} title={d.title} />
    {description && <section><h2 class="label">{t(lang, 'detail_about')}</h2><p>{description}</p></section>}
    {d.materials && d.materials.length > 0 && <section><h2 class="label">{t(lang, 'detail_materials')}</h2><MaterialsChips items={d.materials} /></section>}
    {hasFacts && <section><h2 class="label">{t(lang, 'detail_details')}</h2><FactsGrid facts={d.facts!} {lang} /></section>}
    {d.beforeAfter && <BeforeAfter pair={d.beforeAfter} {lang} />}
    {d.videoLink && <VideoEmbed href={d.videoLink} {lang} />}
    {d.mapLink && <section><h2 class="label">{t(lang, 'detail_location')}</h2><MapLink href={d.mapLink} {lang} /></section>}
    <SectionDivider />
    <a class="btn-outline btn" href={localePath(lang, '/projects/')}>← {t(lang, 'detail_more_projects')}</a>
  </article>
</BaseLayout>
```

- [ ] **Step 3: Routes.** `src/pages/projects/[slug].astro`:

```astro
---
import { getCollection } from 'astro:content';
import ProjectDetailView from '../../views/ProjectDetailView.astro';
export async function getStaticPaths() {
  const projects = await getCollection('projects');
  return projects.map((project) => ({ params: { slug: project.id }, props: { project } }));
}
---
<ProjectDetailView project={Astro.props.project} lang="en" />
```

`src/pages/[lang]/projects/[slug].astro` — same but cross-product with `site.languages.filter(l => l !== 'en')` in `getStaticPaths` and `lang={Astro.params.lang}`.

- [ ] **Step 4: Verify plug-n-play manually** — build; `dist/projects/sample-temple/index.html` contains materials label, facts, before/after, video link, map link; `dist/projects/sample-pond/index.html` contains NONE of those labels, no "undefined", and still renders title + image. (Automated in Task 12.)

- [ ] **Step 5: Commit** — `git add -A && git commit -m "feat: project detail page with plug-n-play optional blocks (F5)"`

---

### Task 9: Awards, About+Testimonials+Services, Contact pages (F6, F7, F8)

**Files:**
- Create: `src/views/AwardsView.astro`, `src/components/AwardCard.astro`, `src/views/AboutView.astro`, `src/views/ContactView.astro`, and route pairs: `src/pages/{awards,about,contact}/index.astro` + `src/pages/[lang]/{awards,about,contact}/index.astro`

- [ ] **Step 1: Awards (F6)** — `AwardCard`: photo (**only if present**, else a `--c-gold`-bordered medallion block with 🏆), title, `{givenBy && `${t('awards_given_by')}: ${givenBy}`}`, year, note via `pickText(lang, d, 'note')`. `AwardsView`: card grid; if zero awards the PAGE still renders with heading (page exists in nav, empty state = just the heading — no fake content).
- [ ] **Step 2: About (F7)** — `about.md` body rendered via `render(entry)` for English; for `kn`, `pickText`-style: use `body_kn` field if present else the English body. `yearsExperience` and `heroPhoto` guarded. Services section from `services` collection (guarded, names/blurbs via `pickText`). Testimonials section at bottom (guarded).
- [ ] **Step 3: Contact (F8)** — big tap targets: call button (`tel:`), WhatsApp button (`wa.me`), email **only if** `site.email`, region line, owners' names. No form (YAGNI — WhatsApp IS the form here).
- [ ] **Step 4: Verify** — build; all six routes exist in `dist/` (en + kn); no "undefined" anywhere: `grep -ri "undefined" dist/ --include='*.html'` → no output.
- [ ] **Step 5: Commit** — `git add -A && git commit -m "feat: awards, about with services and testimonials, contact pages (F6-F8)"`

---

### Task 10: 404 + SEO polish (F12)

**Files:**
- Create: `src/pages/404.astro`
- Modify: `src/components/Seo.astro` (og:image from first featured project cover when available — guarded)

- [ ] **Step 1:** `404.astro` — BaseLayout, `t('notfound_title')/notfound_body/notfound_home` (English + link home; 404 is en-only, Cloudflare serves `dist/404.html`).
- [ ] **Step 2:** Verify build emits `dist/404.html`; every page has `<title>`, canonical, og tags (`grep -l 'og:title' dist/**/*.html`).
- [ ] **Step 3: Commit** — `git add -A && git commit -m "feat: 404 page and OG/meta polish (F12)"`

---

### Task 11: Visual polish pass (F2 completion)

**Files:** Modify any `src/styles/*`, `src/components/*`, `src/views/*` — no content/schema changes allowed in this task.

- [ ] **Step 1:** Invoke the `frontend-design:frontend-design` skill. Inputs: spec §Themes, the approved Warm Stone mockup (`.superpowers/brainstorm/*/content/visual-style.html` card A and `project-detail.html`), rule set from ADR-0006.
- [ ] **Step 2:** Polish checklist — hero presence without flashiness; consistent vertical rhythm; ❖ dividers between home sections; card hover states; gallery spacing; facts grid alignment; sticky bar not overlapping footer content (add `padding-bottom` on `body` at mobile); focus-visible outlines; contrast ≥ WCAG AA for `--c-text-soft` on `--c-bg` in all three themes (adjust variable values if needed, not components).
- [ ] **Step 3:** Verify on phone-width viewport (`npm run dev`, responsive mode 375px): nav menu, sticky bar, gallery, filter all usable; rebuild all three themes by flipping `site.theme` and eyeball each. Restore `theme: 'stone'`.
- [ ] **Step 4: Commit** — `git add -A && git commit -m "style: visual polish pass across themes (F2)"`

---

### Task 12: Smoke tests — the plug-n-play guarantee (F13)

**Files:**
- Create: `tests/smoke.test.ts`

**Interfaces:**
- Consumes: built `dist/` + sample content filenames from Task 3. Tests SKIP (with message) if fixtures were deleted (real instance) — template repo keeps them.

- [ ] **Step 1: Write the test**

```ts
import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';

const read = (p: string) => readFileSync(`dist/${p}`, 'utf8');
const fixturesPresent = existsSync('src/content/projects/sample-pond.md');

describe.skipIf(!fixturesPresent)('plug-n-play rendering', () => {
  it('minimal project renders title+photo and NO optional block labels', () => {
    const html = read('projects/sample-pond/index.html');
    expect(html).toContain('Temple Pond (Sample)');
    expect(html).toContain('<img');
    for (const absent of ['Method &amp; materials', 'Details', 'Location', 'Watch video', 'Before', 'Built for'])
      expect(html).not.toContain(absent);
    expect(html).not.toMatch(/undefined|\bnull\b|NaN/);
  });
  it('maximal project renders every optional block', () => {
    const html = read('projects/sample-temple/index.html');
    for (const present of ['Method &amp; materials', 'Duration', 'Open in Google Maps', 'Watch video', 'Before', 'After', 'Built for'])
      expect(html).toContain(present);
  });
  it('kannada route exists with Kannada chrome and English fallback text', () => {
    const html = read('kn/projects/sample-pond/index.html');
    expect(html).toContain('ಯೋಜನೆಗಳು');
  });
  it('404 and core pages exist', () => {
    for (const p of ['404.html', 'index.html', 'projects/index.html', 'awards/index.html', 'about/index.html', 'contact/index.html', 'kn/index.html'])
      expect(existsSync(`dist/${p}`)).toBe(true);
  });
  it('no page leaks another identity than site.config', () => {
    expect(read('index.html')).toContain('Shri Builders');
  });
});
```

- [ ] **Step 2: Run** — `npm run test:smoke`. Expected: build + 5 tests PASS. If a label assertion fails because Task 8 phrased a string differently, fix the TEST to use the exact `t()` string — the strings file is the source of truth.
- [ ] **Step 3: Commit** — `git add -A && git commit -m "test: smoke tests enforcing plug-n-play contract (F13)"`

---

### Task 13: Sveltia CMS admin — collections & fields (F10) — THE EXTENSIVE ONE

**Files:**
- Create: `public/admin/index.html`, `public/admin/config.yml`

**Interfaces:**
- Consumes: content shapes from Task 3 — field names MUST match schemas exactly (`description_en`, `facts.duration`, `beforeAfter.before`, …).
- Produces: `/admin` route on the built site.

**UX principles baked into the config (why each choice):**
- Field order = importance; required fields first; the form must be fillable top-to-bottom without decisions.
- Every label bilingual `English · ಕನ್ನಡ`; every non-obvious field gets a `hint` in both languages with an example.
- Plain `text`/`string` widgets for prose — NO markdown editor (confusing toolbar).
- Rarely-used fields (`facts`, `beforeAfter`) are collapsed `object` widgets — the form looks short.
- `editor: preview: false` everywhere — the live site preview pane confuses more than helps on a phone.
- Per-collection media folders (`_images` beside the content) so zod `image()` validates existence at build (ADR-0007).
- Sample entries carry "(Sample)" in the title so owners recognize and can delete them safely.

- [ ] **Step 1: `public/admin/index.html`**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex" />
    <title>Site Admin</title>
  </head>
  <body>
    <script src="https://unpkg.com/@sveltia/cms@0.117.0/dist/sveltia-cms.js" type="module"></script>
  </body>
</html>
```

(Pin to the current Sveltia version at implementation time — check `npm view @sveltia/cms version` and use that exact version in the URL; `0.117.0` is illustrative.)

- [ ] **Step 2: `public/admin/config.yml`** — complete file:

```yml
backend:
  name: github
  repo: OWNER/REPO            # set per instance at deploy time (Task 15)
  branch: main
  base_url: https://sveltia-cms-auth.WORKER.workers.dev  # set in Task 15

media_folder: src/assets/uploads
public_folder: /src/assets/uploads

editor:
  preview: false

collections:
  # ── PROJECTS ─────────────────────────────────────────────
  - name: projects
    label: Projects · ಯೋಜನೆಗಳು
    label_singular: Project · ಯೋಜನೆ
    folder: src/content/projects
    create: true
    extension: md
    format: yaml-frontmatter
    identifier_field: title
    slug: '{{slug}}'
    summary: '{{title}} — {{place}} {{year}}'
    sortable_fields: [year, title]
    media_folder: /src/content/projects/_images
    public_folder: _images
    fields:
      - name: title
        label: Project name · ಯೋಜನೆಯ ಹೆಸರು
        widget: string
        hint: 'e.g. Shri Durgaparameshwari Temple · ಉದಾ: ಶ್ರೀ ದುರ್ಗಾಪರಮೇಶ್ವರಿ ದೇವಸ್ಥಾನ'
      - name: photos
        label: Photos · ಫೋಟೋಗಳು
        label_singular: Photo · ಫೋಟೋ
        widget: list
        min: 1
        field: { name: photo, label: Photo · ಫೋಟೋ, widget: image }
        hint: 'First photo is the main photo · ಮೊದಲ ಫೋಟೋ ಮುಖ್ಯ ಫೋಟೋ'
      - name: type
        label: Type of work · ಕೆಲಸದ ಪ್ರಕಾರ
        widget: select
        required: false
        options:
          - { value: temple, label: Temple · ದೇವಸ್ಥಾನ }
          - { value: pond, label: Pond / Kalyani · ಕಲ್ಯಾಣಿ / ಕೆರೆ }
          - { value: gopura, label: Gopura · ಗೋಪುರ }
          - { value: renovation, label: Renovation · ಜೀರ್ಣೋದ್ಧಾರ }
          - { value: other, label: Other · ಇತರೆ }
      - name: place
        label: Place · ಸ್ಥಳ
        widget: string
        required: false
        hint: 'Town, district · ಊರು, ಜಿಲ್ಲೆ'
      - name: year
        label: Year completed · ಮುಗಿದ ವರ್ಷ
        widget: number
        value_type: int
        required: false
      - name: builtFor
        label: Built for (trust / committee) · ಯಾರಿಗಾಗಿ (ಟ್ರಸ್ಟ್ / ಸಮಿತಿ)
        widget: string
        required: false
      - name: description_en
        label: Description (English) · ವಿವರಣೆ (ಇಂಗ್ಲಿಷ್)
        widget: text
        required: false
        hint: 'A few sentences about the work · ಕೆಲಸದ ಬಗ್ಗೆ ಕೆಲವು ಸಾಲುಗಳು'
      - name: description_kn
        label: Description (Kannada) · ವಿವರಣೆ (ಕನ್ನಡ)
        widget: text
        required: false
        hint: 'If empty, English text is shown · ಖಾಲಿ ಇದ್ದರೆ ಇಂಗ್ಲಿಷ್ ತೋರಿಸಲಾಗುತ್ತದೆ'
      - name: materials
        label: Materials used · ಬಳಸಿದ ಸಾಮಗ್ರಿಗಳು
        widget: list
        required: false
        field: { name: material, label: Material · ಸಾಮಗ್ರಿ, widget: string }
        hint: 'e.g. Laterite stone, Granite · ಉದಾ: ಮುರಕಲ್ಲು, ಕಣಶಿಲೆ'
      - name: facts
        label: More details (all optional) · ಹೆಚ್ಚಿನ ವಿವರ (ಐಚ್ಛಿಕ)
        widget: object
        required: false
        collapsed: true
        fields:
          - { name: duration, label: How long it took · ಎಷ್ಟು ಸಮಯ, widget: string, required: false, hint: 'e.g. 14 months · ಉದಾ: ೧೪ ತಿಂಗಳು' }
          - { name: teamSize, label: Team · ತಂಡ, widget: string, required: false, hint: 'e.g. 12 artisans · ಉದಾ: ೧೨ ಶಿಲ್ಪಿಗಳು' }
          - { name: ledBy, label: Led by · ನೇತೃತ್ವ, widget: string, required: false }
          - { name: status, label: Status · ಸ್ಥಿತಿ, widget: string, required: false, hint: 'e.g. Completed 2021 · ಉದಾ: ೨೦೨೧ರಲ್ಲಿ ಪೂರ್ಣ' }
      - name: mapLink
        label: Google Maps link · ಗೂಗಲ್ ನಕ್ಷೆ ಲಿಂಕ್
        widget: string
        required: false
        hint: 'Open the place in Google Maps app → Share → Copy link, paste here · ನಕ್ಷೆಯಲ್ಲಿ ಸ್ಥಳ ತೆರೆದು Share → Copy link ಮಾಡಿ ಇಲ್ಲಿ ಹಾಕಿ'
      - name: videoLink
        label: YouTube video link · ಯೂಟ್ಯೂಬ್ ವೀಡಿಯೊ ಲಿಂಕ್
        widget: string
        required: false
      - name: beforeAfter
        label: Before / After photos · ಮೊದಲು / ನಂತರ ಫೋಟೋ
        widget: object
        required: false
        collapsed: true
        fields:
          - { name: before, label: Before · ಮೊದಲು, widget: image }
          - { name: after, label: After · ನಂತರ, widget: image }
      - name: featured
        label: Show on home page · ಮುಖಪುಟದಲ್ಲಿ ತೋರಿಸಿ
        widget: boolean
        default: false
        required: false

  # ── AWARDS ───────────────────────────────────────────────
  - name: awards
    label: Awards · ಪ್ರಶಸ್ತಿಗಳು
    label_singular: Award · ಪ್ರಶಸ್ತಿ
    folder: src/content/awards
    create: true
    extension: md
    format: yaml-frontmatter
    identifier_field: title
    summary: '{{title}} — {{year}}'
    media_folder: /src/content/awards/_images
    public_folder: _images
    fields:
      - { name: title, label: Award name · ಪ್ರಶಸ್ತಿ ಹೆಸರು, widget: string }
      - { name: givenBy, label: Given by · ನೀಡಿದವರು, widget: string, required: false }
      - { name: year, label: Year · ವರ್ಷ, widget: number, value_type: int, required: false }
      - { name: photo, label: Photo of award or certificate · ಪ್ರಶಸ್ತಿ / ಪ್ರಮಾಣಪತ್ರದ ಫೋಟೋ, widget: image, required: false }
      - { name: note_en, label: Note (English) · ಟಿಪ್ಪಣಿ (ಇಂಗ್ಲಿಷ್), widget: text, required: false }
      - { name: note_kn, label: Note (Kannada) · ಟಿಪ್ಪಣಿ (ಕನ್ನಡ), widget: text, required: false }

  # ── TESTIMONIALS ─────────────────────────────────────────
  - name: testimonials
    label: Kind words · ಅಭಿಪ್ರಾಯಗಳು
    label_singular: Testimonial · ಅಭಿಪ್ರಾಯ
    folder: src/content/testimonials
    create: true
    extension: md
    format: yaml-frontmatter
    identifier_field: name
    fields:
      - { name: name, label: Who said it · ಹೇಳಿದವರು, widget: string, hint: 'Person or committee name · ವ್ಯಕ್ತಿ ಅಥವಾ ಸಮಿತಿಯ ಹೆಸರು' }
      - { name: quote_en, label: What they said (English) · ಅವರ ಮಾತು (ಇಂಗ್ಲಿಷ್), widget: text }
      - { name: quote_kn, label: What they said (Kannada) · ಅವರ ಮಾತು (ಕನ್ನಡ), widget: text, required: false }
      - { name: place, label: Place · ಸ್ಥಳ, widget: string, required: false }
      - { name: role, label: Role · ಪಾತ್ರ, widget: string, required: false, hint: 'e.g. Trust president · ಉದಾ: ಟ್ರಸ್ಟ್ ಅಧ್ಯಕ್ಷರು' }

  # ── PAGES (About + Services) ─────────────────────────────
  - name: pages
    label: Pages · ಪುಟಗಳು
    files:
      - name: about
        label: About page · ನಮ್ಮ ಬಗ್ಗೆ ಪುಟ
        file: src/content/pages/about.md
        media_folder: /src/content/pages/_images
        public_folder: _images
        fields:
          - { name: body, label: Our story (English) · ನಮ್ಮ ಕಥೆ (ಇಂಗ್ಲಿಷ್), widget: text }
          - { name: body_kn, label: Our story (Kannada) · ನಮ್ಮ ಕಥೆ (ಕನ್ನಡ), widget: text, required: false }
          - { name: yearsExperience, label: Years of experience · ಅನುಭವದ ವರ್ಷಗಳು, widget: number, value_type: int, required: false }
          - { name: heroPhoto, label: Photo · ಫೋಟೋ, widget: image, required: false }
      - name: services
        label: Services · ಸೇವೆಗಳು
        file: src/content/pages/services.yml
        fields:
          - name: items
            label: Services · ಸೇವೆಗಳು
            label_singular: Service · ಸೇವೆ
            widget: list
            fields:
              - { name: id, label: ID (English, no spaces) · ಐಡಿ, widget: string }
              - { name: name_en, label: Name (English) · ಹೆಸರು (ಇಂಗ್ಲಿಷ್), widget: string }
              - { name: name_kn, label: Name (Kannada) · ಹೆಸರು (ಕನ್ನಡ), widget: string, required: false }
              - { name: blurb_en, label: One line about it (English) · ಒಂದು ಸಾಲು (ಇಂಗ್ಲಿಷ್), widget: string, required: false }
              - { name: blurb_kn, label: One line about it (Kannada) · ಒಂದು ಸಾಲು (ಕನ್ನಡ), widget: string, required: false }
```

**Schema alignment check (do it, don't skip):** `services.yml` as a `files`-collection list means the YAML becomes `items: [...]` — Task 3's `file()` loader expects a top-level array. Reconcile now: change `services.yml` to `items:`-keyed and the loader in `src/content.config.ts` to `file('./src/content/pages/services.yml', { parser: (text) => (parseYaml(text) as { items: unknown[] }).items })` using `import { parse as parseYaml } from 'yaml'` (add dev dep `yaml`), and update the sample file accordingly. Similarly the CMS edits `about.md`'s `body` as a plain text widget mapped to the markdown body — Sveltia's `body` field name maps to file body automatically. Verify both by opening each entry in the CMS and saving without edits: the file on disk must round-trip unchanged (`git diff` empty).

- [ ] **Step 3: Local verification (no auth needed)** — `npm run dev`, open `http://localhost:4321/admin/`, choose **"Work with local repository"** (Sveltia local mode, Chrome), grant folder access. Verify: all 4 collections appear with bilingual labels; open sample project — field order matches the plan; create a throwaway project with only title+photo, confirm file lands in `src/content/projects/` with an image in `_images/`, site rebuilds and shows it; delete the throwaway (in CMS) and confirm file removal. Run `npm run test:smoke` — still PASS.
- [ ] **Step 4:** Verify `dist/admin/index.html` is emitted on build and carries `noindex`.
- [ ] **Step 5: Commit** — `git add -A && git commit -m "feat: Sveltia CMS admin with bilingual guided forms (F10)"`

---

### Task 14: Image handling verification (F11)

Astro's `<Image>` (used in Tasks 6–9) already resizes/compresses at build; this task verifies the pipeline end-to-end with a REAL photo, since samples are SVG.

- [ ] **Step 1:** Add a real `.jpg` (any large photo, >2 MB) to a throwaway project via the CMS local mode.
- [ ] **Step 2:** `npm run build`; verify `dist/_astro/*.webp` variants exist for it and the page `<img>` has `srcset` + `width`/`height` attributes (no layout shift). Confirm original multi-MB file is NOT what ships in the page.
- [ ] **Step 3:** Remove the throwaway project; document one rule in `docs/BLUEPRINT.md` notes column for F11: owners upload phone photos as-is; the build handles size.
- [ ] **Step 4: Commit** — `git add -A && git commit -m "chore: verify image optimization pipeline with real photo (F11)"`

---

### Task 15: Deployment + onboarding runbooks (F14, F15)

**Files:**
- Create: `docs/DEPLOYMENT.md`, `docs/ONBOARDING.md`, `README.md`

- [ ] **Step 1: `docs/DEPLOYMENT.md`** — exact numbered runbook (these are manual, done per instance when Ankit is ready to go live; NOT executed by the implementing agent):
  1. Create GitHub repo (private ok) from this template; push (`git remote add origin … && git push -u origin main` — the ONE sanctioned push, done by Ankit).
  2. Cloudflare Pages → Create project → connect repo. Build command `npm run build`, output `dist`, Node 20.
  3. GitHub OAuth app (Settings → Developer settings): callback `https://<auth-worker>.workers.dev/callback`; note client id/secret.
  4. Deploy sveltia-cms-auth: `npx wrangler deploy` from a clone of `github.com/sveltia/sveltia-cms-auth` with `GITHUB_CLIENT_ID`/`GITHUB_CLIENT_SECRET` set via `wrangler secret put`, and `ALLOWED_DOMAINS` set to the Pages domain.
  5. Fill `backend.repo` and `backend.base_url` in `public/admin/config.yml`; commit.
  6. Per-instance checklist: edit `site.config.ts` (name/tagline/owners/phone/whatsapp/region/url/theme/languages), delete `(Sample)` content, add real content, custom domain later via Pages → Custom domains.
- [ ] **Step 2: `docs/ONBOARDING.md`** — owner phone setup: create/borrow GitHub account (Ankit does it), grant repo access, open `/admin` in Chrome, sign in once, **Add to Home Screen**, then a picture-book style walkthrough (add project → form → save → wait 1 minute → see it live), written in simple English + Kannada line-by-line. Include "if something looks wrong, call Ankit — nothing is ever lost" (git history).
- [ ] **Step 3: `README.md`** — 10 lines: what this is, `npm run dev/build/test`, pointers to BLUEPRINT/ADRs/DEPLOYMENT.
- [ ] **Step 4:** Full final gate: `npm run check && npm run test:smoke` → all PASS. Update ALL ledger rows + work log in `docs/BLUEPRINT.md`.
- [ ] **Step 5: Commit** — `git add -A && git commit -m "docs: deployment and owner onboarding runbooks (F14, F15)"`

---

## Self-review notes (done at plan time)

- **Spec coverage:** F1→T1/T3, F2→T4/T11, F3→T6, F4→T7, F5→T8, F6/F7/F8→T9 (+sticky bar T4), F9→T2/T5 (+per-page pairs), F10→T13, F11→T14, F12→T10, F13→T12, F14/F15→T15. Testimonials-on-home (spec) in T6. ✔
- **Type consistency:** field names in CMS config (T13) checked against zod schema (T3): `description_en/kn`, `facts.{duration,teamSize,ledBy,status}`, `beforeAfter.{before,after}`, `note_en/kn`, `quote_en/kn`, services `items[].{id,name_en,name_kn,blurb_en,blurb_kn}` — matching; services loader reconciliation is an explicit step in T13.
- **Known risk flagged:** exact Sveltia per-collection media folder & `files`-collection body mapping behaviors must be verified live in T13 Step 3 (round-trip check is the gate). Astro API names (`glob`/`file` loaders, `render()`) current as of Astro 5; `npm run check` gates drift.
