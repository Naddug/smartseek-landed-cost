import Link from "next/link";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { MonetizationTiers } from "@/components/marketing/MonetizationTiers";
import { PanelEmptyState } from "@/components/panel/PanelEmptyState";
import { ORTAQ_COPY } from "@/lib/copy/ortaq-lexicon";
import { getCreateDossierGate } from "@/lib/actions/marketplace";
import { onboardingHrefWithNext } from "@/lib/marketplace/action-gate";
import { FilePlus2 } from "lucide-react";

export default async function DosyaOlusturPage() {
  const gate = await getCreateDossierGate();

  if (gate.requiresAuth && gate.authHref) {
    redirect(gate.authHref);
  }

  if (gate.requiresProfile && gate.onboardingHref) {
    redirect(gate.onboardingHref);
  }

  if (gate.wrongRole) {
    return (
      <>
        <PageHeader
          eyebrow="Yeni dosya"
          title="Fırsat Dosyası Oluştur"
          description={ORTAQ_COPY.pages.dosyaOlustur.description}
        />
        <PanelEmptyState
          icon={<FilePlus2 className="h-6 w-6" />}
          title="Bu akış fırsat sahipleri içindir"
          description={
            gate.message ??
            "Ortak hesabıyla fırsat dosyası oluşturamazsınız. Keşfet bölümünden ilginizi çeken fırsatlara başvurabilirsiniz."
          }
          primaryAction={
            <Link href={gate.continueHref ?? "/panel/kesfet"}>
              <Button className="bg-blue-600 hover:bg-blue-700">
                {ORTAQ_COPY.ctas.browseDossiers}
              </Button>
            </Link>
          }
          secondaryAction={
            <Link
              href="/kayit/yol-secimi?next=%2Fpanel%2Fdosya-olustur"
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              Fırsat sahibi olarak devam et →
            </Link>
          }
        />
      </>
    );
  }

  const wizardHref = onboardingHrefWithNext(
    "/onboarding/firsat-sahibi",
    "/panel/dosya-olustur"
  );

  return (
    <>
      <PageHeader
        eyebrow="Yeni dosya"
        title="Fırsat Dosyası Oluştur"
        description={ORTAQ_COPY.pages.dosyaOlustur.description}
      />
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="rounded-xl border border-stone-200 bg-white p-6">
          <h2 className="font-heading text-lg font-semibold text-stone-950">
            {ORTAQ_COPY.pages.dosyaOlustur.wizardTitle}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-stone-600">
            {ORTAQ_COPY.pages.dosyaOlustur.wizardBody}
          </p>
          <p className="mt-3 text-xs text-stone-500">
            Sihirbaz adımlarında girdiğiniz bilgiler taslak dosyanız olarak kaydedilir; istediğiniz zaman devam edebilirsiniz.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={wizardHref}>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Sihirbazı Başlat
              </Button>
            </Link>
            <Link href="/panel/firsatlarim">
              <Button variant="outline">Mevcut dosyalarım</Button>
            </Link>
          </div>
        </div>

        <aside className="rounded-xl border border-blue-100 bg-blue-50/50 p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-blue-700/70">
            {ORTAQ_COPY.monetization.sectionEyebrow}
          </p>
          <h2 className="mt-2 font-heading text-base font-semibold text-stone-950">
            {ORTAQ_COPY.monetization.ownerPremiumTitle}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-stone-600">
            {ORTAQ_COPY.pages.dosyaOlustur.premiumAside}
          </p>
          <Link
            href="/guven-kalite#premium"
            className="mt-4 inline-block text-sm font-medium text-blue-600 hover:underline"
          >
            Premium fırsat desteğini incele →
          </Link>
        </aside>
      </div>

      <div className="mt-10">
        <h2 className="mb-2 font-heading text-lg font-semibold text-stone-950">
          {ORTAQ_COPY.monetization.sectionEyebrow}
        </h2>
        <p className="mb-4 max-w-2xl text-sm text-stone-600">
          {ORTAQ_COPY.monetization.sectionDescription}
        </p>
        <MonetizationTiers showCtas={false} />
      </div>
    </>
  );
}
