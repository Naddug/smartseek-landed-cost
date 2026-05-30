/**
 * Public-facing trust labels shown on ortaq.biz.
 * Never expose internal ops codes directly — map through toPublicLabel().
 */
/** Platform-level labels (SPK license, regulatory facts, examples) */
export type PlatformTrustLabel = "verified" | "illustrative" | "planned" | "pending";
/** Entity verification labels (company, founder, document, campaign) */
export type VerificationPublicLabel = "not_submitted" | "under_review" | "approved" | "approved_with_conditions" | "rejected" | "suspended" | "withdrawn" | "expired";
export declare const PLATFORM_TRUST_LABELS: PlatformTrustLabel[];
export declare const VERIFICATION_PUBLIC_LABELS: VerificationPublicLabel[];
