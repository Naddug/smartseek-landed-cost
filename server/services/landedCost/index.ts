/**
 * Public exports for Landed Cost Engine services.
 * 
 * This module provides the main entry point for landed cost calculations.
 * All business logic is implemented according to the immutable calculation specification.
 */

// ============================================================================
// MAIN ORCHESTRATOR (Most important export)
// ============================================================================
export { calculateLandedCost } from './orchestrator';

// ============================================================================
// TYPES (Public API types)
// ============================================================================
export type {
  LandedCostInput,
  LandedCostResult,
  CostBreakdownItem,
  CalculationNote,
} from './types';

// ============================================================================
// CONSTANTS
// ============================================================================
export {
  CALCULATION_VERSION,
  DATA_SNAPSHOT_TIMESTAMP,
  ROUNDING_POLICY,
  ERROR_POLICY,
} from './constants';

// ============================================================================
// INDIVIDUAL SERVICES (For advanced usage and testing)
// ============================================================================

// Base Cost Service
export type { BaseCostResult } from './baseCostService';
export {
  calculateBaseCost,
  normalizeToFOB,
  validateBaseCost,
} from './baseCostService';

// Freight Service
export type { FreightResult } from './freightService';
export {
  calculateFreight,
  calculateOceanFreightFCL,
  calculateOceanFreightLCL,
  calculateAirFreight,
  calculateVolumetricWeight,
  calculateChargeableWeight,
} from './freightService';

// Insurance Service
export type { InsuranceResult } from './insuranceService';
export {
  calculateInsurance,
  calculateCIFValue,
  getInsuranceRate,
} from './insuranceService';

// Inland Transport Service
export type { InlandTransportResult } from './inlandTransportService';
export {
  calculateInlandTransport,
  calculateOriginTransport,
  calculateDestinationTransport,
} from './inlandTransportService';

// Customs Service
export type { CustomsResult } from './customsService';
export {
  calculateCustoms,
  validateHSCode,
  getTariffRate,
  getVATRate,
  getAdditionalTariffs,
  calculateMPF,
  calculateHMF,
} from './customsService';

// Customs Value Service (separate module)
export type { CountryConfiguration } from './components/customs/customsValueService';
export {
  calculateCustomsValue,
} from './components/customs/customsValueService';

// Aggregation Service
export {
  calculateTotalLandedCost,
  calculateCostPerUnit,
  aggregateTotal,
} from './aggregationService';

// Breakdown Service
export {
  generateBreakdown,
  calculatePercentage,
  calculateCumulative,
} from './breakdownService';

// Notes Service
export {
  generateNotes,
  generateComponentNote,
} from './notesService';