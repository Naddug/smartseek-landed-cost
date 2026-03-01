import { getOpenAIClient } from "./openaiClient";
import { calculateLandedCost } from "./landedCost/orchestrator";
import type { LandedCostInput, LandedCostResult } from "./landedCost/types";
import { generateRiskAnalysis } from "./riskIntelligence";
import { getMineralMarketPrice, getProductFamilyMarketPrice } from "./marketPrices";
import { prisma } from "../../lib/prisma";
import { getCountryCode } from "../lib/countryCodes";
import { withTimeout, withRetry } from "../lib/asyncUtils";
import { MINERAL_PRODUCTS, MINERAL_FORMS, getMineralPricePerTonne, getMineralPriceSource, detectMineralProduct } from "@shared/mineralConfig";
import { PRODUCT_FAMILIES, detectProductFamily, getProductFamilyPrice } from "@shared/productFamilies";

export interface ReportFormData {
  productName: string;
  category: string;
  targetRegion: string;
  budget: string;
  quantity: string;
  originCountry?: string;
  destinationCountry?: string;
  additionalRequirements?: string;
  /** For minerals (copper, tin, antimony, etc.): product id + purity grade + form (ore/concentrate/ingot) */
  mineralPurity?: { productId: string; purityId: string; formId?: string };
  /** For product families (steel, agri, chemicals, etc.): family id + param values */
  productFamily?: { familyId: string; params: Record<string, string> };
}

export interface CustomsFees {
  hsCode: string;
  hsCodeDescription: string;
  importDutyRate: string;
  importDutyAmount: string;
  vatRate: string;
  vatAmount: string;
  additionalDuties: Array<{
    name: string;
    rate: string;
    amount: string;
  }>;
  totalCustomsFees: string;
}

export interface LandedCost {
  productCost: string;
  freightCost: string;
  insuranceCost: string;
  customsDuties: string;
  vatTaxes: string;
  handlingFees: string;
  brokerageFees: string;
  portCharges: string;
  inlandTransport: string;
  totalLandedCost: string;
  costPerUnit: string;
}

export interface SellerComparison {
  sellerName: string;
  platform: string;
  location: string;
  unitPrice: string;
  moq: string;
  leadTime: string;
  rating: number;
  yearsInBusiness: number;
  certifications: string[];
  platformFees: string;
  paymentTerms: string;
  shippingOptions: string[];
  estimatedProfit: string;
  profitMargin: string;
  totalCostWithFees: string;
  recommendation: string;
  contactEmail?: string | null;
  contactPhone?: string | null;
  website?: string | null;
  slug?: string;
}

export interface GeneratedReport {
  executiveSummary: string;
  productClassification: {
    hsCode: string;
    hsCodeDescription: string;
    tariffChapter: string;
    productCategory: string;
    regulatoryRequirements: string[];
  };
  marketOverview: {
    marketSize: string;
    growthRate: string;
    keyTrends: string[];
    majorExporters: string[];
    majorImporters: string[];
  };
  customsAnalysis: {
    originCountry: string;
    destinationCountry: string;
    tradeAgreements: string[];
    customsFees: CustomsFees;
    requiredDocuments: string[];
    complianceNotes: string[];
  };
  landedCostBreakdown: LandedCost;
  sellerComparison: SellerComparison[];
  supplierAnalysis: {
    topRegions: Array<{
      region: string;
      advantages: string[];
      considerations: string[];
      avgPriceRange: string;
    }>;
    recommendedSuppliers: Array<{
      name: string;
      location: string;
      strengths: string[];
      estimatedCost: string;
      moq: string;
      leadTime: string;
      certifications: string[];
    }>;
  };
  profitAnalysis: {
    recommendedRetailPrice: string;
    estimatedProfit: string;
    profitMargin: string;
    breakEvenQuantity: string;
    platformFees: Array<{
      platform: string;
      feeStructure: string;
      estimatedFees: string;
    }>;
  };
  costBreakdown: {
    unitCost: string;
    toolingCost: string;
    shippingCost: string;
    totalEstimate: string;
    factors: string[];
  };
  riskAssessment: {
    overallRisk: string;
    risks: Array<{
      category: string;
      level: string;
      mitigation: string;
    }>;
  };
  timeline: {
    sampling: string;
    tooling: string;
    production: string;
    shipping: string;
    customsClearance: string;
    total: string;
  };
  recommendations: string[];
  nextSteps: string[];
  metadata?: {
    inputs: Record<string, unknown>;
    generatedAt: string;
    model: string;
    warnings: string[];
  };
}

