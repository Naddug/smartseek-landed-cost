export const DEFAULT_CAMPAIGN_GATES = [
    { name: "company_verification", required: true, status: "pending" },
    { name: "founder_verification", required: true, status: "pending" },
    { name: "document_pack_complete", required: true, status: "pending" },
    { name: "financial_disclosure_review", required: true, status: "pending" },
    { name: "investment_committee", required: true, status: "pending" },
    { name: "legal_review", required: true, status: "pending" },
    { name: "partner_platform_approval", required: true, status: "pending" },
    { name: "risk_disclosure_final", required: true, status: "pending" },
];
export function isInvestorReady(workflow) {
    if (workflow.state !== "approved" && workflow.state !== "live")
        return false;
    const required = workflow.gates.filter((g) => g.required);
    return required.every((g) => g.status === "passed" || (g.status === "waived" && g.waivedBy));
}
