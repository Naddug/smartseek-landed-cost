/**
 * Map country names (as used in UI) to ISO 3166-1 alpha-2 codes.
 * Used for landed cost, customs, and freight lookups.
 */
export const COUNTRY_NAME_TO_CODE: Record<string, string> = {
  "Any": "CN", // Default to China for "any" origin (common sourcing hub)
  "China": "CN",
  "United States": "US",
  "United States of America": "US",
  "USA": "US",
  "Germany": "DE",
  "United Kingdom": "GB",
  "UK": "GB",
  "France": "FR",
  "Japan": "JP",
  "South Korea": "KR",
  "Korea, Republic of": "KR",
  "India": "IN",
  "Vietnam": "VN",
  "Thailand": "TH",
  "Indonesia": "ID",
  "Mexico": "MX",
  "Turkey": "TR",
  "Canada": "CA",
  "Australia": "AU",
  "Italy": "IT",
  "Spain": "ES",
  "Brazil": "BR",
  "Poland": "PL",
  "Malaysia": "MY",
  "Singapore": "SG",
  "Taiwan": "TW",
  "United Arab Emirates": "AE",
  "UAE": "AE",
  "Bangladesh": "BD",
  "Pakistan": "PK",
  "Egypt": "EG",
  "Philippines": "PH",
  "Netherlands": "NL",
  "Belgium": "BE",
  "Sweden": "SE",
  "Switzerland": "CH",
  "Austria": "AT",
  "Portugal": "PT",
  "Czech Republic": "CZ",
  "Romania": "RO",
  "Hungary": "HU",
  "Greece": "GR",
  "Ireland": "IE",
  "Russia": "RU",
  "South Africa": "ZA",
  "Argentina": "AR",
  "Chile": "CL",
  "Colombia": "CO",
  "Peru": "PE",
  "Israel": "IL",
  "Saudi Arabia": "SA",
  "Iran": "IR",
  "Iraq": "IQ",
  "Nigeria": "NG",
  "Kenya": "KE",
  "Morocco": "MA",
  "Algeria": "DZ",
  "Tunisia": "TN",
  "Ukraine": "UA",
  "Hong Kong": "HK",
  "New Zealand": "NZ",
};

export function getCountryCode(nameOrCode: string): string {
  if (!nameOrCode || typeof nameOrCode !== "string") return "US";
  const trimmed = nameOrCode.trim();
  if (trimmed.length === 2) return trimmed.toUpperCase();
  return COUNTRY_NAME_TO_CODE[trimmed] ?? COUNTRY_NAME_TO_CODE[trimmed.toLowerCase()] ?? "US";
}

/** Canonical display names for common variants (avoid duplicates like "united states" vs "United States") */
const LOWER_TO_DISPLAY: Record<string, string> = {};
for (const proper of Object.keys(COUNTRY_NAME_TO_CODE)) {
  LOWER_TO_DISPLAY[proper.toLowerCase()] = proper;
}
LOWER_TO_DISPLAY["united states of america"] = "United States";
LOWER_TO_DISPLAY["us"] = "United States";
LOWER_TO_DISPLAY["great britain"] = "United Kingdom";
LOWER_TO_DISPLAY["england"] = "United Kingdom";
LOWER_TO_DISPLAY["korea"] = "South Korea";
LOWER_TO_DISPLAY["republic of korea"] = "South Korea";

/** Format country/location for display — never lowercase. Use proper casing. */
export function formatCountryDisplay(raw: string | null | undefined): string {
  if (!raw || typeof raw !== "string") return "";
  const trimmed = raw.trim();
  if (!trimmed) return "";
  const lower = trimmed.toLowerCase();
  const known = LOWER_TO_DISPLAY[lower];
  if (known) return known;
  return trimmed.split(/\s+/).map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
}
