# V1 Landed Cost Engine - Backend Service Skeletons

## Overview

This document provides the complete service structure and function stubs for the V1 Landed Cost Engine. All business logic, calculations, and formulas are defined in the immutable calculation specification and must NOT be implemented here.

**Purpose**: Provide structural scaffolding for backend engineers to implement calculation logic line-by-line according to the specification.

---

## 1. SERVICE FILE STRUCTURE

### Directory: `/server/services/landedCost/`

```
server/services/landedCost/
├── index.ts                          # Public exports
├── orchestrator.ts                   # Main orchestration service
├── baseCostService.ts               # FOB/EXW base cost calculations
├── freightService.ts                # Ocean (FCL/LCL) + Air freight
├── customsService.ts                # Customs duties + VAT + additional tariffs
├── inlandTransportService.ts        # Origin + destination transport
├── insuranceService.ts              # Cargo insurance
├── aggregationService.ts            # Total landed cost + per-unit aggregation
├── breakdownService.ts              # Cost breakdown waterfall generation
├── notesService.ts                  # Calculation notes generation
├── types.ts                         # Shared TypeScript types/interfaces
└── constants.ts                     # Versioning, rounding policy placeholders
```

### Service Responsibilities

**orchestrator.ts**
- Coordinates execution order
- Manages parallel vs sequential execution
- Handles error propagation
- Returns complete calculation result

**baseCostService.ts**
- FOB cost normalization
- EXW cost normalization
- Incoterm conversion logic
- Base cost validation

**freightService.ts**
- Ocean freight FCL calculation
- Ocean freight LCL calculation
- Air freight calculation
- Volumetric weight calculation
- Port-to-port route handling

**customsService.ts**
- HS code validation
- Tariff rate lookup
- Import duty calculation
- VAT/GST calculation
- Additional tariffs (anti-dumping, countervailing)
- MPF/HMF calculations (US-specific)

**inlandTransportService.ts**
- Origin port transport calculation
- Destination port to final destination
- Transport mode handling (truck, rail, etc.)

**insuranceService.ts**
- Cargo insurance calculation
- Insurance rate determination
- CIF value calculation for insurance base

**aggregationService.ts**
- Total landed cost calculation
- Per-unit cost calculation
- Cost component summation
- Currency conversion (if needed)

**breakdownService.ts**
- Waterfall breakdown structure generation
- Cost component ordering
- Percentage calculations
- Visualization data preparation

**notesService.ts**
- Transparent calculation notes generation
- Assumption documentation
- Data source attribution
- Estimate vs actual flags

**types.ts**
- All TypeScript interfaces
- Input/output types
- Calculation result structures

**constants.ts**
- Calculation version constant
- Rounding policy declaration
- Data snapshot timestamp handling

---

## 2. ORCHESTRATOR SKELETON

### Execution Order Structure

```
orchestrator.calculateLandedCost()
  │
  ├─ [SEQUENTIAL] Input Validation
  │   └─ validateInputs()
  │
  ├─ [SEQUENTIAL] Base Cost Calculation
  │   └─ baseCostService.calculateBaseCost()
  │
  ├─ [PARALLEL GROUP 1] Freight + Insurance (can run simultaneously)
  │   ├─ freightService.calculateFreight()
  │   └─ insuranceService.calculateInsurance() (depends on CIF value)
  │
  ├─ [SEQUENTIAL] Customs Calculation (depends on CIF value)
  │   └─ customsService.calculateCustoms()
  │
  ├─ [SEQUENTIAL] Inland Transport (depends on freight method)
  │   └─ inlandTransportService.calculateInlandTransport()
  │
  ├─ [SEQUENTIAL] Aggregation
  │   └─ aggregationService.aggregateTotal()
  │
  ├─ [SEQUENTIAL] Breakdown Generation
  │   └─ breakdownService.generateBreakdown()
  │
  └─ [SEQUENTIAL] Notes Generation
      └─ notesService.generateNotes()
```

### Error Flow

- **Blocking Errors**: Input validation, base cost (stops execution)
- **Non-Blocking Errors**: Freight, customs, transport (continue with defaults/estimates, flag in notes)
- **Aggregation Errors**: Always blocking (cannot proceed without total)

---

## 3. FUNCTION STUBS

### types.ts

