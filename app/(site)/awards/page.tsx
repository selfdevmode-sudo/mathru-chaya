import { readContent } from "@/lib/db";
import { getLang, t } from "@/lib/i18n";
import KalyaniMark from "@/components/KalyaniMark";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Awards & Recognition",
};

export default async function AwardsPage() {
  const content = await readContent();
  const { awards } = content;
  const lang = await getLang();

  return (
    <div className="wrap section">
      <div className="section-head">
        <h1>{t(lang, "awards_heading")}</h1>
      </div>

      {awards.length > 0 ? (
        <div className="grid">
          {awards.map((award) => (
            <div key={award.id} className="card">
              <div className={`card__photo award-photo${award.photo ? "" : " placeholder"}`}>
                {award.photo ? (
                  <img src={award.photo} alt={award.title} />
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
                {award.year ? <p className="card__meta">{award.year}</p> : null}
                {award.note ? <p>{award.note}</p> : null}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">{t(lang, "awards_empty")}</div>
      )}
    </div>
  );
}
