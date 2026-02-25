/**
 * ⚠️ PLACEHOLDER SEED — Generates realistic-looking but FAKE company data.
 * For REAL data from government registries, run: npm run import:all
 * That imports 500K+ UK (Companies House), 13K US (SEC), 50K+ (OpenCorporates).
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient() as PrismaClient & {
  supplier: { deleteMany: () => Promise<{ count: number }>; createMany: (args: { data: object[] }) => Promise<{ count: number }>; groupBy: (args: object) => Promise<Array<{ country?: string; industry?: string; _count: { id: number } }>>; count: (args?: object) => Promise<number> };
  lead: { deleteMany: () => Promise<{ count: number }> };
  rFQ: { deleteMany: () => Promise<{ count: number }> };
};

function mulberry32(seed: number) {
  return function (): number {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rng = mulberry32(20250223);

function pick<T>(arr: T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}

function pickN<T>(arr: T[], min: number, max: number): T[] {
  const count = min + Math.floor(rng() * (max - min + 1));
  const shuffled = [...arr].sort(() => rng() - 0.5);
  return shuffled.slice(0, Math.min(count, arr.length));
}

function randInt(min: number, max: number): number {
  return min + Math.floor(rng() * (max - min + 1));
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

interface CountryDef {
  code: string;
  name: string;
  cities: string[];
  weight: number;
  phonePrefixes: string[];
  companySuffix: string; // e.g. "Co., Ltd." for China
  companyFormat: "china" | "india" | "turkey" | "germany" | "generic";
}

const countries: CountryDef[] = [
  { code: "CN", name: "China", cities: ["Shenzhen", "Guangzhou", "Shanghai", "Beijing", "Hangzhou", "Dongguan", "Ningbo", "Xiamen", "Qingdao", "Suzhou", "Foshan", "Wenzhou", "Yiwu", "Tianjin", "Chongqing", "Wuhan", "Nanjing", "Dalian"], weight: 200, phonePrefixes: ["+86"], companySuffix: "Co., Ltd.", companyFormat: "china" },
  { code: "IN", name: "India", cities: ["Mumbai", "Delhi", "Chennai", "Bangalore", "Ahmedabad", "Pune", "Kolkata", "Hyderabad", "Jaipur", "Surat", "Ludhiana", "Coimbatore"], weight: 100, phonePrefixes: ["+91"], companySuffix: "Private Limited", companyFormat: "india" },
  { code: "TR", name: "Turkey", cities: ["Istanbul", "Ankara", "Izmir", "Bursa", "Gaziantep", "Kayseri", "Denizli", "Konya", "Mersin", "Adana"], weight: 50, phonePrefixes: ["+90"], companySuffix: "A.Ş.", companyFormat: "turkey" },
  { code: "VN", name: "Vietnam", cities: ["Ho Chi Minh City", "Hanoi", "Da Nang", "Hai Phong"], weight: 25, phonePrefixes: ["+84"], companySuffix: "Co., Ltd.", companyFormat: "generic" },
  { code: "TH", name: "Thailand", cities: ["Bangkok", "Chiang Mai", "Rayong", "Samut Prakan"], weight: 15, phonePrefixes: ["+66"], companySuffix: "Co., Ltd.", companyFormat: "generic" },
  { code: "BD", name: "Bangladesh", cities: ["Dhaka", "Chittagong", "Gazipur", "Narayanganj"], weight: 20, phonePrefixes: ["+880"], companySuffix: "Ltd.", companyFormat: "generic" },
  { code: "PK", name: "Pakistan", cities: ["Karachi", "Lahore", "Sialkot", "Faisalabad"], weight: 15, phonePrefixes: ["+92"], companySuffix: "Pvt. Ltd.", companyFormat: "generic" },
  { code: "MY", name: "Malaysia", cities: ["Kuala Lumpur", "Penang", "Johor Bahru"], weight: 10, phonePrefixes: ["+60"], companySuffix: "Sdn. Bhd.", companyFormat: "generic" },
  { code: "ID", name: "Indonesia", cities: ["Jakarta", "Surabaya", "Bandung", "Semarang"], weight: 15, phonePrefixes: ["+62"], companySuffix: "Pt.", companyFormat: "generic" },
  { code: "PL", name: "Poland", cities: ["Warsaw", "Gdansk", "Wroclaw", "Krakow"], weight: 10, phonePrefixes: ["+48"], companySuffix: "Sp. z o.o.", companyFormat: "generic" },
  { code: "MX", name: "Mexico", cities: ["Mexico City", "Monterrey", "Guadalajara", "Puebla"], weight: 10, phonePrefixes: ["+52"], companySuffix: "S.A. de C.V.", companyFormat: "generic" },
  { code: "BR", name: "Brazil", cities: ["Sao Paulo", "Rio de Janeiro", "Belo Horizonte", "Curitiba"], weight: 10, phonePrefixes: ["+55"], companySuffix: "Ltda.", companyFormat: "generic" },
  { code: "EG", name: "Egypt", cities: ["Cairo", "Alexandria", "10th of Ramadan City"], weight: 10, phonePrefixes: ["+20"], companySuffix: "S.A.E.", companyFormat: "generic" },
  { code: "KR", name: "South Korea", cities: ["Seoul", "Busan", "Incheon", "Daegu"], weight: 10, phonePrefixes: ["+82"], companySuffix: "Co., Ltd.", companyFormat: "generic" },
  { code: "DE", name: "Germany", cities: ["Stuttgart", "Munich", "Frankfurt", "Berlin", "Hamburg", "Cologne"], weight: 15, phonePrefixes: ["+49"], companySuffix: "GmbH", companyFormat: "germany" },
  { code: "ZM", name: "Zambia", cities: ["Lusaka", "Kitwe", "Ndola", "Chingola"], weight: 5, phonePrefixes: ["+260"], companySuffix: "Ltd.", companyFormat: "generic" },
  { code: "US", name: "United States", cities: ["Houston", "Chicago", "Los Angeles", "New York", "Detroit", "Phoenix"], weight: 10, phonePrefixes: ["+1"], companySuffix: "Inc.", companyFormat: "generic" },
  { code: "TW", name: "Taiwan", cities: ["Taipei", "Kaohsiung", "Taichung", "Hsinchu"], weight: 10, phonePrefixes: ["+886"], companySuffix: "Co., Ltd.", companyFormat: "generic" },
];

interface IndustryDef {
  name: string;
  subIndustries: string[];
  products: string[][];
  certifications: string[];
  nameParts: { prefixes: string[]; suffixes: string[]; chinaSurnames?: string[]; indiaBrands?: string[]; turkeyBrands?: string[]; germanyBrands?: string[] };
}

const industries: IndustryDef[] = [
  {
    name: "Electronics",
    subIndustries: ["Consumer Electronics", "Industrial Electronics", "Semiconductors", "LED & Lighting", "PCB & Components", "Telecom Equipment"],
    products: [
      ["LED strip lights", "LED panel lights", "LED bulbs", "LED drivers", "LED grow lights"],
      ["PCB boards", "printed circuit boards", "PCBA assembly", "flex PCB", "rigid-flex PCB"],
      ["HDMI cables", "USB-C adapters", "power banks", "wireless chargers", "phone cases"],
      ["industrial sensors", "temperature controllers", "PLC controllers", "servo motors"],
      ["CCTV cameras", "IP cameras", "NVR systems", "security cameras", "access control"],
      ["solar panels", "solar inverters", "lithium batteries", "battery packs", "BMS systems"],
      ["tablet PCs", "POS terminals", "digital signage", "touch screens", "display modules"],
    ],
    certifications: ["CE", "FCC", "RoHS", "UL", "ISO 9001", "ISO 14001", "ETL", "SAA"],
    nameParts: {
      prefixes: ["Shenzhen", "Guangzhou", "Dongguan", "Tech", "Smart", "Nova", "Opto", "Micro", "Power", "Future", "Pro", "Apex", "Huawei-style", "ZTE-style"],
      suffixes: ["Electronics", "Technology", "Tech", "Systems", "Solutions", "Electric", "Optoelectronics", "Semiconductor", "Components"],
      chinaSurnames: ["Tongwei", "Longi", "Jinko", "Trina", "JA Solar", "Risen", "Canadian Solar"],
      indiaBrands: ["Rajesh", "Vishal", "Suresh", "Kumar", "Premier", "Supreme", "Elite"],
      turkeyBrands: ["Arcelik", "Vestel", "Beko", "Aselsan", "Turkcell"],
      germanyBrands: ["Siemens", "Bosch", "Berger", "Weber", "Schneider", "Fischer"],
    },
  },
  {
    name: "Textiles",
    subIndustries: ["Apparel", "Home Textiles", "Technical Textiles", "Yarn & Fabric", "Leather & Footwear", "Fashion Accessories"],
    products: [
      ["cotton t-shirts", "polo shirts", "dress shirts", "hoodies", "sweatshirts"],
      ["denim jeans", "trousers", "shorts", "workwear pants", "cargo pants"],
      ["bed sheets", "towels", "curtains", "cushion covers", "table cloths"],
      ["cotton yarn", "polyester fabric", "woven fabric", "knitted fabric", "denim fabric"],
      ["leather handbags", "wallets", "belts", "leather jackets", "leather shoes"],
      ["sports bras", "yoga pants", "activewear sets", "running shorts", "gym wear"],
    ],
    certifications: ["OEKO-TEX", "GOTS", "ISO 9001", "BSCI", "WRAP", "GRS", "BCI", "Sedex"],
    nameParts: {
      prefixes: ["Royal", "Golden", "Star", "Prime", "Elite", "Fashion", "Silk", "Cotton", "Luxury", "Heritage"],
      suffixes: ["Textiles", "Garments", "Apparel", "Fashion", "Fabrics", "Knitting", "Clothing", "Industries"],
      chinaSurnames: ["Hengyuan", "Luthai", "Shenzhou", "Youngor"],
      indiaBrands: ["Raymond", "Arvind", "Grasim", "Welspun", "Trident"],
      turkeyBrands: ["Kipaş", "Söktaş", "Yeşim", "İpeker"],
      germanyBrands: ["Adidas", "Puma", "Hugo Boss", "Trigema"],
    },
  },
  {
    name: "Machinery",
    subIndustries: ["CNC Machines", "Packaging Machinery", "Food Processing Equipment", "Construction Equipment", "Agricultural Machinery", "Printing Machinery"],
    products: [
      ["CNC milling machines", "CNC lathes", "CNC routers", "laser cutters", "plasma cutters"],
      ["packaging machines", "filling machines", "labeling machines", "sealing machines"],
      ["excavators", "wheel loaders", "concrete mixers", "tower cranes", "bulldozers"],
      ["injection molding machines", "blow molding machines", "extrusion machines"],
      ["hydraulic presses", "punch presses", "shearing machines", "bending machines"],
      ["generators", "air compressors", "welding machines", "grinding machines"],
    ],
    certifications: ["CE", "ISO 9001", "ISO 14001", "SGS", "TUV", "BV", "ASME"],
    nameParts: {
      prefixes: ["Heavy", "Power", "Precision", "Dynamic", "Force", "Iron", "Steel", "Titan", "Atlas", "Robust"],
      suffixes: ["Machinery", "Equipment", "Engineering", "Industries", "Manufacturing", "Mechanical", "Machine", "Industrial"],
      chinaSurnames: ["Sany", "Zoomlion", "Liugong", "Lonking"],
      indiaBrands: ["Larsen", "BEML", "BHEL", "ESCORTS"],
      turkeyBrands: ["Ermak", "Borusan", "Temsan", "Hidromek"],
      germanyBrands: ["Berger", "Trumpf", "DMG MORI", "Siemens", "Bosch Rexroth"],
    },
  },
  {
    name: "Chemicals",
    subIndustries: ["Industrial Chemicals", "Specialty Chemicals", "Petrochemicals", "Agrochemicals", "Pharmaceutical Raw Materials", "Paints & Coatings"],
    products: [
      ["titanium dioxide", "calcium carbonate", "sodium hydroxide", "sulfuric acid"],
      ["silicone sealants", "epoxy resins", "polyurethane foam", "adhesive tapes"],
      ["water treatment chemicals", "flocculants", "coagulants", "biocides"],
      ["pharmaceutical intermediates", "APIs", "excipients", "vitamins"],
      ["acrylic paint", "powder coatings", "wood finishes", "industrial coatings"],
    ],
    certifications: ["ISO 9001", "ISO 14001", "REACH", "GMP", "FDA", "SGS", "OHSAS 18001"],
    nameParts: {
      prefixes: ["Chem", "Sino", "Indo", "Global", "Pure", "Green", "Fine", "Bio", "Petro", "Uni", "Poly"],
      suffixes: ["Chemical", "Chemicals", "Chem", "Industries", "Pharma", "Biochem", "Materials", "Sciences"],
      chinaSurnames: ["Sinopec", "ChemChina", "Wanhua", "Huafon"],
      indiaBrands: ["Reliance", "Tata Chemicals", "SRF", "Aarti"],
      turkeyBrands: ["Petkim", "Soda", "Ege", "Kordsa"],
      germanyBrands: ["BASF", "Bayer", "Henkel", "Evonik", "Wacker"],
    },
  },
  {
    name: "Food & Agriculture",
    subIndustries: ["Grains & Cereals", "Spices & Herbs", "Fruits & Vegetables", "Seafood", "Nuts & Dried Fruits", "Beverages"],
    products: [
      ["basmati rice", "jasmine rice", "long grain rice", "parboiled rice", "broken rice"],
      ["black pepper", "turmeric", "cumin", "chili flakes", "cardamom", "cinnamon"],
      ["frozen vegetables", "canned fruits", "dehydrated onions", "garlic powder"],
      ["frozen shrimp", "tilapia fillets", "pangasius", "squid", "tuna"],
      ["cashew nuts", "almonds", "raisins", "dried apricots", "dates", "figs"],
      ["green tea", "black tea", "instant coffee", "cocoa powder", "fruit juice concentrate"],
      ["olive oil", "sunflower oil", "coconut oil", "palm oil", "sesame oil"],
    ],
    certifications: ["ISO 22000", "HACCP", "FDA", "Halal", "Kosher", "Organic", "BRC", "IFS", "GlobalGAP"],
    nameParts: {
      prefixes: ["Green", "Fresh", "Golden", "Natural", "Agro", "Farm", "Harvest", "Sun", "Ocean", "Pure", "Organic"],
      suffixes: ["Foods", "Agro", "Agriculture", "Trading", "Exports", "Enterprises", "Products", "International"],
      chinaSurnames: ["COFCO", "Yihai", "Wilmar", "Sinograin"],
      indiaBrands: ["ITC", "Adani", "Parle", "Britannia", "Amul"],
      turkeyBrands: ["Ülker", "Yıldız", "Sütaş", "Pınar"],
      germanyBrands: ["Bayer CropScience", "BASF", "K+S", "Südzucker"],
    },
  },
  {
    name: "Mining & Minerals",
    subIndustries: ["Base Metals", "Precious Metals", "Rare Earth & Critical Minerals", "Industrial Minerals", "Coal & Energy Minerals", "Mineral Processing"],
    products: [
      ["antimony", "antimony trioxide", "antimony ingots", "antimony concentrate", "antimony metal"],
      ["tin", "tin ingots", "tin concentrate", "tin solder", "tin chemicals"],
      ["lithium", "lithium carbonate", "lithium hydroxide", "lithium concentrate", "spodumene"],
      ["cobalt", "cobalt sulfate", "cobalt metal", "cobalt concentrate", "cobalt hydroxide"],
      ["copper", "copper cathode", "copper concentrate", "copper wire", "copper rod"],
      ["zinc", "zinc ingots", "zinc concentrate", "zinc oxide", "zinc alloy"],
      ["nickel", "nickel sulfate", "nickel metal", "nickel matte", "ferronickel"],
      ["manganese", "manganese ore", "manganese metal", "electrolytic manganese", "ferromanganese"],
      ["graphite", "flake graphite", "spherical graphite", "graphite anode", "natural graphite"],
      ["rare earth elements", "neodymium", "dysprosium", "praseodymium", "cerium oxide"],
      ["bauxite", "alumina", "aluminum ingots", "aluminum alloy", "aluminum scrap"],
      ["iron ore", "iron concentrate", "pig iron", "DRI", "HBI"],
      ["coal", "thermal coal", "coking coal", "anthracite", "metallurgical coal"],
    ],
    certifications: ["ISO 9001", "ISO 14001", "OHSAS 18001", "Responsible Mining", "IRMA", "RMI", "SEDEX", "EcoVadis", "LME approved"],
    nameParts: {
      prefixes: ["Global", "Pacific", "Asia", "Euro", "Sino", "Indo", "Metro", "Prime", "Royal", "United", "Atlantic", "Continental"],
      suffixes: ["Mining", "Minerals", "Metals", "Resources", "Commodities", "Trading", "Exports", "Industries", "Group"],
      chinaSurnames: ["China Minmetals", "Jiangxi Copper", "Zijin", "CMOC", "Ganfeng"],
      indiaBrands: ["Vedanta", "Hindalco", "Hindustan Zinc", "NMDC", "Coal India"],
      turkeyBrands: ["Eti", "Kozlu", "Eregli", "Kardemir"],
      germanyBrands: ["Aurubis", "ThyssenKrupp", "HeidelbergCement", "K+S"],
    },
  },
];

function generateCompanyName(industry: IndustryDef, country: CountryDef): string {
  const city = pick(country.cities);
  const suffix = country.companySuffix;

  switch (country.companyFormat) {
    case "china":
      // [City] + [Surname/Brand] + [Industry] + Co., Ltd.
      const chinaPart = pick(industry.nameParts.chinaSurnames || industry.nameParts.prefixes);
      const chinaIndustry = industry.name.replace(/ & .*/, "").replace(/ /g, "");
      return `${city} ${chinaPart} ${chinaIndustry} ${suffix}`;
    case "india":
      // [Brand] + [Industry] + Pvt. Ltd. / Limited
      const indiaBrand = pick(industry.nameParts.indiaBrands || industry.nameParts.prefixes);
      const indiaIndustry = pick(industry.nameParts.suffixes);
      return `${indiaBrand} ${indiaIndustry} ${country.code === "IN" ? "Private Limited" : suffix}`;
    case "turkey":
      // [Brand] + [Industry] + A.Ş. / Ltd. Şti.
      const trBrand = pick(industry.nameParts.turkeyBrands || industry.nameParts.prefixes);
      const trIndustry = pick(industry.nameParts.suffixes);
      return `${trBrand} ${trIndustry} ${suffix}`;
    case "germany":
      // [Brand] + [Industry] + GmbH
      const deBrand = pick(industry.nameParts.germanyBrands || industry.nameParts.prefixes);
      const deIndustry = pick(industry.nameParts.suffixes);
      return `${deBrand} ${deIndustry} ${suffix}`;
    default:
      // Generic: [Prefix] + [City/Brand] + [Suffix] + [Legal]
      const prefix = pick(industry.nameParts.prefixes);
      const mid = rng() < 0.5 ? city : pick(industry.nameParts.suffixes);
      const suf = pick(industry.nameParts.suffixes);
      if (mid === city) return `${prefix} ${city} ${suf} ${suffix}`;
      return `${prefix} ${suf} ${suffix}`;
  }
}

