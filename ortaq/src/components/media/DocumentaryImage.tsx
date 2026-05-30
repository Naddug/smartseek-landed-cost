import { cn } from "../../lib/cn";
import { typography } from "../../design/typography";

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
};

const aspectClass = {
  editorial: "aspect-[4/3] sm:aspect-[5/4]",
  panorama: "aspect-[4/3] sm:aspect-[16/9]",
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
}: DocumentaryImageProps) {
  return (
    <figure className={cn(bleedMobile && "-mx-4 sm:mx-0", className)}>
      <div
        className={cn(
          "relative overflow-hidden border-y border-ortaq-border bg-ortaq-bg-warm sm:rounded-ortaq-sm sm:border",
          aspectClass[aspect],
        )}
      >
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: focalPoint }}
          loading="lazy"
          decoding="async"
        />
      </div>
      <figcaption className="mt-3 space-y-1 px-4 sm:px-0">
        {showStockLabel && stockLabel && <p className={typography.caption}>{stockLabel}</p>}
        {caption && <p className={typography.bodySm}>{caption}</p>}
        <p className={typography.caption}>{credit}</p>
      </figcaption>
    </figure>
  );
}
