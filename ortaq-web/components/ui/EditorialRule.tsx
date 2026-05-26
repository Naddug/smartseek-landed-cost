import { cn } from "@/lib/cn";

type EditorialRuleProps = {
  className?: string;
  /** inset from container edges */
  inset?: boolean;
};

/** Thin horizontal rule — editorial chapter break, not a card shadow */
export function EditorialRule({ className, inset = false }: EditorialRuleProps) {
  return (
    <hr
      className={cn(
        "border-0 border-t border-ortaq-border",
        inset && "mx-4 sm:mx-0",
        className,
      )}
      aria-hidden
    />
  );
}
