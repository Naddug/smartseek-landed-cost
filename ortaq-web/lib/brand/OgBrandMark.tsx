import { getMarkPalette, markGeometry } from "@/lib/brand/identity";

type OgBrandMarkProps = {
  size?: number;
  theme?: "light" | "dark";
};

/** Satori-safe mark — native SVG elements only */
export function OgBrandMark({ size = 32, theme = "dark" }: OgBrandMarkProps) {
  const p = getMarkPalette(theme);
  const g = markGeometry;

  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx={g.frameRadius} fill={p.frame} />
      <rect
        x="0.5"
        y="0.5"
        width="31"
        height="31"
        rx={g.insetRadius}
        stroke={p.frameStroke}
        strokeOpacity={0.1}
        fill="none"
      />
      <path
        d={g.ringMain}
        stroke={p.ring}
        strokeWidth={g.ringStroke}
        strokeLinecap="butt"
        fill="none"
      />
      <path
        d={g.ringAccent}
        stroke={p.accent}
        strokeWidth={g.ringStroke}
        strokeLinecap="butt"
        fill="none"
      />
      <path
        d={g.network}
        stroke={p.network}
        strokeWidth={g.networkStroke}
        strokeLinecap="square"
        opacity={0.42}
      />
      <rect x={g.hub.x} y={g.hub.y} width={g.hub.size} height={g.hub.size} fill={p.hub} />
    </svg>
  );
}
