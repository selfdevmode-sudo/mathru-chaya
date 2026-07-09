import Link from "next/link";
import { notFound } from "next/navigation";
import { readContent } from "@/lib/db";
import { updateTestimonial, deleteTestimonial } from "@/lib/actions";
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

  if (!testimonial) {
    notFound();
  }

  const boundUpdate = updateTestimonial.bind(null, testimonial.id);
  const boundDelete = deleteTestimonial.bind(null, testimonial.id);

  return (
    <div>
      <Link href="/admin/testimonials" className="back-link">
        ← Back to testimonials
      </Link>
      <div className="admin-header">
        <h1>Edit Testimonial</h1>
      </div>

      <TestimonialForm
        testimonial={testimonial}
        action={boundUpdate}
        submitLabel="Save changes"
      />

      <div style={{ marginTop: "1.5rem" }}>
        <form action={boundDelete}>
          <ConfirmSubmitButton message={`Delete testimonial from "${testimonial.name}"?`}>
            Delete this testimonial
          </ConfirmSubmitButton>
        </form>
      </div>
    </div>
  );
}
