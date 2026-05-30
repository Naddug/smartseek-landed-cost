/**
 * Public-facing trust labels shown on ortaq.biz.
 * Never expose internal ops codes directly — map through toPublicLabel().
 */
export const PLATFORM_TRUST_LABELS = [
    "verified",
    "illustrative",
    "planned",
    "pending",
];
export const VERIFICATION_PUBLIC_LABELS = [
    "not_submitted",
    "under_review",
    "approved",
    "approved_with_conditions",
    "rejected",
    "suspended",
    "withdrawn",
    "expired",
];
