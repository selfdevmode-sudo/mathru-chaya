# Publishing the static site (free hosting)

This is the **static** workflow (branch `static-site`): you edit content locally in the
admin, generate a static `out/` folder, and upload it to free static hosting. No server
runs in production.

> The full always-on server version (with the live "save = it's live" admin) is on the
> `main` branch, tag `server-version`, if you ever want that instead.

## Publish in 3 steps

```bash
# 1. Edit content: run the app locally and use the admin at http://localhost:3000/admin
npm start                       # (or: npm run dev)   — add/update projects, photos, etc.

# 2. Generate the static site  ->  creates the ./out folder
npm run generate

# 3. Upload ./out to free static hosting (pick ONE):
#    a) Cloudflare dashboard: Pages -> Create -> "Upload assets" -> drag the ./out folder
#    b) Command line:
npx wrangler pages deploy out
```

That's it. Cloudflare gives you a free `https://<name>.pages.dev` URL with HTTPS. Buy a
custom domain later if you want; the free URL works immediately.

## What `npm run generate` does

Builds the app, then snapshots every public page in all three languages
(English `/`, Kannada `/kn/…`, Hindi `/hi/…`) into `out/` as plain HTML, and copies the
styles, fonts, and uploaded images. The admin is **not** included — the published site is
public pages only.

## Notes

- Re-run `npm run generate` and re-upload whenever you change content. There is no
  live editing on the hosted site (that's the trade-off for free, server-less hosting).
- Keep backups of `data/content.json` and `public/uploads/` — that's all your content.
- The generated `out/` folder is disposable; it's rebuilt each time and is gitignored.
