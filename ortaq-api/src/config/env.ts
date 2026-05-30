/**
 * ORTAQ API environment — server only. Never expose to client.
 */
export type ApiEnv = "development" | "staging" | "production";

function readEnv(): ApiEnv {
  const raw = process.env.APP_ENV ?? process.env.RAILWAY_ENVIRONMENT ?? "development";
  if (raw === "production") return "production";
  if (raw === "staging" || raw === "preview") return "staging";
  return "development";
}

export const config = {
  env: readEnv(),
  port: Number(process.env.PORT ?? 4000),
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:3001",
  publicWebUrl: process.env.PUBLIC_WEB_URL ?? "http://localhost:3001",
  logLevel: process.env.LOG_LEVEL ?? "info",
  databaseUrl: process.env.DATABASE_URL ?? "",
  sessionSecret: process.env.SESSION_SECRET ?? "",
  adminApiKey: process.env.ADMIN_API_KEY ?? "",
  spkWebhookSecret: process.env.SPK_PARTNER_WEBHOOK_SECRET ?? "",
} as const;

export function assertProductionSecrets(): void {
  if (config.env !== "production") return;
  if (!config.sessionSecret || config.sessionSecret.length < 32) {
    console.warn("[ortaq-api] SESSION_SECRET not set — required before auth goes live");
  }
  if (!config.adminApiKey) {
    console.warn("[ortaq-api] ADMIN_API_KEY not set — admin routes disabled in production");
  }
}
