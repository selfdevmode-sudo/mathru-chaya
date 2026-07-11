import { readContent } from "@/lib/db";
import { getLang, t } from "@/lib/i18n";
import { localizeContent } from "@/lib/localize";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "About Us",
};

export default async function AboutPage() {
  const lang = await getLang();
  const content = localizeContent(await readContent(), lang);
  const { about, services, testimonials, site } = content;

  const paragraphs = about.body.split("\n").filter((line) => line.trim() !== "");

  return (
    <div className="wrap section">
      <div className="section-head">
        <h1>
          {t(lang, "about")} {site.name}
        </h1>
        {about.yearsExperience ? (
          <p className="card__meta">
            {about.yearsExperience} {t(lang, "years_experience_suffix")}
          </p>
        ) : null}
      </div>

      {about.heroPhoto ? (
        <img
          src={about.heroPhoto}
          alt={site.name}
          loading="lazy"
          style={{
            borderRadius: "var(--radius)",
            border: "1px solid var(--c-border)",
            marginBottom: "1.5rem",
            maxHeight: "22rem",
            width: "100%",
            objectFit: "cover",
          }}
        />
      ) : null}

      {paragraphs.length > 0 ? (
        paragraphs.map((para, i) => <p key={i}>{para}</p>)
      ) : (
        <p>{t(lang, "about_empty")}</p>
      )}

      {services.length > 0 ? (
        <>
          <h2>{t(lang, "section_what_we_do")}</h2>
          <div className="grid">
            {services.map((service) => (
              <div key={service.id} className="card">
                <div className="card__body">
                  <h3>{service.name}</h3>
                  {service.blurb ? <p>{service.blurb}</p> : null}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : null}

      {testimonials.length > 0 ? (
        <>
          <h2>{t(lang, "section_testimonials")}</h2>
          <div className="grid">
            {testimonials.map((tItem) => (
              <div key={tItem.id} className="testimonial">
                <p className="quote">&ldquo;{tItem.quote}&rdquo;</p>
                <p className="who">
                  {tItem.name}
                  {tItem.role ? `, ${tItem.role}` : ""}
                  {tItem.place ? ` — ${tItem.place}` : ""}
                </p>
              </div>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
