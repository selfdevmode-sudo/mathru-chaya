import Link from "next/link";
import type { Project } from "@/lib/types";
import { PROJECT_TYPES } from "@/lib/types";
import { typeLabel } from "@/lib/format";
import ProjectPhotos from "@/components/admin/ProjectPhotos";

export default function ProjectForm({
  project,
  action,
  submitLabel,
}: {
  project?: Project;
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
          defaultValue={project?.title}
          placeholder="e.g. Sri Venkataramana Temple"
        />
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="type">Type</label>
          <select id="type" name="type" defaultValue={project?.type ?? ""}>
            <option value="">— Not set —</option>
            {PROJECT_TYPES.map((t) => (
              <option key={t} value={t}>
                {typeLabel(t)}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="place">Place</label>
          <input id="place" name="place" type="text" defaultValue={project?.place} />
        </div>
        <div className="field">
          <label htmlFor="year">Year completed</label>
          <input id="year" name="year" type="number" defaultValue={project?.year} />
        </div>
      </div>

      <div className="field">
        <label htmlFor="builtFor">Built for</label>
        <input
          id="builtFor"
          name="builtFor"
          type="text"
          defaultValue={project?.builtFor}
          placeholder="e.g. Village temple committee"
        />
      </div>

      <div className="field">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          defaultValue={project?.description}
        />
      </div>

      <div className="field">
        <label htmlFor="materials">
          Materials <span className="hint">(comma separated)</span>
        </label>
        <input
          id="materials"
          name="materials"
          type="text"
          defaultValue={project?.materials?.join(", ")}
          placeholder="e.g. Granite, Teak wood, Copper kalasha"
        />
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="duration">Duration</label>
          <input id="duration" name="duration" type="text" defaultValue={project?.duration} placeholder="e.g. 8 months" />
        </div>
        <div className="field">
          <label htmlFor="teamSize">Team size</label>
          <input id="teamSize" name="teamSize" type="text" defaultValue={project?.teamSize} placeholder="e.g. 12 workers" />
        </div>
        <div className="field">
          <label htmlFor="ledBy">Led by</label>
          <input id="ledBy" name="ledBy" type="text" defaultValue={project?.ledBy} />
        </div>
      </div>

      <div className="field">
        <label htmlFor="status">Status</label>
        <input
          id="status"
          name="status"
          type="text"
          defaultValue={project?.status}
          placeholder="e.g. Completed, Ongoing"
        />
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="mapLink">Location map link</label>
          <input id="mapLink" name="mapLink" type="url" defaultValue={project?.mapLink} placeholder="https://maps.google.com/..." />
        </div>
        <div className="field">
          <label htmlFor="videoLink">Video link</label>
          <input id="videoLink" name="videoLink" type="url" defaultValue={project?.videoLink} placeholder="https://youtube.com/..." />
        </div>
      </div>

      <ProjectPhotos existing={project?.photos ?? []} />

      <div className="field">
        <label>Before / after photos (optional)</label>
        {project?.beforeAfter ? (
          <div className="existing-photos">
            <div className="existing-photo">
              <img src={project.beforeAfter.before} alt="Before" />
              <span>Before</span>
            </div>
            <div className="existing-photo">
              <img src={project.beforeAfter.after} alt="After" />
              <span>After</span>
            </div>
          </div>
        ) : null}
        <div className="field-row">
          <div className="field">
            <label htmlFor="beforePhoto">Before photo</label>
            <input id="beforePhoto" name="beforePhoto" type="file" accept="image/*" />
          </div>
          <div className="field">
            <label htmlFor="afterPhoto">After photo</label>
            <input id="afterPhoto" name="afterPhoto" type="file" accept="image/*" />
          </div>
        </div>
        {project?.beforeAfter ? (
          <div className="checkbox-field" style={{ marginTop: "0.6rem" }}>
            <input type="checkbox" id="clearBeforeAfter" name="clearBeforeAfter" />
            <label htmlFor="clearBeforeAfter">Remove before/after photos</label>
          </div>
        ) : null}
      </div>

      <div className="checkbox-field field">
        <input
          type="checkbox"
          id="featured"
          name="featured"
          defaultChecked={project?.featured}
        />
        <label htmlFor="featured">Feature this project on the home page</label>
      </div>

      <div className="btn-row">
        <button type="submit" className="btn">
          {submitLabel}
        </button>
        <Link href="/admin/projects" className="btn btn-secondary">
          Cancel
        </Link>
      </div>
    </form>
  );
}
