/**
 * Calculation specification version.
 * Update when calculation logic changes per specification.
 * Format: "v1.0.0" (semantic versioning)
 */
export const CALCULATION_VERSION = "v1.0.0";

/**
 * Data snapshot timestamp.
 * Represents when external data (tariff rates, freight rates) was last updated.
 * Format: ISO 8601 timestamp
 */
export const DATA_SNAPSHOT_TIMESTAMP = new Date().toISOString();

/**
 * Rounding policy declaration.
 * 
 * Per calculation specification:
 * - All monetary values rounded to 2 decimal places
 * - All percentages rounded to 4 decimal places
 * - All weights rounded to 2 decimal places (kg)
 * - All volumes rounded to 4 decimal places (CBM)
 * 
 * Implementation must follow specification exactly.
 */
export const ROUNDING_POLICY = {
  monetary: 2,
  percentage: 4,
  weight: 2,
  volume: 4,
  quantity: 0,
} as const;

/**
 * Error handling policy.
 * Defines which errors are blocking vs non-blocking.
 */
export const ERROR_POLICY = {
  BLOCKING: [
    'INVALID_INPUT',
    'MISSING_BASE_COST',
    'AGGREGATION_FAILED',
  ],
  NON_BLOCKING: [
    'FREIGHT_RATE_UNAVAILABLE',
    'TARIFF_RATE_UNAVAILABLE',
    'INSURANCE_RATE_UNAVAILABLE',
    'TRANSPORT_RATE_UNAVAILABLE',
  ],
} as const;