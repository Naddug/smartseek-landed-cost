/**
 * Market price service – fetches real prices from external APIs.
 *
 * MINERALS (copper, aluminum, zinc, lead, nickel, tin, cobalt, lithium, antimony):
 *   - MetalpriceAPI (METALPRICE_API_KEY) for LME metals
 *   - Commodities-API (COMMODITIES_API_KEY) for antimony (not in MetalpriceAPI)
 *   - Fallback to config when no API key
 *
 * STEEL (HRC, rebar, etc.):
 *   - Commodities-API: US-HRC (US Midwest), HRC-CH (China)
 *
 * AGRI (wheat, corn, rice, soybeans, sugar, coffee):
 *   - Commodities-API: WHEAT, CORN, RICE, SOYBEAN, SUGAR, COFFEE, ROBUSTA
 *
 * FOOD (olive oil):
 *   - FRED (FRED_API_KEY): POLVOILUSDM – IMF olive oil USD/metric ton
 *
 * All prices normalized to USD per metric tonne unless noted.
 */

const OZ_PER_TONNE = 35273.96; // avoirdupois oz per metric tonne
const BUSHEL_CORN_KG = 25.4;
const CWT_KG = 45.36; // 100 lb
const LB_PER_TONNE = 2204.62;

const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

// ─── MINERALS (MetalpriceAPI) ─────────────────────────────────────────────
const METAL_SYMBOLS: Record<string, string> = {
  copper: "XCU",
  aluminum: "ALU",
  zinc: "ZNC",
  lead: "XPB",
  nickel: "NI",
  tin: "XSN",
  cobalt: "XCO",
  lithium: "XLI",
};

const FALLBACK_MINERALS: Record<string, { lme: number; smm?: number }> = {
  copper: { lme: 13000, smm: 12800 },
  aluminum: { lme: 2200, smm: 2180 },
  zinc: { lme: 2500, smm: 2480 },
  lead: { lme: 2100, smm: 2080 },
  nickel: { lme: 18000, smm: 17800 },
  tin: { lme: 28000, smm: 27800 },
  antimony: { lme: 12500, smm: 12200 },
  cobalt: { lme: 28000 },
  lithium: { lme: 15000 },
};

// ─── STEEL / AGRI / FOOD (Commodities-API, FRED) ──────────────────────────
/** Commodities-API: symbol -> { unit, toTonne } to convert to USD/tonne */
const COMMODITIES_SYMBOLS: Record<string, { unit: string; toTonne: (usdPerUnit: number) => number }> = {
  "US-HRC": { unit: "ton", toTonne: (v) => v },
  "HRC-CH": { unit: "ton", toTonne: (v) => v },
  WHEAT: { unit: "mt", toTonne: (v) => v },
  CORN: { unit: "bushel", toTonne: (v) => v * (1000 / BUSHEL_CORN_KG) },
  RICE: { unit: "cwt", toTonne: (v) => v * (1000 / CWT_KG) },
  SOYBEAN: { unit: "bushel", toTonne: (v) => v * (1000 / 27.2) },
  SUGAR: { unit: "lb", toTonne: (v) => v * LB_PER_TONNE },
  COFFEE: { unit: "lb", toTonne: (v) => v * LB_PER_TONNE },
  ROBUSTA: { unit: "lb", toTonne: (v) => v * LB_PER_TONNE },
  COCOA: { unit: "mt", toTonne: (v) => v },
  ANTIMONY: { unit: "mt", toTonne: (v) => v },
};

/** Product family id -> Commodities-API symbol (primary) */
const STEEL_SYMBOL = "US-HRC";
const STEEL_SYMBOL_ASIA = "HRC-CH";
const AGRI_SYMBOLS: Record<string, string> = {
  wheat: "WHEAT",
  corn: "CORN",
  rice: "RICE",
  soybeans: "SOYBEAN",
  sugar: "SUGAR",
  coffee: "COFFEE",
  cocoa: "COCOA",
};

let mineralCache: { prices: Record<string, number>; fetchedAt: number } | null = null;
let commoditiesCache: { prices: Record<string, number>; fetchedAt: number } | null = null;
let fredCache: { oliveOil: number; fromApi: boolean; fetchedAt: number } | null = null;

