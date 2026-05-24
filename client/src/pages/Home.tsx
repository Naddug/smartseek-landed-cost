import { useEffect, useState, FormEvent } from "react";
import { ArrowRight, CheckCircle2, ShieldCheck, FileText, Search, Building2, Lock } from "lucide-react";
import { Link } from "wouter";
import PublicLayout from "@/components/layout/PublicLayout";
import { useTranslation } from "react-i18next";

// ─── Curated category previews ────────────────────────────────────────────────
// Sample-based preview only. We do NOT advertise totals or "X suppliers found".

const PREVIEW: Record<string, { labelKey: string; icon: string; suppliers: { name: string; country: string; flag: string; products: string[]; verified: boolean; registry: string }[] }> = {
  antimony: {
    labelKey: "home.preview.tabMetals",
    icon: "⛏️",
    suppliers: [
      { name: "Hunan Chenzhou Mining Group", country: "China", flag: "🇨🇳", products: ["Antimony ingot 99.65%", "Antimony trioxide"], verified: true, registry: "SAIC" },
      { name: "Mandalay Resources Corp.", country: "Canada", flag: "🇨🇦", products: ["Antimony concentrates"], verified: true, registry: "SEDAR" },
      { name: "United States Antimony Corp.", country: "USA", flag: "🇺🇸", products: ["Antimony oxide", "Antimony trisulfide"], verified: true, registry: "SEC EDGAR" },
    ],
  },
  copper: {
    labelKey: "home.preview.tabManufacturing",
    icon: "🟠",
    suppliers: [
      { name: "Aurubis AG", country: "Germany", flag: "🇩🇪", products: ["Copper cathode A-grade", "Copper rod"], verified: true, registry: "Handelsregister" },
      { name: "KGHM Polska Miedź S.A.", country: "Poland", flag: "🇵🇱", products: ["Electrolytic copper", "Silver granulate"], verified: true, registry: "KRS" },
      { name: "Jiangxi Copper Co.", country: "China", flag: "🇨🇳", products: ["Cathode copper", "Copper wire rod"], verified: true, registry: "SAIC" },
    ],
  },
  steel: {
    labelKey: "home.preview.tabChemicals",
    icon: "🏗️",
    suppliers: [
      { name: "voestalpine AG", country: "Austria", flag: "🇦🇹", products: ["Cold-rolled steel", "Tool steel"], verified: true, registry: "Firmenbuch" },
      { name: "POSCO", country: "South Korea", flag: "🇰🇷", products: ["Hot-rolled coil", "Stainless plate"], verified: true, registry: "DART" },
      { name: "Erdemir", country: "Turkey", flag: "🇹🇷", products: ["Hot-rolled flat steel", "Galvanized coil"], verified: true, registry: "MERSIS" },
    ],
  },
  rare_earths: {
    labelKey: "home.preview.tabTextiles",
    icon: "🔬",
    suppliers: [
      { name: "Lynas Rare Earths Ltd.", country: "Australia", flag: "🇦🇺", products: ["NdPr oxide", "Lanthanum carbonate"], verified: true, registry: "ASIC" },
      { name: "MP Materials Corp.", country: "USA", flag: "🇺🇸", products: ["Rare-earth concentrate", "NdPr oxide"], verified: true, registry: "SEC EDGAR" },
      { name: "Iluka Resources", country: "Australia", flag: "🇦🇺", products: ["Monazite concentrate"], verified: false, registry: "ASIC" },
    ],
  },
};

type CategoryKey = keyof typeof PREVIEW;

