/**
 * SmartSeek logo — Refined geometric S in a modern badge.
 * Clean, professional, scalable at all sizes.
 */
interface LogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "default" | "light";
  className?: string;
}

const sizeMap = { sm: "w-8 h-8", md: "w-9 h-9", lg: "w-10 h-10" };

export function Logo({ size = "md", variant = "default", className = "" }: LogoProps) {
  const sizeClass = sizeMap[size];
  const isLight = variant === "light";
  const stroke = "#ffffff";
  const bgStart = isLight ? "#0f172a" : "#0c4a6e";
  const bgEnd = isLight ? "#1e3a5f" : "#0369a1";
  return (
    <div
      className={`${sizeClass} shrink-0 rounded-lg flex items-center justify-center overflow-hidden ${
        isLight ? "bg-white/5 ring-1 ring-white/20" : ""
      } ${className}`}
    >
      <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
        <defs>
          <linearGradient id="logobg" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop stopColor={bgStart} />
            <stop offset="1" stopColor={bgEnd} />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="6" fill="url(#logobg)" />
        {/* Refined S — tighter, more balanced than before */}
        <path
          d="M10 8.5 C 21 8.5 21 10.5 16 12 C 11 13.5 11 15.5 16 17 C 21 18.5 21 20.5 10 23.5"
          stroke={stroke}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </div>
  );
}
