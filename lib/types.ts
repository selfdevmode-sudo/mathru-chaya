// ---------------------------------------------------------------------------
// Content translations (ADR-0009)
//
// English lives at the top level of each record and is never optional. Kannada
// and Hindi hang off the side in an optional `i18n` map. This keeps the
// existing data/content.json valid (no migration), keeps English structurally
// impossible to lose, and lets translations be filled in one field at a time.
//
// Each translation type is derived from its record with Partial<Pick<…>>, so a
// field's type can never drift from the English one it translates.
// ---------------------------------------------------------------------------

/** Languages a record can be translated into. English is the source, not a translation. */
export type TranslationLang = "kn" | "hi";

export type Translations<T> = Partial<Record<TranslationLang, T>>;

export interface SiteInfo {
  name: string;
  tagline: string;
  owners: string[];
  phone: string;
  whatsapp: string;
  email?: string;
  region: string;
  i18n?: Translations<SiteTranslation>;
}

export type SiteTranslation = Partial<Pick<SiteInfo, "tagline" | "region">>;

export interface Project {
  id: string;
  slug: string;
  title: string;
  type?: "temple" | "pond" | "gopura" | "renovation" | "other";
  place?: string;
  year?: number;
  builtFor?: string;
  description?: string;
  materials?: string[];
  duration?: string;
  teamSize?: string;
  ledBy?: string;
  status?: string;
  mapLink?: string;
  videoLink?: string;
  photos: string[];
  beforeAfter?: { before: string; after: string };
  featured?: boolean;
  i18n?: Translations<ProjectTranslation>;
}

/** `ledBy` is a person's name and `slug` an identifier — neither is translated. */
export type ProjectTranslation = Partial<
  Pick<
    Project,
    | "title"
    | "place"
    | "builtFor"
    | "description"
    | "materials"
    | "duration"
    | "teamSize"
    | "status"
  >
>;

export interface Award {
  id: string;
  title: string;
  givenBy?: string;
  year?: number;
  photo?: string;
  note?: string;
  i18n?: Translations<AwardTranslation>;
}

export type AwardTranslation = Partial<Pick<Award, "title" | "givenBy" | "note">>;

export interface Testimonial {
  id: string;
  name: string;
  quote: string;
  place?: string;
  role?: string;
  i18n?: Translations<TestimonialTranslation>;
}

/** `name` is a person's name — not translated. */
export type TestimonialTranslation = Partial<
  Pick<Testimonial, "quote" | "place" | "role">
>;

export interface Service {
  id: string;
  name: string;
  blurb?: string;
  i18n?: Translations<ServiceTranslation>;
}

export type ServiceTranslation = Partial<Pick<Service, "name" | "blurb">>;

export interface About {
  body: string;
  yearsExperience?: number;
  heroPhoto?: string;
  i18n?: Translations<AboutTranslation>;
}

export type AboutTranslation = Partial<Pick<About, "body">>;

export interface Content {
  site: SiteInfo;
  projects: Project[];
  awards: Award[];
  testimonials: Testimonial[];
  services: Service[];
  about: About;
}

export const PROJECT_TYPES: NonNullable<Project["type"]>[] = [
  "temple",
  "pond",
  "gopura",
  "renovation",
  "other",
];
