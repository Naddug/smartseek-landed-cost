import type { UserRole } from "@/types";

const VALID_ROLES: UserRole[] = ["opportunity_owner", "partner", "admin"];

export function parseUserRole(value: string | null | undefined): UserRole | null {
  if (!value) return null;
  return VALID_ROLES.includes(value as UserRole) ? (value as UserRole) : null;
}

export function defaultRoleForSignup(
  value: string | null | undefined
): UserRole {
  return parseUserRole(value) ?? "partner";
}
