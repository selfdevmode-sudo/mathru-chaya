import Link from "next/link";
import { notFound } from "next/navigation";
import { readContent } from "@/lib/db";
import { updateProject, deleteProject } from "@/lib/actions";
import { getLang, t } from "@/lib/i18n";
import ProjectForm from "@/components/admin/ProjectForm";
import ConfirmSubmitButton from "@/components/ConfirmSubmitButton";

export const dynamic = "force-dynamic";

export const metadata = { title: "Edit Project" };

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const content = await readContent();
  const project = content.projects.find((p) => p.id === id);
  const lang = await getLang();

  if (!project) {
    notFound();
  }

  const boundUpdate = updateProject.bind(null, project.id);
  const boundDelete = deleteProject.bind(null, project.id);

  return (
    <div>
      <Link href="/admin/projects" className="back-link">
        {t(lang, "back_to_projects")}
      </Link>
      <div className="admin-header">
        <h1>{t(lang, "edit_project")}</h1>
      </div>

      <ProjectForm
        project={project}
        action={boundUpdate}
        submitLabel={t(lang, "save_changes")}
        lang={lang}
      />

      <div style={{ marginTop: "1.5rem" }}>
        <form action={boundDelete}>
          <ConfirmSubmitButton message={t(lang, "confirm_delete_project", { title: project.title })}>
            {t(lang, "delete_this_project")}
          </ConfirmSubmitButton>
        </form>
      </div>
    </div>
  );
}
