# V1 Landed Cost Engine - Backend Build Plan

## Executive Summary

**Current State**: Separate customs and shipping calculators exist with frontend-only calculation logic. Backend only stores results.

**Target State**: Full-featured backend calculation engine with unified landed cost, benchmarks, scenarios, and export capabilities.

**Critical Gap**: All calculation logic currently in frontend. Must move to backend for accuracy, security, and consistency.

---

## 1. EXISTING BACKEND SUPPORT

### ✅ Data Layer (READY)

**Database Tables:**
- `shared/schema.ts` - `customsCalculations` table
  - Fields: productName, hsCode, originCountry, destinationCountry, productValue, quantity, incoterm, result (JSONB)
- `shared/schema.ts` - `shippingEstimates` table
  - Fields: originCountry, destinationCountry, weight, volume, shippingMethod, result (JSONB)

**Storage Methods (`server/storage.ts`):**
- `createCustomsCalculation()` - Save customs calculation
- `getUserCustomsCalculations()` - List user's customs calculations
- `getCustomsCalculation(id)` - Get specific calculation
- `createShippingEstimate()` - Save shipping estimate
- `getUserShippingEstimates()` - List user's shipping estimates
- `getShippingEstimate(id)` - Get specific estimate

**Data Structures:**
- `server/services/reportGenerator.ts` - `LandedCost` interface exists
  - Contains: productCost, freightCost, insuranceCost, customsDuties, vatTaxes, handlingFees, brokerageFees, portCharges, inlandTransport, totalLandedCost, costPerUnit

### ✅ API Routes (READY - Storage Only)

**Existing Endpoints (`server/routes.ts`):**
- `POST /api/calculations/customs` - Save customs calculation (lines 802-828)
- `GET /api/calculations/customs` - List customs calculations (lines 831-844)
- `GET /api/calculations/customs/:id` - Get specific calculation (lines 847-873)
- `POST /api/calculations/shipping` - Save shipping estimate (lines 876-900)
- `GET /api/calculations/shipping` - List shipping estimates (lines 903-916)
- `GET /api/calculations/shipping/:id` - Get specific estimate (lines 919-945)

**Limitation**: These endpoints only STORE results. No calculation logic.

### ✅ HS Code Support (READY)

**Database Table:**
- `shared/schema.ts` - `hsCodes` table exists
  - Fields: code, description, chapter, section, keywords

**Note**: Table exists but may need population with tariff data.

---

## 2. REQUIRED EXTENSIONS

### 🔧 New Database Tables

**Add to `shared/schema.ts`:**

1. **`landedCostCalculations` table**
   - Primary table for unified landed cost calculations
   - Fields:
     - id, userId, title, description
     - productName, hsCode, category
     - originCountry, destinationCountry
     - productCost (FOB/EXW), quantity
     - incoterm, shippingMethod (sea_fcl, sea_lcl, air, express)
     - containerType (20ft, 40ft, lcl)
     - weight, volume, dimensions
     - calculationInputs (JSONB) - All input parameters
     - calculationResult (JSONB) - Complete breakdown
     - calculationNotes (JSONB) - Transparent calculation notes
     - benchmarkData (JSONB) - P25/Median/P75 benchmarks
     - createdAt, updatedAt

2. **`landedCostScenarios` table**
   - Preset scenarios (origin + volume combinations)
   - Fields:
     - id, userId, name, description
     - scenarioType (origin_preset, volume_preset, custom)
     - inputs (JSONB) - Scenario parameters
     - createdAt, updatedAt

3. **`marketBenchmarks` table** (Optional - can be JSONB in calculations)
   - Historical market data for benchmarking
   - Fields:
     - hsCode, originCountry, destinationCountry
     - shippingMethod, containerType
     - percentile25, median, percentile75
     - sampleSize, lastUpdated
     - dataSource

### 🔧 New Calculation Services

**Create `server/services/landedCostService.ts`:**

**Core Calculation Functions:**
1. `calculateFOBCost()` - FOB/EXW base cost calculation
2. `calculateOceanFreightFCL()` - Full container load ocean freight
3. `calculateOceanFreightLCL()` - Less than container load ocean freight
4. `calculateAirFreight()` - Air freight premium estimate
5. `calculateCustomsDuties()` - HS code based customs + extra tariffs
6. `calculateInlandTransport()` - Origin + destination inland transport
7. `calculateCargoInsurance()` - Cargo insurance based on CIF value
8. `calculateTotalLandedCost()` - Aggregate all components
9. `calculateCostPerUnit()` - Per-unit cost calculation
10. `generateCostBreakdown()` - Waterfall breakdown structure
11. `generateCalculationNotes()` - Transparent calculation explanations

