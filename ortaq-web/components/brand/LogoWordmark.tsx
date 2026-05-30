import { cn } from "@/lib/cn";
import { getWordmarkPalette, type BrandTheme } from "@/lib/brand/identity";

type LogoWordmarkProps = {
  theme?: BrandTheme;
  showTagline?: boolean;
  tagline?: string;
  stacked?: boolean;
  className?: string;
};

/** Institutional wordmark, Inter 700, tight kerning, fintech weight. */
export function LogoWordmark({
  theme = "light", showTagline = false, tagline, stacked = false, className,
}: LogoWordmarkProps) {
  const p = getWordmarkPalette(theme);

  return (
    <span
      className={cn("flex min-w-0 leading-none", stacked ? "flex-col gap-1.5" : "flex-col", className)}
      style={{ color: p.name }}
    >
      <span className="inline-flex flex-col">
        <span
          className="font-brand text-[1.0625rem] font-bold tracking-[-0.072em] sm:text-[1.125rem]"
          style={{ fontFeatureSettings: '"ss01", "cv01"' }}
        >
          ORTAQ
        </span>
        <span className="mt-2 h-[2px] w-6 rounded-full" style={{ backgroundColor: p.rule }} aria-hidden />
      </span>
      {showTagline && tagline && (
        <span
          className={cn(
            "mt-0.5 text-[0.5625rem] font-semibold uppercase tracking-[0.16em]", stacked
              ? "max-w-[13rem] normal-case tracking-[0.07em] sm:text-[0.625rem]"
              : "hidden lg:block", )}
          style={{ color: p.tagline }}
        >
          {tagline}
        </span>
      )}
    </span>
  );
}
