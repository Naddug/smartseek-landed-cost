# V1 Landed Cost Engine - Backend Architecture Mapping

## Overview

This document maps the finalized Landed Cost Engine data contract into the existing SmartSeek backend architecture. It defines module boundaries, integration points, and implementation order.

**Assumption**: The data contract defines input/output structures, calculation requirements, and export formats. This mapping shows how to implement it within existing architecture.

---

## 1. BACKEND MODULE MAP

### New Services to Create

#### `server/services/landedCostService.ts`
**Responsibility**: Core calculation engine
- Pure calculation logic (no database access)
- Input: Landed cost calculation parameters (per data contract)
- Output: Complete landed cost breakdown (per data contract)
- Functions:
  - `calculateLandedCost(inputs)` - Main orchestration function
  - `calculateBaseCost()` - FOB/EXW calculation
  - `calculateFreight()` - Ocean (FCL/LCL) + Air freight
  - `calculateCustoms()` - HS code based customs & duties
  - `calculateInlandTransport()` - Origin + destination transport
  - `calculateInsurance()` - Cargo insurance
  - `aggregateTotal()` - Total landed cost + per-unit
  - `generateBreakdown()` - Cost breakdown waterfall
  - `generateNotes()` - Transparent calculation notes

**Integration Points:**
- Reads from: `server/services/tariffService.ts` (for tariff rates)
- Reads from: `server/services/freightRateService.ts` (for freight rates)
- No direct database access (pure calculation)

---

#### `server/services/tariffService.ts`
**Responsibility**: Tariff rate data access
- HS code tariff rate lookups
- Trade agreement handling
- Additional tariff calculations (anti-dumping, countervailing)
- Functions:
  - `getTariffRate(hsCode, originCountry, destinationCountry)`
  - `getVATRate(destinationCountry)`
  - `getAdditionalTariffs(hsCode, originCountry, destinationCountry)`
  - `validateHSCode(hsCode)`

**Integration Points:**
- Reads from: `shared/schema.ts` - `hsCodes` table
- Reads from: `shared/schema.ts` - `tradeDataCache` table (if tariff data cached)
- May read from external APIs (future)

---

#### `server/services/freightRateService.ts`
**Responsibility**: Freight rate estimation
- Ocean freight rates (FCL + LCL)
- Air freight rates
- Port-to-port route data
- Functions:
  - `getOceanFreightFCL(route, containerType)`
  - `getOceanFreightLCL(route, volume)`
  - `getAirFreight(route, weight, volume)`
  - `getPortCharges(country, port)`

**Integration Points:**
- May read from: `shared/schema.ts` - `tradeDataCache` table (if freight data cached)
- May read from external APIs (future)
- Uses route calculation utilities

---

#### `server/services/benchmarkService.ts`
**Responsibility**: Market benchmark calculations
- P25/Median/P75 calculations
- Historical data aggregation
- Benchmark comparison logic
- Functions:
  - `getBenchmarks(criteria)` - Get P25/Median/P75 for criteria
  - `compareToBenchmark(calculation, benchmarks)` - Compare calculation to benchmarks
  - `aggregateHistoricalData(criteria)` - Aggregate historical calculations

**Integration Points:**
- Reads from: `shared/schema.ts` - `landedCostCalculations` table (historical data)
- Reads from: `shared/schema.ts` - `marketBenchmarks` table (if pre-calculated)
- Uses aggregation queries

---

#### `server/services/scenarioService.ts`
**Responsibility**: Scenario management
- Origin preset scenarios
- Volume preset scenarios
- Custom scenario application
- Functions:
  - `getPresetScenarios(type)` - Get origin/volume presets
  - `applyScenario(inputs, scenarioId)` - Apply scenario to inputs
  - `createScenario(userId, scenarioData)` - Create custom scenario

**Integration Points:**
- Reads from: `server/storage.ts` - Scenario storage methods
- Uses: `server/services/landedCostService.ts` - To recalculate with scenario

