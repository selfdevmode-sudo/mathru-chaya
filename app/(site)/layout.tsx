import type { Metadata } from "next";
import { readContent } from "@/lib/db";
import { telLink, waLink } from "@/lib/format";
import { getLang, t, type Lang } from "@/lib/i18n";
import { localizeSite } from "@/lib/localize";
import { localizedHref } from "@/lib/paths";
import { SITE_URL } from "@/lib/site-url";
import ViewToggle from "@/components/ViewToggle";
import LanguageLinks from "@/components/LanguageLinks";
import NavAutoClose from "@/components/NavAutoClose";

export const dynamic = "force-dynamic";

/** og:locale wants a full locale tag, not the bare language code we store. */
const OG_LOCALES: Record<Lang, string> = {
  en: "en_IN",
  kn: "kn_IN",
  hi: "hi_IN",
};

export async function generateMetadata(): Promise<Metadata> {
  const content = await readContent();
  const lang = await getLang();
  const site = localizeSite(content.site, lang);
  const { name, tagline } = site;
  const title = tagline ? `${name} — ${tagline}` : name;

  // The sentence a search result or share card shows under the title: the
  // tagline if set, else the owner's hero line, else the built-in default —
  // and undefined rather than "" if all three are blank, so we don't emit an
  // empty <meta description>.
  const description = tagline || site.heroLine || t(lang, "hero_line") || undefined;

  // The picture that shows up when the owner sends the link on WhatsApp — by
  // far how most customers will first see this site. Prefer the chosen hero,
  // then the featured project's cover, then anything at all; a share card with
  // no photo reads as a dead link.
  const shareImage =
    content.site.heroPhoto ||
    content.projects.find((p) => p.featured)?.photos[0] ||
    content.projects[0]?.photos[0] ||
    content.gallery[0];

  return {
    // Resolves the relative image path below (and any other relative metadata
    // URL) against the real origin — WhatsApp/Facebook ignore relative og:image.
    metadataBase: new URL(SITE_URL),
    title: {
      default: title,
      template: `%s — ${name}`,
    },
    description,
    openGraph: {
      type: "website",
      siteName: name,
      title,
      description,
      locale: OG_LOCALES[lang],
      images: shareImage ? [shareImage] : undefined,
    },
    twitter: {
      card: shareImage ? "summary_large_image" : "summary",
      title,
      description,
      images: shareImage ? [shareImage] : undefined,
    },
  };
}

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const content = await readContent();
  const lang = await getLang();
  const site = localizeSite(content.site, lang);

  const NAV_LINKS = [
    { href: "/", label: t(lang, "nav_home") },
    { href: "/projects", label: t(lang, "nav_projects") },
    { href: "/gallery", label: t(lang, "nav_gallery") },
    { href: "/about", label: t(lang, "nav_about") },
    { href: "/awards", label: t(lang, "nav_awards") },
    { href: "/contact", label: t(lang, "nav_contact") },
  ];

  return (
    <>
      <header className="site-header">
        <div className="wrap site-header__bar">
          <a href={localizedHref(lang, "/")} className="site-header__brand">
            <span className="site-header__brand-name">{site.name}</span>
            {site.tagline ? (
              <span className="site-header__brand-tagline">{site.tagline}</span>
            ) : null}
          </a>

          {/* No-JS disclosure: on wide screens the panel below is forced
              open and the summary hamburger is hidden (see globals.css),
              so desktop sees a single row. On narrow screens it collapses
              behind the hamburger so the header stays a slim single bar. */}
          <details className="nav-disclosure">
            <summary aria-label={t(lang, "nav_menu")}>
              <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                aria-hidden="true"
                focusable="false"
              >
                <line x1="3" y1="6" x2="19" y2="6" />
                <line x1="3" y1="11" x2="19" y2="11" />
                <line x1="3" y1="16" x2="19" y2="16" />
              </svg>
            </summary>
            <div className="nav-disclosure__panel">
              <nav className="site-nav">
                {NAV_LINKS.map((link) => (
                  <a key={link.href} href={localizedHref(lang, link.href)}>
                    {link.label}
                  </a>
                ))}
              </nav>
              <LanguageLinks lang={lang} />
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
          </details>
          <NavAutoClose />
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
