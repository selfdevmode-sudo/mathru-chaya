import Link from "next/link";
import type { Award } from "@/lib/types";
import { t, type Lang } from "@/lib/i18n";

export default function AwardForm({
  award,
  action,
  submitLabel,
  lang,
}: {
  award?: Award;
  action: (formData: FormData) => void | Promise<void>;
  submitLabel: string;
  lang: Lang;
}) {
  return (
    <form action={action} className="form-card" encType="multipart/form-data">
      <div className="field">
        <label htmlFor="title">{t(lang, "title")} *</label>
        <input
          id="title"
          name="title"
          type="text"
          required
          defaultValue={award?.title}
          placeholder="e.g. Best Heritage Restoration"
        />
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="givenBy">{t(lang, "given_by")}</label>
          <input id="givenBy" name="givenBy" type="text" defaultValue={award?.givenBy} />
        </div>
        <div className="field">
          <label htmlFor="year">{t(lang, "year_label")}</label>
          <input id="year" name="year" type="number" defaultValue={award?.year} />
        </div>
      </div>

      {award?.photo ? (
        <div className="field">
          <label>{t(lang, "current_photo")}</label>
          <div className="existing-photos">
            <div className="existing-photo">
              <img src={award.photo} alt="" />
            </div>
          </div>
        </div>
      ) : null}

      <div className="field">
        <label htmlFor="photo">{award?.photo ? t(lang, "replace_photo") : t(lang, "photo_label")}</label>
        <input id="photo" name="photo" type="file" accept="image/*" />
      </div>

      <div className="field">
        <label htmlFor="note">{t(lang, "note_label")}</label>
        <textarea id="note" name="note" defaultValue={award?.note} />
      </div>

      <div className="btn-row">
        <button type="submit" className="btn">
          {submitLabel}
        </button>
        <Link href="/admin/awards" className="btn btn-secondary">
          {t(lang, "cancel")}
        </Link>
      </div>
    </form>
  );
}
