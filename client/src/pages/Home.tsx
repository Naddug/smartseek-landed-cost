import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Search, ArrowRight, CheckCircle2, Rocket, Lock } from "lucide-react";
import { Link } from "wouter";
import { motion, useInView, useMotionValue, animate } from "framer-motion";
import PublicLayout from "@/components/layout/PublicLayout";

// ─── Animated counter ─────────────────────────────────────────────────────────

function AnimatedCounter({ to, duration = 2, suffix = "" }: { to: number; duration?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const count = useMotionValue(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(count, to, {
      duration,
      ease: "easeOut",
      onUpdate(v) {
        if (ref.current) ref.current.textContent = Math.floor(v).toLocaleString() + suffix;
      },
    });
    return controls.stop;
  }, [inView, to, duration, suffix, count]);

  return <span ref={ref}>0{suffix}</span>;
}

// ─── Demo supplier data ───────────────────────────────────────────────────────

const DEMO_SUPPLIERS = {
  antimony: [
    { name: "Guizhou Antimony Industry", city: "Guiyang", country: "China", industry: "Mining & Minerals", rating: 4.8, employees: "1,200+", verified: true, products: ["Antimony trioxide", "Antimony ingots"], flag: "🇨🇳" },
    { name: "Hunan New Wellre Group Corp.", city: "Changsha", country: "China", industry: "Mining & Minerals", rating: 4.6, employees: "850+", verified: true, products: ["Antimony metal", "Lead-antimony alloys"], flag: "🇨🇳" },
    { name: "Mandalay Resources Corp.", city: "Vancouver", country: "Canada", industry: "Mining & Minerals", rating: 4.3, employees: "420+", verified: false, products: ["Antimony concentrates", "Gold-antimony ore"], flag: "🇨🇦" },
  ],
  cotton: [
    { name: "Güneş Tekstil A.Ş.", city: "Istanbul", country: "Turkey", industry: "Textiles", rating: 4.7, employees: "650+", verified: true, products: ["Cotton fabric", "Technical textiles"], flag: "🇹🇷" },
    { name: "Anadolu Dokuma Sanayi", city: "Bursa", country: "Turkey", industry: "Textiles", rating: 4.5, employees: "1,100+", verified: true, products: ["Cotton yarn", "Jersey fabric"], flag: "🇹🇷" },
    { name: "Atlas Textile Export Ltd.", city: "Izmir", country: "Turkey", industry: "Textiles", rating: 4.2, employees: "320+", verified: false, products: ["Denim fabric", "Woven canvas"], flag: "🇹🇷" },
  ],
  solar: [
    { name: "BYD Solar Technology Co.", city: "Shenzhen", country: "China", industry: "Clean Energy", rating: 4.9, employees: "12,000+", verified: true, products: ["Solar panels", "Energy storage"], flag: "🇨🇳" },
    { name: "Trina Solar Co. Ltd.", city: "Changzhou", country: "China", industry: "Clean Energy", rating: 4.7, employees: "8,500+", verified: true, products: ["Monocrystalline modules", "PV systems"], flag: "🇨🇳" },
    { name: "Canadian Solar Vietnam", city: "Ho Chi Minh City", country: "Vietnam", industry: "Clean Energy", rating: 4.6, employees: "5,200+", verified: false, products: ["Solar modules", "String inverters"], flag: "🇻🇳" },
  ],
  pharma: [
    { name: "Sun Pharmaceutical Industries", city: "Mumbai", country: "India", industry: "Pharmaceuticals", rating: 4.8, employees: "35,000+", verified: true, products: ["Active pharmaceutical ingredients", "Generic drugs"], flag: "🇮🇳" },
    { name: "Dr. Reddy's Laboratories", city: "Hyderabad", country: "India", industry: "Pharmaceuticals", rating: 4.7, employees: "24,000+", verified: true, products: ["API manufacturing", "Formulations"], flag: "🇮🇳" },
    { name: "Aurobindo Pharma Ltd.", city: "Hyderabad", country: "India", industry: "Pharmaceuticals", rating: 4.5, employees: "19,000+", verified: false, products: ["Generic API", "Oral solid dosage"], flag: "🇮🇳" },
  ],
  default: [
    { name: "Pacific Manufacturing Group", city: "Shanghai", country: "China", industry: "Manufacturing", rating: 4.7, employees: "2,500+", verified: true, products: ["Industrial components", "OEM parts"], flag: "🇨🇳" },
    { name: "Euro Industrial Partners GmbH", city: "Munich", country: "Germany", industry: "Manufacturing", rating: 4.6, employees: "1,800+", verified: true, products: ["Precision engineering", "CNC machining"], flag: "🇩🇪" },
    { name: "ASEAN Supply Solutions Pte.", city: "Singapore", country: "Singapore", industry: "Distribution", rating: 4.4, employees: "750+", verified: false, products: ["Logistics", "Supply chain mgmt."], flag: "🇸🇬" },
  ],
};
type DemoSupplier = typeof DEMO_SUPPLIERS.default[0];

