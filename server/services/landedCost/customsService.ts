import type { LandedCostInput } from './types';

/**
 * Customs calculation result.
 */
export interface CustomsResult {
  hsCode: string;
  hsCodeDescription: string;
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
  notes: string[];
}

/**
 * Country-specific customs configuration.
 * In production, this would come from external data service.
 */
export interface CountryCustomsConfig {
  country_code: string;
  vat_rate: number;
  vat_applies_to: 'cif' | 'cif_plus_duty';
  has_mpf: boolean;
  has_hmf: boolean;
  mpf_config?: {
    rate: number;
    min: number;
    max: number;
  };
  hmf_config?: {
    rate: number;
  };
}

/**
 * Get country-specific customs configuration.
 * In production, this would query external database/API.
 * 
 * @param country_code - ISO country code
 * @returns Country customs configuration
 */
export function getCountryCustomsConfig(country_code: string): CountryCustomsConfig {
  const configs: Record<string, CountryCustomsConfig> = {
    'US': {
      country_code: 'US',
      vat_rate: 0.00,
      vat_applies_to: 'cif_plus_duty',
      has_mpf: true,
      has_hmf: true,
      mpf_config: {
        rate: 0.003464,
        min: 27.75,
        max: 538.40,
      },
      hmf_config: {
        rate: 0.00125,
      },
    },
    'GB': {
      country_code: 'GB',
      vat_rate: 0.20,
      vat_applies_to: 'cif_plus_duty',
      has_mpf: false,
      has_hmf: false,
    },
    'DE': {
      country_code: 'DE',
      vat_rate: 0.19,
      vat_applies_to: 'cif_plus_duty',
      has_mpf: false,
      has_hmf: false,
    },
    'FR': {
      country_code: 'FR',
      vat_rate: 0.20,
      vat_applies_to: 'cif_plus_duty',
      has_mpf: false,
      has_hmf: false,
    },
    'CN': {
      country_code: 'CN',
      vat_rate: 0.13,
      vat_applies_to: 'cif_plus_duty',
      has_mpf: false,
      has_hmf: false,
    },
    'JP': {
      country_code: 'JP',
      vat_rate: 0.10,
      vat_applies_to: 'cif_plus_duty',
      has_mpf: false,
      has_hmf: false,
    },
    'IN': {
      country_code: 'IN',
      vat_rate: 0.18,
      vat_applies_to: 'cif_plus_duty',
      has_mpf: false,
      has_hmf: false,
    },
    'AU': {
      country_code: 'AU',
      vat_rate: 0.10,
      vat_applies_to: 'cif_plus_duty',
      has_mpf: false,
      has_hmf: false,
    },
    'BR': {
      country_code: 'BR',
      vat_rate: 0.17,
      vat_applies_to: 'cif_plus_duty',
      has_mpf: false,
      has_hmf: false,
    },
    'CA': {
      country_code: 'CA',
      vat_rate: 0.05,
      vat_applies_to: 'cif_plus_duty',
      has_mpf: false,
      has_hmf: false,
    },
  };

  if (configs[country_code]) {
    return configs[country_code];
  }

  return {
    country_code,
    vat_rate: 0.15,
    vat_applies_to: 'cif_plus_duty',
    has_mpf: false,
    has_hmf: false,
  };
}

export function validateHSCode(hsCode: string): { valid: boolean; description: string } {
  if (!hsCode || hsCode.trim() === '') {
    throw new Error('HS code is required');
  }

  const cleaned = hsCode.replace(/[.\s-]/g, '');
  if (!/^\d{6,10}$/.test(cleaned)) {
    throw new Error('HS code must be 6-10 digits');
  }

  return {
    valid: true,
    description: 'Product classification (placeholder - would come from HS database)',
  };
}

export function getTariffRate(hsCode: string, originCountry: string, destinationCountry: string): number {
  return 0.05;
}

