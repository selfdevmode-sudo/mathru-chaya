import Link from "next/link";
import { readContent } from "@/lib/db";
import { deleteTestimonial } from "@/lib/actions";
import { getLang, t } from "@/lib/i18n";
import ConfirmSubmitButton from "@/components/ConfirmSubmitButton";

export const dynamic = "force-dynamic";

export const metadata = { title: "Testimonials" };

export default async function AdminTestimonialsPage() {
  const content = await readContent();
  const { testimonials } = content;
  const lang = await getLang();

  return (
    <div>
      <div className="admin-header">
        <h1>{t(lang, "admin_testimonials")}</h1>
        <Link href="/admin/testimonials/new" className="btn">
          {t(lang, "add_testimonial")}
        </Link>
      </div>

      {testimonials.length === 0 ? (
        <div className="empty-state">
          {t(lang, "no_testimonials_yet")}{" "}
          <Link href="/admin/testimonials/new">{t(lang, "add_first_testimonial")}</Link>.
        </div>
      ) : (
        <div className="table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>{t(lang, "name_label")}</th>
                <th>{t(lang, "quote_col")}</th>
                <th>{t(lang, "place")}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {testimonials.map((tItem) => {
                const boundDelete = deleteTestimonial.bind(null, tItem.id);
                return (
                  <tr key={tItem.id}>
                    <td>{tItem.name}</td>
                    <td>{tItem.quote.length > 60 ? `${tItem.quote.slice(0, 60)}…` : tItem.quote}</td>
                    <td>{tItem.place || "—"}</td>
                    <td className="row-actions">
                      <Link href={`/admin/testimonials/${tItem.id}`}>{t(lang, "edit")}</Link>
                      <form action={boundDelete}>
                        <ConfirmSubmitButton
                          message={t(lang, "confirm_delete_testimonial", { name: tItem.name })}
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
