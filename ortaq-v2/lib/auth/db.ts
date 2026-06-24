import { prisma } from "@/lib/prisma";

export function hasDatabase(): boolean {
  return Boolean(process.env.DATABASE_URL?.trim());
}

/** True on Vercel and other production Node environments. */
export function isProductionRuntime(): boolean {
  return process.env.NODE_ENV === "production" || process.env.VERCEL === "1";
}

/** Local JSON auth store — never used in production deployments. */
export function canUseLocalFileAuthStore(): boolean {
  return !isProductionRuntime();
}

let databaseReady: boolean | null = null;
let databaseReadyCheckedAt = 0;
const DATABASE_READY_TTL_MS = 30_000;

export async function isDatabaseReady(): Promise<boolean> {
  if (!hasDatabase()) return false;

  const now = Date.now();
  if (databaseReady !== null && now - databaseReadyCheckedAt < DATABASE_READY_TTL_MS) {
    return databaseReady;
  }

  try {
    await prisma.$queryRaw`SELECT 1`;
    databaseReady = true;
  } catch (error) {
    if (isProductionRuntime()) {
      console.error("[auth] Database unreachable in production.", error);
    } else {
      console.warn("[auth] Database unreachable — using local file auth store.", error);
    }
    databaseReady = false;
  }

  databaseReadyCheckedAt = now;
  return databaseReady;
}

export async function shouldUseDatabaseAuth(): Promise<boolean> {
  if (!hasDatabase()) return false;
  return isDatabaseReady();
}

export async function assertAuthPersistenceAvailable(): Promise<void> {
  if (!isProductionRuntime()) return;

  if (!hasDatabase()) {
    throw new Error("DATABASE_URL is required for authentication in production.");
  }

  if (!(await shouldUseDatabaseAuth())) {
    throw new Error("Database must be reachable for authentication in production.");
  }
}
