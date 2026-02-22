import type { CalculationNote, LandedCostInput } from './types';
import type { BaseCostResult } from './baseCostService';
import type { FreightResult } from './freightService';
import type { CustomsResult } from './customsService';
import type { InsuranceResult } from './insuranceService';

// Import InlandTransportResult type directly
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
  input: LandedCostInput,
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
  const notes: CalculationNote[] = [];

  // Metadata notes
  notes.push({
    category: 'info',
    component: 'Calculation',
    message: `Calculation version: ${calculationVersion}`,
    timestamp: new Date().toISOString(),
  });

  notes.push({
    category: 'info',
    component: 'Data',
    message: `Data snapshot timestamp: ${dataSnapshotTimestamp}`,
    timestamp: new Date().toISOString(),
  });

  // Base cost notes
  components.baseCost.notes.forEach((note: string) => {
    notes.push({
      category: 'info',
      component: 'Base Cost',
      message: note,
    });
  });

  // Freight notes
  components.freight.notes.forEach((note: string) => {
    notes.push({
      category: 'info',
      component: 'Freight',
      message: note,
    });
  });

  // Insurance notes
  components.insurance.notes.forEach((note: string) => {
    notes.push({
      category: 'info',
      component: 'Insurance',
      message: note,
    });
  });

  // Customs notes
  components.customs.notes.forEach((note: string) => {
    notes.push({
      category: 'info',
      component: 'Customs',
      message: note,
    });
  });

  // Inland transport notes (origin)
  components.inlandTransport.origin.notes.forEach((note: string) => {
    notes.push({
      category: 'info',
      component: 'Inland Transport (Origin)',
      message: note,
    });
  });

  // Inland transport notes (destination)
  components.inlandTransport.destination.notes.forEach((note: string) => {
    notes.push({
      category: 'info',
      component: 'Inland Transport (Destination)',
      message: note,
    });
  });

  // Add assumptions/estimates warnings
  const hasEstimates = 
    components.freight.notes.some((n: string) => n.includes('Estimated') || n.includes('Placeholder')) ||
    components.insurance.notes.some((n: string) => n.includes('default')) ||
    components.inlandTransport.origin.notes.some((n: string) => n.includes('Estimated')) ||
    components.inlandTransport.destination.notes.some((n: string) => n.includes('Estimated'));

  if (hasEstimates) {
    notes.push({
      category: 'warning',
      component: 'Data Quality',
      message: 'Some costs are estimates based on defaults. For production use, integrate with actual rate providers.',
    });
  }

  // Route information
  notes.push({
    category: 'info',
    component: 'Route',
    message: `${input.originCountry} → ${input.destinationCountry} via ${input.shippingMethod}`,
  });

  return notes;
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
  let message = `${component}: ${value.toFixed(2)}`;

  if (dataSource) {
    message += ` (source: ${dataSource})`;
  }

  return {
    category: isEstimate ? 'estimate' : 'actual',
    component,
    message,
    dataSource,
  };
}