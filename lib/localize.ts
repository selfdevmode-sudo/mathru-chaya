import type { Lang } from "./i18n";
import type {
  About,
  Award,
  Content,
  Project,
  Service,
  SiteInfo,
  Testimonial,
  TranslationLang,
} from "./types";

/**
 * Overlays a record's translation for `lang` onto its English fields (ADR-0009).
 *
 * Two rules, both load-bearing:
 *
 *   1. Fallback is PER FIELD. A project with a Kannada title but no Kannada
 *      description renders the Kannada title above the English description —
 *      never a blank, never the whole record reverted to English.
 *
 *   2. An empty or whitespace-only translation counts as ABSENT. This is why
 *      the code below cannot be `translation[key] ?? record[key]`: `??` only
 *      catches null/undefined and would return "" for a cleared field, blanking
 *      the site. The earlier Astro build shipped exactly that bug in `pickText`.
 *
 * Type-only import of `Lang`, so this module never pulls `next/headers` into a
 * client bundle. In practice it runs on the server, before data is handed to
 * any client component.
 */

/** A value counts as a real translation only if it carries text. */
function isPresent(value: unknown): boolean {
  if (typeof value === "string") return value.trim() !== "";
  // Arrays (materials) fall back whole — merging element-wise would pair up
  // unrelated items, e.g. English "Granite, Teak" with a one-item Kannada list.
  if (Array.isArray(value)) {
    return value.length > 0 && value.some((v) => isPresent(v));
  }
  return value !== undefined && value !== null;
}

function overlay<T extends { i18n?: Partial<Record<TranslationLang, object>> }>(
  record: T,
  lang: Lang,
): T {
  const translation = lang === "en" ? undefined : record.i18n?.[lang];

  const merged = { ...record };
  if (translation) {
    for (const [key, value] of Object.entries(translation)) {
      if (isPresent(value)) {
        (merged as Record<string, unknown>)[key] = value;
      }
    }
  }

  // The sidecar has done its job. Dropping it keeps every other language's text
  // out of the page — it would otherwise be serialized into the RSC payload as
  // props for client components like ProjectGrid, shipping Kannada and Hindi
  // copies of every project to a visitor reading English.
  delete merged.i18n;
  return merged;
}

export const localizeProject = (p: Project, lang: Lang): Project => overlay(p, lang);
export const localizeAward = (a: Award, lang: Lang): Award => overlay(a, lang);
export const localizeTestimonial = (t: Testimonial, lang: Lang): Testimonial =>
  overlay(t, lang);
export const localizeService = (s: Service, lang: Lang): Service => overlay(s, lang);
export const localizeAbout = (a: About, lang: Lang): About => overlay(a, lang);
export const localizeSite = (s: SiteInfo, lang: Lang): SiteInfo => overlay(s, lang);

/**
 * Localizes a whole content tree at once. Server components call this instead of
 * `readContent()` when they render owner-authored text.
 */
export function localizeContent(content: Content, lang: Lang): Content {
  return {
    site: localizeSite(content.site, lang),
    projects: content.projects.map((p) => localizeProject(p, lang)),
    awards: content.awards.map((a) => localizeAward(a, lang)),
    testimonials: content.testimonials.map((t) => localizeTestimonial(t, lang)),
    services: content.services.map((s) => localizeService(s, lang)),
    about: localizeAbout(content.about, lang),
  };
}
