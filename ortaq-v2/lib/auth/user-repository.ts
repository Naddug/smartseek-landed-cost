import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import type { UserRole } from "@/types";
import { defaultRoleForSignup } from "@/lib/auth/roles";
import { shouldUseDatabaseAuth } from "@/lib/auth/db";
import { prisma } from "@/lib/prisma";
import { getStoredUserProfile, saveStoredUserProfile } from "@/lib/profile/repository";

const STORE_DIR = path.join(process.cwd(), "data/store");
const USERS_FILE = path.join(STORE_DIR, "auth-users.json");

export type StoredAuthUser = {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  passwordHash: string | null;
  emailVerified: string | null;
  image: string | null;
  sideSelectedAt: string | null;
  createdAt: string;
  updatedAt: string;
  accounts: {
    provider: string;
    providerAccountId: string;
  }[];
};

export type AuthUserRecord = {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  passwordHash: string | null;
  image: string | null;
  sideSelected: boolean;
};

async function readAllFileUsers(): Promise<StoredAuthUser[]> {
  if (process.env.VERCEL) {
    return [];
  }

  try {
    const raw = await fs.readFile(USERS_FILE, "utf-8");
    return JSON.parse(raw) as StoredAuthUser[];
  } catch {
    return [];
  }
}

async function writeAllFileUsers(users: StoredAuthUser[]): Promise<void> {
  if (process.env.VERCEL) {
    throw new Error("DATABASE_URL is required for authentication in production.");
  }

  await fs.mkdir(STORE_DIR, { recursive: true });
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
}

function toAuthUserRecord(user: StoredAuthUser): AuthUserRecord {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    passwordHash: user.passwordHash,
    image: user.image,
    sideSelected: Boolean(user.sideSelectedAt),
  };
}

async function bootstrapProfile(userId: string, role: UserRole) {
  const profile = await getStoredUserProfile(userId, role);
  profile.role = role;
  await saveStoredUserProfile(profile);
}

async function createFileUser(input: {
  email: string;
  name: string;
  role: UserRole;
  passwordHash: string | null;
  image?: string | null;
  markSideSelected?: boolean;
}): Promise<AuthUserRecord> {
  const now = new Date().toISOString();
  const user: StoredAuthUser = {
    id: randomUUID(),
    email: input.email,
    name: input.name,
    role: input.role,
    passwordHash: input.passwordHash,
    emailVerified: input.passwordHash ? null : now,
    image: input.image ?? null,
    sideSelectedAt: input.markSideSelected ? now : null,
    createdAt: now,
    updatedAt: now,
    accounts: [],
  };

  const all = await readAllFileUsers();
  all.push(user);
  await writeAllFileUsers(all);
  await bootstrapProfile(user.id, user.role);

  return toAuthUserRecord(user);
}

async function findFileUserByEmail(email: string): Promise<StoredAuthUser | null> {
  const all = await readAllFileUsers();
  return all.find((user) => user.email === email) ?? null;
}

async function findFileUserById(userId: string): Promise<StoredAuthUser | null> {
  const all = await readAllFileUsers();
  return all.find((user) => user.id === userId) ?? null;
}

async function updateFileUser(
  userId: string,
  patch: Partial<Pick<StoredAuthUser, "role" | "name" | "image" | "sideSelectedAt">>
): Promise<AuthUserRecord | null> {
  const all = await readAllFileUsers();
  const index = all.findIndex((user) => user.id === userId);
  if (index === -1) return null;

  const next = {
    ...all[index],
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  all[index] = next;
  await writeAllFileUsers(all);

  if (patch.role) {
    await bootstrapProfile(userId, patch.role);
  }

  return toAuthUserRecord(next);
}

export async function findUserByEmail(email: string): Promise<AuthUserRecord | null> {
  const normalized = email.trim().toLowerCase();

  if (await shouldUseDatabaseAuth()) {
    const user = await prisma.user.findUnique({
      where: { email: normalized },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        passwordHash: true,
        image: true,
        profile: { select: { sideSelectedAt: true } },
      },
    });
    if (!user) return null;
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      passwordHash: user.passwordHash,
      image: user.image,
      sideSelected: Boolean(user.profile?.sideSelectedAt),
    };
  }

  const fileUser = await findFileUserByEmail(normalized);
  return fileUser ? toAuthUserRecord(fileUser) : null;
}

export async function findUserById(userId: string): Promise<AuthUserRecord | null> {
  if (await shouldUseDatabaseAuth()) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        passwordHash: true,
        image: true,
        profile: { select: { sideSelectedAt: true } },
      },
    });
    if (!user) return null;
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      passwordHash: user.passwordHash,
      image: user.image,
      sideSelected: Boolean(user.profile?.sideSelectedAt),
    };
  }

  const fileUser = await findFileUserById(userId);
  return fileUser ? toAuthUserRecord(fileUser) : null;
}

