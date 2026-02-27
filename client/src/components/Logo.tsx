/**
 * SmartSeek logo - futuristic sourcing/intelligence mark.
 * Use size="sm" | "md" | "lg" or className for dimensions.
 * variant="light" for dark backgrounds (transparent with white mark).
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
  return (
    <div
      className={`${sizeClass} shrink-0 rounded-xl flex items-center justify-center overflow-hidden ${
        isLight
          ? "bg-white/20 shadow-none"
          : "bg-gradient-to-br from-blue-500 via-indigo-500 to-violet-500 shadow-lg shadow-blue-500/25"
      } ${className}`}
    >
      <svg viewBox="0 0 32 32" fill="none" className="w-[70%] h-[70%]">
        <path
          d="M10 8 Q 22 8 22 12 Q 10 12 10 18 Q 22 18 22 24"
          stroke="white"
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
          opacity="0.95"
        />
        <circle cx="22" cy="8" r="1.6" fill="white" />
      </svg>
    </div>
  );
}
