# ADR-0003: Sveltia CMS for admin

**Status:** Accepted (2026-07-09)

## Context

The owner-facing admin must be: a simple form with photo upload usable on a phone by semi-literate users, free, serverless (writes to the git repo), and configurable with bilingual (English + Kannada) field labels.

## Decision

Use **Sveltia CMS** mounted at `/admin`, GitHub backend.

## Reasons

- Modern, actively maintained drop-in successor to Decap/Netlify CMS — same config format, far better mobile UX (critical: owners will use phones).
- Pure static asset — one HTML page + JS bundle served by the same static host; no server, no cost.
- Media upload straight from phone gallery into the repo; images optimized later at build (owner never resizes anything).
- Collections/fields defined in one YAML config — matches our content model exactly; labels can be written bilingual.
- Every save is a git commit → history, recoverability, Ankit oversight.

## Alternatives considered

1. **Decap CMS (formerly Netlify CMS)** — the incumbent, but sluggish maintenance and poor mobile experience; Netlify Identity (its easy-auth path) is deprecated. Rejected.
2. **TinaCMS** — nice editing UX but pushes toward its paid cloud for auth/media; heavier integration. Rejected.
3. **Pages CMS / Keystatic** — viable, smaller ecosystems; Sveltia's mobile UX and Decap-compatible config won. Rejected.

## Consequences

- Auth is via GitHub — each owner needs a GitHub identity signed in once on their phone (one-time setup by Ankit, then it persists). An OAuth helper (e.g. a tiny Cloudflare Worker or Sveltia's documented auth options) is needed since we're not on Netlify; this is part of feature F10.
- If Sveltia ever dies, the content is plain files — any Decap-compatible CMS or manual editing still works. No lock-in.
