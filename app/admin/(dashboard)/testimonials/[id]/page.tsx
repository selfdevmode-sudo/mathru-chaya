import Link from "next/link";
import { notFound } from "next/navigation";
import { readContent } from "@/lib/db";
import { updateTestimonial, deleteTestimonial } from "@/lib/actions";
import { getLang, t } from "@/lib/i18n";
import TestimonialForm from "@/components/admin/TestimonialForm";
import ConfirmSubmitButton from "@/components/ConfirmSubmitButton";

export const dynamic = "force-dynamic";

export const metadata = { title: "Edit Testimonial" };

export default async function EditTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const content = await readContent();
  const testimonial = content.testimonials.find((t) => t.id === id);
  const lang = await getLang();

  if (!testimonial) {
    notFound();
  }

  const boundUpdate = updateTestimonial.bind(null, testimonial.id);
  const boundDelete = deleteTestimonial.bind(null, testimonial.id);

  return (
    <div>
      <Link href="/admin/testimonials" className="back-link">
        {t(lang, "back_to_testimonials")}
      </Link>
      <div className="admin-header">
        <h1>{t(lang, "edit_testimonial")}</h1>
      </div>

      <TestimonialForm
        testimonial={testimonial}
        action={boundUpdate}
        submitLabel={t(lang, "save_changes")}
        lang={lang}
      />

      <div style={{ marginTop: "1.5rem" }}>
        <form action={boundDelete}>
          <ConfirmSubmitButton message={t(lang, "confirm_delete_testimonial", { name: testimonial.name })}>
            {t(lang, "delete_this_testimonial")}
          </ConfirmSubmitButton>
        </form>
      </div>
    </div>
  );
}
