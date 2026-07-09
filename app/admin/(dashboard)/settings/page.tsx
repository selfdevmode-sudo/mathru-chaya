import { readContent } from "@/lib/db";
import { updateSiteInfo } from "@/lib/actions";

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

  return (
    <div>
      <div className="admin-header">
        <h1>Site Info</h1>
      </div>

      {params.saved ? <div className="success-banner">Saved.</div> : null}

      <form action={updateSiteInfo} className="form-card">
        <div className="field">
          <label htmlFor="name">Business name *</label>
          <input id="name" name="name" type="text" required defaultValue={site.name} />
        </div>

        <div className="field">
          <label htmlFor="tagline">Tagline *</label>
          <input
            id="tagline"
            name="tagline"
            type="text"
            required
            defaultValue={site.tagline}
          />
        </div>

        <div className="field">
          <label htmlFor="owners">
            Owners <span className="hint">(comma separated)</span>
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
            <label htmlFor="phone">Phone *</label>
            <input id="phone" name="phone" type="tel" required defaultValue={site.phone} />
          </div>
          <div className="field">
            <label htmlFor="whatsapp">
              WhatsApp number <span className="hint">(digits only, with country code)</span>
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
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" defaultValue={site.email} />
        </div>

        <div className="field">
          <label htmlFor="region">Region *</label>
          <input
            id="region"
            name="region"
            type="text"
            required
            defaultValue={site.region}
            placeholder="e.g. Udupi, Karnataka"
          />
        </div>

        <div className="btn-row">
          <button type="submit" className="btn">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
