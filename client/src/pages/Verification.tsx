import { Link } from "wouter";
import { ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";
import PublicLayout from "@/components/layout/PublicLayout";
import { useTranslation } from "react-i18next";

export default function Verification() {
  const { t } = useTranslation();
  const TIERS = [
    {
      name: t("verificationPage.tier1.name"),
      color: "blue",
      summary: t("verificationPage.tier1.summary"),
      requires: [
        t("verificationPage.tier1.req1"),
        t("verificationPage.tier1.req2"),
        t("verificationPage.tier1.req3"),
        t("verificationPage.tier1.req4"),
      ],
    },
    {
      name: t("verificationPage.tier2.name"),
      color: "emerald",
      summary: t("verificationPage.tier2.summary"),
      requires: [
        t("verificationPage.tier2.req1"),
        t("verificationPage.tier2.req2"),
        t("verificationPage.tier2.req3"),
      ],
    },
    {
      name: t("verificationPage.tier3.name"),
      color: "violet",
      summary: t("verificationPage.tier3.summary"),
      requires: [
        t("verificationPage.tier3.req1"),
        t("verificationPage.tier3.req2"),
        t("verificationPage.tier3.req3"),
        t("verificationPage.tier3.req4"),
      ],
    },
  ];
  return (
    <PublicLayout>
      <section className="bg-gradient-to-b from-slate-950 via-blue-950 to-slate-900 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold mb-5">
            <ShieldCheck className="w-3.5 h-3.5" /> {t("verificationPage.badge")}
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">{t("verificationPage.title")}</h1>
          <p className="text-slate-300 text-base leading-relaxed">
            {t("verificationPage.subtitle")}
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
          <h2 className="text-xl font-bold text-slate-900 mb-3">{t("verificationPage.cadenceTitle")}</h2>
          <p className="text-sm text-slate-700 mb-3">
            {t("verificationPage.cadence1")}
          </p>
          <p className="text-sm text-slate-700 mb-6">
            {t("verificationPage.cadence2")}
          </p>
          <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
            <p className="text-sm text-slate-700">{t("verificationPage.ctaText")}</p>
            <Link href="/become-a-supplier">
              <button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition">
                {t("verificationPage.ctaBtn")} <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
