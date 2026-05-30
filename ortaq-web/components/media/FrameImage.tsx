import Image from "next/image";
import { cn } from "@/lib/cn";

type FrameImageProps = {
  src: string;
  alt: string;
  focalPoint?: string;
  priority?: boolean;
  className?: string;
  aspectClassName?: string;
  sizes?: string;
  observed?: boolean;
  interactive?: boolean;
  caption?: string;
};

/** Reliable local media frame, explicit aspect, no load-opacity tricks. */
export function FrameImage({
  src, alt, focalPoint = "center center", priority = false, className, aspectClassName = "aspect-[4/3]", sizes = "(max-width: 1024px) 100vw, 480px", observed = false, interactive = false, caption,
}: FrameImageProps) {
  return (
    <figure className={cn("relative", className)}>
      <div
        className={cn(
          "relative overflow-hidden rounded-ortaq-md border border-ortaq-border-strong bg-ortaq-bg-warm", aspectClassName, observed && "discover-image-observed", interactive && "discover-image-interactive", )}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover"
          style={{ objectPosition: focalPoint }}
        />
        {caption && (
          <figcaption className="absolute inset-x-0 bottom-0 z-[1] px-3 py-2 text-[0.6875rem] font-medium text-ortaq-cream/85">
            {caption}
          </figcaption>
        )}
      </div>
    </figure>
  );
}
