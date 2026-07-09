import { login } from "@/lib/auth";
import { getLang, t } from "@/lib/i18n";

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
  const lang = await getLang();

  return (
    <div className="login-shell">
      <div className="login-card">
        <h1>{t(lang, "admin_login_heading")}</h1>
        <p className="sub">{t(lang, "admin_login_sub")}</p>

        {hasError ? (
          <div className="error-banner">{t(lang, "incorrect_password")}</div>
        ) : null}

        <form action={login}>
          <div className="field">
            <label htmlFor="password">{t(lang, "password")}</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoFocus
            />
          </div>
          <button type="submit" className="btn btn-block">
            {t(lang, "login")}
          </button>
        </form>
      </div>
    </div>
  );
}
