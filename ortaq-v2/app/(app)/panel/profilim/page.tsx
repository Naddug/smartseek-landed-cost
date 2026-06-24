import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { getPanelOverview } from "@/lib/panel/get-panel-overview";
import { Button } from "@/components/ui/button";
import { ORTAQ_COPY } from "@/lib/copy/ortaq-lexicon";

export default async function ProfilimPage() {
  const session = await getServerSession(authOptions);
  const overview = await getPanelOverview(session);

  if (!overview) {
    redirect("/giris?next=/panel/profilim");
  }

  const { profileCompletion } = overview;
  const displayName = session?.user?.name ?? session?.user?.email ?? "Kullanıcı";
  const isPartner = overview.role === "partner" || overview.role === "hybrid";

  return (
    <div>
      <header className="mb-6">
        <h1 className="font-heading text-2xl font-semibold text-stone-950">
          Profilim
        </h1>
        <p className="mt-1 text-sm text-stone-600">
          {ORTAQ_COPY.panel.profileIntro}
        </p>
      </header>

      <div className="max-w-lg space-y-4">
        <div className="rounded-xl border border-stone-200 bg-white p-5">
          <p className="text-sm font-medium text-stone-950">{displayName}</p>
          <p className="text-sm text-stone-600">{session?.user?.email}</p>
        </div>

        <div className="rounded-xl border border-stone-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-stone-950">Profil tamamlama</p>
            <span className="text-sm font-semibold">%{profileCompletion.percent}</span>
          </div>
          <div className="mt-2 h-1.5 rounded-full bg-stone-100">
            <div
              className="h-full rounded-full bg-blue-600"
              style={{ width: `${profileCompletion.percent}%` }}
            />
          </div>
          {profileCompletion.missingFields.length > 0 && (
            <ul className="mt-4 space-y-1 border-t border-stone-100 pt-4">
              {profileCompletion.missingFields.map((field) => (
                <li key={field} className="text-sm text-stone-600">
                  · {field}
                </li>
              ))}
            </ul>
          )}
          <Link
            href={
              overview.role === "partner"
                ? "/onboarding/ortak"
                : "/onboarding/firsat-sahibi"
            }
            className="mt-4 block"
          >
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              Profili Tamamla
            </Button>
          </Link>
        </div>

        {isPartner && (
          <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-stone-950">
                  {ORTAQ_COPY.monetization.partnerPremiumTitle}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-stone-600">
                  {ORTAQ_COPY.monetization.partnerPremiumDescription}
                </p>
                <Link
                  href="/guven-kalite?paket=partner#premium-detail"
                  className="mt-3 inline-block text-sm font-medium text-blue-600 hover:underline"
                >
                  Profilimi güçlendir →
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