```typescript
/**
 * Core input structure for landed cost calculation.
 * Matches the immutable calculation specification input contract.
 */
export interface LandedCostInput {
  // Product information
  productName: string;
  hsCode: string;
  category?: string;
  
  // Cost information
  baseCost: number; // FOB or EXW cost
  incoterm: 'FOB' | 'EXW' | 'CIF' | 'DDP';
  quantity: number;
  currency: string;
  
  // Origin/Destination
  originCountry: string;
  destinationCountry: string;
  originPort?: string;
  destinationPort?: string;
  
  // Shipping method
  shippingMethod: 'sea_fcl' | 'sea_lcl' | 'air' | 'express';
  containerType?: '20ft' | '40ft';
  
  // Dimensions/Weight
  weight?: number; // kg
  volume?: number; // CBM
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  
  // Additional parameters
  insuranceRate?: number; // Override default insurance rate
  inlandTransportOrigin?: number; // Override origin transport cost
  inlandTransportDestination?: number; // Override destination transport cost
}

/**
 * Complete landed cost calculation result.
 * Matches the immutable calculation specification output contract.
 */
export interface LandedCostResult {
  // Metadata
  calculationVersion: string;
  dataSnapshotTimestamp: string;
  calculationTimestamp: string;
  
  // Base costs
  baseCost: {
    fobCost: number;
    exwCost: number;
    normalizedCost: number;
    currency: string;
  };
  
  // Freight costs
  freight: {
    oceanFCL?: number;
    oceanLCL?: number;
    airFreight?: number;
    express?: number;
    selectedMethod: string;
    selectedCost: number;
  };
  
  // Customs
  customs: {
    importDuty: number;
    vat: number;
    additionalTariffs: Array<{
      name: string;
      rate: number;
      amount: number;
    }>;
    mpf?: number; // US-specific
    hmf?: number; // US-specific
    totalCustomsFees: number;
  };
  
  // Additional costs
  inlandTransport: {
    origin: number;
    destination: number;
    total: number;
  };
  
  insurance: {
    rate: number;
    amount: number;
    cifValue: number;
  };
  
  // Aggregation
  totals: {
    totalLandedCost: number;
    costPerUnit: number;
    currency: string;
  };
  
  // Breakdown
  breakdown: CostBreakdownItem[];
  
  // Notes
  notes: CalculationNote[];
}

/**
 * Cost breakdown waterfall item.
 */
export interface CostBreakdownItem {
  component: string;
  amount: number;
  percentage: number;
  cumulativeAmount: number;
  cumulativePercentage: number;
}

/**
 * Calculation note for transparency.
 */
export interface CalculationNote {
  category: 'assumption' | 'estimate' | 'actual' | 'warning' | 'info';
  component: string;
  message: string;
  dataSource?: string;
  timestamp?: string;
}

/**
 * Benchmark comparison data (P25/Median/P75).
 */
export interface BenchmarkData {
  percentile25: number;
  median: number;
  percentile75: number;
  sampleSize: number;
  comparison: {
    userValue: number;
    vsMedian: number; // Percentage difference
    percentile: 'below_p25' | 'p25_to_median' | 'median_to_p75' | 'above_p75';
  };
}
```

### constants.ts

```typescript
/**
 * Calculation specification version.
 * Update when calculation logic changes per specification.
 * Format: "v1.0.0" (semantic versioning)
 */
export const CALCULATION_VERSION = "v1.0.0";

/**
 * Data snapshot timestamp.
 * Represents when external data (tariff rates, freight rates) was last updated.
 * Format: ISO 8601 timestamp
 */
export const DATA_SNAPSHOT_TIMESTAMP = "2024-01-01T00:00:00Z"; // Placeholder

/**
 * Rounding policy declaration.
 * 
 * Per calculation specification:
 * - All monetary values rounded to 2 decimal places
 * - All percentages rounded to 4 decimal places
 * - All weights rounded to 2 decimal places (kg)
 * - All volumes rounded to 4 decimal places (CBM)
 * 
 * Implementation must follow specification exactly.
 */
export const ROUNDING_POLICY = {
  monetary: 2,      // Decimal places for currency
  percentage: 4,    // Decimal places for percentages
  weight: 2,        // Decimal places for weight (kg)
  volume: 4,        // Decimal places for volume (CBM)
  quantity: 0,      // Decimal places for quantity (whole units)
} as const;

/**
 * Error handling policy.
 * Defines which errors are blocking vs non-blocking.
 */
export const ERROR_POLICY = {
  BLOCKING: [
    'INVALID_INPUT',
    'MISSING_BASE_COST',
    'AGGREGATION_FAILED',
  ],
  NON_BLOCKING: [
    'FREIGHT_RATE_UNAVAILABLE',
    'TARIFF_RATE_UNAVAILABLE',
    'INSURANCE_RATE_UNAVAILABLE',
    'TRANSPORT_RATE_UNAVAILABLE',
  ],
} as const;
```

### baseCostService.ts

