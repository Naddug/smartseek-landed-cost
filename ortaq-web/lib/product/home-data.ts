import type { SimulatedCampaign } from "@/lib/campaigns/types";

export const reviewStatusLabels: Record<SimulatedCampaign["reviewStatus"], string> = {
  preliminary_review: "Ön inceleme", document_review: "Belge incelemesi", field_verification: "Saha doğrulaması", committee: "Komite değerlendirmesi",
};

/** Sector taxonomy, counts derived from live catalog in getSectorClusters(). */
export const industrialSectors = [
  { id: "machinery", label: "Makine & yedek parça" }, { id: "textile", label: "Tekstil & konfeksiyon" }, { id: "food", label: "Gıda & tarım işleme" }, { id: "metal", label: "Metal & döküm" }, { id: "logistics", label: "Lojistik & depolama" }, { id: "automotive", label: "Otomotiv yan sanayi" }, { id: "chemicals", label: "Kimya & proses" }, { id: "electronics", label: "Elektronik & montaj" }, { id: "furniture", label: "Mobilya & ahşap" }, { id: "marine", label: "Denizcilik & gemi ekipmanı" }, { id: "packaging", label: "Ambalaj & plastik" }, { id: "agtech", label: "Seracılık & tarım teknolojisi" },
] as const;

export const sectorMatchers: Record<(typeof industrialSectors)[number]["id"], RegExp> = {
  machinery: /makine|parça|cnc/i, textile: /tekstil|dokuma|konfeksiyon|iplik/i, food: /gıda|tarım|fındık|un/i, metal: /metal|döküm|dokum|cam|seramik|refrakter/i, logistics: /lojistik|depolama|sevkiyat/i, automotive: /otomotiv yan/i, chemicals: /kimya|proses/i, electronics: /elektronik|montaj|kablolama/i, furniture: /mobilya|ahşap/i, marine: /gemi|denizcilik/i, packaging: /ambalaj|plastik|folyo/i, agtech: /seracılık|sera|iklim/i,
};