---

#### `server/services/exportService.ts`
**Responsibility**: Export generation
- Excel export generation
- PDF export generation
- Format conversion
- Functions:
  - `generateExcel(calculationData)` - Excel export per data contract
  - `generatePDF(calculationData)` - PDF export per data contract
  - `formatForExport(calculationData, format)` - Format conversion

**Integration Points:**
- Reads from: `server/storage.ts` - Get calculation data
- Uses: `server/services/landedCostService.ts` - For calculation structure
- No database writes (read-only for exports)

---

### Existing Folders/Files Integration

#### `server/storage.ts`
**Integration**: Extend existing storage layer
- Add new methods to `IStorage` interface
- Implement landed cost CRUD operations
- Implement scenario storage operations
- Implement benchmark data access
- **Pattern**: Follow existing pattern (customsCalculations, shippingEstimates)

**New Methods to Add:**
- `createLandedCostCalculation()`
- `getUserLandedCostCalculations()`
- `getLandedCostCalculation()`
- `updateLandedCostCalculation()`
- `deleteLandedCostCalculation()`
- `createLandedCostScenario()`
- `getUserLandedCostScenarios()`
- `getMarketBenchmarks()`

**Why This Pattern:**
- Consistent with existing storage layer
- All database access goes through storage layer
- Services don't access database directly

---

#### `server/routes.ts`
**Integration**: Add new route group
- Add `/api/v1/landed-cost/*` route group
- Follow existing route patterns
- Use existing authentication helpers (`getUserId()`)
- Use existing error handling patterns

**Route Structure:**
- Calculation routes (POST /calculate, GET /:id, etc.)
- Scenario routes (GET /scenarios, POST /scenarios/:id/apply)
- Benchmark routes (GET /benchmarks)
- Export routes (GET /:id/export/excel, GET /:id/export/pdf)

**Why This Location:**
- All API routes currently in single file
- Consistent with existing structure
- Easy to find and maintain

---

#### `shared/schema.ts`
**Integration**: Add new tables
- Add `landedCostCalculations` table definition
- Add `landedCostScenarios` table definition
- Add `marketBenchmarks` table definition (optional)
- Follow existing table patterns

**Why This Location:**
- All database schemas in shared location
- Frontend can import types
- Single source of truth for data structure

---

#### `shared/types/` (New Directory)
**Integration**: Create type definitions
- Create `shared/types/landedCost.ts`
- Define TypeScript interfaces matching data contract
- Export for use in services and routes

**Why Separate Types:**
- Types can be shared between frontend and backend
- Clear contract definition
- Type safety across layers

---

### Separation of Concerns

**Calculation Layer** (`server/services/landedCostService.ts`)
- Pure business logic
- No database access
- No HTTP concerns
- Input/output per data contract

**Data Access Layer** (`server/storage.ts`)
- Database operations only
- CRUD operations
- Query building
- No business logic

**External Data Layer** (`server/services/tariffService.ts`, `freightRateService.ts`)
- External data access
- Rate lookups
- Data caching
- No calculation logic

**API Layer** (`server/routes.ts`)
- HTTP request/response handling
- Input validation
- Authentication/authorization
- Error handling
- Calls services, not storage directly

**Export Layer** (`server/services/exportService.ts`)
- Format conversion only
- Read calculation data
- Generate files
- No calculation logic

---

## 2. "DO NOT TOUCH" LIST

### Critical Production Systems

#### `server/replit_integrations/auth/`
**Why**: Core authentication system
- Email/password authentication
- Session management
- User verification
- **Risk**: Breaking auth = users can't log in

#### `server/auth/index.ts`
**Why**: Auth module exports
- Central auth interface
- Used by all routes
- **Risk**: Breaking exports = auth breaks everywhere