```typescript
import type { LandedCostInput } from './types';

/**
 * Base cost calculation result.
 */
export interface BaseCostResult {
  fobCost: number;
  exwCost: number;
  normalizedCost: number; // Cost normalized to FOB for calculation
  currency: string;
  notes: string[];
}

/**
 * Calculate base product cost (FOB/EXW).
 * 
 * Reference: Calculation Specification Section 2.1 - Base Cost Calculation
 * 
 * @param input - Landed cost input parameters
 * @returns Base cost calculation result
 * @throws Error if base cost cannot be calculated (blocking error)
 */
export function calculateBaseCost(input: LandedCostInput): BaseCostResult {
  // Implementation must follow Calculation Specification Section 2.1
  throw new Error("Not implemented - see Calculation Specification Section 2.1");
}

/**
 * Normalize incoterm to FOB equivalent.
 * 
 * Reference: Calculation Specification Section 2.1.1 - Incoterm Conversion
 * 
 * @param cost - Base cost value
 * @param incoterm - Original incoterm
 * @returns FOB-normalized cost
 */
export function normalizeToFOB(cost: number, incoterm: string): number {
  // Implementation must follow Calculation Specification Section 2.1.1
  throw new Error("Not implemented - see Calculation Specification Section 2.1.1");
}

/**
 * Validate base cost input.
 * 
 * @param input - Landed cost input parameters
 * @throws Error if validation fails (blocking error)
 */
export function validateBaseCost(input: LandedCostInput): void {
  // Implementation must follow Calculation Specification Section 2.1 - Validation Rules
  throw new Error("Not implemented - see Calculation Specification Section 2.1");
}
```

### freightService.ts

```typescript
import type { LandedCostInput } from './types';

/**
 * Freight calculation result.
 */
export interface FreightResult {
  oceanFCL?: {
    cost20ft: number;
    cost40ft: number;
    selectedCost: number;
    containerType: '20ft' | '40ft';
  };
  oceanLCL?: {
    costPerCBM: number;
    totalCost: number;
    volume: number;
  };
  airFreight?: {
    costPerKg: number;
    volumetricWeight: number;
    chargeableWeight: number;
    totalCost: number;
  };
  express?: {
    costPerKg: number;
    totalCost: number;
  };
  selectedMethod: string;
  selectedCost: number;
  notes: string[];
}

/**
 * Calculate ocean freight (FCL).
 * 
 * Reference: Calculation Specification Section 3.1 - Ocean Freight FCL
 * 
 * @param input - Landed cost input parameters
 * @returns Ocean freight FCL calculation result
 */
export function calculateOceanFreightFCL(input: LandedCostInput): FreightResult['oceanFCL'] {
  // Implementation must follow Calculation Specification Section 3.1
  throw new Error("Not implemented - see Calculation Specification Section 3.1");
}

/**
 * Calculate ocean freight (LCL).
 * 
 * Reference: Calculation Specification Section 3.2 - Ocean Freight LCL
 * 
 * @param input - Landed cost input parameters
 * @returns Ocean freight LCL calculation result
 */
export function calculateOceanFreightLCL(input: LandedCostInput): FreightResult['oceanLCL'] {
  // Implementation must follow Calculation Specification Section 3.2
  throw new Error("Not implemented - see Calculation Specification Section 3.2");
}

/**
 * Calculate air freight.
 * 
 * Reference: Calculation Specification Section 3.3 - Air Freight
 * 
 * @param input - Landed cost input parameters
 * @returns Air freight calculation result
 */
export function calculateAirFreight(input: LandedCostInput): FreightResult['airFreight'] {
  // Implementation must follow Calculation Specification Section 3.3
  throw new Error("Not implemented - see Calculation Specification Section 3.3");
}

/**
 * Calculate volumetric weight for air freight.
 * 
 * Reference: Calculation Specification Section 3.3.1 - Volumetric Weight
 * 
 * @param volume - Volume in CBM
 * @returns Volumetric weight in kg
 */
export function calculateVolumetricWeight(volume: number): number {
  // Implementation must follow Calculation Specification Section 3.3.1
  throw new Error("Not implemented - see Calculation Specification Section 3.3.1");
}

/**
 * Calculate chargeable weight (greater of actual or volumetric).
 * 
 * Reference: Calculation Specification Section 3.3.2 - Chargeable Weight
 * 
 * @param actualWeight - Actual weight in kg
 * @param volumetricWeight - Volumetric weight in kg
 * @returns Chargeable weight in kg
 */
export function calculateChargeableWeight(actualWeight: number, volumetricWeight: number): number {
  // Implementation must follow Calculation Specification Section 3.3.2
  throw new Error("Not implemented - see Calculation Specification Section 3.3.2");
}

/**
 * Calculate total freight cost based on shipping method.
 * 
 * Reference: Calculation Specification Section 3 - Freight Calculation
 * 
 * @param input - Landed cost input parameters
 * @returns Complete freight calculation result
 */
export function calculateFreight(input: LandedCostInput): FreightResult {
  // Implementation must follow Calculation Specification Section 3
  throw new Error("Not implemented - see Calculation Specification Section 3");
}
```

