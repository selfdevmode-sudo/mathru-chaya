# Shri Builders — website + admin

A Next.js 15 (App Router) site for a temple/pond construction contractor, with a
password-protected admin at `/admin` for editing content. No database, no
external CMS — everything lives on the filesystem of whatever host runs this.

## Running locally

```bash
npm install
npm run dev
```

Visit http://localhost:3000 for the public site and http://localhost:3000/admin
for the admin (password `temple123` by default, see `.env`).

## How content is stored

- All site content (site info, projects, awards, testimonials, services,
  about) lives in **`data/content.json`**, a single JSON file. It ships
  tracked in git with seed content so the site has something to show out of
  the box. Every admin save **edits this file in place** on the server's
  disk — there is no database and no build step required to see changes.
- Uploaded images are written to **`public/uploads/`** and served directly
  from there. This folder is gitignored (except `.gitkeep`) since uploads are
  runtime data, not source code.

## Hosting requirement

This app must run on a **Node.js server with a persistent, writable disk**
(e.g. a VPS, Docker volume, Render/Railway/Fly.io persistent instance). It is
**not** compatible with static export or typical serverless/edge hosting
(e.g. Vercel's default deployment, Netlify) because the admin writes to
`data/content.json` and `public/uploads/` at request time — those
platforms' filesystems are read-only or ephemeral per-request.

## Auth

A single shared admin password (`ADMIN_PASSWORD` in `.env`) protects
`/admin/*`. On login, a cookie is set to the value of `SESSION_SECRET`;
`middleware.ts` checks that cookie on every `/admin/*` request. Change both
values in `.env` before deploying — see `.env.example`.
