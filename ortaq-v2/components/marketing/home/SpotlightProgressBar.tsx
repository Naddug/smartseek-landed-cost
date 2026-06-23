"use client";

import { cn } from "@/lib/utils";

interface SpotlightProgressBarProps {
  activeIndex: number;
  total: number;
  durationMs: number;
  paused: boolean;
  onSelect: (index: number) => void;
}

export function SpotlightProgressBar({
  activeIndex,
  total,
  durationMs,
  paused,
  onSelect,
}: SpotlightProgressBarProps) {
  return (
    <div className="mt-8 space-y-4">
      <div className="flex gap-2">
        {Array.from({ length: total }).map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Spotlight ${i + 1}`}
            onClick={() => onSelect(i)}
            className="group relative h-1 flex-1 overflow-hidden rounded-full bg-white/20"
          >
            {i === activeIndex && (
              <span
                key={`${activeIndex}-${paused}`}
                className={cn(
                  "absolute inset-y-0 left-0 bg-ortaq-accent",
                  !paused && "animate-spotlight-progress"
                )}
                style={
                  {
                    "--spotlight-duration": `${durationMs}ms`,
                    transform: paused ? "scaleX(1)" : undefined,
                  } as React.CSSProperties
                }
              />
            )}
            {i < activeIndex && (
              <span className="absolute inset-0 bg-white/40" />
            )}
          </button>
        ))}
      </div>
      <div className="flex justify-center gap-2">
        {Array.from({ length: total }).map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Dosya ${i + 1}`}
            onClick={() => onSelect(i)}
            className={cn(
              "h-2 w-2 rounded-full transition-colors",
              i === activeIndex ? "bg-white" : "bg-white/45 hover:bg-white/65"
            )}
          />
        ))}
      </div>
    </div>
  );
}
