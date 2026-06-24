import {
  onboardingPathForRole,
  registerPathChoiceHref,
  sanitizeNextPath,
} from "@/lib/auth/routes";

export type PostAuthContext = {
  role: string;
  onboardingCompleted: boolean;
  sideSelected: boolean;
};

const DEFAULT_DESTINATION = "/panel";

export function resolvePostAuthDestination(
  ctx: PostAuthContext,
  next?: string | null
): string {
  if (next) return sanitizeNextPath(next);

  if (!ctx.sideSelected) {
    return registerPathChoiceHref(DEFAULT_DESTINATION);
  }

  if (!ctx.onboardingCompleted) {
    return onboardingPathForRole(ctx.role);
  }

  return DEFAULT_DESTINATION;
}

export function sessionToPostAuthContext(session: {
  user?: {
    role?: string;
    onboardingCompleted?: boolean;
    sideSelected?: boolean;
  };
} | null): PostAuthContext {
  return {
    role: session?.user?.role ?? "partner",
    onboardingCompleted: session?.user?.onboardingCompleted ?? false,
    sideSelected: session?.user?.sideSelected ?? true,
  };
}
