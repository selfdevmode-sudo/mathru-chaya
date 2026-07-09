// Preview the generated static site (./out) the way a real static host serves
// it — from a web server, so the absolute /_next and /uploads paths resolve.
// (Double-clicking out/index.html opens it as file:// and those paths break;
// that's a file:// limitation, not a problem with the build.)
//
// Run with `npm run preview` after `npm run generate`, then open the URL.

import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const OUT = path.resolve("out");
const PORT = 4500;

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".txt": "text/plain",
  ".map": "application/json",
};

if (!existsSync(OUT)) {
  console.error("No ./out folder yet — run `npm run generate` first.");
  process.exit(1);
}

async function resolveFile(urlPath) {
  // keep the request inside OUT
  const safe = path
    .normalize(urlPath)
    .replace(/^(\.\.[/\\])+/, "");
  let fp = path.join(OUT, safe);
  if (urlPath.endsWith("/")) return path.join(fp, "index.html");
  if (existsSync(fp) && (await stat(fp)).isDirectory())
    return path.join(fp, "index.html");
  if (!existsSync(fp) && existsSync(`${fp}/index.html`))
    return `${fp}/index.html`;
  return fp;
}

const server = createServer(async (req, res) => {
  try {
    const urlPath = decodeURIComponent(
      new URL(req.url, "http://localhost").pathname,
    );
    const fp = await resolveFile(urlPath);
    if (!existsSync(fp)) {
      const nf = path.join(OUT, "404.html");
      res.writeHead(404, { "content-type": "text/html; charset=utf-8" });
      res.end(existsSync(nf) ? await readFile(nf) : "Not found");
      return;
    }
    const ext = path.extname(fp).toLowerCase();
    res.writeHead(200, {
      "content-type": TYPES[ext] || "application/octet-stream",
    });
    res.end(await readFile(fp));
  } catch {
    res.writeHead(500);
    res.end("error");
  }
});

server.listen(PORT, () => {
  console.log(`\n  Preview of ./out at:  http://localhost:${PORT}\n`);
  console.log("  (This mimics real static hosting. Press Ctrl+C to stop.)\n");
});
