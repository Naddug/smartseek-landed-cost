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
export function calculateOceanFreightFCL(input: LandedCostInput): NonNullable<FreightResult['oceanFCL']> {
  if (!input.containerType) {
    throw new Error('Container type is required for FCL shipping');
  }

  // Placeholder rates - in production these would come from external rate service
  const rates = {
    '20ft': 1500,
    '40ft': 2500,
  };

  const cost20ft = rates['20ft'];
  const cost40ft = rates['40ft'];
  const selectedCost = rates[input.containerType];

  return {
    cost20ft,
    cost40ft,
    selectedCost,
    containerType: input.containerType,
  };
}

/**
 * Calculate ocean freight (LCL).
 * 
 * Reference: Calculation Specification Section 3.2 - Ocean Freight LCL
 * 
 * @param input - Landed cost input parameters
 * @returns Ocean freight LCL calculation result
 */
export function calculateOceanFreightLCL(input: LandedCostInput): NonNullable<FreightResult['oceanLCL']> {
  if (!input.volume || input.volume <= 0) {
    throw new Error('Volume is required for LCL shipping');
  }

  // Placeholder rate - in production this would come from external rate service
  const costPerCBM = 50;
  const totalCost = input.volume * costPerCBM;

  return {
    costPerCBM,
    totalCost,
    volume: input.volume,
  };
}

/**
 * Calculate air freight.
 * 
 * Reference: Calculation Specification Section 3.3 - Air Freight
 * 
 * @param input - Landed cost input parameters
 * @returns Air freight calculation result
 */
export function calculateAirFreight(input: LandedCostInput): NonNullable<FreightResult['airFreight']> {
  if (!input.weight || input.weight <= 0) {
    throw new Error('Weight is required for air freight');
  }

  if (!input.volume || input.volume <= 0) {
    throw new Error('Volume is required for air freight');
  }

  const volumetricWeight = calculateVolumetricWeight(input.volume);
  const chargeableWeight = calculateChargeableWeight(input.weight, volumetricWeight);

  // Placeholder rate - in production this would come from external rate service
  const costPerKg = 5;
  const totalCost = chargeableWeight * costPerKg;

  return {
    costPerKg,
    volumetricWeight,
    chargeableWeight,
    totalCost,
  };
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
  if (volume < 0) {
    throw new Error('Volume must be >= 0');
  }

  // Standard air freight volumetric divisor: 1 CBM = 167 kg
  return volume * 167;
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
  if (actualWeight < 0) {
    throw new Error('Actual weight must be >= 0');
  }

  if (volumetricWeight < 0) {
    throw new Error('Volumetric weight must be >= 0');
  }

  return Math.max(actualWeight, volumetricWeight);
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
  const notes: string[] = [];
  let selectedCost: number;
  let oceanFCL: FreightResult['oceanFCL'] | undefined;
  let oceanLCL: FreightResult['oceanLCL'] | undefined;
  let airFreight: FreightResult['airFreight'] | undefined;
  let express: FreightResult['express'] | undefined;

  if (input.shippingMethod === 'sea_fcl') {
    const fclResult = calculateOceanFreightFCL(input);
    oceanFCL = fclResult;
    selectedCost = fclResult.selectedCost;
    notes.push(`Ocean FCL freight calculated for ${fclResult.containerType} container`);
  } else if (input.shippingMethod === 'sea_lcl') {
    const lclResult = calculateOceanFreightLCL(input);
    oceanLCL = lclResult;
    selectedCost = lclResult.totalCost;
    notes.push(`Ocean LCL freight calculated for ${lclResult.volume} CBM`);
  } else if (input.shippingMethod === 'air') {
    const airResult = calculateAirFreight(input);
    airFreight = airResult;
    selectedCost = airResult.totalCost;
    notes.push(`Air freight calculated for ${airResult.chargeableWeight} kg chargeable weight`);
  } else if (input.shippingMethod === 'express') {
    if (!input.weight || input.weight <= 0) {
      throw new Error('Weight is required for express shipping');
    }
    // Placeholder rate - in production this would come from external rate service
    const costPerKg = 10;
    const totalCost = input.weight * costPerKg;
    express = {
      costPerKg,
      totalCost,
    };
    selectedCost = totalCost;
    notes.push(`Express shipping calculated for ${input.weight} kg`);
  } else {
    throw new Error(`Unsupported shipping method: ${input.shippingMethod}`);
  }

  return {
    oceanFCL,
    oceanLCL,
    airFreight,
    express,
    selectedMethod: input.shippingMethod,
    selectedCost,
    notes,
  };
}