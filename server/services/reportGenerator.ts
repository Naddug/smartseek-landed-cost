import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export interface ReportFormData {
  productName: string;
  category: string;
  targetRegion: string;
  budget: string;
  quantity: string;
  additionalRequirements?: string;
}

export interface GeneratedReport {
  executiveSummary: string;
  marketOverview: {
    marketSize: string;
    growthRate: string;
    keyTrends: string[];
  };
  supplierAnalysis: {
    topRegions: Array<{
      region: string;
      advantages: string[];
      considerations: string[];
    }>;
    recommendedSuppliers: Array<{
      name: string;
      location: string;
      strengths: string[];
      estimatedCost: string;
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
    total: string;
  };
  recommendations: string[];
  nextSteps: string[];
}

export async function generateSmartFinderReport(
  formData: ReportFormData
): Promise<GeneratedReport> {
  const prompt = `You are a professional sourcing consultant. Generate a comprehensive sourcing analysis report in JSON format for the following product:

Product: ${formData.productName}
Category: ${formData.category}
Target Region: ${formData.targetRegion}
Budget: ${formData.budget}
Quantity: ${formData.quantity}
${formData.additionalRequirements ? `Additional Requirements: ${formData.additionalRequirements}` : ''}

Generate a detailed report with the following structure (return ONLY valid JSON, no markdown):

{
  "executiveSummary": "2-3 sentence high-level summary of the sourcing opportunity and key findings",
  "marketOverview": {
    "marketSize": "Current market size estimate",
    "growthRate": "Annual growth rate percentage",
    "keyTrends": ["trend 1", "trend 2", "trend 3"]
  },
  "supplierAnalysis": {
    "topRegions": [
      {
        "region": "Region name",
        "advantages": ["advantage 1", "advantage 2"],
        "considerations": ["consideration 1", "consideration 2"]
      }
    ],
    "recommendedSuppliers": [
      {
        "name": "Realistic supplier name",
        "location": "City, Country",
        "strengths": ["strength 1", "strength 2"],
        "estimatedCost": "Cost range"
      }
    ]
  },
  "costBreakdown": {
    "unitCost": "Cost per unit range",
    "toolingCost": "One-time tooling cost",
    "shippingCost": "Estimated shipping cost",
    "totalEstimate": "Total project cost",
    "factors": ["factor 1", "factor 2", "factor 3"]
  },
  "riskAssessment": {
    "overallRisk": "Low/Medium/High",
    "risks": [
      {
        "category": "Risk category",
        "level": "Low/Medium/High",
        "mitigation": "How to mitigate this risk"
      }
    ]
  },
  "timeline": {
    "sampling": "Timeframe",
    "tooling": "Timeframe",
    "production": "Timeframe",
    "shipping": "Timeframe",
    "total": "Total timeframe"
  },
  "recommendations": ["recommendation 1", "recommendation 2", "recommendation 3"],
  "nextSteps": ["step 1", "step 2", "step 3"]
}

Be specific, professional, and realistic. Include 3-5 recommended suppliers, 3-5 risks, and 3-5 recommendations.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-5.1",
      messages: [
        {
          role: "system",
          content: "You are a professional sourcing consultant with expertise in global supply chains, manufacturing, and procurement. Provide detailed, accurate, and actionable insights."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_completion_tokens: 3000,
    });

    const responseText = completion.choices[0]?.message?.content || "{}";
    
    // Parse JSON response
    const report = JSON.parse(responseText) as GeneratedReport;
    return report;
  } catch (error) {
    console.error("Error generating report:", error);
    throw new Error("Failed to generate report. Please try again.");
  }
}
