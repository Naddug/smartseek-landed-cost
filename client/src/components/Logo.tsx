/**
 * SmartSeek logo — inline SVG, works on any background at any size.
 *
 * variant="default"  — blue square bg + white search mark  (light surfaces)
 * variant="light"    — transparent bg + white search mark  (dark surfaces)
 */
interface LogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "default" | "light";
  className?: string;
}

export function Logo({ variant = "default", className = "" }: LogoProps) {
  const isLight = variant === "light";

  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-label="SmartSeek"
    >
      {/* Background — hidden in light variant */}
      {!isLight && (
        <>
          <defs>
            <linearGradient id="ss-bg" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1d4ed8" />
              <stop offset="1" stopColor="#2563eb" />
            </linearGradient>
          </defs>
          <rect width="32" height="32" rx="8" fill="url(#ss-bg)" />
        </>
      )}

      {/* Search circle */}
      <circle
        cx="14"
        cy="14"
        r="6.5"
        stroke="white"
        strokeWidth="2.2"
        strokeLinecap="round"
      />

      {/* Search handle */}
      <line
        x1="19.2"
        y1="19.2"
        x2="24.5"
        y2="24.5"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Inner dot — subtle "intelligence" detail */}
      <circle cx="14" cy="14" r="1.8" fill="white" opacity="0.5" />
    </svg>
  );
}

/**
 * Full wordmark: icon + "Smart Seek" with "Seek" accented in blue.
 * Use this instead of <Logo> + raw text whenever you want the full brand lockup.
 */
interface WordmarkProps {
  variant?: "default" | "light";
  className?: string;
  iconClassName?: string;
}

export function Wordmark({ variant = "default", className = "", iconClassName = "w-8 h-8" }: WordmarkProps) {
  const isLight = variant === "light";
  const textColor = isLight ? "text-white" : "text-slate-900";
  const accentColor = isLight ? "text-blue-300" : "text-blue-600";

  return (
    <span className={`flex items-center gap-2 ${className}`}>
      <Logo variant={variant} className={iconClassName} />
      <span className="text-lg font-bold tracking-tight leading-none">
        {/* "Smart" — bold, wide-tracked, bright gradient, subtle glow */}
        <span
          className="font-bold uppercase text-transparent bg-clip-text"
          style={{
            backgroundImage: isLight
              ? "linear-gradient(120deg, #ffffff 0%, #bfdbfe 50%, #a5b4fc 100%)"
              : "linear-gradient(120deg, #1e3a8a 0%, #2563eb 50%, #6366f1 100%)",
            letterSpacing: "0.18em",
            filter: isLight
              ? "drop-shadow(0 0 8px rgba(147,197,253,0.6))"
              : "drop-shadow(0 0 6px rgba(37,99,235,0.35))",
          }}
        >
          Smart
        </span>
        {/* "Seek" — bold, blue accent */}
        <span className={`font-extrabold tracking-tight ${isLight ? "text-blue-300" : "text-blue-600"}`}>
          Seek
        </span>
      </span>
    </span>
  );
}
