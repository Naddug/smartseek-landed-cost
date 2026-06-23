export type UserRoleMode = "owner" | "partner" | "hybrid";

export type NavUser = {
  id: string;
  firstName?: string;
  email?: string;
  role: UserRoleMode;
  unreadMessages?: number;
  pendingMatches?: number;
  activeDossiers?: number;
};

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export type PanelNavItem = {
  href: string;
  label: string;
  icon: string;
  badgeKey?: "activeDossiers" | "pendingMatches" | "unreadMessages";
  roles?: UserRoleMode[];
};
