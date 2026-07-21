"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE_NAME } from "./constants";

/**
 * Server action backing the admin login form. Plain string comparison
 * against ADMIN_PASSWORD — no hashing, no user table, one shared password.
 *
 * Every redirect here ends in a trailing slash to match `trailingSlash: true`
 * in next.config.ts. Without it each one costs an extra 308 hop, and the
 * middleware's login exemption used to miss entirely (see middleware.ts).
 */
export async function login(formData: FormData): Promise<void> {
  const password = String(formData.get("password") || "");
  const expected = process.env.ADMIN_PASSWORD || "";

  if (!expected || password !== expected) {
    redirect("/admin/login/?error=1");
  }

  // The session cookie IS the secret, so with no secret the cookie would be ""
  // — which middleware rejects. Login would "succeed" and bounce straight back
  // to this page looking exactly like a wrong password, with nothing to tell
  // the owner why. Fail with a distinct message instead of a silent lockout.
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    redirect("/admin/login/?error=config");
  }

  // Only mark the cookie Secure when the request actually arrived over HTTPS.
  // Keying it off NODE_ENV instead (the admin normally runs under `next start`,
  // i.e. production) silently broke logging in from a phone over the LAN —
  // browsers drop a Secure cookie on a plain-http origin, so the owner would
  // log in, get bounced back to the login page, and never know why. localhost
  // is exempt from that rule, which is why it only failed off-machine.
  const proto = (await headers()).get("x-forwarded-proto") ?? "http";

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, secret, {
    httpOnly: true,
    sameSite: "lax",
    secure: proto === "https",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  redirect("/admin/");
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  redirect("/admin/login/");
}
