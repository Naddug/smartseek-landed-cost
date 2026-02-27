/**
 * Smart Seek logo — Bold futuristic 'S' on blue gradient.
 * Clear letterform, unmistakable at small sizes.
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
  const bgStart = isLight ? "#1e40af" : "#3b82f6";
  const bgMid = isLight ? "#2563eb" : "#2563eb";
  const bgEnd = isLight ? "#1e3a8a" : "#1d4ed8";
  return (
    <div
      className={`${sizeClass} shrink-0 rounded-xl flex items-center justify-center overflow-hidden ${
        isLight ? "bg-white/10" : ""
      } ${className}`}
    >
      <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
        <defs>
          <linearGradient id="logobg" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop stopColor={bgStart} />
            <stop offset="0.5" stopColor={bgMid} />
            <stop offset="1" stopColor={bgEnd} />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="8" fill="url(#logobg)" />
        <path
          d="M9 8 C 23 8 23 10 17 12 C 9 14 9 16 17 18 C 23 20 23 22 9 24"
          stroke={stroke}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </div>
  );
}
