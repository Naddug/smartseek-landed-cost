import type { VerificationPublicLabel } from "./public-labels.js";
/** Turkish trade registry (MERSİS) linked company identity */
export type CompanyVerification = {
    id: string;
    /** MERSİS number when available */
    mersisNo?: string;
    /** Ticaret sicil no */
    tradeRegistryNo?: string;
    legalName: string;
    taxOffice?: string;
    taxId?: string;
    registeredAddress: string;
    incorporationDate?: string;
    /** Sectors — no vague "tech" only */
    activityDescription: string;
    publicLabel: VerificationPublicLabel;
    /** What was checked — shown on transparency page */
    checksCompleted: CompanyCheck[];
    checksPending: CompanyCheck[];
    lastVerifiedAt?: string;
};
export type CompanyCheck = "mersis_registry_match" | "trade_registry_gazette" | "tax_status" | "beneficial_ownership" | "litigation_search" | "sanctions_screening" | "site_visit_or_field_call" | "bank_account_verification";
export declare const REQUIRED_COMPANY_CHECKS: CompanyCheck[];
export type FounderVerification = {
    id: string;
    companyId: string;
    fullName: string;
    role: "founder" | "director" | "authorized_signatory";
    /** e-Devlet or notarized ID — never store raw TCKN in public API */
    identityVerified: boolean;
    identityMethod?: "edevlet" | "notarized_id" | "partner_kyc";
    publicLabel: VerificationPublicLabel;
    checksCompleted: FounderCheck[];
    checksPending: FounderCheck[];
    /** PEP / sanctions — internal flag, public only if material */
    pepDisclosed: boolean;
};
export type FounderCheck = "identity_match" | "criminal_record_declaration" | "pep_screening" | "sanctions_screening" | "linkedin_or_public_record_crosscheck" | "interview_or_call";
export declare const REQUIRED_FOUNDER_CHECKS: FounderCheck[];
