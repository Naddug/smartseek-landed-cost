export const ESCALATION_SLA_HOURS = {
    L1_support: 48,
    L2_trust_ops: 24,
    L3_compliance: 8,
    L4_executive: 4,
    L5_regulator: 1,
};
export const AUTO_ESCALATION_RULES = {
    fraudCriticalToTier: "L3_compliance",
    complaintClusterThreshold: 3,
    mediaMentionToTier: "L4_executive",
    regulatoryKeywords: ["SPK", "MKK", "sermaye piyasası", "şikayet"],
};
export const CRISIS_TEMPLATES = {
    campaign_suspended: "crisis.campaign_suspended",
    partner_outage: "crisis.partner_outage",
    data_incident: "crisis.data_incident",
    fraud_confirmed: "crisis.fraud_confirmed",
};
