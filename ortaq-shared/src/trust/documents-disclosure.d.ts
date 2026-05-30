import type { VerificationPublicLabel } from "./public-labels.js";
export type DocumentType = "memorandum" | "financial_statements" | "tax_certificate" | "trade_registry_gazette" | "bank_reference" | "use_of_funds_plan" | "committee_report" | "risk_disclosure_signed" | "other";
export type DocumentRecord = {
    id: string;
    subjectType: "company" | "campaign" | "founder";
    subjectId: string;
    type: DocumentType;
    fileName: string;
    /** SHA-256 of file — integrity proof */
    contentHash: string;
    uploadedAt: string;
    uploadedBy: string;
    publicLabel: VerificationPublicLabel;
    /** Whether investors can download (memorandum when live) */
    investorVisible: boolean;
    /** Version for re-submissions */
    version: number;
    supersedesId?: string;
    reviewNotes?: string;
};
/** Minimum disclosure pack before committee review */
export declare const CAMPAIGN_DOCUMENT_REQUIREMENTS: DocumentType[];
export type FinancialDisclosureStandard = {
    /** Minimum reporting period */
    reportingPeriodMonths: 12 | 24 | 36;
    /** Audited vs reviewed vs management — must be stated honestly */
    assuranceLevel: "audited" | "independent_review" | "management_only" | "not_provided";
    currency: "TRY";
    /** Key figures — no projections presented as facts */
    revenue?: {
        amount: number;
        period: string;
        source: string;
    };
    netIncome?: {
        amount: number;
        period: string;
        source: string;
    };
    totalAssets?: {
        amount: number;
        asOf: string;
        source: string;
    };
    totalLiabilities?: {
        amount: number;
        asOf: string;
        source: string;
    };
    /** Explicit flag if figures are unaudited */
    unauditedWarning: boolean;
    publicLabel: VerificationPublicLabel;
};
export declare const DISCLOSURE_RULES: {
    /** Projections must be labeled "tahmin" not "gelir" */
    readonly projectionsMustBeLabeled: true;
    /** Round size vs company revenue ratio triggers extra review */
    readonly roundToRevenueReviewThreshold: 3;
    /** Related-party transactions must be disclosed */
    readonly relatedPartyMandatory: true;
    /** Use of funds % must sum to 100 */
    readonly useOfFundsMustSum100: true;
};
