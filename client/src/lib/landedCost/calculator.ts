/**
 * Client-side Landed Cost Calculator - mirrors server orchestrator logic
 */
import type { LandedCostInput, LandedCostResult, CostBreakdownItem, CalculationNote } from './types';

const CALCULATION_VERSION = "v1.0.0";
const DATA_SNAPSHOT_TIMESTAMP = new Date().toISOString();

function validateBaseCost(input: LandedCostInput): void {
  if (!input?.baseCost || input.baseCost <= 0) throw new Error('Base cost must be greater than 0');
  if (!input?.quantity || input.quantity <= 0) throw new Error('Quantity must be greater than 0');
  if (!input?.currency?.trim()) throw new Error('Currency is required');
  if (!['FOB', 'EXW', 'CIF', 'DDP'].includes(input.incoterm)) throw new Error('Invalid incoterm');
  if (!input?.originCountry?.trim()) throw new Error('Origin country is required');
  if (!input?.destinationCountry?.trim()) throw new Error('Destination country is required');
  if (!input?.hsCode?.trim()) throw new Error('HS code is required');
}

function calculateBaseCost(input: LandedCostInput) {
  const notes: string[] = [];
  const cost = input.baseCost;
  if (input.incoterm === 'FOB') notes.push('Base cost provided as FOB');
  else if (input.incoterm === 'EXW') notes.push('Base cost provided as EXW');
  else if (input.incoterm === 'CIF') notes.push('Base cost provided as CIF');
  else if (input.incoterm === 'DDP') notes.push('Base cost provided as DDP');
  return { fobCost: cost, exwCost: cost, normalizedCost: cost, currency: input.currency, notes };
}

function calculateFreight(input: LandedCostInput) {
  const notes: string[] = [];
  let selectedCost: number;
  let oceanFCL: any, oceanLCL: any, airFreight: any, express: any;

  if (input.shippingMethod === 'sea_fcl') {
    const ct = input.containerType || '20ft';
    const rates = { '20ft': 1500, '40ft': 2500 };
    selectedCost = rates[ct];
    oceanFCL = { cost20ft: 1500, cost40ft: 2500, selectedCost, containerType: ct };
    notes.push(`Ocean FCL freight for ${ct} container`);
  } else if (input.shippingMethod === 'sea_lcl') {
    const vol = input.volume || 1;
    const costPerCBM = 50;
    selectedCost = vol * costPerCBM;
    oceanLCL = { costPerCBM, totalCost: selectedCost, volume: vol };
    notes.push(`Ocean LCL for ${vol} CBM`);
  } else if (input.shippingMethod === 'air') {
    const w = input.weight || 10;
    const v = input.volume || 0.1;
    const volWeight = v * 167;
    const chargeable = Math.max(w, volWeight);
    const costPerKg = 5;
    selectedCost = chargeable * costPerKg;
    airFreight = { costPerKg, volumetricWeight: volWeight, chargeableWeight: chargeable, totalCost: selectedCost };
    notes.push(`Air freight for ${chargeable} kg chargeable`);
  } else if (input.shippingMethod === 'express') {
    const w = input.weight || 10;
    const costPerKg = 10;
    selectedCost = w * costPerKg;
    express = { costPerKg, totalCost: selectedCost };
    notes.push(`Express for ${w} kg`);
  } else {
    throw new Error(`Unsupported shipping: ${input.shippingMethod}`);
  }

  return { oceanFCL, oceanLCL, airFreight, express, selectedMethod: input.shippingMethod, selectedCost, notes };
}

function calculateCIFValue(baseCost: number, freightCost: number) {
  return baseCost + freightCost;
}

function getCountryConfig(country: string) {
  const configs: Record<string, { vat_rate: number; has_mpf: boolean; has_hmf: boolean; mpf_config?: any; hmf_config?: any }> = {
    US: { vat_rate: 0, has_mpf: true, has_hmf: true, mpf_config: { rate: 0.003464, min: 27.75, max: 538.40 }, hmf_config: { rate: 0.00125 } },
    GB: { vat_rate: 0.20, has_mpf: false, has_hmf: false },
    DE: { vat_rate: 0.19, has_mpf: false, has_hmf: false },
    FR: { vat_rate: 0.20, has_mpf: false, has_hmf: false },
    CN: { vat_rate: 0.13, has_mpf: false, has_hmf: false },
    JP: { vat_rate: 0.10, has_mpf: false, has_hmf: false },
    IN: { vat_rate: 0.18, has_mpf: false, has_hmf: false },
    AU: { vat_rate: 0.10, has_mpf: false, has_hmf: false },
    CA: { vat_rate: 0.05, has_mpf: false, has_hmf: false },
  };
  return configs[country] || { vat_rate: 0.15, has_mpf: false, has_hmf: false };
}

