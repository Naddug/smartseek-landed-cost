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
  };
  
  // Customs
  customs: {
    importDuty: {
      rate: number;
      amount: number;
      baseValue: number;
    };
    vat: {
      rate: number;
      amount: number;
      baseValue: number;
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
  };
  
  // Additional costs
  inlandTransport: {
    origin: {
      cost: number;
      distance?: number;
      method?: string;
    };
    destination: {
      cost: number;
      distance?: number;
      method?: string;
    };
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
