/**
 * SmartSeek logo — Uses the provided 3D blue S in hexagonal badge.
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
    <img
      src="/logo.png"
      alt="SmartSeek"
      className={`${sizeClass} shrink-0 object-contain rounded-lg ${isLight ? "opacity-90" : ""} ${className}`}
      style={{ mixBlendMode: "multiply" }}
    />
  );
}
