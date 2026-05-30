import { cn } from "@ortaq/lib/cn";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ButtonHTMLAttributes } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-ortaq-sm font-medium transition-colors duration-200 disabled:pointer-events-none disabled:opacity-50 min-h-11 px-5 text-[0.9375rem] leading-none tracking-[0.01em]",
  {
    variants: {
      variant: {
        primary:
          "bg-ortaq-ink text-ortaq-bg hover:bg-ortaq-ink-muted active:bg-ortaq-ink-muted",
        secondary:
          "border border-ortaq-border-strong bg-transparent text-ortaq-ink hover:bg-ortaq-bg-alt active:bg-ortaq-bg-warm",
        ghost: "text-ortaq-ink-muted hover:text-ortaq-ink hover:bg-ortaq-bg-alt",
      },
      size: {
        default: "min-h-11 px-5",
        lg: "min-h-12 px-6 text-base",
        sm: "min-h-10 px-4 text-sm",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
      fullWidth: false,
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size, fullWidth }), className)}
      {...props}
    />
  ),
);
Button.displayName = "Button";

export { buttonVariants };
