import type {
  PanelActivityEvent,
  PanelDossier,
  PanelMatch,
  PanelOverviewPayload,
  ProfileCompletion,
} from "@/types/panel";
import type { UserRoleMode } from "@/types/nav";

const now = Date.now();
const hoursAgo = (h: number) => new Date(now - h * 3_600_000).toISOString();
const daysAgo = (d: number) => new Date(now - d * 86_400_000).toISOString();

export const MOCK_OWNER_DOSSIERS: PanelDossier[] = [
  {
    id: "mock-d-001",
    refCode: "FD-2026-014",
    slug: "e-ticaret-operasyonu",
    title: "Altyapısı kurulu e-ticaret operasyonu",
    summary: "Platform ve tedarik hazır — büyüme ve operasyon tarafı boş.",
    category: "E-Ticaret",
    location: "İstanbul",
    stage: "operating_but_blocked",
    partnerTypeNeeded: "technical_partner",
    assetWhatExists: "Altyapı · Marka · Stok",
    missingPiece: "Operasyon ve teknik tamamlama",
    desiredPartner: "Teknik + Büyüme Ortağı",
    status: "published",
    isFeatured: false,
    isCurated: true,
    isNewThisWeek: false,
    updatedAt: daysAgo(1),
    createdAt: daysAgo(14),
  },
  {
    id: "mock-d-002",
    refCode: "FD-2026-022",
    slug: "tekstil-atolyesi",
    title: "Makine parkı hazır tekstil atölyesi",
    summary: "Üretim kapasitesi dolu — satış kanalı yok.",
    category: "Üretim",
    location: "Bursa",
    stage: "stuck",
    partnerTypeNeeded: "growth_partner",
    assetWhatExists: "Makine parkı · Ekip",
    missingPiece: "Satış kanalı",
    desiredPartner: "Büyüme Ortağı",
    status: "under_review",
    isFeatured: false,
    isCurated: false,
    isNewThisWeek: true,
    updatedAt: hoursAgo(5),
    createdAt: daysAgo(3),
  },
  {
    id: "mock-d-003",
    refCode: "FD-2026-031",
    slug: "kafe-lokasyonu",
    title: "Ana cadde lokasyonu — konsept bekliyor",
    summary: "Lokasyon ve ruhsat var; işletme modeli tanımsız.",
    category: "Yeme-İçme",
    location: "Ankara",
    stage: "seeking_relaunch",
    partnerTypeNeeded: "operating_partner",
    assetWhatExists: "Lokasyon · Ruhsat",
    missingPiece: "Konsept ve işletme modeli",
    desiredPartner: "İşletme Ortağı",
    status: "draft",
    isFeatured: false,
    isCurated: false,
    isNewThisWeek: false,
    updatedAt: hoursAgo(2),
    createdAt: daysAgo(1),
  },
];

export const MOCK_OWNER_MATCHES: PanelMatch[] = [
  {
    id: "mock-m-001",
    dossierId: "mock-d-001",
    dossierTitle: "Altyapısı kurulu e-ticaret operasyonu",
    createdAt: hoursAgo(3),
    counterpartName: "Mehmet K.",
    counterpartType: "Teknik Ortak",
    status: "pending",
  },
  {
    id: "mock-m-002",
    dossierId: "mock-d-001",
    dossierTitle: "Altyapısı kurulu e-ticaret operasyonu",
    createdAt: daysAgo(1),
    counterpartName: "Selin A.",
    counterpartType: "Büyüme Ortağı",
    status: "pending",
  },
];

export const MOCK_HYBRID_DOSSIERS: PanelDossier[] = [MOCK_OWNER_DOSSIERS[0]];

export const MOCK_HYBRID_MATCHES: PanelMatch[] = [MOCK_OWNER_MATCHES[0]];

export const MOCK_OWNER_ACTIVITY: PanelActivityEvent[] = [
  {
    id: "act-1",
    label: "Eşleşme onaylandı · FD-2026-014",
    createdAt: hoursAgo(2),
    type: "match",
  },
  {
    id: "act-2",
    label: "FD-2026-014 yayına alındı",
    createdAt: daysAgo(1),
    type: "dossier",
  },
  {
    id: "act-3",
    label: "FD-2026-022 incelemeye gönderildi",
    createdAt: hoursAgo(5),
    type: "moderation",
  },
  {
    id: "act-4",
    label: "Yeni mesaj · Mehmet K.",
    createdAt: hoursAgo(8),
    type: "message",
  },
];

const PROFILE_OWNER: ProfileCompletion = {
  percent: 65,
  missingFields: ["Sektör deneyimi", "Katılım süresi", "Getiri modeli tercihi"],
  level: "partial",
};

const PROFILE_PARTNER: ProfileCompletion = {
  percent: 45,
  missingFields: ["Ortak türü", "Tercih edilen kategoriler", "Biyografi"],
  level: "partial",
};

const PROFILE_HYBRID: ProfileCompletion = {
  percent: 72,
  missingFields: ["Getiri modeli tercihi"],
  level: "partial",
};

export type PanelDemoScenario = "owner_rich" | "owner_zero" | "partner_zero" | "hybrid";

export function resolveDemoScenario(
  email: string | null | undefined,
  role: UserRoleMode
): PanelDemoScenario {
  const normalized = email?.toLowerCase() ?? "";

  if (normalized === "demo@ortaq.biz") return "owner_rich";
  if (normalized === "ortak@ortaq.biz") return "partner_zero";
  if (role === "hybrid") return "hybrid";

  if (role === "partner") return "partner_zero";
  return "owner_zero";
}

export function buildDemoOverview(
  scenario: PanelDemoScenario,
  role: UserRoleMode
): PanelOverviewPayload {
  switch (scenario) {
    case "owner_rich":
      return {
        role: "owner",
        stats: {
          activeDossiers: 3,
          pendingMatches: 2,
          unreadMessages: 3,
        },
        dossiers: MOCK_OWNER_DOSSIERS,
        matches: MOCK_OWNER_MATCHES,
        recentActivity: MOCK_OWNER_ACTIVITY,
        profileCompletion: PROFILE_OWNER,
      };
    case "hybrid":
      return {
        role: "hybrid",
        stats: {
          activeDossiers: 1,
          pendingMatches: 1,
          unreadMessages: 2,
        },
        dossiers: MOCK_HYBRID_DOSSIERS,
        matches: MOCK_HYBRID_MATCHES,
        recentActivity: MOCK_OWNER_ACTIVITY.slice(0, 3),
        profileCompletion: PROFILE_HYBRID,
      };
    case "partner_zero":
      return {
        role: "partner",
        stats: {
          activeDossiers: 0,
          pendingMatches: 0,
          unreadMessages: 0,
        },
        dossiers: [],
        matches: [],
        recentActivity: [],
        profileCompletion: PROFILE_PARTNER,
      };
    case "owner_zero":
    default:
      return {
        role: "owner",
        stats: {
          activeDossiers: 0,
          pendingMatches: 0,
          unreadMessages: 0,
        },
        dossiers: [],
        matches: [],
        recentActivity: [],
        profileCompletion: PROFILE_OWNER,
      };
  }
}

export function computeStatsFromPayload(
  payload: Pick<PanelOverviewPayload, "dossiers" | "matches" | "stats">
): PanelOverviewPayload["stats"] {
  const activeDossiers = payload.dossiers.filter(
    (d) => d.status !== "archived" && d.status !== "rejected"
  ).length;
  const pendingMatches = payload.matches.filter((m) => m.status === "pending").length;

  return {
    activeDossiers,
    pendingMatches,
    unreadMessages: payload.stats.unreadMessages,
  };
}
