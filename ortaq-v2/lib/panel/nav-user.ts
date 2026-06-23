import type { Session } from "next-auth";
import type { UserRole } from "@/types";
import type { NavUser, UserRoleMode } from "@/types/nav";
import {
  buildDemoOverview,
  resolveDemoScenario,
} from "@/data/panel/mock-panel-data";

function mapUserRole(role: UserRole): UserRoleMode {
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

type NavStats = Pick<
  NavUser,
  "activeDossiers" | "pendingMatches" | "unreadMessages"
>;

export function getNavUserFromSession(
  session: Session | null,
  statsOverride?: NavStats
): NavUser | null {
  if (!session?.user?.id) return null;

  const firstName =
    session.user.name?.split(" ")[0] ??
    session.user.email?.split("@")[0];

  const role = mapUserRole(session.user.role);
  const scenario = resolveDemoScenario(session.user.email, role);
  const demoStats = buildDemoOverview(scenario, role).stats;
  const stats = statsOverride ?? demoStats;

  return {
    id: session.user.id,
    firstName,
    email: session.user.email ?? undefined,
    role,
    activeDossiers: stats.activeDossiers,
    pendingMatches: stats.pendingMatches,
    unreadMessages: stats.unreadMessages,
  };
}