// ─── MetalpriceAPI ───────────────────────────────────────────────────────
async function fetchMetalpriceAPI(symbols: string[]): Promise<Record<string, number>> {
  const apiKey = process.env.METALPRICE_API_KEY;
  if (!apiKey) return {};

  const currencies = symbols.map((s) => `USD${s}`).join(",");
  const url = `https://api.metalpriceapi.com/v1/latest?api_key=${apiKey}&base=USD&currencies=${currencies}`;

  try {
    const res = await fetch(url);
    const data = (await res.json()) as { success?: boolean; rates?: Record<string, number> };
    if (!data.success || !data.rates) return {};

    const out: Record<string, number> = {};
    for (const [key, pricePerOz] of Object.entries(data.rates)) {
      if (typeof pricePerOz !== "number") continue;
      const symbol = key.replace("USD", "");
      out[symbol] = pricePerOz * OZ_PER_TONNE;
    }
    return out;
  } catch (e) {
    console.warn("MarketPrices: MetalpriceAPI fetch failed:", e);
    return {};
  }
}

// ─── Commodities-API ─────────────────────────────────────────────────────
async function fetchCommoditiesAPI(symbols: string[]): Promise<Record<string, number>> {
  const apiKey = process.env.COMMODITIES_API_KEY;
  if (!apiKey) return {};

  const symbolsStr = symbols.join(",");
  const url = `https://commodities-api.com/api/latest?access_key=${apiKey}&base=USD&symbols=${symbolsStr}`;

  try {
    const res = await fetch(url);
    const data = (await res.json()) as {
      success?: boolean;
      rates?: Record<string, number>;
      unit?: Record<string, string>;
    };
    if (!data.success || !data.rates) return {};

    const out: Record<string, number> = {};
    for (const [sym, rate] of Object.entries(data.rates)) {
      if (typeof rate !== "number" || rate <= 0) continue;
      const cfg = COMMODITIES_SYMBOLS[sym];
      const usdPerUnit = 1 / rate;
      out[sym] = cfg ? cfg.toTonne(usdPerUnit) : usdPerUnit;
    }
    return out;
  } catch (e) {
    console.warn("MarketPrices: Commodities-API fetch failed:", e);
    return {};
  }
}

// ─── FRED (St. Louis Fed) ─────────────────────────────────────────────────
async function fetchFredOliveOil(): Promise<number | null> {
  const apiKey = process.env.FRED_API_KEY;
  if (!apiKey) return null;

  const url = `https://api.stlouisfed.org/fred/series/observations?series_id=POLVOILUSDM&api_key=${apiKey}&file_type=json&sort_order=desc&limit=1`;

  try {
    const res = await fetch(url);
    const data = (await res.json()) as { observations?: Array<{ value: string }> };
    const obs = data.observations?.[0];
    if (!obs?.value || obs.value === ".") return null;
    return parseFloat(obs.value);
  } catch (e) {
    console.warn("MarketPrices: FRED fetch failed:", e);
    return null;
  }
}

// ─── Public: Minerals ────────────────────────────────────────────────────
export async function getMarketMetalPrices(): Promise<Record<string, number>> {
  if (mineralCache && Date.now() - mineralCache.fetchedAt < CACHE_TTL_MS) {
    return mineralCache.prices;
  }

  const symbols = [...new Set(Object.values(METAL_SYMBOLS))];
  const apiPrices = await fetchMetalpriceAPI(symbols);

  const prices: Record<string, number> = {};
  const symbolToProduct: Record<string, string> = Object.fromEntries(
    Object.entries(METAL_SYMBOLS).map(([k, v]) => [v, k])
  );

  for (const [symbol, pricePerTonne] of Object.entries(apiPrices)) {
    const product = symbolToProduct[symbol];
    if (product) prices[product] = pricePerTonne;
  }

  if (process.env.COMMODITIES_API_KEY && prices.antimony == null) {
    const commodities = await fetchCommoditiesAPI(["ANTIMONY"]);
    if (commodities.ANTIMONY != null) prices.antimony = commodities.ANTIMONY;
  }

  for (const [product, fallback] of Object.entries(FALLBACK_MINERALS)) {
    if (prices[product] == null) prices[product] = fallback.lme;
  }

  mineralCache = { prices, fetchedAt: Date.now() };
  return prices;
}

