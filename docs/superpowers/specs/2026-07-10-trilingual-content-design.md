# Trilingual content — design spec

**Date:** 2026-07-10
**Status:** approved
**Decision record:** [ADR-0009](../../adr/0009-content-translations-as-optional-sidecar.md)

## Problem

The interface is trilingual (ADR-0008); the content is not. `/kn/` renders
Kannada nav and headings around English project titles and descriptions. Switching
language on the public site must switch *everything* that has a translation.

## Scope

**In.** Optional Kannada and Hindi values for the prose fields listed below, an
admin UI to enter them, and per-field fallback to English on the public site.

**Out.** Auto-translate (deliberately deferred — see "Later"). Translating proper
nouns, contact details, links, years, photos, or `slug`. Any change to how the
static site is generated.

### Translatable fields

| Record | Fields |
|---|---|
| `Project` | `title`, `place`, `builtFor`, `description`, `materials`, `duration`, `teamSize`, `status` |
| `Award` | `title`, `givenBy`, `note` |
| `Testimonial` | `quote`, `role`, `place` |
| `About` | `body` |
| `SiteInfo` | `tagline`, `region` |
| `Service` | `name`, `blurb` |

Explicitly **not** translatable: `site.name`, `site.owners`, `project.ledBy`,
`testimonial.name` (proper nouns); `phone`, `whatsapp`, `email`, `mapLink`,
`videoLink` (contact/links); `year`, `photos`, `beforeAfter`, `featured`, `type`,
`id`, `slug` (no language, or already translated via `typeLabel`).

`Service` has no admin form today and gains none here. It is localized on read so
that a hand-edit of `content.json` works, and so it is not the odd one out when a
services form is eventually added.

## Data model

Per ADR-0009: an optional `i18n?: { kn?: T; hi?: T }` sidecar on each record,
where `T` is `Partial<Pick<Record, …translatable keys>>`. English stays required
at the top level. The existing `data/content.json` is already valid — no
migration.

## Reading (public site)

`lib/localize.ts` exports one function per record type, each built on a shared
overlay helper:

```ts
localizeProject(project, lang)  // lang === "en" → returned unchanged
```

Rules:

- **Per field, not per record.** A Kannada title with no Kannada description
  yields the Kannada title and the English description.
- **Empty means absent.** `""` and whitespace-only translations fall back to
  English. Do not use `??` — it returns `""`. Use an explicit non-empty check.
  (This is the `pickText` bug from the Astro build, caught in review.)
- **Arrays** (`materials`) fall back whole: a Kannada `materials` array either
  replaces the English one or is absent. Element-wise merging would pair up
  unrelated items.
- Called once, in the server component, before data reaches any client
  component. `ProjectGrid` and friends need no changes and must never import
  `lib/i18n.ts`'s runtime (it pulls in `next/headers`).

## Writing (admin)

Each affected form grows two collapsed `<details>` panels, after the English
fields and before Save:

```
> ಕನ್ನಡ translation            (3 of 8 filled)
> हिंदी translation            (empty)
```

- `<details>` is plain HTML — no JavaScript, no hydration. Satisfies the no-JS
  rule (ADR-0007) and matches the existing mobile-nav idiom.
- Only translatable fields repeat inside a panel. A project panel shows eight
  inputs, not fifteen.
- The summary shows a fill count so untranslated records are visible without
  opening anything.
- Each panel carries one line of help: *leave a field empty to show the English
  text*.
- Inputs are named `kn.title`, `hi.description`, … The server action collects
  them with a shared helper that drops empty values, so **clearing a box removes
  the translation** and the site falls back. No "remove translation" checkbox is
  needed (unlike the award photo, which is a file and has no empty state).

Panel labels come from the strings file like all other UI text (ADR-0008); they
render in whatever language the *admin interface* is set to. The admin's own
language switcher and these content panels are independent: switching the admin
to Kannada relabels the panels, it does not hide or reorder them.

Five forms change: project, award, testimonial, about, settings (`tagline` and
`region` only).

## Error handling

- A record with no `i18n` key behaves exactly as today.
- An `i18n` key for an unknown language is ignored on read.
- A translation object containing only empty strings is equivalent to no
  translation, on both read and write.
- Nothing throws on malformed `i18n`; the worst case is English.

## Verification

1. `/kn/projects/<slug>/` shows the Kannada title and description after entering
   them; `/hi/` still shows English for the same project.
2. Clear the Kannada description, keep the Kannada title → `/kn/` shows Kannada
   title + English description (per-field fallback).
3. Enter a single space as a translation → English renders (empty-means-absent).
4. A record with no `i18n` at all renders exactly as before the change.
5. The pre-existing `data/content.json`, untouched, loads and renders.
6. Admin forms submit and round-trip with JavaScript disabled.
7. `npm run generate` produces the same page count, with Kannada content in
   `out/kn/**`.

## Later (not in this change)

An auto-translate button per panel, filling the Kannada and Hindi boxes for
review. Free backends exist — Bhashini (Indian government, best Indic quality,
needs a free API key) and MyMemory (no signup, weaker on temple vocabulary). The
button is pure convenience: the English fallback and manual entry built here are
what make it safe to add or remove later.
