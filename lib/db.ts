import fs from "fs/promises";
import path from "path";
import type { Content } from "./types";

const DATA_PATH = path.join(process.cwd(), "data", "content.json");

/**
 * Reads and parses the whole site content from data/content.json.
 * There is no database and no in-memory cache — every call re-reads the
 * file from disk so admin edits are reflected immediately everywhere.
 */
export async function readContent(): Promise<Content> {
  const raw = await fs.readFile(DATA_PATH, "utf-8");
  return JSON.parse(raw) as Content;
}

/**
 * Pretty-prints and writes the whole site content back to data/content.json.
 */
export async function writeContent(content: Content): Promise<void> {
  const json = JSON.stringify(content, null, 2) + "\n";
  await fs.writeFile(DATA_PATH, json, "utf-8");
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
