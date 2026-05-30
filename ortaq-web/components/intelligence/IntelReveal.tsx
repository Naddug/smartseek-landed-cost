"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type IntelRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Above-the-fold content must render immediately, never start hidden. */
  immediate?: boolean;
};

export function IntelReveal({ children, className, delay = 0, immediate = false }: IntelRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(immediate);

  useEffect(() => {
    if (immediate) return;

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      }, { threshold: 0.05, rootMargin: "0px 0px 0px 0px" }, );

    observer.observe(el);
    return () => observer.disconnect();
  }, [immediate]);

  if (immediate) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      ref={ref}
      className={cn("intel-reveal", visible && "intel-reveal-visible", className)}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
