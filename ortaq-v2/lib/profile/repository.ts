import fs from "fs/promises";
import path from "path";
import type { StoredUserProfile } from "@/types/profile-onboarding";
import { emptyStoredProfile } from "@/types/profile-onboarding";
import type { UserRole } from "@/types";
import { hasDatabase } from "@/lib/auth/db";
import { prisma } from "@/lib/prisma";

const STORE_DIR = path.join(process.cwd(), "data/store");
const STORE_FILE = path.join(STORE_DIR, "user-profiles.json");

const useMemoryStore = Boolean(process.env.VERCEL);

const globalStore = globalThis as unknown as {
  __ortaqUserProfiles?: StoredUserProfile[];
};

function memoryReadAll(): StoredUserProfile[] {
  if (!globalStore.__ortaqUserProfiles) {
    globalStore.__ortaqUserProfiles = [];
  }
  return globalStore.__ortaqUserProfiles;
}

function memoryWriteAll(profiles: StoredUserProfile[]): void {
  globalStore.__ortaqUserProfiles = profiles;
}

async function fileReadAll(): Promise<StoredUserProfile[]> {
  try {
    const raw = await fs.readFile(STORE_FILE, "utf-8");
    return JSON.parse(raw) as StoredUserProfile[];
  } catch {
    return [];
  }
}

async function fileWriteAll(profiles: StoredUserProfile[]): Promise<void> {
  await fs.mkdir(STORE_DIR, { recursive: true });
  await fs.writeFile(STORE_FILE, JSON.stringify(profiles, null, 2), "utf-8");
}

async function readAll(): Promise<StoredUserProfile[]> {
  if (useMemoryStore) return memoryReadAll();
  return fileReadAll();
}

async function writeAll(profiles: StoredUserProfile[]): Promise<void> {
  if (useMemoryStore) {
    memoryWriteAll(profiles);
    return;
  }
  await fileWriteAll(profiles);
}

async function readFromPrisma(userId: string): Promise<StoredUserProfile | null> {
  if (!hasDatabase()) return null;

  try {
    const row = await prisma.userProfile.findUnique({
      where: { userId },
      include: { user: { select: { role: true } } },
    });
    if (!row) return null;

    const profileData = (row.profileData ?? {}) as Partial<StoredUserProfile>;

    return {
      userId,
      role: row.user.role,
      completionLevel: row.completionLevel as StoredUserProfile["completionLevel"],
      onboardingStep: row.onboardingStep,
      onboardingCompleted: row.onboardingCompleted,
      partner: profileData.partner ?? emptyStoredProfile(userId, row.user.role).partner,
      ownerProgress:
        profileData.ownerProgress ??
        emptyStoredProfile(userId, row.user.role).ownerProgress,
      updatedAt: row.updatedAt.toISOString(),
    };
  } catch (error) {
    console.error("[profile] Prisma read failed:", error);
    return null;
  }
}

async function writeToPrisma(profile: StoredUserProfile): Promise<void> {
  if (!hasDatabase()) return;

  try {
    await prisma.userProfile.upsert({
      where: { userId: profile.userId },
      create: {
        userId: profile.userId,
        onboardingCompleted: profile.onboardingCompleted,
        onboardingStep: profile.onboardingStep,
        completionLevel: profile.completionLevel,
        profileData: {
          partner: profile.partner,
          ownerProgress: profile.ownerProgress,
        },
      },
      update: {
        onboardingCompleted: profile.onboardingCompleted,
        onboardingStep: profile.onboardingStep,
        completionLevel: profile.completionLevel,
        profileData: {
          partner: profile.partner,
          ownerProgress: profile.ownerProgress,
        },
      },
    });
  } catch (error) {
    console.error("[profile] Prisma write failed:", error);
  }
}

const DEMO_PROFILES: Record<string, Partial<StoredUserProfile>> = {
  "demo@ortaq.biz": {
    role: "opportunity_owner",
    completionLevel: "partial",
    onboardingCompleted: true,
    ownerProgress: {
      lastStep: 4,
      category: "ecommerce",
      stage: "operating_but_blocked",
      locationCity: "istanbul",
      selectedAssets: ["brand", "operations"],
      selectedBlockers: ["partner"],
      partnerPriorities: ["technical_partner"],
    },
  },
  "ortak@ortaq.biz": {
    role: "partner",
    completionLevel: "complete",
    onboardingCompleted: true,
    partner: {
      contributionTypes: ["operations"],
      preferredCategories: ["ecommerce"],
      preferredCities: ["istanbul"],
      engagementMode: "active_operator",
      capitalRange: "",
      experienceAreas: [],
      bio: "",
    },
  },
};

export async function getStoredUserProfile(
  userId: string,
  role: UserRole = "partner"
): Promise<StoredUserProfile> {
  const fromDb = await readFromPrisma(userId);
  if (fromDb) return fromDb;

  const all = await readAll();
  const existing = all.find((p) => p.userId === userId);
  if (existing) return existing;

  const demoSeed = DEMO_PROFILES[userId];
  if (demoSeed) {
    const base = emptyStoredProfile(userId, demoSeed.role ?? role);
    return { ...base, ...demoSeed, updatedAt: new Date().toISOString() };
  }

  return emptyStoredProfile(userId, role);
}

export async function saveStoredUserProfile(profile: StoredUserProfile): Promise<StoredUserProfile> {
  const next = { ...profile, updatedAt: new Date().toISOString() };

  await writeToPrisma(next);

  const all = await readAll();
  const index = all.findIndex((p) => p.userId === next.userId);
  if (index === -1) {
    all.push(next);
  } else {
    all[index] = next;
  }
  await writeAll(all);

  return next;
}
