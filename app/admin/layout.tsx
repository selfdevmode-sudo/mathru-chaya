// Shared shell for the whole /admin area (login + dashboard). Kept minimal
// on purpose: it only sets the distinct admin look-and-feel. The actual
// sidebar navigation lives in app/admin/(dashboard)/layout.tsx so the login
// page can render as a plain centered card instead.
export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="admin-body">{children}</div>;
}
