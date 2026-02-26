import { getOpenAIClient } from "./openaiClient";
import { calculateLandedCost } from "./landedCost/orchestrator";
import type { LandedCostInput, LandedCostResult } from "./landedCost/types";
import { generateRiskAnalysis } from "./riskIntelligence";
import { prisma } from "../../lib/prisma";
import { getCountryCode } from "../lib/countryCodes";

export interface ReportFormData {
  productName: string;
  category: string;
  targetRegion: string;
  budget: string;
  quantity: string;
  originCountry?: string;
  destinationCountry?: string;
  additionalRequirements?: string;
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

  // Phase 1: Quick LLM call for HS code + estimated FOB cost
  let hsCode = "";
  let estimatedFobPerUnit = 5;
  try {
    const miniRes = await getOpenAIClient().chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `Product: ${productName}. Category: ${category}. Quantity: ${quantity}. Return ONLY valid JSON: { "hsCode": "6-digit HS code (e.g. 8471.30)", "estimatedFobCostPerUnit": number }`,
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 150,
    });
    const mini = JSON.parse(miniRes.choices[0]?.message?.content || "{}");
    hsCode = mini.hsCode || "8471.30";
    estimatedFobPerUnit = typeof mini.estimatedFobCostPerUnit === "number" ? mini.estimatedFobCostPerUnit : 5;
  } catch (e) {
    warnings.push("Could not get HS code from AI; using default 8471.30");
    hsCode = "8471.30";
  }

  // Phase 2: Fetch real data in parallel
  let landedCostData: LandedCost | null = null;
  let realSuppliers: Array<{ companyName: string; country: string; city: string; industry: string; products: string; certifications: string | null; rating: number; minOrderValue: number | null; yearEstablished: number }> = [];
  let riskData: Awaited<ReturnType<typeof generateRiskAnalysis>> | null = null;

  const baseCost = Math.max(100, (Number(estimatedFobPerUnit) || 5) * quantity);

  const [landedResult, suppliersResult, riskResult] = await Promise.allSettled([
    (async () => {
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
        weight: Math.max(1, quantity * 0.5),
        volume: Math.max(0.1, quantity * 0.001),
      };
      return calculateLandedCost(input);
    })(),
    prisma.supplier.findMany({
      where: {
        OR: [
          { products: { contains: productName.slice(0, 30), mode: "insensitive" as const } },
          { industry: { contains: category.slice(0, 30), mode: "insensitive" as const } },
          { companyName: { contains: productName.slice(0, 20), mode: "insensitive" as const } },
        ],
      },
      take: 5,
      orderBy: { rating: "desc" },
      select: {
        companyName: true,
        country: true,
        city: true,
        industry: true,
        products: true,
        certifications: true,
        rating: true,
        minOrderValue: true,
        yearEstablished: true,
      },
    }),
    generateRiskAnalysis({
      country: originCountry === "any suitable global sourcing location" ? "China" : originCountry,
      industry: category,
      products: productName,
    }),
  ]);

  if (landedResult.status === "fulfilled") {
    landedCostData = landedCostResultToBreakdown(landedResult.value);
  } else {
    warnings.push(`Landed cost calculation failed: ${(landedResult.reason as Error)?.message || "Unknown error"}`);
  }

  if (suppliersResult.status === "fulfilled" && suppliersResult.value.length > 0) {
    realSuppliers = suppliersResult.value;
  } else {
    warnings.push("No matching suppliers found in database; report uses AI-generated supplier examples");
  }

  if (riskResult.status === "fulfilled") {
    riskData = riskResult.value;
  } else {
    warnings.push(`Risk analysis failed: ${(riskResult.reason as Error)?.message || "Unknown error"}`);
  }

  // Build context for main LLM
  const structuredContext: string[] = [];
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
      "platform": "Alibaba/Made-in-China/Direct",
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

