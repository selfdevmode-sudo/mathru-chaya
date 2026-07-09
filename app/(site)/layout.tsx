import type { Metadata } from "next";
import Link from "next/link";
import { readContent } from "@/lib/db";
import { telLink, waLink } from "@/lib/format";
import ViewToggle from "@/components/ViewToggle";

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

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/awards", label: "Awards" },
  { href: "/contact", label: "Contact" },
];

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const content = await readContent();
  const { site } = content;

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
            <ViewToggle />
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
          Call
        </a>
        <a
          className="whatsapp"
          href={waLink(site.whatsapp)}
          target="_blank"
          rel="noopener noreferrer"
        >
          WhatsApp
        </a>
      </div>
    </>
  );
}
