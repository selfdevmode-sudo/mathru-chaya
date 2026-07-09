import Link from "next/link";
import { readContent } from "@/lib/db";
import { deleteTestimonial } from "@/lib/actions";
import ConfirmSubmitButton from "@/components/ConfirmSubmitButton";

export const dynamic = "force-dynamic";

export const metadata = { title: "Testimonials" };

export default async function AdminTestimonialsPage() {
  const content = await readContent();
  const { testimonials } = content;

  return (
    <div>
      <div className="admin-header">
        <h1>Testimonials</h1>
        <Link href="/admin/testimonials/new" className="btn">
          + Add testimonial
        </Link>
      </div>

      {testimonials.length === 0 ? (
        <div className="empty-state">
          No testimonials yet.{" "}
          <Link href="/admin/testimonials/new">Add your first testimonial</Link>.
        </div>
      ) : (
        <div className="table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Quote</th>
                <th>Place</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {testimonials.map((t) => {
                const boundDelete = deleteTestimonial.bind(null, t.id);
                return (
                  <tr key={t.id}>
                    <td>{t.name}</td>
                    <td>{t.quote.length > 60 ? `${t.quote.slice(0, 60)}…` : t.quote}</td>
                    <td>{t.place || "—"}</td>
                    <td className="row-actions">
                      <Link href={`/admin/testimonials/${t.id}`}>Edit</Link>
                      <form action={boundDelete}>
                        <ConfirmSubmitButton
                          message={`Delete testimonial from "${t.name}"?`}
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
