# V1 Module Mapping: SmartSeek Architecture Analysis

## Overview
This document maps V1 product modules to the existing SmartSeek codebase, identifying what's ready, what needs extension, and what must not be touched.

---

## MODULE 1: Executive Intelligence Dashboard (LIMITED)

### [READY] Existing Backend Support

**Data Layer:**
- `server/storage.ts` - `getUserReports()`, `getCreditTransactions()`
- `shared/schema.ts` - `reports` table with `reportData` JSONB field
- `shared/schema.ts` - `creditTransactions` table for activity tracking

**API Routes:**
- `GET /api/reports` - Returns user's reports with status
- `GET /api/profile` - Returns user profile (credits, plan, region)
- `GET /api/credits/transactions` - Returns credit activity history

**Report Data Structure:**
- `server/services/reportGenerator.ts` - `GeneratedReport` interface contains:
  - `executiveSummary` (string)
  - `marketOverview` (market size, growth, trends)
  - `profitAnalysis` (profit margins, break-even)
  - `riskAssessment` (overall risk, mitigation)

### [EXTEND] Required Extensions

**New Aggregation Endpoints:**
- `GET /api/dashboard/metrics` - Aggregate KPIs across all reports
  - Total reports generated
  - Average cost savings
  - Top sourcing regions
  - Risk distribution
  - Credit usage trends
  
**New Analytics Queries:**
- Aggregate `reportData` JSONB fields across reports
- Calculate trends from `createdAt` timestamps
- Extract supplier regions from `supplierAnalysis.topRegions`
- Extract cost data from `landedCostBreakdown`
- Extract profit margins from `profitAnalysis`

**Data Layer Extensions:**
- Add helper functions in `server/storage.ts`:
  - `getAggregatedMetrics(userId, dateRange)`
  - `getTrendData(userId, metric, period)`
  - `getTopRegions(userId)`
  - `getRiskDistribution(userId)`

**Frontend Extensions:**
- Extend `client/src/pages/Dashboard.tsx`:
  - Add executive summary widget
  - Add trend charts (cost savings over time)
  - Add region distribution visualization
  - Add risk heatmap
  - Add cost breakdown aggregation

### [DO NOT TOUCH]

