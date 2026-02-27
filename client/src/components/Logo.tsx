/**
 * SmartSeek logo — Uses the provided 3D blue S in hexagonal badge.
 */
interface LogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "default" | "light";
  className?: string;
}

const sizeMap = { sm: "w-12 h-12", md: "w-14 h-14", lg: "w-16 h-16" };

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
