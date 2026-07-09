import Link from "next/link";
import type { Testimonial } from "@/lib/types";

export default function TestimonialForm({
  testimonial,
  action,
  submitLabel,
}: {
  testimonial?: Testimonial;
  action: (formData: FormData) => void | Promise<void>;
  submitLabel: string;
}) {
  return (
    <form action={action} className="form-card">
      <div className="field">
        <label htmlFor="name">Name *</label>
        <input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={testimonial?.name}
        />
      </div>

      <div className="field">
        <label htmlFor="quote">Quote *</label>
        <textarea id="quote" name="quote" required defaultValue={testimonial?.quote} />
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="place">Place</label>
          <input id="place" name="place" type="text" defaultValue={testimonial?.place} />
        </div>
        <div className="field">
          <label htmlFor="role">Role</label>
          <input
            id="role"
            name="role"
            type="text"
            defaultValue={testimonial?.role}
            placeholder="e.g. Temple committee president"
          />
        </div>
      </div>

      <div className="btn-row">
        <button type="submit" className="btn">
          {submitLabel}
        </button>
        <Link href="/admin/testimonials" className="btn btn-secondary">
          Cancel
        </Link>
      </div>
    </form>
  );
}
