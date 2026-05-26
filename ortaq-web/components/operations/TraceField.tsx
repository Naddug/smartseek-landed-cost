"use client";

import { EconomicTrace } from "@/components/operations/EconomicTrace";
import { getLayerTraces } from "@/lib/operations/traces";
import { cn } from "@/lib/cn";

type TraceFieldProps = {
  layer: keyof typeof import("@/lib/operations/traces").economicTraces.layers;
  variant?: "stamp" | "margin" | "ghost" | "overlay";
  className?: string;
};

/** Scattered traces for a layer — feels discovered in the margins */
export function TraceField({ layer, variant = "stamp", className }: TraceFieldProps) {
  const traces = getLayerTraces(layer);
  if (traces.length === 0) return null;

  const positions = [
    "sm:ml-auto sm:max-w-[11rem]",
    "sm:-mt-2 sm:max-w-[13rem]",
    "sm:ml-[12%] sm:max-w-[12rem]",
  ];

  return (
    <div className={cn("space-y-3 px-4 sm:space-y-4 sm:px-6 lg:px-8", className)}>
      {traces.map((trace, i) => (
        <EconomicTrace
          key={trace.id}
          traceKey={trace.key}
          date={trace.date}
          time={trace.time}
          variant={variant}
          align={i % 2 === 1 ? "right" : "left"}
          className={positions[i % positions.length]}
        />
      ))}
    </div>
  );
}
