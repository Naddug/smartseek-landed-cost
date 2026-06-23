import type { PanelNavItem, UserRoleMode } from "@/types/nav";
import { ORTAQ_COPY } from "@/lib/copy/ortaq-lexicon";

export const panelNavItems: PanelNavItem[] = [
  {
    href: "/panel",
    label: "Genel Bakış",
    icon: "LayoutDashboard",
  },
  {
    href: "/panel/firsatlarim",
    label: "Fırsatlarım",
    icon: "Briefcase",
    badgeKey: "activeDossiers",
    roles: ["owner", "hybrid"],
  },
  {
    href: "/panel/kesfet",
    label: ORTAQ_COPY.ctas.browseDossiers,
    icon: "Compass",
    roles: ["partner", "hybrid"],
  },
  {
    href: "/panel/eslesmeler",
    label: "Eşleşmelerim",
    icon: "Users",
    badgeKey: "pendingMatches",
  },
  {
    href: "/panel/mesajlar",
    label: "Mesajlar",
    icon: "MessageSquare",
    badgeKey: "unreadMessages",
  },
];

export const panelNavFooterItems: PanelNavItem[] = [
  {
    href: "/panel/profilim",
    label: "Profilim",
    icon: "User",
  },
];

export function getVisiblePanelNavItems(role: UserRoleMode) {
  const filterByRole = (items: PanelNavItem[]) =>
    items.filter((item) => !item.roles || item.roles.includes(role));

  return {
    main: filterByRole(panelNavItems),
    footer: panelNavFooterItems,
  };
}
