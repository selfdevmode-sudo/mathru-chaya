import { readContent } from "@/lib/db";
import { telLink, waLink } from "@/lib/format";
import { getLang, t } from "@/lib/i18n";
import { localizeSite } from "@/lib/localize";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Contact Us",
};

export default async function ContactPage() {
  const content = await readContent();
  const lang = await getLang();
  const site = localizeSite(content.site, lang);

  return (
    <div className="wrap section">
      <div className="section-head">
        <h1>{t(lang, "contact_heading")}</h1>
        <p>
          {site.region}
          {site.owners.length ? ` · ${site.owners.join(", ")}` : ""}
        </p>
      </div>

      <div className="contact-grid">
        <div className="contact-card">
          <h3>{t(lang, "call_us")}</h3>
          <p>{site.phone}</p>
          <a className="btn" href={telLink(site.phone)}>
            {t(lang, "call")} {site.phone}
          </a>
        </div>

        <div className="contact-card">
          <h3>{t(lang, "whatsapp")}</h3>
          <p>{t(lang, "whatsapp_blurb")}</p>
          <a
            className="btn"
            href={waLink(
              site.whatsapp,
              t(lang, "whatsapp_greeting", { name: site.name }),
            )}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t(lang, "chat_whatsapp")}
          </a>
        </div>

        {site.email ? (
          <div className="contact-card">
            <h3>{t(lang, "email_label")}</h3>
            <p>{site.email}</p>
            <a className="btn btn-secondary" href={`mailto:${site.email}`}>
              {t(lang, "send_email")}
            </a>
          </div>
        ) : null}
      </div>
    </div>
  );
}
