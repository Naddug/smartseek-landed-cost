import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY || process.env.OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL || undefined,
});

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
  const prompt = `You are a global trade risk intelligence analyst. Analyze the following and return a JSON object with risk assessment.

Subject: ${input.supplierName ? `Supplier "${input.supplierName}" in` : ''} ${input.country}
Industry: ${input.industry || 'General manufacturing'}
Products: ${input.products || 'Not specified'}

Return ONLY a valid JSON object with this exact structure:
{
  "overallRiskScore": <number 0-100, 100=safest>,
  "riskLevel": "<Low|Medium|High|Critical>",
  "summary": "<2-3 sentence executive summary>",
  "categories": [
    {
      "name": "Geopolitical Risk",
      "score": <0-100>,
      "level": "<Low|Medium|High|Critical>",
      "factors": ["<factor1>", "<factor2>", "<factor3>"]
    },
    {
      "name": "Financial Stability",
      "score": <0-100>,
      "level": "<Low|Medium|High|Critical>",
      "factors": ["<factor1>", "<factor2>", "<factor3>"]
    },
    {
      "name": "Supply Chain Risk",
      "score": <0-100>,
      "level": "<Low|Medium|High|Critical>",
      "factors": ["<factor1>", "<factor2>", "<factor3>"]
    },
    {
      "name": "Regulatory & Trade Risk",
      "score": <0-100>,
      "level": "<Low|Medium|High|Critical>",
      "factors": ["<factor1>", "<factor2>", "<factor3>"]
    },
    {
      "name": "Quality & Reputation",
      "score": <0-100>,
      "level": "<Low|Medium|High|Critical>",
      "factors": ["<factor1>", "<factor2>", "<factor3>"]
    }
  ],
  "recommendations": ["<action1>", "<action2>", "<action3>"],
  "tradeRestrictions": ["<any known sanctions, tariffs, or trade barriers>"],
  "alternativeRegions": ["<region1>", "<region2>"]
}

Be specific and data-driven. Reference real geopolitical situations, trade policies, and industry conditions.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
    max_tokens: 2000,
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

Be specific about certifications relevant to the industry and target markets. Reference real regulations (REACH, RoHS, FDA, CE marking, etc).`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
    max_tokens: 2000,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error("Failed to generate compliance check");
  return JSON.parse(content);
}
