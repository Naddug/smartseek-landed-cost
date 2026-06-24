import type { UserRole } from "@/types";
import { hasDatabase } from "@/lib/auth/db";
import { prisma } from "@/lib/prisma";

export type UserProfileRecord = {
  onboardingCompleted: boolean;
  onboardingStep: string | null;
  intendedRole: UserRole | null;
  sideSelectedAt: Date | null;
};

export async function ensureUserProfile(
  userId: string,
  options?: { role?: UserRole; markSideSelected?: boolean }
): Promise<UserProfileRecord | null> {
  if (!hasDatabase()) return null;

  const role = options?.role;
  const now = options?.markSideSelected ? new Date() : undefined;

  const profile = await prisma.userProfile.upsert({
    where: { userId },
    create: {
      userId,
      intendedRole: role ?? null,
      sideSelectedAt: now,
    },
    update: {
      ...(role ? { intendedRole: role } : {}),
      ...(now ? { sideSelectedAt: now } : {}),
    },
    select: {
      onboardingCompleted: true,
      onboardingStep: true,
      intendedRole: true,
      sideSelectedAt: true,
    },
  });

  return profile;
}

export async function getUserProfile(
  userId: string
): Promise<UserProfileRecord | null> {
  if (!hasDatabase()) return null;

  return prisma.userProfile.findUnique({
    where: { userId },
    select: {
      onboardingCompleted: true,
      onboardingStep: true,
      intendedRole: true,
      sideSelectedAt: true,
    },
  });
}

export async function applySignupRoleToUser(
  userId: string,
  role: UserRole
): Promise<void> {
  if (!hasDatabase()) return;

  await prisma.user.update({
    where: { id: userId },
    data: { role },
  });

  await ensureUserProfile(userId, { role, markSideSelected: true });
}
