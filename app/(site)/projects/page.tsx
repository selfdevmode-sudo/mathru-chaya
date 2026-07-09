import { readContent } from "@/lib/db";
import { PROJECT_TYPES } from "@/lib/types";
import ProjectGrid from "@/components/ProjectGrid";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Projects",
};

export default async function ProjectsPage() {
  const content = await readContent();
  const { projects } = content;

  const presentTypes = PROJECT_TYPES.filter((type) =>
    projects.some((p) => p.type === type),
  );

  return (
    <div className="wrap section">
      <div className="section-head">
        <h1>Our Projects</h1>
        <p>Temples, ponds and gopuras built and restored across the region.</p>
      </div>

      {projects.length > 0 ? (
        <ProjectGrid projects={projects} types={presentTypes} />
      ) : (
        <div className="empty-state">Projects will appear here soon.</div>
      )}
    </div>
  );
}
