# Deployment runbook

This is a one-time setup per instance (per relative's site), performed by Ankit when that
person is ready to go live. Every step below is **manual** — none of it has been run yet for
this repo, which is currently local-only with no git remote.

Reference facts (verified against this repo):

- Build command: `npm run build` (runs `astro build`)
- Build output directory: `dist`
- Node version: `20` (see `.nvmrc`)
- Identity/branding lives in `site.config.ts` (`name`, `tagline`, `owners`, `phone`, `whatsapp`,
  `email?`, `region`, `url`, `logo?`, `theme`, `languages`)
- CMS backend config lives in `public/admin/config.yml`; it currently has two placeholders
  marked with `# PLACEHOLDER` comments: `backend.repo: OWNER/REPO` and
  `backend.base_url: https://sveltia-cms-auth.WORKER.workers.dev`
- Sveltia CMS is pinned to `0.170.4` in `public/admin/index.html` (unpkg CDN, no floating tag)

---

## 1. Create the GitHub repo and push (the one sanctioned push)

1. On github.com, create a new empty repository (private is fine) — do **not** let GitHub add an
   initial commit for you: leave "Add a README file", "Add .gitignore", and "Choose a license"
   **unchecked**. This repo already has its own `README.md` and `.gitignore`; it has **no** license
   file — if you want one, add it separately later so it doesn't create a conflicting initial
   commit that would block the push below. (An initial commit created by GitHub will conflict with
   the push and force a merge — avoid it entirely by creating the repo empty.)
2. **The site's production branch on GitHub must be `main`, and all the site code must be on it
   before you push** — that means `package.json`, `src/`, `astro.config.ts`, and `public/` (a
   `main` that has only docs/config and no `package.json`/`src/` will fail the Cloudflare build).
   In the normal case, the completed work has already been consolidated onto your local `main`.
   From this project's working directory:
   ```
   git checkout main
   ls                                              # confirm package.json AND src/ are listed
   git remote add origin git@github.com:OWNER/REPO.git
   git push -u origin main
   ```
   (Substitute the actual GitHub owner/org and repo name. This is the only push this project
   should ever need for its history to leave the local machine — everything after this point,
   content edits included, is a normal commit + push or a Sveltia-CMS-generated commit.)

   **If your completed work is on a feature branch (e.g. `build-website`) rather than `main`:**
   first bring it onto `main` — `git checkout main && git merge build-website` — or push it
   explicitly as `main` with `git push -u origin build-website:main`. Either way, before you
   configure Cloudflare, verify the remote `main` actually has the code:
   ```
   git ls-tree --name-only origin/main             # must list package.json and src/
   ```
   (or check the file list on the GitHub repo page — `package.json` and `src/` must be visible).
3. Confirm on github.com that the default branch is `main`, that its file list includes
   `package.json` and `src/`, and that the push succeeded.

## 2. Cloudflare Pages — create the project

1. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
2. Select the repo created in Step 1.
3. Build settings:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Root directory:** `/` (repo root)
   - **Node version:** `20` — set the `NODE_VERSION` environment variable to `20` in the Pages
     project's build settings (Cloudflare respects `.nvmrc` in some cases, but setting it
     explicitly is safer and matches this repo's pinned `20`).
4. Save and deploy. First build should produce the site at `<project-name>.pages.dev`.
5. Once the deploy succeeds, note the `.pages.dev` URL — it's needed in Step 4 (`ALLOWED_DOMAINS`)
   and should be set as `site.url` in `site.config.ts` (Step 6) before the next content commit,
   since `Seo.astro`/canonical URLs/OG images are all derived from `site.url`.

## 3. GitHub OAuth app (for Sveltia CMS login)

Sveltia CMS authenticates against GitHub via an OAuth App plus a small auth relay (Step 4). The
OAuth app itself is created once per instance:

1. GitHub → account **Settings** → **Developer settings** → **OAuth Apps** → **New OAuth App**.
2. Fill in:
   - **Application name:** anything recognizable, e.g. `<Site Name> CMS Auth`
   - **Homepage URL:** the Pages URL from Step 2 (e.g. `https://<project-name>.pages.dev`)
   - **Authorization callback URL:** `https://<auth-worker-name>.<subdomain>.workers.dev/callback`
     (the worker's URL from Step 4 — if the worker isn't deployed yet, come back and edit this
     field after Step 4 once the real worker URL is known)
3. Register the app. Note the **Client ID**, then generate and note a **Client Secret** — both
   are needed in Step 4. Treat the secret like a password (do not commit it anywhere).

## 4. Deploy the `sveltia-cms-auth` Cloudflare Worker

Sveltia CMS needs an OAuth auth relay to complete the GitHub login handshake. Sveltia's
documented option is the `sveltia-cms-auth` worker (`github.com/sveltia/sveltia-cms-auth`):

1. Clone it: `git clone https://github.com/sveltia/sveltia-cms-auth.git` (a separate clone,
   outside this project — it's a standalone worker, not part of this repo).
2. `cd sveltia-cms-auth`, install deps, then deploy: `npx wrangler deploy`.
   - This requires a Cloudflare account logged in via `wrangler login` (or an API token) —
     use the same Cloudflare account as the Pages project in Step 2.
3. Set the two secrets from Step 3 on the deployed worker:
   ```
   npx wrangler secret put GITHUB_CLIENT_ID
   npx wrangler secret put GITHUB_CLIENT_SECRET
   ```
   (Each command prompts for the value interactively — paste the Client ID / Client Secret
   from Step 3.)
4. Set the allowed-domains restriction so the worker only serves auth for this site — per the
   worker's own config (environment variable or `wrangler.toml` var, per its README at deploy
   time): `ALLOWED_DOMAINS` = the Pages domain from Step 2 (e.g. `<project-name>.pages.dev`).
5. Note the worker's deployed URL, e.g. `https://sveltia-cms-auth-<name>.<subdomain>.workers.dev`.
   - If the GitHub OAuth app's callback URL (Step 3) was a placeholder, go back and set it to
     `<that worker URL>/callback` now.

## 5. Fill in the CMS backend placeholders and commit

Edit `public/admin/config.yml`:

```yaml
backend:
  name: github
  repo: OWNER/REPO            # ← replace with the real GitHub owner/repo from Step 1
  branch: main
  base_url: https://sveltia-cms-auth.WORKER.workers.dev  # ← replace with the worker URL from Step 4
```

Commit and push this change:
```
git add public/admin/config.yml
git commit -m "chore: set CMS backend repo and auth worker URL for deploy"
git push
```
Cloudflare Pages will auto-build and deploy on this push (it now watches the `main` branch from
Step 2).

## 6. Per-instance checklist

Before (or shortly after) going live, work through this checklist so the site reflects the real
person/business rather than the template defaults:

- [ ] Edit `site.config.ts`:
  - `name` — the business/person's name (currently `Shri Builders`)
  - `tagline` — one line describing the work
  - `owners` — array of owner name(s) (currently `['Owner Name']`)
  - `phone` — E.164 format with `+`, e.g. `+919800000000`
  - `whatsapp` — digits only, no `+`, e.g. `919800000000`
  - `email` — optional; add only if the owner wants an email contact link
  - `region` — e.g. `"Udupi, Karnataka"`
  - `url` — the real canonical URL (the `.pages.dev` URL from Step 2, or the custom domain once
    attached) — this feeds every canonical link and OG image
  - `logo` — optional path under `/public`; omit to use the text-monogram fallback
  - `theme` — one of `stone` (default), `terracotta`, `ink`
  - `languages` — first entry must stay `'en'`; add `'kn'` (already default) and any future
    languages once their string tables exist in `src/lib/i18n.ts`
- [ ] Delete the sample content (every sample entry's title/name is suffixed `(Sample)` so it's
  easy to find): `src/content/projects/sample-temple.md`, `src/content/projects/sample-pond.md`,
  `src/content/awards/sample-award.md`, `src/content/testimonials/sample-testimonial.md`, and
  their `_images/` photos. (Leave `src/content/pages/about.md` and `src/content/pages/services.yml`
  in place — edit their text instead of deleting, since About/Services are singleton "pages"
  collections, not lists of sample entries.)
- [ ] Add the real first batch of content (projects, awards, testimonials, about story, services)
  — either directly as files or through `/admin` once the CMS smoke test below passes.
- [ ] Custom domain (optional, later): Cloudflare Pages project → **Custom domains** → add the
  domain, follow the DNS instructions, then update `site.config.ts`'s `url` to match and re-deploy.

## 7. Pre-launch smoke test — do this before handing the phone to the owner

This confirms the owner-facing CMS actually works end-to-end against the real GitHub-backed
`/admin`. It cannot be automated (it needs a real browser session and a live GitHub login), so
run it manually once, after Steps 1–5 are done and the site is live on Cloudflare Pages:

1. Open `https://<your-site>/admin/` in **Chrome** on a computer or phone (Sveltia's GitHub
   backend works in any modern browser once `backend.repo`/`base_url` are real — this is
   different from the local-mode File System Access API test, which only works in Chrome/Edge).
2. Sign in with the GitHub account that has access to the repo.
3. Confirm all four collections appear with their bilingual labels: `Projects · ಯೋಜನೆಗಳು`,
   `Awards · ಪ್ರಶಸ್ತಿಗಳು`, `Kind words · ಅಭಿಪ್ರಾಯಗಳು`, `Pages · ಪುಟಗಳು`.
4. Add a throwaway test project: title + one photo only, save.
5. Wait about a minute for Cloudflare Pages to rebuild, then open the live site and confirm the
   new project appears (on the home page if flagged featured, or on `/projects/`).
6. Delete the throwaway test project from `/admin` (or from GitHub directly), confirm it
   disappears from the live site after the next rebuild, and confirm `git log` shows the CMS's
   commits (each save is a normal git commit — nothing is silently lost).
7. Also spot-check the **Services** and **About** entries: open each, save without changing
   anything, and confirm (`git diff` against the previous commit, or the GitHub commit view)
   that nothing unexpected changed — this proves the CMS ↔ content round-trip is clean before
   the owner starts using it for real.
8. Only after this passes, proceed to `docs/ONBOARDING.md` and set the owner's phone up.

If anything in this smoke test doesn't behave as described, do not hand the phone to the owner
yet — fix it first. See `.superpowers/sdd/task-13-report.md` for background on why this test is
manual (it needs a real Chrome session, which cannot run headless).
