import Link from "next/link";
import { readContent } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Dashboard",
};

export default async function AdminDashboardPage() {
  const content = await readContent();

  const stats = [
    { label: "Projects", value: content.projects.length },
    { label: "Awards", value: content.awards.length },
    { label: "Testimonials", value: content.testimonials.length },
    { label: "Services", value: content.services.length },
  ];

  return (
    <div>
      <div className="admin-header">
        <h1>Dashboard</h1>
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
          + Add project
        </Link>
        <Link href="/admin/awards/new" className="btn btn-secondary">
          + Add award
        </Link>
        <Link href="/admin/testimonials/new" className="btn btn-secondary">
          + Add testimonial
        </Link>
      </div>

      <p>
        <a href="/" target="_blank" rel="noopener noreferrer">
          View public site →
        </a>
      </p>
    </div>
  );
}
