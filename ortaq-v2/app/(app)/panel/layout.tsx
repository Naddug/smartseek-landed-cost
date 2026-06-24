import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { registerPathChoiceHref } from "@/lib/auth/routes";
import { getNavUserFromSession } from "@/lib/panel/nav-user";
import { getPanelOverview } from "@/lib/panel/get-panel-overview";
import { PanelShell } from "@/components/panel/PanelShell";

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const overview = await getPanelOverview(session);
  const navUser = getNavUserFromSession(session, overview?.stats);

  if (!navUser) {
    redirect("/giris?next=/panel");
  }

  if (session?.user?.sideSelected === false) {
    redirect(registerPathChoiceHref("/panel"));
  }

  return <PanelShell navUser={navUser}>{children}</PanelShell>;
}
