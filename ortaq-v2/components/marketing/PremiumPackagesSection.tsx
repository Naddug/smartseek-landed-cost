"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { MonetizationTiers } from "@/components/marketing/MonetizationTiers";
import { PremiumPackageDetailPanel } from "@/components/marketing/PremiumPackageDetailPanel";
import {
  PREMIUM_DETAIL_ANCHOR,
  type PremiumPackageId,
  isPremiumPackageId,
  parsePremiumPackageFromLocation,
  premiumPackageHref,
} from "@/lib/marketing/premium-packages";

interface PremiumPackagesSectionProps {
  showCtas?: boolean;
  layout?: "grid" | "homepage";
}

export function PremiumPackagesSection({
  showCtas = true,
  layout = "homepage",
}: PremiumPackagesSectionProps) {
  const pathname = usePathname();
  const detailRef = useRef<HTMLDivElement>(null);
  const [activePackage, setActivePackage] = useState<PremiumPackageId | null>(null);
  const isPremiumPage =
    pathname === "/guven-kalite" || pathname === "/nasil-calisir";

  const scrollToDetail = useCallback(() => {
    requestAnimationFrame(() => {
      detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  const openPackage = useCallback(
    (packageId: PremiumPackageId, options?: { updateUrl?: boolean; scroll?: boolean }) => {
      setActivePackage(packageId);

      if (options?.updateUrl !== false && isPremiumPage) {
        const href = premiumPackageHref(packageId, pathname);
        window.history.replaceState(null, "", href);
      }

      if (options?.scroll !== false) {
        scrollToDetail();
      }
    },
    [isPremiumPage, pathname, scrollToDetail]
  );

  const syncFromLocation = useCallback(() => {
    const parsed = parsePremiumPackageFromLocation(
      window.location.search,
      window.location.hash
    );

    if (parsed) {
      setActivePackage(parsed);
      scrollToDetail();
      return;
    }

    setActivePackage(null);
  }, [scrollToDetail]);

  useEffect(() => {
    if (!isPremiumPage) return;

    syncFromLocation();
    window.addEventListener("hashchange", syncFromLocation);
    window.addEventListener("popstate", syncFromLocation);
    return () => {
      window.removeEventListener("hashchange", syncFromLocation);
      window.removeEventListener("popstate", syncFromLocation);
    };
  }, [isPremiumPage, syncFromLocation]);

  const handleTierSelect = useCallback(
    (tierId: string) => {
      if (!isPremiumPackageId(tierId)) return;
      openPackage(tierId);
    },
    [openPackage]
  );

  const handleClose = useCallback(() => {
    setActivePackage(null);
    if (isPremiumPage) {
      window.history.replaceState(null, "", `${pathname}#premium`);
    }
  }, [isPremiumPage, pathname]);

  return (
    <div>
      <MonetizationTiers
        showCtas={showCtas}
        layout={layout}
        activeTierId={activePackage}
        onTierSelect={isPremiumPage ? handleTierSelect : undefined}
      />

      <div
        id={PREMIUM_DETAIL_ANCHOR}
        ref={detailRef}
        className="scroll-mt-28"
        aria-live="polite"
      >
        {activePackage ? (
          <div key={activePackage} className="mt-8">
            <PremiumPackageDetailPanel
              packageId={activePackage}
              onClose={handleClose}
            />
          </div>
        ) : isPremiumPage ? (
          <p className="mt-6 text-center text-sm text-ortaq-text-muted">
            Paket detayını görmek için yukarıdaki bir seçeneğe tıklayın.
          </p>
        ) : null}
      </div>
    </div>
  );
}
