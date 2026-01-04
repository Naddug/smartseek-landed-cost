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
}

export async function generateSmartFinderReport(
  formData: ReportFormData
): Promise<GeneratedReport> {
  const originCountry = formData.originCountry && formData.originCountry !== "Any" ? formData.originCountry : "any suitable global sourcing location";
  const destinationCountry = formData.destinationCountry || "United States";
  
  const prompt = `You are a professional international trade and sourcing consultant with expertise in customs, tariffs, and global supply chains. Generate a comprehensive professional sourcing report in JSON format.

Product: ${formData.productName || formData.category}
Category: ${formData.category}
Origin Country: ${originCountry} (If 'any suitable global sourcing location' is specified, identify and recommend the top 3-5 most competitive global regions/countries for this specific product)
Destination Country: ${destinationCountry}
Target Budget: $${formData.budget} per unit
Quantity: ${formData.quantity} units
${formData.additionalRequirements ? `Requirements: ${formData.additionalRequirements}` : ''}

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
    "marketSize": "Global market size in USD",
    "growthRate": "Annual growth rate",
    "keyTrends": ["trend 1", "trend 2", "trend 3"],
    "majorExporters": ["country 1", "country 2"],
    "majorImporters": ["country 1", "country 2"]
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
        "region": "Region, Country",
        "advantages": ["Lower labor costs", "Specialized manufacturing"],
        "considerations": ["Longer lead times", "Communication barriers"],
        "avgPriceRange": "$X - $Y per unit"
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

IMPORTANT: 
- Use realistic HS codes for this product category
- Calculate realistic customs duties based on current tariff rates
- Include 4-5 seller comparisons with different price points
- Show actual profit calculations
- Be specific with all numbers and percentages`;

  try {
    console.log("Starting AI report generation for:", formData.productName || formData.category);
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1",
      messages: [
        {
          role: "system",
          content: "You are an expert international trade consultant specializing in customs, tariffs, HS codes, and landed cost analysis. Provide accurate, professional, and actionable sourcing intelligence. Use realistic tariff rates and HS codes based on current trade regulations. Always return valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_completion_tokens: 8000,
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
      cleanJson = cleanJson.replace(/```json\n?/g, "").replace(/```\n?/g, "");
    } else if (cleanJson.includes("```")) {
      cleanJson = cleanJson.replace(/```\n?/g, "");
    }
    
    // Find JSON object boundaries
    const startIndex = cleanJson.indexOf('{');
    const endIndex = cleanJson.lastIndexOf('}');
    if (startIndex !== -1 && endIndex !== -1) {
      cleanJson = cleanJson.substring(startIndex, endIndex + 1);
    }
    
    const report = JSON.parse(cleanJson) as GeneratedReport;
    
    // Validate that essential fields exist
    if (!report.executiveSummary || !report.productClassification) {
      console.error("AI response missing essential fields");
      throw new Error("AI response missing required data");
    }
    
    console.log("Report generated successfully");
    return report;
  } catch (error) {
    console.error("Error generating report:", error);
    throw new Error("Failed to generate report. Please try again.");
  }
}
