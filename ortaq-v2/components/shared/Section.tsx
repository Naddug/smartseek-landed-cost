import { cn } from "@/lib/utils";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  variant?: "default" | "alt" | "surface";
}

const variantClasses = {
  default: "bg-ortaq-bg",
  alt: "bg-ortaq-surface-alt",
  surface: "bg-ortaq-surface",
};

export function Section({
  children,
  className,
  id,
  variant = "default",
}: SectionProps) {
  return (
    <section id={id} className={cn("py-12 md:py-16", variantClasses[variant], className)}>
      {children}
    </section>
  );
}
