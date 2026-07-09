import type { Metadata } from "next";
import Link from "next/link";
import { readContent } from "@/lib/db";
import { telLink, waLink } from "@/lib/format";
import { getLang, t } from "@/lib/i18n";
import ViewToggle from "@/components/ViewToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const content = await readContent();
  return {
    title: {
      default: `${content.site.name} — ${content.site.tagline}`,
      template: `%s — ${content.site.name}`,
    },
    description: content.site.tagline,
  };
}

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const content = await readContent();
  const { site } = content;
  const lang = await getLang();

  const NAV_LINKS = [
    { href: "/", label: t(lang, "nav_home") },
    { href: "/projects", label: t(lang, "nav_projects") },
    { href: "/about", label: t(lang, "nav_about") },
    { href: "/awards", label: t(lang, "nav_awards") },
    { href: "/contact", label: t(lang, "nav_contact") },
  ];

  return (
    <>
      <header className="site-header">
        <div className="wrap site-header__bar">
          <Link href="/" className="site-header__brand">
            <span className="site-header__brand-name">{site.name}</span>
            <span className="site-header__brand-tagline">{site.tagline}</span>
          </Link>
          <div className="site-header__right">
            <nav className="site-nav">
              {NAV_LINKS.map((link) => (
                <Link key={link.href} href={link.href}>
                  {link.label}
                </Link>
              ))}
            </nav>
            <LanguageSwitcher lang={lang} />
            <ViewToggle
              labels={{
                web: t(lang, "view_web"),
                mobile: t(lang, "view_mobile"),
                webTitle: t(lang, "preview_web_layout"),
                mobileTitle: t(lang, "preview_mobile_layout"),
                groupAria: t(lang, "preview_site_layout"),
              }}
            />
          </div>
        </div>
      </header>

      <main>{children}</main>

      <footer className="site-footer">
        <div className="wrap site-footer__bar">
          <div>
            <strong>{site.name}</strong>
            <div>{site.region}</div>
          </div>
          <div>
            <div>{site.phone}</div>
            {site.email ? <div>{site.email}</div> : null}
          </div>
        </div>
      </footer>

      <div className="mobile-cta-bar">
        <a className="call" href={telLink(site.phone)}>
          {t(lang, "call")}
        </a>
        <a
          className="whatsapp"
          href={waLink(site.whatsapp)}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t(lang, "whatsapp")}
        </a>
      </div>
    </>
  );
}
