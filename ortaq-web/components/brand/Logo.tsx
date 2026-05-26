import { cn } from "@/lib/cn";
import Link from "next/link";
import { BrandMark } from "@/components/brand/BrandMark";
import { LogoWordmark } from "@/components/brand/LogoWordmark";
import type { BrandTheme } from "@/lib/brand/identity";

type LogoProps = {
  className?: string;
  variant?: "default" | "mark" | "stacked";
  theme?: BrandTheme;
  showTagline?: boolean;
  tagline?: string;
  markSize?: number;
};

export function Logo({
  className,
  variant = "default",
  theme = "light",
  showTagline = false,
  tagline,
  markSize = 36,
}: LogoProps) {
  if (variant === "mark") {
    return (
      <Link href="/" className={cn("inline-flex shrink-0", className)} aria-label="ORTAQ">
        <BrandMark size={markSize} theme={theme} />
      </Link>
    );
  }

  const isStacked = variant === "stacked";

  return (
    <Link
      href="/"
      className={cn(
        "group inline-flex min-w-0 items-center transition-opacity hover:opacity-[0.92]",
        isStacked ? "flex-col items-start gap-3.5" : "gap-2.5 sm:gap-3",
        className,
      )}
      aria-label="ORTAQ ana sayfa"
    >
      <BrandMark
        size={markSize}
        theme={theme}
        className="transition-transform duration-300 ease-out motion-reduce:transition-none group-hover:scale-[1.012]"
      />
      <LogoWordmark theme={theme} showTagline={showTagline} tagline={tagline} stacked={isStacked} />
    </Link>
  );
}
