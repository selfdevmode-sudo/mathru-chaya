import { readContent } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Awards & Recognition",
};

export default async function AwardsPage() {
  const content = await readContent();
  const { awards } = content;

  return (
    <div className="wrap section">
      <div className="section-head">
        <h1>Awards &amp; Recognition</h1>
      </div>

      {awards.length > 0 ? (
        <div className="grid">
          {awards.map((award) => (
            <div key={award.id} className="card">
              <div className={`card__photo award-photo${award.photo ? "" : " placeholder"}`}>
                {award.photo ? (
                  <img src={award.photo} alt={award.title} />
                ) : (
                  <span>🏆</span>
                )}
              </div>
              <div className="card__body">
                <h3>{award.title}</h3>
                {award.givenBy ? <p className="card__meta">Given by {award.givenBy}</p> : null}
                {award.year ? <p className="card__meta">{award.year}</p> : null}
                {award.note ? <p>{award.note}</p> : null}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">Awards and recognitions will appear here.</div>
      )}
    </div>
  );
}
