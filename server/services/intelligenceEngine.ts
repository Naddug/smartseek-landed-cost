/**
 * AI Intelligence Engine
 *
 * Combines company data, supplier profiles, and trade signals into a
 * structured intelligence brief with:
 *   - risk_score          (0-100, 100 = safest)
 *   - margin_estimate     (gross margin range %)
 *   - recommended_suppliers
 *   - cost_analysis       (landed cost breakdown + savings levers)
 *
 * Uses OpenAI GPT-4o for reasoning over structured inputs.
 * Reuses existing riskIntelligence + landedCost services where possible.
 */

import { getOpenAIClient } from "./openaiClient.js";
import { generateRiskAnalysis } from "./riskIntelligence.js";
import type { CompanyData } from "./companyService.js";
import type { TradeRecord } from "./tradeService.js";
import type { TechStackData } from "./techStackService.js";

// ─── Input types ──────────────────────────────────────────────────────────────

export interface SupplierProfile {
  name: string;
  domain?: string;
  country: string;
  industry?: string;
  employees?: number | null;
  certifications?: string[];
  annualRevenue?: string | null;
  foundedYear?: number | null;
  techStack?: string[];
  keywords?: string[];
  /** Unit price for the product being sourced (USD) */
  unitPrice?: number;
  moq?: number;
  leadTimeDays?: number;
  paymentTerms?: string;
}

export interface IntelligenceInput {
  /** The buying company requesting the analysis */
  company: CompanyData | {
    name: string;
    country: string;
    industry?: string | null;
    domain?: string;
  };
  /** One or more supplier candidates to evaluate */
  suppliers: SupplierProfile[];
  /** Trade data for the sourcing context (optional but improves output) */
  tradeData?: TradeRecord | {
    industry?: string | null;
    country?: string | null;
    topProducts?: string[];
    annualRevenue?: string | null;
    signals?: string[];
  };
  /** Product / commodity being sourced */
  product: {
    name: string;
    hsCode?: string;
    quantity?: number;
    unit?: string;
    targetUnitPrice?: number;
    destinationCountry?: string;
  };
  /** Tech stack of the buying company — used to detect integration fit */
  techStack?: TechStackData | { technologies: Array<{ name: string; category: string | null }> };
}

// ─── Output types ─────────────────────────────────────────────────────────────

export interface RiskBreakdown {
  category: string;
  score: number;        // 0-100
  level: "Low" | "Medium" | "High" | "Critical";
  factors: string[];
}

export interface SupplierRecommendation {
  rank: number;
  name: string;
  country: string;
  domain?: string;
  fitScore: number;           // 0-100
  riskScore: number;          // 0-100, higher = safer
  estimatedUnitPrice: number; // USD
  leadTimeDays: number;
  strengths: string[];
  risks: string[];
  recommendation: string;
}

export interface CostAnalysis {
  baseUnitCost: number;
  freightPerUnit: number;
  dutiesPerUnit: number;
  otherFeesPerUnit: number;
  totalLandedCostPerUnit: number;
  currency: "USD";
  savingsLevers: string[];
  benchmarkMarketPrice?: number;
  costVsBenchmark?: string; // e.g. "8% below market"
}

export interface MarginEstimate {
  low: number;    // %
  mid: number;    // %
  high: number;   // %
  assumptions: string[];
}

export interface IntelligenceReport {
  /** Overall sourcing risk score (0-100, 100 = safest) */
  risk_score: number;
  riskLevel: "Low" | "Medium" | "High" | "Critical";
  riskBreakdown: RiskBreakdown[];

  /** Gross margin range estimate for this sourcing decision */
  margin_estimate: MarginEstimate;

  /** Ranked supplier recommendations */
  recommended_suppliers: SupplierRecommendation[];

  /** Landed cost breakdown + optimisation levers */
  cost_analysis: CostAnalysis;

  /** Free-text executive summary */
  executiveSummary: string;

  /** Strategic action items */
  actionItems: string[];

  /** ISO timestamp */
  generatedAt: string;
}

// ─── Prompt builder ───────────────────────────────────────────────────────────

