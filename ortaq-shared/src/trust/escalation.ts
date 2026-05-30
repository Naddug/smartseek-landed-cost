export type EscalationTier = "L1_support" | "L2_trust_ops" | "L3_compliance" | "L4_executive" | "L5_regulator";

export type EscalationCaseType =
  | "investor_complaint"
  | "issuer_complaint"
  | "fraud_report"
  | "document_dispute"
  | "identity_issue"
  | "campaign_material_change"
  | "data_subject_request"
  | "media_inquiry"
  | "regulatory_inquiry"
  | "security_incident";

export type EscalationCase = {
  id: string;
  publicRef: string;
  type: EscalationCaseType;
  tier: EscalationTier;
  status: "open" | "investigating" | "awaiting_user" | "resolved" | "closed";
  priority: "normal" | "urgent" | "critical";
  createdAt: string;
  updatedAt: string;
  slaDueAt: string;
  subjectType?: "user" | "company" | "campaign";
  subjectId?: string;
  summary: string;
  assigneeId?: string;
};

export const ESCALATION_SLA_HOURS: Record<EscalationTier, number> = {
  L1_support: 48,
  L2_trust_ops: 24,
  L3_compliance: 8,
  L4_executive: 4,
  L5_regulator: 1,
};

export const AUTO_ESCALATION_RULES = {
  fraudCriticalToTier: "L3_compliance" as EscalationTier,
  complaintClusterThreshold: 3,
  mediaMentionToTier: "L4_executive" as EscalationTier,
  regulatoryKeywords: ["SPK", "MKK", "sermaye piyasası", "şikayet"],
};

export type CrisisLevel = "watch" | "elevated" | "severe";

export type CrisisCommunicationPlan = {
  level: CrisisLevel;
  spokespersonRole: "trust_ops_lead" | "ceo" | "legal_counsel";
  channels: ("status_page" | "email_affected" | "site_banner" | "press_statement")[];
  templateKey: string;
  appendOnly: true;
};

export const CRISIS_TEMPLATES = {
  campaign_suspended: "crisis.campaign_suspended",
  partner_outage: "crisis.partner_outage",
  data_incident: "crisis.data_incident",
  fraud_confirmed: "crisis.fraud_confirmed",
} as const;

export type InvestorComplaint = {
  id: string;
  publicRef: string;
  category:
    | "misleading_information"
    | "cannot_withdraw"
    | "document_missing"
    | "identity_theft"
    | "harassment"
    | "technical"
    | "other";
  description: string;
  campaignSlug?: string;
  contactEmail: string;
  createdAt: string;
  status: "received" | "acknowledged" | "investigating" | "resolved";
  acknowledgedAt?: string;
};

export type TrustRecoveryAction = {
  id: string;
  trigger: "fraud_confirmed" | "process_failure" | "partner_error" | "communication_error";
  actions: (
    | "public_post_mortem"
    | "process_change_documented"
    | "affected_user_notification"
    | "extended_review_period"
    | "third_party_audit"
  )[];
  publishedAt?: string;
  publicUrl?: string;
};
