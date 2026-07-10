import { LANG_LABELS, t, type Lang } from "@/lib/i18n";
import {
  TRANSLATION_LANGS,
  fieldName,
  type TranslatableField,
} from "@/lib/translatable";
import type { TranslationLang } from "@/lib/types";

/**
 * The Kannada and Hindi content panels that sit at the bottom of every admin
 * form (ADR-0009).
 *
 * Built on <details>, so this works with JavaScript disabled — no hydration, no
 * client component, nothing to break. Collapsed by default, so a form looks
 * exactly as it did before until the owner wants a translation.
 *
 * Two languages are in play at once and must not be confused:
 *   - `lang` is the ADMIN INTERFACE language. It decides what the labels say.
 *   - each panel edits CONTENT in kn or hi, regardless of `lang`.
 *
 * Inputs are named "kn.title", "hi.description", … and read back by
 * readTranslations() in lib/actions.ts. Clearing an input removes that
 * translation, so the public site falls back to English.
 */
export default function TranslationPanels({
  fields,
  translations,
  lang,
}: {
  fields: TranslatableField[];
  /** Existing values, e.g. `{ kn: { title: "…" } }`. */
  translations?: Partial<Record<TranslationLang, Record<string, unknown>>>;
  /** Admin interface language — labels only. */
  lang: Lang;
}) {
  return (
    <div className="translations">
      {TRANSLATION_LANGS.map((target) => {
        const values = translations?.[target] ?? {};
        const filled = fields.filter((f) => hasValue(values[f.name])).length;

        return (
          <details key={target} className="translation" open={false}>
            <summary className="translation__summary">
              <span
                className={`translation__rail${filled > 0 ? " is-filled" : ""}`}
                aria-hidden="true"
              />
              {/* The endonym, in its own script — how you find your panel. */}
              <span className="translation__lang" lang={target}>
                {LANG_LABELS[target]}
              </span>
              <span className="translation__word">{t(lang, "translation_word")}</span>
              <span className="translation__count">
                {countLabel(lang, filled, fields.length)}
              </span>
              <svg
                className="translation__caret"
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M4 2.5 L8 6 L4 9.5" />
              </svg>
            </summary>

            <div className="translation__body">
              <p className="translation__hint">{t(lang, "translation_hint")}</p>

              {fields.map((field) => {
                const id = `${target}-${field.name}`;
                const name = fieldName(target, field.name);
                const value = toInputValue(values[field.name], field.kind);

                return (
                  <div key={name} className="field">
                    <label htmlFor={id}>
                      {t(lang, field.labelKey)}
                      {field.kind === "list" ? (
                        <span className="hint">{t(lang, "comma_separated")}</span>
                      ) : null}
                    </label>
                    {field.kind === "textarea" ? (
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
  );
}

/** Mirrors lib/localize.ts's isPresent: blank strings and empty lists don't count. */
function hasValue(value: unknown): boolean {
  if (typeof value === "string") return value.trim() !== "";
  if (Array.isArray(value)) return value.length > 0;
  return value !== undefined && value !== null;
}

function toInputValue(value: unknown, kind: TranslatableField["kind"]): string {
  if (kind === "list" && Array.isArray(value)) return value.join(", ");
  return typeof value === "string" ? value : "";
}

function countLabel(lang: Lang, filled: number, total: number): string {
  if (filled === 0) return t(lang, "translation_not_started");
  if (filled === total) return t(lang, "translation_all_filled", { total });
  return t(lang, "translation_fill_count", { filled, total });
}
