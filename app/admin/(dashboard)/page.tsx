import Link from "next/link";
import { readContent } from "@/lib/db";
import { getLang, t } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Dashboard",
};

export default async function AdminDashboardPage() {
  const content = await readContent();
  const lang = await getLang();

  const stats = [
    { label: t(lang, "admin_projects"), value: content.projects.length },
    { label: t(lang, "admin_awards"), value: content.awards.length },
    { label: t(lang, "admin_testimonials"), value: content.testimonials.length },
    { label: t(lang, "admin_services"), value: content.services.length },
  ];

  return (
    <div>
      <div className="admin-header">
        <h1>{t(lang, "admin_dashboard")}</h1>
      </div>

      <div className="stat-grid">
        {stats.map((s) => (
          <div key={s.label} className="stat-card">
            <div className="num">{s.value}</div>
            <div className="label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="btn-row">
        <Link href="/admin/projects/new" className="btn">
          {t(lang, "add_project")}
        </Link>
        <Link href="/admin/awards/new" className="btn btn-secondary">
          {t(lang, "add_award")}
        </Link>
        <Link href="/admin/testimonials/new" className="btn btn-secondary">
          {t(lang, "add_testimonial")}
        </Link>
      </div>

      <p>
        <a href="/" target="_blank" rel="noopener noreferrer">
          {t(lang, "view_public_site")}
        </a>
      </p>
    </div>
  );
}
