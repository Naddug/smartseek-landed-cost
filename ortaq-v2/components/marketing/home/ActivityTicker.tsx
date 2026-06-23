"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { activityTickerItems } from "@/data/marketing/home-dossiers";

export function ActivityTicker() {
  const [paused, setPaused] = useState(false);
  const items = [...activityTickerItems, ...activityTickerItems];

  return (
    <section
      className="surface-dark overflow-hidden border-b border-ortaq-dark-border py-2.5"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label="ORTAQ arşiv aktivitesi"
    >
      <div
        className={cn(
          "animate-ticker flex w-max gap-8 whitespace-nowrap px-4",
          paused && "animate-ticker-paused"
        )}
      >
        {items.map((item, i) => (
          <span
            key={`${item.id}-${i}`}
            className="font-mono text-[11px] font-medium uppercase tracking-wide text-ortaq-dark-text-muted"
          >
            {item.text}
          </span>
        ))}
      </div>
    </section>
  );
}
