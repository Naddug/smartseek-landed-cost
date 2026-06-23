"use client";

import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { MarketingDossier } from "@/types/marketing-dossier";
import { DossierFilePanel } from "@/components/opportunity/DossierFilePanel";
import { marketingDossierToOpportunity } from "@/lib/marketing/map-marketing-dossier";

interface RotatingDossierCardProps {
  dossiers: MarketingDossier[];
  intervalMs?: number;
  theme?: "paper" | "light";
  size?: "md" | "lg";
  className?: string;
  label?: string;
}

export function RotatingDossierCard({
  dossiers,
  intervalMs = 8000,
  theme = "paper",
  size = "lg",
  className,
  label = "Canlı dosya önizlemesi",
}: RotatingDossierCardProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const advance = useCallback(() => {
    if (dossiers.length <= 1) return;
    setActiveIndex((i) => (i + 1) % dossiers.length);
  }, [dossiers.length]);

  useEffect(() => {
    if (paused || dossiers.length <= 1) return;
    const timer = setInterval(advance, intervalMs);
    return () => clearInterval(timer);
  }, [advance, intervalMs, paused, dossiers.length]);

  const active = dossiers[activeIndex] ?? dossiers[0];
  if (!active) return null;

  return (
    <div
      className={cn("relative w-full", className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ortaq-text-muted">
          {label}
        </p>
        {dossiers.length > 1 && (
          <div className="flex gap-1.5">
            {dossiers.map((d, i) => (
              <button
                key={d.id}
                type="button"
                aria-label={`Dosya ${i + 1}`}
                onClick={() => setActiveIndex(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === activeIndex ? "w-4 bg-ortaq-navy" : "w-1.5 bg-stone-300"
                )}
              />
            ))}
          </div>
        )}
      </div>

      <div className="relative">
        <DossierFilePanel
          key={active.id}
          opportunity={marketingDossierToOpportunity(active)}
          theme={theme}
          size={size}
          className="shadow-[0_12px_48px_-16px_rgba(20,33,61,0.22)] transition-opacity duration-500"
        />
      </div>
    </div>
  );
}
