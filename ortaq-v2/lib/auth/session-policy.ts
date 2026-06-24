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
  const sanitizedNext = next ? sanitizeNextPath(next) : null;

  if (!ctx.sideSelected) {
    return registerPathChoiceHref(sanitizedNext ?? DEFAULT_DESTINATION);
  }

  if (!ctx.onboardingCompleted) {
    const onboardingPath = onboardingPathForRole(ctx.role);
    if (sanitizedNext) {
      return `${onboardingPath}?next=${encodeURIComponent(sanitizedNext)}`;
    }
    return onboardingPath;
  }

  if (sanitizedNext) return sanitizedNext;
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
    sideSelected: session?.user?.sideSelected ?? false,
  };
}