### customsService.ts

```typescript
import type { LandedCostInput } from './types';

/**
 * Customs calculation result.
 */
export interface CustomsResult {
  hsCode: string;
  hsCodeDescription: string;
  importDuty: {
    rate: number;
    amount: number;
    baseValue: number; // CIF value for duty calculation
  };
  vat: {
    rate: number;
    amount: number;
    baseValue: number; // CIF + duty for VAT calculation
  };
  additionalTariffs: Array<{
    name: string;
    type: 'anti_dumping' | 'countervailing' | 'safeguard' | 'other';
    rate: number;
    amount: number;
  }>;
  mpf?: {
    rate: number;
    amount: number;
    min: number;
    max: number;
  };
  hmf?: {
    rate: number;
    amount: number;
  };
  totalCustomsFees: number;
  notes: string[];
}

/**
 * Validate HS code format and existence.
 * 
 * Reference: Calculation Specification Section 4.1 - HS Code Validation
 * 
 * @param hsCode - HS code to validate
 * @returns Validation result with description if valid
 * @throws Error if HS code is invalid (blocking error)
 */
export function validateHSCode(hsCode: string): { valid: boolean; description: string } {
  // Implementation must follow Calculation Specification Section 4.1
  throw new Error("Not implemented - see Calculation Specification Section 4.1");
}

/**
 * Get tariff rate for HS code and country pair.
 * 
 * Reference: Calculation Specification Section 4.2 - Tariff Rate Lookup
 * 
 * @param hsCode - HS code
 * @param originCountry - Origin country
 * @param destinationCountry - Destination country
 * @returns Tariff rate (percentage as decimal, e.g., 0.25 for 25%)
 */
export function getTariffRate(hsCode: string, originCountry: string, destinationCountry: string): number {
  // Implementation must follow Calculation Specification Section 4.2
  throw new Error("Not implemented - see Calculation Specification Section 4.2");
}

/**
 * Get VAT/GST rate for destination country.
 * 
 * Reference: Calculation Specification Section 4.3 - VAT/GST Rate
 * 
 * @param destinationCountry - Destination country
 * @returns VAT/GST rate (percentage as decimal)
 */
export function getVATRate(destinationCountry: string): number {
  // Implementation must follow Calculation Specification Section 4.3
  throw new Error("Not implemented - see Calculation Specification Section 4.3");
}

/**
 * Get additional tariffs (anti-dumping, countervailing, etc.).
 * 
 * Reference: Calculation Specification Section 4.4 - Additional Tariffs
 * 
 * @param hsCode - HS code
 * @param originCountry - Origin country
 * @param destinationCountry - Destination country
 * @param cifValue - CIF value for tariff calculation
 * @returns Array of additional tariffs
 */
export function getAdditionalTariffs(
  hsCode: string,
  originCountry: string,
  destinationCountry: string,
  cifValue: number
): CustomsResult['additionalTariffs'] {
  // Implementation must follow Calculation Specification Section 4.4
  throw new Error("Not implemented - see Calculation Specification Section 4.4");
}

/**
 * Calculate MPF (Merchandise Processing Fee) for US imports.
 * 
 * Reference: Calculation Specification Section 4.5 - MPF Calculation (US-specific)
 * 
 * @param cifValue - CIF value
 * @returns MPF calculation result
 */
export function calculateMPF(cifValue: number): CustomsResult['mpf'] {
  // Implementation must follow Calculation Specification Section 4.5
  throw new Error("Not implemented - see Calculation Specification Section 4.5");
}

/**
 * Calculate HMF (Harbor Maintenance Fee) for US imports.
 * 
 * Reference: Calculation Specification Section 4.6 - HMF Calculation (US-specific)
 * 
 * @param cifValue - CIF value
 * @returns HMF calculation result
 */
export function calculateHMF(cifValue: number): CustomsResult['hmf'] {
  // Implementation must follow Calculation Specification Section 4.6
  throw new Error("Not implemented - see Calculation Specification Section 4.6");
}

/**
 * Calculate complete customs fees.
 * 
 * Reference: Calculation Specification Section 4 - Customs Calculation
 * 
 * @param input - Landed cost input parameters
 * @param cifValue - CIF value (product + freight + insurance)
 * @returns Complete customs calculation result
 */
export function calculateCustoms(input: LandedCostInput, cifValue: number): CustomsResult {
  // Implementation must follow Calculation Specification Section 4
  throw new Error("Not implemented - see Calculation Specification Section 4");
}
```

### inlandTransportService.ts