- `server/storage.ts` - Core storage methods (extend, don't modify)
- `shared/schema.ts` - Database schema (add indexes, don't change structure)
- `server/routes.ts` - Existing report routes (add new routes, don't modify)
- Credit system (`server/storage.ts` credit methods) - Critical for billing

### [RISK] Architectural Risks

**Performance Risk:**
- Aggregating JSONB fields across many reports = slow queries
- **Mitigation**: Add database indexes on `reportData` JSONB paths, cache aggregated metrics

**Data Quality Risk:**
- Reports have inconsistent structure (some missing fields)
- **Mitigation**: Validate report structure before aggregation, handle missing fields gracefully

**Scalability Risk:**
- Dashboard loads all reports to calculate metrics
- **Mitigation**: Paginate reports, pre-calculate metrics in background job

**Complexity Risk:**
- JSONB aggregation queries are complex and error-prone
- **Mitigation**: Use PostgreSQL JSONB functions carefully, add comprehensive error handling

---

## MODULE 2: Supplier Intelligence Matrix (FULL core feature)

### [READY] Existing Backend Support

**Data Layer:**
- `shared/schema.ts` - `supplierShortlists` table (admin-curated)
- `server/storage.ts` - Full CRUD for supplier shortlists:
  - `getAllSupplierShortlists()`
  - `getSupplierShortlist(id)`
  - `getSupplierShortlistsByCategory(category)`
  - `createSupplierShortlist()`, `updateSupplierShortlist()`, `deleteSupplierShortlist()`

**Report Data Structure:**
- `server/services/reportGenerator.ts` - `GeneratedReport` contains:
  - `sellerComparison[]` - Array with supplier details:
    - sellerName, platform, location, unitPrice, moq, leadTime
    - rating, yearsInBusiness, certifications
    - platformFees, paymentTerms, shippingOptions
    - estimatedProfit, profitMargin, recommendation
  - `supplierAnalysis.recommendedSuppliers[]` - Additional supplier data

**API Routes:**
- `GET /api/shortlists` - Get all shortlists (public)
- `GET /api/shortlists/:id` - Get specific shortlist (requires monthly plan)
- `POST /api/admin/shortlists` - Admin create
- `PATCH /api/admin/shortlists/:id` - Admin update
- `DELETE /api/admin/shortlists/:id` - Admin delete

**Report Routes:**
- `GET /api/reports/:id` - Returns report with supplier data in `reportData`

### [EXTEND] Required Extensions

**New Supplier Comparison Endpoints:**
- `POST /api/suppliers/compare` - Compare multiple suppliers side-by-side
  - Input: Array of supplier IDs or report IDs
  - Output: Normalized comparison matrix
  
- `GET /api/suppliers/:id/details` - Get detailed supplier profile
  - Extract from reports or shortlists
  - Aggregate data across multiple reports
  
- `POST /api/suppliers/evaluate` - Score suppliers based on criteria
  - Input: Supplier data + evaluation criteria
  - Output: Scored suppliers with ranking

**New Data Structures:**
- Add `supplierEvaluations` table to `shared/schema.ts`:
  - userId, supplierId, criteria (JSONB), scores (JSONB), notes
  - Store user-specific supplier evaluations
  
- Add `supplierFavorites` table:
  - userId, supplierId, source (report/shortlist), notes
  - Allow users to bookmark suppliers

**Matrix View Logic:**
- Create `server/services/supplierMatrix.ts`:
  - `normalizeSupplierData()` - Standardize supplier fields from different sources
  - `compareSuppliers()` - Side-by-side comparison
  - `scoreSuppliers()` - Multi-criteria scoring
  - `rankSuppliers()` - Ranking algorithm

**Frontend Extensions:**
- Create `client/src/pages/SupplierMatrix.tsx`:
  - Table/grid view of suppliers
  - Filtering (region, price range, certifications)
  - Sorting (price, rating, lead time)
  - Comparison mode (select 2-4 suppliers)
  - Export to CSV/PDF

**Data Layer Extensions:**
- Extend `server/storage.ts`:
  - `getSupplierFromReport(reportId, supplierIndex)`
  - `getUserSupplierEvaluations(userId)`
  - `saveSupplierEvaluation(userId, supplierData, evaluation)`
  - `getUserFavoriteSuppliers(userId)`
  - `addFavoriteSupplier(userId, supplierData)`

### [DO NOT TOUCH]

- `server/storage.ts` - Existing shortlist methods (extend, don't modify)
- `shared/schema.ts` - `supplierShortlists` table structure (add new tables, don't change)
- `server/routes.ts` - Existing shortlist routes (add new routes, don't modify)
- `server/services/reportGenerator.ts` - Report generation logic (read data, don't change generation)

### [RISK] Architectural Risks

**Data Consistency Risk:**
- Supplier data exists in multiple places (reports JSONB, shortlists JSONB)
- **Mitigation**: Create normalization layer, use consistent supplier schema

**Performance Risk:**
- Comparing suppliers requires parsing JSONB from multiple reports
- **Mitigation**: Index JSONB paths, cache parsed supplier data, consider materialized views

**Data Quality Risk:**
- Supplier data in reports is AI-generated (may be inconsistent)
- **Mitigation**: Validate supplier data structure, handle missing fields

**Scalability Risk:**
- Matrix view loading many suppliers = slow
- **Mitigation**: Paginate suppliers, lazy load details, virtual scrolling

**Complexity Risk:**
- Supplier comparison logic is complex (multiple criteria, weighting)
- **Mitigation**: Start simple (price, rating, lead time), iterate based on feedback

---

## MODULE 3: Landed Cost Analyzer (FULL core feature)

### [READY] Existing Backend Support

**Data Layer:**
- `shared/schema.ts` - `customsCalculations` table
- `shared/schema.ts` - `shippingEstimates` table
- `server/storage.ts` - CRUD for both:
  - `createCustomsCalculation()`, `getUserCustomsCalculations()`
  - `createShippingEstimate()`, `getUserShippingEstimates()`

**Report Data Structure:**
- `server/services/reportGenerator.ts` - `GeneratedReport` contains:
  - `customsAnalysis.customsFees` - Complete customs breakdown:
    - hsCode, importDutyRate, importDutyAmount
    - vatRate, vatAmount
    - additionalDuties[], totalCustomsFees
  - `landedCostBreakdown` - Complete cost breakdown:
    - productCost, freightCost, insuranceCost
    - customsDuties, vatTaxes, handlingFees
    - brokerageFees, portCharges, inlandTransport
    - totalLandedCost, costPerUnit

**API Routes:**
- `POST /api/calculations/customs` - Save customs calculation
- `GET /api/calculations/customs` - Get user's customs calculations
- `GET /api/calculations/customs/:id` - Get specific calculation
- `POST /api/calculations/shipping` - Save shipping estimate
- `GET /api/calculations/shipping` - Get user's shipping estimates
- `GET /api/calculations/shipping/:id` - Get specific estimate

**Frontend Components:**
- `client/src/pages/CustomsCalculator.tsx` - Full customs calculator UI
- `client/src/pages/ShippingEstimator.tsx` - Full shipping estimator UI

### [EXTEND] Required Extensions

**Unified Landed Cost Endpoint:**
- `POST /api/calculations/landed-cost` - Combined analyzer
  - Input: Product details, origin, destination, shipping method
  - Output: Complete landed cost breakdown
  - Logic: Combine customs + shipping calculations
  
- `GET /api/calculations/landed-cost/:id` - Get saved landed cost analysis
- `GET /api/calculations/landed-cost` - List user's landed cost analyses

**Enhanced Calculation Logic:**
- Create `server/services/landedCostService.ts`:
  - `calculateCustomsDuties()` - Extract from existing logic
  - `calculateShippingCosts()` - Extract from existing logic
  - `calculateInsurance()` - Add insurance calculation
  - `calculateTotalLandedCost()` - Combine all components
  - `calculateCostPerUnit()` - Unit cost calculation
  - `compareScenarios()` - Compare multiple scenarios

**New Data Structure:**
- Add `landedCostAnalyses` table to `shared/schema.ts`:
  - userId, productName, originCountry, destinationCountry
  - productCost, quantity, shippingMethod
  - result (JSONB) - Complete breakdown
  - createdAt, updatedAt

**Scenario Comparison:**
- `POST /api/calculations/compare-scenarios` - Compare multiple scenarios
  - Input: Array of scenario parameters
  - Output: Side-by-side comparison
  - Use cases: Different suppliers, shipping methods, quantities

**Integration with Reports:**
- Extract landed cost from reports:
  - `GET /api/reports/:id/landed-cost` - Get landed cost from report
  - Allow users to save report's landed cost as standalone calculation

**Frontend Extensions:**
- Create `client/src/pages/LandedCostAnalyzer.tsx`:
  - Unified form (combines customs + shipping inputs)
  - Step-by-step wizard (product → shipping → customs → summary)
  - Scenario comparison view
  - Export to PDF/Excel
  - Save/load scenarios

**Data Layer Extensions:**
- Extend `server/storage.ts`:
  - `createLandedCostAnalysis()`
  - `getUserLandedCostAnalyses()`
  - `getLandedCostAnalysis(id)`
  - `compareLandedCostScenarios(scenarios)`

### [DO NOT TOUCH]

- `server/storage.ts` - Existing calculation methods (extend, don't modify)
- `shared/schema.ts` - `customsCalculations` and `shippingEstimates` tables (add new table, don't change)
- `client/src/pages/CustomsCalculator.tsx` - Existing calculator (can reuse components, don't break)
- `client/src/pages/ShippingEstimator.tsx` - Existing estimator (can reuse components, don't break)
- `server/services/reportGenerator.ts` - Report generation (read landed cost data, don't change generation)

### [RISK] Architectural Risks

**Calculation Accuracy Risk:**
- Customs duties depend on HS codes (may be incorrect)
- Shipping costs are estimates (not real-time quotes)
- **Mitigation**: Clearly label as estimates, add disclaimers, validate HS codes

**Data Duplication Risk:**
- Landed cost exists in reports AND separate calculations
- **Mitigation**: Use shared calculation service, sync when possible

**Performance Risk:**
- Complex calculations with multiple API calls (customs + shipping)
- **Mitigation**: Cache common calculations, optimize queries, use background jobs for heavy calculations

**Integration Risk:**
- Combining customs + shipping requires careful data flow
- **Mitigation**: Use well-defined interfaces, test edge cases

**Currency Risk:**
- Costs in different currencies need conversion
- **Mitigation**: Use currency conversion API, store base currency, convert on display

---

## MODULE 4: Profit & Loss Scenario Planner (LIMITED)

### [READY] Existing Backend Support

**Report Data Structure:**
- `server/services/reportGenerator.ts` - `GeneratedReport` contains:
  - `profitAnalysis` - Basic profit calculations:
    - recommendedRetailPrice
    - estimatedProfit
    - profitMargin
    - breakEvenQuantity
    - platformFees[] - Platform fee structures
  - `landedCostBreakdown` - Cost inputs for profit calculation
  - `sellerComparison[]` - Supplier costs for comparison

**Data Layer:**
- `shared/schema.ts` - `reports` table stores profit analysis in `reportData` JSONB
- `server/storage.ts` - Can retrieve reports with profit data

**Frontend:**
- `client/src/pages/Dashboard.tsx` - Shows basic profit metrics
- Report display pages show profit analysis sections

### [EXTEND] Required Extensions

**Scenario Management Endpoints:**
- `POST /api/scenarios` - Create new P&L scenario
  - Input: Product details, costs, pricing, assumptions
  - Output: Scenario with calculated P&L
  
- `GET /api/scenarios` - List user's scenarios
- `GET /api/scenarios/:id` - Get specific scenario
- `PATCH /api/scenarios/:id` - Update scenario
- `DELETE /api/scenarios/:id` - Delete scenario
- `POST /api/scenarios/:id/duplicate` - Clone scenario

**Scenario Comparison:**
- `POST /api/scenarios/compare` - Compare multiple scenarios
  - Input: Array of scenario IDs
  - Output: Side-by-side comparison with variance analysis

**What-If Analysis:**
- `POST /api/scenarios/:id/what-if` - Run what-if calculations
  - Input: Variable changes (price, quantity, costs)
  - Output: Updated P&L projections

**New Data Structure:**
- Add `profitLossScenarios` table to `shared/schema.ts`:
  - userId, title, description
  - productDetails (JSONB)
  - costAssumptions (JSONB) - Landed cost, overhead, etc.
  - pricingAssumptions (JSONB) - Retail price, discounts, etc.
  - marketAssumptions (JSONB) - Volume, growth, competition
  - results (JSONB) - Calculated P&L, break-even, margins
  - createdAt, updatedAt

**Calculation Service:**
- Create `server/services/profitLossService.ts`:
  - `calculateProfitLoss()` - Core P&L calculation
  - `calculateBreakEven()` - Break-even analysis
  - `calculateMargins()` - Gross/net margin calculations
  - `projectScenarios()` - Multi-scenario projection
  - `compareScenarios()` - Variance analysis

**Frontend Extensions:**
- Create `client/src/pages/ProfitLossPlanner.tsx`:
  - Scenario builder form
  - What-if sliders (price, quantity, costs)
  - P&L statement visualization
  - Break-even chart
  - Scenario comparison table
  - Export to Excel/PDF

**Integration Points:**
- Link to Landed Cost Analyzer (import costs)
- Link to Supplier Matrix (import supplier costs)
- Link to Reports (import profit data from reports)

**Data Layer Extensions:**
- Extend `server/storage.ts`:
  - `createProfitLossScenario()`
  - `getUserProfitLossScenarios()`
  - `getProfitLossScenario(id)`
  - `updateProfitLossScenario(id, data)`
  - `deleteProfitLossScenario(id)`
  - `compareProfitLossScenarios(scenarioIds)`

### [DO NOT TOUCH]

- `server/services/reportGenerator.ts` - Report generation (read profit data, don't change)
- `shared/schema.ts` - `reports` table (add new table, don't modify)
- `server/storage.ts` - Existing report methods (extend, don't modify)
- Credit system - Don't change credit costs for scenarios

### [RISK] Architectural Risks

**Calculation Complexity Risk:**
- P&L calculations involve many variables (costs, pricing, volume, overhead)
- **Mitigation**: Start with simple model (revenue - costs), iterate based on feedback

**Data Accuracy Risk:**
- Scenarios depend on assumptions (may be inaccurate)
- **Mitigation**: Clearly label as projections, add confidence intervals, allow user notes

**Performance Risk:**
- Comparing multiple scenarios = multiple calculations
- **Mitigation**: Cache calculations, use background jobs for complex scenarios

**Integration Risk:**
- Need to integrate with Landed Cost Analyzer and Supplier Matrix
- **Mitigation**: Use shared data structures, create clear APIs between modules

**User Experience Risk:**
- Scenario planning can be overwhelming (too many inputs)
- **Mitigation**: Start with simple scenarios, progressive disclosure, templates

**Business Logic Risk:**
- P&L calculations vary by industry/business model
- **Mitigation**: Start generic, add industry-specific templates later

---

## Cross-Module Dependencies & Integration

### Data Flow Between Modules

1. **Reports → Dashboard**: Report data aggregated for executive view
2. **Reports → Supplier Matrix**: Extract supplier data from reports
3. **Landed Cost → P&L Planner**: Import costs into scenarios
4. **Supplier Matrix → P&L Planner**: Import supplier costs
5. **Reports → P&L Planner**: Import profit data

### Shared Services Needed

**Calculation Service:**
- `server/services/calculations.ts` - Shared calculation utilities
- Currency conversion
- Unit conversions
- Percentage calculations

**Data Normalization:**
- `server/services/normalizeData.ts` - Normalize data from different sources
- Supplier data normalization
- Cost data normalization
- Product data normalization

### Common Frontend Components

**Charts & Visualizations:**
- Reuse `recharts` components across modules
- Create shared chart components

**Data Tables:**
- Reuse table components for comparisons
- Create shared comparison table component

**Forms:**
- Reuse form components for inputs
- Create shared scenario builder components

---

## Summary: Readiness Assessment

### Module 1: Executive Intelligence Dashboard
- **Backend Readiness**: 60% - Data exists, needs aggregation
- **Frontend Readiness**: 70% - Dashboard exists, needs enhancement
- **Risk Level**: MEDIUM - Performance concerns with JSONB aggregation

### Module 2: Supplier Intelligence Matrix
- **Backend Readiness**: 50% - Data exists in reports, needs extraction
- **Frontend Readiness**: 20% - No matrix view exists
- **Risk Level**: MEDIUM - Data consistency and normalization challenges

### Module 3: Landed Cost Analyzer
- **Backend Readiness**: 80% - Separate calculators exist, need unification
- **Frontend Readiness**: 80% - UI exists, needs integration
- **Risk Level**: LOW - Well-defined scope, existing components

### Module 4: Profit & Loss Scenario Planner
- **Backend Readiness**: 30% - Basic profit data in reports, needs full service
- **Frontend Readiness**: 10% - No planner UI exists
- **Risk Level**: HIGH - Complex calculations, many variables, user experience challenges

---

## Critical Path for V1 Delivery

### Phase 1: Foundation (Week 1-2)
1. Add database tables for new modules
2. Create shared calculation services
3. Set up data normalization layer

### Phase 2: Core Features (Week 3-6)
1. Module 3 (Landed Cost Analyzer) - Highest readiness
2. Module 2 (Supplier Matrix) - Core feature, high priority
3. Module 1 (Dashboard) - Enhance existing

### Phase 3: Advanced Features (Week 7-8)
1. Module 4 (P&L Planner) - Most complex, do last
2. Cross-module integrations
3. Performance optimization

### Phase 4: Polish & Testing (Week 9-10)
1. UI/UX refinements
2. Error handling
3. Performance testing
4. Documentation
