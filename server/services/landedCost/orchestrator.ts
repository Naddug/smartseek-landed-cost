import type { LandedCostInput, LandedCostResult } from './types';
import { CALCULATION_VERSION, DATA_SNAPSHOT_TIMESTAMP } from './constants';

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
 * 3. Sequential: Freight calculation
 * 4. Sequential: CIF value calculation (depends on freight)
 * 5. Sequential: Insurance calculation (depends on CIF)
 * 6. Sequential: Customs calculation (depends on updated CIF)
 * 7. Sequential: Inland transport (depends on freight method)
 * 8. Sequential: Aggregation (blocking)
 * 9. Sequential: Breakdown generation
 * 10. Sequential: Notes generation
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
  
  // Step 3: Freight Calculation (SEQUENTIAL)
  const freight = calculateFreight(input);
  
  // Step 4: Calculate CIF value for insurance and customs
  // CIF = Cost + Insurance + Freight
  // Initial CIF = base cost + freight (insurance not yet calculated)
  const initialCIFValue = calculateCIFValue(baseCost.normalizedCost, freight.selectedCost);
  
  // Step 5: Insurance Calculation (SEQUENTIAL - depends on initial CIF)
  const insurance = calculateInsurance(input, initialCIFValue);
  
  // Step 6: Customs Calculation (SEQUENTIAL - depends on final CIF)
  // Final CIF = base cost + freight + insurance
  const finalCIFValue = baseCost.normalizedCost + freight.selectedCost + insurance.amount;
  const customs = calculateCustoms(input, finalCIFValue);
  
  // Step 7: Inland Transport (SEQUENTIAL - depends on freight method)
  const inlandTransport = calculateInlandTransport(input);
  
  // Step 8: Aggregation (BLOCKING)
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
