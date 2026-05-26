/**
 * ORTAQ public environment — safe for client bundle.
 * Server-only secrets belong in ortaq-api, never here.
 */

export type AppEnv = "development" | "staging" | "production";

function readAppEnv(): AppEnv {
  const explicit = process.env.NEXT_PUBLIC_APP_ENV;
  if (explicit === "production" || explicit === "staging" || explicit === "development") {
    return explicit;
  }
  const vercel = process.env.VERCEL_ENV;
  if (vercel === "production") return "production";
  if (vercel === "preview") return "staging";
  return "development";
}

function readSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_ENV === "production") return "https://ortaq.biz";
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "https://ortaq.biz";
}

export const env = {
  appEnv: readAppEnv(),
  siteUrl: readSiteUrl(),
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? "",
  isProduction: readAppEnv() === "production",
  isStaging: readAppEnv() === "staging",
  isDevelopment: readAppEnv() === "development",
  /** Privacy-first analytics — off unless explicitly enabled */
  analytics: {
    enabled: process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === "true",
    provider: process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER ?? "none",
    domain: process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN ?? "",
  },
  /** Error monitoring — wired when DSN is set (server instrumentation) */
  sentry: {
    dsn: process.env.SENTRY_DSN ?? "",
    enabled: Boolean(process.env.SENTRY_DSN),
  },
} as const;
