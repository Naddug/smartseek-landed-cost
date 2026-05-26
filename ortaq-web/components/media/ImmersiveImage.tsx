"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";
import { typography } from "@/design/typography";

type ImmersiveImageProps = {
  src: string;
  alt: string;
  credit?: string;
  caption?: string;
  focalPoint?: string;
  variant?: "full" | "contained" | "tall" | "texture" | "bleed";
  priority?: boolean;
  parallax?: boolean;
  /** Pull image tighter — more operational crop */
  cropIntensity?: "normal" | "tight" | "raw";
  /** Heavier grain + contrast for worn industrial feel */
  density?: "normal" | "heavy";
  /** Optional overlay slot — traces, stamps */
  overlay?: ReactNode;
  className?: string;
};

const heightClass = {
  full: "min-h-[55vh] sm:min-h-[70vh]",
  contained: "aspect-[4/3] sm:aspect-[16/10]",
  tall: "min-h-[72vh] sm:min-h-[88vh]",
  texture: "min-h-[45vh] sm:min-h-[55vh]",
  bleed: "min-h-[50vh] sm:min-h-[65vh]",
};

const scaleClass = {
  normal: "scale-[1.1]",
  tight: "scale-[1.22]",
  raw: "scale-[1.32]",
};

const scaleValue = {
  normal: 1.1,
  tight: 1.22,
  raw: 1.32,
};

export function ImmersiveImage({
  src,
  alt,
  credit,
  caption,
  focalPoint = "center center",
  variant = "full",
  priority = false,
  parallax = true,
  cropIntensity = "normal",
  density = "normal",
  overlay,
  className,
}: ImmersiveImageProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setVisible(true);
      },
      { threshold: 0.08, rootMargin: "0px 0px -5% 0px" },
    );
    io.observe(el);

    if (!parallax) return () => io.disconnect();

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      if (rect.bottom < 0 || rect.top > vh) return;
      const progress = (vh - rect.top) / (vh + rect.height);
      setOffset((progress - 0.5) * 32);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [parallax]);

  const isTexture = variant === "texture";

  return (
    <figure
      ref={ref}
      className={cn(
        "relative overflow-hidden bg-ortaq-dark",
        heightClass[variant],
        "transition-opacity duration-[1400ms] ease-out motion-reduce:transition-none",
        visible ? "opacity-100" : "opacity-0",
        variant === "bleed" && "-mt-16 sm:-mt-24",
        className,
      )}
    >
      <div
        className={cn(
          "absolute inset-0 motion-reduce:scale-100 motion-reduce:transform-none",
          scaleClass[cropIntensity],
        )}
        style={
          parallax
            ? {
                transform: `translate3d(0, ${offset}px, 0) scale(${scaleValue[cropIntensity]})`,
              }
            : undefined
        }
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="100vw"
          className={cn(
            "object-cover",
            (isTexture || density === "heavy") && "contrast-[1.12] saturate-[0.88] brightness-[0.94]",
            cropIntensity === "raw" && "contrast-[1.18] saturate-[0.82]",
          )}
          style={{ objectPosition: focalPoint }}
        />
      </div>
      <div
        className={cn(
          "pointer-events-none absolute inset-0",
          isTexture
            ? "bg-gradient-to-b from-ortaq-dark/70 via-ortaq-dark/20 to-ortaq-dark/80"
            : "bg-gradient-to-t from-ortaq-dark/60 via-transparent to-ortaq-dark/15",
        )}
        aria-hidden
      />
      <div
        className={cn(
          "access-grain pointer-events-none absolute inset-0",
          density === "heavy" ? "opacity-50" : "opacity-[0.35]",
        )}
        aria-hidden
      />
      {overlay && (
        <div className="pointer-events-none absolute inset-0 z-[2]">{overlay}</div>
      )}
      {(caption || credit) && (
        <figcaption className="absolute bottom-0 left-0 right-0 px-4 pb-4 sm:px-8 sm:pb-6">
          {caption && <p className={cn(typography.bodySm, "text-ortaq-cream/85")}>{caption}</p>}
          {credit && <p className={cn(typography.caption, "mt-1 text-ortaq-cream/40")}>{credit}</p>}
        </figcaption>
      )}
    </figure>
  );
}
