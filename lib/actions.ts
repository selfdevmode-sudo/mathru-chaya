"use server";

import fs from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { readContent, writeContent, generateId, uniqueSlug } from "./db";
import type { Project, Award, Testimonial } from "./types";

// ---------- form parsing helpers ----------

function str(formData: FormData, key: string): string | undefined {
  const v = formData.get(key);
  if (typeof v !== "string") return undefined;
  const trimmed = v.trim();
  return trimmed === "" ? undefined : trimmed;
}

function reqStr(formData: FormData, key: string): string {
  return str(formData, key) ?? "";
}

function num(formData: FormData, key: string): number | undefined {
  const v = str(formData, key);
  if (v === undefined) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

function list(formData: FormData, key: string): string[] | undefined {
  const v = str(formData, key);
  if (v === undefined) return undefined;
  const arr = v
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return arr.length ? arr : undefined;
}

function files(formData: FormData, key: string): File[] {
  return formData
    .getAll(key)
    .filter((v): v is File => v instanceof File && v.size > 0);
}

function oneFile(formData: FormData, key: string): File | undefined {
  const v = formData.get(key);
  return v instanceof File && v.size > 0 ? v : undefined;
}

// ---------- uploads ----------

const ALLOWED_EXT = /^\.(jpg|jpeg|png|gif|webp|svg)$/;

/**
 * Saves an uploaded image file to public/uploads/ and returns its public
 * URL path (e.g. "/uploads/1720000000-ab12cd.jpg"). Extension is sanitized
 * against an allow-list to avoid writing arbitrary file types.
 */
export async function saveUpload(file: File): Promise<string> {
  const bytes = Buffer.from(await file.arrayBuffer());
  const rawExt = path.extname(file.name || "").toLowerCase();
  const ext = ALLOWED_EXT.test(rawExt) ? rawExt : ".jpg";
  const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadDir, { recursive: true });
  await fs.writeFile(path.join(uploadDir, name), bytes);
  return `/uploads/${name}`;
}

function revalidateEverything() {
  revalidatePath("/", "layout");
}

// ---------- projects ----------

export async function createProject(formData: FormData): Promise<void> {
  const title = reqStr(formData, "title");
  if (!title) {
    redirect(`/admin/projects/new?error=${encodeURIComponent("Title is required")}`);
  }

  const content = await readContent();
  const slug = uniqueSlug(
    title,
    content.projects.map((p) => p.slug),
  );

  const uploadedPhotos = await Promise.all(
    files(formData, "photos").map(saveUpload),
  );

  const beforeFile = oneFile(formData, "beforePhoto");
  const afterFile = oneFile(formData, "afterPhoto");
  const beforeUrl = beforeFile ? await saveUpload(beforeFile) : undefined;
  const afterUrl = afterFile ? await saveUpload(afterFile) : undefined;

  const project: Project = {
    id: generateId(),
    slug,
    title,
    type: str(formData, "type") as Project["type"],
    place: str(formData, "place"),
    year: num(formData, "year"),
    builtFor: str(formData, "builtFor"),
    description: str(formData, "description"),
    materials: list(formData, "materials"),
    duration: str(formData, "duration"),
    teamSize: str(formData, "teamSize"),
    ledBy: str(formData, "ledBy"),
    status: str(formData, "status"),
    mapLink: str(formData, "mapLink"),
    videoLink: str(formData, "videoLink"),
    photos: uploadedPhotos,
    beforeAfter:
      beforeUrl && afterUrl ? { before: beforeUrl, after: afterUrl } : undefined,
    featured: formData.get("featured") === "on",
  };

  content.projects.unshift(project);
  await writeContent(content);
  revalidateEverything();
  redirect("/admin/projects");
}

export async function updateProject(
  id: string,
  formData: FormData,
): Promise<void> {
  const content = await readContent();
  const idx = content.projects.findIndex((p) => p.id === id);
  if (idx === -1) redirect("/admin/projects");
  const existing = content.projects[idx];

  const newlyUploaded = await Promise.all(
    files(formData, "photos").map(saveUpload),
  );
  const removeSet = new Set(formData.getAll("removePhotos").map(String));
  const keptPhotos = existing.photos.filter((p) => !removeSet.has(p));
  const photos = [...keptPhotos, ...newlyUploaded];

  const beforeFile = oneFile(formData, "beforePhoto");
  const afterFile = oneFile(formData, "afterPhoto");
  const beforeUrl = beforeFile
    ? await saveUpload(beforeFile)
    : existing.beforeAfter?.before;
  const afterUrl = afterFile
    ? await saveUpload(afterFile)
    : existing.beforeAfter?.after;
  const clearBeforeAfter = formData.get("clearBeforeAfter") === "on";

  const updated: Project = {
    ...existing,
    title: reqStr(formData, "title") || existing.title,
    type: str(formData, "type") as Project["type"],
    place: str(formData, "place"),
    year: num(formData, "year"),
    builtFor: str(formData, "builtFor"),
    description: str(formData, "description"),
    materials: list(formData, "materials"),
    duration: str(formData, "duration"),
    teamSize: str(formData, "teamSize"),
    ledBy: str(formData, "ledBy"),
    status: str(formData, "status"),
    mapLink: str(formData, "mapLink"),
    videoLink: str(formData, "videoLink"),
    photos,
    beforeAfter:
      !clearBeforeAfter && beforeUrl && afterUrl
        ? { before: beforeUrl, after: afterUrl }
        : undefined,
    featured: formData.get("featured") === "on",
  };

  content.projects[idx] = updated;
  await writeContent(content);
  revalidateEverything();
  redirect("/admin/projects");
}

