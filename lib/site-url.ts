/**
 * The public origin this site is served from, e.g. https://shribuilders.pages.dev
 *
 * Needed because a few things cannot be relative:
 *   - `og:image` — WhatsApp/Facebook/Google only fetch an absolute URL, so a
 *     relative /uploads/x.jpg would leave shared links with no preview photo.
 *   - sitemap.xml — every <loc> must be absolute.
 *
 * There is no way to guess the domain, so it is configuration: set SITE_URL in
 * .env before `npm run generate`. Left unset it falls back to localhost, which
 * is fine for local development and is warned about loudly at generate time.
 */
const FALLBACK = "http://localhost:3000";

/**
 * `new URL()` throws on a value with no scheme — and the most natural thing to
 * type in .env is a bare domain (`example.pages.dev`). That throw would happen
 * inside the public layout's generateMetadata, i.e. it would 500 *every* page
 * of the site and fail `npm run generate` with an unrelated-looking error. So a
 * bad value degrades to the fallback with a warning instead of taking the site
 * down: a missing share preview is bad, a dead site is much worse.
 */
function resolveSiteUrl(): string {
  const raw = (process.env.SITE_URL || "").trim().replace(/\/+$/, "");
  if (!raw) return FALLBACK;

  try {
    new URL(raw);
    return raw;
  } catch {
    console.warn(
      `[site-url] SITE_URL is not a valid URL: ${JSON.stringify(raw)}. ` +
        `It needs the scheme, e.g. https://example.pages.dev — falling back ` +
        `to ${FALLBACK}, so share previews and the sitemap will be wrong.`,
    );
    return FALLBACK;
  }
}

export const SITE_URL = resolveSiteUrl();
