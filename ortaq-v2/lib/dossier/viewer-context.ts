import type { Session } from "next-auth";
import type { UserRole } from "@/types";
import type {
  DossierViewerContext,
  MatchInterestState,
  PublicDossierDetail,
} from "@/types/dossier-detail";
import type { UserRoleMode } from "@/types/nav";
function mapRole(role: UserRole): UserRoleMode {
  switch (role) {
    case "opportunity_owner":
      return "owner";
    case "partner":
      return "partner";
    case "admin":
      return "hybrid";
    default:
      return "partner";
  }
}

type ApplyGate = {
  canApply: boolean;
  message?: string;
  onboardingHref?: string;
};

export function buildDossierViewerContext(
  session: Session | null,
  dossier: PublicDossierDetail,
  options?: {
    applyGate?: ApplyGate;
    interestState?: MatchInterestState;
  }
): DossierViewerContext {
  if (!session?.user?.email) {
    return { isAuthenticated: false, interestState: "none" };
  }

  const email = session.user.email.toLowerCase();
  const role = mapRole(session.user.role);
  const isOwner =
    dossier.ownerId === email || dossier.ownerId === session.user.id;

  const interestState = isOwner
    ? undefined
    : (options?.interestState ?? "none");

  const gate = options?.applyGate ?? { canApply: true };

  return {
    isAuthenticated: true,
    role,
    isOwner,
    interestState,
    canApply: isOwner ? true : gate.canApply,
    profileGateMessage: gate.message,
    profileOnboardingHref: gate.onboardingHref,
  };
}

export function isDossierOpenForInterest(dossier: PublicDossierDetail): boolean {
  return (
    dossier.status === "published" ||
    dossier.status === "under_review"
  );
}

export function isDossierClosed(dossier: PublicDossierDetail): boolean {
  return (
    dossier.status === "archived" ||
    dossier.status === "rejected" ||
    dossier.status === "matched"
  );
}