export async function deleteProject(id: string): Promise<void> {
  const content = await readContent();
  content.projects = content.projects.filter((p) => p.id !== id);
  await writeContent(content);
  revalidateEverything();
  redirect("/admin/projects");
}

// ---------- awards ----------

export async function createAward(formData: FormData): Promise<void> {
  const title = reqStr(formData, "title");
  if (!title) redirect(`/admin/awards/new?error=${encodeURIComponent("Title is required")}`);

  const content = await readContent();
  const photoFile = oneFile(formData, "photo");
  const photo = photoFile ? await saveUpload(photoFile) : undefined;

  const award: Award = {
    id: generateId(),
    title,
    givenBy: str(formData, "givenBy"),
    year: num(formData, "year"),
    photo,
    note: str(formData, "note"),
  };

  content.awards.unshift(award);
  await writeContent(content);
  revalidateEverything();
  redirect("/admin/awards");
}

export async function updateAward(
  id: string,
  formData: FormData,
): Promise<void> {
  const content = await readContent();
  const idx = content.awards.findIndex((a) => a.id === id);
  if (idx === -1) redirect("/admin/awards");
  const existing = content.awards[idx];

  const photoFile = oneFile(formData, "photo");
  const photo = photoFile ? await saveUpload(photoFile) : existing.photo;

  const updated: Award = {
    ...existing,
    title: reqStr(formData, "title") || existing.title,
    givenBy: str(formData, "givenBy"),
    year: num(formData, "year"),
    photo,
    note: str(formData, "note"),
  };

  content.awards[idx] = updated;
  await writeContent(content);
  revalidateEverything();
  redirect("/admin/awards");
}

export async function deleteAward(id: string): Promise<void> {
  const content = await readContent();
  content.awards = content.awards.filter((a) => a.id !== id);
  await writeContent(content);
  revalidateEverything();
  redirect("/admin/awards");
}

// ---------- testimonials ----------

export async function createTestimonial(formData: FormData): Promise<void> {
  const name = reqStr(formData, "name");
  const quote = reqStr(formData, "quote");
  if (!name || !quote) {
    redirect(
      `/admin/testimonials/new?error=${encodeURIComponent("Name and quote are required")}`,
    );
  }

  const content = await readContent();
  const testimonial: Testimonial = {
    id: generateId(),
    name,
    quote,
    place: str(formData, "place"),
    role: str(formData, "role"),
  };

  content.testimonials.unshift(testimonial);
  await writeContent(content);
  revalidateEverything();
  redirect("/admin/testimonials");
}

export async function updateTestimonial(
  id: string,
  formData: FormData,
): Promise<void> {
  const content = await readContent();
  const idx = content.testimonials.findIndex((t) => t.id === id);
  if (idx === -1) redirect("/admin/testimonials");
  const existing = content.testimonials[idx];

  const updated: Testimonial = {
    ...existing,
    name: reqStr(formData, "name") || existing.name,
    quote: reqStr(formData, "quote") || existing.quote,
    place: str(formData, "place"),
    role: str(formData, "role"),
  };

  content.testimonials[idx] = updated;
  await writeContent(content);
  revalidateEverything();
  redirect("/admin/testimonials");
}

export async function deleteTestimonial(id: string): Promise<void> {
  const content = await readContent();
  content.testimonials = content.testimonials.filter((t) => t.id !== id);
  await writeContent(content);
  revalidateEverything();
  redirect("/admin/testimonials");
}

// ---------- about ----------

export async function updateAbout(formData: FormData): Promise<void> {
  const content = await readContent();
  const heroFile = oneFile(formData, "heroPhoto");
  const heroPhoto = heroFile ? await saveUpload(heroFile) : content.about.heroPhoto;

  content.about = {
    body: reqStr(formData, "body"),
    yearsExperience: num(formData, "yearsExperience"),
    heroPhoto,
  };

  await writeContent(content);
  revalidateEverything();
  redirect("/admin/about?saved=1");
}

// ---------- site info ----------

export async function updateSiteInfo(formData: FormData): Promise<void> {
  const content = await readContent();

  content.site = {
    name: reqStr(formData, "name") || content.site.name,
    tagline: reqStr(formData, "tagline") || content.site.tagline,
    owners: list(formData, "owners") || content.site.owners,
    phone: reqStr(formData, "phone") || content.site.phone,
    whatsapp: reqStr(formData, "whatsapp") || content.site.whatsapp,
    email: str(formData, "email"),
    region: reqStr(formData, "region") || content.site.region,
  };

  await writeContent(content);
  revalidateEverything();
  redirect("/admin/settings?saved=1");
}
