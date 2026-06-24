import { prisma } from "@/lib/prisma";

export function hasDatabase(): boolean {
  return Boolean(process.env.DATABASE_URL?.trim());
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
    console.warn("[auth] Database unreachable — using file-backed auth store.", error);
    databaseReady = false;
  }

  databaseReadyCheckedAt = now;
  return databaseReady;
}

export async function shouldUseDatabaseAuth(): Promise<boolean> {
  return isDatabaseReady();
}
