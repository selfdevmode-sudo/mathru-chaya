import Link from "next/link";
import { createProject } from "@/lib/actions";
import ProjectForm from "@/components/admin/ProjectForm";

export const metadata = { title: "Add Project" };

export default async function NewProjectPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <div>
      <Link href="/admin/projects" className="back-link">
        ← Back to projects
      </Link>
      <div className="admin-header">
        <h1>Add Project</h1>
      </div>

      {params.error ? <div className="error-banner">{params.error}</div> : null}

      <ProjectForm action={createProject} submitLabel="Create project" />
    </div>
  );
}
