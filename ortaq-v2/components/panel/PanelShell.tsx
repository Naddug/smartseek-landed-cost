"use client";

import type { NavUser } from "@/types/nav";
import { PanelSidebar } from "@/components/panel/PanelSidebar";
import { PanelTopbar } from "@/components/panel/PanelTopbar";
import { PanelMobileNav } from "@/components/panel/PanelMobileNav";

interface PanelShellProps {
  navUser: NavUser;
  children: React.ReactNode;
}

export function PanelShell({ navUser, children }: PanelShellProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-stone-50">
      <div className="hidden lg:flex">
        <PanelSidebar navUser={navUser} />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <PanelTopbar navUser={navUser} />
        <PanelMobileNav navUser={navUser} />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
