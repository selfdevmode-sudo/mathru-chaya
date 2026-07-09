import { site } from '../../site.config';

export function nonDefaultLangs() {
  return site.languages.filter((l) => l !== 'en').map((lang) => ({ params: { lang } }));
}
