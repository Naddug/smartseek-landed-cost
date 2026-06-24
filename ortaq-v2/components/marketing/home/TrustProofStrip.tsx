import Link from "next/link";
import { ShieldCheck, FileCheck, Users, CalendarPlus } from "lucide-react";
import { AppContainer } from "@/components/shared/AppContainer";
import { getMarketplacePulse } from "@/data/marketing/home-dossiers";
import { ORTAQ_COPY } from "@/lib/copy/ortaq-lexicon";

const pulse = getMarketplacePulse();

const proofItems = [
  {
    icon: FileCheck,
    value: String(pulse.published),
    label: ORTAQ_COPY.trust.proofPublishedLabel,
  },
  {
    icon: Users,
    value: String(pulse.totalApplicants),
    label: ORTAQ_COPY.trust.proofApplicantsLabel,
  },
  {
    icon: ShieldCheck,
    value: String(pulse.partnerTypes),
    label: ORTAQ_COPY.trust.proofPartnerTypesLabel,
  },
  {
    icon: CalendarPlus,
    value: String(pulse.inReview),
    label: "İncelemede bekleyen",
  },
];

export function TrustProofStrip() {
  return (
    <section className="border-b border-ortaq-line bg-ortaq-navy">
      <AppContainer>
        <div className="grid divide-ortaq-line sm:grid-cols-2 lg:grid-cols-4 lg:divide-x">
          {proofItems.map(({ icon: Icon, value, label }) => (
            <div
              key={label}
              className="flex items-center gap-4 px-0 py-6 sm:px-4 lg:px-6 lg:py-7"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10">
                <Icon className="h-5 w-5 text-ortaq-accent" strokeWidth={1.75} />
              </div>
              <div>
                <p className="font-heading text-lg font-semibold text-white">{value}</p>
                <p className="text-xs font-medium text-ortaq-dark-text-muted">{label}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="border-t border-white/10 py-3 text-center font-mono text-[10px] uppercase tracking-[0.14em] text-ortaq-dark-text-muted">
          {ORTAQ_COPY.trust.trustFooter}
        </p>
      </AppContainer>
    </section>
  );
}

export function TrustProofStripCTA() {
  return (
    <div className="mt-6 flex flex-wrap gap-3">
      <Link
        href="/guven-kalite"
        className="text-xs font-semibold text-ortaq-text-secondary underline-offset-4 hover:text-ortaq-navy hover:underline"
      >
        ORTAQ standardı →
      </Link>
      <Link
        href="/firsatlar"
        className="text-xs font-semibold text-ortaq-text-secondary underline-offset-4 hover:text-ortaq-navy hover:underline"
      >
        Yayındaki fırsatlar →
      </Link>
    </div>
  );
}