function calculateCustoms(input: LandedCostInput, cifValue: number) {
  const notes: string[] = [];
  const cfg = getCountryConfig(input.destinationCountry);
  const tariffRate = 0.05;
  const importDutyAmount = cifValue * tariffRate;
  const vatBase = cifValue + importDutyAmount;
  const vatAmount = vatBase * cfg.vat_rate;

  let mpfAmount = 0, hmfAmount = 0;
  if (cfg.has_mpf && cfg.mpf_config) {
    mpfAmount = Math.min(cfg.mpf_config.max, Math.max(cfg.mpf_config.min, cifValue * cfg.mpf_config.rate));
    notes.push(`MPF applied`);
  }
  if (cfg.has_hmf && cfg.hmf_config) {
    hmfAmount = cifValue * cfg.hmf_config.rate;
    notes.push(`HMF applied`);
  }

  const totalCustomsFees = importDutyAmount + vatAmount + mpfAmount + hmfAmount;
  notes.push(`Import duty: ${(tariffRate * 100).toFixed(2)}%`);
  if (cfg.vat_rate > 0) notes.push(`VAT: ${(cfg.vat_rate * 100).toFixed(2)}%`);

  return {
    importDuty: { rate: tariffRate, amount: importDutyAmount, baseValue: cifValue },
    vat: { rate: cfg.vat_rate, amount: vatAmount, baseValue: vatBase },
    additionalTariffs: [],
    mpf: cfg.has_mpf && cfg.mpf_config ? { rate: cfg.mpf_config.rate, amount: mpfAmount, min: cfg.mpf_config.min, max: cfg.mpf_config.max } : undefined,
    hmf: cfg.has_hmf && cfg.hmf_config ? { rate: cfg.hmf_config.rate, amount: hmfAmount } : undefined,
    totalCustomsFees,
    notes,
  };
}

function calculateInsurance(input: LandedCostInput, cifValue: number) {
  const rate = input.insuranceRate ?? 0.005;
  const amount = cifValue * rate;
  return { rate, amount, cifValue, notes: [`Insurance: ${(rate * 100).toFixed(2)}% on CIF`] };
}

function calculateInlandTransport(input: LandedCostInput) {
  const originCost = input.inlandTransportOrigin ?? (input.incoterm === 'EXW' ? 200 : 0);
  const destCost = input.inlandTransportDestination ?? 300;
  return {
    origin: { cost: originCost, notes: [originCost > 0 ? 'Estimated origin transport' : 'Seller delivers to port'] },
    destination: { cost: destCost, notes: ['Estimated destination transport'] },
    total: originCost + destCost,
  };
}

function generateBreakdown(components: any, total: number): CostBreakdownItem[] {
  const pct = (a: number) => total > 0 ? (a / total) * 100 : 0;
  const items: CostBreakdownItem[] = [
    { component: 'Base Product Cost', amount: components.baseCost.normalizedCost, percentage: pct(components.baseCost.normalizedCost), cumulativeAmount: 0, cumulativePercentage: 0 },
    { component: 'Freight', amount: components.freight.selectedCost, percentage: pct(components.freight.selectedCost), cumulativeAmount: 0, cumulativePercentage: 0 },
    { component: 'Insurance', amount: components.insurance.amount, percentage: pct(components.insurance.amount), cumulativeAmount: 0, cumulativePercentage: 0 },
    { component: 'Import Duty', amount: components.customs.importDuty.amount, percentage: pct(components.customs.importDuty.amount), cumulativeAmount: 0, cumulativePercentage: 0 },
    { component: 'VAT/GST', amount: components.customs.vat.amount, percentage: pct(components.customs.vat.amount), cumulativeAmount: 0, cumulativePercentage: 0 },
  ];
  if (components.customs.mpf) items.push({ component: 'MPF', amount: components.customs.mpf.amount, percentage: pct(components.customs.mpf.amount), cumulativeAmount: 0, cumulativePercentage: 0 });
  if (components.customs.hmf) items.push({ component: 'HMF', amount: components.customs.hmf.amount, percentage: pct(components.customs.hmf.amount), cumulativeAmount: 0, cumulativePercentage: 0 });
  if (components.inlandTransport.origin.cost > 0) items.push({ component: 'Inland (Origin)', amount: components.inlandTransport.origin.cost, percentage: pct(components.inlandTransport.origin.cost), cumulativeAmount: 0, cumulativePercentage: 0 });
  if (components.inlandTransport.destination.cost > 0) items.push({ component: 'Inland (Dest)', amount: components.inlandTransport.destination.cost, percentage: pct(components.inlandTransport.destination.cost), cumulativeAmount: 0, cumulativePercentage: 0 });

  let cumAmt = 0, cumPct = 0;
  return items.map((i) => {
    cumAmt += i.amount;
    cumPct += i.percentage;
    return { ...i, cumulativeAmount: cumAmt, cumulativePercentage: cumPct };
  });
}

