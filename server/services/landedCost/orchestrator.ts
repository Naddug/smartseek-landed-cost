import type { LandedCostInput, LandedCostResult } from './types';
import { CALCULATION_VERSION, DATA_SNAPSHOT_TIMESTAMP } from './constants';

import { validateBaseCost, calculateBaseCost } from './baseCostService';
import { calculateFreight } from './freightService';
import { calculateInsurance, calculateCIFValue } from './insuranceService';
import { calculateCustoms } from './customsService';

// Import types and functions explicitly
import type { BaseCostResult } from './baseCostService';
import type { FreightResult } from './freightService';
import type { CustomsResult } from './customsService';
import type { InsuranceResult } from './insuranceService';

// Define InlandTransportResult locally to avoid import issues
interface InlandTransportResult {
  origin: {
    cost: number;
    distance?: number;
    method?: string;
    notes: string[];
  };
  destination: {
    cost: number;
    distance?: number;
    method?: string;
    notes: string[];
  };
  total: number;
}

// Import individual functions from services
import { calculateInlandTransport } from './inlandTransportService';
import { calculateTotalLandedCost, calculateCostPerUnit } from './aggregationService';
import { generateBreakdown } from './breakdownService';
import { generateNotes } from './notesService';

/**
 * Main orchestration function for landed cost calculation.
 * 
 * Execution order:
 * 1. Input validation (blocking)
 * 2. Base cost calculation (blocking)
 * 3. Freight calculation
 * 4. Insurance calculation (depends on CIF value)
 * 5. Customs calculation (depends on CIF value)
 * 6. Inland transport calculation
 * 7. Aggregation (blocking)
 * 8. Breakdown generation
 * 9. Notes generation
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
  
  // Step 3: Freight Calculation
  const freight = calculateFreight(input);
  
  // Step 4: Calculate CIF value for insurance and customs
  const cifValue = calculateCIFValue(baseCost.normalizedCost, freight.selectedCost);
  
  // Step 5: Insurance Calculation
  const insurance = calculateInsurance(input, cifValue);
  
  // Step 6: Customs Calculation
  // CIF value includes: base cost + freight + insurance
  const updatedCIFValue = baseCost.normalizedCost + freight.selectedCost + insurance.amount;
  const customs = calculateCustoms(input, updatedCIFValue);
  
  // Step 7: Inland Transport
  const inlandTransport = calculateInlandTransport(input);
  
  // Step 8: Aggregation (BLOCKING)
  const totalLandedCost = calculateTotalLandedCost({
    baseCost,
    freight,
    customs,
    inlandTransport,
    insurance,
  });
  
  const costPerUnit = calculateCostPerUnit(totalLandedCost, input.quantity);
  
  // Step 9: Breakdown Generation
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
  
  // Step 10: Notes Generation
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