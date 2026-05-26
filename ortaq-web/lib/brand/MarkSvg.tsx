import { markGeometry, type MarkPalette } from "@/lib/brand/identity";

type MarkSvgProps = {
  palette: MarkPalette;
  size?: number;
  bare?: boolean;
  className?: string;
};

/**
 * ORTAQ institutional mark — ownership ring · capital network · access gap.
 * Optimised for favicon legibility and monochrome reproduction.
 */
export function MarkSvg({ palette, size = 32, bare = false, className }: MarkSvgProps) {
  const g = markGeometry;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      {!bare && (
        <>
          <rect width="32" height="32" rx={g.frameRadius} fill={palette.frame} />
          <rect
            x="0.5"
            y="0.5"
            width="31"
            height="31"
            rx={g.insetRadius}
            stroke={palette.frameStroke}
            strokeOpacity={0.1}
            fill="none"
          />
        </>
      )}

      {/* Ownership ring — structural O with intelligent-access gap */}
      <path
        d={g.ringMain}
        stroke={palette.ring}
        strokeWidth={g.ringStroke}
        strokeLinecap="butt"
        fill="none"
      />
      <path
        d={g.ringAccent}
        stroke={palette.accent}
        strokeWidth={g.ringStroke}
        strokeLinecap="butt"
        fill="none"
      />

      {/* Capital flow network */}
      <path
        d={g.network}
        stroke={palette.network}
        strokeWidth={g.networkStroke}
        strokeLinecap="square"
        opacity={bare ? 0.55 : 0.42}
      />

      {/* Ownership hub */}
      <rect
        x={g.hub.x}
        y={g.hub.y}
        width={g.hub.size}
        height={g.hub.size}
        fill={palette.hub}
      />
    </svg>
  );
}

export function markSvgString(palette: MarkPalette, bare = false): string {
  const g = markGeometry;
  const frame = bare
    ? ""
    : `<rect width="32" height="32" rx="${g.frameRadius}" fill="${palette.frame}"/><rect x="0.5" y="0.5" width="31" height="31" rx="${g.insetRadius}" stroke="${palette.frameStroke}" stroke-opacity="0.1" fill="none"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none">${frame}<path d="${g.ringMain}" stroke="${palette.ring}" stroke-width="${g.ringStroke}" stroke-linecap="butt" fill="none"/><path d="${g.ringAccent}" stroke="${palette.accent}" stroke-width="${g.ringStroke}" stroke-linecap="butt" fill="none"/><path d="${g.network}" stroke="${palette.network}" stroke-width="${g.networkStroke}" stroke-linecap="square" opacity="0.42"/><rect x="${g.hub.x}" y="${g.hub.y}" width="${g.hub.size}" height="${g.hub.size}" fill="${palette.hub}"/></svg>`;
}