export async function getMineralMarketPrice(
  productId: string,
  originCountry?: string
): Promise<{ pricePerTonne: number; source: string }> {
  const market = await getMarketMetalPrices();
  const price = market[productId];

  const fallback = FALLBACK_MINERALS[productId];
  const useSMM =
    originCountry &&
    ["china", "japan", "south korea", "thailand", "vietnam", "indonesia", "india", "taiwan"]
      .some((c) => originCountry.toLowerCase().includes(c)) &&
    fallback?.smm != null;

  if (price != null) {
    const src = process.env.METALPRICE_API_KEY || process.env.COMMODITIES_API_KEY ? "API" : "fallback";
    return { pricePerTonne: price, source: src };
  }

  if (fallback) {
    return {
      pricePerTonne: useSMM ? fallback.smm! : fallback.lme,
      source: useSMM ? "SMM" : "config",
    };
  }

  return { pricePerTonne: 0, source: "unknown" };
}

// ─── Public: Steel / Agri / Food ──────────────────────────────────────────
async function getCommoditiesPrices(): Promise<Record<string, number>> {
  if (commoditiesCache && Date.now() - commoditiesCache.fetchedAt < CACHE_TTL_MS) {
    return commoditiesCache.prices;
  }

  const symbols = [
    STEEL_SYMBOL,
    STEEL_SYMBOL_ASIA,
    ...new Set(Object.values(AGRI_SYMBOLS)),
  ];
  const prices = await fetchCommoditiesAPI([...new Set(symbols)]);
  commoditiesCache = { prices, fetchedAt: Date.now() };
  return prices;
}

async function getOliveOilPrice(): Promise<{ price: number; fromApi: boolean }> {
  if (fredCache && Date.now() - fredCache.fetchedAt < CACHE_TTL_MS) {
    return { price: fredCache.oliveOil, fromApi: fredCache.fromApi };
  }
  const price = await fetchFredOliveOil();
  const value = price ?? 6000;
  fredCache = { oliveOil: value, fromApi: price != null, fetchedAt: Date.now() };
  return { price: value, fromApi: price != null };
}

/** Get base price for a product family (steel, agri, food). USD/tonne. */
export async function getProductFamilyMarketPrice(
  familyId: string,
  productParam?: string,
  originCountry?: string
): Promise<{ pricePerTonne: number; source: string } | null> {
  const isAsia =
    originCountry &&
    ["china", "japan", "south korea", "thailand", "vietnam", "indonesia", "india", "taiwan"]
      .some((c) => originCountry.toLowerCase().includes(c));

  if (familyId === "finished_metal_steel") {
    const prices = await getCommoditiesPrices();
    const sym = isAsia ? STEEL_SYMBOL_ASIA : STEEL_SYMBOL;
    const price = prices[sym];
    const fallback = 650;
    return {
      pricePerTonne: price ?? fallback,
      source: price != null && process.env.COMMODITIES_API_KEY ? "Commodities-API" : "config",
    };
  }

  if (familyId === "agri_bulk" && productParam) {
    const sym = AGRI_SYMBOLS[productParam];
    if (!sym) return null;
    const prices = await getCommoditiesPrices();
    const price = prices[sym];
    const fallbacks: Record<string, number> = {
      wheat: 250,
      corn: 200,
      rice: 400,
      soybeans: 450,
      sugar: 350,
      coffee: 3500,
      cocoa: 4000,
      palm_oil: 800,
      barley: 220,
    };
    const fallback = fallbacks[productParam] ?? 250;
    return {
      pricePerTonne: price ?? fallback,
      source: price != null && process.env.COMMODITIES_API_KEY ? "Commodities-API" : "config",
    };
  }

  if (familyId === "food_beverage") {
    if (productParam === "olive_oil" || productParam === "oil") {
      const { price, fromApi } = await getOliveOilPrice();
      return {
        pricePerTonne: price,
        source: fromApi ? "FRED" : "config",
      };
    }
    const fallback = 2000;
    return { pricePerTonne: fallback, source: "config" };
  }

  return null;
}
