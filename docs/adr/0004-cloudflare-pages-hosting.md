# ADR-0004: Cloudflare Pages hosting

**Status:** Accepted (2026-07-09)

## Context

Budget is "free for now, maybe a custom domain later". Hosting must auto-build on git push, be reliable long-term, fast from India, and safe against bad content edits taking the site down.

## Decision

Host on **Cloudflare Pages** free tier. Start on `<name>.pages.dev`; attach a custom domain per relative later.

## Reasons

- Free tier is generous (unlimited bandwidth/requests, 500 builds/month) with no sleep/cold-start — genuinely free forever for a site like this.
- **Failed builds keep the previous deploy live** — a malformed content edit can never take the site down; combined with build-time validation (ADR-0002) this is the core stability story.
- Excellent edge presence in India → fast for the actual audience.
- A tiny Cloudflare Worker (free) can host the GitHub OAuth callback Sveltia needs (ADR-0003) — same platform, one account.
- Custom domains are a config change later, no migration.

## Alternatives considered

1. **Netlify** — equivalent developer experience; free tier now caps bandwidth/credits and its Identity service is deprecated; slightly weaker India edge. Close second. Rejected.
2. **GitHub Pages** — free and stable but no build-failure protection semantics as clean, clunkier custom build pipeline (Actions), no OAuth helper story. Rejected.
3. **Paid VPS/shared hosting** — cost + maintenance with zero benefit for a static site. Rejected.

## Consequences

- Project needs a Cloudflare account (Ankit's); each relative's site is a separate Pages project pointing at their repo.
- Build environment is Cloudflare's (Node); pinned versions in the repo keep builds reproducible.
