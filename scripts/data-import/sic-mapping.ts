/**
 * SIC (Standard Industrial Classification) to SmartSeek industry mapping.
 * UK SIC 2007 and US SIC codes share similar structure.
 */

export const SIC_TO_INDUSTRY: Record<string, string> = {
  // Mining (05-09)
  "05": "Mining & Minerals",
  "06": "Mining & Minerals",
  "07": "Mining & Minerals",
  "08": "Mining & Minerals",
  "09": "Mining & Minerals",
  // Food (10-12)
  "10": "Food & Agriculture",
  "11": "Food & Agriculture",
  "12": "Food & Agriculture",
  // Textiles (13-15)
  "13": "Textiles & Apparel",
  "14": "Textiles & Apparel",
  "15": "Textiles & Apparel",
  // Wood, Paper, Chemicals (20xx = Chemicals)
  "16": "Construction & Building Materials",
  "17": "Packaging & Paper",
  "18": "Printing",
  "19": "Petroleum & Chemicals",
  "20": "Chemical & Petrochemical",
  "21": "Pharmaceutical & Healthcare",
  "22": "Chemical & Petrochemical",
  "23": "Mining & Minerals",
  // Metals, Machinery (35xx = Machinery)
  "24": "Mining & Metals",
  "25": "Manufacturing",
  "26": "Electronics & Semiconductors",
  "27": "Electronics & Semiconductors",
  "28": "Machinery & Industrial Equipment",
  "29": "Automotive & Transport",
  "30": "Machinery & Industrial Equipment",
  // Consumer
  "31": "Consumer Goods",
  "32": "Consumer Goods",
  "33": "Consumer Goods",
  // 35xx = Industrial/Commercial Machinery, 36xx = Electronics, 37xx = Transportation
  "35": "Machinery & Industrial Equipment",
  "36": "Electronics & Semiconductors",
  "37": "Automotive & Transport",
  // Wholesale
  "46": "Trading & Distribution",
  // Transport
  "49": "Logistics & Shipping",
  "50": "Marine & Shipping",
  "51": "Logistics & Shipping",
  "52": "Logistics & Shipping",
  "53": "Logistics & Shipping",
  // Professional services
  "69": "Professional Services",
  "70": "Professional Services",
  "71": "Professional Services",
  "72": "Technology & IT",
  "73": "Professional Services",
  "74": "Professional Services",
  "75": "Professional Services",
};

export function mapSicToIndustry(sicCode: string | null | undefined): string {
  if (!sicCode || typeof sicCode !== "string") return "General Business";
  const prefix = sicCode.replace(/\D/g, "").slice(0, 2);
  return SIC_TO_INDUSTRY[prefix] || "General Business";
}