function buildPrompt(input: IntelligenceInput): string {
  const c = input.company;
  const p = input.product;
  const trade = input.tradeData;
  const techs = input.techStack?.technologies?.map(t => t.name).join(", ") || "unknown";

  const suppliersJson = JSON.stringify(
    input.suppliers.map((s, i) => ({
      id: i + 1,
      name: s.name,
      country: s.country,
      industry: s.industry,
      employees: s.employees,
      certifications: s.certifications,
      annualRevenue: s.annualRevenue,
      foundedYear: s.foundedYear,
      techStack: s.techStack,
      unitPrice: s.unitPrice,
      moq: s.moq,
      leadTimeDays: s.leadTimeDays,
      paymentTerms: s.paymentTerms,
    })),
    null, 2
  );

  return `You are a world-class supply chain intelligence analyst and procurement advisor.

## Buyer Profile
- Company: ${c.name ?? "Unknown"}
- Country: ${"country" in c ? c.country : "Unknown"}
- Industry: ${c.industry ?? "Not specified"}
- Domain: ${c.domain ?? "Not specified"}
- Tech stack: ${techs}

## Product Being Sourced
- Product: ${p.name}
- HS Code: ${p.hsCode ?? "Not specified"}
- Quantity: ${p.quantity ? `${p.quantity} ${p.unit ?? "units"}` : "Not specified"}
- Target unit price: ${p.targetUnitPrice ? `$${p.targetUnitPrice} USD` : "Not specified"}
- Destination: ${p.destinationCountry ?? "Not specified"}

## Supplier Candidates
${suppliersJson}

## Trade Context
${trade ? JSON.stringify({
  industry: trade.industry,
  country: trade.country,
  topProducts: trade.topProducts,
  annualRevenue: trade.annualRevenue,
  signals: trade.signals,
}, null, 2) : "No trade data available."}

---

Provide a comprehensive sourcing intelligence report. Return ONLY a valid JSON object with this exact structure:

{
  "risk_score": <integer 0-100, where 100 is the safest possible sourcing scenario>,
  "riskLevel": "<Low|Medium|High|Critical>",
  "riskBreakdown": [
    {
      "category": "<e.g. Geopolitical, Financial Stability, Supply Chain, Regulatory, Quality & Compliance, Currency, ESG>",
      "score": <0-100>,
      "level": "<Low|Medium|High|Critical>",
      "factors": ["<2-4 specific, data-grounded factors>"]
    }
  ],
  "margin_estimate": {
    "low": <number, pessimistic gross margin %>,
    "mid": <number, realistic gross margin %>,
    "high": <number, optimistic gross margin %>,
    "assumptions": ["<3-5 key assumptions driving the margin range>"]
  },
  "recommended_suppliers": [
    {
      "rank": <1-based integer>,
      "name": "<supplier name from input>",
      "country": "<country>",
      "domain": "<domain or null>",
      "fitScore": <0-100, overall fit for this buyer's needs>,
      "riskScore": <0-100, higher = safer>,
      "estimatedUnitPrice": <number, estimated USD unit price>,
      "leadTimeDays": <integer>,
      "strengths": ["<2-4 specific strengths>"],
      "risks": ["<2-3 specific risks>"],
      "recommendation": "<1-2 sentence concise recommendation>"
    }
  ],
  "cost_analysis": {
    "baseUnitCost": <number, USD>,
    "freightPerUnit": <number, USD>,
    "dutiesPerUnit": <number, USD — include tariffs, anti-dumping if applicable>,
    "otherFeesPerUnit": <number, USD — insurance, brokerage, inland transport>,
    "totalLandedCostPerUnit": <number, USD>,
    "currency": "USD",
    "savingsLevers": ["<3-5 specific, actionable ways to reduce cost>"],
    "benchmarkMarketPrice": <number or null, USD — market reference if known>,
    "costVsBenchmark": "<string or null, e.g. '12% below market average'>"
  },
  "executiveSummary": "<3-5 sentence executive summary covering overall risk, best supplier pick, estimated margins, and top recommendation>",
  "actionItems": ["<5-7 prioritised, concrete next steps for the procurement team>"]
}

REQUIREMENTS:
- All numbers must be realistic based on the supplied data and your knowledge of global trade.
- Rank suppliers in order of overall recommendation (rank 1 = best fit).
- Include ALL input suppliers in recommended_suppliers, ranked.
- If a supplier lacks data, note that in risks and estimate conservatively.
- Landed cost should factor in origin country tariff rates to the destination country.
- Margin estimate should reflect the buyer's industry and typical B2B gross margins.
- Be specific: reference real certifications (ISO 9001, CE, FDA), real trade agreements (CPTPP, USMCA), real tariff rates.`;
}

// ─── Core engine ──────────────────────────────────────────────────────────────

