import Link from "next/link";
import { readContent } from "@/lib/db";
import { deleteProject } from "@/lib/actions";
import { projectMetaLine } from "@/lib/format";
import ConfirmSubmitButton from "@/components/ConfirmSubmitButton";

export const dynamic = "force-dynamic";

export const metadata = { title: "Projects" };

export default async function AdminProjectsPage() {
  const content = await readContent();
  const { projects } = content;

  return (
    <div>
      <div className="admin-header">
        <h1>Projects</h1>
        <Link href="/admin/projects/new" className="btn">
          + Add project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="empty-state">
          No projects yet. <Link href="/admin/projects/new">Add your first project</Link>.
        </div>
      ) : (
        <div className="table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th></th>
                <th>Title</th>
                <th>Details</th>
                <th>Featured</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => {
                const boundDelete = deleteProject.bind(null, project.id);
                return (
                  <tr key={project.id}>
                    <td>
                      {project.photos[0] ? (
                        <img className="thumb-40" src={project.photos[0]} alt="" />
                      ) : null}
                    </td>
                    <td>{project.title}</td>
                    <td>{projectMetaLine(project) || "—"}</td>
                    <td>{project.featured ? "Yes" : ""}</td>
                    <td className="row-actions">
                      <Link href={`/admin/projects/${project.id}`}>Edit</Link>
                      <form action={boundDelete}>
                        <ConfirmSubmitButton
                          message={`Delete "${project.title}"? This cannot be undone.`}
                          className="btn-danger-inline"
                        >
                          Delete
                        </ConfirmSubmitButton>
                      </form>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
