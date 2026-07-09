import Link from "next/link";
import { createProject } from "@/lib/actions";
import { getLang, t } from "@/lib/i18n";
import ProjectForm from "@/components/admin/ProjectForm";

export const metadata = { title: "Add Project" };

export default async function NewProjectPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const lang = await getLang();

  return (
    <div>
      <Link href="/admin/projects" className="back-link">
        {t(lang, "back_to_projects")}
      </Link>
      <div className="admin-header">
        <h1>{t(lang, "add_project_title")}</h1>
      </div>

      {params.error ? <div className="error-banner">{params.error}</div> : null}

      <ProjectForm action={createProject} submitLabel={t(lang, "create_project")} lang={lang} />
    </div>
  );
}
