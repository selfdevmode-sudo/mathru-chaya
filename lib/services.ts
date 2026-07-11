import {
  SERVICE_FIELDS,
  TRANSLATION_LANGS,
  serviceField,
  serviceTranslationField,
} from "./translatable.ts";
import type { Service, ServiceTranslation, Translations } from "./types";

function value(formData: FormData, key: string): string | undefined {
  const v = formData.get(key);
  if (typeof v !== "string") return undefined;
  const trimmed = v.trim();
  return trimmed === "" ? undefined : trimmed;
}

/**
 * Rebuilds the services list from the indexed rows the ServicesEditor submits
 * (`service.0.name`, `service.0.kn.blurb`, …).
 *
 * Rows are contiguous from 0; iteration stops at the first index with no `name`
 * field present. A row whose name is empty is dropped — that's how the owner
 * removes a service. Each kept row reuses the existing service's id at that
 * position (stable when the list isn't reordered) or gets a fresh one.
 */
export function parseServices(
  formData: FormData,
  existing: Service[],
  makeId: () => string,
): Service[] {
  const services: Service[] = [];

  for (let i = 0; ; i++) {
    if (!formData.has(serviceField(i, "name"))) break;
    const name = value(formData, serviceField(i, "name"));
    if (!name) continue;

    const i18n: Translations<ServiceTranslation> = {};
    for (const lang of TRANSLATION_LANGS) {
      const values: ServiceTranslation = {};
      for (const field of SERVICE_FIELDS) {
        const v = value(formData, serviceTranslationField(i, lang, field.name));
        if (v !== undefined) values[field.name as keyof ServiceTranslation] = v;
      }
      if (Object.keys(values).length > 0) i18n[lang] = values;
    }

    services.push({
      id: existing[i]?.id ?? makeId(),
      name,
      blurb: value(formData, serviceField(i, "blurb")),
      i18n: Object.keys(i18n).length > 0 ? i18n : undefined,
    });
  }

  return services;
}
