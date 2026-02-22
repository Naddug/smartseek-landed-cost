import type { LandedCostInput } from './types';

/**
 * Base cost calculation result.
 */
export interface BaseCostResult {
  fobCost: number;
  exwCost: number;
  normalizedCost: number;
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
  validateBaseCost(input);

  const notes: string[] = [];
  let fobCost: number;
  let exwCost: number;
  let normalizedCost: number;

  if (input.incoterm === 'FOB') {
    fobCost = input.baseCost;
    exwCost = input.baseCost;
    normalizedCost = input.baseCost;
    notes.push('Base cost provided as FOB');
  } else if (input.incoterm === 'EXW') {
    exwCost = input.baseCost;
    fobCost = input.baseCost;
    normalizedCost = input.baseCost;
    notes.push('Base cost provided as EXW');
  } else if (input.incoterm === 'CIF') {
    fobCost = input.baseCost;
    exwCost = input.baseCost;
    normalizedCost = input.baseCost;
    notes.push('Base cost provided as CIF - freight and insurance will be handled separately');
  } else if (input.incoterm === 'DDP') {
    fobCost = input.baseCost;
    exwCost = input.baseCost;
    normalizedCost = input.baseCost;
    notes.push('Base cost provided as DDP - duties and taxes will be handled separately');
  } else {
    throw new Error(`Unsupported incoterm: ${input.incoterm}`);
  }

  return {
    fobCost,
    exwCost,
    normalizedCost,
    currency: input.currency,
    notes,
  };
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
  if (cost < 0) {
    throw new Error('Cost must be >= 0');
  }

  if (incoterm === 'FOB' || incoterm === 'EXW' || incoterm === 'CIF' || incoterm === 'DDP') {
    return cost;
  }

  throw new Error(`Unsupported incoterm: ${incoterm}`);
}

/**
 * Validate base cost input.
 * 
 * @param input - Landed cost input parameters
 * @throws Error if validation fails (blocking error)
 */
export function validateBaseCost(input: LandedCostInput): void {
  if (!input) {
    throw new Error('Input is required');
  }

  if (!input.baseCost || input.baseCost <= 0) {
    throw new Error('Base cost must be greater than 0');
  }

  if (!input.quantity || input.quantity <= 0) {
    throw new Error('Quantity must be greater than 0');
  }

  if (!input.currency || input.currency.trim() === '') {
    throw new Error('Currency is required');
  }

  if (!input.incoterm) {
    throw new Error('Incoterm is required');
  }

  const validIncoterms = ['FOB', 'EXW', 'CIF', 'DDP'];
  if (!validIncoterms.includes(input.incoterm)) {
    throw new Error(`Invalid incoterm: ${input.incoterm}. Must be one of: ${validIncoterms.join(', ')}`);
  }

  if (!input.originCountry || input.originCountry.trim() === '') {
    throw new Error('Origin country is required');
  }

  if (!input.destinationCountry || input.destinationCountry.trim() === '') {
    throw new Error('Destination country is required');
  }

  if (!input.hsCode || input.hsCode.trim() === '') {
    throw new Error('HS code is required');
  }
}