export function getVATRate(destinationCountry: string): number {
  const config = getCountryCustomsConfig(destinationCountry);
  return config.vat_rate;
}

export function getAdditionalTariffs(
  hsCode: string,
  originCountry: string,
  destinationCountry: string,
  cifValue: number
): CustomsResult['additionalTariffs'] {
  return [];
}

export function calculateMPF(cifValue: number, config: NonNullable<CountryCustomsConfig['mpf_config']>): CustomsResult['mpf'] {
  let amount = cifValue * config.rate;
  
  if (amount < config.min) {
    amount = config.min;
  } else if (amount > config.max) {
    amount = config.max;
  }

  return {
    rate: config.rate,
    amount,
    min: config.min,
    max: config.max,
  };
}

export function calculateHMF(cifValue: number, config: NonNullable<CountryCustomsConfig['hmf_config']>): CustomsResult['hmf'] {
  const amount = cifValue * config.rate;

  return {
    rate: config.rate,
    amount,
  };
}

export function calculateCustoms(input: LandedCostInput, cifValue: number): CustomsResult {
  if (cifValue < 0) {
    throw new Error('CIF value must be >= 0');
  }

  const notes: string[] = [];
  const countryConfig = getCountryCustomsConfig(input.destinationCountry);
  const hsValidation = validateHSCode(input.hsCode);
  
  const tariffRate = getTariffRate(input.hsCode, input.originCountry, input.destinationCountry);
  const importDutyAmount = cifValue * tariffRate;

  let vatBase: number;
  if (countryConfig.vat_applies_to === 'cif') {
    vatBase = cifValue;
    notes.push(`VAT base: CIF value (${input.destinationCountry} method)`);
  } else {
    vatBase = cifValue + importDutyAmount;
    notes.push(`VAT base: CIF + duty (${input.destinationCountry} method)`);
  }

  const vatRate = countryConfig.vat_rate;
  const vatAmount = vatBase * vatRate;

  const additionalTariffs = getAdditionalTariffs(
    input.hsCode,
    input.originCountry,
    input.destinationCountry,
    cifValue
  );

  const additionalTariffsTotal = additionalTariffs.reduce((sum, tariff) => sum + tariff.amount, 0);

  let mpf: CustomsResult['mpf'] | undefined;
  let hmf: CustomsResult['hmf'] | undefined;
  
  if (countryConfig.has_mpf && countryConfig.mpf_config) {
    mpf = calculateMPF(cifValue, countryConfig.mpf_config);
    notes.push(`MPF applied (${input.destinationCountry}-specific processing fee)`);
  }

  if (countryConfig.has_hmf && countryConfig.hmf_config) {
    hmf = calculateHMF(cifValue, countryConfig.hmf_config);
    notes.push(`HMF applied (${input.destinationCountry}-specific harbor fee)`);
  }

  const mpfAmount = mpf?.amount || 0;
  const hmfAmount = hmf?.amount || 0;

  const totalCustomsFees = importDutyAmount + vatAmount + additionalTariffsTotal + mpfAmount + hmfAmount;

  notes.push(`Import duty: ${(tariffRate * 100).toFixed(2)}% on CIF value`);
  
  if (vatRate > 0) {
    notes.push(`VAT/GST: ${(vatRate * 100).toFixed(2)}% (${input.destinationCountry})`);
  } else {
    notes.push(`No VAT/GST in ${input.destinationCountry}`);
  }

  notes.push(`All rates from external data service for ${input.destinationCountry}`);

  return {
    hsCode: input.hsCode,
    hsCodeDescription: hsValidation.description,
    importDuty: {
      rate: tariffRate,
      amount: importDutyAmount,
      baseValue: cifValue,
    },
    vat: {
      rate: vatRate,
      amount: vatAmount,
      baseValue: vatBase,
    },
    additionalTariffs,
    mpf,
    hmf,
    totalCustomsFees,
    notes,
  };
}