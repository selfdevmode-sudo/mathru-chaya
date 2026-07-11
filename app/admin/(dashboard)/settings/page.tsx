import { readContent } from "@/lib/db";
import { updateSiteInfo } from "@/lib/actions";
import { getLang, t } from "@/lib/i18n";
import { SITE_FIELDS } from "@/lib/translatable";
import TranslationPanels from "@/components/admin/TranslationPanels";
import ServicesEditor from "@/components/admin/ServicesEditor";

export const dynamic = "force-dynamic";

export const metadata = { title: "Site Info" };

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const content = await readContent();
  const { site } = content;
  const params = await searchParams;
  const lang = await getLang();

  return (
    <div>
      <div className="admin-header">
        <h1>{t(lang, "admin_settings")}</h1>
      </div>

      {params.saved ? <div className="success-banner">{t(lang, "saved")}</div> : null}

      <form
        action={updateSiteInfo}
        className="form-card"
        encType="multipart/form-data"
      >
        <div className="field">
          <label htmlFor="name">{t(lang, "business_name")} *</label>
          <input id="name" name="name" type="text" required defaultValue={site.name} />
        </div>

        <div className="field">
          <label htmlFor="tagline">{t(lang, "tagline_label")}</label>
          <input
            id="tagline"
            name="tagline"
            type="text"
            defaultValue={site.tagline}
          />
        </div>

        <div className="field">
          <label htmlFor="heroLine">{t(lang, "hero_line_label")}</label>
          <input
            id="heroLine"
            name="heroLine"
            type="text"
            defaultValue={site.heroLine}
            placeholder={t(lang, "hero_line")}
          />
        </div>

        <div className="field">
          <label htmlFor="owners">
            {t(lang, "owners_label")} <span className="hint">{t(lang, "comma_separated")}</span>
          </label>
          <input
            id="owners"
            name="owners"
            type="text"
            defaultValue={site.owners.join(", ")}
          />
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="phone">{t(lang, "phone_label")} *</label>
            <input id="phone" name="phone" type="tel" required defaultValue={site.phone} />
          </div>
          <div className="field">
            <label htmlFor="whatsapp">
              {t(lang, "whatsapp_number_label")}{" "}
              <span className="hint">{t(lang, "digits_with_country_code")}</span>
            </label>
            <input
              id="whatsapp"
              name="whatsapp"
              type="text"
              required
              defaultValue={site.whatsapp}
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="email">{t(lang, "email_label")}</label>
          <input id="email" name="email" type="email" defaultValue={site.email} />
        </div>

        <div className="field">
          <label htmlFor="region">{t(lang, "region_label")} *</label>
          <input
            id="region"
            name="region"
            type="text"
            required
            defaultValue={site.region}
            placeholder="e.g. Udupi, Karnataka"
          />
        </div>

        {site.heroPhoto ? (
          <div className="field">
            <label>{t(lang, "current_photo")}</label>
            <div className="existing-photos">
              <div className="existing-photo">
                <img src={site.heroPhoto} alt="" />
              </div>
            </div>
          </div>
        ) : null}

        {site.heroPhoto ? (
          <div className="checkbox-field field">
            <input type="checkbox" id="clearHeroPhoto" name="clearHeroPhoto" />
            <label htmlFor="clearHeroPhoto">{t(lang, "remove_photo")}</label>
          </div>
        ) : null}

        <div className="field">
          <label htmlFor="heroPhoto">
            {site.heroPhoto
              ? t(lang, "replace_photo")
              : t(lang, "hero_photo_label")}
          </label>
          <input id="heroPhoto" name="heroPhoto" type="file" accept="image/*" />
          <p className="hint">{t(lang, "hero_photo_hint")}</p>
        </div>

        <TranslationPanels fields={SITE_FIELDS} translations={site.i18n} lang={lang} />

        <ServicesEditor services={content.services} lang={lang} />

        <div className="btn-row">
          <button type="submit" className="btn">
            {t(lang, "save")}
          </button>
        </div>
      </form>
    </div>
  );
}