```typescript
import type { LandedCostInput } from './types';

/**
 * Inland transport calculation result.
 */
export interface InlandTransportResult {
  origin: {
    cost: number;
    distance?: number; // km
    method?: string; // truck, rail, etc.
    notes: string[];
  };
  destination: {
    cost: number;
    distance?: number; // km
    method?: string; // truck, rail, etc.
    notes: string[];
  };
  total: number;
}

/**
 * Calculate origin port transport cost.
 * 
 * Reference: Calculation Specification Section 5.1 - Origin Inland Transport
 * 
 * @param input - Landed cost input parameters
 * @returns Origin transport calculation result
 */
export function calculateOriginTransport(input: LandedCostInput): InlandTransportResult['origin'] {
  // Implementation must follow Calculation Specification Section 5.1
  throw new Error("Not implemented - see Calculation Specification Section 5.1");
}

/**
 * Calculate destination port to final destination transport cost.
 * 
 * Reference: Calculation Specification Section 5.2 - Destination Inland Transport
 * 
 * @param input - Landed cost input parameters
 * @returns Destination transport calculation result
 */
export function calculateDestinationTransport(input: LandedCostInput): InlandTransportResult['destination'] {
  // Implementation must follow Calculation Specification Section 5.2
  throw new Error("Not implemented - see Calculation Specification Section 5.2");
}

/**
 * Calculate complete inland transport cost.
 * 
 * Reference: Calculation Specification Section 5 - Inland Transport
 * 
 * @param input - Landed cost input parameters
 * @returns Complete inland transport calculation result
 */
export function calculateInlandTransport(input: LandedCostInput): InlandTransportResult {
  // Implementation must follow Calculation Specification Section 5
  throw new Error("Not implemented - see Calculation Specification Section 5");
}
```

### insuranceService.ts

```typescript
import type { LandedCostInput } from './types';

/**
 * Insurance calculation result.
 */
export interface InsuranceResult {
  rate: number; // Insurance rate (percentage as decimal)
  amount: number;
  cifValue: number; // CIF value used as insurance base
  notes: string[];
}

/**
 * Calculate CIF value (Cost + Insurance + Freight).
 * 
 * Reference: Calculation Specification Section 6.1 - CIF Value Calculation
 * 
 * @param baseCost - Base product cost (FOB)
 * @param freightCost - Freight cost
 * @returns CIF value
 */
export function calculateCIFValue(baseCost: number, freightCost: number): number {
  // Implementation must follow Calculation Specification Section 6.1
  throw new Error("Not implemented - see Calculation Specification Section 6.1");
}

/**
 * Get insurance rate (default or override).
 * 
 * Reference: Calculation Specification Section 6.2 - Insurance Rate
 * 
 * @param input - Landed cost input parameters
 * @returns Insurance rate (percentage as decimal)
 */
export function getInsuranceRate(input: LandedCostInput): number {
  // Implementation must follow Calculation Specification Section 6.2
  throw new Error("Not implemented - see Calculation Specification Section 6.2");
}

/**
 * Calculate cargo insurance.
 * 
 * Reference: Calculation Specification Section 6 - Insurance Calculation
 * 
 * @param input - Landed cost input parameters
 * @param cifValue - CIF value
 * @returns Insurance calculation result
 */
export function calculateInsurance(input: LandedCostInput, cifValue: number): InsuranceResult {
  // Implementation must follow Calculation Specification Section 6
  throw new Error("Not implemented - see Calculation Specification Section 6");
}
```

### aggregationService.ts

```typescript
import type { LandedCostInput, LandedCostResult } from './types';
import type { BaseCostResult } from './baseCostService';
import type { FreightResult } from './freightService';
import type { CustomsResult } from './customsService';
import type { InlandTransportResult } from './inlandTransportService';
import type { InsuranceResult } from './insuranceService';

/**
 * Calculate total landed cost.
 * 
 * Reference: Calculation Specification Section 7.1 - Total Landed Cost Aggregation
 * 
 * @param components - All cost components
 * @returns Total landed cost
 * @throws Error if aggregation fails (blocking error)
 */
export function calculateTotalLandedCost(components: {
  baseCost: BaseCostResult;
  freight: FreightResult;
  customs: CustomsResult;
  inlandTransport: InlandTransportResult;
  insurance: InsuranceResult;
}): number {
  // Implementation must follow Calculation Specification Section 7.1
  throw new Error("Not implemented - see Calculation Specification Section 7.1");
}

/**
 * Calculate per-unit cost.
 * 
 * Reference: Calculation Specification Section 7.2 - Per-Unit Cost Calculation
 * 
 * @param totalLandedCost - Total landed cost
 * @param quantity - Product quantity
 * @returns Cost per unit
 */
export function calculateCostPerUnit(totalLandedCost: number, quantity: number): number {
  // Implementation must follow Calculation Specification Section 7.2
  throw new Error("Not implemented - see Calculation Specification Section 7.2");
}

/**
 * Aggregate all cost components into final result.
 * 
 * Reference: Calculation Specification Section 7 - Aggregation
 * 
 * @param input - Landed cost input parameters
 * @param components - All calculated cost components
 * @returns Aggregated totals
 */
export function aggregateTotal(
  input: LandedCostInput,
  components: {
    baseCost: BaseCostResult;
    freight: FreightResult;
    customs: CustomsResult;
    inlandTransport: InlandTransportResult;
    insurance: InsuranceResult;
  }
): LandedCostResult['totals'] {
  // Implementation must follow Calculation Specification Section 7
  throw new Error("Not implemented - see Calculation Specification Section 7");
}
```

