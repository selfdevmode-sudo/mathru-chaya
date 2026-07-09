import { readContent } from "@/lib/db";
import { PROJECT_TYPES } from "@/lib/types";
import { getLang, t } from "@/lib/i18n";
import ProjectGrid from "@/components/ProjectGrid";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Our Work",
};

export default async function ProjectsPage() {
  const content = await readContent();
  const { projects } = content;
  const lang = await getLang();

  const presentTypes = PROJECT_TYPES.filter((type) =>
    projects.some((p) => p.type === type),
  );

  return (
    <div className="wrap section">
      <div className="section-head">
        <h1>{t(lang, "projects_heading")}</h1>
        <p>{t(lang, "projects_subheading")}</p>
      </div>

      {projects.length > 0 ? (
        <ProjectGrid
          projects={projects}
          types={presentTypes}
          lang={lang}
          allLabel={t(lang, "filter_all")}
        />
      ) : (
        <div className="empty-state">{t(lang, "projects_empty")}</div>
      )}
    </div>
  );
}
