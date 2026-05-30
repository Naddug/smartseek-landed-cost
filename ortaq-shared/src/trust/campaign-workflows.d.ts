import type { VerificationPublicLabel } from "./public-labels.js";
export type CampaignLifecycleState = "draft" | "submitted" | "in_review" | "approved" | "live" | "paused" | "closed_success" | "closed_failed" | "cancelled" | "suspended";
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
export declare const DEFAULT_CAMPAIGN_GATES: Omit<CampaignGate, "id">[];
export type CommitteeDecision = {
    decision: "approve" | "approve_with_conditions" | "reject" | "defer";
    decidedAt: string;
    conditions?: string[];
    rejectionReasonPublic?: string;
    internalRationale?: string;
    votes: {
        role: "finance" | "field" | "legal";
        vote: "yes" | "no" | "abstain";
    }[];
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
export declare function isInvestorReady(workflow: CampaignApprovalWorkflow): boolean;