function CuratedPreview() {
  const { t } = useTranslation();
  const [active, setActive] = useState<CategoryKey>("antimony");
  const cat = PREVIEW[active];
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        {(Object.keys(PREVIEW) as CategoryKey[]).map((k) => (
          <button
            key={k}
            onClick={() => setActive(k)}
            className={`text-xs px-4 py-2 rounded-full border transition-all ${
              active === k
                ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20"
                : "bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white hover:border-slate-600"
            }`}
          >
            {PREVIEW[k].icon} {t(PREVIEW[k].labelKey)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        {cat.suppliers.map((s, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
            <div className={`h-0.5 ${s.verified ? "bg-gradient-to-r from-blue-500 to-indigo-500" : "bg-slate-100"}`} />
            <div className="p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-sm font-bold text-slate-900 truncate">{s.name}</span>
                {s.verified && (
                  <span className="shrink-0 text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full border border-blue-100 font-semibold inline-flex items-center gap-0.5">
                    <ShieldCheck className="w-2.5 h-2.5" /> {t("home.preview.verified")}
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-500 mb-3">{s.flag} {s.country} · {t("home.preview.registryLabel")} {s.registry}</div>
              <div className="flex flex-wrap gap-1">
                {s.products.map((p, j) => (
                  <span key={j} className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100">{p}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="relative">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 select-none pointer-events-none">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 blur-sm opacity-60">
              <div className="h-4 bg-slate-200 rounded w-4/5 mb-2" />
              <div className="h-3 bg-slate-100 rounded w-1/2 mb-3" />
              <div className="flex gap-1">
                <div className="h-5 w-20 bg-blue-50 rounded" />
                <div className="h-5 w-16 bg-blue-50 rounded" />
              </div>
            </div>
          ))}
        </div>
        <div className="absolute inset-0 flex items-center justify-center rounded-xl" style={{ background: "linear-gradient(to top, rgba(15,23,42,0.97) 40%, rgba(15,23,42,0.6) 100%)" }}>
          <div className="text-center px-6 py-5 max-w-sm">
            <div className="w-11 h-11 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-3 border border-white/20">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <p className="text-white font-bold text-base mb-1 leading-tight">{t("home.preview.lockTitle")}</p>
            <p className="text-slate-300 text-sm mb-4 leading-relaxed">{t("home.preview.lockBody")}</p>
            <Link href="/pricing">
              <button className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-5 py-2.5 rounded-xl text-sm transition shadow-lg shadow-amber-500/20">
                {t("home.preview.lockCta")} <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Hero RFQ shortcut: typed product → /rfq ─────────────────────────────────

function HeroSearch() {
  const { t } = useTranslation();
  const [q, setQ] = useState("");
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = q.trim();
    if (!trimmed) return;
    window.location.href = `/search?q=${encodeURIComponent(trimmed)}`;
  };
  return (
    <form onSubmit={onSubmit} className="relative z-10 w-full max-w-2xl flex flex-col sm:flex-row gap-2 mb-4">
      <div className="flex-1 relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t("home.hero.searchPlaceholder")}
          className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40"
        />
      </div>
      <button type="submit" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-xl transition shadow-lg shadow-amber-500/20 text-sm">
        {t("home.hero.searchButton")} <ArrowRight className="w-4 h-4" />
      </button>
    </form>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  const { t } = useTranslation();
  // Inject JSON-LD for SEO
  useEffect(() => {
    const ld = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "SmartSeek",
      "url": "https://smartseek.com",
      "description": t("home.seo.description"),
      "sameAs": [],
    };
    let el = document.getElementById("smartseek-ld") as HTMLScriptElement | null;
    if (!el) {
      el = document.createElement("script");
      el.id = "smartseek-ld";
      el.type = "application/ld+json";
      document.head.appendChild(el);
    }
    el.text = JSON.stringify(ld);
  }, [t]);

  return (
    <PublicLayout>
      {/* ── 1) HERO ──────────────────────────────────────────────────────── */}
      <section className="relative flex flex-col items-center justify-center min-h-[88vh] bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 px-4 text-center overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: "linear-gradient(rgba(99,102,241,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.15) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />

        <div className="relative z-10 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-semibold mb-6 tracking-wide">
          <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
          {t("home.hero.banner")}
        </div>

        <h1 className="relative z-10 text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-[1.05] tracking-tight max-w-4xl mb-5">
          {t("home.hero.titleLine1")}
          <br className="hidden sm:block" />
          {t("home.hero.titleLine2")}
        </h1>

        <p className="relative z-10 text-slate-400 text-base sm:text-lg max-w-2xl leading-relaxed mb-8">
          {t("home.hero.subtitle")}
        </p>

        <HeroSearch />

        <div className="relative z-10 flex flex-col sm:flex-row gap-3 mb-3">
          <Link href="/rfq/new">
            <button className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition shadow-lg shadow-blue-600/20">
              <FileText className="w-4 h-4" /> {t("home.hero.submitRfq")}
            </button>
          </Link>
          <Link href="/become-a-supplier">
            <button className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/20 text-white text-sm font-semibold rounded-xl transition">
              <Building2 className="w-4 h-4" /> {t("home.hero.becomeSupplier")}
            </button>
          </Link>
        </div>
        <p className="relative z-10 text-xs text-slate-500 mb-8">
          {t("home.hero.builtFor")}
        </p>

        <div className="relative z-10 flex flex-wrap justify-center items-center gap-x-5 gap-y-2 text-xs text-slate-500 mb-12">
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> {t("home.trust.registryVerified")}</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> {t("home.trust.operatorRouting")}</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> {t("home.trust.structuredQuotes")}</span>
        </div>
      </section>

      {/* ── 2) CURATED CATEGORY PREVIEW ───────────────────────────────────── */}
      <section className="bg-slate-900 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold text-blue-400 uppercase tracking-[0.2em] mb-3">{t("home.sections.previewBadge")}</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">{t("home.sections.previewTitle")}</h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">{t("home.sections.previewBody")}</p>
          </div>
          <CuratedPreview />
        </div>
      </section>

      {/* ── 3) HOW IT WORKS ──────────────────────────────────────────────── */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-[0.2em] mb-3 text-center">{t("home.how.badge")}</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 text-center mb-16">{t("home.how.title")}</h2>

          <div className="relative flex flex-col gap-0">
            <div className="absolute left-8 top-10 bottom-10 w-px bg-gradient-to-b from-blue-200 via-emerald-200 to-amber-200 hidden md:block" />
            {[
              { step: "01", icon: <Search className="w-6 h-6 text-blue-600" />, bg: "bg-blue-50", title: t("home.how.step1Title"), desc: t("home.how.step1Desc") },
              { step: "02", icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />, bg: "bg-emerald-50", title: t("home.how.step2Title"), desc: t("home.how.step2Desc") },
              { step: "03", icon: <FileText className="w-6 h-6 text-amber-600" />, bg: "bg-amber-50", title: t("home.how.step3Title"), desc: t("home.how.step3Desc") },
            ].map((s) => (
              <div key={s.step} className="flex items-start gap-8 pb-12 relative">
                <div className="shrink-0 flex flex-col items-center">
                  <div className={`w-16 h-16 rounded-2xl ${s.bg} flex items-center justify-center shadow-sm border border-slate-100 z-10 relative`}>{s.icon}</div>
                </div>
                <div className="pt-3">
                  <div className="text-4xl font-bold text-slate-100 leading-none mb-2 select-none">{s.step}</div>
                  <h3 className="font-bold text-slate-900 text-lg mb-2 -mt-2">{s.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed max-w-lg">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4) TRUST STRIP ────────────────────────────────────────────────── */}
      <div className="bg-slate-900 border-y border-slate-800 py-4 px-4">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-xs text-slate-500">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> {t("home.trustStrip.registryVerified")}</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500 inline-block" /> {t("home.trustStrip.noFabricated")}</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-violet-500 inline-block" /> {t("home.trustStrip.operatorRouting")}</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> {t("home.trustStrip.directContact")}</span>
        </div>
      </div>

      <section className="bg-slate-50 border-b border-slate-100 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-10">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-[0.2em] mb-3">{t("home.why.badge")}</p>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">{t("home.why.title")}</h3>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
              {t("home.why.body")}
            </p>
            <div className="grid sm:grid-cols-3 gap-3 text-sm text-slate-700">
              <div className="rounded-xl border border-slate-200 px-4 py-3">{t("home.why.pill1")}</div>
              <div className="rounded-xl border border-slate-200 px-4 py-3">{t("home.why.pill2")}</div>
              <div className="rounded-xl border border-slate-200 px-4 py-3">{t("home.why.pill3")}</div>
            </div>
            <div className="mt-6 flex flex-wrap gap-4">
              <Link href="/methodology" className="text-sm font-semibold text-blue-700 hover:text-blue-800 underline underline-offset-2">{t("home.why.methodologyLink")}</Link>
              <Link href="/verification" className="text-sm font-semibold text-blue-700 hover:text-blue-800 underline underline-offset-2">{t("home.why.verificationLink")}</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5) FOUNDING USERS / BETA CTA ──────────────────────────────────── */}
      <section className="bg-slate-950 py-20 px-4 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-600/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative z-10 max-w-xl mx-auto">
          <p className="text-xs font-semibold text-amber-400 uppercase tracking-[0.2em] mb-4">{t("home.founding.badge")}</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
            {t("home.founding.title1")}<br className="hidden sm:block" />
            {t("home.founding.title2")}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mb-8 leading-relaxed">
            {t("home.founding.body")}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
            <Link href="/pricing">
              <button className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-8 py-3.5 rounded-xl transition shadow-lg shadow-amber-500/20 text-base">
                {t("home.founding.requestBeta")} <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <Link href="/rfq/new">
              <button className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium px-8 py-3.5 rounded-xl transition text-base">
                {t("home.founding.submitRfq")}
              </button>
            </Link>
          </div>
          <p className="text-xs text-slate-600">{t("home.founding.noPayment")}</p>
        </div>
      </section>
      <div className="sm:hidden h-16" aria-hidden="true" />

      {/* Mobile sticky action bar — procurement-toned labels aligned with the rest of the site */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-slate-800 bg-slate-950/95 backdrop-blur px-3 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        <div className="grid grid-cols-2 gap-2">
          <Link href="/pricing">
            <button className="w-full inline-flex items-center justify-center bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold py-2.5 rounded-lg text-xs">
              {t("home.mobile.betaAccess")}
            </button>
          </Link>
          <Link href="/rfq">
            <button className="w-full inline-flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 rounded-lg text-xs">
              {t("home.mobile.submitRfq")}
            </button>
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
}
