"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";
import { typography } from "@/design/typography";

type DocumentaryImageProps = {
  src: string;
  alt: string;
  credit: string;
  caption?: string;
  className?: string;
  aspect?: "editorial" | "panorama" | "square";
  focalPoint?: string;
  bleedMobile?: boolean;
  showStockLabel?: boolean;
  stockLabel?: string;
  priority?: boolean;
};

const aspectClass = {
  editorial: "aspect-[4/3] sm:aspect-[5/4]",
  panorama: "aspect-[3/2] sm:aspect-[16/9]",
  square: "aspect-square max-w-md",
};

export function DocumentaryImage({
  src,
  alt,
  credit,
  caption,
  className,
  aspect = "editorial",
  focalPoint = "center center",
  bleedMobile = false,
  showStockLabel = true,
  stockLabel,
  priority = false,
}: DocumentaryImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <figure className={cn(bleedMobile && "-mx-4 sm:mx-0", className)}>
      <div
        className={cn(
          "relative overflow-hidden border-y border-ortaq-border bg-ortaq-bg-warm sm:rounded-ortaq-sm sm:border sm:shadow-[inset_0_-1px_0_rgb(26_24_20_/0.04)]",
          aspectClass[aspect],
        )}
      >
        {!loaded && (
          <div
            className="absolute inset-0 animate-pulse bg-ortaq-bg-warm"
            aria-hidden
          />
        )}
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 640px"
          className={cn(
            "object-cover transition-opacity duration-500 motion-reduce:transition-none",
            loaded ? "opacity-100" : "opacity-0",
          )}
          style={{ objectPosition: focalPoint }}
          priority={priority}
          onLoad={() => setLoaded(true)}
        />
      </div>
      <figcaption className="mt-3 space-y-1 px-4 sm:px-0">
        {showStockLabel && stockLabel && (
          <p className={typography.caption}>{stockLabel}</p>
        )}
        {caption && <p className={typography.bodySm}>{caption}</p>}
        <p className={typography.caption}>{credit}</p>
      </figcaption>
    </figure>
  );
}
