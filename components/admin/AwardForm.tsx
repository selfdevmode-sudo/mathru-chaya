import Link from "next/link";
import type { Award } from "@/lib/types";

export default function AwardForm({
  award,
  action,
  submitLabel,
}: {
  award?: Award;
  action: (formData: FormData) => void | Promise<void>;
  submitLabel: string;
}) {
  return (
    <form action={action} className="form-card" encType="multipart/form-data">
      <div className="field">
        <label htmlFor="title">Title *</label>
        <input
          id="title"
          name="title"
          type="text"
          required
          defaultValue={award?.title}
          placeholder="e.g. Best Heritage Restoration"
        />
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="givenBy">Given by</label>
          <input id="givenBy" name="givenBy" type="text" defaultValue={award?.givenBy} />
        </div>
        <div className="field">
          <label htmlFor="year">Year</label>
          <input id="year" name="year" type="number" defaultValue={award?.year} />
        </div>
      </div>

      {award?.photo ? (
        <div className="field">
          <label>Current photo</label>
          <div className="existing-photos">
            <div className="existing-photo">
              <img src={award.photo} alt="" />
            </div>
          </div>
        </div>
      ) : null}

      <div className="field">
        <label htmlFor="photo">{award?.photo ? "Replace photo" : "Photo"}</label>
        <input id="photo" name="photo" type="file" accept="image/*" />
      </div>

      <div className="field">
        <label htmlFor="note">Note</label>
        <textarea id="note" name="note" defaultValue={award?.note} />
      </div>

      <div className="btn-row">
        <button type="submit" className="btn">
          {submitLabel}
        </button>
        <Link href="/admin/awards" className="btn btn-secondary">
          Cancel
        </Link>
      </div>
    </form>
  );
}
