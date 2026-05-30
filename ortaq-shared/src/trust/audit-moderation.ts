/** Append-only audit log — no updates or deletes */
export type AuditEventType =
  | "verification_state_change"
  | "document_uploaded"
  | "document_rejected"
  | "campaign_gate_passed"
  | "campaign_gate_waived"
  | "committee_decision"
  | "fraud_signal_created"
  | "fraud_signal_resolved"
  | "escalation_opened"
  | "escalation_closed"
  | "public_disclosure_published"
  | "moderation_action"
  | "admin_login"
  | "consent_recorded"
  | "partner_webhook_received";

export type AuditEvent = {
  id: string;
  type: AuditEventType;
  actorType: "system" | "ops_user" | "partner" | "user";
  actorId: string;
  subjectType: string;
  subjectId: string;
  /** JSON payload — hash for integrity */
  payload: Record<string, unknown>;
  payloadHash: string;
  createdAt: string;
  /** IP/device for user actions — retained per KVKK policy */
  ipHash?: string;
};

export type ModerationTargetType = "campaign_copy" | "company_claim" | "user_report" | "public_comment";

export type ModerationAction =
  | "approve"
  | "reject"
  | "request_edit"
  | "hide"
  | "escalate_fraud";

export type ModerationRecord = {
  id: string;
  targetType: ModerationTargetType;
  targetId: string;
  action: ModerationAction;
  reason: string;
  moderatorId: string;
  createdAt: string;
  auditEventId: string;
};

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
  /** Link to evidence pack when applicable */
  evidenceUrl?: string;
  relatedCampaignSlug?: string;
  /** Immutable once published */
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
  /** Last 90 days — honest counts, no spin */
  complaintsReceived: number;
  complaintsResolved: number;
  enforcementActions: number;
  manipulationPrevention: {
    fakeMetricsDisabled: true;
    publicFundingCountersDisabled: true;
  };
};
