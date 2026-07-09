# ADR-0006: Theme presets as CSS custom properties

**Status:** Accepted (2026-07-09)

## Context

The look must be modern, minimal, traditional-temple in feel, not flashy — and swappable per relative (white-label). During brainstorming three directions were mocked up; **"Warm Stone" (A)** was chosen as the default over "Heritage Terracotta" (B) and "Modern Ink" (C).

## Decision

Themes are **presets of CSS custom properties** (colors, accent motif, typography scale) selected by name in `site.config.ts`. All components style against variables (`--color-bg`, `--color-accent`, `--motif`, …), never literal colors.

Presets:
- **`stone` (default, chosen):** cream/sand background evoking laterite and old paper, deep maroon accent, gold hairline ❖ dividers, serif headings.
- **`terracotta`:** deep terracotta hero/header, turmeric-gold accents, temple-roofline motif.
- **`ink`:** near-white, charcoal text, single saffron accent line; maximum minimal.

All presets share the same layout, spacing, and mobile-first behavior — a theme changes mood, not structure.

## Alternatives considered

1. **Single hardcoded theme** — simplest, but breaks the white-label requirement. Rejected.
2. **Tailwind theme configs** — workable, but adds a framework dependency and build-time theme lock-in for little gain; custom properties are zero-dependency and inspectable. Rejected.
3. **CMS-editable colors** — invites accidental illegible/garish combinations by non-technical owners; themes are Ankit's concern via config. Rejected.

## Consequences

- Rule for all future styling: **no literal brand colors in components** — variables only.
- New theme = one CSS file defining the variable set; no template changes.
- `stone` is built first (F2); `terracotta` and `ink` follow once layouts are stable.
