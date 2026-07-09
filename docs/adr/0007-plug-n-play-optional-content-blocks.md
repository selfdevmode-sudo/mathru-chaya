# ADR-0007: Plug-n-play optional content blocks

**Status:** Accepted (2026-07-09)

## Context

Owners will fill forms inconsistently — some projects will have only a title and a photo; others everything (description, materials, team facts, map, video, before/after). Ankit's explicit requirement: "make everything plug-n-play so nothing breaks if one is not available; add error boundaries."

## Decision

**Contract: a project needs only a title and one photo. Every other field is optional, and a missing field means its block is not rendered at all** — no empty headings, no gaps, no broken layout. Enforced at three layers:

1. **Schema (build time):** zod schemas mark optional fields optional with sane types; malformed content fails the build with a clear message (and the previous deploy stays live, ADR-0004).
2. **Template guards (render time):** every optional block is wrapped in an existence check; a facts grid hides entirely when all its fields are empty; missing image files are build errors, not broken `<img>`s.
3. **External embeds (browser):** map previews and video embeds are lazy-loaded and failure-isolated — if the third party is unreachable, the block collapses silently instead of showing a broken box. Client JS (lightbox, filters, slider) is enhancement-only; the site works with JS disabled.

Verified by smoke tests (F13): build fixture projects in **minimal** (title + 1 photo) and **maximal** (every field) form and assert both render correctly.

## Alternatives considered

1. **Require more fields in the form** — cleaner data but raises friction for exactly the users who must find this easy. Rejected.
2. **Render placeholders ("No description yet")** — reads as neglect on a public showcase site. Rejected.
3. **Client-side error boundaries (React-style)** — wrong layer for a static site; the equivalent here is build-time validation + template guards + isolated embeds, which is what we do.

## Consequences

- Rule for all future templates: **never render a label or wrapper without checking its data exists.**
- Adding a new optional field = schema field + guarded block + a line in both fixtures.
