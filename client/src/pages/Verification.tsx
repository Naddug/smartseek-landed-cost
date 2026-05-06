import { Link } from "wouter";
import { ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";
import PublicLayout from "@/components/layout/PublicLayout";

const TIERS = [
  {
    name: "Registry Verified",
    color: "blue",
    summary: "Legal entity confirmed in an official company registry.",
    requires: [
      "Match between company name, registry number, and country",
      "Active, non-dissolved status at time of verification",
      "Resolvable corporate website",
      "Primary contact reachable on a domain-tied or verified address",
    ],
  },
  {
    name: "Trade Verified",
    color: "emerald",
    summary: "Active export/import activity confirmed via lawful trade-data sources.",
    requires: [
      "Everything in Registry Verified",
      "Confirmed shipping records or customs filings within the last 24 months",
      "Product lines listed match shipped HS codes",
    ],
  },
  {
    name: "Operator Verified",
    color: "violet",
    summary: "Manual due-diligence by a SmartSeek sourcing operator.",
    requires: [
      "Everything in Trade Verified",
      "Direct call/video meeting with a named representative",
      "Proof of capability supplied (mill test certs, ISO certs, recent invoices, factory media)",
      "Two-step contact verification (email + phone or registered office)",
    ],
  },
];

export default function Verification() {
  return (
    <PublicLayout>
      <section className="bg-gradient-to-b from-slate-950 via-blue-950 to-slate-900 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold mb-5">
            <ShieldCheck className="w-3.5 h-3.5" /> Verification standards
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">Three verification tiers</h1>
          <p className="text-slate-300 text-base leading-relaxed">
            Every supplier badge on SmartSeek means a specific, auditable thing. No vanity stars. No mystery rankings.
          </p>
        </div>
      </section>

      <section className="bg-white py-14 px-4 border-b border-slate-100">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
          {TIERS.map((t) => (
            <div key={t.name} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className={`inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-2 py-1 rounded-full mb-3 ${
                t.color === "blue" ? "bg-blue-50 text-blue-700 border border-blue-100" :
                t.color === "emerald" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                "bg-violet-50 text-violet-700 border border-violet-100"
              }`}>
                <ShieldCheck className="w-3 h-3" /> {t.name}
              </div>
              <p className="text-sm text-slate-700 mb-4">{t.summary}</p>
              <ul className="space-y-2 text-sm text-slate-700">
                {t.requires.map((r, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 py-14 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-slate-900 mb-3">Re-verification cadence</h2>
          <p className="text-sm text-slate-700 mb-3">
            Registry status is checked on listing and re-checked every 12 months. Trade verification refreshes every 6 months. Operator-verified suppliers undergo an annual due-diligence review.
          </p>
          <p className="text-sm text-slate-700 mb-6">
            When we cannot re-confirm status, the badge is downgraded or the supplier is hidden until status is restored.
          </p>
          <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
            <p className="text-sm text-slate-700">Suppliers can apply to be listed and verified.</p>
            <Link href="/become-a-supplier">
              <button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition">
                Become a supplier <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
