import {
  computeOwnerCompletionLevel,
  computePartnerCompletionLevel,
  marketplaceGateMessage,
  onboardingPathForProfile,
} from "@/lib/profile/completion";
import {
  createDossierEntryHref,
  loginHref,
  onboardingPathForRole,
  partnerApplyLoginHref,
  registerPathChoiceHref,
  sanitizeNextPath,
} from "@/lib/auth/routes";
import type { StoredUserProfile } from "@/types/profile-onboarding";
import type { UserRole } from "@/types";

export type MarketplaceAction = "apply_interest" | "create_dossier";

export type ActionGateResult = {
  allowed: boolean;
  requiresAuth: boolean;
  requiresProfile: boolean;
  wrongRole?: boolean;
  message?: string;
  authHref?: string;
  onboardingHref?: string;
  continueHref?: string;
};

export function onboardingHrefWithNext(
  basePath: string,
  returnPath?: string
): string {
  if (!returnPath) return basePath;
  return `${basePath}?next=${encodeURIComponent(sanitizeNextPath(returnPath))}`;
}

type GateSession = {
  isAuthenticated: boolean;
  role?: UserRole;
  sideSelected?: boolean;
};

type GateProfileContext = {
  profile?: StoredUserProfile | null;
  hasSavedDossier?: boolean;
};

export function resolveApplyInterestGate(
  session: GateSession,
  options?: GateProfileContext & { dossierSlug?: string; returnPath?: string }
): ActionGateResult {
  const returnPath =
    options?.returnPath ??
    (options?.dossierSlug
      ? `/firsatlar/${options.dossierSlug}?intent=apply`
      : undefined);

  if (!session.isAuthenticated) {
    return {
      allowed: false,
      requiresAuth: true,
      requiresProfile: false,
      message: "Başvuru için giriş yapmanız gerekir.",
      authHref: options?.dossierSlug
        ? partnerApplyLoginHref(options.dossierSlug)
        : loginHref(returnPath),
    };
  }

  if (session.role === "opportunity_owner") {
    return {
      allowed: true,
      requiresAuth: false,
      requiresProfile: false,
    };
  }

  const profile = options?.profile;
  if (!profile) {
    return {
      allowed: false,
      requiresAuth: false,
      requiresProfile: true,
      message: marketplaceGateMessage({
        role: "partner",
      } as StoredUserProfile),
      onboardingHref: onboardingHrefWithNext(
        onboardingPathForProfile("partner"),
        returnPath
      ),
    };
  }

  const level = computePartnerCompletionLevel(profile.partner);
  if (level === "incomplete") {
    return {
      allowed: false,
      requiresAuth: false,
      requiresProfile: true,
      message: marketplaceGateMessage(profile),
      onboardingHref: onboardingHrefWithNext(
        onboardingPathForProfile("partner"),
        returnPath
      ),
    };
  }

  return {
    allowed: true,
    requiresAuth: false,
    requiresProfile: false,
    continueHref: returnPath,
  };
}

export function resolveCreateDossierGate(
  session: GateSession,
  options?: GateProfileContext
): ActionGateResult {
  const continueHref = "/panel/dosya-olustur";

  if (!session.isAuthenticated) {
    return {
      allowed: false,
      requiresAuth: true,
      requiresProfile: false,
      message: "Fırsat dosyası oluşturmak için hesap açmanız gerekir.",
      authHref: createDossierEntryHref(false),
    };
  }

  if (session.sideSelected === false) {
    return {
      allowed: false,
      requiresAuth: false,
      requiresProfile: false,
      message: "Devam etmek için fırsat sahibi veya ortak yolunu seçin.",
      authHref: registerPathChoiceHref(continueHref),
    };
  }

  if (session.role === "partner") {
    return {
      allowed: false,
      requiresAuth: false,
      requiresProfile: false,
      wrongRole: true,
      message:
        "Fırsat dosyası oluşturma yalnızca fırsat sahipleri içindir. Ortak olarak fırsatları keşfedebilirsiniz.",
      continueHref: "/panel/kesfet",
    };
  }

  const profile = options?.profile;
  const hasSavedDossier = options?.hasSavedDossier ?? false;

  if (!profile) {
    return {
      allowed: false,
      requiresAuth: false,
      requiresProfile: true,
      message: marketplaceGateMessage({
        role: "opportunity_owner",
      } as StoredUserProfile),
      onboardingHref: onboardingHrefWithNext(
        onboardingPathForRole("opportunity_owner"),
        continueHref
      ),
    };
  }

  const level = computeOwnerCompletionLevel(profile.ownerProgress, hasSavedDossier);
  if (level === "incomplete") {
    return {
      allowed: false,
      requiresAuth: false,
      requiresProfile: true,
      message: marketplaceGateMessage(profile),
      onboardingHref: onboardingHrefWithNext(
        onboardingPathForProfile("opportunity_owner"),
        continueHref
      ),
    };
  }

  return {
    allowed: true,
    requiresAuth: false,
    requiresProfile: false,
    continueHref: "/onboarding/firsat-sahibi",
  };
}

/** Legacy shape used by dossier detail pages. */
export function toApplyGateView(result: ActionGateResult) {
  return {
    canApply: result.allowed,
    requiresAuth: result.requiresAuth,
    message: result.message ?? "",
    onboardingHref: result.onboardingHref,
  };
}
