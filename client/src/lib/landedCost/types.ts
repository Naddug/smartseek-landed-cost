export interface LandedCostInput {
  productName: string;
  hsCode: string;
  category?: string;
  baseCost: number;
  incoterm: 'FOB' | 'EXW' | 'CIF' | 'DDP';
  quantity: number;
  currency: string;
  originCountry: string;
  destinationCountry: string;
  originPort?: string;
  destinationPort?: string;
  shippingMethod: 'sea_fcl' | 'sea_lcl' | 'air' | 'express';
  containerType?: '20ft' | '40ft';
  weight?: number;
  volume?: number;
  dimensions?: { length: number; width: number; height: number };
  insuranceRate?: number;
  inlandTransportOrigin?: number;
  inlandTransportDestination?: number;
}

export interface LandedCostResult {
  calculationVersion: string;
  dataSnapshotTimestamp: string;
  calculationTimestamp: string;
  baseCost: { fobCost: number; exwCost: number; normalizedCost: number; currency: string };
  freight: {
    oceanFCL?: { cost20ft: number; cost40ft: number; selectedCost: number; containerType: '20ft' | '40ft' };
    oceanLCL?: { costPerCBM: number; totalCost: number; volume: number };
    airFreight?: { costPerKg: number; volumetricWeight: number; chargeableWeight: number; totalCost: number };
    express?: { costPerKg: number; totalCost: number };
    selectedMethod: string;
    selectedCost: number;
  };
  customs: {
    importDuty: { rate: number; amount: number; baseValue: number };
    vat: { rate: number; amount: number; baseValue: number };
    additionalTariffs: Array<{ name: string; type: string; rate: number; amount: number }>;
    mpf?: { rate: number; amount: number; min: number; max: number };
    hmf?: { rate: number; amount: number };
    totalCustomsFees: number;
  };
  inlandTransport: {
    origin: { cost: number; notes: string[] };
    destination: { cost: number; notes: string[] };
    total: number;
  };
  insurance: { rate: number; amount: number; cifValue: number };
  totals: { totalLandedCost: number; costPerUnit: number; currency: string };
  breakdown: CostBreakdownItem[];
  notes: CalculationNote[];
}

export interface CostBreakdownItem {
  component: string;
  amount: number;
  percentage: number;
  cumulativeAmount: number;
  cumulativePercentage: number;
}

export interface CalculationNote {
  category: 'assumption' | 'estimate' | 'actual' | 'warning' | 'info';
  component: string;
  message: string;
  dataSource?: string;
  timestamp?: string;
}
