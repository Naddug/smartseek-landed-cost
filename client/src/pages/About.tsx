import { Building2, Target, Users, Shield, Globe, Zap } from "lucide-react";
import { Link } from "wouter";
import { TrustBadges } from "@/components/trust/TrustBadges";
import { useTranslation } from "react-i18next";

export default function About() {
  const { t } = useTranslation();
  const values = [
    { icon: Shield, title: t("about.values.integrityTitle"), desc: t("about.values.integrityDesc") },
    { icon: Globe, title: t("about.values.globalTitle"), desc: t("about.values.globalDesc") },
    { icon: Zap, title: t("about.values.speedTitle"), desc: t("about.values.speedDesc") },
  ];

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-800 via-slate-700 to-blue-900 py-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] opacity-20" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">{t("about.title")}</h1>
            <p className="text-slate-300 text-lg leading-relaxed">
              {t("about.subtitle")}
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="text-2xl font-heading font-bold text-slate-900 mb-6">{t("about.missionTitle")}</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                {t("about.mission1")}
              </p>
              <p className="text-slate-600 leading-relaxed">
                {t("about.mission2")}
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-heading font-bold text-slate-900 mb-6">{t("about.serveTitle")}</h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                    <Building2 className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <strong className="text-slate-900">{t("about.procurers")}</strong> — {t("about.procurersDesc")}
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                    <Zap className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <strong className="text-slate-900">{t("about.entrepreneurs")}</strong> — {t("about.entrepreneursDesc")}
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <strong className="text-slate-900">{t("about.suppliers")}</strong> — {t("about.suppliersDesc")}
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl font-heading font-bold text-slate-900 mb-10 text-center">{t("about.standForTitle")}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((v, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-4">
                  <v.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{v.title}</h3>
                <p className="text-slate-600 text-sm">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white border-t border-slate-200">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-slate-500 mb-8">{t("trust.worldwide")}</p>
          <TrustBadges />
        </div>
      </section>

      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-xl font-heading font-bold text-slate-900 mb-6">{t("about.exploreTitle")}</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/search" className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-lg font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors">
              <Users className="w-4 h-4" /> {t("publicNav.suppliers")}
            </Link>
            <Link href="/signup" className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-lg font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors">
              <Target className="w-4 h-4" /> Start Free in Beta
            </Link>
            <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
              <Building2 className="w-4 h-4" /> {t("footer.contact")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
