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
export const SITE_URL = (
  process.env.SITE_URL || "http://localhost:3000"
).replace(/\/+$/, "");
