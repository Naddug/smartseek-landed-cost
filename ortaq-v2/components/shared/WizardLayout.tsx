import { cn } from "@/lib/utils";
import { AppContainer } from "@/components/shared/AppContainer";

interface WizardLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
  className?: string;
}

export function WizardLayout({
  children,
  sidebar,
  header,
  className,
}: WizardLayoutProps) {
  return (
    <div className={cn("min-h-screen bg-ortaq-bg", className)}>
      {header}
      <AppContainer className="py-8 md:py-12">
        <div
          className={cn(
            "grid gap-8",
            sidebar ? "lg:grid-cols-[1fr_320px]" : "max-w-3xl"
          )}
        >
          <main>{children}</main>
          {sidebar && <aside className="lg:sticky lg:top-24 lg:self-start">{sidebar}</aside>}
        </div>
      </AppContainer>
    </div>
  );
}
