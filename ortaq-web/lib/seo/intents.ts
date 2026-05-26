import type { SearchIntent } from "./routes";

export type IntentMapping = {
  query: string;
  intent: SearchIntent;
  targetPath: string;
  contentType: "hub" | "faq" | "glossary" | "guide" | "trust" | "risk";
  notes: string;
};

/**
 * Search intent → destination map for content and internal linking.
 * Expand as Search Console data arrives.
 */
export const SEARCH_INTENT_MAP: IntentMapping[] = [
  {
    query: "ortaklık nasıl olur",
    intent: "informational",
    targetPath: "/nasil-calisir",
    contentType: "guide",
    notes: "Primary education hub",
  },
  {
    query: "SPK güvenilir mi",
    intent: "informational",
    targetPath: "/guven",
    contentType: "trust",
    notes: "Regulatory trust — no false certainty",
  },
  {
    query: "kitle fonlama dolandırıcılık",
    intent: "informational",
    targetPath: "/sss",
    contentType: "faq",
    notes: "Address scam fear directly",
  },
  {
    query: "param nereye gider kitle fonlama",
    intent: "informational",
    targetPath: "/nasil-calisir",
    contentType: "guide",
    notes: "Money path — link to emanet glossary",
  },
  {
    query: "MKK nedir",
    intent: "informational",
    targetPath: "/sozluk",
    contentType: "glossary",
    notes: "Term definition",
  },
  {
    query: "yıllık limit kitle fonlama",
    intent: "informational",
    targetPath: "/riskler",
    contentType: "risk",
    notes: "Legal limit — cite regulation not invented numbers",
  },
  {
    query: "ORTAQ",
    intent: "navigational",
    targetPath: "/",
    contentType: "hub",
    notes: "Brand search",
  },
  {
    query: "şirkete ortak olmak",
    intent: "commercial",
    targetPath: "/basla",
    contentType: "guide",
    notes: "Beginner entry — education before transaction",
  },
  {
    query: "kitle fonlama şirket başvurusu",
    intent: "commercial",
    targetPath: "/sss",
    contentType: "faq",
    notes: "Founder intent — honest not-ready answer until live",
  },
];

export function intentsForPath(path: string): IntentMapping[] {
  return SEARCH_INTENT_MAP.filter((m) => m.targetPath === path);
}
