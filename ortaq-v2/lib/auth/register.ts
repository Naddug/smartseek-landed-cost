import bcrypt from "bcryptjs";
import type { UserRole } from "@/types";
import { hasDatabase } from "@/lib/auth/db";
import { ensureUserProfile } from "@/lib/auth/profile";
import { defaultRoleForSignup } from "@/lib/auth/roles";
import { prisma } from "@/lib/prisma";

export type RegisterInput = {
  email: string;
  password: string;
  name?: string;
  role?: string;
};

export type RegisterResult =
  | { ok: true; userId: string; role: UserRole }
  | { ok: false; error: string; code: "UNAVAILABLE" | "CONFLICT" | "INVALID" };

const MIN_PASSWORD_LENGTH = 8;

export async function registerUser(input: RegisterInput): Promise<RegisterResult> {
  if (!hasDatabase()) {
    return {
      ok: false,
      code: "UNAVAILABLE",
      error:
        "Kayıt şu an veritabanı bağlantısı olmadan kullanılamıyor. Demo hesaplarla giriş yapabilirsiniz.",
    };
  }

  const email = input.email.trim().toLowerCase();
  const name = input.name?.trim() || email.split("@")[0];
  const role = defaultRoleForSignup(input.role);

  if (!email || !email.includes("@")) {
    return { ok: false, code: "INVALID", error: "Geçerli bir e-posta girin." };
  }

  if (!input.password || input.password.length < MIN_PASSWORD_LENGTH) {
    return {
      ok: false,
      code: "INVALID",
      error: `Şifre en az ${MIN_PASSWORD_LENGTH} karakter olmalı.`,
    };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return {
      ok: false,
      code: "CONFLICT",
      error: "Bu e-posta ile kayıtlı bir hesap zaten var.",
    };
  }

  const passwordHash = await bcrypt.hash(input.password, 12);

  const user = await prisma.user.create({
    data: {
      email,
      name,
      role,
      passwordHash,
    },
    select: { id: true, role: true },
  });

  await ensureUserProfile(user.id, { role, markSideSelected: true });

  return { ok: true, userId: user.id, role: user.role };
}

export async function verifyCredentials(
  email: string,
  password: string
): Promise<{
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
} | null> {
  if (!hasDatabase()) return null;

  const user = await prisma.user.findUnique({
    where: { email: email.trim().toLowerCase() },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      passwordHash: true,
    },
  });

  if (!user?.passwordHash) return null;

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return null;

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
}