function generatePhone(country: CountryDef): string {
  const prefix = pick(country.phonePrefixes);
  const digits = Array.from({ length: 10 }, () => Math.floor(rng() * 10)).join("");
  return `${prefix} ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
}

function generateEmail(companyName: string): string {
  const slug = companyName.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 14);
  const prefix = pick(["info", "sales", "export", "contact", "inquiry"]);
  return `${prefix}@${slug}.com`;
}

function generateWebsite(companyName: string): string {
  const slug = companyName.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 16);
  return `www.${slug}.com`;
}

function generateRevenue(): string {
  const ranges = ["< $500K", "$500K-$1M", "$1M-$5M", "$5M-$10M", "$10M-$50M", "$50M-$100M", "$100M+"];
  const weights = [5, 15, 30, 25, 15, 7, 3];
  let r = rng() * weights.reduce((a, b) => a + b, 0);
  for (let i = 0; i < weights.length; i++) {
    r -= weights[i];
    if (r <= 0) return ranges[i];
  }
  return ranges[2];
}

function generateResponseTime(): string {
  const options = ["< 12h", "< 24h", "1-2 days", "2-3 days", "3-5 days"];
  const weights = [10, 35, 30, 15, 10];
  let r = rng() * weights.reduce((a, b) => a + b, 0);
  for (let i = 0; i < weights.length; i++) {
    r -= weights[i];
    if (r <= 0) return options[i];
  }
  return options[1];
}

function generateDescription(
  companyName: string, industry: IndustryDef, country: CountryDef,
  city: string, yearEstablished: number, products: string[],
): string {
  const years = 2025 - yearEstablished;
  const templates = [
    `${companyName} is a leading ${industry.name.toLowerCase()} manufacturer based in ${city}, ${country.name}. Established in ${yearEstablished}, with over ${years} years of industry experience, we specialize in ${products.slice(0, 3).join(", ")}. Our facilities and quality control ensure consistent product excellence for global markets.`,
    `Founded in ${yearEstablished}, ${companyName} has grown into a trusted supplier of ${industry.name.toLowerCase()} products from ${city}, ${country.name}. We manufacture and export ${products.slice(0, 3).join(", ")} to clients worldwide.`,
    `${companyName} is a professional ${industry.name.toLowerCase()} company headquartered in ${city}, ${country.name}. With ${years}+ years in the industry, we provide comprehensive solutions including ${products.slice(0, 3).join(", ")}.`,
  ];
  return pick(templates);
}

const paymentTermsOptions = [
  ["T/T", "L/C"], ["T/T", "Western Union"], ["L/C", "D/P"],
  ["T/T", "L/C", "D/P"], ["T/T", "PayPal"], ["T/T"], ["L/C", "T/T", "Western Union"],
];

const exportMarketsOptions = [
  ["North America", "Europe"], ["Europe", "Middle East", "Africa"],
  ["Southeast Asia", "Middle East"], ["North America", "South America", "Europe"],
  ["Europe", "Asia", "Oceania"], ["Middle East", "Africa", "Asia"],
  ["Global"], ["North America", "Europe", "Asia", "Middle East"],
];

function buildCountryPool(): CountryDef[] {
  const pool: CountryDef[] = [];
  for (const country of countries) {
    for (let i = 0; i < country.weight; i++) pool.push(country);
  }
  return pool;
}

const usedNames = new Set<string>();

function generateSuppliers(count: number) {
  const pool = buildCountryPool();
  const suppliers: any[] = [];
  const usedSlugs = new Set<string>();

  const industryPool = [...industries];
  const miningIndustry = industries.find((i) => i.name === "Mining & Minerals");
  if (miningIndustry) {
    for (let w = 0; w < 4; w++) industryPool.push(miningIndustry);
  }

  for (let i = 0; i < count; i++) {
    const country = pick(pool);
    const industry = pick(industryPool);
    const subIndustry = pick(industry.subIndustries);
    let companyName = generateCompanyName(industry, country);
    let attempts = 0;
    while (usedNames.has(companyName) && attempts < 30) {
      companyName = generateCompanyName(industry, country);
      attempts++;
    }
    usedNames.add(companyName);

    const city = pick(country.cities);
    const yearEstablished = randInt(1985, 2022);
    const productSet = pick(industry.products);
    const selectedProducts = pickN(productSet, 2, 5);
    const selectedCerts = pickN(industry.certifications, 1, 4);
    const verified = rng() < 0.35;
    const rating = verified ? Math.round((3.5 + rng() * 1.5) * 10) / 10 : Math.round((2.5 + rng() * 2.5) * 10) / 10;
    const reviewCount = verified ? randInt(5, 120) : randInt(0, 25);
    const employeeCount = pick([10, 25, 50, 100, 200, 500, 1000, 2000, 5000]);
    const minOrderValue = pick([100, 500, 1000, 2000, 5000, 10000, 25000, 50000]);

    let slug = slugify(companyName);
    if (usedSlugs.has(slug)) slug = `${slug}-${randInt(100, 999)}`;
    usedSlugs.add(slug);

    const description = generateDescription(companyName, industry, country, city, yearEstablished, selectedProducts);

    suppliers.push({
      companyName,
      slug,
      country: country.name,
      countryCode: country.code,
      city,
      region: null,
      industry: industry.name,
      subIndustry,
      products: JSON.stringify(selectedProducts),
      certifications: JSON.stringify(selectedCerts),
      contactEmail: generateEmail(companyName),
      contactPhone: generatePhone(country),
      website: generateWebsite(companyName),
      description,
      employeeCount,
      annualRevenue: generateRevenue(),
      yearEstablished,
      verified,
      rating,
      reviewCount,
      responseTime: generateResponseTime(),
      minOrderValue,
      currency: "USD",
      paymentTerms: JSON.stringify(pick(paymentTermsOptions)),
      exportMarkets: JSON.stringify(pick(exportMarketsOptions)),
      logoUrl: null,
    });
  }

  return suppliers;
}

async function main() {
  console.log("Seeding database...");

  await prisma.rFQ.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.supplier.deleteMany();

  const count = parseInt(process.env.SUPPLIER_COUNT || "100000", 10);
  const suppliers = generateSuppliers(count);
  const BATCH_SIZE = 500;
  let inserted = 0;

  for (let i = 0; i < suppliers.length; i += BATCH_SIZE) {
    const batch = suppliers.slice(i, i + BATCH_SIZE);
    await prisma.supplier.createMany({ data: batch });
    inserted += batch.length;
    console.log(`  Inserted ${inserted}/${suppliers.length} suppliers`);
  }

  const byCountry = await prisma.supplier.groupBy({
    by: ["country"],
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
  });

  const byIndustry = await prisma.supplier.groupBy({
    by: ["industry"],
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
  });

  console.log("\n--- Country Distribution ---");
  for (const row of byCountry) {
    const pct = ((row._count.id / suppliers.length) * 100).toFixed(1);
    console.log(`  ${row.country}: ${row._count.id} (${pct}%)`);
  }

  console.log("\n--- Industry Distribution ---");
  for (const row of byIndustry) {
    const pct = ((row._count.id / suppliers.length) * 100).toFixed(1);
    console.log(`  ${row.industry}: ${row._count.id} (${pct}%)`);
  }

  const verifiedCount = await prisma.supplier.count({ where: { verified: true } });
  console.log(`\nVerified suppliers: ${verifiedCount}/${suppliers.length}`);
  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
