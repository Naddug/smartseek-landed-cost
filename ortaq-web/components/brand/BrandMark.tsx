import { cn } from "@/lib/cn";
import { getMarkPalette, type BrandTheme } from "@/lib/brand/identity";
import { MarkSvg, markSvgString } from "@/lib/brand/MarkSvg";

type BrandMarkProps = {
  size?: number;
  className?: string;
  theme?: BrandTheme;
  bare?: boolean;
};

export function BrandMark({ size = 32, className, theme = "light", bare = false }: BrandMarkProps) {
  const palette = getMarkPalette(theme);
  return <MarkSvg palette={palette} size={size} bare={bare} className={cn("shrink-0", className)} />;
}

export function brandMarkSvg(theme: BrandTheme = "light", bare = false): string {
  return markSvgString(getMarkPalette(theme), bare);
}

export { brand } from "@/lib/brand/identity";
