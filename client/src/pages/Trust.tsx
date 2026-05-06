import { Link } from "wouter";
import { ShieldCheck, FileText, Search, AlertTriangle, ArrowRight } from "lucide-react";
import PublicLayout from "@/components/layout/PublicLayout";
import { useTranslation } from "react-i18next";

export default function Trust() {
  const { t } = useTranslation();
  return (
    <PublicLayout>
      <section className="bg-gradient-to-b from-slate-950 via-blue-950 to-slate-900 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold mb-5">
            <ShieldCheck className="w-3.5 h-3.5" /> {t("trustPage.badge")}
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">{t("trustPage.title")}</h1>
          <p className="text-slate-300 text-base leading-relaxed">
            {t("trustPage.subtitle")}
          </p>
        </div>
      </section>

      <section className="bg-white py-16 px-4 border-b border-slate-100">
        <div className="max-w-3xl mx-auto space-y-10">
          <Block icon={<ShieldCheck className="w-5 h-5 text-blue-600" />} title={t("trustPage.verifyTitle")}>
            <ul className="space-y-2 text-sm text-slate-700 list-disc pl-5">
              <li>{t("trustPage.verify1")}</li>
              <li>{t("trustPage.verify2")}</li>
              <li>{t("trustPage.verify3")}</li>
              <li>{t("trustPage.verify4")}</li>
            </ul>
            <p className="text-sm text-slate-600 mt-3"><Link href="/verification" className="text-blue-700 underline underline-offset-2">{t("trustPage.verifyLink")}</Link></p>
          </Block>

          <Block icon={<FileText className="w-5 h-5 text-emerald-600" />} title={t("trustPage.rfqTitle")}>
            <p className="text-sm text-slate-700 leading-relaxed">
              {t("trustPage.rfqBody")}
            </p>
            <div className="mt-4 grid sm:grid-cols-3 gap-2 text-xs">
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                <p className="font-semibold text-slate-900">Intake check</p>
                <p className="text-slate-600">Specification, volume, delivery constraints</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                <p className="font-semibold text-slate-900">Qualification check</p>
                <p className="text-slate-600">Commodity fit, geography, compliance scope</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                <p className="font-semibold text-slate-900">Quote normalization</p>
                <p className="text-slate-600">MOQ, lead time, Incoterms, provenance</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 mt-3"><Link href="/methodology" className="text-blue-700 underline underline-offset-2">{t("trustPage.rfqLink")}</Link></p>
          </Block>

          <Block icon={<Search className="w-5 h-5 text-violet-600" />} title={t("trustPage.sourcesTitle")}>
            <ul className="space-y-2 text-sm text-slate-700 list-disc pl-5">
              <li><strong>{t("trustPage.sources1Strong")}</strong> — {t("trustPage.sources1Rest")}</li>
              <li><strong>{t("trustPage.sources2Strong")}</strong> — {t("trustPage.sources2Rest")}</li>
              <li><strong>{t("trustPage.sources3Strong")}</strong> — {t("trustPage.sources3Rest")} <Link href="/become-a-supplier" className="text-blue-700 underline underline-offset-2">/become-a-supplier</Link>.</li>
              <li><strong>{t("trustPage.sources4Strong")}</strong> — {t("trustPage.sources4Rest")}</li>
            </ul>
            <p className="text-xs text-slate-500 mt-3">{t("trustPage.sourcesFootnote")}</p>
          </Block>

          <Block icon={<AlertTriangle className="w-5 h-5 text-amber-600" />} title={t("trustPage.notDoTitle")}>
            <ul className="space-y-2 text-sm text-slate-700 list-disc pl-5">
              <li>{t("trustPage.notDo1")}</li>
              <li>{t("trustPage.notDo2")}</li>
              <li>{t("trustPage.notDo3")}</li>
              <li>{t("trustPage.notDo4")}</li>
              <li>{t("trustPage.notDo5")}</li>
            </ul>
          </Block>

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-3">Evidence scope and limitations</h2>
            <p className="text-sm text-slate-700 leading-relaxed mb-3">
              SmartSeek provides sourcing intelligence and verification signals, not legal, sanctions, or financial advice.
              Buyers remain responsible for final contracting, payment security, inspection, and jurisdiction-specific compliance checks.
            </p>
            <p className="text-xs text-slate-500">
              This transparency is intentional: procurement confidence improves when evidence boundaries are explicit.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center">
            <p className="text-sm text-slate-700 mb-4">{t("trustPage.reportText")}</p>
            <Link href="/contact">
              <button className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition">
                {t("trustPage.reportBtn")} <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}

function Block({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      </div>
      <div className="text-slate-700">{children}</div>
    </div>
  );
}
