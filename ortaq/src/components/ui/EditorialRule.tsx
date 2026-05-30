import { cn } from "@ortaq/lib/cn";

type EditorialRuleProps = {
  className?: string;
  inset?: boolean;
};

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
