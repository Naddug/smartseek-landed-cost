import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getPanelOverview } from "@/lib/panel/get-panel-overview";
import { EslesmelerimView } from "@/components/panel/PanelModuleViews";

export default async function EslesmelerimPage() {
  const session = await getServerSession(authOptions);
  const overview = await getPanelOverview(session);

  if (!overview) {
    redirect("/giris?next=/panel/eslesmelerim");
  }

  return (
    <div>
      <header className="mb-6">
        <h1 className="font-heading text-2xl font-semibold text-stone-950">
          Eşleşmelerim
        </h1>
        <p className="mt-1 text-sm text-stone-600">
          Dosyalarınıza gelen ortak eşleşmelerini ve durumlarını yönetin.
        </p>
      </header>
      <EslesmelerimView matches={overview.matches} role={overview.role} />
    </div>
  );
}
