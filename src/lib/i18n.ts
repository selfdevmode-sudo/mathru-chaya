import type { Lang } from '../../site.config';
import { site } from '../../site.config';

const en = {
  nav_projects: 'Projects', nav_about: 'About',
  nav_awards: 'Awards', nav_contact: 'Contact',
  cta_view_work: 'View our work', cta_call: 'Call', cta_whatsapp: 'WhatsApp', cta_read_more: 'Read more',
  home_featured: 'Our work', home_awards: 'Recognition', home_testimonials: 'Kind words',
  projects_all: 'All', projects_filter: 'Filter by type',
  type_temple: 'Temple', type_pond: 'Pond / Kalyani', type_gopura: 'Gopura',
  type_renovation: 'Renovation', type_other: 'Other',
  detail_about: 'About this work', detail_materials: 'Method & materials',
  detail_details: 'Details', detail_duration: 'Duration', detail_team: 'Team',
  detail_led_by: 'Led by', detail_status: 'Status', detail_location: 'Location',
  detail_open_map: 'Open in Google Maps', detail_video: 'Watch video',
  detail_before: 'Before', detail_after: 'After', detail_built_for: 'Built for',
  detail_more_projects: 'More projects',
  awards_given_by: 'Given by', about_services: 'What we build',
  about_years_experience: 'years of experience',
  contact_region: 'Region', contact_title: 'Get in touch',
  notfound_title: 'Page not found', notfound_body: 'The page you are looking for does not exist.',
  notfound_home: 'Go to home page',
  footer_rights: 'All rights reserved.',
  a11y_menu: 'Menu', a11y_close: 'Close',
};

const kn: Partial<Record<keyof typeof en, string>> = {
  nav_projects: 'ಯೋಜನೆಗಳು', nav_about: 'ನಮ್ಮ ಬಗ್ಗೆ',
  nav_awards: 'ಪ್ರಶಸ್ತಿಗಳು', nav_contact: 'ಸಂಪರ್ಕ',
  cta_view_work: 'ನಮ್ಮ ಕೆಲಸ ನೋಡಿ', cta_call: 'ಕರೆ ಮಾಡಿ', cta_whatsapp: 'ವಾಟ್ಸಾಪ್', cta_read_more: 'ಇನ್ನಷ್ಟು ಓದಿ',
  home_featured: 'ನಮ್ಮ ಕೆಲಸ', home_awards: 'ಮನ್ನಣೆ', home_testimonials: 'ಅಭಿಪ್ರಾಯಗಳು',
  projects_all: 'ಎಲ್ಲಾ', projects_filter: 'ಪ್ರಕಾರದಂತೆ ಆಯ್ಕೆ',
  type_temple: 'ದೇವಸ್ಥಾನ', type_pond: 'ಕಲ್ಯಾಣಿ / ಕೆರೆ', type_gopura: 'ಗೋಪುರ',
  type_renovation: 'ಜೀರ್ಣೋದ್ಧಾರ', type_other: 'ಇತರೆ',
  detail_about: 'ಈ ಕೆಲಸದ ಬಗ್ಗೆ', detail_materials: 'ವಿಧಾನ ಮತ್ತು ಸಾಮಗ್ರಿಗಳು',
  detail_details: 'ವಿವರಗಳು', detail_duration: 'ಅವಧಿ', detail_team: 'ತಂಡ',
  detail_led_by: 'ನೇತೃತ್ವ', detail_status: 'ಸ್ಥಿತಿ', detail_location: 'ಸ್ಥಳ',
  detail_open_map: 'ಗೂಗಲ್ ನಕ್ಷೆಯಲ್ಲಿ ತೆರೆಯಿರಿ', detail_video: 'ವೀಡಿಯೊ ನೋಡಿ',
  detail_before: 'ಮೊದಲು', detail_after: 'ನಂತರ', detail_built_for: 'ಯಾರಿಗಾಗಿ',
  detail_more_projects: 'ಇನ್ನಷ್ಟು ಯೋಜನೆಗಳು',
  awards_given_by: 'ನೀಡಿದವರು', about_services: 'ನಾವು ಏನು ಕಟ್ಟುತ್ತೇವೆ',
  about_years_experience: 'ವರ್ಷಗಳ ಅನುಭವ',
  contact_region: 'ಪ್ರದೇಶ', contact_title: 'ಸಂಪರ್ಕಿಸಿ',
  notfound_title: 'ಪುಟ ಸಿಗಲಿಲ್ಲ', notfound_body: 'ನೀವು ಹುಡುಕುತ್ತಿರುವ ಪುಟ ಇಲ್ಲ.',
  notfound_home: 'ಮುಖಪುಟಕ್ಕೆ ಹೋಗಿ',
  footer_rights: 'ಎಲ್ಲಾ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.',
  a11y_menu: 'ಮೆನು', a11y_close: 'ಮುಚ್ಚಿ',
};

export type StringKey = keyof typeof en;
const strings: Partial<Record<Lang, Partial<Record<StringKey, string>>>> = { en, kn };

export function t(lang: Lang, key: StringKey): string {
  return strings[lang]?.[key] ?? en[key];
}

export function pickText(
  lang: Lang, entry: Record<string, unknown>, base: string,
): string | undefined {
  const nonEmpty = (val: unknown): string | undefined =>
    typeof val === 'string' && val.trim() !== '' ? val : undefined;
  return nonEmpty(entry[`${base}_${lang}`]) ?? nonEmpty(entry[`${base}_en`]);
}

export function localePath(lang: Lang, path: string): string {
  return lang === 'en' ? path : `/${lang}${path}`;
}

export function otherLangs(current: Lang): Lang[] {
  return site.languages.filter((l) => l !== current);
}
