/** Minimum disclosure pack before committee review */
export const CAMPAIGN_DOCUMENT_REQUIREMENTS = [
    "memorandum",
    "financial_statements",
    "use_of_funds_plan",
    "risk_disclosure_signed",
];
export const DISCLOSURE_RULES = {
    /** Projections must be labeled "tahmin" not "gelir" */
    projectionsMustBeLabeled: true,
    /** Round size vs company revenue ratio triggers extra review */
    roundToRevenueReviewThreshold: 3,
    /** Related-party transactions must be disclosed */
    relatedPartyMandatory: true,
    /** Use of funds % must sum to 100 */
    useOfFundsMustSum100: true,
};