export async function createUserWithPassword(input: {
  email: string;
  password: string;
  name?: string;
  role?: string;
}): Promise<{ id: string; role: UserRole }> {
  if (process.env.VERCEL && !(await shouldUseDatabaseAuth())) {
    throw new Error("DATABASE_URL is required for authentication in production.");
  }

  const email = input.email.trim().toLowerCase();
  const name = input.name?.trim() || email.split("@")[0];
  const role = defaultRoleForSignup(input.role);
  const passwordHash = await bcrypt.hash(input.password, 12);

  if (await shouldUseDatabaseAuth()) {
    const user = await prisma.user.create({
      data: { email, name, role, passwordHash },
      select: { id: true, role: true },
    });

    await prisma.userProfile.create({
      data: {
        userId: user.id,
        intendedRole: role,
        sideSelectedAt: new Date(),
      },
    });

    await bootstrapProfile(user.id, user.role);
    return user;
  }

  const created = await createFileUser({
    email,
    name,
    role,
    passwordHash,
    markSideSelected: true,
  });

  return { id: created.id, role: created.role };
}

export async function verifyUserPassword(
  email: string,
  password: string
): Promise<AuthUserRecord | null> {
  const normalized = email.trim().toLowerCase();

  if (await shouldUseDatabaseAuth()) {
    const user = await prisma.user.findUnique({
      where: { email: normalized },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        passwordHash: true,
        image: true,
        profile: { select: { sideSelectedAt: true } },
      },
    });

    if (!user?.passwordHash) return null;
    if (!(await bcrypt.compare(password, user.passwordHash))) return null;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      passwordHash: user.passwordHash,
      image: user.image,
      sideSelected: Boolean(user.profile?.sideSelectedAt),
    };
  }

  const fileUser = await findFileUserByEmail(normalized);
  if (!fileUser?.passwordHash) return null;
  if (!(await bcrypt.compare(password, fileUser.passwordHash))) return null;

  return toAuthUserRecord(fileUser);
}

export async function updateUserRole(userId: string, role: UserRole): Promise<void> {
  const now = new Date().toISOString();

  if (await shouldUseDatabaseAuth()) {
    await prisma.user.update({
      where: { id: userId },
      data: { role },
    });

    await prisma.userProfile.upsert({
      where: { userId },
      create: {
        userId,
        intendedRole: role,
        sideSelectedAt: new Date(),
      },
      update: {
        intendedRole: role,
        sideSelectedAt: new Date(),
      },
    });

    await bootstrapProfile(userId, role);
    return;
  }

  await updateFileUser(userId, { role, sideSelectedAt: now });
}

export async function findOrCreateOAuthUser(input: {
  email: string;
  name?: string | null;
  image?: string | null;
  provider: string;
  providerAccountId: string;
  role?: UserRole | null;
}): Promise<AuthUserRecord> {
  if (process.env.VERCEL && !(await shouldUseDatabaseAuth())) {
    throw new Error("DATABASE_URL is required for OAuth in production.");
  }

  const email = input.email.trim().toLowerCase();
  const role = input.role ?? defaultRoleForSignup(undefined);
  const markSideSelected = Boolean(input.role);

  if (await shouldUseDatabaseAuth()) {
    let user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name: input.name ?? email.split("@")[0],
          image: input.image,
          role,
          emailVerified: new Date(),
        },
        include: { profile: true },
      });

      await prisma.userProfile.create({
        data: {
          userId: user.id,
          intendedRole: role,
          sideSelectedAt: markSideSelected ? new Date() : null,
        },
      });

      await bootstrapProfile(user.id, user.role);
    }

    await prisma.account.upsert({
      where: {
        provider_providerAccountId: {
          provider: input.provider,
          providerAccountId: input.providerAccountId,
        },
      },
      create: {
        userId: user.id,
        type: "oauth",
        provider: input.provider,
        providerAccountId: input.providerAccountId,
      },
      update: { userId: user.id },
    });

    if (input.role && user.role !== input.role) {
      await updateUserRole(user.id, input.role);
      user.role = input.role;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      passwordHash: user.passwordHash,
      image: user.image,
      sideSelected: Boolean(user.profile?.sideSelectedAt ?? markSideSelected),
    };
  }

  const all = await readAllFileUsers();
  let existing = all.find((user) => user.email === email) ?? null;

  if (!existing) {
    const created = await createFileUser({
      email,
      name: input.name ?? email.split("@")[0],
      role,
      passwordHash: null,
      image: input.image,
      markSideSelected,
    });
    existing = (await findFileUserById(created.id))!;
  } else if (input.role && existing.role !== input.role) {
    await updateFileUser(existing.id, {
      role: input.role,
      sideSelectedAt: new Date().toISOString(),
    });
    existing = (await findFileUserById(existing.id))!;
  }

  const accountExists = existing.accounts.some(
    (account) =>
      account.provider === input.provider &&
      account.providerAccountId === input.providerAccountId
  );

  if (!accountExists) {
    existing.accounts.push({
      provider: input.provider,
      providerAccountId: input.providerAccountId,
    });
    existing.updatedAt = new Date().toISOString();
    const index = all.findIndex((user) => user.id === existing!.id);
    all[index] = existing;
    await writeAllFileUsers(all);
  }

  return toAuthUserRecord(existing);
}

export async function hydrateAuthSession(userId: string): Promise<{
  role: UserRole;
  onboardingCompleted: boolean;
  sideSelected: boolean;
  profileCompletionLevel: import("@/types/profile-onboarding").ProfileCompletionLevel;
}> {
  const user = await findUserById(userId);
  const stored = await getStoredUserProfile(userId, user?.role ?? "partner");

  return {
    role: user?.role ?? stored.role,
    onboardingCompleted: stored.onboardingCompleted,
    sideSelected: user?.sideSelected ?? false,
    profileCompletionLevel: stored.completionLevel,
  };
}
