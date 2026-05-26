import { cn } from "@/lib/cn";
import Link from "next/link";

type LogoProps = {
  className?: string;
  variant?: "default" | "mark";
};

export function Logo({ className, variant = "default" }: LogoProps) {
  if (variant === "mark") {
    return (
      <Link href="/" className={cn("inline-flex shrink-0", className)} aria-label="ORTAQ">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
          <rect width="32" height="32" rx="8" fill="#1A1814" />
          <path
            d="M8 16.5C8 12.9 10.9 10 14.5 10H18v3h-3.5a3.5 3.5 0 1 0 0 7H18v3h-3.5C10.9 23 8 20.1 8 16.5Z"
            fill="#FAF8F5"
          />
          <circle cx="21" cy="16.5" r="2.5" fill="#B85C38" />
        </svg>
      </Link>
    );
  }

  return (
    <Link
      href="/"
      className={cn("inline-flex items-center gap-2.5 font-heading text-xl tracking-tight text-ortaq-ink", className)}
      aria-label="ORTAQ ana sayfa"
    >
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <rect width="32" height="32" rx="8" fill="#1A1814" />
        <path
          d="M8 16.5C8 12.9 10.9 10 14.5 10H18v3h-3.5a3.5 3.5 0 1 0 0 7H18v3h-3.5C10.9 23 8 20.1 8 16.5Z"
          fill="#FAF8F5"
        />
        <circle cx="21" cy="16.5" r="2.5" fill="#B85C38" />
      </svg>
      <span>ORTAQ</span>
    </Link>
  );
}
