import type { VerificationPublicLabel } from "./public-labels.js";

export type CampaignLifecycleState =
  | "draft"
  | "submitted"
  | "in_review"
  | "approved"
  | "live"
  | "paused"
  | "closed_success"
  | "closed_failed"
  | "cancelled"
  | "suspended";

export type CampaignApprovalWorkflow = {
  campaignId: string;
  state: CampaignLifecycleState;
  gates: CampaignGate[];
  committeeDecision?: CommitteeDecision;
  partnerPlatformId?: string;
  materialChangeLocked: boolean;
};

export type CampaignGate = {
  id: string;
  name: string;
  required: boolean;
  status: "pending" | "passed" | "failed" | "waived";
  waivedBy?: string;
  waivedReason?: string;
  completedAt?: string;
};

export const DEFAULT_CAMPAIGN_GATES: Omit<CampaignGate, "id">[] = [
  { name: "company_verification", required: true, status: "pending" },
  { name: "founder_verification", required: true, status: "pending" },
  { name: "document_pack_complete", required: true, status: "pending" },
  { name: "financial_disclosure_review", required: true, status: "pending" },
  { name: "investment_committee", required: true, status: "pending" },
  { name: "legal_review", required: true, status: "pending" },
  { name: "partner_platform_approval", required: true, status: "pending" },
  { name: "risk_disclosure_final", required: true, status: "pending" },
];

export type CommitteeDecision = {
  decision: "approve" | "approve_with_conditions" | "reject" | "defer";
  decidedAt: string;
  conditions?: string[];
  rejectionReasonPublic?: string;
  internalRationale?: string;
  votes: { role: "finance" | "field" | "legal"; vote: "yes" | "no" | "abstain" }[];
};

export type CampaignPublicSnapshot = {
  slug: string;
  title: string;
  lifecycleState: CampaignLifecycleState;
  verificationLabel: VerificationPublicLabel;
  investorReady: boolean;
  gatesPassed: number;
  gatesRequired: number;
  lastUpdatedAt: string;
};

export function isInvestorReady(workflow: CampaignApprovalWorkflow): boolean {
  if (workflow.state !== "approved" && workflow.state !== "live") return false;
  const required = workflow.gates.filter((g) => g.required);
  return required.every((g) => g.status === "passed" || (g.status === "waived" && g.waivedBy));
}
