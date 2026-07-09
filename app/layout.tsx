import type { Metadata } from "next";
import {
  Marcellus,
  Inter,
  Noto_Sans_Kannada,
  Noto_Sans_Devanagari,
  Noto_Serif_Kannada,
  Noto_Serif_Devanagari,
} from "next/font/google";
import "./globals.css";

// Root layout is intentionally minimal — the public site chrome (header/nav/
// footer) lives in app/(site)/layout.tsx and the admin chrome lives in
// app/admin/(dashboard)/layout.tsx, so each area can look distinct.
export const metadata: Metadata = {
  title: "Shri Builders",
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={FONT_VARS}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: VIEW_MODE_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