**Benchmark Functions:**
12. `getMarketBenchmarks()` - Fetch P25/Median/P75 for comparison
13. `compareToBenchmark()` - Compare calculation to market benchmarks

**Scenario Functions:**
14. `applyOriginPreset()` - Apply origin country preset
15. `applyVolumePreset()` - Apply volume-based preset
16. `createScenario()` - Create custom scenario

**Export Functions:**
17. `generateExcelExport()` - Excel export with breakdown
18. `generatePDFExport()` - PDF export with notes

**Helper Functions:**
19. `normalizeIncoterm()` - Handle FOB/EXW/CIF/DDP conversions
20. `validateHSCode()` - Validate HS code format
21. `getTariffRate()` - Lookup tariff rate for HS code + country pair
22. `calculateVolumetricWeight()` - Air freight volumetric weight
23. `getPortCharges()` - Port handling charges by country
24. `getBrokerageFees()` - Customs brokerage fees by country

### 🔧 New API Endpoints

**Add to `server/routes.ts`:**

**Core Calculation:**
- `POST /api/landed-cost/calculate` - Main calculation endpoint
  - Input: Complete calculation inputs
  - Output: Full landed cost breakdown + notes
  - Logic: Call `landedCostService.calculateTotalLandedCost()`

- `POST /api/landed-cost/save` - Save calculation
  - Input: Calculation result + metadata
  - Output: Saved calculation with ID

- `GET /api/landed-cost` - List user's calculations
  - Query params: limit, offset, sort

- `GET /api/landed-cost/:id` - Get specific calculation
  - Output: Full calculation with breakdown

- `PATCH /api/landed-cost/:id` - Update calculation
  - Input: Updated inputs
  - Output: Recalculated result

- `DELETE /api/landed-cost/:id` - Delete calculation

**Benchmarks:**
- `GET /api/landed-cost/benchmarks` - Get market benchmarks
  - Query params: hsCode, originCountry, destinationCountry, shippingMethod
  - Output: P25/Median/P75 benchmarks

**Scenarios:**
- `GET /api/landed-cost/scenarios` - List preset scenarios
  - Output: Available origin + volume presets

- `POST /api/landed-cost/scenarios` - Create custom scenario
  - Input: Scenario parameters
  - Output: Created scenario

- `POST /api/landed-cost/scenarios/:id/apply` - Apply scenario to calculation
  - Input: Calculation inputs + scenario ID
  - Output: Calculated result with scenario applied

**Export:**
- `GET /api/landed-cost/:id/export/excel` - Excel export
  - Output: Excel file download

- `GET /api/landed-cost/:id/export/pdf` - PDF export
  - Output: PDF file download

**Utilities:**
- `GET /api/landed-cost/validate-hs-code` - Validate HS code
  - Query params: hsCode
  - Output: Validation result + description

- `GET /api/landed-cost/tariff-rates` - Get tariff rates
  - Query params: hsCode, originCountry, destinationCountry
  - Output: Applicable tariff rates

### 🔧 Extended Storage Methods

**Extend `server/storage.ts`:**

Add to `IStorage` interface:
- `createLandedCostCalculation()`
- `getUserLandedCostCalculations(userId, limit, offset)`
- `getLandedCostCalculation(id)`
- `updateLandedCostCalculation(id, data)`
- `deleteLandedCostCalculation(id)`
- `createLandedCostScenario()`
- `getUserLandedCostScenarios(userId)`
- `getLandedCostScenario(id)`
- `getMarketBenchmarks(criteria)`

### 🔧 External Data Sources (Future Integration Points)

**Tariff Data:**
- HS code tariff rate lookup (currently simulated)
- **Future**: Integrate with trade data APIs (UN Comtrade, ITC, national customs APIs)

**Freight Rates:**
- Ocean freight rate estimation (currently simulated)
- **Future**: Integrate with freight rate APIs (Freightos, Xeneta, etc.)

**Port Charges:**
- Port handling charges by country (currently estimated)
- **Future**: Use port authority data or freight forwarder APIs

**Currency Conversion:**
- Multi-currency support
- **Future**: Use currency conversion API (Fixer.io, ExchangeRate-API)

---

## 3. MUST NOT MODIFY

### 🚫 Critical Production Code