IMPORTANT - Provide maximum value for procurers and sellers:
- Use realistic 6-digit HS codes for this exact product category
- Calculate customs duties based on current tariff rates for origin→destination
- Include 4-5 seller comparisons with varied price points, MOQs, and lead times
- topRegions: ALWAYS provide 3-5 regions when origin is "any"; include specific price ranges and trade-offs
- marketOverview: Include concrete market size, growth rate, and 5+ key trends
- All monetary values: use realistic numbers (e.g. $X.XX, $X,XXX)
- Be specific with percentages, lead times (days), and quantities
- recommendations and nextSteps: 4-5 actionable items each`;

  try {
    console.log(
      "Starting AI report generation for:",
      formData.productName || formData.category
    );

    const completion = await getOpenAIClient().chat.completions.create({
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
    });

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
    if (landedCostData) {
      report.landedCostBreakdown = landedCostData;
    }
    if (realSuppliers.length > 0) {
      report.sellerComparison = realSuppliers.map((s) => ({
        sellerName: s.companyName,
        platform: "SmartSeek Directory",
        location: `${s.city}, ${s.country}`,
        unitPrice: s.minOrderValue ? `$${s.minOrderValue.toLocaleString()}` : "Contact for quote",
        moq: "Contact supplier",
        leadTime: "14-45 days",
        rating: s.rating || 4,
        yearsInBusiness: s.yearEstablished ? new Date().getFullYear() - s.yearEstablished : 5,
        certifications: s.certifications ? s.certifications.split(/[,;|]/).map((c) => c.trim()).filter(Boolean) : [],
        platformFees: "N/A",
        paymentTerms: "T/T, L/C",
        shippingOptions: ["Sea freight", "Air freight"],
        estimatedProfit: "Varies",
        profitMargin: "Varies",
        totalCostWithFees: "Contact for quote",
        recommendation: `Verified supplier in ${s.country}. ${s.industry} specialist.`,
      }));
      report.supplierAnalysis = report.supplierAnalysis || { topRegions: [], recommendedSuppliers: [] };
      report.supplierAnalysis.recommendedSuppliers = realSuppliers.map((s) => ({
        name: s.companyName,
        location: `${s.city}, ${s.country}`,
        strengths: [s.industry, s.certifications || "Various certifications"].filter(Boolean),
        estimatedCost: s.minOrderValue != null ? `$${s.minOrderValue.toLocaleString()} min` : "Contact for quote",
        moq: "Contact supplier",
        leadTime: "14-45 days",
        certifications: s.certifications ? s.certifications.split(/[,;|]/).map((c) => c.trim()).filter(Boolean) : [],
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

    report.metadata = {
      inputs: { productName, category, originCountry, destinationCountry, quantity, budget: formData.budget },
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

Return ONLY valid JSON with: executiveSummary, productClassification (hsCode, hsCodeDescription, tariffChapter, productCategory, regulatoryRequirements), marketOverview (marketSize, growthRate, keyTrends, majorExporters, majorImporters), customsAnalysis (originCountry, destinationCountry, tradeAgreements, customsFees, requiredDocuments, complianceNotes), landedCostBreakdown (productCost, freightCost, insuranceCost, customsDuties, vatTaxes, handlingFees, brokerageFees, portCharges, inlandTransport, totalLandedCost, costPerUnit), sellerComparison (array of 4-5 with sellerName, platform, location, unitPrice, moq, leadTime, rating, yearsInBusiness, certifications, platformFees, paymentTerms, shippingOptions, estimatedProfit, profitMargin, totalCostWithFees, recommendation), supplierAnalysis (topRegions, recommendedSuppliers), profitAnalysis, costBreakdown, riskAssessment (overallRisk, risks), timeline, recommendations, nextSteps.`;

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

  report.metadata = {
    inputs: { productName: formData.productName, category: formData.category },
    generatedAt: new Date().toISOString(),
    model: "gpt-4o",
    warnings: ["Report used legacy flow (integrated data unavailable)"],
  };

  return report;
}
