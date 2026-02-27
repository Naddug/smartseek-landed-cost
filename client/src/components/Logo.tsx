/**
 * SmartSeek logo — Uses the provided 3D blue S in hexagonal badge.
 */
interface LogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "default" | "light";
  className?: string;
}

const sizeMap = { sm: "w-24 h-24", md: "w-28 h-28", lg: "w-32 h-32" };

export function Logo({ size = "md", variant = "default", className = "" }: LogoProps) {
  const sizeClass = sizeMap[size];
  const isLight = variant === "light";
  return (
    <img
      src="/logo.png"
      alt="SmartSeek"
      className={`${sizeClass} shrink-0 object-contain rounded-lg ${isLight ? "opacity-90" : ""} ${className}`}
    />
  );
}
