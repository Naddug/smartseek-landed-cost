import type { LandedCostInput } from '../../types';

export interface CountryConfiguration {
  customs_valuation_method: 'FOB' | 'CIF';
}

export function calculateCustomsValue(
  input: LandedCostInput,
  base_product_cost: number,
  freight_cost: number,
  insurance_cost: number,
  inland_origin_cost: number,
  country_config: CountryConfiguration
): {
  customs_value: number;
  customs_value_basis: string;
} {
  if (base_product_cost < 0) {
    throw new Error('base_product_cost must be >= 0');
  }

  if (freight_cost < 0) {
    throw new Error('freight_cost must be >= 0');
  }

  if (insurance_cost < 0) {
    throw new Error('insurance_cost must be >= 0');
  }

  if (inland_origin_cost < 0) {
    throw new Error('inland_origin_cost must be >= 0');
  }

  const incoterm = input.incoterm;
  const valuation_method = country_config.customs_valuation_method;

  let customs_value: number;
  let customs_value_basis: string;

  if (valuation_method === 'CIF') {
    if (incoterm === 'FOB') {
      customs_value = base_product_cost + freight_cost + insurance_cost;
      customs_value_basis = 'FOB price + freight + insurance (country uses CIF valuation method)';
    } else if (incoterm === 'CIF') {
      customs_value = base_product_cost;
      customs_value_basis = 'CIF price (country uses CIF valuation method)';
    } else if (incoterm === 'EXW') {
      customs_value = base_product_cost + inland_origin_cost + freight_cost + insurance_cost;
      customs_value_basis = 'EXW price + inland to port + freight + insurance (country uses CIF valuation method)';
    } else {
      throw new Error(`Unsupported incoterm: ${incoterm}`);
    }
  } else if (valuation_method === 'FOB') {
    if (incoterm === 'FOB') {
      customs_value = base_product_cost;
      customs_value_basis = 'FOB price (country uses FOB valuation method)';
    } else if (incoterm === 'CIF') {
      customs_value = base_product_cost - freight_cost - insurance_cost;
      customs_value_basis = 'CIF price - freight - insurance (country uses FOB valuation method)';
    } else if (incoterm === 'EXW') {
      customs_value = base_product_cost + inland_origin_cost;
      customs_value_basis = 'EXW price + inland to port (country uses FOB valuation method)';
    } else {
      throw new Error(`Unsupported incoterm: ${incoterm}`);
    }
  } else {
    throw new Error(`Invalid customs_valuation_method: ${valuation_method}`);
  }

  if (customs_value < 0) {
    throw new Error('Calculated customs_value is negative - check input values');
  }

  return {
    customs_value,
    customs_value_basis,
  };
}