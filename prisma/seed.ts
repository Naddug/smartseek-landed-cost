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
  domains: string[];
}

const countries: CountryDef[] = [
  { code: "CN", name: "China", cities: ["Shenzhen", "Guangzhou", "Shanghai", "Beijing", "Hangzhou", "Dongguan", "Ningbo", "Xiamen", "Qingdao", "Suzhou", "Foshan", "Wenzhou", "Yiwu", "Tianjin", "Chongqing", "Wuhan", "Nanjing", "Dalian"], weight: 200, phonePrefixes: ["+86"], domains: [".cn", ".com.cn"] },
  { code: "IN", name: "India", cities: ["Mumbai", "Delhi", "Chennai", "Bangalore", "Ahmedabad", "Pune", "Kolkata", "Hyderabad", "Jaipur", "Surat", "Ludhiana", "Coimbatore"], weight: 100, phonePrefixes: ["+91"], domains: [".in", ".co.in"] },
  { code: "TR", name: "Turkey", cities: ["Istanbul", "Ankara", "Izmir", "Bursa", "Gaziantep", "Kayseri", "Denizli", "Konya", "Mersin", "Adana"], weight: 50, phonePrefixes: ["+90"], domains: [".com.tr", ".tr"] },
  { code: "VN", name: "Vietnam", cities: ["Ho Chi Minh City", "Hanoi", "Da Nang", "Hai Phong"], weight: 25, phonePrefixes: ["+84"], domains: [".vn"] },
  { code: "TH", name: "Thailand", cities: ["Bangkok", "Chiang Mai", "Rayong", "Samut Prakan"], weight: 15, phonePrefixes: ["+66"], domains: [".co.th"] },
  { code: "BD", name: "Bangladesh", cities: ["Dhaka", "Chittagong", "Gazipur", "Narayanganj"], weight: 20, phonePrefixes: ["+880"], domains: [".com.bd"] },
  { code: "PK", name: "Pakistan", cities: ["Karachi", "Lahore", "Sialkot", "Faisalabad"], weight: 15, phonePrefixes: ["+92"], domains: [".pk"] },
  { code: "MY", name: "Malaysia", cities: ["Kuala Lumpur", "Penang", "Johor Bahru"], weight: 10, phonePrefixes: ["+60"], domains: [".my"] },
  { code: "ID", name: "Indonesia", cities: ["Jakarta", "Surabaya", "Bandung", "Semarang"], weight: 15, phonePrefixes: ["+62"], domains: [".co.id"] },
  { code: "PL", name: "Poland", cities: ["Warsaw", "Gdansk", "Wroclaw", "Krakow"], weight: 10, phonePrefixes: ["+48"], domains: [".pl"] },
  { code: "MX", name: "Mexico", cities: ["Mexico City", "Monterrey", "Guadalajara", "Puebla"], weight: 10, phonePrefixes: ["+52"], domains: [".mx"] },
  { code: "BR", name: "Brazil", cities: ["Sao Paulo", "Rio de Janeiro", "Belo Horizonte", "Curitiba"], weight: 10, phonePrefixes: ["+55"], domains: [".com.br"] },
  { code: "EG", name: "Egypt", cities: ["Cairo", "Alexandria", "10th of Ramadan City"], weight: 10, phonePrefixes: ["+20"], domains: [".eg"] },
  { code: "KR", name: "South Korea", cities: ["Seoul", "Busan", "Incheon", "Daegu"], weight: 10, phonePrefixes: ["+82"], domains: [".kr"] },
];

