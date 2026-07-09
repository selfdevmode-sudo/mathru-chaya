import Link from "next/link";
import type { Project } from "@/lib/types";
import { PROJECT_TYPES } from "@/lib/types";
import { typeLabel } from "@/lib/format";
import { t, type Lang } from "@/lib/i18n";
import ProjectPhotos from "@/components/admin/ProjectPhotos";

export default function ProjectForm({
  project,
  action,
  submitLabel,
  lang,
}: {
  project?: Project;
  action: (formData: FormData) => void | Promise<void>;
  submitLabel: string;
  lang: Lang;
}) {
  return (
    <form action={action} className="form-card" encType="multipart/form-data">
      <div className="field">
        <label htmlFor="title">{t(lang, "title")} *</label>
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
          <label htmlFor="type">{t(lang, "type_label")}</label>
          <select id="type" name="type" defaultValue={project?.type ?? ""}>
            <option value="">{t(lang, "not_set")}</option>
            {PROJECT_TYPES.map((ty) => (
              <option key={ty} value={ty}>
                {typeLabel(ty, lang)}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="place">{t(lang, "place")}</label>
          <input id="place" name="place" type="text" defaultValue={project?.place} />
        </div>
        <div className="field">
          <label htmlFor="year">{t(lang, "year_completed")}</label>
          <input id="year" name="year" type="number" defaultValue={project?.year} />
        </div>
      </div>

      <div className="field">
        <label htmlFor="builtFor">{t(lang, "built_for")}</label>
        <input
          id="builtFor"
          name="builtFor"
          type="text"
          defaultValue={project?.builtFor}
          placeholder="e.g. Village temple committee"
        />
      </div>

      <div className="field">
        <label htmlFor="description">{t(lang, "description")}</label>
        <textarea
          id="description"
          name="description"
          defaultValue={project?.description}
        />
      </div>

      <div className="field">
        <label htmlFor="materials">
          {t(lang, "materials")} <span className="hint">{t(lang, "comma_separated")}</span>
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
          <label htmlFor="duration">{t(lang, "duration")}</label>
          <input id="duration" name="duration" type="text" defaultValue={project?.duration} placeholder="e.g. 8 months" />
        </div>
        <div className="field">
          <label htmlFor="teamSize">{t(lang, "team_size")}</label>
          <input id="teamSize" name="teamSize" type="text" defaultValue={project?.teamSize} placeholder="e.g. 12 workers" />
        </div>
        <div className="field">
          <label htmlFor="ledBy">{t(lang, "led_by")}</label>
          <input id="ledBy" name="ledBy" type="text" defaultValue={project?.ledBy} />
        </div>
      </div>

      <div className="field">
        <label htmlFor="status">{t(lang, "status")}</label>
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
          <label htmlFor="mapLink">{t(lang, "map_link")}</label>
          <input id="mapLink" name="mapLink" type="url" defaultValue={project?.mapLink} placeholder="https://maps.google.com/..." />
        </div>
        <div className="field">
          <label htmlFor="videoLink">{t(lang, "video_link")}</label>
          <input id="videoLink" name="videoLink" type="url" defaultValue={project?.videoLink} placeholder="https://youtube.com/..." />
        </div>
      </div>

      <ProjectPhotos
        existing={project?.photos ?? []}
        labels={{
          photosLabel: t(lang, "photos_label"),
          addRemoveHint: t(lang, "add_remove_hint"),
          noPhotosYet: t(lang, "no_photos_yet"),
          addImages: t(lang, "add_images"),
          removePhoto: t(lang, "remove_photo_aria"),
        }}
      />

      <div className="field">
        <label>{t(lang, "before_after_photos")}</label>
        {project?.beforeAfter ? (
          <div className="existing-photos">
            <div className="existing-photo">
              <img src={project.beforeAfter.before} alt="Before" />
              <span>{t(lang, "before")}</span>
            </div>
            <div className="existing-photo">
              <img src={project.beforeAfter.after} alt="After" />
              <span>{t(lang, "after")}</span>
            </div>
          </div>
        ) : null}
        <div className="field-row">
          <div className="field">
            <label htmlFor="beforePhoto">{t(lang, "before_photo")}</label>
            <input id="beforePhoto" name="beforePhoto" type="file" accept="image/*" />
          </div>
          <div className="field">
            <label htmlFor="afterPhoto">{t(lang, "after_photo")}</label>
            <input id="afterPhoto" name="afterPhoto" type="file" accept="image/*" />
          </div>
        </div>
        {project?.beforeAfter ? (
          <div className="checkbox-field" style={{ marginTop: "0.6rem" }}>
            <input type="checkbox" id="clearBeforeAfter" name="clearBeforeAfter" />
            <label htmlFor="clearBeforeAfter">{t(lang, "remove_before_after")}</label>
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
        <label htmlFor="featured">{t(lang, "feature_on_home")}</label>
      </div>

      <div className="btn-row">
        <button type="submit" className="btn">
          {submitLabel}
        </button>
        <Link href="/admin/projects" className="btn btn-secondary">
          {t(lang, "cancel")}
        </Link>
      </div>
    </form>
  );
}
