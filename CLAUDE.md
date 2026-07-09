# Temple Construction Showcase Website

White-label static site (Astro + Sveltia CMS + Cloudflare Pages) showcasing a traditional temple/pond construction contractor's work. Owners are non-technical; simplicity and stability trump everything.

## Source of truth — read before working

- **`docs/BLUEPRINT.md`** — project overview, architecture, feature ledger, work log. Read it first.
- **`docs/adr/`** — one record per decision, with reasons and rejected alternatives.
- **`docs/superpowers/specs/`** — approved design specs.

## Documentation workflow (mandatory)

1. **Before implementing any feature:** update its entry in the BLUEPRINT feature ledger — status `in progress` + a line on intent/plan. If the work involves a new decision with lasting consequences, write a new ADR first.
2. **After implementing:** update the ledger entry — status `done`, what was actually done, any deviation from plan, how it was verified. Append a dated line to the work log.
3. ADRs are amended, never rewritten; superseding decisions get a new numbered ADR linking back.

## Hard rules (from ADRs)

- Anything identifying a person/business comes from `site.config.ts` — never hardcoded (ADR-0005).
- No literal brand colors in components — theme CSS custom properties only (ADR-0006).
- Every optional content block is guarded — never render a label/wrapper without checking data exists. Project minimum is title + 1 photo; all else optional (ADR-0007).
- No hardcoded UI text — all strings via per-language strings files; English fallback (ADR-0008).
- Client JS is enhancement-only; every page must work with JS disabled (ADR-0007).

## Git

- Local-only for now — **do not push to any remote** unless Ankit asks.
- Author: ankitv <ankit.vashe@gmail.com> (set in local git config).
