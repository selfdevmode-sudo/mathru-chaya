export type Lang = 'en' | 'kn' | 'tu' | 'ta';
export type ThemeName = 'stone' | 'terracotta' | 'ink';

export interface SiteConfig {
  name: string;
  tagline: string;
  owners: string[];
  phone: string;      // E.164, e.g. +919800000000
  whatsapp: string;   // E.164 without '+', e.g. 919800000000
  email?: string;
  region: string;     // e.g. "Udupi, Karnataka"
  url: string;        // canonical site URL
  logo?: string;      // path under /public; text monogram fallback if absent
  theme: ThemeName;
  languages: Lang[];  // first MUST be 'en' (default locale)
}

export const site: SiteConfig = {
  name: 'Shri Builders',
  tagline: 'Traditional temple & pond construction',
  owners: ['Owner Name'],
  phone: '+919800000000',
  whatsapp: '919800000000',
  region: 'Udupi, Karnataka',
  url: 'https://example.pages.dev',
  theme: 'stone',
  languages: ['en', 'kn'],
};
