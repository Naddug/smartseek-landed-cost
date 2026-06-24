"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, ChevronLeft } from "lucide-react";
import type { NavUser } from "@/types/nav";
import { generatePanelBreadcrumbs } from "@/lib/panel/breadcrumbs";
import { UserMenu, signOutUser } from "@/components/shared/UserMenu";

interface PanelTopbarProps {
  navUser: NavUser;
}

export function PanelTopbar({ navUser }: PanelTopbarProps) {
  const pathname = usePathname();
  const breadcrumbs = generatePanelBreadcrumbs(pathname);

  const initials = navUser.firstName?.slice(0, 2).toUpperCase() ?? "OR";
  const displayName = navUser.firstName ?? navUser.email ?? "Kullanıcı";
  const notificationCount =
    (navUser.unreadMessages ?? 0) + (navUser.pendingMatches ?? 0);
  const showNotificationBadge = notificationCount > 0;

  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b border-stone-200 bg-white px-4 md:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-1 text-sm font-medium text-stone-600 transition-colors hover:text-stone-950"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">ORTAQ&apos;a Dön</span>
          <span className="sm:hidden">Ana sayfa</span>
        </Link>

        <div className="hidden h-4 w-px bg-stone-200 sm:block" aria-hidden />

        <nav aria-label="Breadcrumb" className="hidden min-w-0 sm:block">
          <ol className="flex items-center gap-1.5 text-sm">
            {breadcrumbs.map((crumb, index) => (
              <li key={`${crumb.label}-${index}`} className="flex items-center gap-1.5">
                {index > 0 && (
                  <span className="text-stone-300" aria-hidden>
                    /
                  </span>
                )}
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="truncate text-stone-500 transition-colors hover:text-stone-800"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="truncate font-medium text-stone-900">
                    {crumb.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>

      <div className="flex items-center gap-2">
        <Link
          href="/panel/mesajlar"
          className="relative flex h-9 w-9 items-center justify-center rounded-lg text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900"
          aria-label="Bildirimler"
        >
          <Bell className="h-4 w-4" />
          {showNotificationBadge && (
            <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-600 px-0.5 text-[9px] font-medium text-white">
              {notificationCount > 9 ? "9+" : notificationCount}
            </span>
          )}
        </Link>

        <UserMenu
          displayName={displayName}
          initials={initials}
          items={[
            { label: "Profilim", href: "/panel/profilim" },
            { label: "Çıkış", onClick: signOutUser, variant: "danger" },
          ]}
          triggerClassName="hover:bg-stone-100"
        />
      </div>
    </header>
  );
}
