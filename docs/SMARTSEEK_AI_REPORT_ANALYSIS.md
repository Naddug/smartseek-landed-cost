# SmartSeek AI Report Engine — Analysis & Improvement Plan

## 1. What SmartSeek AI Actually Uses Today

### Implemented Functions / Services / Endpoints

| Module | Name & Path | What It Does | Inputs | Outputs | Called by SmartSeek AI? |
|--------|-------------|--------------|--------|---------|-------------------------|
| **Report generation** | `generateSmartFinderReport()` in `server/services/reportGenerator.ts` | Single LLM call (GPT-4o) with a large prompt; returns full report JSON | `ReportFormData`: productName, category, targetRegion, budget, quantity, originCountry, destinationCountry, additionalRequirements | `GeneratedReport` (executiveSummary, productClassification, marketOverview, customsAnalysis, landedCostBreakdown, sellerComparison, supplierAnalysis, profitAnalysis, riskAssessment, timeline, recommendations, nextSteps) | **Yes** — sole report engine |
| **Image analysis** | `POST /api/analyze-image` in `server/routes.ts` | GPT-4o-mini vision: identifies product from image | `{ imageData: base64 }` | `{ productName, description, category, estimatedHsCode }` | **Yes** — used before report if user uploads image |
| **Landed cost** | `calculateLandedCost()` in `server/services/landedCost/orchestrator.ts` | Real calculation: base cost, freight, customs, insurance, inland transport | `LandedCostInput`: productName, hsCode, baseCost, quantity, originCountry, destinationCountry, shippingMethod, incoterm, etc. | `LandedCostResult`: structured breakdown with numbers | **No** |
| **Freight benchmarks** | `GET /api/freight/benchmark-rates` in `server/routes.ts` | Returns route-specific rates (sea 20/40ft, air/kg, LCL/CBM) | `origin`, `destination` query params | `{ sea20ft, sea40ft, airPerKg, lclPerCBM }` | **No** |
| **Risk Intelligence** | `generateRiskAnalysis()` in `server/services/riskIntelligence.ts` | LLM-based risk analysis (geopolitical, financial, supply chain, regulatory, quality) | `RiskAnalysisInput`: supplierName?, country, industry?, products? | JSON: overallRiskScore, riskLevel, categories, recommendations | **No** |
| **Compliance Check** | `generateComplianceCheck()` in `server/services/riskIntelligence.ts` | LLM-based compliance check | `ComplianceCheckInput`: supplierName, country, industry, targetMarkets?, products? | JSON: overallScore, certifications, etc. | **No** |
| **Supplier Discovery** | `GET /api/suppliers`, `GET /api/suppliers/:slug` in `server/routes.ts` | Prisma queries on `supplier` table (4.3M+ records) | `q`, `country`, `industry`, `verified`, `page`, `limit` | Paginated suppliers with companyName, country, industry, products, etc. | **No** |
| **Trade Data** | `client/src/pages/TradeData.tsx` | Static `REGION_DATA` (global, asia, europe, americas) — no API | None | Hardcoded metrics, charts, insights | **No** — no backend API |
| **Customs Calculator** | `client/src/pages/CustomsCalculator.tsx` | Client-side duty/VAT calculation | Form: hsCode, cifValue, quantity, origin, destination | Duty, VAT, total | **No** — standalone page |
| **Shipping Estimator** | `client/src/pages/ShippingEstimator.tsx` | Fetches `/api/freight/benchmark-rates` | origin, destination | Benchmark rates | **No** |
| **AI Agent** | `POST /api/ai-agent`, `POST /api/ai-agent/pipeline` | Lead search, prepare call/email, company research, pipeline | task, query, context | LLM response | **No** — separate feature |
| **PDF export** | Client-side in `SmartFinder.tsx` | `jsPDF` + manual layout from `report.reportData` | Report object | PDF file download | **Yes** — after report loads |
| **Credits** | `storage.getUserProfile()`, `storage.spendCredits()` in `server/routes.ts` | Check/deduct credits before report creation | userId | Profile or 402 | **Yes** — in `POST /api/reports` |

