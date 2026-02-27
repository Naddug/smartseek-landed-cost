import { getOpenAIClient } from "./openaiClient";

export interface RiskAnalysisInput {
  supplierName?: string;
  country: string;
  industry?: string;
  products?: string;
}

export interface ComplianceCheckInput {
  supplierName: string;
  country: string;
  industry: string;
  targetMarkets?: string[];
  products?: string;
}

export async function generateRiskAnalysis(input: RiskAnalysisInput) {
  const prompt = `You are a senior global trade risk intelligence analyst with access to the latest geopolitical, economic, and supply chain data. Provide a comprehensive, institutional-grade risk assessment.

Subject: ${input.supplierName ? `Supplier "${input.supplierName}" in` : ''} ${input.country}
Industry: ${input.industry || 'General manufacturing'}
Products: ${input.products || 'Not specified'}

Return ONLY a valid JSON object with this exact structure:
{
  "overallRiskScore": <number 0-100, 100=safest>,
  "riskLevel": "<Low|Medium|High|Critical>",
  "summary": "<4-5 sentence executive summary with specific data points, risk scores, and strategic recommendation>",
  "categories": [
    {
      "name": "Geopolitical Risk",
      "score": <0-100>,
      "level": "<Low|Medium|High|Critical>",
      "factors": ["<4-5 specific factors: reference real conflicts, elections, sanctions, diplomatic tensions, territorial disputes, political stability indices>"]
    },
    {
      "name": "Economic & Financial Stability",
      "score": <0-100>,
      "level": "<Low|Medium|High|Critical>",
      "factors": ["<4-5 factors: GDP growth, inflation rate, currency volatility, debt-to-GDP ratio, credit rating, foreign reserves>"]
    },
    {
      "name": "Supply Chain & Logistics",
      "score": <0-100>,
      "level": "<Low|Medium|High|Critical>",
      "factors": ["<4-5 factors: port congestion, shipping route disruptions, natural disaster exposure, infrastructure quality, lead time reliability>"]
    },
    {
      "name": "Regulatory & Trade Policy",
      "score": <0-100>,
      "level": "<Low|Medium|High|Critical>",
      "factors": ["<4-5 factors: tariff rates, anti-dumping duties, trade agreements, export controls, customs complexity, IP protection>"]
    },
    {
      "name": "Quality & Compliance",
      "score": <0-100>,
      "level": "<Low|Medium|High|Critical>",
      "factors": ["<4-5 factors: certification standards, inspection failure rates, environmental compliance, labor standards, product safety record>"]
    },
    {
      "name": "Currency & Payment Risk",
      "score": <0-100>,
      "level": "<Low|Medium|High|Critical>",
      "factors": ["<3-4 factors: exchange rate volatility, capital controls, payment default risk, banking system stability>"]
    },
    {
      "name": "Environmental & ESG",
      "score": <0-100>,
      "level": "<Low|Medium|High|Critical>",
      "factors": ["<3-4 factors: carbon border adjustments (CBAM), environmental regulations, ESG compliance requirements, sustainability reporting>"]
    }
  ],
  "recommendations": ["<5-7 specific, actionable recommendations with concrete steps>"],
  "tradeRestrictions": ["<list ALL known sanctions, tariffs, anti-dumping duties, export controls, and trade barriers affecting this country/industry>"],
  "alternativeRegions": ["<3-5 alternative regions with specific rationale, e.g. 'Vietnam: 15% lower labor costs, US tariff diversification, CPTPP member'>"]
}

CRITICAL REQUIREMENTS:
- Reference REAL data: specific tariff rates, actual trade agreements, real sanctions lists (OFAC, EU, UN)
- Include current events: ongoing trade disputes, recent policy changes, supply chain disruptions
- Provide specific numbers: GDP growth rates, inflation figures, currency depreciation percentages
- For each factor, be concrete — not "political instability" but "ongoing territorial dispute in South China Sea affecting shipping lanes"
- Recommendations must be actionable: "Hedge CNY exposure with 90-day forward contracts" not "consider currency hedging"
- Trade restrictions must reference specific regulations: "Section 301 tariffs at 25% on List 3 goods" not "US tariffs apply"`;


  const response = await getOpenAIClient().chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
    max_tokens: 3000,
    temperature: 0.3,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error("Failed to generate risk analysis");

  return JSON.parse(content);
}

export async function generateComplianceCheck(input: ComplianceCheckInput) {
  const prompt = `You are a global trade compliance expert. Perform a compliance check and return a JSON object.

Supplier: ${input.supplierName}
Country: ${input.country}
Industry: ${input.industry}
Target Markets: ${input.targetMarkets?.join(", ") || "USA, EU"}
Products: ${input.products || "Not specified"}

Return ONLY a valid JSON object with this exact structure:
{
  "overallScore": <number 0-100, 100=fully compliant>,
  "complianceLevel": "<Fully Compliant|Mostly Compliant|Partially Compliant|Non-Compliant>",
  "summary": "<2-3 sentence summary>",
  "certifications": [
    {
      "name": "<cert name e.g. ISO 9001:2015>",
      "status": "<Verified|Likely|Unverified|Missing>",
      "required": <true|false>,
      "notes": "<brief note>"
    }
  ],
  "regulatoryChecks": [
    {
      "regulation": "<regulation name>",
      "status": "<Pass|Warning|Fail|Unknown>",
      "description": "<what this regulation covers>",
      "action": "<recommended action if any>"
    }
  ],
  "sanctionsScreening": {
    "status": "<Clear|Flagged|Blocked>",
    "details": "<explanation>"
  },
  "recommendations": ["<action1>", "<action2>", "<action3>"],
  "requiredDocuments": ["<doc1>", "<doc2>", "<doc3>"]
}

CRITICAL REQUIREMENTS FOR ACCURACY:
- Certifications: List ALL certifications required for this specific industry AND target markets. Include ISO standards, industry-specific certs (e.g. FDA 21 CFR for food/medical, CE marking for EU, UL for US electrical, IATF 16949 for automotive)
- Regulatory checks: Reference EXACT regulation names and numbers (REACH Regulation EC 1907/2006, RoHS Directive 2011/65/EU, CPSIA for children's products, TSCA for chemicals, etc.)
- For EU target: Include CBAM, REACH, RoHS, CE marking, WEEE, ERP Directive requirements
- For US target: Include CPSC, FDA, FCC, EPA, TSCA, Lacey Act requirements as applicable
- Sanctions screening: Check against OFAC SDN list, EU Consolidated list, UN Security Council sanctions, BIS Entity List
- Required documents: List EXACT document names (Certificate of Origin Form A, Commercial Invoice, Bill of Lading, Packing List, Insurance Certificate, Phytosanitary Certificate if applicable)
- Recommendations: Provide 5-7 specific, actionable steps with document names and regulatory references
- Be precise about which certifications are legally REQUIRED vs. recommended for market access`;


  const response = await getOpenAIClient().chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
    max_tokens: 3000,
    temperature: 0.2,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error("Failed to generate compliance check");

  return JSON.parse(content);
}
