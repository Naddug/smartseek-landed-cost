import type { ReactNode } from "react";
import { SiteHeader } from "@ortaq/components/layout/SiteHeader";
import { SiteFooter } from "@ortaq/components/layout/SiteFooter";
import { MobileStickyCta } from "@ortaq/components/layout/MobileStickyCta";

type PublicShellProps = {
  children: ReactNode;
  stickyCta?: boolean;
};

export function PublicShell({ children, stickyCta = true }: PublicShellProps) {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      {stickyCta && <MobileStickyCta />}
    </div>
  );
}
