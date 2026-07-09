# ADR-0005: White-label via one site config per instance

**Status:** Accepted (2026-07-09)

## Context

The same website must be reusable for multiple relatives: different name, contacts, region, theme, languages, and content — with no code changes. "Whose site this is" must be changeable easily.

## Decision

All identity/branding lives in a single **`site.config.ts`** per instance: business name, tagline, owner name(s), phone, WhatsApp, address/region, optional email, optional logo path, theme preset name, enabled languages. Templates read exclusively from this config — no names, numbers, or branding hardcoded anywhere else. Content lives in `content/` and is instance-specific by nature.

A new relative's site = new repo from the template + edit `site.config.ts` + their own `content/` + connect to hosting (~15 minutes).

## Alternatives considered

1. **One repo, multiple config files + build flag** — single codebase to maintain, but content of all relatives mixed in one repo, CMS would show everyone's content to everyone, deploys entangled. Rejected.
2. **Monorepo with per-site folders** — cleaner separation than (1) but still couples deploys and CMS scoping; overkill for 2–3 sites. Rejected.
3. **Template repo + repo-per-relative (chosen)** — full isolation of content, CMS access, domains, and deploys. Cost: template improvements must be pulled into instances (acceptable at this scale; instances rarely need code updates once stable).

## Consequences

- Rule for all future code: **if it identifies a person or business, it comes from `site.config.ts`.** Sample/placeholder config ships with the template.
- Site settings are deliberately NOT exposed in the CMS — only Ankit edits config, directly in the repo.
- Theme switching is a one-word config change (see ADR-0006).