### Marketing-Only / Not Yet Implemented

- **Trade Data API** — Trade Data page uses static mock data; no backend API for real trade statistics.
- **HS code lookup/validation** — No dedicated service; LLM infers HS code in report.
- **Real supplier data in reports** — Report uses LLM-generated “sellers”; no query to `prisma.supplier`.

---

## 2. Current SmartSeek AI Report Pipeline

### Step-by-Step Flow

```
UI (SmartFinder.tsx)
  │
  ├─ [Optional] Image upload → POST /api/analyze-image
  │     → Returns productName, description, category, estimatedHsCode
  │     → Used as searchQuery for report
  │
  └─ User submits (product query + origin, destination, quantity, budget, additionalRequirements)
        │
        ▼
     POST /api/reports
        │
        ├─ getUserId(req) → 401 if not authenticated
        ├─ insertReportSchema.parse(req.body)
        ├─ storage.getUserProfile(userId) [fallback if table missing]
        ├─ Check credits: totalCredits >= 1 OR hasFreeTrial
        ├─ Deduct: storage.spendCredits(userId, 1, "Smart Finder Report") OR updateUserProfile(hasUsedFreeTrial)
        ├─ storage.createReport({ ...validatedData, userId, status: "generating" })
        ├─ Return 201 + report (with id) immediately
        │
        └─ Background: generateSmartFinderReport(formData)
              │
              ▼
           server/services/reportGenerator.ts
              │
              └─ Single LLM call: getOpenAIClient().chat.completions.create({
                    model: "gpt-4o",
                    messages: [
                      { role: "system", content: "You are an expert international trade consultant..." },
                      { role: "user", content: <massive prompt with formData> }
                    ],
                    max_tokens: 8000
                  })
              │
              └─ Parse JSON from response → GeneratedReport
              │
              └─ On success: storage.updateReport(report.id, { reportData, status: "completed" })
              └─ On error: storage.updateReport(report.id, { status: "failed", reportData: { error } })
```

### Data Sources (Current)

| Section | Source | Notes |
|---------|--------|-------|
| HS classification | LLM only | No HS lookup API |
| Market overview | LLM only | No Trade Data / UN Comtrade |
| Customs / duties / VAT | LLM only | No Customs Calculator, no tariff DB |
| Landed cost | LLM only | No `calculateLandedCost()` |
| Supplier list | LLM only | No `prisma.supplier` query |
| Profit analysis | LLM only | No structured model |
| Risk assessment | LLM only | No `generateRiskAnalysis()` |
| Timeline | LLM only | No Shipping Estimator / freight logic |
| PDF export | Client (SmartFinder) | jsPDF from `report.reportData` |
| Credits | `storage` | Check + deduct in `POST /api/reports` |

### LLM Call Details

- **Model:** `gpt-4o`
- **Location:** `server/services/reportGenerator.ts`, single `chat.completions.create` call
- **Prompt:** ~200 lines; asks for full JSON with all sections. Origin/destination passed as strings; no structured API calls.

---

## 3. Promised vs Delivered

| Section | Implemented Function? | How SmartSeek AI Gets It Now | Gaps / Problems |
|---------|------------------------|------------------------------|-----------------|
| Executive summary | None | LLM only | Acceptable; LLM can summarize |
| Product classification (HS code, chapter, category) | None | LLM only | No HS validation; can be wrong |
| Market overview | Trade Data exists (static) | LLM only; no real trade data | Should use Trade Data or external API |
| Customs analysis | `calculateCustoms()` in `server/services/landedCost/customsService.ts` | LLM only | Real customs logic exists but unused |
| Landed cost breakdown | `calculateLandedCost()` | LLM only | Real calculator exists; needs baseCost (FOB) |
| Supplier comparison | `GET /api/suppliers`, Prisma | LLM generates generic suppliers | 4.3M real suppliers unused |
| Profit analysis | None | LLM only | Could use simple margin model |
| Risk assessment | `generateRiskAnalysis()` | LLM only | Risk module exists but not integrated |
| Timeline | Freight/Shipping logic | LLM approximate | Could use freight lead times |
| PDF export | Client jsPDF | Used | Works |
| Credits | `storage` | Used | Works; clear errors when insufficient |

