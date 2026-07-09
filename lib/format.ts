import type { Project } from "./types";
import type { Lang } from "./i18n";

// NOTE: this file is imported by client components (e.g. ProjectGrid), so it
// must never import lib/i18n.ts's runtime code (that module pulls in
// `next/headers`, which is not allowed inside a client bundle). `import type
// { Lang }` above is erased at compile time, so it's safe. This small table
// intentionally duplicates the `type_*` entries from lib/i18n.ts's dict.
const TYPE_LABELS: Record<string, Record<Lang, string>> = {
  temple: { en: "Temple", kn: "ದೇವಸ್ಥಾನ", hi: "मंदिर" },
  pond: { en: "Pond", kn: "ಕೊಳ", hi: "तालाब" },
  gopura: { en: "Gopura", kn: "ಗೋಪುರ", hi: "गोपुर" },
  renovation: { en: "Renovation", kn: "ಜೀರ್ಣೋದ್ಧಾರ", hi: "जीर्णोद्धार" },
  other: { en: "Other", kn: "ಇತರೆ", hi: "अन्य" },
};

export function typeLabel(type?: string, lang: Lang = "en"): string | undefined {
  if (!type) return undefined;
  return TYPE_LABELS[type]?.[lang] ?? TYPE_LABELS[type]?.en ?? type;
}

/** Joins only the parts that exist, e.g. "Temple · Udupi · 2021". */
export function projectMetaLine(project: Project, lang: Lang = "en"): string {
  return [typeLabel(project.type, lang), project.place, project.year ? String(project.year) : undefined]
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
