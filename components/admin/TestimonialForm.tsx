import Link from "next/link";
import type { Testimonial } from "@/lib/types";
import { t, type Lang } from "@/lib/i18n";
import { TESTIMONIAL_FIELDS } from "@/lib/translatable";
import TranslationPanels from "@/components/admin/TranslationPanels";

export default function TestimonialForm({
  testimonial,
  action,
  submitLabel,
  lang,
}: {
  testimonial?: Testimonial;
  action: (formData: FormData) => void | Promise<void>;
  submitLabel: string;
  lang: Lang;
}) {
  return (
    <form action={action} className="form-card">
      <div className="field">
        <label htmlFor="name">{t(lang, "name_label")} *</label>
        <input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={testimonial?.name}
        />
      </div>

      <div className="field">
        <label htmlFor="quote">{t(lang, "quote_label")} *</label>
        <textarea id="quote" name="quote" required defaultValue={testimonial?.quote} />
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="place">{t(lang, "place")}</label>
          <input id="place" name="place" type="text" defaultValue={testimonial?.place} />
        </div>
        <div className="field">
          <label htmlFor="role">{t(lang, "role_label")}</label>
          <input
            id="role"
            name="role"
            type="text"
            defaultValue={testimonial?.role}
            placeholder="e.g. Temple committee president"
          />
        </div>
      </div>

      <TranslationPanels
        fields={TESTIMONIAL_FIELDS}
        translations={testimonial?.i18n}
        lang={lang}
      />

      <div className="btn-row">
        <button type="submit" className="btn">
          {submitLabel}
        </button>
        <Link href="/admin/testimonials" className="btn btn-secondary">
          {t(lang, "cancel")}
        </Link>
      </div>
    </form>
  );
}
