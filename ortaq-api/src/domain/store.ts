import type { PlatformTrustSnapshot, PublicTransparencyRecord } from "../../../ortaq-shared/src/trust/audit-moderation.js";
import type { CampaignPublicSnapshot } from "../../../ortaq-shared/src/trust/campaign-workflows.js";
import type { InvestorComplaint } from "../../../ortaq-shared/src/trust/escalation.js";
import type { VerificationPublicLabel } from "../../../ortaq-shared/src/trust/public-labels.js";

/** Dev store — seed data mirrors honest public state (illustrative example campaign) */
export const platformSnapshot: PlatformTrustSnapshot = {
  updatedAt: new Date().toISOString(),
  spkPartner: {
    status: "pending",
  },
  verificationStats: {
    campaignsInReview: 0,
    campaignsLive: 0,
    campaignsSuspended: 0,
  },
  complaintsReceived: 0,
  complaintsResolved: 0,
  enforcementActions: 0,
  manipulationPrevention: {
    fakeMetricsDisabled: true,
    publicFundingCountersDisabled: true,
  },
};

export const campaigns: CampaignPublicSnapshot[] = [
  {
    slug: "ornek",
    title: "Örnek şirket sayfası",
    lifecycleState: "draft",
    verificationLabel: "not_submitted",
    investorReady: false,
    gatesPassed: 0,
    gatesRequired: 8,
    lastUpdatedAt: new Date().toISOString(),
  },
];

export const transparencyFeed: PublicTransparencyRecord[] = [
  {
    id: "trans-001",
    publishedAt: "2026-01-15T10:00:00.000Z",
    category: "process_update",
    title: "Doğrulama süreci yayınlandı",
    summary:
      "ORTAQ, kampanya yayına alınmadan önce şirket, kurucu, belge ve finansal açıklama incelemesi yapacak. Örnek sayfalar yatırım teklifi değildir.",
    revoked: false,
  },
  {
    id: "trans-002",
    publishedAt: "2026-02-01T10:00:00.000Z",
    category: "platform_status",
    title: "Lisanslı platform görüşmeleri sürüyor",
    summary:
      "SPK listesindeki kitle fonlama platformu ile anlaşma görüşmeleri devam ediyor. Anlaşma tamamlanana kadar yatırım alınmaz.",
    revoked: false,
  },
];

const complaints: InvestorComplaint[] = [];

let complaintCounter = 0;

export function nextComplaintRef(): string {
  complaintCounter += 1;
  const year = new Date().getFullYear();
  return `ORTAQ-${year}-${String(complaintCounter).padStart(5, "0")}`;
}

export function addComplaint(complaint: Omit<InvestorComplaint, "id" | "publicRef" | "createdAt" | "status">): InvestorComplaint {
  const record: InvestorComplaint = {
    ...complaint,
    id: `complaint-${complaintCounter + 1}`,
    publicRef: nextComplaintRef(),
    createdAt: new Date().toISOString(),
    status: "received",
  };
  complaints.push(record);
  platformSnapshot.complaintsReceived += 1;
  platformSnapshot.updatedAt = new Date().toISOString();
  return record;
}

export function getComplaintByRef(publicRef: string): InvestorComplaint | undefined {
  return complaints.find((c) => c.publicRef === publicRef);
}

export function getCampaign(slug: string): CampaignPublicSnapshot | undefined {
  return campaigns.find((c) => c.slug === slug);
}

export function listCampaigns(): CampaignPublicSnapshot[] {
  return [...campaigns];
}

export function listTransparency(): PublicTransparencyRecord[] {
  return [...transparencyFeed].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

/** Map verification label for API consumers */
export function publicVerificationSummary(label: VerificationPublicLabel): {
  label: VerificationPublicLabel;
  investorReady: boolean;
} {
  return {
    label,
    investorReady: label === "approved" || label === "approved_with_conditions",
  };
}
