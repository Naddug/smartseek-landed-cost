import type { VerificationPublicLabel } from "./public-labels.js";
/** Internal verification pipeline — never shown verbatim to users */
export type VerificationState = "draft" | "submitted" | "intake_review" | "document_check" | "field_verification" | "committee_review" | "partner_review" | "approved" | "approved_conditional" | "rejected" | "suspended_fraud" | "suspended_compliance" | "withdrawn_issuer" | "withdrawn_ops" | "expired";
export type VerificationDomain = "company" | "founder" | "document" | "financial_disclosure" | "campaign";
export type VerificationRecord = {
    id: string;
    domain: VerificationDomain;
    subjectId: string;
    state: VerificationState;
    publicLabel: VerificationPublicLabel;
    /** ISO date when state last changed */
    stateChangedAt: string;
    /** Human-readable reason safe for public when applicable */
    publicReason?: string;
    /** Internal only — never in public API */
    internalNotes?: string;
    reviewerId?: string;
    evidenceIds: string[];
};
/** Maps internal state → honest public label */
export declare function toPublicLabel(state: VerificationState): VerificationPublicLabel;
/** Allowed state transitions — ops cannot skip steps */
export declare const VERIFICATION_TRANSITIONS: Record<VerificationState, VerificationState[]>;
export declare function canTransition(from: VerificationState, to: VerificationState): boolean;
