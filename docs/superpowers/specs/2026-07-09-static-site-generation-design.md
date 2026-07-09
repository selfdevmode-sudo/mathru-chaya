# Static Site Generation — Design

**Date:** 2026-07-09
**Branch:** `static-site` (the stable server version stays on `main`, tag `server-version`)
**Status:** Awaiting review

## Purpose

Let the existing site be hosted on **free static hosting** (Cloudflare Pages) at **$0/month with no server**, while keeping the current admin fully intact for editing.

Operating model (decided with Ankit): **Ankit edits and publishes.** He runs the app on his own laptop, edits content in the existing admin, runs one command to produce a static `out/` folder, and uploads that folder to Cloudflare Pages. The non-technical relative is not in this loop, so there is **no portable double-click bundle and no in-admin "generate" button** — those were the hard parts and are explicitly out of scope.

## Why any change is needed at all

The current public pages are **not static** as they stand: they read `data/content.json` at request time (`force-dynamic`) and pick the language from a **cookie** read on the server. A static host only serves files — there is no server to do either. So the site must be *turned into static files*, and the cookie-based language switch must become something that works without a server. Just "disabling the admin" is not enough.

## Scope

**In scope (the whole change):**
1. Make the language switcher work without a server (URL-based).
2. Add a `npm run generate` command that outputs a ready-to-upload static `out/` directory.
3. Short deployment notes for Cloudflare Pages.

**Explicitly out of scope:** portable bundle, in-admin generate button, non-technical publish UX, rebuilding the admin, changing the content model / data storage / Docker files. The admin, styling, and everything on `main` stay as they are.

## Architecture

Keep the current Next.js server app **exactly as it is** (admin with server actions, cookie-based i18n, `force-dynamic` public pages). We do **not** fight Next's static-export limitations (server actions are incompatible with `output: 'export'`). Instead we generate the static site by **snapshotting** the locally-running app.

Two changes:

### 1. Language switcher → link-based (one component)

`components/LanguageSwitcher.tsx` becomes a client component that uses `usePathname()` to render **links** to the language-prefixed version of the current page, instead of setting a cookie and reloading:

- English → no prefix: `/projects/kaat-boggi`
- Kannada → `/kn/projects/kaat-boggi`
- Hindi → `/hi/projects/kaat-boggi`

It computes the target URL by stripping any existing `/kn` or `/hi` prefix from the current path and adding the chosen one. This is what makes language switching work on a static host: each language is a distinct pre-rendered URL, and switching is a plain link.

The **pages keep their current cookie-based rendering** (`getLang()`), which the generator drives at snapshot time (below). No route restructuring, no `[lang]` folder, no removal of `force-dynamic`. Note: these prefixed links only resolve on the *deployed static site* (where the generator created the `/kn` and `/hi` folders), not on the plain local app — acceptable, since local use is for editing via the admin, not browsing languages.

### 2. `scripts/generate.mjs` + `npm run generate` (new)

Produces the static `out/` directory:

1. `next build`, then start the production server (`next start`) on a local port.
2. Read `data/content.json` to get every project slug.
3. For every public path — `/`, `/projects`, each `/projects/<slug>`, `/awards`, `/about`, `/contact`, and a 404 — and for each language **en / kn / hi**, `fetch` the page from the local server **with the matching `lang` cookie** and save the returned HTML to:
   - English → `out/<path>/index.html`
   - Kannada → `out/kn/<path>/index.html`
   - Hindi → `out/hi/<path>/index.html`
4. Copy `.next/static` → `out/_next/static` and `public/` → `out/` (so the CSS, fonts, client JS, and uploaded images come along). Save the 404 HTML as `out/404.html`.
5. Stop the server; print the path to `out/`.

The admin routes are never fetched, so `out/` contains **no admin** — the hosted site is purely the public pages. Config: set `trailingSlash: true` (on this branch only) so `/projects/foo/` maps cleanly to `index.html` on static hosts.

## Data flow

```
Ankit's laptop:  npm start (admin)  ──edit──▶  data/content.json + public/uploads/
                        │
                 npm run generate  ──snapshot──▶  out/  (static: html + _next + uploads)
                        │
                 upload out/  ──▶  Cloudflare Pages (free, static)  ──▶  public visitors
```

`main` (server version) is untouched and remains deployable to a Node host if ever wanted.

## Deployment

`docs/DEPLOY-STATIC.md` (new, short): run `npm run generate`; then either drag the `out/` folder onto the Cloudflare Pages dashboard, or `npx wrangler pages deploy out`. Buy a domain later if desired; the free `*.pages.dev` URL works immediately with HTTPS.

## Testing

- Run `npm run generate`; assert `out/` contains: `index.html` (English), `kn/index.html`, `hi/index.html`, `projects/<slug>/index.html` for each sample project (× languages), `awards/`, `about/`, `contact/`, `404.html`, `_next/static/…`, and the uploaded images under the copied `public` paths.
- Serve `out/` with a pure static server (`npx serve out`) — **no Node backend** — and verify: pages render, images show, the theme/fonts load, the language links navigate to the correctly pre-rendered language, and there is no `/admin`.
- Grep the served static HTML for `undefined`/`null` leaks (plug-n-play still holds).

## Risks / accepted trade-offs

- The static pages carry Next's client JS chunks (fine at this traffic). Page-to-page navigation on the static host does full reloads rather than client-side transitions — acceptable.
- The language links resolve only on the deployed static site, not the local editing app (cosmetic; Ankit edits via the admin).
- If Next's snapshot output ever proves fragile, the fallback is the heavier "proper `output: 'export'` + separate admin" route — not needed for this scope.
