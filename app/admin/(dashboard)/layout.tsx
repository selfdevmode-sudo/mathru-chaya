import Link from "next/link";
import { readContent } from "@/lib/db";
import { logout } from "@/lib/auth";
import { getLang, t } from "@/lib/i18n";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export const dynamic = "force-dynamic";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const content = await readContent();
  const lang = await getLang();

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <h2>
          {content.site.name} {t(lang, "admin_suffix")}
        </h2>
        <LanguageSwitcher lang={lang} className="lang-switch--admin" />
        <nav className="admin-nav">
          <Link href="/admin">{t(lang, "admin_dashboard")}</Link>
          <Link href="/admin/projects">{t(lang, "admin_projects")}</Link>
          <Link href="/admin/awards">{t(lang, "admin_awards")}</Link>
          <Link href="/admin/testimonials">{t(lang, "admin_testimonials")}</Link>
          <Link href="/admin/about">{t(lang, "admin_about")}</Link>
          <Link href="/admin/settings">{t(lang, "admin_settings")}</Link>
          <form action={logout}>
            <button type="submit">{t(lang, "logout")}</button>
          </form>
        </nav>
      </aside>
      <div className="admin-main">{children}</div>
    </div>
  );
}
