"use client";

import { cn } from "@/lib/cn";

type VisualImageProps = {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  sizes?: string;
};

/** Static /public photos — native img so grid layouts never collapse to zero height. */
export function VisualImage({
  src,
  alt,
  className,
  imageClassName,
  priority = false,
}: VisualImageProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
      className={cn("block size-full object-cover", imageClassName, className)}
    />
  );
}
