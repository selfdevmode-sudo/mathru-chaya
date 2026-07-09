// Snapshot the built Next app into a static `out/` directory that can be
// hosted on any static host (Cloudflare Pages, etc.) with no server.
//
// Run via `npm run generate` (which does `next build` first). This script:
//   1. starts the production server locally
//   2. fetches every public page in each language (en / kn / hi)
//   3. saves the rendered HTML into out/<lang>/<path>/index.html
//   4. copies the CSS/JS/fonts (.next/static) and images (public/) alongside
//   5. stops the server
//
// The admin is never fetched, so it is absent from the static output.

import { spawn } from "node:child_process";
import { mkdir, writeFile, cp, rm, readFile } from "node:fs/promises";
import path from "node:path";

const PORT = 4399;
const ORIGIN = `http://127.0.0.1:${PORT}`;
const OUT = "out";
const LANGS = ["en", "kn", "hi"];

function log(msg) {
  console.log(`[generate] ${msg}`);
}

async function waitForServer(timeoutMs = 60000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(`${ORIGIN}/`, { redirect: "manual" });
      if (res.status < 500) return;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 400));
  }
  throw new Error("server did not start in time");
}

// language-neutral public paths (trailing slash, to match trailingSlash:true)
async function publicPaths() {
  const content = JSON.parse(await readFile("data/content.json", "utf8"));
  const slugs = (content.projects || []).map((p) => p.slug).filter(Boolean);
  return [
    "/",
    "/projects/",
    "/awards/",
    "/about/",
    "/contact/",
    ...slugs.map((s) => `/projects/${s}/`),
  ];
}

async function savePage(lang, neutralPath, html) {
  const rel = lang === "en" ? neutralPath : `/${lang}${neutralPath}`;
  const dir = path.join(OUT, rel); // rel ends with "/", so this is a folder
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, "index.html"), html, "utf8");
}

async function crawl() {
  const paths = await publicPaths();
  let count = 0;
  for (const lang of LANGS) {
    for (const p of paths) {
      const res = await fetch(`${ORIGIN}${p}`, {
        headers: { cookie: `lang=${lang}` },
      });
      if (!res.ok) throw new Error(`fetch ${p} (${lang}) -> ${res.status}`);
      await savePage(lang, p, await res.text());
      count++;
    }
  }
  // one 404 page for the host to serve on unknown URLs
  const res404 = await fetch(`${ORIGIN}/__not_found__/`, {
    headers: { cookie: "lang=en" },
  });
  await writeFile(path.join(OUT, "404.html"), await res404.text(), "utf8");
  log(`wrote ${count} pages (${paths.length} paths × ${LANGS.length} languages) + 404`);
}

async function copyAssets() {
  // client JS / CSS / fonts
  await cp(".next/static", path.join(OUT, "_next", "static"), {
    recursive: true,
  });
  // public/ (uploaded images, favicon, etc.)
  await cp("public", OUT, { recursive: true });
  log("copied _next/static and public/");
}

async function main() {
  await rm(OUT, { recursive: true, force: true });
  await mkdir(OUT, { recursive: true });

  log(`starting production server on :${PORT} ...`);
  const server = spawn(
    process.execPath,
    ["node_modules/next/dist/bin/next", "start", "-p", String(PORT)],
    { stdio: "ignore" },
  );

  try {
    await waitForServer();
    log("server up — crawling pages ...");
    await crawl();
    await copyAssets();
    log(`done. Static site is in ./${OUT}  — upload that folder to Cloudflare Pages.`);
  } finally {
    server.kill("SIGTERM");
  }
}

main().catch((err) => {
  console.error(`[generate] FAILED: ${err.message}`);
  process.exit(1);
});
