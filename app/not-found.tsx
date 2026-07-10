import { getLang, t } from "@/lib/i18n";

export default async function NotFound() {
  const lang = await getLang();

  return (
    <div className="wrap not-found">
      <h1>{t(lang, "not_found_heading")}</h1>
      <p>{t(lang, "not_found_body")}</p>
      <a href="/" className="btn">
        {t(lang, "back_home")}
      </a>
    </div>
  );
}