interface IndustryDef {
  name: string;
  subIndustries: string[];
  products: string[][];
  certifications: string[];
  companyPrefixes: string[];
  companySuffixes: string[];
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
    companyPrefixes: ["Tech", "Digi", "Electro", "Smart", "Nova", "Opto", "Micro", "Power", "Star", "Golden", "Future", "Pro", "Mega", "Ultra", "Neo", "Apex"],
    companySuffixes: ["Electronics", "Technology", "Tech", "Systems", "Solutions", "Electric", "Optoelectronics", "Semiconductor", "Components", "Digital"],
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
      ["silk scarves", "wool sweaters", "cashmere shawls", "linen shirts", "bamboo socks"],
    ],
    certifications: ["OEKO-TEX", "GOTS", "ISO 9001", "BSCI", "WRAP", "GRS", "BCI", "Sedex"],
    companyPrefixes: ["Royal", "Golden", "Star", "Prime", "Elite", "Fashion", "Silk", "Cotton", "Luxury", "Heritage", "Classic", "Modern", "Urban", "Pacific", "Atlas"],
    companySuffixes: ["Textiles", "Garments", "Apparel", "Fashion", "Fabrics", "Knitting", "Clothing", "Wear", "Industries", "Manufacturing"],
  },
  {
    name: "Machinery",
    subIndustries: ["CNC Machines", "Packaging Machinery", "Food Processing Equipment", "Construction Equipment", "Agricultural Machinery", "Printing Machinery"],
    products: [
      ["CNC milling machines", "CNC lathes", "CNC routers", "laser cutters", "plasma cutters"],
      ["packaging machines", "filling machines", "labeling machines", "sealing machines"],
      ["excavators", "wheel loaders", "concrete mixers", "tower cranes", "bulldozers"],
      ["injection molding machines", "blow molding machines", "extrusion machines"],
      ["food processing lines", "bakery equipment", "meat processing machines"],
      ["hydraulic presses", "punch presses", "shearing machines", "bending machines"],
      ["generators", "air compressors", "welding machines", "grinding machines"],
    ],
    certifications: ["CE", "ISO 9001", "ISO 14001", "SGS", "TUV", "BV", "ASME"],
    companyPrefixes: ["Heavy", "Power", "Strong", "Global", "Great", "Super", "Precision", "Dynamic", "Force", "Iron", "Steel", "Titan", "Atlas", "Robust"],
    companySuffixes: ["Machinery", "Equipment", "Engineering", "Industries", "Manufacturing", "Mechanical", "Machine", "Industrial", "Tech", "Works"],
  },
  {
    name: "Chemicals",
    subIndustries: ["Industrial Chemicals", "Specialty Chemicals", "Petrochemicals", "Agrochemicals", "Pharmaceutical Raw Materials", "Paints & Coatings"],
    products: [
      ["titanium dioxide", "calcium carbonate", "sodium hydroxide", "sulfuric acid"],
      ["silicone sealants", "epoxy resins", "polyurethane foam", "adhesive tapes"],
      ["water treatment chemicals", "flocculants", "coagulants", "biocides"],
      ["pesticides", "herbicides", "fertilizers", "plant growth regulators"],
      ["pharmaceutical intermediates", "APIs", "excipients", "vitamins"],
      ["acrylic paint", "powder coatings", "wood finishes", "industrial coatings"],
      ["rubber chemicals", "plasticizers", "flame retardants", "antioxidants"],
    ],
    certifications: ["ISO 9001", "ISO 14001", "REACH", "GMP", "FDA", "SGS", "OHSAS 18001"],
    companyPrefixes: ["Chem", "Sino", "Indo", "Global", "Pure", "Green", "Fine", "Bio", "Petro", "Uni", "Poly", "Bright", "Rich", "Ever", "Good"],
    companySuffixes: ["Chemical", "Chemicals", "Chem", "Industries", "Pharma", "Biochem", "Materials", "Sciences", "Corp", "International"],
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
    companyPrefixes: ["Green", "Fresh", "Golden", "Natural", "Agro", "Farm", "Harvest", "Sun", "Ocean", "Pure", "Organic", "Royal", "Fine", "Premium"],
    companySuffixes: ["Foods", "Agro", "Agriculture", "Trading", "Exports", "Enterprises", "Products", "International", "Global", "Industries"],
  },
];

function generatePhone(country: CountryDef): string {
  const prefix = pick(country.phonePrefixes);
  const digits = Array.from({ length: 10 }, () => Math.floor(rng() * 10)).join("");
  return `${prefix} ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
}

function generateEmail(companyName: string, country: CountryDef): string {
  const clean = companyName.toLowerCase().replace(/[^a-z0-9]/g, "");
  const short = clean.slice(0, 12);
  const prefix = pick(["info", "sales", "export", "contact", "inquiry", "trade"]);
  const domain = pick(country.domains);
  return `${prefix}@${short}${domain}`;
}

function generateWebsite(companyName: string, country: CountryDef): string {
  const clean = companyName.toLowerCase().replace(/[^a-z0-9]/g, "");
  const short = clean.slice(0, 15);
  const domain = pick(country.domains);
  return `https://www.${short}${domain}`;
}

function generateRevenue(): string {
  const ranges = ["< $500K", "$500K-$1M", "$1M-$5M", "$5M-$10M", "$10M-$50M", "$50M-$100M", "$100M+"];
  const weights = [5, 15, 30, 25, 15, 7, 3];
  const total = weights.reduce((a, b) => a + b, 0);
  let r = rng() * total;
  for (let i = 0; i < weights.length; i++) {
    r -= weights[i];
    if (r <= 0) return ranges[i];
  }
  return ranges[2];
}

