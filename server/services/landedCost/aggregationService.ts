import type { LandedCostInput, LandedCostResult } from './types';
import type { BaseCostResult } from './baseCostService';
import type { FreightResult } from './freightService';
import type { CustomsResult } from './customsService';
import type { InsuranceResult } from './insuranceService';

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

export function calculateTotalLandedCost(components: {
  baseCost: BaseCostResult;
  freight: FreightResult;
  customs: CustomsResult;
  inlandTransport: InlandTransportResult;
  insurance: InsuranceResult;
}): number {
  const baseCostAmount = components.baseCost.normalizedCost;
  const freightAmount = components.freight.selectedCost;
  const customsAmount = components.customs.totalCustomsFees;
  const inlandTransportAmount = components.inlandTransport.total;
  const insuranceAmount = components.insurance.amount;

  const total = baseCostAmount + freightAmount + customsAmount + inlandTransportAmount + insuranceAmount;

  if (total < 0) {
    throw new Error('Total landed cost cannot be negative');
  }

  return total;
}

export function calculateCostPerUnit(totalLandedCost: number, quantity: number): number {
  if (quantity <= 0) {
    throw new Error('Quantity must be greater than 0');
  }

  if (totalLandedCost < 0) {
    throw new Error('Total landed cost cannot be negative');
  }

  return totalLandedCost / quantity;
}

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
  const totalLandedCost = calculateTotalLandedCost(components);
  const costPerUnit = calculateCostPerUnit(totalLandedCost, input.quantity);

  return {
    totalLandedCost,
    costPerUnit,
    currency: input.currency,
  };
}