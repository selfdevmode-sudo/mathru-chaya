import Link from "next/link";
import { notFound } from "next/navigation";
import { readContent } from "@/lib/db";
import { updateProject, deleteProject } from "@/lib/actions";
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

  if (!project) {
    notFound();
  }

  const boundUpdate = updateProject.bind(null, project.id);
  const boundDelete = deleteProject.bind(null, project.id);

  return (
    <div>
      <Link href="/admin/projects" className="back-link">
        ← Back to projects
      </Link>
      <div className="admin-header">
        <h1>Edit Project</h1>
      </div>

      <ProjectForm project={project} action={boundUpdate} submitLabel="Save changes" />

      <div style={{ marginTop: "1.5rem" }}>
        <form action={boundDelete}>
          <ConfirmSubmitButton message={`Delete "${project.title}"? This cannot be undone.`}>
            Delete this project
          </ConfirmSubmitButton>
        </form>
      </div>
    </div>
  );
}
