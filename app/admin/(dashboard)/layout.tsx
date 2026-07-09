import Link from "next/link";
import { readContent } from "@/lib/db";
import { logout } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const content = await readContent();

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <h2>{content.site.name} Admin</h2>
        <nav className="admin-nav">
          <Link href="/admin">Dashboard</Link>
          <Link href="/admin/projects">Projects</Link>
          <Link href="/admin/awards">Awards</Link>
          <Link href="/admin/testimonials">Testimonials</Link>
          <Link href="/admin/about">About</Link>
          <Link href="/admin/settings">Site info</Link>
          <form action={logout}>
            <button type="submit">Logout</button>
          </form>
        </nav>
      </aside>
      <div className="admin-main">{children}</div>
    </div>
  );
}
