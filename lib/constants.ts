// Shared between middleware.ts (edge) and lib/auth.ts (server actions),
// so it must stay free of any server-only or client-only imports.
export const SESSION_COOKIE_NAME = "temple_session";
