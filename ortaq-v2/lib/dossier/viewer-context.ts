import type { Session } from "next-auth";
import type { UserRole } from "@/types";
import type {
  DossierViewerContext,
  MatchInterestState,
  PublicDossierDetail,
} from "@/types/dossier-detail";
import type { UserRoleMode } from "@/types/nav";
import { APPLIED_INTEREST_MOCK } from "@/data/dossier/public-dossier-details";

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

function resolveInterestState(
  email: string | undefined,
  dossierId: string
): MatchInterestState {
  if (!email) return "none";
  const applied = APPLIED_INTEREST_MOCK[email.toLowerCase()] ?? [];
  if (applied.includes(dossierId)) return "applied";
  return "none";
}

export function buildDossierViewerContext(
  session: Session | null,
  dossier: PublicDossierDetail
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
    : resolveInterestState(email, dossier.id);

  return {
    isAuthenticated: true,
    role,
    isOwner,
    interestState,
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
