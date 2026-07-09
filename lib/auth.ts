"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE_NAME } from "./constants";

/**
 * Server action backing the admin login form. Plain string comparison
 * against ADMIN_PASSWORD — no hashing, no user table, one shared password.
 */
export async function login(formData: FormData): Promise<void> {
  const password = String(formData.get("password") || "");
  const expected = process.env.ADMIN_PASSWORD || "";

  if (!expected || password !== expected) {
    redirect("/admin/login?error=1");
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, process.env.SESSION_SECRET || "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  redirect("/admin");
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  redirect("/admin/login");
}
