# ADR-0009 — Content translations as an optional `i18n` sidecar

- **Status:** accepted
- **Date:** 2026-07-10
- **Supersedes:** nothing. Extends [ADR-0008](0008-multilingual-static-routes.md).

## Context

ADR-0008 gave the site three languages, but only for *interface* strings — nav
labels, buttons, section headings. The content itself (project titles,
descriptions, award notes, the About story) stayed English. A visitor on `/kn/`
therefore reads Kannada chrome wrapped around English content: a half-translated
page.

The owner must be able to supply Kannada and Hindi versions of that content from
the admin, and the site must keep working when they haven't.

Two constraints shape the decision:

1. `data/content.json` already exists and holds the live content. Any change
   that invalidates it needs a migration, and silently breaks any older backup
   the owner restores.
2. English must never be able to go missing. It is the fallback for everything.

## Decision

Translations hang **off the side** of each record in an optional `i18n` map,
keyed by language. The existing English fields stay exactly where they are, at
the top level, and stay required:

```ts
interface Project {
  title: string;            // English. Required. Unchanged.
  description?: string;     // English. Unchanged.
  // ...
  i18n?: { kn?: ProjectTranslation; hi?: ProjectTranslation };
}

type ProjectTranslation = Partial<
  Pick<Project, "title" | "place" | "builtFor" | "description"
              | "materials" | "duration" | "teamSize" | "status">
>;
```

Public pages call `localize(record, lang)` once, on the server, which overlays
`record.i18n[lang]` onto `record` and returns the same shape. `lang === "en"`
returns the record untouched.

**Fallback is per field, not per record.** A project with a Kannada title but no
Kannada description renders the Kannada title above the English description. One
empty box must never revert a whole record to English.

**An empty or whitespace-only translation counts as absent.** `localize` must
not use `??`, which only catches `null`/`undefined` and would happily return
`""` — this is the exact bug that shipped in the earlier Astro build's
`pickText` and had to be fixed under review.

Translatable fields are the prose ones. Proper nouns (`site.name`, `owners`,
`ledBy`, testimonial `name`), identifiers (`slug`), contact details (`phone`,
`whatsapp`, `email`), links, years, and photos are single-value and get no
`i18n` entry.

`slug` continues to be derived once, at create time, from the English title. URLs
stay ASCII and stable regardless of what translations are added later.

## Consequences

**Good.**

- The current `data/content.json` is already valid under the new types. No
  migration script, no rewrite, and an old backup still restores cleanly.
- Nothing that reads a record today breaks: `project.title` still means what it
  always meant.
- English cannot go missing, because it is not optional in the type.
- Translations ship incrementally. The site is never in a broken half-state; it
  simply shows more Kannada as more boxes get filled.
- Client components are unaffected — they receive already-localized data from
  their server parent, so no `next/headers` leaks into a client bundle.

**Bad.**

- Two places describe the same field (`Project.title` and
  `ProjectTranslation.title`). Adding a translatable field means touching both.
  Mitigated by deriving the translation type from the record type with
  `Partial<Pick<…>>`, so the field types can never drift apart.
- A record's data is spread across two objects, so reading raw `content.json` is
  slightly less direct than one flat `{en, kn, hi}` per field.

## Alternatives rejected

**Per-field language objects** (`title: { en, kn, hi }`). The obvious shape, and
the one most CMSs use. Rejected because it rewrites every type, every public
page, and every admin form at once, invalidates the existing `content.json`, and
demands a migration script plus a story for restoring old backups. It also makes
English structurally optional (`title.en` can be undefined), which is exactly the
failure we cannot allow.

**Separate per-language content files** (`content.kn.json`). Clean isolation, but
it duplicates every non-translatable field (photos, links, years) across three
files, and they drift out of sync the moment someone edits one and not the
others.

**Translate at build time, store English only.** No admin clutter at all: the
static generator would machine-translate the whole site as it builds. Rejected
because the owner never sees or corrects the output before it is published, and
every regenerate re-translates — cost, drift, and no way to fix a bad rendering
of a temple term.
