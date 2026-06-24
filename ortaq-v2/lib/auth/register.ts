import type { UserRole } from "@/types";
import { defaultRoleForSignup } from "@/lib/auth/roles";
import {
  createUserWithPassword,
  findUserByEmail,
  verifyUserPassword,
} from "@/lib/auth/user-repository";

export type RegisterInput = {
  email: string;
  password: string;
  name?: string;
  role?: string;
};

export type RegisterResult =
  | { ok: true; userId: string; role: UserRole }
  | { ok: false; error: string; code: "CONFLICT" | "INVALID" | "UNAVAILABLE" };

const MIN_PASSWORD_LENGTH = 8;

export async function registerUser(input: RegisterInput): Promise<RegisterResult> {
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

  try {
    const existing = await findUserByEmail(email);
    if (existing) {
      return {
        ok: false,
        code: "CONFLICT",
        error: "Bu e-posta ile kayıtlı bir hesap zaten var.",
      };
    }

    const user = await createUserWithPassword({
      email,
      password: input.password,
      name,
      role,
    });

    return { ok: true, userId: user.id, role: user.role };
  } catch (error) {
    console.error("[auth] Registration failed:", error);
    return {
      ok: false,
      code: "UNAVAILABLE",
      error: "Kayıt şu an tamamlanamıyor. Lütfen biraz sonra tekrar deneyin.",
    };
  }
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
  try {
    const user = await verifyUserPassword(email, password);
    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  } catch (error) {
    console.error("[auth] Credential verification failed:", error);
    return null;
  }
}
