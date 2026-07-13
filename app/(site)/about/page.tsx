import { readContent } from "@/lib/db";
import { getLang, t } from "@/lib/i18n";
import { localizeContent } from "@/lib/localize";
import Divider from "@/components/Divider";
import KalyaniMark from "@/components/KalyaniMark";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return { title: t(await getLang(), "section_about_us") };
}

export default async function AboutPage() {
  const lang = await getLang();
  const content = localizeContent(await readContent(), lang);
  const { about, services, testimonials, site } = content;

  const paragraphs = about.body.split("\n").filter((line) => line.trim() !== "");
  const aside = Boolean(about.heroPhoto || about.yearsExperience);

  return (
    <div className="wrap section about">
      <header className="about-head">
        {site.region ? (
          <p className="eyebrow">
            <KalyaniMark size={16} className="eyebrow__mark" />
            {site.region}
          </p>
        ) : null}
        <h1>{t(lang, "about_us")}</h1>
      </header>

      <div className={aside ? "about-grid" : undefined}>
        {aside ? (
          <aside className="about-aside">
            {about.heroPhoto ? (
              <figure className="hero-frame about-figure">
                <div className="hero-frame__image">
                  <img src={about.heroPhoto} alt="" loading="lazy" />
                </div>
                <div className="hero-frame__steps" aria-hidden="true">
                  <span className="hero-frame__step hero-frame__step--1" />
                  <span className="hero-frame__step hero-frame__step--2" />
                  <span className="hero-frame__step hero-frame__step--3" />
                  <KalyaniMark size={16} className="hero-frame__mark" />
                </div>
              </figure>
            ) : null}
            {about.yearsExperience ? (
              <p className="about-years">
                <span className="about-years__num">{about.yearsExperience}</span>
                <span className="about-years__label">
                  {t(lang, "years_experience_suffix")}
                </span>
              </p>
            ) : null}
          </aside>
        ) : null}

        {paragraphs.length > 0 ? (
          <div className="about-body">
            {paragraphs.map((para, i) => (
              <p key={i} className={i === 0 ? "about-body__lead" : undefined}>
                {para}
              </p>
            ))}
          </div>
        ) : (
          <p className="about-body">{t(lang, "about_empty")}</p>
        )}
      </div>

      {services.length > 0 ? (
        <>
          <Divider />
          <section className="about-section">
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
          </section>
        </>
      ) : null}

      {testimonials.length > 0 ? (
        <>
          <Divider />
          <section className="about-section">
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
          </section>
        </>
      ) : null}
    </div>
  );
}
