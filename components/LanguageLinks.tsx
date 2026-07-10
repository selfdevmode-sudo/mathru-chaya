"use client";

import { usePathname } from "next/navigation";
import type { Lang } from "@/lib/i18n";

// Link-based language switch for the PUBLIC site, so switching works on a
// static host with no server. Each language is a distinct URL:
//   English -> /...        Kannada -> /kn/...        Hindi -> /hi/...
// (The admin keeps the cookie-based LanguageSwitcher, since the admin is
// only ever run locally and is never part of the static build.)
//
// Plain <a>, deliberately — NOT next/link. /kn/… and /hi/… are middleware
// rewrites onto the same underlying route, so Next answers their RSC requests
// with `x-nextjs-rewritten-path: /`. The client router therefore files all
// three languages under ONE cache key: the URL changes, the cached English (or
// Kannada, or Hindi) tree stays on screen, and only a manual refresh fixes it.
// A plain anchor is a document request — the server picks the language off the
// path every time. See lib/paths.ts, which says the same for every other link.

const FULL_LABELS: Record<Lang, string> = {
  en: "English",
  kn: "ಕನ್ನಡ",
  hi: "हिंदी",
};

const SHORT_LABELS: Record<Lang, string> = {
  en: "EN",
  kn: "ಕನ",
  hi: "हि",
};

const LANGS: Lang[] = ["en", "kn", "hi"];

// The language-neutral path: strip a leading /kn or /hi and any trailing
// slash. "/kn/projects/foo/" -> "/projects/foo", "/hi/" -> "/", "/" -> "/".
function neutralBase(pathname: string): string {
  const trimmed = pathname.replace(/\/+$/, "") || "/";
  const m = trimmed.match(/^\/(?:kn|hi)(\/.*)?$/);
  if (m) return m[1] || "/";
  return trimmed;
}

function hrefFor(lang: Lang, base: string): string {
  const suffix = base === "/" ? "" : base; // "" or "/projects/foo"
  if (lang === "en") return suffix === "" ? "/" : `${suffix}/`;
  return `/${lang}${suffix}/`;
}

export default function LanguageLinks({
  lang,
  className,
}: {
  lang: Lang;
  className?: string;
}) {
  const base = neutralBase(usePathname() || "/");
  return (
    <div
      className={`lang-switch${className ? ` ${className}` : ""}`}
      role="group"
      aria-label="Choose language"
    >
      {LANGS.map((code) => (
        <a
          key={code}
          href={hrefFor(code, base)}
          className={`lang-switch__btn${lang === code ? " is-active" : ""}`}
          aria-current={lang === code ? "true" : undefined}
          aria-label={FULL_LABELS[code]}
          title={FULL_LABELS[code]}
        >
          {SHORT_LABELS[code]}
        </a>
      ))}
    </div>
  );
}
