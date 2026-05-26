import { cn } from "@/lib/cn";

type ReassuranceNoteProps = {
  children: React.ReactNode;
  className?: string;
};

/** Calm context strip. Not a CTA. */
export function ReassuranceNote({ children, className }: ReassuranceNoteProps) {
  return (
    <p className={cn("text-xs leading-[1.55] text-ortaq-ink-soft", className)}>
      {children}
    </p>
  );
}
