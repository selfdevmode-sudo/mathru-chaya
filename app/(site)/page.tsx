import Link from "next/link";
import { readContent } from "@/lib/db";
import { projectMetaLine } from "@/lib/format";
import Divider from "@/components/Divider";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const content = await readContent();
  const { site, projects, awards, testimonials, about } = content;

  const featured = projects.filter((p) => p.featured);
  const showcase = (featured.length > 0 ? featured : projects).slice(0, 3);

  return (
    <>
      <section className="hero wrap">
        <h1>{site.name}</h1>
        <p className="tagline">{site.tagline}</p>
        <Link href="/projects" className="btn">
          View our work
        </Link>
      </section>

      {showcase.length > 0 ? (
        <section className="section wrap">
          <div className="section-head">
            <h2>Our Work</h2>
          </div>
          <div className="grid">
            {showcase.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.slug}`}
                className="card"
              >
                <div className={`card__photo${project.photos[0] ? "" : " placeholder"}`}>
                  {project.photos[0] ? (
                    <img src={project.photos[0]} alt={project.title} />
                  ) : (
                    <span>🛕</span>
                  )}
                </div>
                <div className="card__body">
                  <h3>{project.title}</h3>
                  {projectMetaLine(project) ? (
                    <p className="card__meta">{projectMetaLine(project)}</p>
                  ) : null}
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {about?.body ? (
        <>
          <Divider />
          <section className="section wrap">
            <h2>About Us</h2>
            <p>{about.body.split("\n").filter(Boolean)[0]}</p>
            <Link href="/about">Read more about us →</Link>
          </section>
        </>
      ) : null}

      {awards.length > 0 ? (
        <>
          <Divider />
          <section className="section wrap">
            <h2>Recognition</h2>
            <div className="grid">
              {awards.slice(0, 3).map((award) => (
                <div key={award.id} className="card">
                  <div className={`card__photo${award.photo ? "" : " placeholder"}`}>
                    {award.photo ? (
                      <img src={award.photo} alt={award.title} />
                    ) : (
                      <span>🏆</span>
                    )}
                  </div>
                  <div className="card__body">
                    <h3>{award.title}</h3>
                    {award.givenBy ? (
                      <p className="card__meta">Given by {award.givenBy}</p>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
            <div className="btn-row">
              <Link href="/awards" className="btn btn-secondary">
                All awards
              </Link>
            </div>
          </section>
        </>
      ) : null}

      {testimonials.length > 0 ? (
        <>
          <Divider />
          <section className="section wrap">
            <h2>What Our Clients Say</h2>
            <div className="grid">
              {testimonials.slice(0, 3).map((t) => (
                <div key={t.id} className="testimonial">
                  <p className="quote">&ldquo;{t.quote}&rdquo;</p>
                  <p className="who">
                    {t.name}
                    {t.role ? `, ${t.role}` : ""}
                    {t.place ? ` — ${t.place}` : ""}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </>
      ) : null}

      <Divider />
      <section className="section wrap">
        <h2>Get in Touch</h2>
        <p>
          {site.region}
          {site.owners.length ? ` · ${site.owners.join(", ")}` : ""}
        </p>
        <div className="btn-row">
          <Link href="/contact" className="btn">
            Contact us
          </Link>
        </div>
      </section>
    </>
  );
}
