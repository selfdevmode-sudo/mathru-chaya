import type { Metadata } from "next";
import "./globals.css";

// Root layout is intentionally minimal — the public site chrome (header/nav/
// footer) lives in app/(site)/layout.tsx and the admin chrome lives in
// app/admin/(dashboard)/layout.tsx, so each area can look distinct.
export const metadata: Metadata = {
  title: "Shri Builders",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