**Authentication & Security:**
- `server/replit_integrations/auth/` - Entire directory
- `server/auth/index.ts` - Auth exports
- Session management logic

**Credit System:**
- `server/storage.ts` - Credit methods (lines 100-200 approximately)
  - `spendCredits()`, `addTopupCredits()`, `refreshMonthlyCredits()`
- Credit transaction logic in `server/routes.ts`
- `shared/schema.ts` - `creditTransactions` table

**Payment Processing:**
- `server/webhookHandlers.ts` - Stripe webhook processing
- `server/stripeService.ts` - Payment logic
- `server/stripeClient.ts` - Stripe client initialization
- `server/routes.ts` - Stripe billing routes (lines 947-1417)

**Report Generation:**
- `server/services/reportGenerator.ts` - Report generation logic
  - **Note**: Can READ `LandedCost` interface, but don't modify generation logic
- `server/routes.ts` - Report routes (lines 329-434)

**Database Schema:**
- `shared/schema.ts` - Existing tables (add new tables, don't modify)
  - `customsCalculations` table structure
  - `shippingEstimates` table structure
  - `reports` table structure
  - `userProfiles` table structure

**Build & Deployment:**
- `script/build.ts` - Build process
- `server/static.ts` - Static file serving
- `server/index.ts` - Server initialization (lines 64-87 webhook route order)

---

## 4. SAFE EXTENSION AREAS

### ✅ Safe to Extend

**Storage Layer:**
- `server/storage.ts` - Add new methods to `IStorage` interface
- Add new table operations (create, read, update, delete)
- **Safe**: Adding new methods doesn't break existing functionality

**API Routes:**
- `server/routes.ts` - Add new routes under `/api/landed-cost/*`
- **Safe**: New routes don't conflict with existing routes
- **Safe**: Can add routes after line 945 (after shipping estimates)

**Services:**
- `server/services/` - Create new `landedCostService.ts`
- **Safe**: New service file, no conflicts

**Schema:**
- `shared/schema.ts` - Add new tables
- **Safe**: Adding tables doesn't affect existing tables
- **Safe**: Can reference existing tables (users, etc.)

**Utilities:**
- Create `server/utils/` directory for helper functions
- Currency conversion utilities
- Unit conversion utilities
- **Safe**: New utilities, no conflicts

---

## 5. IMPLEMENTATION SEQUENCE

### PHASE 1: Data Model & Storage Foundation (Week 1)

**Goal**: Establish database structure and storage layer.

**Tasks:**

1. **Database Schema Extension**
   - Add `landedCostCalculations` table to `shared/schema.ts`
   - Add `landedCostScenarios` table to `shared/schema.ts`
   - Add `marketBenchmarks` table (optional, can use JSONB)
   - Create migration script
   - **Deliverable**: New tables created, migrations run

2. **Storage Layer Extension**
   - Extend `IStorage` interface in `server/storage.ts`
   - Implement `createLandedCostCalculation()` method
   - Implement `getUserLandedCostCalculations()` method
   - Implement `getLandedCostCalculation()` method
   - Implement `updateLandedCostCalculation()` method
   - Implement `deleteLandedCostCalculation()` method
   - Implement scenario storage methods
   - **Deliverable**: Storage methods ready for use

3. **Type Definitions**
   - Create `shared/types/landedCost.ts` for TypeScript interfaces
   - Define `LandedCostInput` interface
   - Define `LandedCostResult` interface
   - Define `CostBreakdown` interface
   - Define `CalculationNotes` interface
   - Define `BenchmarkData` interface
   - **Deliverable**: Type-safe interfaces for all data structures

**Success Criteria:**
- Database tables created and accessible
- Storage methods can save/retrieve calculations
- Type definitions complete

**Risk Mitigation:**
- Test storage methods with sample data
- Verify database constraints work correctly
- Ensure foreign key relationships are correct

---

### PHASE 2: Calculation Engine Core (Week 2-3)

**Goal**: Build core calculation logic for all cost components.

**Tasks:**

1. **Service Structure**
   - Create `server/services/landedCostService.ts`
   - Set up service class/namespace structure
   - Create input validation functions
   - **Deliverable**: Service file structure ready

2. **Base Cost Calculation**
   - Implement `calculateFOBCost()` - Handle FOB/EXW base cost
   - Implement `normalizeIncoterm()` - Convert between incoterms
   - Handle currency conversion (if needed)
   - **Deliverable**: Base cost calculation working

3. **Freight Calculations**
   - Implement `calculateOceanFreightFCL()` - FCL ocean freight
     - 20ft container rates
     - 40ft container rates
     - Port-to-port rates
   - Implement `calculateOceanFreightLCL()` - LCL ocean freight
     - Per CBM rates
     - Minimum charge handling
   - Implement `calculateAirFreight()` - Air freight premium
     - Volumetric weight calculation
     - Chargeable weight logic
   - Implement `calculateVolumetricWeight()` - Helper for air freight
   - **Deliverable**: All freight methods working

4. **Customs & Duties**
   - Implement `validateHSCode()` - HS code validation
   - Implement `getTariffRate()` - Tariff rate lookup
   - Implement `calculateCustomsDuties()` - Complete customs calculation
     - Import duty calculation
     - VAT/GST calculation
     - Additional tariffs (anti-dumping, countervailing)
     - MPF/HMF for US
   - **Deliverable**: Customs calculation working

5. **Additional Costs**
   - Implement `calculateInlandTransport()` - Origin + destination
     - Origin port transport
     - Destination port to final destination
   - Implement `calculateCargoInsurance()` - Insurance calculation
     - Based on CIF value
     - Configurable insurance rate
   - Implement `getPortCharges()` - Port handling charges
   - Implement `getBrokerageFees()` - Customs brokerage fees
   - **Deliverable**: All additional costs calculated

6. **Aggregation**
   - Implement `calculateTotalLandedCost()` - Main aggregation function
   - Implement `calculateCostPerUnit()` - Per-unit calculation
   - Implement `generateCostBreakdown()` - Waterfall structure
   - **Deliverable**: Complete landed cost calculation

7. **Calculation Notes**
   - Implement `generateCalculationNotes()` - Transparent notes
     - Document each calculation step
     - Explain assumptions
     - Note data sources
     - Flag estimates vs. actuals
   - **Deliverable**: Calculation notes generated

**Success Criteria:**
- All cost components calculate correctly
- Calculation logic matches business requirements
- Calculation notes are comprehensive
- Service handles edge cases (missing data, invalid inputs)

**Risk Mitigation:**
- Unit test each calculation function
- Test with real-world scenarios
- Validate against known calculations
- Handle missing/invalid HS codes gracefully

---

### PHASE 3: API Layer & Integration (Week 4)

**Goal**: Expose calculation engine via API and integrate with existing system.

**Tasks:**

1. **Core API Endpoints**
   - Add `POST /api/landed-cost/calculate` route
     - Validate inputs
     - Call `landedCostService.calculateTotalLandedCost()`
     - Return result with breakdown + notes
   - Add `POST /api/landed-cost/save` route
     - Save calculation to database
     - Return saved calculation ID
   - Add `GET /api/landed-cost` route
     - List user's calculations with pagination
   - Add `GET /api/landed-cost/:id` route
     - Get specific calculation
   - Add `PATCH /api/landed-cost/:id` route
     - Update calculation inputs
     - Recalculate automatically
   - Add `DELETE /api/landed-cost/:id` route
     - Delete calculation
   - **Deliverable**: CRUD API endpoints working

2. **Benchmark API**
   - Add `GET /api/landed-cost/benchmarks` route
     - Query market benchmarks
     - Return P25/Median/P75
   - Implement benchmark comparison logic
   - **Deliverable**: Benchmark API working

3. **Scenario API**
   - Add `GET /api/landed-cost/scenarios` route
     - List preset scenarios
   - Add `POST /api/landed-cost/scenarios` route
     - Create custom scenario
   - Add `POST /api/landed-cost/scenarios/:id/apply` route
     - Apply scenario to calculation
   - **Deliverable**: Scenario API working

4. **Utility Endpoints**
   - Add `GET /api/landed-cost/validate-hs-code` route
   - Add `GET /api/landed-cost/tariff-rates` route
   - **Deliverable**: Utility endpoints working

5. **Error Handling**
   - Add validation middleware for inputs
   - Add error handling for calculation failures
   - Return user-friendly error messages
   - **Deliverable**: Robust error handling

6. **Integration Testing**
   - Test API endpoints with various inputs
   - Test error cases
   - Test authentication/authorization
   - **Deliverable**: API fully tested

**Success Criteria:**
- All API endpoints work correctly
- Authentication/authorization enforced
- Input validation prevents bad data
- Error handling is user-friendly
- API responses are well-structured

**Risk Mitigation:**
- Test with invalid inputs
- Test with missing data
- Test authentication edge cases
- Load test with multiple concurrent requests

---

### PHASE 4: Benchmarks & Scenarios (Week 5)

**Goal**: Implement market benchmarks and preset scenarios.

**Tasks:**

1. **Benchmark Data Collection**
   - Design benchmark data structure
   - Create benchmark data seeding script (if using database table)
   - Or implement benchmark calculation from historical calculations
   - **Deliverable**: Benchmark data available

2. **Benchmark Calculation**
   - Implement `getMarketBenchmarks()` function
   - Calculate P25/Median/P75 from historical data
   - Handle cases with insufficient data
   - **Deliverable**: Benchmark calculation working

3. **Benchmark Comparison**
   - Implement `compareToBenchmark()` function
   - Generate comparison insights
   - Flag outliers (above P75, below P25)
   - **Deliverable**: Benchmark comparison working

4. **Origin Presets**
   - Define common origin country presets
   - Implement `applyOriginPreset()` function
   - Store presets in database or config
   - **Deliverable**: Origin presets working

5. **Volume Presets**
   - Define common volume presets (small, medium, large)
   - Implement `applyVolumePreset()` function
   - Adjust calculations based on volume
   - **Deliverable**: Volume presets working

6. **Scenario Management**
   - Implement scenario CRUD operations
   - Allow users to save custom scenarios
   - Apply scenarios to new calculations
   - **Deliverable**: Scenario management working

**Success Criteria:**
- Benchmarks calculated correctly
- Presets apply correctly to calculations
- Scenarios can be saved and reused
- Comparison insights are meaningful

**Risk Mitigation:**
- Test with various data volumes
- Handle edge cases (no historical data)
- Validate preset parameters
- Test scenario application logic

---

### PHASE 5: Export Functionality (Week 6)

**Goal**: Implement Excel and PDF export with full breakdown.

**Tasks:**

1. **Excel Export**
   - Install/configure Excel library (e.g., `exceljs`)
   - Implement `generateExcelExport()` function
   - Create Excel template with:
     - Input parameters sheet
     - Cost breakdown sheet (waterfall)
     - Benchmark comparison sheet
     - Calculation notes sheet
   - Format cells, add charts if needed
   - **Deliverable**: Excel export working

2. **PDF Export**
   - Install/configure PDF library (e.g., `pdfkit` or `jspdf`)
   - Implement `generatePDFExport()` function
   - Create PDF template with:
     - Header with calculation metadata
     - Cost breakdown waterfall visualization
     - Benchmark comparison section
     - Detailed calculation notes
     - Footer with disclaimers
   - Format professionally
   - **Deliverable**: PDF export working

3. **Export API Endpoints**
   - Add `GET /api/landed-cost/:id/export/excel` route
     - Generate Excel file
     - Return file download
   - Add `GET /api/landed-cost/:id/export/pdf` route
     - Generate PDF file
     - Return file download
   - **Deliverable**: Export endpoints working

4. **Export Testing**
   - Test with various calculation types
   - Test with different data volumes
   - Verify formatting is correct
   - Test file download functionality
   - **Deliverable**: Exports tested and working

**Success Criteria:**
- Excel exports contain all required data
- PDF exports are professionally formatted
- Export files download correctly
- Export performance is acceptable

**Risk Mitigation:**
- Test with large calculations
- Handle missing data gracefully
- Optimize export performance
- Test file generation edge cases

---

### PHASE 6: Testing & Optimization (Week 7)

**Goal**: Comprehensive testing and performance optimization.

**Tasks:**

1. **Unit Testing**
   - Write unit tests for all calculation functions
   - Test edge cases (zero values, negative values, missing data)
   - Test validation logic
   - **Deliverable**: Unit test coverage >80%

2. **Integration Testing**
   - Test API endpoints end-to-end
   - Test database operations
   - Test export functionality
   - **Deliverable**: Integration tests passing

3. **Performance Testing**
   - Load test calculation endpoints
   - Optimize slow queries
   - Add database indexes if needed
   - Cache benchmark data if appropriate
   - **Deliverable**: Performance meets requirements

4. **Data Validation**
   - Validate calculation accuracy
   - Compare against known calculations
   - Verify benchmark calculations
   - **Deliverable**: Calculations validated

5. **Documentation**
   - Document API endpoints
   - Document calculation formulas
   - Document data structures
   - **Deliverable**: Documentation complete

**Success Criteria:**
- All tests passing
- Performance meets requirements
- Calculations are accurate
- Documentation is complete

**Risk Mitigation:**
- Fix bugs found in testing
- Optimize performance bottlenecks
- Validate calculation accuracy
- Update documentation as needed

---

## 6. TECHNICAL CONSIDERATIONS

### Calculation Accuracy

**Current State**: Calculations are simulated/estimated in frontend.

**V1 Requirements**: Backend calculations must be accurate and transparent.

**Approach:**
- Use real tariff rate data (HS code based)
- Document all assumptions in calculation notes
- Flag estimates vs. actuals
- Allow manual override of rates (admin)

### Data Sources

**Tariff Rates:**
- Start with static tariff rate database
- Future: Integrate with trade data APIs

**Freight Rates:**
- Start with estimated rates based on routes
- Future: Integrate with freight rate APIs

**Port Charges:**
- Start with estimated charges by country
- Future: Use port authority data

### Performance

**Calculation Speed:**
- Calculations should complete in <2 seconds
- Cache benchmark data
- Optimize database queries

**Concurrent Requests:**
- Handle multiple simultaneous calculations
- Use connection pooling
- Consider rate limiting

### Security

**Input Validation:**
- Validate all inputs server-side
- Prevent injection attacks
- Sanitize user inputs

**Authorization:**
- Users can only access their own calculations
- Admin can view all calculations (if needed)

### Error Handling

**Calculation Errors:**
- Handle missing HS codes gracefully
- Handle invalid country pairs
- Return meaningful error messages

**Data Errors:**
- Handle missing tariff data
- Handle missing freight rates
- Provide fallback calculations

---

## 7. DEPENDENCIES & BLOCKERS

### External Dependencies

**Libraries Needed:**
- Excel generation library (e.g., `exceljs`)
- PDF generation library (e.g., `pdfkit` or `jspdf`)
- Currency conversion (if multi-currency needed)

**Data Dependencies:**
- HS code tariff rate database
- Port charge data by country
- Freight rate estimation data

### Potential Blockers

1. **Tariff Rate Data**: Need reliable source for HS code tariff rates
   - **Mitigation**: Start with static data, integrate APIs later

2. **Freight Rate Accuracy**: Estimated rates may not match actual
   - **Mitigation**: Clearly label as estimates, integrate APIs later

3. **Performance**: Complex calculations may be slow
   - **Mitigation**: Optimize queries, cache data, use background jobs if needed

4. **Data Quality**: Missing or incorrect HS codes
   - **Mitigation**: Validate HS codes, provide fallback calculations

---

## 8. SUCCESS METRICS

### Functional Requirements

- ✅ All V1 requirements implemented
- ✅ Calculations are accurate
- ✅ Export functionality works
- ✅ Benchmarks are meaningful
- ✅ Scenarios apply correctly

### Performance Requirements

- ✅ Calculation completes in <2 seconds
- ✅ API responds in <500ms
- ✅ Export generation completes in <5 seconds

### Quality Requirements

- ✅ Unit test coverage >80%
- ✅ Integration tests passing
- ✅ No critical bugs
- ✅ Documentation complete

---

## 9. POST-V1 ENHANCEMENTS (Out of Scope)

**Future Improvements:**
- Real-time freight rate APIs integration
- Multi-currency support with live rates
- Historical calculation tracking
- Cost trend analysis
- Supplier cost comparison
- Integration with report generation
- Advanced scenario modeling
- Cost optimization suggestions

---

## 10. RISK REGISTER

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Calculation accuracy issues | High | Medium | Extensive testing, validation against known calculations |
| Performance bottlenecks | Medium | Medium | Optimize queries, cache data, load testing |
| Missing tariff data | High | Low | Use fallback rates, clearly label estimates |
| Export generation failures | Low | Low | Error handling, fallback formats |
| Data migration issues | High | Low | Test migrations thoroughly, backup data |

---

## Summary

**Total Estimated Timeline**: 7 weeks

**Critical Path:**
1. Phase 1: Data model (Week 1)
2. Phase 2: Calculation engine (Weeks 2-3)
3. Phase 3: API layer (Week 4)
4. Phase 4: Benchmarks & scenarios (Week 5)
5. Phase 5: Export (Week 6)
6. Phase 6: Testing (Week 7)

**Key Deliverables:**
- Unified landed cost calculation engine
- Complete API for calculations
- Market benchmarks
- Preset scenarios
- Excel + PDF export
- Transparent calculation notes

**Critical Success Factors:**
- Accurate calculations
- Transparent calculation notes
- Fast performance
- Reliable exports
- Comprehensive testing
