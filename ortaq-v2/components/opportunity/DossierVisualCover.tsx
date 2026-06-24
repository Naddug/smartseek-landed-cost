"use client";

import Image from "next/image";
import { useCallback, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import {
  getDossierImageFallbackChain,
  getDossierVisual,
  type DossierVisualTheme,
} from "@/lib/dossier/dossier-visuals";

type CoverSize = "sm" | "md" | "lg" | "hero" | "banner";

const sizeClasses: Record<CoverSize, string> = {
  sm: "aspect-[16/10]",
  md: "aspect-[16/10]",
  lg: "aspect-[16/10]",
  hero: "aspect-[16/10] min-h-[240px] md:min-h-[360px]",
  banner: "aspect-[21/8] min-h-[180px] md:min-h-[240px]",
};

interface DossierVisualCoverProps {
  slug: string;
  categoryKey: string;
  refCode?: string;
  atmosphere?: string;
  theme?: DossierVisualTheme;
  size?: CoverSize;
  showMeta?: boolean;
  showGrain?: boolean;
  frame?: boolean;
  className?: string;
  priority?: boolean;
  /** light = cards/listings; editorial = hero spotlight; minimal = almost no grade */
  overlay?: "light" | "editorial" | "minimal";
}

export function DossierVisualCover({
  slug,
  categoryKey,
  refCode,
  atmosphere,
  theme: themeProp,
  size = "md",
  showMeta = true,
  showGrain = false,
  frame,
  className,
  priority = false,
  overlay = "light",
}: DossierVisualCoverProps) {
  const theme = themeProp ?? getDossierVisual({ slug, categoryKey });
  const fallbackChain = useMemo(
    () => getDossierImageFallbackChain(slug, categoryKey),
    [slug, categoryKey]
  );
  const [chainIndex, setChainIndex] = useState(0);
  const [useGradientFallback, setUseGradientFallback] = useState(false);
  const showFrame = frame ?? showMeta;

  const currentSrc = fallbackChain[chainIndex] ?? fallbackChain[0];

  const handleImageError = useCallback(() => {
    setChainIndex((index) => {
      const next = index + 1;
      if (next >= fallbackChain.length) {
        setUseGradientFallback(true);
        return index;
      }
      return next;
    });
  }, [fallbackChain.length]);

  const gradeOpacity =
    overlay === "minimal"
      ? "opacity-[0.05]"
      : overlay === "light"
        ? "opacity-[0.08]"
        : "opacity-[0.14]";

  const scrimClass =
    overlay === "minimal"
      ? "bg-[linear-gradient(to_top,rgba(15,23,42,0.65)_0%,rgba(15,23,42,0.06)_38%,transparent_62%)]"
      : overlay === "light"
        ? "bg-[linear-gradient(to_top,rgba(15,23,42,0.72)_0%,rgba(15,23,42,0.04)_42%,transparent_68%)]"
        : "bg-[linear-gradient(to_top,rgba(15,23,42,0.82)_0%,rgba(15,23,42,0.14)_50%,transparent_75%)]";

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-slate-200",
        sizeClasses[size],
        className
      )}
    >
      {useGradientFallback ? (
        <div
          className="absolute inset-0"
          aria-hidden
          style={{
            background: `linear-gradient(145deg, ${theme.gradientFrom} 0%, ${theme.gradientVia} 45%, ${theme.gradientTo} 100%)`,
          }}
        />
      ) : (
        <Image
          key={currentSrc}
          src={currentSrc}
          alt=""
          fill
          priority={priority}
          sizes={
            size === "hero" || size === "banner"
              ? "(max-width: 768px) 100vw, 1200px"
              : size === "lg"
                ? "(max-width: 768px) 100vw, 640px"
                : "(max-width: 768px) 50vw, 400px"
          }
          className="object-cover brightness-[1.03] contrast-[1.05] transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          style={{ objectPosition: theme.imagePosition ?? "center" }}
          onError={handleImageError}
        />
      )}

      {/* Subtle brand grade — keeps photos recognizable */}
      <div
        className={cn("absolute inset-0 bg-slate-900 mix-blend-multiply", gradeOpacity)}
        aria-hidden
      />

      <div
        className="absolute inset-0"
        aria-hidden
        style={{
          background: `radial-gradient(90% 80% at 0% 100%, ${theme.accentMuted} 0%, transparent 55%)`,
        }}
      />

      <div className={cn("absolute inset-0", scrimClass)} aria-hidden />

      {showGrain && (
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-overlay"
          aria-hidden
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />
      )}

      {showFrame && (
        <>
          <span
            className="pointer-events-none absolute left-3 top-3 h-4 w-4 border-l border-t border-white/35 md:left-4 md:top-4"
            aria-hidden
          />
          <span
            className="pointer-events-none absolute bottom-3 right-3 h-4 w-4 border-b border-r md:bottom-4 md:right-4"
            style={{ borderColor: theme.accent }}
            aria-hidden
          />
        </>
      )}

      <div
        className="absolute bottom-0 left-0 h-[3px] w-full"
        style={{ backgroundColor: theme.accent }}
        aria-hidden
      />

      {showMeta && (
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-3.5 md:p-4">
          <div className="min-w-0">
            {refCode && (
              <span className="inline-flex items-center rounded-md border border-white/20 bg-black/30 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-white/90 backdrop-blur-sm">
                {refCode}
              </span>
            )}
            <p className="mt-1.5 truncate text-sm font-semibold text-white drop-shadow-md md:text-[0.95rem]">
              {atmosphere ?? theme.atmosphere}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
