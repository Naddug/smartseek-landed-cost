import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getPanelOverview } from "@/lib/panel/get-panel-overview";
import { PanelOverviewView } from "@/components/panel/PanelOverviewView";

export default async function PanelPage() {
  const session = await getServerSession(authOptions);
  const overview = await getPanelOverview(session);

  if (!overview) {
    redirect("/giris?next=/panel");
  }

  return <PanelOverviewView overview={overview} />;
}
