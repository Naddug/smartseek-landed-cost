import type { LandedCostInput } from './types';

/**
 * Insurance calculation result.
 */
export interface InsuranceResult {
  rate: number;
  amount: number;
  cifValue: number;
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
  if (baseCost < 0) {
    throw new Error('Base cost must be >= 0');
  }

  if (freightCost < 0) {
    throw new Error('Freight cost must be >= 0');
  }

  return baseCost + freightCost;
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
  // If user provided override rate, use it
  if (input.insuranceRate !== undefined && input.insuranceRate !== null) {
    if (input.insuranceRate < 0) {
      throw new Error('Insurance rate must be >= 0');
    }
    return input.insuranceRate;
  }

  // Default insurance rate: 0.5% (0.005 as decimal)
  return 0.005;
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
  if (cifValue < 0) {
    throw new Error('CIF value must be >= 0');
  }

  const rate = getInsuranceRate(input);
  const amount = cifValue * rate;
  const notes: string[] = [];

  if (input.insuranceRate !== undefined && input.insuranceRate !== null) {
    notes.push(`Using user-provided insurance rate: ${(rate * 100).toFixed(2)}%`);
  } else {
    notes.push(`Using default insurance rate: ${(rate * 100).toFixed(2)}%`);
  }

  notes.push(`Insurance calculated on CIF value: ${cifValue.toFixed(2)} ${input.currency}`);

  return {
    rate,
    amount,
    cifValue,
    notes,
  };
}