
import { useTranslation } from "react-i18next";

export default function Privacy() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-800 via-slate-700 to-blue-900 py-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] opacity-20" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">{t("privacy.title")}</h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            {t("privacy.subtitle")}
          </p>
        </div>
      </section>
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6 text-slate-600">
            <p>
              {t("privacy.p1")}
            </p>
            <h2 className="font-semibold text-slate-900">{t("privacy.dataTitle")}</h2>
            <p>
              {t("privacy.dataBody")}
            </p>
            <h2 className="font-semibold text-slate-900">{t("privacy.useTitle")}</h2>
            <p>
              {t("privacy.useBody")}
            </p>
            <h2 className="font-semibold text-slate-900">{t("footer.contact")}</h2>
            <p>
              {t("privacy.contactBody")}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
