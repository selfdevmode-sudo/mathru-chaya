# ADR-0001: Static site + git-based CMS

**Status:** Accepted (2026-07-09)

## Context

The site owners are traditionally trained builders, not comfortable with technology, but must be able to add projects/awards themselves via a simple form with photo upload. At the same time the site must be static, stable, free to run, and maintainable for years with near-zero attention. There is no customer-facing login or dynamic data.

## Decision

Build a fully static site whose content lives as files (markdown/YAML + images) in a GitHub repo, with a **git-based CMS** (form UI at `/admin`) that writes commits on the owners' behalf. Hosting rebuilds automatically on every commit.

## Alternatives considered

1. **Google Sheets + Drive as backend** — familiar tools, but linking photos to rows is fiddly and error-prone for non-technical users; a spreadsheet is harder than a guided form; needs a scheduled build pipeline. Rejected.
2. **Dynamic CMS (WordPress / PocketBase on a VPS)** — best admin UX out of the box, but introduces a server, security updates, backups, and hosting cost — the opposite of "static and stable, set-and-forget". Rejected.
3. **Ankit updates everything manually** — simplest tech, but makes Ankit a permanent bottleneck; owners explicitly should be self-sufficient. Rejected (though Ankit retains full control via git anyway).

## Consequences

- Site itself can never go down due to admin problems — the CMS is a separate layer on top of static files.
- Every content change is a git commit: full history, everything recoverable.
- One-time per-owner setup burden (GitHub auth on their phone) falls on Ankit.
- Content edits take ~1 minute to go live (build time), which is acceptable.
