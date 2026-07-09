"use client";

import type { Lang } from "@/lib/i18n";

// Mirrors LANG_LABELS in lib/i18n.ts. Duplicated locally (rather than
// imported) because lib/i18n.ts pulls in `next/headers`, which cannot be
// bundled into a client component — see the note at the top of that file.
const LABELS: Record<Lang, string> = {
  en: "English",
  kn: "ಕನ್ನಡ",
  hi: "हिंदी",
};

const LANGS: Lang[] = ["en", "kn", "hi"];

function setLangCookie(lang: Lang) {
  const maxAge = 60 * 60 * 24 * 365; // ~1 year
  document.cookie = `lang=${lang}; path=/; max-age=${maxAge}; SameSite=Lax`;
  location.reload();
}

/**
 * Compact segmented control for switching the interface language. Reads the
 * current language from a `lang` prop passed by the server layout — never
 * from cookies() directly (this is a client component). On click it sets
 * the `lang` cookie and reloads so server components re-render in the new
 * language.
 */
export default function LanguageSwitcher({
  lang,
  className,
}: {
  lang: Lang;
  className?: string;
}) {
  return (
    <div
      className={`lang-switch${className ? ` ${className}` : ""}`}
      role="group"
      aria-label="Choose language"
    >
      {LANGS.map((code) => (
        <button
          key={code}
          type="button"
          className={`lang-switch__btn${lang === code ? " is-active" : ""}`}
          aria-pressed={lang === code}
          onClick={() => setLangCookie(code)}
        >
          {LABELS[code]}
        </button>
      ))}
    </div>
  );
}
