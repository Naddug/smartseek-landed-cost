import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getPanelOverview } from "@/lib/panel/get-panel-overview";
import { MesajlarView } from "@/components/panel/PanelModuleViews";

export default async function MesajlarPage() {
  const session = await getServerSession(authOptions);
  const overview = await getPanelOverview(session);

  if (!overview) {
    redirect("/giris?next=/panel/mesajlar");
  }

  return (
    <div>
      <header className="mb-6">
        <h1 className="font-heading text-2xl font-semibold text-stone-950">
          Mesajlar
        </h1>
        <p className="mt-1 text-sm text-stone-600">
          Eşleşme sonrası fırsat sahibi ve ortak arasındaki görüşmeler.
        </p>
      </header>
      <MesajlarView
        role={overview.role}
        hasMatches={overview.matches.length > 0}
      />
    </div>
  );
}
