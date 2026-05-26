import type { ReactNode } from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { MobileStickyCta } from "@/components/layout/MobileStickyCta";

type PublicShellProps = {
  children: ReactNode;
  stickyCta?: boolean;
  /** Transparent header over cinematic hero */
  headerOverlay?: boolean;
};

export function PublicShell({ children, stickyCta = true, headerOverlay = false }: PublicShellProps) {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader overlay={headerOverlay} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      {stickyCta && <MobileStickyCta />}
    </div>
  );
}
