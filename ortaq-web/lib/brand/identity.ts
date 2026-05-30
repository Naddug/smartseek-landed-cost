/**
 * ORTAQ institutional identity, industrial investment infrastructure.
 * Bloomberg × Stripe × BlackRock: ownership, capital flow, regulated trust.
 */
export const brand = {
  name: "ORTAQ", domain: "ortaq.biz", green: {
    deep: "#0A1310", primary: "#0F1F19", panel: "#122820", trust: "#1A3D32", muted: "#2A5548", soft: "#4A7263", }, graphite: {
    ink: "#0E0D0C", primary: "#141310", panel: "#1A1917", muted: "#2C2A27", }, cream: {
    primary: "#EDEAE6", muted: "#C4C0B8", dim: "#8A857C", }, gold: "#A38458", mint: "#567A6A",
} as const;

export type BrandTheme = "light" | "dark" | "mono";

export type MarkPalette = {
  frame: string;
  frameStroke: string;
  ring: string;
  accent: string;
  network: string;
  hub: string;
};

export function getMarkPalette(theme: BrandTheme): MarkPalette {
  if (theme === "mono") {
    return {
      frame: brand.graphite.ink, frameStroke: brand.cream.primary, ring: brand.cream.primary, accent: brand.cream.primary, network: brand.cream.primary, hub: brand.cream.primary, };
  }
  if (theme === "dark") {
    return {
      frame: brand.green.deep, frameStroke: brand.cream.primary, ring: brand.cream.primary, accent: brand.gold, network: brand.cream.muted, hub: brand.gold, };
  }
  return {
    frame: brand.green.primary, frameStroke: brand.cream.primary, ring: brand.cream.primary, accent: brand.gold, network: brand.mint, hub: brand.gold, };
}

export function getWordmarkPalette(theme: BrandTheme) {
  if (theme === "dark" || theme === "mono") {
    return {
      name: brand.cream.primary, tagline: brand.cream.dim, rule: brand.gold, };
  }
  return {
    name: brand.graphite.primary, tagline: brand.green.muted, rule: brand.gold, };
}

/** Shared mark geometry, single source for React, OG, and static SVG exports */
export const markGeometry = {
  frameRadius: 3.5, insetRadius: 3, ringRadius: 8.25, ringStroke: 2.5, networkStroke: 1.15, /** Main ring, ~300° sweep, access gap top-right */
  ringMain: "M19.86 10.62 A8.25 8.25 0 1 1 10.52 19.38", /** Gold anchor segment, bottom of ring */
  ringAccent: "M10.88 21.42 A8.25 8.25 0 0 1 21.12 21.42", /** Capital network, hub to three nodes */
  network: "M16 16V13.1M16 16L13.95 17.55M16 16L18.05 17.55", hub: { x: 14.875, y: 14.875, size: 2.25 },
} as const;
