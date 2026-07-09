import { readContent } from "@/lib/db";
import { telLink, waLink } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Contact Us",
};

export default async function ContactPage() {
  const content = await readContent();
  const { site } = content;

  return (
    <div className="wrap section">
      <div className="section-head">
        <h1>Contact Us</h1>
        <p>
          {site.region}
          {site.owners.length ? ` · ${site.owners.join(", ")}` : ""}
        </p>
      </div>

      <div className="contact-grid">
        <div className="contact-card">
          <h3>Call Us</h3>
          <p>{site.phone}</p>
          <a className="btn" href={telLink(site.phone)}>
            Call {site.phone}
          </a>
        </div>

        <div className="contact-card">
          <h3>WhatsApp</h3>
          <p>Send us photos or details of your project.</p>
          <a
            className="btn"
            href={waLink(
              site.whatsapp,
              `Hello ${site.name}, I would like to know more about your work.`,
            )}
            target="_blank"
            rel="noopener noreferrer"
          >
            Chat on WhatsApp
          </a>
        </div>

        {site.email ? (
          <div className="contact-card">
            <h3>Email</h3>
            <p>{site.email}</p>
            <a className="btn btn-secondary" href={`mailto:${site.email}`}>
              Send email
            </a>
          </div>
        ) : null}
      </div>
    </div>
  );
}
