const DEV_FALLBACK_SECRET = "ortaq-local-dev-secret-do-not-use-in-production";

/** Resolves NextAuth secret without throwing during build. */
export function getAuthSecret(): string | undefined {
  const secret = process.env.NEXTAUTH_SECRET?.trim();
  if (secret) return secret;

  if (process.env.NODE_ENV === "development") {
    return DEV_FALLBACK_SECRET;
  }

  return undefined;
}

export function getAuthUrl(): string {
  return process.env.NEXTAUTH_URL?.trim() || "http://localhost:3000";
}
