/**
 * Smart Seek logo — Precision Target (Variation A)
 * Flat, scalable, favicon-compatible. Navy primary, electric blue accent.
 * variant="light" for dark backgrounds (white/light mark).
 */
interface LogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "default" | "light";
  className?: string;
}

const sizeMap = { sm: "w-8 h-8", md: "w-9 h-9", lg: "w-10 h-10" };

const NAVY = "#0f172a";
const BLUE = "#2563eb";
const WHITE = "#ffffff";

export function Logo({ size = "md", variant = "default", className = "" }: LogoProps) {
  const sizeClass = sizeMap[size];
  const isLight = variant === "light";
  const stroke = isLight ? WHITE : NAVY;
  const fill = isLight ? WHITE : NAVY;
  return (
    <div
      className={`${sizeClass} shrink-0 flex items-center justify-center overflow-hidden ${className}`}
    >
      <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
        <circle cx="16" cy="16" r="14" stroke={stroke} strokeWidth="2" fill="none" />
        <circle cx="16" cy="16" r="9" stroke={stroke} strokeWidth="1.5" fill="none" />
        <circle cx="16" cy="16" r="4" fill={fill} />
      </svg>
    </div>
  );
}
