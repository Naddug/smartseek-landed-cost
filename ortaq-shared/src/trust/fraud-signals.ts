export type FraudSignalType =
  | "velocity_identity"
  | "duplicate_payment_method"
  | "coordinated_investment_pattern"
  | "suspicious_referral_ring"
  | "document_tampering"
  | "registry_mismatch"
  | "founder_identity_mismatch"
  | "unrealistic_financials"
  | "astroturfed_interest"
  | "complaint_cluster";

export type FraudSignalSeverity = "low" | "medium" | "high" | "critical";

export type FraudSignal = {
  id: string;
  type: FraudSignalType;
  severity: FraudSignalSeverity;
  detectedAt: string;
  subjectType: "user" | "company" | "campaign" | "investment";
  subjectId: string;
  description: string;
  action?: FraudAction;
  reviewed: boolean;
  reviewerId?: string;
  resolution?: "false_positive" | "confirmed" | "escalated";
};

export type FraudAction =
  | "flag_for_review"
  | "pause_campaign"
  | "block_investment"
  | "require_reverification"
  | "suspend_account"
  | "notify_compliance";

export const FRAUD_DETECTION_RULES = {
  maxInvestmentsPerDevice24h: 3,
  coordinatedAmountTolerancePct: 0.01,
  referralRingThreshold: 5,
  fakeMomentumBlocked: true,
  publicMetricsRequirePartner: true,
  userGeneratedContentDisabled: true,
} as const;

export type ManipulationPrevention = {
  showLiveViewerCount: false;
  showFundingProgress: false;
  showTestimonials: false;
  publicWaitlistCount: false;
};

export const MANIPULATION_DEFAULTS: ManipulationPrevention = {
  showLiveViewerCount: false,
  showFundingProgress: false,
  showTestimonials: false,
  publicWaitlistCount: false,
};
