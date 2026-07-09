import Link from "next/link";
import { readContent } from "@/lib/db";
import { deleteAward } from "@/lib/actions";
import { getLang, t } from "@/lib/i18n";
import ConfirmSubmitButton from "@/components/ConfirmSubmitButton";

export const dynamic = "force-dynamic";

export const metadata = { title: "Awards" };

export default async function AdminAwardsPage() {
  const content = await readContent();
  const { awards } = content;
  const lang = await getLang();

  return (
    <div>
      <div className="admin-header">
        <h1>{t(lang, "admin_awards")}</h1>
        <Link href="/admin/awards/new" className="btn">
          {t(lang, "add_award")}
        </Link>
      </div>

      {awards.length === 0 ? (
        <div className="empty-state">
          {t(lang, "no_awards_yet")}{" "}
          <Link href="/admin/awards/new">{t(lang, "add_first_award")}</Link>.
        </div>
      ) : (
        <div className="table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th></th>
                <th>{t(lang, "title")}</th>
                <th>{t(lang, "given_by")}</th>
                <th>{t(lang, "year_label")}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {awards.map((award) => {
                const boundDelete = deleteAward.bind(null, award.id);
                return (
                  <tr key={award.id}>
                    <td>
                      {award.photo ? <img className="thumb-40" src={award.photo} alt="" /> : null}
                    </td>
                    <td>{award.title}</td>
                    <td>{award.givenBy || "—"}</td>
                    <td>{award.year || "—"}</td>
                    <td className="row-actions">
                      <Link href={`/admin/awards/${award.id}`}>{t(lang, "edit")}</Link>
                      <form action={boundDelete}>
                        <ConfirmSubmitButton
                          message={t(lang, "confirm_delete_award", { title: award.title })}
                          className="btn-danger-inline"
                        >
                          {t(lang, "delete")}
                        </ConfirmSubmitButton>
                      </form>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