---

## 4. Proposed Improvements (Prioritized)

### P0 — Wire Existing Modules (High Impact, Low Effort)

1. **Landed cost**
   - In `generateSmartFinderReport`: (a) Get HS code from LLM first (or image analysis); (b) Estimate baseCost from LLM or a simple heuristic; (c) Call `calculateLandedCost()` with `LandedCostInput`; (d) Merge `LandedCostResult` into `landedCostBreakdown`.
   - Use `originCountry`, `destinationCountry`, `quantity`, `hsCode` from formData. Add defaults for `baseCost`, `shippingMethod`, `incoterm`.

2. **Supplier comparison**
   - After LLM returns HS code (or product category): query `prisma.supplier.findMany({ where: { industry: { contains: category } }, take: 5 })` (or similar).
   - Replace or augment LLM `sellerComparison` with real suppliers. LLM summarizes; data comes from DB.

3. **Risk assessment**
   - Call `generateRiskAnalysis({ country: originCountry, industry: productCategory, products: productName })`.
   - Merge result into `riskAssessment` (or use as primary source with LLM summary).

4. **Freight / timeline**
   - Call `GET /api/freight/benchmark-rates` (or equivalent) with origin/destination.
   - Use rates to estimate shipping cost and lead time. Feed into landed cost and timeline.

### P1 — Schema & Robustness

5. **Report schema**
   - Define a strict TypeScript/JSON schema for the report (e.g. Zod) with:
     - `executive_summary`, `product_classification`, `market_overview`, `customs_analysis`, `landed_cost_breakdown`, `supplier_comparison`, `profit_analysis`, `risk_assessment`, `timeline`, `metadata`.
   - Add `metadata: { inputs, timestamps, model, warnings: string[] }`.

6. **Error handling**
   - When a downstream call fails (landed cost, suppliers, risk): still return a valid report; add warnings to `metadata.warnings`.
   - Surface these in the UI (e.g. banner: “Some sections used estimates due to missing data”).

7. **Global trade**
   - Ensure all logic uses `originCountry`, `destinationCountry` from formData.
   - No hard-coded regions; support any origin–destination pair.

### P2 — Deeper Integration

8. **Customs**
   - Use `calculateCustoms(input, cifValue)` from `server/services/landedCost/customsService.ts` for duty/VAT when HS code and CIF value are available.
   - Replace or validate LLM customs section with this output.

9. **Trade Data**
   - If a Trade Data API is added later, use it for market overview (exporters, importers, trends).
   - LLM summarizes; numbers come from API.

10. **LLM role**
    - Use LLM for: interpretation, summaries, qualitative commentary, filling gaps.
    - Avoid LLM for: duties, freight, landed cost, supplier lists — use real services where possible.

---

## 5. Implementation Order

| Step | Action | Effort | Status |
|------|--------|--------|--------|
| 1 | Add `metadata` and `warnings` to report schema | Low | ✅ Done |
| 2 | Query real suppliers by industry/category; merge into report | Medium | ✅ Done |
| 3 | Call `generateRiskAnalysis()`; merge into risk section | Low | ✅ Done |
| 4 | Two-phase report: (1) LLM for HS + baseCost estimate; (2) `calculateLandedCost()`; merge | Medium | ✅ Done |
| 5 | Fetch freight benchmarks; use for timeline + cost | Low | Pending |
| 6 | Use `customsService` when CIF + HS available | Medium | Pending (via landed cost) |
| 7 | Add Zod schema and validation for report | Low | Pending |

---

## 6. Summary

- **Current pipeline:** UI → `POST /api/reports` → credits check → `generateSmartFinderReport()` (single LLM call) → store → client polls → PDF from client.
- **Gap:** Report is 100% LLM-generated. Landed cost, suppliers, risk, freight, and customs modules exist but are not used.
- **Direction:** Reuse `calculateLandedCost`, `prisma.supplier`, `generateRiskAnalysis`, and freight benchmarks. Use LLM for summaries and qualitative content. Add schema, metadata, and graceful degradation when services fail.
