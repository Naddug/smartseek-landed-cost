/** Web-facing trust types — mirrors ortaq-shared API shapes for standalone Vercel deploy. */

export type VerificationPublicLabel =
  | "not_submitted"
  | "under_review"
  | "approved"
  | "approved_with_conditions"
  | "rejected"
  | "suspended"
  | "withdrawn"
  | "expired";

export type PublicTransparencyRecord = {
  id: string;
  publishedAt: string;
  category:
    | "platform_status"
    | "campaign_decision"
    | "enforcement_action"
    | "process_update"
    | "incident_summary";
  title: string;
  summary: string;
  evidenceUrl?: string;
  relatedCampaignSlug?: string;
  revoked: false;
};

export type PlatformTrustSnapshot = {
  updatedAt: string;
  spkPartner: {
    status: "pending" | "active" | "suspended";
    platformName?: string;
    licenseNumber?: string;
  };
  verificationStats: {
    campaignsInReview: number;
    campaignsLive: number;
    campaignsSuspended: number;
  };
  complaintsReceived: number;
  complaintsResolved: number;
  enforcementActions: number;
  manipulationPrevention: {
    fakeMetricsDisabled: true;
    publicFundingCountersDisabled: true;
  };
};

export type CampaignPublicSnapshot = {
  slug: string;
  title: string;
  lifecycleState: string;
  verificationLabel: VerificationPublicLabel;
  investorReady: boolean;
  gatesPassed: number;
  gatesRequired: number;
  lastUpdatedAt: string;
};
