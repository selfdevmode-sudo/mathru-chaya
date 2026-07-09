# ADR-0008: Multilingual via static routes with English fallback

**Status:** Accepted (2026-07-09)

## Context

Audience is in coastal Karnataka: English primary, Kannada secondary, Tulu/Tamil possibly later. Owners can't be expected to translate everything; the site must never look half-translated or broken.

## Decision

- English at root routes (`/projects/...`), Kannada at prefixed static routes (`/kn/projects/...`), generated at build — the language toggle is a plain link, **no JS required**.
- **UI chrome** (nav, headings, block labels, about-page framing) comes from per-language strings files; enabled languages are a `site.config.ts` switch. Adding Tulu/Tamil later = one new strings file + config entry.
- **Free-text content** (descriptions, about body) has optional per-language fields in the CMS form; **when a translation is absent, the English text is shown** on the Kannada page — plug-n-play, consistent with ADR-0007.

## Alternatives considered

1. **Client-side translation toggle (JS swaps strings)** — breaks the JS-optional principle, bad for SEO, flashes wrong language. Rejected.
2. **Full translation requirement per record** — unrealistic for the owners; would block publishing. Rejected.
3. **English-only now, retrofit later** — retrofitting i18n routing into templates is far costlier than building routes/strings in from the start; Kannada was requested from day one. Rejected.

## Consequences

- Every template string goes through the strings file from the first line of code — no hardcoded UI text.
- Kannada pages may show mixed-language content (Kannada chrome, English description) by design; this is the accepted trade-off vs. blocking publication.
- CMS field labels are bilingual (English + Kannada) independent of site languages.
