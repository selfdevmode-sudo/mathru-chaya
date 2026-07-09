export interface SiteInfo {
  name: string;
  tagline: string;
  owners: string[];
  phone: string;
  whatsapp: string;
  email?: string;
  region: string;
}

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
}

export interface Award {
  id: string;
  title: string;
  givenBy?: string;
  year?: number;
  photo?: string;
  note?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  quote: string;
  place?: string;
  role?: string;
}

export interface Service {
  id: string;
  name: string;
  blurb?: string;
}

export interface About {
  body: string;
  yearsExperience?: number;
  heroPhoto?: string;
}

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
