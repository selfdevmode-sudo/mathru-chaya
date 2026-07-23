import type { TranslationLang } from './types'

/**
 * The single source of truth for WHICH content fields are translatable and how
 * each is edited (ADR-0009). Both the admin form (which renders the inputs) and
 * the server action (which reads them back) derive from these lists, so the two
 * can never drift apart.
 *
 * Left out on purpose: proper nouns (site.name, owners, project.ledBy,
 * testimonial.name), contact details, links, years, photos, `type` (already
 * translated by lib/format.ts's typeLabel), and `slug` (an identifier — keeping
 * it English keeps URLs ASCII and stable).
 */

export type FieldKind = 'text' | 'textarea' | 'list'

export interface TranslatableField {
  /** Matches the English field name on the record and in the English form. */
  name: string
  kind: FieldKind
  /** Key into lib/i18n.ts's dictionary — panel labels follow the ADMIN's language. */
  labelKey: string
}

export const TRANSLATION_LANGS: TranslationLang[] = ['kn', 'hi']

export const PROJECT_FIELDS: TranslatableField[] = [
  { name: 'title', kind: 'text', labelKey: 'title' },
  { name: 'place', kind: 'text', labelKey: 'place' },
  { name: 'builtFor', kind: 'text', labelKey: 'built_for' },
  { name: 'description', kind: 'textarea', labelKey: 'description' },
  { name: 'materials', kind: 'list', labelKey: 'materials' },
  { name: 'duration', kind: 'text', labelKey: 'duration' },
  { name: 'teamSize', kind: 'text', labelKey: 'team_size' },
  { name: 'ledBy', kind: 'text', labelKey: 'led_by' },
  { name: 'status', kind: 'text', labelKey: 'status' },
]

export const AWARD_FIELDS: TranslatableField[] = [
  { name: 'title', kind: 'text', labelKey: 'title' },
  { name: 'givenBy', kind: 'text', labelKey: 'given_by' },
  { name: 'note', kind: 'textarea', labelKey: 'note_label' },
]

export const TESTIMONIAL_FIELDS: TranslatableField[] = [
  { name: 'quote', kind: 'textarea', labelKey: 'quote_label' },
  { name: 'role', kind: 'text', labelKey: 'role_label' },
  { name: 'place', kind: 'text', labelKey: 'place' },
]

export const ABOUT_FIELDS: TranslatableField[] = [
  { name: 'body', kind: 'textarea', labelKey: 'about_text_label' },
]

export const SITE_FIELDS: TranslatableField[] = [
  { name: 'tagline', kind: 'text', labelKey: 'tagline_label' },
  { name: 'heroLine', kind: 'text', labelKey: 'hero_line_label' },
  { name: 'region', kind: 'text', labelKey: 'region_label' },
]

/**
 * Services are an editable list, so their fields are indexed per row. English
 * name + blurb, each translatable, encoded as `service.<i>.name`,
 * `service.<i>.blurb`, and `service.<i>.<lang>.<field>`.
 */
export const SERVICE_FIELDS: TranslatableField[] = [
  { name: 'name', kind: 'text', labelKey: 'service_name' },
  { name: 'blurb', kind: 'textarea', labelKey: 'service_blurb' },
]

/** Form input name for a translated field, e.g. "kn.title". */
export function fieldName(lang: TranslationLang, field: string): string {
  return `${lang}.${field}`
}

/** English field of service row `i`, e.g. "service.0.name". */
export function serviceField(i: number, field: string): string {
  return `service.${i}.${field}`
}

/** Translated field of service row `i`, e.g. "service.0.kn.name". */
export function serviceTranslationField(
  i: number,
  lang: TranslationLang,
  field: string,
): string {
  return `service.${i}.${lang}.${field}`
}
