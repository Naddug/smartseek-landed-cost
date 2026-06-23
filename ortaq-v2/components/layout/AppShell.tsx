"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  LayoutDashboard,
  MessageSquare,
  User,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AppContainer } from "@/components/shared/AppContainer";

const sidebarLinks = [
  { href: "/panel", label: "Genel Bakış", icon: LayoutDashboard },
  { href: "/panel/firsatlarim", label: "Fırsatlarım", icon: Briefcase },
  { href: "/panel/eslesmelerim", label: "Eşleşmelerim", icon: Users },
  { href: "/panel/mesajlar", label: "Mesajlar", icon: MessageSquare },
  { href: "/panel/profilim", label: "Profilim", icon: User },
];

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-ortaq-bg">
      <div className="border-b border-ortaq-line bg-ortaq-surface">
        <AppContainer>
          <div className="flex h-14 items-center justify-between">
            <Link
              href="/panel"
              className="font-heading text-lg font-bold text-ortaq-navy"
            >
              ORTAQ
            </Link>
            <span className="text-xs text-ortaq-text-muted">Panel</span>
          </div>
        </AppContainer>
      </div>

      <AppContainer className="py-8">
        <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
          <aside className="hidden lg:block">
            <nav className="sticky top-8 space-y-1">
              {sidebarLinks.map((link) => {
                const Icon = link.icon;
                const active =
                  pathname === link.href ||
                  (link.href !== "/panel" && pathname.startsWith(link.href));

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "bg-ortaq-action/10 text-ortaq-action"
                        : "text-ortaq-text-muted hover:bg-ortaq-surface-alt hover:text-ortaq-navy"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </aside>

          <main className="min-w-0">{children}</main>
        </div>
      </AppContainer>
    </div>
  );
}
