import fs from "fs/promises";
import path from "path";
import type { About, Content, SiteInfo } from "./types";

const DATA_PATH = path.join(process.cwd(), "data", "content.json");

/**
 * Fills in any missing top-level shape so the rest of the app can trust that
 * the collections are arrays and `about.body` is a string.
 *
 * Every page and server action reads through here, so one normalization at the
 * boundary means a hand-edited or partially-written content.json (missing
 * `awards`, no `about.body`, etc.) renders as an empty-but-working site instead
 * of throwing 500s everywhere. An owner with zero awards and a file that omits
 * the `awards` key are the same thing — both should show nothing, not crash.
 *
 * This is shape-only. Genuinely corrupt JSON (a truncated file) still throws in
 * readContent — that must be loud, never a silent empty structure the admin
 * could then save over real content.
 */
function normalizeContent(parsed: unknown): Content {
  const c = (parsed ?? {}) as Partial<Content>;
  const site = (c.site ?? {}) as Partial<SiteInfo>;
  const about = (c.about ?? {}) as Partial<About>;
  const arr = <T>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);

  return {
    site: {
      name: site.name ?? "",
      tagline: site.tagline ?? "",
      owners: arr<string>(site.owners),
      phone: site.phone ?? "",
      whatsapp: site.whatsapp ?? "",
      email: site.email,
      region: site.region ?? "",
      i18n: site.i18n,
    },
    projects: arr(c.projects),
    awards: arr(c.awards),
    testimonials: arr(c.testimonials),
    services: arr(c.services),
    gallery: arr<string>(c.gallery),
    about: {
      body: typeof about.body === "string" ? about.body : "",
      yearsExperience: about.yearsExperience,
      heroPhoto: about.heroPhoto,
      i18n: about.i18n,
    },
  };
}

/**
 * Reads and parses the whole site content from data/content.json.
 * There is no database and no in-memory cache — every call re-reads the
 * file from disk so admin edits are reflected immediately everywhere.
 *
 * Missing keys are normalized to safe defaults; a file that fails to parse
 * throws, on purpose (see normalizeContent).
 */
export async function readContent(): Promise<Content> {
  const raw = await fs.readFile(DATA_PATH, "utf-8");
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (cause) {
    throw new Error(
      `data/content.json is not valid JSON — refusing to continue so the ` +
        `existing content is not overwritten. Fix or restore the file.`,
      { cause },
    );
  }
  return normalizeContent(parsed);
}

/**
 * Pretty-prints and writes the whole site content back to data/content.json.
 *
 * Writes to a sibling temp file and renames it into place. rename() is atomic
 * on the same filesystem, so a crash or interrupted save can never leave a
 * half-written, unparseable content.json — a reader sees either the old file or
 * the complete new one, never a truncation.
 */
export async function writeContent(content: Content): Promise<void> {
  const json = JSON.stringify(content, null, 2) + "\n";
  const tmp = `${DATA_PATH}.${process.pid}.tmp`;
  await fs.writeFile(tmp, json, "utf-8");
  await fs.rename(tmp, DATA_PATH);
}

/** Generates a short random id, e.g. for projects/awards/testimonials. */
export function generateId(): string {
  return (
    Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8)
  );
}

/** Turns a title into a URL-friendly slug, e.g. "Sri Rama Temple" -> "sri-rama-temple". */
export function slugify(input: string): string {
  const base = input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base || "item";
}

/** Ensures a slug is unique among the given list of existing slugs. */
export function uniqueSlug(base: string, existing: string[]): string {
  let slug = slugify(base);
  let n = 2;
  while (existing.includes(slug)) {
    slug = `${slugify(base)}-${n}`;
    n += 1;
  }
  return slug;
}
