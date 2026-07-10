import type { Lang } from "./i18n";

/**
 * Prefix an internal path with the current language so navigation *keeps* the
 * language instead of resetting to English:
 *   en -> "/projects/"      kn -> "/kn/projects/"      hi -> "/hi/projects/"
 *
 * `path` is the language-neutral path (leading slash). A trailing slash is
 * added to match `trailingSlash: true` and the generated static file layout.
 *
 * Type-only import of `Lang` (erased at build), so this stays safe to use in
 * both server and client components — see the note in lib/i18n.ts.
 *
 * IMPORTANT: render these hrefs with a plain <a>, never next/link. /kn/… and
 * /hi/… are middleware rewrites onto the same underlying route, so Next answers
 * their RSC requests with `x-nextjs-rewritten-path: /…`. The client router then
 * files all three languages under one cache key — the URL changes but the page
 * keeps whichever language was fetched first, until a manual refresh. A plain
 * anchor is a document request, so the server reads the language off the path
 * every time. (The static build has no server at all, and its `?_rsc=` requests
 * would return HTML, so client routing is doubly wrong here.)
 */
export function localizedHref(lang: Lang, path: string): string {
  let p = path.startsWith("/") ? path : `/${path}`;
  if (!p.endsWith("/")) p = `${p}/`;
  if (lang === "en") return p;
  return p === "/" ? `/${lang}/` : `/${lang}${p}`;
}