// ─── Supplier card ─────────────────────────────────────────────────────────────

function DemoCard({ s }: { s: DemoSupplier }) {
  const { t } = useTranslation();
  const score = Math.round(s.rating * 20);
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-default">
      <div className={`h-0.5 ${s.verified ? "bg-gradient-to-r from-blue-500 to-indigo-500" : "bg-slate-100"}`} />
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
              <span className="text-sm font-bold text-slate-900 truncate">{s.name}</span>
              {s.verified && (
                <span className="shrink-0 text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full border border-blue-100 font-semibold">✓ {t("home.demo.verified")}</span>
              )}
            </div>
            <span className="text-xs text-slate-500">{s.flag} {s.city}, {s.country}</span>
          </div>
          <div className={`shrink-0 w-9 h-9 rounded-lg flex flex-col items-center justify-center border ${score >= 80 ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-amber-50 border-amber-200 text-amber-700"}`}>
            <span className="text-xs font-bold leading-none">{score}</span>
            <span className="text-[8px] opacity-60 leading-none mt-0.5">QS</span>
          </div>
        </div>
        <span className="inline-block text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full mb-2">{s.industry}</span>
        <div className="flex flex-wrap gap-1 mb-3">
          {s.products.slice(0, 2).map((p, i) => (
            <span key={i} className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100">{p}</span>
          ))}
        </div>
        <div className="flex items-center justify-between text-xs border-t border-slate-50 pt-2.5">
          <div className="flex items-center gap-0.5">
            {[1,2,3,4,5].map(i => (
              <svg key={i} className={`w-3 h-3 ${i <= Math.round(s.rating) ? "text-amber-400" : "text-slate-200"}`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
            ))}
            <span className="ml-1 text-slate-700 font-semibold">{s.rating.toFixed(1)}</span>
          </div>
          <span className="text-slate-400 text-[11px]">{s.employees} emp.</span>
        </div>
      </div>
    </div>
  );
}

// ─── Static supplier preview ──────────────────────────────────────────────────

const PREVIEW_TABS: { key: keyof typeof DEMO_SUPPLIERS; label: string; icon: string; total: number }[] = [
  { key: "default",  label: "Manufacturing", icon: "🏭", total: 2847 },
  { key: "antimony", label: "Mining",         icon: "⛏️", total: 1247 },
  { key: "cotton",   label: "Textiles",       icon: "🧵", total: 3984 },
  { key: "solar",    label: "Clean Energy",   icon: "☀️", total: 4218 },
  { key: "pharma",   label: "Pharma",         icon: "💊", total: 2934 },
];