function generateNotes(input: LandedCostInput, components: any): CalculationNote[] {
  const notes: CalculationNote[] = [
    { category: 'info', component: 'Calculation', message: `Version: ${CALCULATION_VERSION}` },
    { category: 'info', component: 'Route', message: `${input.originCountry} → ${input.destinationCountry} via ${input.shippingMethod}` },
  ];
  components.baseCost.notes.forEach((m: string) => notes.push({ category: 'info', component: 'Base Cost', message: m }));
  components.freight.notes.forEach((m: string) => notes.push({ category: 'info', component: 'Freight', message: m }));
  components.insurance.notes.forEach((m: string) => notes.push({ category: 'info', component: 'Insurance', message: m }));
  components.customs.notes.forEach((m: string) => notes.push({ category: 'info', component: 'Customs', message: m }));
  notes.push({ category: 'warning', component: 'Data', message: 'Rates are estimates. Integrate with actual providers for production.' });
  return notes;
}

export function calculateLandedCost(input: LandedCostInput): LandedCostResult {
  validateBaseCost(input);
  const baseCost = calculateBaseCost(input);
  const freight = calculateFreight(input);
  const cifValue = calculateCIFValue(baseCost.normalizedCost, freight.selectedCost);
  const insurance = calculateInsurance(input, cifValue);
  const updatedCIF = baseCost.normalizedCost + freight.selectedCost + insurance.amount;
  const customs = calculateCustoms(input, updatedCIF);
  const inlandTransport = calculateInlandTransport(input);

  const totalLandedCost = baseCost.normalizedCost + freight.selectedCost + customs.totalCustomsFees + inlandTransport.total + insurance.amount;
  const costPerUnit = totalLandedCost / input.quantity;

  const breakdown = generateBreakdown(
    { baseCost, freight, customs, inlandTransport, insurance },
    totalLandedCost
  );
  const notes = generateNotes(input, { baseCost, freight, customs, inlandTransport, insurance });

  return {
    calculationVersion: CALCULATION_VERSION,
    dataSnapshotTimestamp: DATA_SNAPSHOT_TIMESTAMP,
    calculationTimestamp: new Date().toISOString(),
    baseCost: { fobCost: baseCost.fobCost, exwCost: baseCost.exwCost, normalizedCost: baseCost.normalizedCost, currency: baseCost.currency },
    freight: { oceanFCL: freight.oceanFCL, oceanLCL: freight.oceanLCL, airFreight: freight.airFreight, express: freight.express, selectedMethod: freight.selectedMethod, selectedCost: freight.selectedCost },
    customs: { importDuty: customs.importDuty, vat: customs.vat, additionalTariffs: customs.additionalTariffs, mpf: customs.mpf, hmf: customs.hmf, totalCustomsFees: customs.totalCustomsFees },
    inlandTransport: { origin: inlandTransport.origin, destination: inlandTransport.destination, total: inlandTransport.total },
    insurance: { rate: insurance.rate, amount: insurance.amount, cifValue: insurance.cifValue },
    totals: { totalLandedCost, costPerUnit, currency: input.currency },
    breakdown,
    notes,
  };
}
