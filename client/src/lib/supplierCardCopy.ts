import type { TFunction } from "i18next";

const INDUSTRY_KEYS: Record<string, string> = {
  "Chemicals & Plastics": "publicSearch.industry.chemicalsAndPlastics",
  "Electronics & Electrical": "publicSearch.industry.electronicsAndElectrical",
  "Food & Agriculture": "publicSearch.industry.foodAndAgriculture",
  "Industrial Machinery": "publicSearch.industry.industrialMachinery",
  "Metals & Mining": "publicSearch.industry.metalsAndMining",
  "Textiles & Apparel": "publicSearch.industry.textilesAndApparel",
};

const TAGLINE_ROLE_KEYS: Record<string, string> = {
  manufacturer: "publicSearch.tagline.role.manufacturer",
  trading: "publicSearch.tagline.role.trading",
  distribution: "publicSearch.tagline.role.distribution",
};

type TaglineRule = {
  match: (tagline: string) => boolean;
  templateKey: string;
  roleWord: (tagline: string) => string;
};

const TAGLINE_RULES: TaglineRule[] = [
  {
    match: (s) => s.includes("audited production lines"),
    templateKey: "publicSearch.tagline.auditedLines",
    roleWord: (s) => s.split(" ")[0],
  },
  {
    match: (s) => s.includes("export compliance, traceability"),
    templateKey: "publicSearch.tagline.exportCompliance",
    roleWord: (s) => s.split(" ")[0],
  },
  {
    match: (s) => s.includes("serving global buyers"),
    templateKey: "publicSearch.tagline.globalBuyers",
    roleWord: (s) => s.split(" ")[0],
  },
  {
    match: (s) => s.startsWith("Established "),
    templateKey: "publicSearch.tagline.establishedPartner",
    roleWord: (s) => s.split(" ")[1],
  },
  {
    match: (s) => s.startsWith("Export-oriented "),
    templateKey: "publicSearch.tagline.exportOriented",
    roleWord: (s) => s.split(" ")[1],
  },
];

export function productSlug(product: string): string {
  return product
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

export function translateIndustry(industry: string, t: TFunction): string {
  const key = INDUSTRY_KEYS[industry];
  if (!key) return industry;
  const translated = t(key);
  return translated === key ? industry : translated;
}

export function translateTagline(tagline: string, t: TFunction): string {
  for (const rule of TAGLINE_RULES) {
    if (!rule.match(tagline)) continue;
    const role = rule.roleWord(tagline);
    const roleKey = TAGLINE_ROLE_KEYS[role];
    if (!roleKey) return tagline;
    return t(rule.templateKey, { role: t(roleKey) });
  }
  return tagline;
}

export function translateProduct(product: string, t: TFunction): string {
  const key = `publicSearch.product.${productSlug(product)}`;
  const translated = t(key);
  return translated === key ? product : translated;
}