### breakdownService.ts

```typescript
import type { CostBreakdownItem, LandedCostResult } from './types';
import type { BaseCostResult } from './baseCostService';
import type { FreightResult } from './freightService';
import type { CustomsResult } from './customsService';
import type { InlandTransportResult } from './inlandTransportService';
import type { InsuranceResult } from './insuranceService';

/**
 * Generate cost breakdown waterfall.
 * 
 * Reference: Calculation Specification Section 8 - Cost Breakdown Waterfall
 * 
 * @param components - All cost components
 * @param totalLandedCost - Total landed cost for percentage calculation
 * @returns Cost breakdown waterfall items
 */
export function generateBreakdown(
  components: {
    baseCost: BaseCostResult;
    freight: FreightResult;
    customs: CustomsResult;
    inlandTransport: InlandTransportResult;
    insurance: InsuranceResult;
  },
  totalLandedCost: number
): CostBreakdownItem[] {
  // Implementation must follow Calculation Specification Section 8
  throw new Error("Not implemented - see Calculation Specification Section 8");
}

/**
 * Calculate component percentage of total.
 * 
 * Reference: Calculation Specification Section 8.1 - Percentage Calculation
 * 
 * @param componentAmount - Component cost amount
 * @param totalAmount - Total landed cost
 * @returns Percentage (0-100)
 */
export function calculatePercentage(componentAmount: number, totalAmount: number): number {
  // Implementation must follow Calculation Specification Section 8.1
  throw new Error("Not implemented - see Calculation Specification Section 8.1");
}

/**
 * Calculate cumulative amounts for waterfall visualization.
 * 
 * Reference: Calculation Specification Section 8.2 - Cumulative Calculation
 * 
 * @param breakdownItems - Breakdown items in order
 * @returns Breakdown items with cumulative values
 */
export function calculateCumulative(breakdownItems: CostBreakdownItem[]): CostBreakdownItem[] {
  // Implementation must follow Calculation Specification Section 8.2
  throw new Error("Not implemented - see Calculation Specification Section 8.2");
}
```

### notesService.ts

```typescript
import type { CalculationNote, LandedCostResult } from './types';
import type { BaseCostResult } from './baseCostService';
import type { FreightResult } from './freightService';
import type { CustomsResult } from './customsService';
import type { InlandTransportResult } from './inlandTransportService';
import type { InsuranceResult } from './insuranceService';

/**
 * Generate calculation notes for transparency.
 * 
 * Reference: Calculation Specification Section 9 - Calculation Notes
 * 
 * @param input - Original input parameters
 * @param components - All calculated cost components
 * @param calculationVersion - Calculation version
 * @param dataSnapshotTimestamp - Data snapshot timestamp
 * @returns Array of calculation notes
 */
export function generateNotes(
  input: any, // LandedCostInput
  components: {
    baseCost: BaseCostResult;
    freight: FreightResult;
    customs: CustomsResult;
    inlandTransport: InlandTransportResult;
    insurance: InsuranceResult;
  },
  calculationVersion: string,
  dataSnapshotTimestamp: string
): CalculationNote[] {
  // Implementation must follow Calculation Specification Section 9
  throw new Error("Not implemented - see Calculation Specification Section 9");
}

/**
 * Generate note for a specific component.
 * 
 * Reference: Calculation Specification Section 9.1 - Component Notes
 * 
 * @param component - Component name
 * @param value - Component value
 * @param dataSource - Data source (if applicable)
 * @param isEstimate - Whether value is estimate or actual
 * @returns Calculation note
 */
export function generateComponentNote(
  component: string,
  value: number,
  dataSource?: string,
  isEstimate?: boolean
): CalculationNote {
  // Implementation must follow Calculation Specification Section 9.1
  throw new Error("Not implemented - see Calculation Specification Section 9.1");
}
```

### orchestrator.ts

