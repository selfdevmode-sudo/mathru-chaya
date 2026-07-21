import type { Metadata, Viewport } from "next";
import {
  Marcellus,
  Inter,
  Noto_Sans_Kannada,
  Noto_Sans_Devanagari,
  Noto_Serif_Kannada,
  Noto_Serif_Devanagari,
} from "next/font/google";
import { BRAND_BG } from "@/lib/brand";
import { readContent } from "@/lib/db";
import { getLang } from "@/lib/i18n";
import "./globals.css";

// Root layout is intentionally minimal — the public site chrome (header/nav/
// footer) lives in app/(site)/layout.tsx and the admin chrome lives in
// app/admin/(dashboard)/layout.tsx, so each area can look distinct.
//
// The business name comes from content, never a literal (ADR-0005). The public
// site overrides this in app/(site)/layout.tsx; this is what the admin gets.
export async function generateMetadata(): Promise<Metadata> {
  const content = await readContent();
  return {
    title: content.site.name,
    // Built from the Kalyani mark by `npm run icons` (scripts/make-icons.mjs).
    // Declared here rather than via Next's app/icon.* file convention because
    // those become server routes, and the static site is produced by crawling
    // HTML pages — a route nothing links to would never land in out/.
    icons: {
      icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    },
    // Written at generate time by scripts/snapshot.mjs, for the same reason.
    manifest: "/site.webmanifest",
  };
}

export const viewport: Viewport = {
  // Colours the phone browser's address bar to match the page instead of
  // leaving it default grey.
  themeColor: BRAND_BG,
  // Lets the page paint into the area around the iPhone notch/home indicator,
  // which is also what makes env(safe-area-inset-*) non-zero — globals.css
  // uses those insets to keep the sticky call bar and the side gutters clear
  // of the home indicator and the rounded corners.
  viewportFit: "cover",
};

// ---------------------------------------------------------------------------
// Typography (self-hosted at build time via next/font/google — no CDN calls
// at runtime, fonts are downloaded once during `next build`/`next dev` and
// served from this app's own origin).
//
// English headings use Marcellus (an inscriptional, temple-stone display
// face); Kannada/Hindi headings fall back to the matching Noto *Serif*
// script so every language gets a characterful heading face instead of a
// generic system font. Body/UI text uses Inter for Latin and the matching
// Noto *Sans* script for Kannada/Hindi. Each font exposes a CSS variable
// (see globals.css `--font-head` / `--font-body`, which chain these
// variables together) so the browser automatically renders whichever
// script a given string uses with the right face.
// ---------------------------------------------------------------------------
const marcellus = Marcellus({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body-latin",
  display: "swap",
});

const notoSansKannada = Noto_Sans_Kannada({
  subsets: ["kannada"],
  weight: ["400", "500", "600"],
  variable: "--font-body-kn",
  display: "swap",
});

const notoSansDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  weight: ["400", "500", "600"],
  variable: "--font-body-hi",
  display: "swap",
});

const notoSerifKannada = Noto_Serif_Kannada({
  subsets: ["kannada"],
  weight: ["400", "600"],
  variable: "--font-head-kn",
  display: "swap",
});

const notoSerifDevanagari = Noto_Serif_Devanagari({
  subsets: ["devanagari"],
  weight: ["400", "600"],
  variable: "--font-head-hi",
  display: "swap",
});

const FONT_VARS = [
  marcellus.variable,
  inter.variable,
  notoSansKannada.variable,
  notoSansDevanagari.variable,
  notoSerifKannada.variable,
  notoSerifDevanagari.variable,
].join(" ");

// Applies the visitor's saved web/mobile view-toggle choice to <html>
// before first paint, so there is no flash back to the "auto" layout.
// Mirrors what ViewToggle.tsx writes to localStorage.
const VIEW_MODE_SCRIPT = `(function(){try{var m=localStorage.getItem("viewMode");var r=document.documentElement;if(m==="web"){r.classList.add("force-web");}else if(m==="mobile"){r.classList.add("force-mobile");}}catch(e){}})();`;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The language lives in a cookie, not the URL (the /kn and /hi prefixes are
  // middleware rewrites), so <html lang> has to be resolved the same way every
  // page resolves its strings. Getting this right matters for screen-reader
  // pronunciation and for Google indexing the Kannada/Hindi pages as such.
  const lang = await getLang();

  return (
    <html lang={lang} className={FONT_VARS}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: VIEW_MODE_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
