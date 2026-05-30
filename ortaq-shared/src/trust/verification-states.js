/** Maps internal state → honest public label */
export function toPublicLabel(state) {
    switch (state) {
        case "draft":
        case "submitted":
            return "not_submitted";
        case "intake_review":
        case "document_check":
        case "field_verification":
        case "committee_review":
        case "partner_review":
            return "under_review";
        case "approved":
            return "approved";
        case "approved_conditional":
            return "approved_with_conditions";
        case "rejected":
            return "rejected";
        case "suspended_fraud":
        case "suspended_compliance":
            return "suspended";
        case "withdrawn_issuer":
        case "withdrawn_ops":
            return "withdrawn";
        case "expired":
            return "expired";
    }
}
/** Allowed state transitions — ops cannot skip steps */
export const VERIFICATION_TRANSITIONS = {
    draft: ["submitted", "withdrawn_issuer"],
    submitted: ["intake_review", "rejected", "withdrawn_issuer"],
    intake_review: ["document_check", "rejected", "suspended_fraud"],
    document_check: ["field_verification", "rejected", "suspended_compliance"],
    field_verification: ["committee_review", "rejected", "suspended_fraud"],
    committee_review: ["partner_review", "approved", "approved_conditional", "rejected"],
    partner_review: ["approved", "approved_conditional", "rejected"],
    approved: ["suspended_fraud", "suspended_compliance", "expired", "withdrawn_ops"],
    approved_conditional: ["approved", "suspended_compliance", "rejected", "expired"],
    rejected: [],
    suspended_fraud: ["withdrawn_ops"],
    suspended_compliance: ["committee_review", "withdrawn_ops"],
    withdrawn_issuer: [],
    withdrawn_ops: [],
    expired: [],
};
export function canTransition(from, to) {
    return VERIFICATION_TRANSITIONS[from]?.includes(to) ?? false;
}
