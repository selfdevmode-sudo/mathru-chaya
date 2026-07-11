import { readContent } from "@/lib/db";
import { projectMetaLine } from "@/lib/format";
import { getLang, t } from "@/lib/i18n";
import { localizeContent } from "@/lib/localize";
import { localizedHref } from "@/lib/paths";
import Divider from "@/components/Divider";
import KalyaniMark from "@/components/KalyaniMark";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const lang = await getLang();
  const content = localizeContent(await readContent(), lang);
  const { site, projects, awards, testimonials, about } = content;

  const featured = projects.filter((p) => p.featured);
  const showcase = (featured.length > 0 ? featured : projects).slice(0, 3);

  // Hero visual: the featured project's cover photo, falling back to the
  // first project, falling back to nothing (renders a calm placeholder
  // panel instead of a broken image — see .hero-frame--fallback below).
  const heroProject = projects.find((p) => p.featured) ?? projects[0];
  const heroPhoto = heroProject?.photos[0];
  const heroCaption = heroProject
    ? [heroProject.title, heroProject.place].filter(Boolean).join(", ")
    : "";

  return (
    <>
      <section className="hero">
        <div className="wrap hero-grid">
          <div className="hero__col hero__col--text">
            <p className="eyebrow">
              <KalyaniMark size={16} className="eyebrow__mark" />
              {site.region}
            </p>
            <h1>{site.name}</h1>
            <p className="tagline">{site.tagline}</p>
            <p className="hero__line">{t(lang, "hero_line")}</p>
            <div className="btn-row">
              <a href={localizedHref(lang, "/projects")} className="btn">
                {t(lang, "cta_view_work")}
              </a>
              <a href={localizedHref(lang, "/contact")} className="btn btn-secondary">
                {t(lang, "nav_contact")}
              </a>
            </div>
          </div>

          <div className="hero__col hero__col--visual">
            {heroPhoto && heroProject ? (
              <figure className="hero-frame">
                <div className="hero-frame__image">
                  <img src={heroPhoto} alt={heroProject.title} />
                </div>
                <div className="hero-frame__steps" aria-hidden="true">
                  <span className="hero-frame__step hero-frame__step--1" />
                  <span className="hero-frame__step hero-frame__step--2" />
                  <span className="hero-frame__step hero-frame__step--3" />
                  <KalyaniMark size={16} className="hero-frame__mark" />
                </div>
                {heroCaption ? (
                  <figcaption className="hero-frame__caption">{heroCaption}</figcaption>
                ) : null}
              </figure>
            ) : (
              <div className="hero-frame hero-frame--fallback">
                <KalyaniMark size={72} />
                <p>{site.tagline}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {showcase.length > 0 ? (
        <section className="section wrap">
          <div className="section-head">
            <h2>{t(lang, "section_our_work")}</h2>
          </div>
          <div className="grid">
            {showcase.map((project) => (
              <a
                key={project.id}
                href={localizedHref(lang, `/projects/${project.slug}`)}
                className="card"
              >
                <div className={`card__photo${project.photos[0] ? "" : " placeholder"}`}>
                  {project.photos[0] ? (
                    <img src={project.photos[0]} alt={project.title} loading="lazy" />
                  ) : (
                    <KalyaniMark size={44} />
                  )}
                </div>
                <div className="card__body">
                  <h3>{project.title}</h3>
                  {projectMetaLine(project, lang) ? (
                    <p className="card__meta">{projectMetaLine(project, lang)}</p>
                  ) : null}
                </div>
              </a>
            ))}
          </div>
        </section>
      ) : null}

      {about?.body ? (
        <>
          <Divider />
          <section className="section wrap">
            <h2>{t(lang, "section_about_us")}</h2>
            <p>{about.body.split("\n").filter(Boolean)[0]}</p>
            <a href={localizedHref(lang, "/about")}>{t(lang, "read_more_about")}</a>
          </section>
        </>
      ) : null}

      {awards.length > 0 ? (
        <>
          <Divider />
          <section className="section wrap">
            <h2>{t(lang, "section_recognition")}</h2>
            <div className="award-grid">
              {awards.slice(0, 3).map((award) => (
                <div key={award.id} className="card award-card">
                  <div className={`card__photo award-photo${award.photo ? "" : " placeholder"}`}>
                    {award.photo ? (
                      <img src={award.photo} alt={award.title} loading="lazy" />
                    ) : (
                      <KalyaniMark size={44} />
                    )}
                  </div>
                  <div className="card__body">
                    <h3>{award.title}</h3>
                    {award.givenBy ? (
                      <p className="card__meta">
                        {t(lang, "given_by")} {award.givenBy}
                      </p>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
            <div className="btn-row">
              <a href={localizedHref(lang, "/awards")} className="btn btn-secondary">
                {t(lang, "all_awards")}
              </a>
            </div>
          </section>
        </>
      ) : null}

      {testimonials.length > 0 ? (
        <>
          <Divider />
          <section className="section wrap">
            <h2>{t(lang, "section_testimonials")}</h2>
            <div className="grid">
              {testimonials.slice(0, 3).map((tItem) => (
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

      <Divider />
      <section className="section wrap">
        <h2>{t(lang, "section_get_in_touch")}</h2>
        <p>
          {site.region}
          {site.owners.length ? ` · ${site.owners.join(", ")}` : ""}
        </p>
        <div className="btn-row">
          <a href={localizedHref(lang, "/contact")} className="btn">
            {t(lang, "contact_us_btn")}
          </a>
        </div>
      </section>
    </>
  );
}