function formatCurrency(value: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/** Fix common LLM typos in report text */
function fixCommonTypos(text: string): string {
  return text
    .replace(/\bExperient\b/gi, "Experienced")
    .replace(/\brastructure\b/gi, "infrastructure")
    .replace(/\bDirectorý\b/gi, "Directory")
    .replace(/\bUnite\b(?!d)/g, "United");
}

function applyTypoFixes(report: GeneratedReport): void {
  report.supplierAnalysis?.topRegions?.forEach((r) => {
    r.advantages = r.advantages?.map((a) => fixCommonTypos(a)) ?? [];
    r.considerations = r.considerations?.map((c) => fixCommonTypos(c)) ?? [];
  });
  report.sellerComparison?.forEach((s) => {
    if (s.location) s.location = fixCommonTypos(s.location);
    if (s.platform) s.platform = fixCommonTypos(s.platform);
    if (s.recommendation) s.recommendation = fixCommonTypos(s.recommendation);
  });
  report.supplierAnalysis?.recommendedSuppliers?.forEach((s) => {
    if (s.location) s.location = fixCommonTypos(s.location);
  });
}

function landedCostResultToBreakdown(result: LandedCostResult): LandedCost {
  const c = result.customs;
  const customsTotal = c.importDuty.amount + c.vat.amount + (c.mpf?.amount ?? 0) + (c.hmf?.amount ?? 0);
  return {
    productCost: formatCurrency(result.baseCost.normalizedCost, result.baseCost.currency),
    freightCost: formatCurrency(result.freight.selectedCost, result.baseCost.currency),
    insuranceCost: formatCurrency(result.insurance.amount, result.baseCost.currency),
    customsDuties: formatCurrency(c.importDuty.amount, result.baseCost.currency),
    vatTaxes: formatCurrency(c.vat.amount, result.baseCost.currency),
    handlingFees: formatCurrency(result.inlandTransport.total * 0.3, result.baseCost.currency),
    brokerageFees: formatCurrency(result.inlandTransport.total * 0.2, result.baseCost.currency),
    portCharges: formatCurrency((c.mpf?.amount ?? 0) + (c.hmf?.amount ?? 0), result.baseCost.currency),
    inlandTransport: formatCurrency(result.inlandTransport.total, result.baseCost.currency),
    totalLandedCost: formatCurrency(result.totals.totalLandedCost, result.baseCost.currency),
    costPerUnit: formatCurrency(result.totals.costPerUnit, result.baseCost.currency),
  };
}

export async function generateSmartFinderReport(
  formData: ReportFormData
): Promise<GeneratedReport> {
  const warnings: string[] = [];
  const originCountry =
    formData.originCountry && formData.originCountry !== "Any"
      ? formData.originCountry
      : "any suitable global sourcing location";
  const destinationCountry = formData.destinationCountry || "United States";
  const originCode = getCountryCode(originCountry === "any suitable global sourcing location" ? "China" : originCountry);
  const destCode = getCountryCode(destinationCountry);
  const budgetStr = formData.budget && !/^(competitive|any|flexible)$/i.test(formData.budget)
    ? `Target Budget: ${formData.budget} per unit`
    : "Target Budget: Competitive / flexible";

  const quantity = parseInt(String(formData.quantity || "1000"), 10) || 1000;
  const productName = formData.productName || formData.category || "Product";
  const category = formData.category || productName;
  const searchText = `${productName} ${category}`.toLowerCase();

  // Mineral products (copper, tin, antimony, etc.): use LME/Argus-style pricing with purity grade
  const mineralProduct = detectMineralProduct(searchText);
  let estimatedFobPerUnit: number | null = null;
  let mineralPurityUsed: { productId: string; purityId: string; formId: string; priceSource: string; calculationFormula: string } | null = null;

  if (mineralProduct) {
    const purityId = formData.mineralPurity?.productId === mineralProduct.id
      ? formData.mineralPurity.purityId
      : mineralProduct.purities.find((p) => p.id === "99.9")?.id ?? mineralProduct.purities[0]?.id ?? "99.9";
    const formId = formData.mineralPurity?.formId ?? "ingot";
    const { pricePerTonne: marketBase, source: priceSource } = await withTimeout(
      getMineralMarketPrice(mineralProduct.id, originCountry),
      10000,
      "Mineral market price"
    );
    const pricePerTonne = getMineralPricePerTonne(mineralProduct.id, purityId, originCountry, formId, marketBase);
    if (pricePerTonne != null) {
      estimatedFobPerUnit = pricePerTonne;
      const basePrice = marketBase;
      const purity = mineralProduct.purities.find((p) => p.id === purityId);
      const form = MINERAL_FORMS.find((f) => f.id === formId);
      const sourceLabel = priceSource === "MetalpriceAPI" ? "LME (live)" : getMineralPriceSource(mineralProduct.id, originCountry);
      const formula = `Base ${sourceLabel} $${basePrice.toLocaleString()}/ton x ${purity?.label ?? purityId} (${purity?.priceMultiplier ?? 1}) x ${form?.label ?? formId} (${form?.priceMultiplier ?? 1}) x ${quantity} tons = $${(pricePerTonne * quantity).toLocaleString()}`;
      mineralPurityUsed = {
        productId: mineralProduct.id,
        purityId,
        formId,
        priceSource: priceSource === "MetalpriceAPI" ? "LME (live)" : getMineralPriceSource(mineralProduct.id, originCountry),
        calculationFormula: formula,
      };
      if (!formData.mineralPurity) {
        const purityLabel = mineralProduct.purities.find((p) => p.id === purityId)?.label ?? purityId;
        warnings.push(`Purity not specified for ${mineralProduct.name}. Using ${purityLabel}. Specify purity for more accurate quotes.`);
      }
    }
  }

  // Product families (steel, agri, chemicals, textiles, etc.): use params + market prices
  let productFamilyUsed: { familyId: string; referenceIndex: string } | null = null;
  if (estimatedFobPerUnit == null) {
    const family = formData.productFamily?.familyId
      ? PRODUCT_FAMILIES.find((f) => f.id === formData.productFamily!.familyId)
      : detectProductFamily(searchText);
    if (family && (formData.productFamily?.params || family.parameters.length > 0)) {
      const params = formData.productFamily?.params ?? {};
      const productParam =
        family.id === "agri_bulk" ? params.product
        : family.id === "food_beverage" ? params.product_type
        : undefined;
      const marketPrice = await withTimeout(
        getProductFamilyMarketPrice(family.id, productParam, originCountry),
        10000,
        "Product family market price"
      );
      const baseOverride = marketPrice?.pricePerTonne;
      const pricePerUnit = getProductFamilyPrice(
        family,
        params,
        originCountry,
        baseOverride
      );
      if (pricePerUnit > 0) {
        estimatedFobPerUnit = pricePerUnit;
        productFamilyUsed = {
          familyId: family.id,
          referenceIndex: marketPrice?.source ?? family.referenceIndex,
        };
        if (!formData.productFamily) {
          warnings.push(`Product specs not fully specified for ${family.name}. Using default params. Specify for accurate quotes.`);
        }
      }
    }
  }

  // Fallback: non-mineral commodities (iron, steel, coal)
  const COMMODITY_FALLBACK: Record<string, number> = {
    iron: 120, "iron ore": 120, steel: 700, coal: 150, "crude oil": 550,
  };
  if (estimatedFobPerUnit == null) {
    for (const [key, price] of Object.entries(COMMODITY_FALLBACK)) {
      if (searchText.includes(key)) {
        estimatedFobPerUnit = price;
        break;
      }
    }
  }

  // Phase 1: Quick LLM call for HS code + estimated FOB cost (when not from mineral/commodity lookup)
  let hsCode = "";
  if (estimatedFobPerUnit == null) {
    try {
      const miniRes = await withTimeout(
        getOpenAIClient().chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "user",
              content: `Product: ${productName}. Category: ${category}. Quantity: ${quantity} units. Return ONLY valid JSON: { "hsCode": "6-digit HS code (e.g. 8471.30)", "estimatedFobCostPerUnit": number }.
For metals/minerals (copper, iron, steel, aluminum, etc.) use price PER TONNE in USD (e.g. copper ~13000 LME, steel ~700).
For electronics use price per piece. For textiles use price per piece or per kg.`,
            },
          ],
          response_format: { type: "json_object" },
          max_tokens: 150,
        }),
        15000,
        "HS code LLM"
      );
      const mini = JSON.parse(miniRes.choices[0]?.message?.content || "{}");
      hsCode = mini.hsCode || "8471.30";
      estimatedFobPerUnit = typeof mini.estimatedFobCostPerUnit === "number" ? mini.estimatedFobCostPerUnit : 5;
    } catch (e) {
      warnings.push("Could not get HS code from AI; using default 8471.30");
      hsCode = "8471.30";
      estimatedFobPerUnit = 5;
    }
  } else {
    // HS code for mineral/commodity (no AI call needed)
    hsCode = mineralProduct?.hsCode ?? (() => {
      if (/copper/i.test(searchText)) return "7403.11";
      if (/antimony/i.test(searchText)) return "8110.20";
      if (/tin/i.test(searchText)) return "8001.20";
      if (/zinc/i.test(searchText)) return "7901.11";
      if (/lead/i.test(searchText)) return "7801.10";
      if (/nickel/i.test(searchText)) return "7502.10";
      if (/aluminum|aluminium/i.test(searchText)) return "7601.10";
      if (/honey/i.test(searchText)) return "0409.00";
      return "8471.30";
    })();
  }

  // For bulk commodities (tonnes/mt), quantity is in tonnes; otherwise pieces/cbm
  const isBulkCommodity = /copper|iron|steel|aluminum|zinc|nickel|lead|tin|coal|ore|metal|mineral|wheat|corn|barley|rice|soybean|sugar|palm oil|grain|chemical|resin|plastic|petrochemical/i.test(searchText)
    || productFamilyUsed?.familyId === "finished_metal_steel"
    || productFamilyUsed?.familyId === "agri_bulk"
    || productFamilyUsed?.familyId === "petrochemicals_chemicals"
    || productFamilyUsed?.familyId === "plastics_packaging"
    || productFamilyUsed?.familyId === "food_beverage";
  const effectiveQuantity = isBulkCommodity ? quantity : quantity;
  const effectivePricePerUnit = estimatedFobPerUnit ?? 5;

  // Phase 2: Fetch real data in parallel
  let landedCostData: LandedCost | null = null;
  let realSuppliers: Array<{ companyName: string; country: string; city: string; industry: string; products: string; certifications: string | null; rating: number; minOrderValue: number | null; yearEstablished: number }> = [];
  let riskData: Awaited<ReturnType<typeof generateRiskAnalysis>> | null = null;

  const baseCost = Math.max(100, effectivePricePerUnit * effectiveQuantity);

  const searchTerm = productName.slice(0, 25);
  const categoryTerm = category.slice(0, 25);
  const countryCode = originCountry !== "any suitable global sourcing location" ? getCountryCode(originCountry) : null;

  const [landedResult, suppliersResult, riskResult] = await Promise.allSettled([
    withTimeout(
      (async () => {
        const weightKg = isBulkCommodity ? quantity * 1000 : Math.max(1, quantity * 0.5);
        const volumeCbm = isBulkCommodity ? quantity * 0.5 : Math.max(0.1, quantity * 0.001);
        const input: LandedCostInput = {
          productName,
          hsCode,
          category,
          baseCost,
          incoterm: "FOB",
          quantity,
          currency: "USD",
          originCountry: originCode,
          destinationCountry: destCode,
          shippingMethod: "sea_fcl",
          containerType: "40ft",
          weight: weightKg,
          volume: volumeCbm,
        };
        return calculateLandedCost(input);
      })(),
      15000,
      "Landed cost"
    ),
    withTimeout(
      (async () => {
        const selectFields = {
          companyName: true,
          slug: true,
          country: true,
          city: true,
          industry: true,
          products: true,
          certifications: true,
          rating: true,
          minOrderValue: true,
          yearEstablished: true,
          contactEmail: true,
          contactPhone: true,
          website: true,
        } as const;
        const productFilter = {
          OR: [
            { products: { contains: searchTerm, mode: "insensitive" as const } },
            { industry: { contains: categoryTerm, mode: "insensitive" as const } },
            { companyName: { contains: searchTerm, mode: "insensitive" as const } },
          ] as const,
        };
        const trySearch = async (whereClause: Record<string, unknown> | null, filter?: Record<string, unknown>, limit = 15) => {
          const baseFilter = filter ?? productFilter;
          const fullWhere = whereClause ? { AND: [whereClause, baseFilter] } : baseFilter;
          return prisma.supplier.findMany({
            where: fullWhere,
            take: limit,
            orderBy: { rating: "desc" },
            select: selectFields,
          });
        };
        let where: Record<string, unknown> | null = null;
        if (countryCode && countryCode !== "XX" && countryCode !== "SKIP") {
          where = { countryCode: { equals: countryCode, mode: "insensitive" as const } };
        } else if (originCountry !== "any suitable global sourcing location") {
          where = { country: { contains: originCountry, mode: "insensitive" as const } };
        }
        const MIN_SUPPLIERS = 12;
        let results = await trySearch(where, undefined, MIN_SUPPLIERS);
        if (results.length < MIN_SUPPLIERS && where) {
          const more = await trySearch(null, undefined, MIN_SUPPLIERS);
          const seen = new Set(results.map((r) => r.companyName + "|" + r.country));
          for (const r of more) {
            if (seen.size >= MIN_SUPPLIERS) break;
            const key = r.companyName + "|" + r.country;
            if (!seen.has(key)) { seen.add(key); results = [...results, r]; }
          }
        }
        if (results.length === 0) {
          results = await trySearch(null, undefined, MIN_SUPPLIERS);
        }
        if (results.length === 0) {
          const broaderFilter = {
            OR: [
              { industry: { contains: categoryTerm.slice(0, 10), mode: "insensitive" as const } },
              { products: { contains: searchTerm.slice(0, 8), mode: "insensitive" as const } },
            ] as const,
          };
          results = await trySearch(null, broaderFilter, MIN_SUPPLIERS);
        }
        if (results.length === 0) {
          results = await prisma.supplier.findMany({
            take: MIN_SUPPLIERS,
            orderBy: { rating: "desc" },
            select: selectFields,
          });
        }
        return results;
      })(),
      15000,
      "Supplier search"
    ),
    withTimeout(
      generateRiskAnalysis({
        country: originCountry === "any suitable global sourcing location" ? "China" : originCountry,
        industry: category,
        products: productName,
      }),
      25000,
      "Risk analysis"
    ),
  ]);

  if (landedResult.status === "fulfilled") {
    landedCostData = landedCostResultToBreakdown(landedResult.value);
  } else {
    warnings.push(`Landed cost calculation failed: ${(landedResult.reason as Error)?.message || "Unknown error"}`);
  }

  if (suppliersResult.status === "fulfilled" && suppliersResult.value.length > 0) {
    realSuppliers = suppliersResult.value;
  } else {
    if (originCountry !== "any suitable global sourcing location") {
      warnings.push(`No suppliers found in ${originCountry}. Supplier directory may have limited coverage. Try "Any" for global results.`);
    } else {
      warnings.push("No matching suppliers found in database; report uses AI-generated supplier examples");
    }
  }

  if (riskResult.status === "fulfilled") {
    riskData = riskResult.value;
  } else {
    warnings.push(`Risk analysis failed: ${(riskResult.reason as Error)?.message || "Unknown error"}`);
  }

  // Build context for main LLM
  const structuredContext: string[] = [];
  if (mineralPurityUsed) {
    const product = MINERAL_PRODUCTS.find((m) => m.id === mineralPurityUsed!.productId);
    const purityLabel = product?.purities.find((p) => p.id === mineralPurityUsed!.purityId)?.label ?? mineralPurityUsed.purityId;
    structuredContext.push(`PRICING BASIS: ${product?.name ?? mineralPurityUsed.productId} at ${purityLabel} purity. Prices based on ${mineralPurityUsed.priceSource} reference (LME/Argus/SMM). Use these for landed cost and supplier comparison.`);
  }
  if (productFamilyUsed) {
    const family = PRODUCT_FAMILIES.find((f) => f.id === productFamilyUsed!.familyId);
    structuredContext.push(`PRICING BASIS: ${family?.name ?? productFamilyUsed.familyId}. Prices based on ${productFamilyUsed.referenceIndex} reference (LME/regional indices/mill lists). Use for landed cost and supplier comparison.`);
  }
  if (landedCostData) {
    structuredContext.push(`REAL LANDED COST (use these exact numbers): ${JSON.stringify(landedCostData)}`);
  }
  if (realSuppliers.length > 0) {
    structuredContext.push(`REAL SUPPLIERS from database (use these, add pricing/lead time estimates): ${JSON.stringify(realSuppliers.map(s => ({ name: s.companyName, location: `${s.city}, ${s.country}`, industry: s.industry, products: s.products, certifications: s.certifications, rating: s.rating, minOrderValue: s.minOrderValue, yearEstablished: s.yearEstablished })))}`);
  }
  if (riskData) {
    structuredContext.push(`REAL RISK ASSESSMENT (use this structure): overallRiskScore=${riskData.overallRiskScore}, riskLevel=${riskData.riskLevel}, summary=${riskData.summary}. Categories: ${JSON.stringify(riskData.categories?.map((c: { name: string; level: string; factors: string[] }) => ({ name: c.name, level: c.level, mitigation: c.factors?.[0] || "" })))}`);
  }

  const prompt = `You are a professional international trade and sourcing consultant with expertise in customs, tariffs, and global supply chains. Generate a comprehensive, data-rich sourcing report in JSON format that provides maximum actionable intelligence for procurers and sellers.

${structuredContext.length > 0 ? `IMPORTANT - Use the REAL DATA provided above. Do NOT invent different numbers for landed cost, suppliers, or risk. Use the exact values.\n\n` : ""}

Product: ${productName}
Category: ${category}
HS Code (use this): ${hsCode}
Origin Country: ${originCountry} (If 'any suitable global sourcing location' is specified, identify and recommend the top 3-5 most competitive global regions/countries for this specific product)
Destination Country: ${destinationCountry}
${budgetStr}
Quantity: ${formData.quantity} units
${formData.additionalRequirements ? `Additional Requirements: ${formData.additionalRequirements}` : ''}

Generate a detailed professional report with the following structure (return ONLY valid JSON):

{
  "executiveSummary": "3-4 sentence professional summary highlighting key findings, cost analysis, and recommended action. If origin was 'any', specify which regions were selected as most competitive.",
  "productClassification": {
    "hsCode": "6-digit HS code for this product (e.g., 8471.30)",
    "hsCodeDescription": "Official HS code description",
    "tariffChapter": "Chapter number and name",
    "productCategory": "Product category classification",
    "regulatoryRequirements": ["FDA approval", "CE marking", etc.]
  },
  "marketOverview": {
    "marketSize": "Specific global market size in USD (e.g. $45B in 2024)",
    "growthRate": "Annual growth rate with timeframe (e.g. 8.2% CAGR 2024-2030)",
    "keyTrends": ["5-6 specific trends: sustainability, nearshoring, automation, tariffs, demand shifts"],
    "majorExporters": ["Top 5 exporting countries with approximate share if known"],
    "majorImporters": ["Top 5 importing countries with approximate share if known"]
  },
  "customsAnalysis": {
    "originCountry": "${originCountry}",
    "destinationCountry": "${destinationCountry}",
    "tradeAgreements": ["Applicable trade agreements"],
    "customsFees": {
      "hsCode": "Full HS/HTS code (10 digits)",
      "hsCodeDescription": "Tariff description",
      "importDutyRate": "Duty rate percentage",
      "importDutyAmount": "Estimated duty amount based on quantity",
      "vatRate": "VAT/GST rate",
      "vatAmount": "Estimated VAT amount",
      "additionalDuties": [
        {"name": "Anti-dumping duty", "rate": "rate", "amount": "amount"},
        {"name": "Countervailing duty", "rate": "rate", "amount": "amount"}
      ],
      "totalCustomsFees": "Total customs fees"
    },
    "requiredDocuments": ["Commercial Invoice", "Packing List", "Bill of Lading", etc.],
    "complianceNotes": ["Important compliance requirements"]
  },
  "landedCostBreakdown": {
    "productCost": "FOB cost for total quantity",
    "freightCost": "Sea/Air freight cost",
    "insuranceCost": "Cargo insurance",
    "customsDuties": "Import duties total",
    "vatTaxes": "VAT/Sales tax",
    "handlingFees": "Terminal handling",
    "brokerageFees": "Customs broker fees",
    "portCharges": "Port and documentation fees",
    "inlandTransport": "Delivery to final destination",
    "totalLandedCost": "Total landed cost",
    "costPerUnit": "Landed cost per unit"
  },
  "sellerComparison": [
    {
      "sellerName": "Realistic supplier name",
      "platform": "Direct / B2B Marketplace",
      "location": "City, Country",
      "unitPrice": "$X.XX",
      "moq": "Minimum order quantity",
      "leadTime": "Production time",
      "rating": 4.5,
      "yearsInBusiness": 8,
      "certifications": ["ISO 9001", "CE"],
      "platformFees": "Platform transaction fees",
      "paymentTerms": "T/T, L/C, etc.",
      "shippingOptions": ["Sea freight", "Air freight"],
      "estimatedProfit": "Profit per unit if sold at retail",
      "profitMargin": "Gross margin percentage",
      "totalCostWithFees": "Total cost including all fees",
      "recommendation": "Why choose or avoid this seller"
    }
  ],
  "supplierAnalysis": {
    "topRegions": [
      {
        "region": "Specific region/country (e.g. Guangdong, China or Vietnam)",
        "advantages": ["3-4 concrete advantages: labor cost, specialization, infrastructure, trade agreements"],
        "considerations": ["2-3 considerations: lead time, quality variance, payment terms, logistics"],
        "avgPriceRange": "Specific price range per unit (e.g. $2.50 - $4.20)"
      }
    ],
    "recommendedSuppliers": [
      {
        "name": "Supplier name",
        "location": "City, Country",
        "strengths": ["Quality", "Price", "Experience"],
        "estimatedCost": "$X per unit",
        "moq": "500 units",
        "leadTime": "30-45 days",
        "certifications": ["ISO 9001", "BSCI"]
      }
    ]
  },
  "profitAnalysis": {
    "recommendedRetailPrice": "Suggested retail price",
    "estimatedProfit": "Profit per unit",
    "profitMargin": "Gross margin percentage",
    "breakEvenQuantity": "Units needed to break even",
    "platformFees": [
      {"platform": "Amazon FBA", "feeStructure": "Referral + fulfillment", "estimatedFees": "$X per unit"},
      {"platform": "Shopify", "feeStructure": "Transaction fees", "estimatedFees": "$X per unit"},
      {"platform": "eBay", "feeStructure": "Final value fee", "estimatedFees": "$X per unit"}
    ]
  },
  "costBreakdown": {
    "unitCost": "Manufacturing cost per unit",
    "toolingCost": "One-time tooling/mold cost",
    "shippingCost": "Shipping per unit",
    "totalEstimate": "Total project investment",
    "factors": ["Material costs", "Labor rates", "Exchange rates"]
  },
  "riskAssessment": {
    "overallRisk": "Low/Medium/High",
    "risks": [
      {"category": "Supply Chain", "level": "Medium", "mitigation": "Diversify suppliers"},
      {"category": "Quality Control", "level": "Low", "mitigation": "Third-party inspection"},
      {"category": "Currency", "level": "Medium", "mitigation": "Hedge with forward contracts"},
      {"category": "Regulatory", "level": "Low", "mitigation": "Obtain proper certifications"}
    ]
  },
  "timeline": {
    "sampling": "7-14 days",
    "tooling": "15-30 days",
    "production": "20-45 days",
    "shipping": "15-35 days",
    "customsClearance": "3-7 days",
    "total": "60-120 days"
  },
  "recommendations": [
    "Specific actionable recommendation 1",
    "Specific actionable recommendation 2",
    "Specific actionable recommendation 3"
  ],
  "nextSteps": [
    "Request samples from top 3 suppliers",
    "Verify certifications and compliance",
    "Negotiate payment terms and MOQ"
  ]
}

CRITICAL QUALITY REQUIREMENTS:
- Use correct spelling: "Experienced" (not Experient), "infrastructure" (not rastructure), "United Kingdom" (not Unite)
- Use realistic 6-digit HS codes for this exact product category
- Calculate customs duties based on current tariff rates for origin→destination
- Include 10-12 seller comparisons minimum (use all REAL SUPPLIERS provided; database has millions). Varied price points, MOQs, and lead times for comprehensive comparison
- topRegions: ALWAYS provide 3-5 regions when origin is "any"; include specific price ranges and trade-offs
- marketOverview: Include concrete market size, growth rate, and 5+ key trends
- All monetary values: use realistic numbers (e.g. $X.XX, $X,XXX)
- Be specific with percentages, lead times (days), and quantities
- recommendations and nextSteps: 5-7 actionable items each, be HIGHLY SPECIFIC and strategic. nextSteps should reference specific suppliers from sellerComparison when relevant (e.g. "Request samples from [top seller names]", "Draft outreach email to [supplier] for quote", "Verify certifications with [supplier name]")
- executiveSummary: Write 4-5 sentences. Include the key cost figure, best supplier recommendation, and one strategic insight
- riskAssessment: Include 5 risk categories minimum (Geopolitical, Financial Stability, Supply Chain, Regulatory/Trade, Quality/Reputation)
- Each risk mitigation should be a concrete actionable strategy, not generic advice
- sellerComparison: Include specific certifications, payment terms, and a clear recommendation for each seller
- profitAnalysis: Include realistic retail prices based on current market data
- timeline: Be specific with day ranges for each phase`;

  try {
    console.log(
      "Starting AI report generation for:",
      formData.productName || formData.category
    );

    const completion = await withRetry(
      () =>
        withTimeout(
          getOpenAIClient().chat.completions.create({
            model: "gpt-4o",
            messages: [
              {
                role: "system",
                content:
                  "You are an expert international trade consultant specializing in customs, tariffs, HS codes, and landed cost analysis. Provide accurate, professional, and actionable sourcing intelligence. Use realistic tariff rates and HS codes based on current trade regulations. Always return valid JSON.",
              },
              { role: "user", content: prompt },
            ],
            max_tokens: 8000,
          }),
          90000,
          "Main report LLM"
        ),
      { maxAttempts: 2, delayMs: 3000, label: "Main report LLM" }
    );

    const responseText = completion.choices[0]?.message?.content || "";
    console.log("AI response received, length:", responseText.length);

    if (!responseText || responseText.length < 100) {
      console.error("AI returned empty or too short response");
      throw new Error("AI returned insufficient data");
    }

    // Clean response - remove markdown if present
    let cleanJson = responseText.trim();
    if (cleanJson.includes("```json")) {
      cleanJson = cleanJson
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "");
    } else if (cleanJson.includes("```")) {
      cleanJson = cleanJson.replace(/```\n?/g, "");
    }

    // Find JSON object boundaries
    const startIndex = cleanJson.indexOf("{");
    const endIndex = cleanJson.lastIndexOf("}");
    if (startIndex !== -1 && endIndex !== -1) {
      cleanJson = cleanJson.substring(startIndex, endIndex + 1);
    }

    const report = JSON.parse(cleanJson) as GeneratedReport;

    // Validate that essential fields exist
    if (!report.executiveSummary || !report.productClassification) {
      console.error("AI response missing essential fields");
      throw new Error("AI response missing required data");
    }

    // Override with real data where available
    if (hsCode && report.productClassification) {
      report.productClassification.hsCode = hsCode;
      if (report.customsAnalysis?.customsFees) {
        report.customsAnalysis.customsFees.hsCode = hsCode;
      }
    }
    // Preserve user-selected origin country (LLM may return "Any" incorrectly)
    if (originCountry !== "any suitable global sourcing location" && report.customsAnalysis) {
      report.customsAnalysis.originCountry = originCountry;
    }
    if (landedCostData) {
      report.landedCostBreakdown = landedCostData;
    }
    if (realSuppliers.length > 0) {
      report.sellerComparison = realSuppliers.map((s: any) => ({
        sellerName: s.companyName,
        slug: s.slug,
        platform: "SmartSeek Directory",
        location: `${s.city}, ${s.country}`,
        unitPrice: s.minOrderValue ? `$${s.minOrderValue.toLocaleString()}` : "Contact for quote",
        moq: "Contact supplier",
        leadTime: "14-45 days",
        rating: typeof s.rating === "number" ? Math.round(s.rating * 10) / 10 : 4,
        yearsInBusiness: s.yearEstablished ? new Date().getFullYear() - s.yearEstablished : 5,
        certifications: s.certifications ? s.certifications.split(/[,;|]/).map((c: string) => c.trim()).filter(Boolean) : [],
        platformFees: "N/A",
        paymentTerms: "T/T, L/C",
        shippingOptions: ["Sea freight", "Air freight"],
        estimatedProfit: "Varies",
        profitMargin: "Varies",
        totalCostWithFees: "Contact for quote",
        recommendation: `Verified supplier in ${s.country}. ${s.industry} specialist.`,
        contactEmail: s.contactEmail || null,
        contactPhone: s.contactPhone || null,
        website: s.website || null,
      }));
      report.supplierAnalysis = report.supplierAnalysis || { topRegions: [], recommendedSuppliers: [] };
      report.supplierAnalysis.recommendedSuppliers = realSuppliers.map((s) => ({
        name: s.companyName,
        location: `${s.city}, ${s.country}`,
        strengths: [s.industry, s.certifications || "Various certifications"].filter(Boolean),
        estimatedCost: s.minOrderValue != null ? `$${s.minOrderValue.toLocaleString()} min` : "Contact for quote",
        moq: "Contact supplier",
        leadTime: "14-45 days",
        certifications: s.certifications ? s.certifications.split(/[,;|]/).map((c: string) => c.trim()).filter(Boolean) : [],
      }));
    }
    if (riskData) {
      report.riskAssessment = {
        overallRisk: riskData.riskLevel,
        risks: (riskData.categories || []).map((c: { name: string; level: string; factors?: string[] }) => ({
          category: c.name,
          level: c.level,
          mitigation: c.factors?.[0] || "Review supplier documentation",
        })),
      };
    }

    applyTypoFixes(report);

    report.metadata = {
      inputs: {
        productName,
        category,
        originCountry,
        destinationCountry,
        quantity,
        budget: formData.budget,
        ...(mineralPurityUsed && { mineralPurity: mineralPurityUsed }),
        ...(productFamilyUsed && { productFamily: productFamilyUsed }),
      },
      generatedAt: new Date().toISOString(),
      model: "gpt-4o",
      warnings,
    };

    console.log("Report generated successfully");
    return report;
  } catch (error) {
    console.error("Report generation failed, falling back to legacy flow:", error);
    return runLegacyFlow(formData);
  }
}

/** Fallback: single LLM call when integrated flow fails (DB, landed cost, etc.) */
async function runLegacyFlow(formData: ReportFormData): Promise<GeneratedReport> {
  const originCountry =
    formData.originCountry && formData.originCountry !== "Any"
      ? formData.originCountry
      : "any suitable global sourcing location";
  const destinationCountry = formData.destinationCountry || "United States";
  const budgetStr = formData.budget && !/^(competitive|any|flexible)$/i.test(formData.budget)
    ? `Target Budget: ${formData.budget} per unit`
    : "Target Budget: Competitive / flexible";

  const prompt = `You are a professional international trade and sourcing consultant. Generate a comprehensive sourcing report in JSON format.

Product: ${formData.productName || formData.category}
Category: ${formData.category}
Origin: ${originCountry}
Destination: ${destinationCountry}
${budgetStr}
Quantity: ${formData.quantity} units
${formData.additionalRequirements ? `Additional: ${formData.additionalRequirements}` : ""}

Return ONLY valid JSON with: executiveSummary, productClassification (hsCode, hsCodeDescription, tariffChapter, productCategory, regulatoryRequirements), marketOverview (marketSize, growthRate, keyTrends, majorExporters, majorImporters), customsAnalysis (originCountry, destinationCountry, tradeAgreements, customsFees, requiredDocuments, complianceNotes), landedCostBreakdown (productCost, freightCost, insuranceCost, customsDuties, vatTaxes, handlingFees, brokerageFees, portCharges, inlandTransport, totalLandedCost, costPerUnit), sellerComparison (array of 10-12 minimum with sellerName, platform, location, unitPrice, moq, leadTime, rating, yearsInBusiness, certifications, platformFees, paymentTerms, shippingOptions, estimatedProfit, profitMargin, totalCostWithFees, recommendation), supplierAnalysis (topRegions with at least 4-6 regions, recommendedSuppliers), profitAnalysis, costBreakdown, riskAssessment (overallRisk, risks), timeline, recommendations, nextSteps. nextSteps should reference specific supplier names from sellerComparison when actionable (e.g. outreach, samples, certifications).`;

  const completion = await getOpenAIClient().chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: "You are an expert international trade consultant. Return valid JSON only." },
      { role: "user", content: prompt },
    ],
    max_tokens: 8000,
  });

  const responseText = completion.choices[0]?.message?.content || "";
  if (!responseText || responseText.length < 100) {
    throw new Error("AI returned insufficient data");
  }

  let cleanJson = responseText.trim();
  if (cleanJson.includes("```")) {
    cleanJson = cleanJson.replace(/```json\n?/g, "").replace(/```\n?/g, "");
  }
  const start = cleanJson.indexOf("{");
  const end = cleanJson.lastIndexOf("}");
  if (start !== -1 && end !== -1) cleanJson = cleanJson.substring(start, end + 1);

  const report = JSON.parse(cleanJson) as GeneratedReport;
  if (!report.executiveSummary || !report.productClassification) {
    throw new Error("AI response missing required fields");
  }

  applyTypoFixes(report);

  report.metadata = {
    inputs: { productName: formData.productName, category: formData.category },
    generatedAt: new Date().toISOString(),
    model: "gpt-4o",
    warnings: ["Report used legacy flow (integrated data unavailable)"],
  };

  return report;
}
