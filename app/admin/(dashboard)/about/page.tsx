import { readContent } from "@/lib/db";
import { updateAbout } from "@/lib/actions";

export const dynamic = "force-dynamic";

export const metadata = { title: "About" };

export default async function AdminAboutPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const content = await readContent();
  const { about } = content;
  const params = await searchParams;

  return (
    <div>
      <div className="admin-header">
        <h1>About</h1>
      </div>

      {params.saved ? <div className="success-banner">Saved.</div> : null}

      <form action={updateAbout} className="form-card" encType="multipart/form-data">
        <div className="field">
          <label htmlFor="body">
            About text <span className="hint">(one paragraph per line)</span>
          </label>
          <textarea
            id="body"
            name="body"
            rows={10}
            defaultValue={about.body}
            placeholder="Tell visitors about your work, your family tradition, your craftsmanship..."
          />
        </div>

        <div className="field">
          <label htmlFor="yearsExperience">Years of experience</label>
          <input
            id="yearsExperience"
            name="yearsExperience"
            type="number"
            defaultValue={about.yearsExperience}
          />
        </div>

        {about.heroPhoto ? (
          <div className="field">
            <label>Current photo</label>
            <div className="existing-photos">
              <div className="existing-photo">
                <img src={about.heroPhoto} alt="" />
              </div>
            </div>
          </div>
        ) : null}

        <div className="field">
          <label htmlFor="heroPhoto">{about.heroPhoto ? "Replace photo" : "Photo"}</label>
          <input id="heroPhoto" name="heroPhoto" type="file" accept="image/*" />
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
