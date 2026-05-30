/**
 * ORTAQ design tokens — single source of truth.
 * Import in components for programmatic values; mirror in index.css @theme for Tailwind.
 */

export const colors = {
  bg: "#faf8f5",
  bgAlt: "#f3efea",
  bgWarm: "#ebe4da",
  ink: "#1a1814",
  inkMuted: "#5c5650",
  inkSoft: "#8a837a",
  accent: "#b85c38",
  accentHover: "#9a4a2b",
  trust: "#2d5a4a",
  trustSoft: "#e8f0ec",
  border: "#e5dfd6",
  borderStrong: "#d4cbc0",
  risk: "#7a4a12",
  riskSoft: "#f6ead8",
  white: "#ffffff",
} as const;

export const fonts = {
  heading: '"Fraunces", Georgia, "Times New Roman", serif',
  body: '"DM Sans", system-ui, -apple-system, sans-serif',
} as const;

/** 4px base grid */
export const space = {
  0: "0",
  1: "0.25rem", // 4
  2: "0.5rem", // 8
  3: "0.75rem", // 12
  4: "1rem", // 16
  5: "1.25rem", // 20
  6: "1.5rem", // 24
  8: "2rem", // 32
  10: "2.5rem", // 40
  12: "3rem", // 48
  16: "4rem", // 64
  24: "6rem", // 96
} as const;

export const radius = {
  sm: "0.5rem",
  md: "0.75rem",
  lg: "1rem",
  xl: "1.25rem",
  full: "9999px",
} as const;

export const shadow = {
  soft: "0 1px 2px rgb(26 24 20 / 0.04), 0 8px 24px rgb(26 24 20 / 0.06)",
  card: "0 1px 0 rgb(26 24 20 / 0.04), 0 12px 32px rgb(26 24 20 / 0.07)",
} as const;

export const motion = {
  duration: "200ms",
  easing: "cubic-bezier(0.4, 0, 0.2, 1)",
} as const;

/** Typography scale — mobile first, sm+ desktop */
export const typeScale = {
  body: { size: "1rem", lineHeight: "1.625", smSize: "1rem", smLineHeight: "1.625" },
  bodySm: { size: "0.875rem", lineHeight: "1.571", smSize: "0.875rem", smLineHeight: "1.571" },
  lead: { size: "1.125rem", lineHeight: "1.667", smSize: "1.25rem", smLineHeight: "1.6" },
  h3: { size: "1.375rem", lineHeight: "1.3", smSize: "1.5rem", smLineHeight: "1.3" },
  h2: { size: "1.875rem", lineHeight: "1.15", smSize: "2.25rem", smLineHeight: "1.12" },
  h1: { size: "2.125rem", lineHeight: "1.08", smSize: "3rem", smLineHeight: "1.06" },
  label: { size: "0.75rem", lineHeight: "1.4", letterSpacing: "0.08em" },
} as const;

export const layout = {
  containerMax: "72rem",
  containerNarrow: "48rem",
  tapMin: "2.75rem", // 44px
} as const;
