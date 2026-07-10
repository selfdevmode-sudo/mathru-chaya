import { notFound } from "next/navigation";
import { readContent } from "@/lib/db";
import { projectMetaLine } from "@/lib/format";
import { getLang, t } from "@/lib/i18n";
import { localizeProject } from "@/lib/localize";
import Lightbox from "@/components/Lightbox";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const content = await readContent();
  const lang = await getLang();
  const project = content.projects.find((p) => p.slug === slug);
  return { title: project ? localizeProject(project, lang).title : "Project" };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const content = await readContent();
  const lang = await getLang();
  // Looked up by slug, which is never translated, then localized for display.
  const raw = content.projects.find((p) => p.slug === slug);

  if (!raw) {
    notFound();
  }

  const project = localizeProject(raw, lang);

  const facts: { label: string; value: string }[] = [];
  if (project.duration) facts.push({ label: t(lang, "duration"), value: project.duration });
  if (project.teamSize) facts.push({ label: t(lang, "team_size"), value: project.teamSize });
  if (project.ledBy) facts.push({ label: t(lang, "led_by"), value: project.ledBy });
  if (project.status) facts.push({ label: t(lang, "status"), value: project.status });

  const photoLabels = project.photos.map((_, i) =>
    t(lang, "photo_view_full", { n: i + 1, total: project.photos.length }),
  );

  return (
    <article className="wrap section project-detail">
      {project.photos.length > 0 ? (
        <div className="detail-backdrop" aria-hidden="true">
          <div
            className="detail-backdrop__image"
            style={{ backgroundImage: `url(${project.photos[0]})` }}
          />
        </div>
      ) : null}

      <div className="section-head">
        {projectMetaLine(project, lang) ? (
          <span className="badge">{projectMetaLine(project, lang)}</span>
        ) : null}
        <h1>{project.title}</h1>
        {project.builtFor ? (
          <p>
            {t(lang, "built_for")} {project.builtFor}
          </p>
        ) : null}
      </div>

      <Lightbox
        photos={project.photos}
        title={project.title}
        labels={{
          closePhotoViewer: t(lang, "close_photo_viewer"),
          previousPhoto: t(lang, "previous_photo"),
          nextPhoto: t(lang, "next_photo"),
          photoAriaLabels: photoLabels,
          viewerAriaLabel: `${project.title} ${t(lang, "photo_viewer_suffix")}`,
        }}
      />

      {project.description ? <p>{project.description}</p> : null}

      {project.materials && project.materials.length > 0 ? (
        <>
          <h3>{t(lang, "materials")}</h3>
          <div className="chip-row">
            {project.materials.map((m) => (
              <span key={m} className="chip">
                {m}
              </span>
            ))}
          </div>
        </>
      ) : null}

      {facts.length > 0 ? (
        <dl className="facts">
          {facts.map((f) => (
            <div key={f.label}>
              <dt>{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      {project.beforeAfter ? (
        <>
          <h3>{t(lang, "before_after")}</h3>
          <div className="before-after">
            <figure>
              <img src={project.beforeAfter.before} alt={`${project.title} before`} />
              <figcaption>{t(lang, "before")}</figcaption>
            </figure>
            <figure>
              <img src={project.beforeAfter.after} alt={`${project.title} after`} />
              <figcaption>{t(lang, "after")}</figcaption>
            </figure>
          </div>
        </>
      ) : null}

      <div className="btn-row">
        {project.videoLink ? (
          <a
            className="btn btn-secondary"
            href={project.videoLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t(lang, "watch_video")}
          </a>
        ) : null}
        {project.mapLink ? (
          <a
            className="btn btn-secondary"
            href={project.mapLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t(lang, "view_location")}
          </a>
        ) : null}
      </div>
    </article>
  );
}
