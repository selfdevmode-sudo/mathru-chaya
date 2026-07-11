import type { Service } from "@/lib/types";
import { LANG_LABELS, t, type Lang } from "@/lib/i18n";
import {
  SERVICE_FIELDS,
  TRANSLATION_LANGS,
  serviceField,
  serviceTranslationField,
} from "@/lib/translatable";

/**
 * Edits the "What We Do" services as a fixed set of rows inside the Site info
 * form (ADR-0007 / ADR-0009). Each row has an English name + blurb and two
 * collapsed Kannada/Hindi panels, mirroring TranslationPanels.
 *
 * Rows are indexed (`service.0.name`, `service.0.kn.blurb`, …) so a plain form
 * post carries the whole list — no JavaScript. A row with an empty name is
 * dropped on save; the spare empty rows are how you add new services.
 *
 * Server component: `t(lang, …)` is a pure lookup, so no client bundle and no
 * cookies()/i18n access here.
 */
export default function ServicesEditor({
  services,
  lang,
}: {
  services: Service[];
  lang: Lang;
}) {
  // Existing rows plus two spare, so there's always room to add.
  const rowCount = services.length + 2;

  return (
    <div className="services-editor">
      <h2>{t(lang, "section_what_we_do")}</h2>
      <p className="hint">{t(lang, "services_hint")}</p>

      {Array.from({ length: rowCount }, (_, i) => {
        const service = services[i];
        return (
          <fieldset key={i} className="service-row">
            <legend>{t(lang, "service_number", { n: i + 1 })}</legend>

            <div className="field">
              <label htmlFor={`service-${i}-name`}>{t(lang, "service_name")}</label>
              <input
                id={`service-${i}-name`}
                name={serviceField(i, "name")}
                type="text"
                defaultValue={service?.name}
              />
            </div>

            <div className="field">
              <label htmlFor={`service-${i}-blurb`}>{t(lang, "service_blurb")}</label>
              <textarea
                id={`service-${i}-blurb`}
                name={serviceField(i, "blurb")}
                defaultValue={service?.blurb}
              />
            </div>

            <div className="translations">
              {TRANSLATION_LANGS.map((target) => {
                const values = service?.i18n?.[target] ?? {};
                const filled = SERVICE_FIELDS.filter(
                  (f) =>
                    typeof values[f.name as keyof typeof values] === "string" &&
                    (values[f.name as keyof typeof values] as string).trim() !== "",
                ).length;
                return (
                  <details key={target} className="translation">
                    <summary className="translation__summary">
                      <span
                        className={`translation__rail${filled > 0 ? " is-filled" : ""}`}
                        aria-hidden="true"
                      />
                      <span className="translation__lang" lang={target}>
                        {LANG_LABELS[target]}
                      </span>
                      <span className="translation__word">
                        {t(lang, "translation_word")}
                      </span>
                    </summary>
                    <div className="translation__body">
                      {SERVICE_FIELDS.map((f) => {
                        const id = `service-${i}-${target}-${f.name}`;
                        const name = serviceTranslationField(i, target, f.name);
                        const value =
                          (values[f.name as keyof typeof values] as string) ?? "";
                        return (
                          <div key={name} className="field">
                            <label htmlFor={id}>{t(lang, f.labelKey)}</label>
                            {f.kind === "textarea" ? (
                              <textarea id={id} name={name} lang={target} defaultValue={value} />
                            ) : (
                              <input
                                id={id}
                                name={name}
                                type="text"
                                lang={target}
                                defaultValue={value}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </details>
                );
              })}
            </div>
          </fieldset>
        );
      })}
    </div>
  );
}
