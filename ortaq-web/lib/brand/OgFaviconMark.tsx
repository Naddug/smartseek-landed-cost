import { faviconFrame, getFaviconPalette } from "@/lib/brand/faviconMarks";

type OgFaviconMarkProps = {
  size?: number;
  theme?: "dark" | "light";
};

/**
 * Satori-safe production favicon — native SVG elements only (operations mark).
 */
export function OgFaviconMark({ size = 32, theme = "dark" }: OgFaviconMarkProps) {
  const p = getFaviconPalette(theme);

  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx={faviconFrame.radius} fill={p.frame} />
      <rect
        x="0.5"
        y="0.5"
        width="31"
        height="31"
        rx={faviconFrame.insetRadius}
        stroke={p.frameStroke}
        strokeOpacity={0.12}
        fill="none"
      />
      <circle cx="8" cy="11" r="2.25" fill={p.accent} />
      <line x1="11.5" y1="11" x2="24" y2="11" stroke={p.primary} strokeWidth="2.25" strokeLinecap="round" />
      <line x1="10" y1="16" x2="22" y2="16" stroke={p.secondary} strokeWidth="2" strokeLinecap="round" opacity={0.72} />
      <line x1="10" y1="21" x2="20" y2="21" stroke={p.secondary} strokeWidth="2" strokeLinecap="round" opacity={0.48} />
    </svg>
  );
}
