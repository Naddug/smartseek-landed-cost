"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  Compass,
  LayoutDashboard,
  MessageSquare,
  Plus,
  User,
  Users,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { NavUser } from "@/types/nav";
import { getVisiblePanelNavItems } from "@/lib/panel/nav-config";

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  Briefcase,
  Compass,
  Users,
  MessageSquare,
  User,
};

interface PanelSidebarProps {
  navUser: NavUser;
}

function NavBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1.5 text-[10px] font-medium text-white">
      {count > 9 ? "9+" : count}
    </span>
  );
}

function badgeCount(
  navUser: NavUser,
  key?: "activeDossiers" | "pendingMatches" | "unreadMessages"
) {
  if (!key) return 0;
  return navUser[key] ?? 0;
}

export function PanelSidebar({ navUser }: PanelSidebarProps) {
  const pathname = usePathname();
  const { main, footer } = getVisiblePanelNavItems(navUser.role);

  function isActive(href: string) {
    if (href === "/panel") return pathname === "/panel";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  function linkActive(href: string) {
    if (href === "/panel/eslesmeler") {
      return pathname.startsWith("/panel/eslesmeler");
    }
    if (href === "/panel/profilim") {
      return pathname.startsWith("/panel/profilim");
    }
    return isActive(href);
  }

  return (
    <aside className="flex h-full w-[220px] shrink-0 flex-col bg-ortaq-dark-bg text-ortaq-dark-text">
      <div className="border-b border-ortaq-dark-border px-5 py-4">
        <Link
          href="/"
          className="font-heading text-lg font-bold tracking-tight text-ortaq-dark-text"
        >
          ORTAQ
        </Link>
        <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-ortaq-dark-text-muted">
          Panel
        </p>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {main.map((item) => {
          const Icon = iconMap[item.icon] ?? LayoutDashboard;
          const active = linkActive(item.href);
          const count = badgeCount(navUser, item.badgeKey);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-ortaq-dark-elevated text-ortaq-dark-text"
                  : "text-ortaq-dark-text-muted hover:bg-ortaq-dark-elevated/60 hover:text-ortaq-dark-text-secondary"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{item.label}</span>
              <NavBadge count={count} />
            </Link>
          );
        })}

        <div className="my-3 border-t border-ortaq-dark-border" />

        {footer.map((item) => {
          const Icon = iconMap[item.icon] ?? User;
          const active = linkActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-ortaq-dark-elevated text-ortaq-dark-text"
                  : "text-ortaq-dark-text-muted hover:bg-ortaq-dark-elevated/60 hover:text-ortaq-dark-text-secondary"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {(navUser.role === "owner" || navUser.role === "hybrid") && (
        <div className="border-t border-ortaq-dark-border p-3">
          <Link
            href="/panel/dosya-olustur"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Yeni Dosya Oluştur
          </Link>
        </div>
      )}
    </aside>
  );
}