```typescript
import type { LandedCostInput, LandedCostResult } from './types';
import { CALCULATION_VERSION, DATA_SNAPSHOT_TIMESTAMP, ERROR_POLICY } from './constants';

// Import all service functions
import { validateBaseCost, calculateBaseCost } from './baseCostService';
import { calculateFreight } from './freightService';
import { calculateCustoms } from './customsService';
import { calculateInlandTransport } from './inlandTransportService';
import { calculateInsurance, calculateCIFValue } from './insuranceService';
import { aggregateTotal, calculateTotalLandedCost, calculateCostPerUnit } from './aggregationService';
import { generateBreakdown } from './breakdownService';
import { generateNotes } from './notesService';

/**
 * Main orchestration function for landed cost calculation.
 * 
 * Execution order:
 * 1. Input validation (blocking)
 * 2. Base cost calculation (blocking)
 * 3. Parallel: Freight + Insurance (CIF calculation)
 * 4. Sequential: Customs (depends on CIF)
 * 5. Sequential: Inland transport (depends on freight method)
 * 6. Sequential: Aggregation (blocking)
 * 7. Sequential: Breakdown generation
 * 8. Sequential: Notes generation
 * 
 * Reference: Calculation Specification Section 1 - Execution Order
 * 
 * @param input - Landed cost input parameters
 * @returns Complete landed cost calculation result
 * @throws Error if blocking error occurs
 */
export async function calculateLandedCost(input: LandedCostInput): Promise<LandedCostResult> {
  // Step 1: Input Validation (BLOCKING)
  validateBaseCost(input);
  
  // Step 2: Base Cost Calculation (BLOCKING)
  const baseCost = calculateBaseCost(input);
  
  // Step 3: Parallel Group - Freight + Insurance
  // Note: Insurance depends on CIF value, which needs freight cost
  // So freight must complete first, then insurance can calculate
  const freight = calculateFreight(input);
  
  // Calculate CIF value for insurance and customs
  const cifValue = calculateCIFValue(baseCost.normalizedCost, freight.selectedCost);
  
  // Now calculate insurance (depends on CIF)
  const insurance = calculateInsurance(input, cifValue);
  
  // Step 4: Customs Calculation (SEQUENTIAL - depends on CIF)
  // CIF value includes: base cost + freight + insurance
  const updatedCIFValue = baseCost.normalizedCost + freight.selectedCost + insurance.amount;
  const customs = calculateCustoms(input, updatedCIFValue);
  
  // Step 5: Inland Transport (SEQUENTIAL - depends on freight method)
  const inlandTransport = calculateInlandTransport(input);
  
  // Step 6: Aggregation (BLOCKING)
  const totals = aggregateTotal(input, {
    baseCost,
    freight,
    customs,
    inlandTransport,
    insurance,
  });
  
  const totalLandedCost = calculateTotalLandedCost({
    baseCost,
    freight,
    customs,
    inlandTransport,
    insurance,
  });
  
  const costPerUnit = calculateCostPerUnit(totalLandedCost, input.quantity);
  
  // Step 7: Breakdown Generation
  const breakdown = generateBreakdown(
    {
      baseCost,
      freight,
      customs,
      inlandTransport,
      insurance,
    },
    totalLandedCost
  );
  
  // Step 8: Notes Generation
  const notes = generateNotes(
    input,
    {
      baseCost,
      freight,
      customs,
      inlandTransport,
      insurance,
    },
    CALCULATION_VERSION,
    DATA_SNAPSHOT_TIMESTAMP
  );
  
  // Assemble final result
  return {
    calculationVersion: CALCULATION_VERSION,
    dataSnapshotTimestamp: DATA_SNAPSHOT_TIMESTAMP,
    calculationTimestamp: new Date().toISOString(),
    baseCost: {
      fobCost: baseCost.fobCost,
      exwCost: baseCost.exwCost,
      normalizedCost: baseCost.normalizedCost,
      currency: baseCost.currency,
    },
    freight: {
      oceanFCL: freight.oceanFCL,
      oceanLCL: freight.oceanLCL,
      airFreight: freight.airFreight,
      express: freight.express,
      selectedMethod: freight.selectedMethod,
      selectedCost: freight.selectedCost,
    },
    customs: {
      importDuty: customs.importDuty,
      vat: customs.vat,
      additionalTariffs: customs.additionalTariffs,
      mpf: customs.mpf,
      hmf: customs.hmf,
      totalCustomsFees: customs.totalCustomsFees,
    },
    inlandTransport: {
      origin: inlandTransport.origin,
      destination: inlandTransport.destination,
      total: inlandTransport.total,
    },
    insurance: {
      rate: insurance.rate,
      amount: insurance.amount,
      cifValue: insurance.cifValue,
    },
    totals: {
      totalLandedCost,
      costPerUnit,
      currency: input.currency,
    },
    breakdown,
    notes,
  };
}

/**
 * Validate input parameters.
 * 
 * @param input - Landed cost input parameters
 * @throws Error if validation fails (blocking error)
 */
function validateInputs(input: LandedCostInput): void {
  // Basic input validation
  // Detailed validation in individual services
  if (!input.baseCost || input.baseCost <= 0) {
    throw new Error("Base cost must be greater than 0");
  }
  if (!input.quantity || input.quantity <= 0) {
    throw new Error("Quantity must be greater than 0");
  }
  if (!input.originCountry || !input.destinationCountry) {
    throw new Error("Origin and destination countries are required");
  }
  if (!input.hsCode) {
    throw new Error("HS code is required");
  }
}
```

