import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { FileSearch, CheckCircle2, BarChart3, Shield } from "lucide-react";

const STEPS = [
  { icon: FileSearch, titleKey: "methodology.step1.title", descKey: "methodology.step1.desc" },
  { icon: CheckCircle2, titleKey: "methodology.step2.title", descKey: "methodology.step2.desc" },
  { icon: BarChart3, titleKey: "methodology.step3.title", descKey: "methodology.step3.desc" },
  { icon: Shield, titleKey: "methodology.step4.title", descKey: "methodology.step4.desc" },
];

/** Transparency builds trust - like IndexBox's "Read the methodology" (authority signal) */
export function MethodologySection() {
  const { t } = useTranslation();

  return (
    <section className="py-16 sm:py-20 bg-slate-50/80 border-y border-slate-200/80">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        <div className="mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-12">
            <div>
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-slate-900">
                {t("methodology.title")}
              </h2>
              <p className="text-slate-600 mt-2">
                {t("methodology.subtitle")}
              </p>
            </div>
            <Link
              href="/faq#verification"
              className="inline-flex items-center gap-2 text-blue-600 font-medium hover:underline shrink-0"
            >
              <FileSearch className="w-4 h-4" />
              {t("methodology.link")}
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((step, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 mb-3">
                  <step.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">{t(step.titleKey)}</h3>
                <p className="text-sm text-slate-600">{t(step.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
