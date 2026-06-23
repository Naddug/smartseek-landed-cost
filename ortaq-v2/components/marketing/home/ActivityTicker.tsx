"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { activityTickerItems } from "@/data/marketing/home-dossiers";

export function ActivityTicker() {
  const [paused, setPaused] = useState(false);
  const items = [...activityTickerItems, ...activityTickerItems];

  return (
    <section
      className="overflow-hidden border-b border-stone-800 bg-stone-950 py-2.5"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label="Platform aktivitesi"
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
            className="font-mono text-[11px] uppercase tracking-wide text-white/55"
          >
            {item.text}
          </span>
        ))}
      </div>
    </section>
  );
}
