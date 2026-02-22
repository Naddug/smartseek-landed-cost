import type { CostBreakdownItem } from './types';
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
  if (totalLandedCost <= 0) {
    throw new Error('Total landed cost must be greater than 0 for breakdown calculation');
  }

  const items: CostBreakdownItem[] = [];

  items.push({
    component: 'Base Product Cost',
    amount: components.baseCost.normalizedCost,
    percentage: calculatePercentage(components.baseCost.normalizedCost, totalLandedCost),
    cumulativeAmount: 0,
    cumulativePercentage: 0,
  });

  items.push({
    component: 'Freight',
    amount: components.freight.selectedCost,
    percentage: calculatePercentage(components.freight.selectedCost, totalLandedCost),
    cumulativeAmount: 0,
    cumulativePercentage: 0,
  });

  items.push({
    component: 'Insurance',
    amount: components.insurance.amount,
    percentage: calculatePercentage(components.insurance.amount, totalLandedCost),
    cumulativeAmount: 0,
    cumulativePercentage: 0,
  });

  items.push({
    component: 'Import Duty',
    amount: components.customs.importDuty.amount,
    percentage: calculatePercentage(components.customs.importDuty.amount, totalLandedCost),
    cumulativeAmount: 0,
    cumulativePercentage: 0,
  });

  items.push({
    component: 'VAT/GST',
    amount: components.customs.vat.amount,
    percentage: calculatePercentage(components.customs.vat.amount, totalLandedCost),
    cumulativeAmount: 0,
    cumulativePercentage: 0,
  });

  if (components.customs.mpf) {
    items.push({
      component: 'MPF',
      amount: components.customs.mpf.amount,
      percentage: calculatePercentage(components.customs.mpf.amount, totalLandedCost),
      cumulativeAmount: 0,
      cumulativePercentage: 0,
    });
  }

  if (components.customs.hmf) {
    items.push({
      component: 'HMF',
      amount: components.customs.hmf.amount,
      percentage: calculatePercentage(components.customs.hmf.amount, totalLandedCost),
      cumulativeAmount: 0,
      cumulativePercentage: 0,
    });
  }

  components.customs.additionalTariffs.forEach((tariff) => {
    items.push({
      component: tariff.name,
      amount: tariff.amount,
      percentage: calculatePercentage(tariff.amount, totalLandedCost),
      cumulativeAmount: 0,
      cumulativePercentage: 0,
    });
  });

  if (components.inlandTransport.origin.cost > 0) {
    items.push({
      component: 'Inland Transport (Origin)',
      amount: components.inlandTransport.origin.cost,
      percentage: calculatePercentage(components.inlandTransport.origin.cost, totalLandedCost),
      cumulativeAmount: 0,
      cumulativePercentage: 0,
    });
  }

  if (components.inlandTransport.destination.cost > 0) {
    items.push({
      component: 'Inland Transport (Destination)',
      amount: components.inlandTransport.destination.cost,
      percentage: calculatePercentage(components.inlandTransport.destination.cost, totalLandedCost),
      cumulativeAmount: 0,
      cumulativePercentage: 0,
    });
  }

  return calculateCumulative(items);
}

export function calculatePercentage(componentAmount: number, totalAmount: number): number {
  if (totalAmount <= 0) {
    throw new Error('Total amount must be greater than 0');
  }

  if (componentAmount < 0) {
    throw new Error('Component amount cannot be negative');
  }

  return (componentAmount / totalAmount) * 100;
}

export function calculateCumulative(breakdownItems: CostBreakdownItem[]): CostBreakdownItem[] {
  let cumulativeAmount = 0;
  let cumulativePercentage = 0;

  return breakdownItems.map((item) => {
    cumulativeAmount += item.amount;
    cumulativePercentage += item.percentage;

    return {
      ...item,
      cumulativeAmount,
      cumulativePercentage,
    };
  });
}