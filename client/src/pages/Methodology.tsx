import { Link } from "wouter";
import { FileText, Search, ShieldCheck, ArrowRight } from "lucide-react";
import PublicLayout from "@/components/layout/PublicLayout";
import { useTranslation } from "react-i18next";

export default function Methodology() {
  const { t } = useTranslation();
  const STEPS = [
    {
      n: "01",
      title: t("methodologyPage.step1.title"),
      body: t("methodologyPage.step1.body"),
    },
    {
      n: "02",
      title: t("methodologyPage.step2.title"),
      body: t("methodologyPage.step2.body"),
    },
    {
      n: "03",
      title: t("methodologyPage.step3.title"),
      body: t("methodologyPage.step3.body"),
    },
    {
      n: "04",
      title: t("methodologyPage.step4.title"),
      body: t("methodologyPage.step4.body"),
    },
  ];
  return (
    <PublicLayout>
      <section className="bg-gradient-to-b from-slate-950 via-blue-950 to-slate-900 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold mb-5">
            <FileText className="w-3.5 h-3.5" /> {t("methodologyPage.badge")}
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">{t("methodologyPage.title")}</h1>
          <p className="text-slate-300 text-base leading-relaxed">
            {t("methodologyPage.subtitle")}
          </p>
        </div>
      </section>

      <section className="bg-white py-14 px-4 border-b border-slate-100">
        <div className="max-w-3xl mx-auto space-y-6">
          {STEPS.map((s) => (
            <div key={s.n} className="border border-slate-200 rounded-2xl p-6 bg-white">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-xs font-mono text-slate-400">{s.n}</span>
                <h2 className="text-lg font-bold text-slate-900">{s.title}</h2>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 py-14 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-slate-900 mb-3">{t("methodologyPage.notDoTitle")}</h2>
          <ul className="space-y-2 text-sm text-slate-700 list-disc pl-5 mb-8">
            <li>{t("methodologyPage.notDo1")}</li>
            <li>{t("methodologyPage.notDo2")}</li>
            <li>{t("methodologyPage.notDo3")}</li>
            <li>{t("methodologyPage.notDo4")}</li>
          </ul>
          <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">{t("methodologyPage.ctaTitle")}</p>
              <p className="text-xs text-slate-600">{t("methodologyPage.ctaSubtitle")}</p>
            </div>
            <Link href="/rfq">
              <button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition">
                {t("methodologyPage.ctaBtn")} <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
          <div className="text-center mt-6 text-xs text-slate-500">
            <Link href="/verification" className="underline underline-offset-2 inline-flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> {t("methodologyPage.linksVerification")}</Link>
            <span className="mx-2">·</span>
            <Link href="/trust" className="underline underline-offset-2 inline-flex items-center gap-1"><Search className="w-3 h-3" /> {t("methodologyPage.linksTrust")}</Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
