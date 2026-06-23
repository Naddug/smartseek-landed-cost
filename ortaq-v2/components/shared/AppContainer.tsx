import { cn } from "@/lib/utils";

interface AppContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: "default" | "narrow" | "wide";
}

const sizeClasses = {
  default: "max-w-container",
  narrow: "max-w-3xl",
  wide: "max-w-7xl",
};

export function AppContainer({
  children,
  className,
  size = "default",
}: AppContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        sizeClasses[size],
        className
      )}
    >
      {children}
    </div>
  );
}
