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
 */
export function localizedHref(lang: Lang, path: string): string {
  let p = path.startsWith("/") ? path : `/${path}`;
  if (!p.endsWith("/")) p = `${p}/`;
  if (lang === "en") return p;
  return p === "/" ? `/${lang}/` : `/${lang}${p}`;
}
