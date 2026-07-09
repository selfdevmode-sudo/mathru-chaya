import Link from "next/link";
import { readContent } from "@/lib/db";
import { deleteProject } from "@/lib/actions";
import { projectMetaLine } from "@/lib/format";
import { getLang, t } from "@/lib/i18n";
import ConfirmSubmitButton from "@/components/ConfirmSubmitButton";

export const dynamic = "force-dynamic";

export const metadata = { title: "Projects" };

export default async function AdminProjectsPage() {
  const content = await readContent();
  const { projects } = content;
  const lang = await getLang();

  return (
    <div>
      <div className="admin-header">
        <h1>{t(lang, "admin_projects")}</h1>
        <Link href="/admin/projects/new" className="btn">
          {t(lang, "add_project")}
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="empty-state">
          {t(lang, "no_projects_yet")}{" "}
          <Link href="/admin/projects/new">{t(lang, "add_first_project")}</Link>.
        </div>
      ) : (
        <div className="table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th></th>
                <th>{t(lang, "title")}</th>
                <th>{t(lang, "details_col")}</th>
                <th>{t(lang, "featured_col")}</th>
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
                    <td>{projectMetaLine(project, lang) || "—"}</td>
                    <td>{project.featured ? t(lang, "yes") : ""}</td>
                    <td className="row-actions">
                      <Link href={`/admin/projects/${project.id}`}>{t(lang, "edit")}</Link>
                      <form action={boundDelete}>
                        <ConfirmSubmitButton
                          message={t(lang, "confirm_delete_project", { title: project.title })}
                          className="btn-danger-inline"
                        >
                          {t(lang, "delete")}
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
