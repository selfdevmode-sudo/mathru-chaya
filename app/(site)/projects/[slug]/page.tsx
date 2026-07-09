import { notFound } from "next/navigation";
import { readContent } from "@/lib/db";
import { projectMetaLine } from "@/lib/format";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const content = await readContent();
  const project = content.projects.find((p) => p.slug === slug);
  return { title: project ? project.title : "Project" };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const content = await readContent();
  const project = content.projects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  const facts: { label: string; value: string }[] = [];
  if (project.duration) facts.push({ label: "Duration", value: project.duration });
  if (project.teamSize) facts.push({ label: "Team size", value: project.teamSize });
  if (project.ledBy) facts.push({ label: "Led by", value: project.ledBy });
  if (project.status) facts.push({ label: "Status", value: project.status });

  return (
    <article className="wrap section">
      <div className="section-head">
        {projectMetaLine(project) ? (
          <span className="badge">{projectMetaLine(project)}</span>
        ) : null}
        <h1>{project.title}</h1>
        {project.builtFor ? <p>Built for {project.builtFor}</p> : null}
      </div>

      {project.photos.length > 0 ? (
        <div className="gallery">
          {project.photos.map((photo, i) => (
            <img key={photo + i} src={photo} alt={`${project.title} photo ${i + 1}`} />
          ))}
        </div>
      ) : null}

      {project.description ? <p>{project.description}</p> : null}

      {project.materials && project.materials.length > 0 ? (
        <>
          <h3>Materials</h3>
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
          <h3>Before &amp; After</h3>
          <div className="before-after">
            <figure>
              <img src={project.beforeAfter.before} alt={`${project.title} before`} />
              <figcaption>Before</figcaption>
            </figure>
            <figure>
              <img src={project.beforeAfter.after} alt={`${project.title} after`} />
              <figcaption>After</figcaption>
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
            Watch video
          </a>
        ) : null}
        {project.mapLink ? (
          <a
            className="btn btn-secondary"
            href={project.mapLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            View location
          </a>
        ) : null}
      </div>
    </article>
  );
}
