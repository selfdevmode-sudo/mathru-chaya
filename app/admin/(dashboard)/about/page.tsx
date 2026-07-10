import { readContent } from "@/lib/db";
import { updateAbout } from "@/lib/actions";
import { getLang, t } from "@/lib/i18n";
import { ABOUT_FIELDS } from "@/lib/translatable";
import TranslationPanels from "@/components/admin/TranslationPanels";

export const dynamic = "force-dynamic";

export const metadata = { title: "About" };

export default async function AdminAboutPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const content = await readContent();
  const { about } = content;
  const params = await searchParams;
  const lang = await getLang();

  return (
    <div>
      <div className="admin-header">
        <h1>{t(lang, "admin_about")}</h1>
      </div>

      {params.saved ? <div className="success-banner">{t(lang, "saved")}</div> : null}

      <form action={updateAbout} className="form-card" encType="multipart/form-data">
        <div className="field">
          <label htmlFor="body">
            {t(lang, "about_text_label")} <span className="hint">{t(lang, "one_para_per_line")}</span>
          </label>
          <textarea
            id="body"
            name="body"
            rows={10}
            defaultValue={about.body}
            placeholder={t(lang, "about_text_placeholder")}
          />
        </div>

        <div className="field">
          <label htmlFor="yearsExperience">{t(lang, "years_experience_label")}</label>
          <input
            id="yearsExperience"
            name="yearsExperience"
            type="number"
            defaultValue={about.yearsExperience}
          />
        </div>

        {about.heroPhoto ? (
          <div className="field">
            <label>{t(lang, "current_photo")}</label>
            <div className="existing-photos">
              <div className="existing-photo">
                <img src={about.heroPhoto} alt="" />
              </div>
            </div>
          </div>
        ) : null}

        <div className="field">
          <label htmlFor="heroPhoto">
            {about.heroPhoto ? t(lang, "replace_photo") : t(lang, "photo_label")}
          </label>
          <input id="heroPhoto" name="heroPhoto" type="file" accept="image/*" />
        </div>

        <TranslationPanels
          fields={ABOUT_FIELDS}
          translations={about.i18n}
          lang={lang}
        />

        <div className="btn-row">
          <button type="submit" className="btn">
            {t(lang, "save")}
          </button>
        </div>
      </form>
    </div>
  );
}
