import fs from "node:fs/promises";
import path from "node:path";
import type { Content } from "./types";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

/**
 * Every `/uploads/…` path referenced anywhere in the content tree.
 *
 * This is the whole reason deletion is safe: a file is an orphan only if it
 * appears in NO record. A photo shared by two records (e.g. also the About
 * hero) stays in this set until the last reference is gone.
 */
export function referencedUploads(content: Content): Set<string> {
  const set = new Set<string>();
  const add = (p?: string) => {
    if (p && p.startsWith("/uploads/")) set.add(p);
  };

  for (const project of content.projects) {
    project.photos.forEach(add);
    add(project.beforeAfter?.before);
    add(project.beforeAfter?.after);
  }
  for (const award of content.awards) add(award.photo);
  content.gallery.forEach(add);
  add(content.about.heroPhoto);
  add(content.site.heroPhoto);

  return set;
}

/**
 * The files an action just orphaned: referenced before it ran, referenced by
 * nothing after. Files that were already orphaned before the action are NOT
 * returned — this only cleans up what the action itself removed, so it can
 * never surprise-delete a pre-existing file.
 */
export function orphanedUploads(before: Set<string>, after: Content): string[] {
  const stillUsed = referencedUploads(after);
  return [...before].filter((p) => !stillUsed.has(p));
}

/**
 * Best-effort delete of upload files from disk. Guards against path traversal
 * (only files directly inside public/uploads/ are touched) and ignores a
 * missing file — the goal is that the referenced set and the disk converge,
 * not to fail an already-saved content update if a file is already gone.
 */
export async function deleteUploadFiles(paths: string[]): Promise<void> {
  await Promise.all(
    paths.map(async (p) => {
      if (!p.startsWith("/uploads/")) return;
      const target = path.join(UPLOAD_DIR, path.basename(p));
      if (path.relative(UPLOAD_DIR, target).startsWith("..")) return;
      try {
        await fs.unlink(target);
      } catch {
        /* already gone — fine */
      }
    }),
  );
}

/**
 * Snapshot references before an edit, then call this after writing the new
 * content to delete whatever the edit orphaned.
 */
export async function deleteOrphanedUploads(
  before: Set<string>,
  after: Content,
): Promise<void> {
  await deleteUploadFiles(orphanedUploads(before, after));
}
