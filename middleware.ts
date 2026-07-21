import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME } from "./lib/constants";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Public language prefixes.
  //    /kn/... and /hi/... render the same (un-prefixed) page in that
  //    language. We rewrite to the neutral path and forward a `lang` cookie
  //    so getLang() picks the language up. This makes language switching work
  //    on the local app and during `npm run generate`. On the deployed STATIC
  //    site these are real files (out/kn/..., out/hi/...), so middleware never
  //    runs there — this is purely for local dev + generation.
  const langMatch = pathname.match(/^\/(kn|hi)(\/.*)?$/);
  // The admin is NOT localized (it has its own cookie-based switcher). Never
  // rewrite /kn/admin or /hi/admin onto the real /admin routes: that rewrite
  // returns before the auth block below, and middleware doesn't re-run on an
  // internal rewrite, so it would hand back the full admin with no session
  // cookie. Let such paths fall through — there is no localized admin route,
  // so they 404, which is the correct answer for a URL that doesn't exist.
  if (langMatch && !(langMatch[2] ?? "").startsWith("/admin")) {
    const lang = langMatch[1];
    const rest = langMatch[2] || "/";
    const url = request.nextUrl.clone();
    url.pathname = rest;

    const headers = new Headers(request.headers);
    const existing = request.headers.get("cookie") ?? "";
    const withoutLang = existing
      .split(";")
      .map((c) => c.trim())
      .filter((c) => c && !c.startsWith("lang="))
      .join("; ");
    headers.set(
      "cookie",
      `${withoutLang ? `${withoutLang}; ` : ""}lang=${lang}`,
    );

    return NextResponse.rewrite(url, { request: { headers } });
  }

  // 2. Admin auth — only for /admin/*.
  if (pathname.startsWith("/admin")) {
    // Compare without the trailing slash. next.config.ts sets
    // `trailingSlash: true`, and Next's canonicalizing 308 runs BEFORE
    // middleware — so the login page actually arrives here as
    // "/admin/login/". An exact match on "/admin/login" therefore never fired:
    // the login page fell through to the auth check below, was redirected to
    // "/admin/login", 308'd back to "/admin/login/", and looped until the
    // browser gave up. Any logged-out visit (expired cookie, logout, new
    // browser) bricked the admin.
    if (pathname.replace(/\/$/, "") === "/admin/login") {
      return NextResponse.next();
    }
    const cookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const secret = process.env.SESSION_SECRET;
    if (!secret || cookie !== secret) {
      // Trailing slash to match trailingSlash:true — otherwise every guarded
      // request costs an extra 308 hop.
      return NextResponse.redirect(new URL("/admin/login/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  // Everything except Next's asset routes and uploaded files.
  matcher: ["/((?!_next/|uploads/|favicon.ico).*)"],
};
