import Link from "next/link";
import { createTestimonial } from "@/lib/actions";
import { getLang, t } from "@/lib/i18n";
import TestimonialForm from "@/components/admin/TestimonialForm";

export const metadata = { title: "Add Testimonial" };

export default async function NewTestimonialPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const lang = await getLang();

  return (
    <div>
      <Link href="/admin/testimonials" className="back-link">
        {t(lang, "back_to_testimonials")}
      </Link>
      <div className="admin-header">
        <h1>{t(lang, "add_testimonial_title")}</h1>
      </div>

      {params.error ? <div className="error-banner">{params.error}</div> : null}

      <TestimonialForm action={createTestimonial} submitLabel={t(lang, "create_testimonial")} lang={lang} />
    </div>
  );
}
