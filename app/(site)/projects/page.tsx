import { readContent } from "@/lib/db";
import { PROJECT_TYPES } from "@/lib/types";
import { getLang, t } from "@/lib/i18n";
import { localizeProject } from "@/lib/localize";
import { localizedHref } from "@/lib/paths";
import EmptyState from "@/components/EmptyState";
import ProjectGrid from "@/components/ProjectGrid";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return { title: t(await getLang(), "section_our_work") };
}

export default async function ProjectsPage() {
  const content = await readContent();
  const lang = await getLang();
  // Localized on the server, so ProjectGrid (a client component) receives
  // already-translated data and never touches lib/i18n.ts's runtime.
  const projects = content.projects.map((p) => localizeProject(p, lang));

  const presentTypes = PROJECT_TYPES.filter((type) =>
    projects.some((p) => p.type === type),
  );

  return (
    <div className="wrap section">
      <div className="section-head">
        <h1>{t(lang, "projects_heading")}</h1>
        {/* The subheading is blank by default — render nothing rather than an
            empty <p>, which would still take up its margin. */}
        {t(lang, "projects_subheading") ? (
          <p>{t(lang, "projects_subheading")}</p>
        ) : null}
      </div>

      {projects.length > 0 ? (
        <ProjectGrid
          projects={projects}
          types={presentTypes}
          lang={lang}
          allLabel={t(lang, "filter_all")}
        />
      ) : (
        <EmptyState
          message={t(lang, "projects_empty")}
          actionHref={localizedHref(lang, "/contact")}
          actionLabel={t(lang, "nav_contact")}
        />
      )}
    </div>
  );
}
