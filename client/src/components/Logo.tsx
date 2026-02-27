/**
 * SmartSeek logo - hexagonal 3D-style mark with stylized S cutout.
 * Use size="sm" | "md" | "lg" or className for dimensions.
 * variant="light" for dark backgrounds.
 */
import { useId } from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "default" | "light";
  className?: string;
}

const sizeMap = { sm: "w-8 h-8", md: "w-9 h-9", lg: "w-10 h-10" };

export function Logo({ size = "md", variant = "default", className = "" }: LogoProps) {
  const sizeClass = sizeMap[size];
  const isLight = variant === "light";
  const uid = useId().replace(/:/g, "");
  return (
    <div
      className={`${sizeClass} shrink-0 rounded-xl flex items-center justify-center overflow-hidden ${
        isLight
          ? "bg-white/20 shadow-none"
          : "bg-transparent shadow-lg shadow-blue-500/25"
      } ${className}`}
    >
      <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
        <defs>
          <linearGradient id={`${uid}-hex`} x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop stopColor={isLight ? "#f0f9ff" : "#60a5fa"} />
            <stop offset="0.35" stopColor={isLight ? "#e0f2fe" : "#3b82f6"} />
            <stop offset="0.7" stopColor={isLight ? "#bae6fd" : "#2563eb"} />
            <stop offset="1" stopColor={isLight ? "#7dd3fc" : "#1d4ed8"} />
          </linearGradient>
          <linearGradient id={`${uid}-cut`} x1="8" y1="8" x2="24" y2="24" gradientUnits="userSpaceOnUse">
            <stop stopColor={isLight ? "#1e40af" : "#1e3a8a"} />
            <stop offset="1" stopColor={isLight ? "#1e3a8a" : "#172554"} />
          </linearGradient>
        </defs>
        <path d="M16 2 L26 9 L26 23 L16 30 L6 23 L6 9 Z" fill={`url(#${uid}-hex)`} />
        <path d="M11 9 L21 9 L21 11 L11 16 L11 18 L21 18 L21 20 L11 15 L11 9 Z" fill={`url(#${uid}-cut)`} />
      </svg>
    </div>
  );
}