export async function runIntelligenceEngine(
  input: IntelligenceInput
): Promise<IntelligenceReport> {
  if (!input.suppliers || input.suppliers.length === 0) {
    throw new Error("At least one supplier is required");
  }

  const openai = getOpenAIClient();

  // Run GPT-4o and existing risk service in parallel
  const [aiResult, riskResult] = await Promise.allSettled([
    openai.chat.completions.create({
      model: "gpt-4o",
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: "You are a procurement intelligence AI. Return only valid JSON matching the requested schema.",
        },
        {
          role: "user",
          content: buildPrompt(input),
        },
      ],
    }),
    // Re-use existing risk service for primary supplier's country as a cross-check
    generateRiskAnalysis({
      supplierName: input.suppliers[0].name,
      country: input.suppliers[0].country,
      industry: input.suppliers[0].industry,
      products: input.product.name,
    }),
  ]);

  if (aiResult.status === "rejected") {
    throw new Error(`Intelligence engine failed: ${aiResult.reason}`);
  }

  const raw = aiResult.value.choices[0]?.message?.content ?? "{}";

  let parsed: Partial<IntelligenceReport>;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("AI returned invalid JSON");
  }

  // Blend existing risk service score with AI score if available
  if (riskResult.status === "fulfilled" && riskResult.value?.overallRiskScore != null) {
    const existingScore = riskResult.value.overallRiskScore as number;
    const aiScore = parsed.risk_score ?? existingScore;
    // Weighted average: 60% AI (full-context) + 40% existing service (country-level)
    parsed.risk_score = Math.round(aiScore * 0.6 + existingScore * 0.4);

    // Merge any risk categories the existing service found that AI didn't include
    if (Array.isArray(riskResult.value.categories) && Array.isArray(parsed.riskBreakdown)) {
      const existingCats = riskResult.value.categories as Array<{
        name: string; score: number; level: string; factors: string[];
      }>;
      const aiCatNames = new Set(parsed.riskBreakdown.map(c => c.category.toLowerCase()));
      for (const cat of existingCats) {
        if (!aiCatNames.has(cat.name.toLowerCase())) {
          parsed.riskBreakdown.push({
            category: cat.name,
            score: cat.score,
            level: cat.level as RiskBreakdown["level"],
            factors: cat.factors ?? [],
          });
        }
      }
    }
  }

  return {
    risk_score: parsed.risk_score ?? 50,
    riskLevel: parsed.riskLevel ?? deriveLevel(parsed.risk_score ?? 50),
    riskBreakdown: parsed.riskBreakdown ?? [],
    margin_estimate: parsed.margin_estimate ?? { low: 0, mid: 0, high: 0, assumptions: [] },
    recommended_suppliers: (parsed.recommended_suppliers ?? []).map((s, i) => ({
      rank: s.rank ?? i + 1,
      name: s.name ?? "",
      country: s.country ?? "",
      domain: s.domain ?? undefined,
      fitScore: s.fitScore ?? 50,
      riskScore: s.riskScore ?? 50,
      estimatedUnitPrice: s.estimatedUnitPrice ?? 0,
      leadTimeDays: s.leadTimeDays ?? 30,
      strengths: s.strengths ?? [],
      risks: s.risks ?? [],
      recommendation: s.recommendation ?? "",
    })),
    cost_analysis: {
      baseUnitCost: parsed.cost_analysis?.baseUnitCost ?? 0,
      freightPerUnit: parsed.cost_analysis?.freightPerUnit ?? 0,
      dutiesPerUnit: parsed.cost_analysis?.dutiesPerUnit ?? 0,
      otherFeesPerUnit: parsed.cost_analysis?.otherFeesPerUnit ?? 0,
      totalLandedCostPerUnit: parsed.cost_analysis?.totalLandedCostPerUnit ?? 0,
      currency: "USD",
      savingsLevers: parsed.cost_analysis?.savingsLevers ?? [],
      benchmarkMarketPrice: parsed.cost_analysis?.benchmarkMarketPrice ?? undefined,
      costVsBenchmark: parsed.cost_analysis?.costVsBenchmark ?? undefined,
    },
    executiveSummary: parsed.executiveSummary ?? "",
    actionItems: parsed.actionItems ?? [],
    generatedAt: new Date().toISOString(),
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function deriveLevel(score: number): IntelligenceReport["riskLevel"] {
  if (score >= 75) return "Low";
  if (score >= 50) return "Medium";
  if (score >= 25) return "High";
  return "Critical";
}

/**
 * Lightweight version — skips pgvector / trade data, uses only supplier list.
 * Useful for quick dashboard cards or API responses where latency matters.
 */
export async function quickRiskScore(
  supplierCountry: string,
  industry?: string
): Promise<{ risk_score: number; riskLevel: IntelligenceReport["riskLevel"] }> {
  const result = await generateRiskAnalysis({ country: supplierCountry, industry });
  const score = (result as { overallRiskScore?: number }).overallRiskScore ?? 50;
  return { risk_score: score, riskLevel: deriveLevel(score) };
}
