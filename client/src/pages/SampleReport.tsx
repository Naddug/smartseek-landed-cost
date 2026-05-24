import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, ShieldCheck, ClipboardList } from "lucide-react";
import { Link } from "wouter";
import { Logo } from "@/components/Logo";
import { useTranslation } from "react-i18next";

/** Illustrative workflow only — not a live client deliverable. No fabricated suppliers, scores, or economics. */
export default function SampleReport() {
  const { t } = useTranslation();

  const steps = [
    { icon: ClipboardList, title: t("sampleReport.step1Title"), desc: t("sampleReport.step1Desc") },
    { icon: ShieldCheck, title: t("sampleReport.step2Title"), desc: t("sampleReport.step2Desc") },
    { icon: FileText, title: t("sampleReport.step3Title"), desc: t("sampleReport.step3Desc") },
  ];

  return (
    <div className="min-h-screen bg-muted/20 py-8 px-4">
      <div className="max-w-3xl mx-auto mb-6 print:hidden">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" /> {t("sampleReport.back")}
          </Button>
        </Link>
      </div>

      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl border border-slate-200 p-8 sm:p-12 text-slate-900">
        <header className="border-b border-slate-200 pb-8 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Logo size="sm" className="w-8 h-8" />
            <span className="text-xl font-bold tracking-tight">SmartSeek</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">{t("sampleReport.title")}</h1>
          <p className="text-sm text-slate-600 leading-relaxed">{t("sampleReport.disclaimer")}</p>
        </header>

        <section className="mb-10">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">{t("sampleReport.exampleLabel")}</h2>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 space-y-3 text-sm">
            <div><span className="font-semibold text-slate-800">{t("sampleReport.fieldCommodity")}:</span> {t("sampleReport.exampleCommodity")}</div>
            <div><span className="font-semibold text-slate-800">{t("sampleReport.fieldSpec")}:</span> {t("sampleReport.exampleSpec")}</div>
            <div><span className="font-semibold text-slate-800">{t("sampleReport.fieldQuantity")}:</span> {t("sampleReport.exampleQuantity")}</div>
            <div><span className="font-semibold text-slate-800">{t("sampleReport.fieldDestination")}:</span> {t("sampleReport.exampleDestination")}</div>
            <div><span className="font-semibold text-slate-800">{t("sampleReport.fieldIncoterm")}:</span> {t("sampleReport.exampleIncoterm")}</div>
          </div>
          <p className="text-xs text-slate-500 mt-3 leading-relaxed">{t("sampleReport.exampleNote")}</p>
        </section>

        <section className="mb-10">
          <h2 className="text-lg font-bold text-slate-900 mb-6">{t("sampleReport.workflowTitle")}</h2>
          <div className="space-y-6">
            {steps.map((step, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                  <step.icon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">{step.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-slate-50 p-6">
          <p className="text-sm text-slate-700 leading-relaxed mb-4">{t("sampleReport.closing")}</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/rfq/new">
              <Button size="sm">{t("sampleReport.ctaRfq")}</Button>
            </Link>
            <Link href="/methodology">
              <Button variant="outline" size="sm">{t("sampleReport.ctaMethodology")}</Button>
            </Link>
          </div>
        </section>

        <footer className="mt-10 pt-6 border-t border-slate-200 text-center text-xs text-slate-400">
          <p>{t("sampleReport.footer")}</p>
        </footer>
      </div>
    </div>
  );
}
