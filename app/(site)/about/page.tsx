import { readContent } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "About Us",
};

export default async function AboutPage() {
  const content = await readContent();
  const { about, services, testimonials, site } = content;

  const paragraphs = about.body.split("\n").filter((line) => line.trim() !== "");

  return (
    <div className="wrap section">
      <div className="section-head">
        <h1>About {site.name}</h1>
        {about.yearsExperience ? (
          <p className="card__meta">{about.yearsExperience}+ years of experience</p>
        ) : null}
      </div>

      {about.heroPhoto ? (
        <img
          src={about.heroPhoto}
          alt={site.name}
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
        <p>More about us coming soon.</p>
      )}

      {services.length > 0 ? (
        <>
          <h2>What We Do</h2>
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
          <h2>What Our Clients Say</h2>
          <div className="grid">
            {testimonials.map((t) => (
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
        </>
      ) : null}
    </div>
  );
}
