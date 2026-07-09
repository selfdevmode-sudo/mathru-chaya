import type { Project } from "./types";

const TYPE_LABELS: Record<string, string> = {
  temple: "Temple",
  pond: "Pond / Kalyani",
  gopura: "Gopura",
  renovation: "Renovation",
  other: "Other",
};

export function typeLabel(type?: string): string | undefined {
  if (!type) return undefined;
  return TYPE_LABELS[type] ?? type;
}

/** Joins only the parts that exist, e.g. "Temple · Udupi · 2021". */
export function projectMetaLine(project: Project): string {
  return [typeLabel(project.type), project.place, project.year ? String(project.year) : undefined]
    .filter(Boolean)
    .join(" · ");
}

export function waLink(whatsapp: string, message?: string): string {
  const base = `https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function telLink(phone: string): string {
  return `tel:${phone.replace(/[^0-9+]/g, "")}`;
}
