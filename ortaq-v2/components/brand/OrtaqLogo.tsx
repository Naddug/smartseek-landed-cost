import { cn } from "@/lib/utils";

type LogoTone = "navy" | "light" | "mono";

interface OrtaqMarkProps {
  className?: string;
  tone?: LogoTone;
  title?: string;
}

/**
 * ORTAQ symbol — "The Completing Arc".
 * Two facing arcs (one side's real asset + the missing partner) close, with
 * a hairline gap top and bottom, into a single whole "O". Incomplete → complete.
 */
export function OrtaqMark({ className, tone = "navy", title }: OrtaqMarkProps) {
  const assetArc =
    tone === "light" ? "#FFFFFF" : tone === "mono" ? "currentColor" : "var(--ortaq-navy)";
  const partnerArc =
    tone === "mono" ? "currentColor" : tone === "light" ? "var(--ortaq-accent)" : "var(--ortaq-action)";

  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      fill="none"
      role="img"
      aria-label={title ?? "ORTAQ"}
    >
      <path
        d="M14.09 5.17 A11 11 0 0 0 14.09 26.83"
        stroke={assetArc}
        strokeWidth={4}
        strokeLinecap="round"
      />
      <path
        d="M17.91 5.17 A11 11 0 0 1 17.91 26.83"
        stroke={partnerArc}
        strokeWidth={4}
        strokeLinecap="round"
      />
    </svg>
  );
}

interface OrtaqLogoProps {
  tone?: LogoTone;
  showWordmark?: boolean;
  className?: string;
  markClassName?: string;
}

export function OrtaqLogo({
  tone = "navy",
  showWordmark = true,
  className,
  markClassName,
}: OrtaqLogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <OrtaqMark tone={tone} className={cn("h-7 w-7", markClassName)} />
      {showWordmark && (
        <span
          className={cn(
            "font-heading text-lg font-bold tracking-[-0.02em]",
            tone === "light" ? "text-white" : "text-ortaq-navy"
          )}
        >
          ORTAQ
        </span>
      )}
    </span>
  );
}
