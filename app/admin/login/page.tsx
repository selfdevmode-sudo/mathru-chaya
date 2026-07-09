import { login } from "@/lib/auth";

export const metadata = {
  title: "Admin Login",
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const hasError = params.error === "1";

  return (
    <div className="login-shell">
      <div className="login-card">
        <h1>Admin Login</h1>
        <p className="sub">Enter the admin password to continue.</p>

        {hasError ? (
          <div className="error-banner">Incorrect password. Please try again.</div>
        ) : null}

        <form action={login}>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoFocus
            />
          </div>
          <button type="submit" className="btn btn-block">
            Log in
          </button>
        </form>
      </div>
    </div>
  );
}