function StaticPreview() {
  const { t } = useTranslation();
  const [active, setActive] = useState<keyof typeof DEMO_SUPPLIERS>("default");
  const tab = PREVIEW_TABS.find(p => p.key === active)!;
  const suppliers = DEMO_SUPPLIERS[active];

  return (
    <div>
      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        {PREVIEW_TABS.map(p => (
          <button
            key={p.key}
            onClick={() => setActive(p.key)}
            className={`text-xs px-4 py-2 rounded-full border transition-all ${active === p.key ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20" : "bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white hover:border-slate-600"}`}
          >
            {p.icon} {p.label}
          </button>
        ))}
      </div>

      {/* Result header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2.5 py-1 rounded-full">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" /> {t("home.demo.liveResults")}
        </span>
        <span className="text-sm text-slate-300">
          <span className="font-bold text-white">{tab.total.toLocaleString()}</span>
          <span className="text-slate-400"> {t("home.demo.suppliersFound")}</span>
        </span>
      </div>

      {/* Supplier cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        {suppliers.map((s, i) => <DemoCard key={i} s={s} />)}
      </div>

      {/* Locked overlay for remaining results */}
      <div className="relative">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 select-none pointer-events-none">
          {[1,2,3].map(i => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 blur-sm opacity-60">
              <div className="flex justify-between mb-3">
                <div className="space-y-1.5 flex-1 mr-3">
                  <div className="h-4 bg-slate-200 rounded w-4/5" />
                  <div className="h-3 bg-slate-100 rounded w-1/2" />
                </div>
                <div className="w-9 h-9 bg-emerald-100 rounded-lg shrink-0" />
              </div>
              <div className="h-5 bg-slate-100 rounded w-24 mb-2" />
              <div className="flex gap-1 mb-3"><div className="h-5 w-20 bg-blue-50 rounded" /><div className="h-5 w-16 bg-blue-50 rounded" /></div>
              <div className="h-3 bg-slate-100 rounded w-full" />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 flex items-center justify-center rounded-xl" style={{ background: "linear-gradient(to top, rgba(15,23,42,0.97) 40%, rgba(15,23,42,0.6) 100%)" }}>
          <div className="text-center px-6 py-5 max-w-sm">
            <div className="w-11 h-11 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border border-white/20">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <p className="text-white font-bold text-lg mb-1 leading-tight">
              {t("home.demo.moreSuppliers", { count: (tab.total - 3).toLocaleString() })}
            </p>
            <p className="text-slate-300 text-sm mb-5 leading-relaxed">
              {t("home.demo.freeUnlocks")}
            </p>
            <div className="flex flex-col sm:flex-row gap-2.5 justify-center">
              <Link href="/signup">
                <button className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-900 font-bold px-5 py-2.5 rounded-xl text-sm transition-colors shadow-lg shadow-amber-500/20">
                  {t("home.demo.startFree")} <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
              <Link href="/login">
                <button className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-medium px-5 py-2.5 rounded-xl text-sm transition-colors">
                  {t("home.demo.logIn")}
                </button>
              </Link>
            </div>
            <p className="text-slate-500 text-xs mt-3">{t("home.demo.noCreditCard")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function Home() {
  const { t } = useTranslation();

  return (
    <PublicLayout>

      {/* ── 1) HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 px-4 text-center overflow-hidden">

        {/* Grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: "linear-gradient(rgba(99,102,241,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.15) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-amber-500/8 rounded-full blur-[120px] pointer-events-none" />

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-medium mb-8 tracking-wide"
        >
          <span className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-3 h-3 text-amber-400 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </span>
          {t("home.hero.badge")}
        </motion.div>

        {/* Supplier count */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative z-10 text-slate-400 text-sm font-mono mb-4 tracking-wider"
        >
          25.2M+ {t("home.suppliersIndexed")}
        </motion.div>

        {/* H1 */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="relative z-10 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight max-w-5xl mb-6"
        >
          Know your real landed cost
          <br className="hidden sm:block" />
          before you commit
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="relative z-10 text-slate-400 text-base sm:text-lg max-w-2xl leading-relaxed mb-8"
        >
          Find suppliers, calculate true import cost (freight, customs, taxes, inland), and decide with confidence.
        </motion.p>

        {/* Primary actions */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="relative z-10 flex flex-col sm:flex-row gap-3 mb-6"
        >
          <Link href="/landed-cost">
            <button className="inline-flex items-center justify-center gap-2 px-7 py-3 bg-amber-500 hover:bg-amber-400 text-slate-900 text-base font-bold rounded-xl transition shadow-lg shadow-amber-500/25">
              Try the calculator <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
          <Link href="/suppliers">
            <button className="inline-flex items-center justify-center gap-2 px-7 py-3 bg-white/5 hover:bg-white/10 border border-white/20 text-white text-base font-semibold rounded-xl transition">
              Browse suppliers
            </button>
          </Link>
        </motion.div>

        <p className="relative z-10 text-slate-600 text-xs mb-8">
          Sourcing intelligence for procurement teams
        </p>

        {/* Trust chips */}
        <div className="relative z-10 flex flex-wrap justify-center items-center gap-4 sm:gap-6 text-xs text-slate-500 mb-16">
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> {t("home.hero.chip1")}</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> {t("home.hero.chip2")}</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> {t("home.hero.chip3")}</span>
        </div>

        {/* Stats — hardcoded trust signals, never zero */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl w-full mb-20">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-blue-400">
              25.2M+
            </div>
            <div className="text-slate-500 text-xs mt-1">{t("home.hero.statSuppliers")}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-emerald-400">
              <AnimatedCounter to={220} duration={1.5} suffix="+" />
            </div>
            <div className="text-slate-500 text-xs mt-1">{t("home.hero.statCountries")}</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center text-violet-400 mb-1">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="text-slate-300 text-xs font-semibold">{t("home.trust.registryVerified")}</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center text-amber-400 mb-1">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="text-slate-300 text-xs font-semibold">{t("home.trust.directSource")}</div>
          </div>
        </div>
      </section>

      {/* ── 2) EXAMPLE SUPPLIER RESULTS ──────────────────────────────────────── */}
      <section className="bg-slate-900 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold text-blue-400 uppercase tracking-[0.2em] mb-3">
              {t("home.demo.badge")}
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">
              {t("home.features.title")}
            </h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">
              {t("home.demo.desc")}
            </p>
          </div>
          <StaticPreview />
        </div>
      </section>

      {/* ── 3) HOW IT WORKS ──────────────────────────────────────────────────── */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-[0.2em] mb-3 text-center">{t("home.hiw.badge")}</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 text-center mb-16">
            {t("home.hiw.title")}
          </h2>

          <div className="relative flex flex-col gap-0">
            <div className="absolute left-8 top-10 bottom-10 w-px bg-gradient-to-b from-blue-200 via-emerald-200 to-amber-200 hidden md:block" />
            {[
              { step: "01", icon: <Search className="w-6 h-6 text-blue-600" />, bg: "bg-blue-50", title: t("home.hiw.step1.title"), desc: t("home.hiw.step1.desc") },
              { step: "02", icon: <CheckCircle2 className="w-6 h-6 text-emerald-600" />, bg: "bg-emerald-50", title: t("home.hiw.step2.title"), desc: t("home.hiw.step2.desc") },
              { step: "03", icon: <Rocket className="w-6 h-6 text-amber-600" />, bg: "bg-amber-50", title: t("home.hiw.step3.title"), desc: t("home.hiw.step3.desc") },
            ].map((s) => (
              <div key={s.step} className="flex items-start gap-8 pb-12 relative">
                <div className="shrink-0 flex flex-col items-center">
                  <div className={`w-16 h-16 rounded-2xl ${s.bg} flex items-center justify-center shadow-sm border border-slate-100 z-10 relative`}>
                    {s.icon}
                  </div>
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

      {/* ── 4) TRUST ─────────────────────────────────────────────────────────── */}
      <div className="bg-slate-900 border-y border-slate-800 py-4 px-4">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-center items-center gap-6 text-xs text-slate-500">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> {t("home.trust.registryVerified")}</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500 inline-block" /> {t("home.trust.noFabricated")}</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-violet-500 inline-block" /> {t("home.trust.realRecords")}</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> {t("home.trust.directSource")}</span>
        </div>
      </div>

      <section className="bg-slate-50 border-b border-slate-100 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-10">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-[0.2em] mb-3">{t("home.trustBlock.badge")}</p>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
              {t("home.trustBlock.heading")}
            </h3>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
              {t("home.trustBlock.body")}
            </p>
            <div className="grid sm:grid-cols-3 gap-3 text-sm text-slate-700">
              <div className="rounded-xl border border-slate-200 px-4 py-3">{t("home.trustBlock.bullet1")}</div>
              <div className="rounded-xl border border-slate-200 px-4 py-3">{t("home.trustBlock.bullet2")}</div>
              <div className="rounded-xl border border-slate-200 px-4 py-3">{t("home.trustBlock.bullet3")}</div>
            </div>
            <div className="mt-6">
              <Link href="/pricing?waitlist=1">
                <button className="text-sm font-semibold text-blue-700 hover:text-blue-800 underline underline-offset-2">
                  {t("home.trustBlock.cta")}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5) PRICING ───────────────────────────────────────────────────────── */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-[0.2em] mb-3">{t("home.pricing.title")}</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
            {t("home.pricing.heading")}
          </h2>
          <p className="text-slate-500 text-sm mb-10">{t("home.pricing.subtitle")}</p>
          <div className="flex flex-col gap-3 mb-8">
            {[
              { tier: t("home.pricing.tierFree"), desc: t("home.pricing.tierFreeDesc"), color: "bg-slate-100 border-slate-200", badge: "" },
              { tier: t("home.pricing.tierPro"), desc: t("home.pricing.tierProDesc"), color: "bg-blue-600 border-blue-600", badge: t("home.pricing.tierProBadge"), textWhite: true },
              { tier: t("home.pricing.tierEnterprise"), desc: t("home.pricing.tierEnterpriseDesc"), color: "bg-slate-900 border-slate-800", textWhite: true },
            ].map((p, i) => (
              <div key={i} className={`flex items-center justify-between px-6 py-4 rounded-xl border ${p.color} ${(p as any).textWhite ? "text-white" : "text-slate-900"}`}>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-lg">{p.tier}</span>
                  {p.badge && <span className="text-xs bg-amber-400 text-slate-900 font-bold px-2 py-0.5 rounded-full">{p.badge}</span>}
                </div>
                <span className={`text-sm ${(p as any).textWhite ? "opacity-80" : "text-slate-500"}`}>{p.desc}</span>
              </div>
            ))}
          </div>
          <Link href="/signup">
            <button className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-8 py-3.5 rounded-xl transition shadow-lg shadow-amber-500/20 text-base">
              {t("home.pricing.getStarted")} <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </section>

      {/* ── 6) CTA ───────────────────────────────────────────────────────────── */}
      <section className="bg-slate-950 py-20 px-4 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-600/8 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-xl mx-auto">
          <p className="text-xs font-semibold text-amber-400 uppercase tracking-[0.2em] mb-4">{t("home.cta.badge")}</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
            {t("home.cta.title1")} <br className="hidden sm:block" />
            {t("home.cta.title2")}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mb-8 leading-relaxed">
            {t("home.cta.subtitle")}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
            <Link href="/signup">
              <button className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-8 py-3.5 rounded-xl transition hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-amber-500/20 text-base">
                {t("home.cta.primary")} <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <Link href="/search">
              <button className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium px-8 py-3.5 rounded-xl transition text-base">
                {t("home.cta.secondary")}
              </button>
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-4 text-xs text-slate-600">
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> {t("home.hero.chip1")}</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> {t("home.hero.chip2")}</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> {t("home.hero.chip3")}</span>
          </div>
          <p className="mt-4 text-xs text-slate-600">{t("home.cta.footer")}</p>
        </div>
      </section>

    </PublicLayout>
  );
}
