"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { NavUser } from "@/types/nav";
import { getVisiblePanelNavItems } from "@/lib/panel/nav-config";

interface PanelMobileNavProps {
  navUser: NavUser;
}

export function PanelMobileNav({ navUser }: PanelMobileNavProps) {
  const pathname = usePathname();
  const { main } = getVisiblePanelNavItems(navUser.role);

  function isActive(href: string) {
    if (href === "/panel") return pathname === "/panel";
    if (href === "/panel/eslesmeler") {
      return pathname.startsWith("/panel/eslesmeler");
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <nav className="flex gap-1 overflow-x-auto border-b border-stone-200 bg-white px-3 py-2 lg:hidden">
      {main.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "shrink-0 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
            isActive(item.href)
              ? "bg-stone-900 text-white"
              : "text-stone-600 hover:bg-stone-100"
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
