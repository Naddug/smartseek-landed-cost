import type { ReactNode } from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { MobileStickyCta } from "@/components/layout/MobileStickyCta";
import { StagingBanner } from "@/components/layout/StagingBanner";
import { InterestProvider } from "@/lib/interest/store";

type PublicShellProps = {
  children: ReactNode;
  stickyCta?: boolean;
  /** Transparent header over cinematic hero */
  headerOverlay?: boolean;
};

export function PublicShell({ children, stickyCta = true, headerOverlay = false }: PublicShellProps) {
  return (
    <InterestProvider>
      <div className="flex min-h-dvh min-w-0 flex-col overflow-x-clip">
        <StagingBanner />
        <SiteHeader overlay={headerOverlay} />
        <main className="min-w-0 flex-1 overflow-x-clip">{children}</main>
        <SiteFooter />
        {stickyCta && <MobileStickyCta />}
      </div>
    </InterestProvider>
  );
}
