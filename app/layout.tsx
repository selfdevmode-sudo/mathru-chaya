import type { Metadata } from "next";
import "./globals.css";

// Root layout is intentionally minimal — the public site chrome (header/nav/
// footer) lives in app/(site)/layout.tsx and the admin chrome lives in
// app/admin/(dashboard)/layout.tsx, so each area can look distinct.
export const metadata: Metadata = {
  title: "Shri Builders",
};

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
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: VIEW_MODE_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