function generateResponseTime(): string {
  const options = ["< 12h", "< 24h", "1-2 days", "2-3 days", "3-5 days"];
  const weights = [10, 35, 30, 15, 10];
  const total = weights.reduce((a, b) => a + b, 0);
  let r = rng() * total;
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
    `${companyName} is a leading ${industry.name.toLowerCase()} manufacturer based in ${city}, ${country.name}. Established in ${yearEstablished}, with over ${years} years of industry experience, we specialize in ${products.slice(0, 3).join(", ")}. Our state-of-the-art facilities and rigorous quality control ensure consistent product excellence for global markets.`,
    `Founded in ${yearEstablished}, ${companyName} has grown into a trusted supplier of ${industry.name.toLowerCase()} products from ${city}, ${country.name}. We manufacture and export ${products.slice(0, 3).join(", ")} to clients worldwide. Our commitment to quality and competitive pricing makes us a preferred partner for importers across Europe, North America, and Asia.`,
    `${companyName} is a professional ${industry.name.toLowerCase()} company headquartered in ${city}, ${country.name}. With ${years}+ years in the industry, we provide comprehensive solutions including ${products.slice(0, 3).join(", ")}. We serve clients in 30+ countries with ISO-certified quality management systems.`,
    `Based in ${city}, ${country.name}, ${companyName} has been a reliable source for ${industry.name.toLowerCase()} products since ${yearEstablished}. Our product range includes ${products.slice(0, 3).join(", ")}. We pride ourselves on competitive pricing, strict quality control, and timely delivery to meet the demands of international trade.`,
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
    for (let i = 0; i < country.weight; i++) {
      pool.push(country);
    }
  }
  return pool;
}

const usedNames = new Set<string>();

function generateCompanyName(industry: IndustryDef, country: CountryDef): string {
  let attempts = 0;
  while (attempts < 50) {
    const prefix = pick(industry.companyPrefixes);
    const suffix = pick(industry.companySuffixes);
    const r = rng();
    let name: string;
    if (r < 0.3) {
      name = `${prefix} ${suffix}`;
    } else if (r < 0.5) {
      name = `${prefix} ${pick(country.cities)} ${suffix}`;
    } else if (r < 0.7) {
      const mid = ["International", "Global", "World", "Asia", "Euro", "Pacific"];
      name = `${prefix} ${pick(mid)} ${suffix}`;
    } else if (r < 0.85) {
      name = `${pick(country.cities)} ${prefix} ${suffix}`;
    } else {
      const connectors = ["&", "Plus", "Pro", "Max", "One"];
      name = `${prefix}${pick(connectors)} ${suffix}`;
    }
    if (!usedNames.has(name)) {
      usedNames.add(name);
      return name;
    }
    attempts++;
  }
  const fallback = `${pick(industry.companyPrefixes)} ${pick(industry.companySuffixes)} ${randInt(100, 999)}`;
  usedNames.add(fallback);
  return fallback;
}

function generateSuppliers(count: number) {
  const pool = buildCountryPool();
  const suppliers: any[] = [];
  const usedSlugs = new Set<string>();

  for (let i = 0; i < count; i++) {
    const country = pool[i % pool.length];
    const industry = pick(industries);
    const subIndustry = pick(industry.subIndustries);
    const companyName = generateCompanyName(industry, country);
    const city = pick(country.cities);
    const yearEstablished = randInt(1985, 2022);
    const productSet = pick(industry.products);
    const selectedProducts = pickN(productSet, 2, 5);
    const selectedCerts = pickN(industry.certifications, 1, 4);
    const verified = rng() < 0.35;
    const rating = verified
      ? Math.round((3.5 + rng() * 1.5) * 10) / 10
      : Math.round((2.5 + rng() * 2.5) * 10) / 10;
    const reviewCount = verified ? randInt(5, 120) : randInt(0, 25);
    const employeeCount = pick([10, 25, 50, 100, 200, 500, 1000, 2000, 5000]);
    const minOrderValue = pick([100, 500, 1000, 2000, 5000, 10000, 25000, 50000]);

    let slug = slugify(companyName);
    if (usedSlugs.has(slug)) {
      slug = `${slug}-${randInt(100, 999)}`;
    }
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
      contactEmail: generateEmail(companyName, country),
      contactPhone: generatePhone(country),
      website: generateWebsite(companyName, country),
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

  const suppliers = generateSuppliers(500);
  const BATCH_SIZE = 50;
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
    const pct = ((row._count.id / 500) * 100).toFixed(1);
    console.log(`  ${row.country}: ${row._count.id} (${pct}%)`);
  }

  console.log("\n--- Industry Distribution ---");
  for (const row of byIndustry) {
    const pct = ((row._count.id / 500) * 100).toFixed(1);
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