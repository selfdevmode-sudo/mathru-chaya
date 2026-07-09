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
  if (langMatch) {
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
    if (pathname === "/admin/login") {
      return NextResponse.next();
    }
    const cookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const secret = process.env.SESSION_SECRET;
    if (!secret || cookie !== secret) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  // Everything except Next's asset routes and uploaded files.
  matcher: ["/((?!_next/|uploads/|favicon.ico).*)"],
};
