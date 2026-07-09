import Link from "next/link";
import { readContent } from "@/lib/db";
import { deleteAward } from "@/lib/actions";
import ConfirmSubmitButton from "@/components/ConfirmSubmitButton";

export const dynamic = "force-dynamic";

export const metadata = { title: "Awards" };

export default async function AdminAwardsPage() {
  const content = await readContent();
  const { awards } = content;

  return (
    <div>
      <div className="admin-header">
        <h1>Awards</h1>
        <Link href="/admin/awards/new" className="btn">
          + Add award
        </Link>
      </div>

      {awards.length === 0 ? (
        <div className="empty-state">
          No awards yet. <Link href="/admin/awards/new">Add your first award</Link>.
        </div>
      ) : (
        <div className="table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th></th>
                <th>Title</th>
                <th>Given by</th>
                <th>Year</th>
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
                      <Link href={`/admin/awards/${award.id}`}>Edit</Link>
                      <form action={boundDelete}>
                        <ConfirmSubmitButton
                          message={`Delete "${award.title}"?`}
                          className="btn-danger-inline"
                        >
                          Delete
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
