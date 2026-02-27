/**
 * Map country names to ISO 3166-1 alpha-2 codes.
 * Handles typos, variants, empty (→ Undefined), and skips useless data.
 */
import {
  COUNTRY_NAME_TO_CODE as ISO_MAP,
  CODE_TO_DISPLAY,
} from "./isoCountryMap.generated";

export const COUNTRY_NAME_TO_CODE = ISO_MAP;

/** Typos and odd spellings → canonical country name for lookup */
const TYPO_FIXES: Record<string, string> = {
  // Typos
  chine: "China",
  chinaa: "China",
  chinna: "China",
  unitedstatess: "United States",
  "united statess": "United States",
  unitedstates: "United States",
  vietnamm: "Vietnam",
  vietnamn: "Vietnam",
  netherrlands: "Netherlands",
  netherland: "Netherlands",
  netherlandss: "Netherlands",
  germanny: "Germany",
  germani: "Germany",
  inddia: "India",
  inda: "India",
  japann: "Japan",
  japn: "Japan",
  brazill: "Brazil",
  brasil: "Brazil",
  england: "United Kingdom",
  "great britain": "United Kingdom",
  "the netherlands": "Netherlands",
  "the netherland": "Netherlands",
  korea: "South Korea",
  "south korea": "South Korea",
  "north korea": "North Korea",
  "republic of korea": "South Korea",
  "korea, republic of": "South Korea",
  "united kingdom": "United Kingdom",
  "united states": "United States",
  "united states of america": "United States",
  usa: "United States",
  uk: "United Kingdom",
};

function isEmpty(raw: string | null | undefined): boolean {
  return raw == null || (typeof raw === "string" && !raw.trim());
}

/** Useless: too short, numbers only, no letters, or clearly not a country. */
function isUseless(raw: string | null | undefined): boolean {
  if (raw == null || typeof raw !== "string") return false;
  const t = raw.trim();
  if (!t) return false;
  if (t.length === 1) return true;
  if (/^\d+$/.test(t)) return true;
  if (!/[a-zA-Z]/.test(t)) return true;
  if (t.length < 2) return true;
  return false;
}

/** Normalize: fix typos and variants. Returns normalized string. */
function normalizeCountryInput(raw: string): string {
  const trimmed = raw.trim();
  const lower = trimmed.toLowerCase();
  const fixed = TYPO_FIXES[lower] ?? trimmed;
  return fixed;
}

/** Get country code. Returns "UD" for empty (Undefined), "SKIP" for useless, "XX" for unknown, or valid code. */
export function getCountryCode(nameOrCode: string | null | undefined): string {
  if (isEmpty(nameOrCode)) return "UD";
  if (isUseless(nameOrCode)) return "SKIP";
  const raw = typeof nameOrCode === "string" ? nameOrCode : "";
  const normalized = normalizeCountryInput(raw);
  if (normalized.length === 2) return normalized.toUpperCase();
  const code = ISO_MAP[normalized] ?? ISO_MAP[normalized.toLowerCase()] ?? null;
  return code ?? "XX";
}

/** Whether to skip this row in stats/filters (useless data) */
export function shouldSkipCountry(nameOrCode: string | null | undefined): boolean {
  return getCountryCode(nameOrCode) === "SKIP";
}

/** Preferred short display names for common countries */
const DISPLAY_OVERRIDES: Record<string, string> = {
  US: "United States",
  GB: "United Kingdom",
  KR: "South Korea",
  RU: "Russia",
  TW: "Taiwan",
  HK: "Hong Kong",
  TZ: "Tanzania",
  BO: "Bolivia",
  VE: "Venezuela",
  IR: "Iran",
  LA: "Laos",
  KP: "North Korea",
  PS: "Palestine",
  SY: "Syria",
  MK: "North Macedonia",
  MD: "Moldova",
  CI: "Ivory Coast",
  CV: "Cape Verde",
  BN: "Brunei",
  TL: "Timor-Leste",
  SZ: "Eswatini",
  MO: "Macau",
  VN: "Vietnam",
  CZ: "Czech Republic",
  TR: "Turkey",
  UD: "Undefined",
};

/** Get canonical display name for a country code (used when merging stats). */
export function getDisplayForCode(code: string): string {
  return DISPLAY_OVERRIDES[code] ?? CODE_TO_DISPLAY[code] ?? code;
}

/** Format country/location for display — proper casing, never lowercase. */
export function formatCountryDisplay(raw: string | null | undefined): string {
  if (!raw || typeof raw !== "string") return "";
  const trimmed = raw.trim();
  if (!trimmed) return "";
  const code = getCountryCode(trimmed);
  if (code === "SKIP") return "";
  if (code !== "XX" && code !== "UD") return getDisplayForCode(code);
  if (code === "UD") return "Undefined";
  return trimmed
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}
