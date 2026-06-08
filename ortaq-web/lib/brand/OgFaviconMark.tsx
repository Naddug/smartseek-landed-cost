import { faviconFrame, getFaviconPalette } from "@/lib/brand/faviconMarks";

type OgFaviconMarkProps = {
  size?: number;
  theme?: "dark" | "light";
};

/** Monoline O — premium operational mark (production favicon). */
export function OgFaviconMark({ size = 32, theme = "dark" }: OgFaviconMarkProps) {
  const p = getFaviconPalette(theme);

  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx={faviconFrame.radius} fill={p.frame} />
      <circle cx="16" cy="16" r="9.5" stroke={p.primary} strokeWidth="2" fill="none" />
      <line x1="9" y1="16" x2="23" y2="16" stroke={p.accent} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
