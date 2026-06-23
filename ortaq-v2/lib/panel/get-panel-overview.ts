import type { Session } from "next-auth";
import type { PanelOverviewPayload } from "@/types/panel";
import type { UserRoleMode } from "@/types/nav";
import type { UserRole } from "@/types";
import { listOpportunityDossiers } from "@/lib/actions/opportunity-dossier";
import {
  buildDemoOverview,
  computeStatsFromPayload,
  resolveDemoScenario,
} from "@/data/panel/mock-panel-data";
import { mapOpportunityToPanelDossier } from "@/lib/panel/map-opportunity-dossier";

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

export async function getPanelOverview(
  session: Session | null
): Promise<PanelOverviewPayload | null> {
  if (!session?.user?.email) return null;

  const role = mapUserRole(session.user.role);
  const email = session.user.email;
  const scenario = resolveDemoScenario(email, role);
  const demo = buildDemoOverview(scenario, role);

  if (role === "partner") {
    return {
      ...demo,
      role,
      stats: computeStatsFromPayload(demo),
    };
  }

  const stored = await listOpportunityDossiers();
  const mapped = stored.map(mapOpportunityToPanelDossier);

  if (mapped.length === 0 && scenario === "owner_rich") {
    return {
      ...demo,
      role,
      stats: computeStatsFromPayload(demo),
    };
  }

  if (mapped.length === 0) {
    return {
      ...demo,
      role,
      dossiers: [],
      matches: [],
      recentActivity: [],
      stats: {
        activeDossiers: 0,
        pendingMatches: 0,
        unreadMessages: 0,
      },
    };
  }

  const merged: PanelOverviewPayload = {
    role,
    dossiers: mapped,
    matches: demo.matches.filter((m) =>
      mapped.some((d) => d.id === m.dossierId || d.title === m.dossierTitle)
    ),
    recentActivity: demo.recentActivity.slice(0, 3),
    profileCompletion: demo.profileCompletion,
    stats: {
      activeDossiers: 0,
      pendingMatches: 0,
      unreadMessages: demo.stats.unreadMessages,
    },
  };

  merged.stats = computeStatsFromPayload(merged);

  return merged;
}

export async function getPanelDossiersForUser(
  session: Session | null
): Promise<PanelOverviewPayload["dossiers"]> {
  const overview = await getPanelOverview(session);
  return overview?.dossiers ?? [];
}

export async function getPanelMatchesForUser(
  session: Session | null
): Promise<PanelOverviewPayload["matches"]> {
  const overview = await getPanelOverview(session);
  return overview?.matches ?? [];
}