### index.ts

```typescript
/**
 * Public exports for Landed Cost Engine services.
 * 
 * This module provides the main entry point for landed cost calculations.
 * All business logic is implemented according to the immutable calculation specification.
 */

// Main orchestrator
export { calculateLandedCost } from './orchestrator';

// Individual services (for testing and advanced usage)
export * from './baseCostService';
export * from './freightService';
export * from './customsService';
export * from './inlandTransportService';
export * from './insuranceService';
export * from './aggregationService';
export * from './breakdownService';
export * from './notesService';

// Types
export * from './types';

// Constants
export { CALCULATION_VERSION, DATA_SNAPSHOT_TIMESTAMP, ROUNDING_POLICY, ERROR_POLICY } from './constants';
```

---

## 4. DETERMINISM & VERSIONING PLACEHOLDERS

### Version Handling

**Location**: `constants.ts`

- `CALCULATION_VERSION`: String constant, semantic versioning
- `DATA_SNAPSHOT_TIMESTAMP`: ISO 8601 timestamp for external data
- Both included in every calculation result
- Used for audit trail and reproducibility

### Rounding Policy

**Location**: `constants.ts` - `ROUNDING_POLICY` object

- Defines decimal places for each data type
- Referenced in JSDoc comments
- Implementation must follow specification exactly
- No rounding logic in skeletons (implementation detail)

### Data Snapshot Handling

**Location**: `constants.ts` - `DATA_SNAPSHOT_TIMESTAMP`

- Represents when external data was last updated
- Included in calculation result metadata
- Used for transparency and audit
- Should be updated when tariff/freight data refreshes

---

## 5. TESTING HOOKS

### Unit Test Attachment Points

**Services to Test Individually:**
1. `baseCostService.ts` - All functions
2. `freightService.ts` - All functions
3. `customsService.ts` - All functions
4. `inlandTransportService.ts` - All functions
5. `insuranceService.ts` - All functions
6. `aggregationService.ts` - All functions
7. `breakdownService.ts` - All functions
8. `notesService.ts` - All functions

**Orchestrator Testing:**
- Test execution order
- Test error propagation
- Test parallel vs sequential execution
- Mock all service dependencies

### Services That Must Be Mocked

**External Data Dependencies:**
1. **Tariff Service** (`customsService.ts` dependencies)
   - `getTariffRate()` - Mock tariff rate lookups
   - `getVATRate()` - Mock VAT rate lookups
   - `getAdditionalTariffs()` - Mock additional tariff data
   - **Why**: External data source, may be unavailable in tests

2. **Freight Rate Service** (`freightService.ts` dependencies)
   - Ocean freight rate lookups
   - Air freight rate lookups
   - Port charge lookups
   - **Why**: External data source, may be unavailable in tests

3. **Transport Rate Service** (`inlandTransportService.ts` dependencies)
   - Origin transport rate lookups
   - Destination transport rate lookups
   - **Why**: External data source, may be unavailable in tests

4. **Insurance Rate Service** (`insuranceService.ts` dependencies)
   - Insurance rate lookups (if not hardcoded)
   - **Why**: External data source, may be unavailable in tests

### Deterministic Test Guarantees

**Test Data Requirements:**
- Use fixed input values
- Mock all external data sources with fixed values
- Use fixed calculation version
- Use fixed data snapshot timestamp
- **Result**: Same inputs → Same outputs (deterministic)

**Test Isolation:**
- Each service testable independently
- Mock dependencies, not implementations
- Test error handling separately
- Test edge cases (zero values, missing data, etc.)

**Test Coverage:**
- Unit tests for each function
- Integration tests for orchestrator
- Error case tests (blocking vs non-blocking)
- Edge case tests (missing optional fields, etc.)

---

## Summary

**Service Structure:**
- 9 service files + 2 utility files (types, constants)
- One responsibility per service
- Clear separation of concerns

**Orchestration:**
- Explicit execution order
- Parallel vs sequential clearly marked
- Error handling policy defined

**Function Stubs:**
- All functions have types
- JSDoc references specification sections
- Empty implementations (throw errors)

**Versioning:**
- Calculation version constant
- Data snapshot timestamp
- Rounding policy declaration

**Testing:**
- Clear test attachment points
- Mock requirements identified
- Deterministic test strategy

**Next Steps:**
- Implement calculation logic per specification
- Add unit tests
- Add integration tests
- Verify against specification