#### `server/storage.ts` - Credit Methods
**Why**: Billing system dependency
- Lines ~100-200: Credit transaction methods
- `spendCredits()`, `addTopupCredits()`, `refreshMonthlyCredits()`
- Used by billing and report generation
- **Risk**: Breaking credits = billing corruption, users get free access

#### `server/webhookHandlers.ts`
**Why**: Payment processing
- Stripe webhook processing
- Credit fulfillment
- Subscription management
- **Risk**: Breaking webhooks = payments don't process, credits don't grant

#### `server/stripeService.ts`
**Why**: Payment logic
- Stripe API interactions
- Checkout creation
- Subscription management
- **Risk**: Breaking payments = lost revenue

#### `server/stripeClient.ts`
**Why**: Stripe client initialization
- Stripe SDK setup
- Client configuration
- Used by webhook handlers and stripe service
- **Risk**: Breaking client = all Stripe operations fail

#### `server/routes.ts` - Stripe Routes
**Why**: Billing API endpoints
- Lines ~947-1417: All Stripe billing routes
- Payment processing endpoints
- **Risk**: Breaking billing = users can't pay, subscriptions don't work

#### `server/services/reportGenerator.ts`
**Why**: Report generation system
- AI report generation
- Used by Smart Finder feature
- Contains `LandedCost` interface (can read, don't modify)
- **Risk**: Breaking reports = core feature broken

#### `server/routes.ts` - Report Routes
**Why**: Report API endpoints
- Lines ~329-434: Report CRUD routes
- Used by Smart Finder
- **Risk**: Breaking reports = users can't generate reports

#### `server/index.ts` - Webhook Route Order
**Why**: Stripe webhook security
- Lines 64-87: Webhook route MUST be before express.json()
- Critical for signature verification
- **Risk**: Breaking order = webhook signature verification fails

#### `shared/schema.ts` - Existing Tables
**Why**: Database structure
- `customsCalculations` table structure
- `shippingEstimates` table structure
- `reports` table structure
- `userProfiles` table structure
- `creditTransactions` table structure
- **Risk**: Modifying schema = data migration required, potential data loss

#### `script/build.ts`
**Why**: Production build process
- Builds client and server
- Production deployment dependency
- **Risk**: Breaking build = can't deploy

#### `server/static.ts`
**Why**: Static file serving
- Production static asset serving
- **Risk**: Breaking static = app won't load

---

### Safe to Extend (Not Modify)

#### `server/storage.ts` - Add New Methods
**Safe**: Adding new methods to `IStorage` interface
- Extend interface, don't modify existing methods
- Follow existing patterns
- **Why Safe**: New methods don't affect existing functionality

#### `server/routes.ts` - Add New Routes
**Safe**: Adding new route groups
- Add after existing routes (after line 945)
- Use existing patterns
- **Why Safe**: New routes don't conflict with existing routes

#### `shared/schema.ts` - Add New Tables
**Safe**: Adding new table definitions
- Don't modify existing tables
- Can reference existing tables (users, etc.)
- **Why Safe**: New tables don't affect existing data

---

## 3. API LAYER MAPPING

### Route Location

**File**: `server/routes.ts`
**Location**: Add new route group after shipping estimates (after line 945)

**Pattern**: Follow existing route group structure
```typescript
// ===== Landed Cost Engine =====

// Calculation endpoints
app.post("/api/v1/landed-cost/calculate", ...)
app.post("/api/v1/landed-cost", ...)  // Save
app.get("/api/v1/landed-cost", ...)   // List
app.get("/api/v1/landed-cost/:id", ...)
app.patch("/api/v1/landed-cost/:id", ...)
app.delete("/api/v1/landed-cost/:id", ...)

// Scenario endpoints
app.get("/api/v1/landed-cost/scenarios", ...)
app.post("/api/v1/landed-cost/scenarios", ...)
app.post("/api/v1/landed-cost/scenarios/:id/apply", ...)

// Benchmark endpoints
app.get("/api/v1/landed-cost/benchmarks", ...)

// Export endpoints
app.get("/api/v1/landed-cost/:id/export/excel", ...)
app.get("/api/v1/landed-cost/:id/export/pdf", ...)

// Utility endpoints
app.get("/api/v1/landed-cost/validate-hs-code", ...)
app.get("/api/v1/landed-cost/tariff-rates", ...)
```

---

### High-Level Request Flow

#### Calculate Request Flow
```
Client Request
  ↓
server/routes.ts - POST /api/v1/landed-cost/calculate
  ↓ (validate inputs, authenticate)
server/services/landedCostService.ts - calculateLandedCost()
  ↓ (orchestrate calculations)
  ├→ server/services/tariffService.ts - getTariffRate()
  ├→ server/services/freightRateService.ts - getOceanFreightFCL()
  ├→ server/services/freightRateService.ts - getAirFreight()
  └→ server/services/landedCostService.ts - aggregateTotal()
  ↓ (return calculation result)
server/routes.ts - Return JSON response
```

#### Save Request Flow
```
Client Request
  ↓
server/routes.ts - POST /api/v1/landed-cost
  ↓ (validate inputs, authenticate)
server/storage.ts - createLandedCostCalculation()
  ↓ (save to database)
server/routes.ts - Return saved calculation ID
```

#### Get Request Flow
```
Client Request
  ↓
server/routes.ts - GET /api/v1/landed-cost/:id
  ↓ (authenticate, check ownership)
server/storage.ts - getLandedCostCalculation()
  ↓ (fetch from database)
server/routes.ts - Return calculation data
```

#### Benchmark Request Flow
```
Client Request
  ↓
server/routes.ts - GET /api/v1/landed-cost/benchmarks
  ↓ (validate query params)
server/services/benchmarkService.ts - getBenchmarks()
  ↓ (query historical data)
server/storage.ts - getUserLandedCostCalculations() (or direct query)
  ↓ (aggregate data)
server/services/benchmarkService.ts - calculatePercentiles()
  ↓ (return benchmarks)
server/routes.ts - Return benchmark data
```

#### Export Request Flow
```
Client Request
  ↓
server/routes.ts - GET /api/v1/landed-cost/:id/export/excel
  ↓ (authenticate, check ownership)
server/storage.ts - getLandedCostCalculation()
  ↓ (fetch calculation data)
server/services/exportService.ts - generateExcel()
  ↓ (format data per contract)
server/routes.ts - Return file download
```

---

### Authentication Integration

**Pattern**: Use existing `getUserId()` helper
- All routes use `getUserId(req)` from `server/routes.ts` line 19
- Returns `userId` or `null`
- Check authentication before processing
- Check ownership before returning data

**Example Pattern:**
```typescript
app.get("/api/v1/landed-cost/:id", async (req, res) => {
  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  // ... rest of handler
});
```

---

### Error Handling Integration

**Pattern**: Follow existing error handling
- Try/catch blocks around service calls
- Return appropriate HTTP status codes
- Log errors to console
- Return user-friendly error messages

**Example Pattern:**
```typescript
try {
  const result = await landedCostService.calculateLandedCost(inputs);
  res.json(result);
} catch (error) {
  console.error("Error calculating landed cost:", error);
  res.status(500).json({ error: "Failed to calculate landed cost" });
}
```

---

## 4. DATA LAYER MAPPING

### Existing Tables - Can Reuse

#### `customsCalculations` Table
**Status**: Keep for backward compatibility
**Usage**: Don't modify, but new calculations go to `landedCostCalculations`
**Reason**: Existing data, may be referenced by old UI

#### `shippingEstimates` Table
**Status**: Keep for backward compatibility
**Usage**: Don't modify, but new estimates go to `landedCostCalculations`
**Reason**: Existing data, may be referenced by old UI

#### `hsCodes` Table
**Status**: Reuse for HS code lookups
**Usage**: Read-only access from `tariffService.ts`
**Reason**: HS code reference data, already exists

#### `tradeDataCache` Table
**Status**: Can reuse for caching tariff/freight data
**Usage**: Optional caching layer for external data
**Reason**: Generic cache table, can store tariff/freight rates

#### `users` Table
**Status**: Reference for user ownership
**Usage**: Foreign key in new tables
**Reason**: User authentication, already exists

---

### New Tables Required

#### `landedCostCalculations` Table
**Purpose**: Primary storage for unified landed cost calculations
**Location**: `shared/schema.ts`
**Structure**: Per data contract
- Core fields: id, userId, title, description, createdAt, updatedAt
- Input fields: productName, hsCode, originCountry, destinationCountry, productCost, quantity, incoterm, shippingMethod, containerType, weight, volume, dimensions
- Result fields: calculationResult (JSONB) - Complete breakdown per contract
- Notes fields: calculationNotes (JSONB) - Transparent notes per contract
- Benchmark fields: benchmarkData (JSONB) - P25/Median/P75 per contract

**JSONB vs Normalized:**
- Use JSONB for `calculationResult` - Complex nested structure per contract
- Use JSONB for `calculationNotes` - Flexible note structure
- Use JSONB for `benchmarkData` - Benchmark comparison data
- Normalize: Core fields (userId, dates, basic inputs)
- **Rationale**: Calculation result structure is complex and may evolve, JSONB provides flexibility

---

#### `landedCostScenarios` Table
**Purpose**: Store preset and custom scenarios
**Location**: `shared/schema.ts`
**Structure**: Per data contract
- Core fields: id, userId, name, description, scenarioType, createdAt, updatedAt
- Data fields: inputs (JSONB) - Scenario parameters per contract

**JSONB vs Normalized:**
- Use JSONB for `inputs` - Scenario parameters vary by type
- Normalize: Core fields (userId, name, type)
- **Rationale**: Scenario inputs are flexible, JSONB allows different structures

---

#### `marketBenchmarks` Table (Optional)
**Purpose**: Pre-calculated benchmark data
**Location**: `shared/schema.ts`
**Structure**: Per data contract
- Fields: hsCode, originCountry, destinationCountry, shippingMethod, containerType, percentile25, median, percentile75, sampleSize, lastUpdated

**JSONB vs Normalized:**
- Normalize all fields - Benchmark data is structured
- **Rationale**: Benchmark queries need to filter by criteria, normalization enables efficient queries

**Alternative**: Can calculate benchmarks on-the-fly from `landedCostCalculations` table instead of separate table

---

### JSONB vs Normalized Guidance

**Use JSONB For:**
- `calculationResult` - Complex nested structure, may evolve
- `calculationNotes` - Flexible note structure, varies by calculation
- `benchmarkData` - Comparison data, structure may change
- `inputs` (scenarios) - Scenario parameters vary by type

**Rationale:**
- Complex nested structures
- Structures may evolve
- Not frequently queried by nested fields
- Flexibility for future changes

**Use Normalized Tables For:**
- Core calculation metadata (userId, dates, basic inputs)
- Benchmark lookup criteria (hsCode, countries, shipping method)
- Scenario metadata (userId, name, type)

**Rationale:**
- Frequently queried fields
- Need indexes for performance
- Foreign key relationships
- Consistent structure

---

## 5. EXECUTION ORDER RECOMMENDATION

### Phase A: Data Models (Week 1)

**Order:**
1. **Type Definitions** (`shared/types/landedCost.ts`)
   - Define TypeScript interfaces matching data contract
   - Input interfaces
   - Output interfaces
   - Breakdown interfaces
   - Notes interfaces
   - **Rationale**: Types define contract, needed by all other layers

2. **Database Schema** (`shared/schema.ts`)
   - Add `landedCostCalculations` table
   - Add `landedCostScenarios` table
   - Add `marketBenchmarks` table (if using)
   - Create insert schemas with Zod
   - **Rationale**: Database structure must exist before storage layer

3. **Database Migration**
   - Create migration script
   - Run migration
   - Verify tables created
   - **Rationale**: Database must be ready before storage layer

**Why This Order:**
- Types define the contract first
- Schema implements types in database
- Migration makes schema live
- All other layers depend on data structure

---

### Phase B: Storage Layer (Week 1-2)

**Order:**
1. **Extend Storage Interface** (`server/storage.ts`)
   - Add methods to `IStorage` interface
   - Define method signatures
   - **Rationale**: Interface defines contract for storage operations

2. **Implement Storage Methods** (`server/storage.ts`)
   - Implement `createLandedCostCalculation()`
   - Implement `getUserLandedCostCalculations()`
   - Implement `getLandedCostCalculation()`
   - Implement `updateLandedCostCalculation()`
   - Implement `deleteLandedCostCalculation()`
   - Implement scenario methods
   - Implement benchmark methods
   - **Rationale**: Storage layer must exist before services can use it

3. **Test Storage Methods**
   - Unit tests for each method
   - Test with sample data
   - Verify database operations
   - **Rationale**: Verify storage layer works before building on top

**Why This Order:**
- Interface defines contract
- Implementation fulfills contract
- Testing verifies correctness
- Services depend on storage layer

---

### Phase C: External Data Services (Week 2)

**Order:**
1. **Tariff Service** (`server/services/tariffService.ts`)
   - Implement HS code validation
   - Implement tariff rate lookup
   - Implement VAT rate lookup
   - Implement additional tariffs
   - **Rationale**: Customs calculation needs tariff data

2. **Freight Rate Service** (`server/services/freightRateService.ts`)
   - Implement ocean freight FCL
   - Implement ocean freight LCL
   - Implement air freight
   - Implement port charges
   - **Rationale**: Freight calculation needs rate data

3. **Test External Services**
   - Unit tests for each service
   - Test with sample data
   - Verify rate lookups work
   - **Rationale**: Verify external data services before calculation engine

**Why This Order:**
- Tariff service needed for customs
- Freight service needed for shipping
- Both needed before calculation engine
- Test each service independently

---

### Phase D: Calculation Engine (Week 2-3)

**Order:**
1. **Core Calculation Service** (`server/services/landedCostService.ts`)
   - Implement `calculateBaseCost()` - FOB/EXW
   - Implement `calculateFreight()` - Ocean + Air
   - Implement `calculateCustoms()` - Duties + VAT
   - Implement `calculateInlandTransport()` - Origin + Destination
   - Implement `calculateInsurance()` - Cargo insurance
   - **Rationale**: Individual components must work before aggregation

2. **Aggregation Functions**
   - Implement `aggregateTotal()` - Total landed cost
   - Implement `calculateCostPerUnit()` - Per-unit cost
   - Implement `generateBreakdown()` - Waterfall breakdown
   - **Rationale**: Aggregation depends on individual components

3. **Orchestration Function**
   - Implement `calculateLandedCost()` - Main function
   - Orchestrate all components
   - Generate calculation notes
   - **Rationale**: Main function ties everything together

4. **Test Calculation Engine**
   - Unit tests for each component
   - Integration tests for full calculation
   - Test edge cases
   - **Rationale**: Verify calculation accuracy

**Why This Order:**
- Components must work individually
- Aggregation depends on components
- Orchestration depends on aggregation
- Test each layer before moving to next

---

### Phase E: Supporting Services (Week 3-4)

**Order:**
1. **Benchmark Service** (`server/services/benchmarkService.ts`)
   - Implement benchmark calculation
   - Implement comparison logic
   - **Rationale**: Benchmarks need historical data (calculations must exist first)

2. **Scenario Service** (`server/services/scenarioService.ts`)
   - Implement preset scenarios
   - Implement scenario application
   - **Rationale**: Scenarios apply to calculations (calculations must exist first)

3. **Export Service** (`server/services/exportService.ts`)
   - Implement Excel export
   - Implement PDF export
   - **Rationale**: Exports need calculation data (calculations must exist first)

4. **Test Supporting Services**
   - Unit tests for each service
   - Test with sample calculations
   - **Rationale**: Verify supporting services work correctly

**Why This Order:**
- All depend on calculation engine existing
- Benchmarks need historical calculations
- Scenarios apply to calculations
- Exports format calculation data

---

### Phase F: API Layer (Week 4)

**Order:**
1. **Core API Endpoints** (`server/routes.ts`)
   - POST /api/v1/landed-cost/calculate
   - POST /api/v1/landed-cost (save)
   - GET /api/v1/landed-cost (list)
   - GET /api/v1/landed-cost/:id
   - PATCH /api/v1/landed-cost/:id
   - DELETE /api/v1/landed-cost/:id
   - **Rationale**: Core CRUD operations first

2. **Supporting API Endpoints**
   - GET /api/v1/landed-cost/scenarios
   - POST /api/v1/landed-cost/scenarios
   - POST /api/v1/landed-cost/scenarios/:id/apply
   - GET /api/v1/landed-cost/benchmarks
   - **Rationale**: Supporting features after core

3. **Export API Endpoints**
   - GET /api/v1/landed-cost/:id/export/excel
   - GET /api/v1/landed-cost/:id/export/pdf
   - **Rationale**: Exports depend on calculations existing

4. **Utility API Endpoints**
   - GET /api/v1/landed-cost/validate-hs-code
   - GET /api/v1/landed-cost/tariff-rates
   - **Rationale**: Utilities support main features

5. **Test API Layer**
   - Integration tests for each endpoint
   - Test authentication
   - Test error handling
   - **Rationale**: Verify API works end-to-end

**Why This Order:**
- Core operations enable basic functionality
- Supporting features enhance core
- Exports depend on data existing
- Utilities support all features
- Test each layer before moving to next

---

### Overall Rationale

**Bottom-Up Approach:**
- Data models → Storage → Services → API
- Each layer depends on previous layer
- Can't build API without services
- Can't build services without storage
- Can't build storage without data models

**Dependency Chain:**
1. Types define contract
2. Schema implements types
3. Storage accesses schema
4. Services use storage
5. API calls services

**Testing Strategy:**
- Test each layer before building next
- Unit tests for services
- Integration tests for API
- Verify data flow end-to-end

---

## 6. MULTI-PLATFORM CONSIDERATIONS

### Web, iOS, PDF, Excel Support

**API-First Design:**
- All platforms consume same API endpoints
- No platform-specific backend logic
- Consistent data contract across platforms

**Export Services:**
- Excel/PDF exports handled server-side
- Web/iOS consume same calculation API
- Export endpoints return files (not platform-specific)

**Data Format:**
- JSON responses for web/iOS
- File downloads for PDF/Excel
- Same calculation logic for all platforms

**Authentication:**
- Same auth system for all platforms
- Session-based (web) or token-based (iOS)
- No platform-specific auth logic

---

## Summary

**Module Structure:**
- 6 new services (calculation, tariff, freight, benchmark, scenario, export)
- Storage layer extension (add methods, don't modify existing)
- API layer extension (add routes, follow existing patterns)
- 3 new database tables (landedCostCalculations, scenarios, benchmarks)

**Integration Points:**
- Storage layer: Extend `server/storage.ts`
- API layer: Extend `server/routes.ts`
- Schema: Extend `shared/schema.ts`
- Types: Create `shared/types/landedCost.ts`

**Execution Order:**
- Data models → Storage → External services → Calculation engine → Supporting services → API layer
- Test each layer before building next
- Bottom-up approach ensures dependencies are met

**Critical Constraints:**
- Don't modify existing production systems
- Follow existing patterns
- Maintain separation of concerns
- API-first design for multi-platform support
