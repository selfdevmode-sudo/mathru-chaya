import Link from "next/link";
import { createTestimonial } from "@/lib/actions";
import TestimonialForm from "@/components/admin/TestimonialForm";

export const metadata = { title: "Add Testimonial" };

export default async function NewTestimonialPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <div>
      <Link href="/admin/testimonials" className="back-link">
        ← Back to testimonials
      </Link>
      <div className="admin-header">
        <h1>Add Testimonial</h1>
      </div>

      {params.error ? <div className="error-banner">{params.error}</div> : null}

      <TestimonialForm action={createTestimonial} submitLabel="Create testimonial" />
    </div>
  );
}
