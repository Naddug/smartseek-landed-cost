import { cn } from "@/lib/utils";

interface ReadinessRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  className?: string;
}

export function ReadinessRing({
  score,
  size = 48,
  strokeWidth = 4,
  label,
  className,
}: ReadinessRingProps) {
  const normalized = Math.min(100, Math.max(0, score));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (normalized / 100) * circumference;

  const strokeColor =
    normalized >= 70
      ? "var(--ortaq-success)"
      : normalized >= 40
        ? "var(--ortaq-warning)"
        : "var(--ortaq-danger)";

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
      aria-label={label ?? `Hazırlık skoru: ${normalized}`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--ortaq-line)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-500"
        />
      </svg>
      <span className="absolute font-heading text-xs font-semibold text-ortaq-navy">
        {normalized}
      </span>
    </div>
  );
}
