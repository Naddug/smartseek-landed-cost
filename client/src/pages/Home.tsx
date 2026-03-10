import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Search, ArrowRight, Globe, DollarSign, Shield, CheckCircle2, Check, TrendingUp, Brain, Rocket, AlertTriangle, Clock, BadgeDollarSign } from "lucide-react";
import { Link, useLocation } from "wouter";
import { motion, useInView, useMotionValue, animate } from "framer-motion";
import PublicLayout from "@/components/layout/PublicLayout";
import { IntegrationLogos } from "@/components/integrations/IntegrationLogos";

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatStat(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M+`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K+`;
  return `${n}+`;
}

// ─── Animated counter ────────────────────────────────────────────────────────

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

// ─── Cycling placeholder ─────────────────────────────────────────────────────

const PLACEHOLDERS = [
  "antimony suppliers...",
  "cotton fabric, Vietnam...",
  "solar panels, China...",
  "steel coils, Turkey...",
  "lithium batteries, Korea...",
  "pharmaceutical APIs, India...",
];

export default function Home() {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [, navigate] = useLocation();
  const [suppliers, setSuppliers] = useState(25_200_000);
  const [leads, setLeads] = useState(7_000_000);
  const [countries, setCountries] = useState(220);
  const [industries, setIndustries] = useState(20);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    fetch("/api/stats")
      .then(r => r.json())
      .then(d => {
        if (d.suppliers > 0) setSuppliers(d.suppliers);
        if (d.leads > 0) setLeads(d.leads);
        if (d.countries > 0) setCountries(d.countries);
        if (d.industries > 0) setIndustries(d.industries);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const id = setInterval(() => setPlaceholderIdx(i => (i + 1) % PLACEHOLDERS.length), 2500);
    return () => clearInterval(id);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    navigate(`/suppliers${q ? `?q=${encodeURIComponent(q)}` : ""}`);
  };

  const tabs = [
    {
      label: t("home.tabs.findSuppliers"),
      icon: <Globe className="w-4 h-4" />,
      color: "blue",
      preview: (
        <div className="bg-slate-900 rounded-xl p-4 border border-slate-700 text-xs font-mono">
          <div className="flex items-center gap-2 mb-3 text-slate-400">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span className="w-2 h-2 rounded-full bg-yellow-500" />
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span className="ml-2 text-slate-500">supplier-search.smartseek.io</span>
          </div>
          {[
            { name: "Guizhou Antimony Industry", country: "🇨🇳 China", rating: "4.8 ★", verified: true },
            { name: "Hunan Mining Co Ltd", country: "🇨🇳 China", rating: "4.5 ★", verified: true },
            { name: "Boliden Mineral Sweden", country: "🇸🇪 Sweden", rating: "4.7 ★", verified: false },
          ].map((r, i) => (
            <div key={i} className="flex items-center justify-between py-1.5 border-b border-slate-800">
              <div>
                <span className="text-white">{r.name}</span>
                <span className="text-slate-400 ml-2">{r.country}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-amber-400">{r.rating}</span>
                {r.verified && <span className="text-emerald-400 text-[10px] bg-emerald-900/40 px-1.5 py-0.5 rounded">✓ Verified</span>}
              </div>
            </div>
          ))}
          <div className="mt-2 text-slate-500">→ 1,247 results for "antimony suppliers"</div>
        </div>
      ),
    },
    {
      label: t("home.tabs.calculateCosts"),
      icon: <DollarSign className="w-4 h-4" />,
      color: "emerald",
      preview: (
        <div className="bg-slate-900 rounded-xl p-4 border border-slate-700 text-xs font-mono">
          <div className="flex items-center gap-2 mb-3 text-slate-400">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span className="w-2 h-2 rounded-full bg-yellow-500" />
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span className="ml-2 text-slate-500">landed-cost.smartseek.io</span>
          </div>
          {[
            { label: "Product Cost", value: "$45,000", color: "text-white" },
            { label: "Ocean Freight (FCL)", value: "$3,200", color: "text-slate-300" },
            { label: "Import Duties (6.5%)", value: "$2,925", color: "text-red-400" },
            { label: "VAT / GST", value: "$1,440", color: "text-red-400" },
            { label: "Insurance & CFS", value: "$380", color: "text-slate-300" },
            { label: "Total Landed Cost", value: "$52,945", color: "text-emerald-400 font-bold" },
          ].map((r, i) => (
            <div key={i} className={`flex justify-between py-1 ${i === 5 ? "border-t border-slate-600 mt-1 pt-2" : ""}`}>
              <span className="text-slate-400">{r.label}</span>
              <span className={r.color}>{r.value}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      label: t("home.tabs.assessRisk"),
      icon: <Shield className="w-4 h-4" />,
      color: "violet",
      preview: (
        <div className="bg-slate-900 rounded-xl p-4 border border-slate-700 text-xs font-mono">
          <div className="flex items-center gap-2 mb-3 text-slate-400">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span className="w-2 h-2 rounded-full bg-yellow-500" />
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span className="ml-2 text-slate-500">risk-intel.smartseek.io</span>
          </div>
          {[
            { label: "Country Risk (China)", score: 62, level: "MEDIUM", color: "text-yellow-400 bg-yellow-900/40" },
            { label: "Shipping Route Risk", score: 78, level: "HIGH", color: "text-red-400 bg-red-900/40" },
            { label: "Supplier Stability", score: 91, level: "LOW", color: "text-emerald-400 bg-emerald-900/40" },
            { label: "Trade Compliance", score: 85, level: "LOW", color: "text-emerald-400 bg-emerald-900/40" },
          ].map((r, i) => (
            <div key={i} className="flex items-center justify-between py-1.5 border-b border-slate-800">
              <span className="text-slate-300">{r.label}</span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-current rounded-full" style={{ width: `${r.score}%` }} />
                </div>
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${r.color}`}>{r.level}</span>
              </div>
            </div>
          ))}
        </div>
      ),
    },
  ];

  const testimonials = [
    { initials: "MK", name: "Marcus Klein", role: "CPO, AutoTech GmbH", quote: "We cut supplier qualification time from 3 weeks to 2 days. The verified data alone is worth 10x the subscription cost.", bg: "bg-slate-800", text: "text-white" },
    { initials: "SP", name: "Sunita Patel", role: "Procurement Lead, Reliance", quote: "Finally a platform that understands landed cost complexity. The duty calculations are spot-on for India imports.", bg: "bg-amber-500", text: "text-slate-900" },
    { initials: "JL", name: "Jason Liu", role: "VP Sourcing, TechCo Inc", quote: "SmartSeek found us 40+ qualified antimony suppliers in under a minute. Our old database had 3.", bg: "bg-slate-800", text: "text-white" },
    { initials: "EF", name: "Elena Ferretti", role: "Head of Supply Chain, Moda", quote: "The risk intelligence flagged our Turkish supplier's financial issues 6 weeks before we would have found out.", bg: "bg-blue-600", text: "text-white" },
  ];

  return (
    <PublicLayout>

      {/* ── A) HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 px-4 text-center overflow-hidden">

        {/* Animated grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: "linear-gradient(rgba(99,102,241,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.15) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Glow orbs */}
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

        {/* Animated counter headline */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative z-10 text-slate-400 text-sm font-mono mb-4 tracking-wider"
        >
          <AnimatedCounter to={25_234_891} duration={2.5} /> {t("home.suppliersIndexed")}
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="relative z-10 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight max-w-5xl mb-6"
        >
          {t("home.hero.title1")}{" "}
          <br className="hidden sm:block" />
          {t("home.hero.title2")}{" "}
          <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
            {t("home.hero.title3")}
          </span>
        </motion.h1>

        {/* Subhead */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="relative z-10 text-slate-400 text-base sm:text-lg max-w-2xl leading-relaxed mb-8"
        >
          {t("home.hero.subtitleBase", { suppliers: formatStat(suppliers) })}<span className="text-white font-medium">{t("home.hero.subtitleHighlight")}</span>
        </motion.p>

        {/* Search bar */}
        <motion.form
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          onSubmit={handleSearch}
          className="relative z-10 w-full max-w-2xl flex items-center bg-white rounded-xl shadow-[0_0_80px_rgba(59,130,246,0.2)] overflow-hidden mb-3 border border-white/10"
        >
          <Search className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={PLACEHOLDERS[placeholderIdx]}
            className="flex-1 pl-12 pr-4 py-4 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent transition-all"
          />
          <button
            type="submit"
            className="shrink-0 m-1.5 px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-900 text-sm font-bold rounded-lg transition flex items-center gap-2 shadow-lg shadow-amber-500/25"
          >
            {t("home.hero.searchBtn")} <ArrowRight className="w-4 h-4" />
          </button>
        </motion.form>

        <p className="relative z-10 text-slate-600 text-xs mb-10">
          {t("home.hero.proofLine", { matches: "200+" })}
        </p>

        {/* Trust chips */}
        <div className="relative z-10 flex flex-wrap justify-center items-center gap-4 sm:gap-6 text-xs text-slate-500 mb-16">
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> {t("home.hero.chip1")}</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> {t("home.hero.chip2")}</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> {t("home.hero.chip3")}</span>
        </div>

        {/* 4 stat counters */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl w-full mb-0">
          {[
            { label: t("home.hero.statSuppliers"), value: suppliers, color: "text-blue-400" },
            { label: t("home.hero.statLeads"), value: leads, color: "text-emerald-400" },
            { label: t("home.hero.statCountries"), value: countries, color: "text-violet-400", suffix: "+" },
            { label: t("home.hero.statIndustries"), value: industries, color: "text-amber-400", suffix: "+" },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div className={`text-2xl sm:text-3xl font-bold ${s.color}`}>
                <AnimatedCounter to={s.value} duration={2 + i * 0.3} suffix={s.suffix ?? ""} />
              </div>
              <div className="text-slate-500 text-xs mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Social proof logos */}
        <div className="absolute bottom-0 left-0 right-0 z-10 border-t border-white/5 bg-white/2 backdrop-blur-sm py-3">
          <div className="max-w-3xl mx-auto px-4 flex justify-center items-center gap-8 text-xs font-semibold text-slate-600 tracking-widest">
            <span>GOOGLE WORKSPACE</span>
            <span>SAP</span>
            <span>SALESFORCE</span>
            <span>ORACLE</span>
            <span>NETSUITE</span>
          </div>
        </div>
      </section>

      {/* ── B) LIVE DATA TICKER ─────────────────────────────────────────────── */}
      <div className="bg-slate-900 border-y border-slate-800 py-2.5 overflow-hidden">
        <div
          className="flex gap-12 whitespace-nowrap text-xs font-medium text-slate-400"
          style={{
            animation: "ticker 40s linear infinite",
            display: "inline-flex",
          }}
        >
          {[...Array(3)].map((_, rep) => (
            <span key={rep} className="flex gap-12">
              <span><span className="text-red-400 font-bold">● LIVE</span> &nbsp;847 new suppliers added today</span>
              <span className="text-slate-600">•</span>
              <span>Turkey exports <span className="text-emerald-400">+12%</span> this week</span>
              <span className="text-slate-600">•</span>
              <span><span className="text-yellow-400">⚠ Risk alert:</span> Red Sea shipping delays</span>
              <span className="text-slate-600">•</span>
              <span>23 new solar panel suppliers from Vietnam</span>
              <span className="text-slate-600">•</span>
              <span>Antimony spot price <span className="text-red-400">+8.3%</span> MTD</span>
              <span className="text-slate-600">•</span>
              <span>India pharma API exports at record high</span>
              <span className="text-slate-600">•</span>
              <span>New verified: 12 German automotive suppliers</span>
              <span className="text-slate-600">•</span>
            </span>
          ))}
        </div>
        <style>{`@keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-33.333%); } }`}</style>
      </div>

      {/* ── C) THE PROBLEM (asymmetric) ─────────────────────────────────────── */}
      <section className="bg-slate-950 py-20 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-10 items-center">
          <div className="md:col-span-3">
            <p className="text-xs font-semibold text-red-500 uppercase tracking-[0.2em] mb-4">{t("home.pain.badge")}</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-[1.1] mb-6">
              {t("home.pain.headingLine1")}<br /><span className="text-red-400">{t("home.pain.headingHighlight")}</span><br />{t("home.pain.headingLine2")}
            </h2>
            <p className="text-slate-400 text-base leading-relaxed max-w-xl">
              {t("home.pain.desc")}
            </p>
          </div>
          <div className="md:col-span-2 flex flex-col gap-4">
            {[
              { stat: t("home.pain.card1stat"), desc: t("home.pain.card1desc"), color: "border-red-500/30 bg-red-950/20" },
              { stat: t("home.pain.card2stat"), desc: t("home.pain.card2desc"), color: "border-orange-500/30 bg-orange-950/20" },
              { stat: t("home.pain.card3stat"), desc: t("home.pain.card3desc"), color: "border-yellow-500/30 bg-yellow-950/20" },
            ].map((s, i) => (
              <div key={i} className={`border rounded-xl p-5 ${s.color}`}>
                <div className="text-2xl font-bold text-white mb-1">{s.stat}</div>
                <div className="text-slate-400 text-sm">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── D) FEATURE SHOWCASE (tabbed) ────────────────────────────────────── */}
      <section className="bg-slate-900 py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-xs font-semibold text-slate-400 uppercase tracking-[0.2em] mb-3">{t("home.features.badge")}</p>
          <h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-10">
            {t("home.features.title")}
          </h2>

          {/* Tabs */}
          <div className="flex justify-center gap-2 mb-8 flex-wrap">
            {tabs.map((tab, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === i
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-2xl mx-auto"
          >
            {tabs[activeTab].preview}
            <div className="mt-4 text-center">
              <Link href={activeTab === 0 ? "/suppliers" : activeTab === 1 ? "/landed-cost" : "/risk-intelligence"}>
                <span className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-medium cursor-pointer">
                  {t("home.tabs.tryFree")} <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── E) HOW IT WORKS (numbered, linear) ──────────────────────────────── */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-[0.2em] mb-3 text-center">{t("home.hiw.badge")}</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 text-center mb-16">
            {t("home.hiw.title")}
          </h2>

          <div className="relative flex flex-col gap-0">
            {/* Vertical connector */}
            <div className="absolute left-8 top-10 bottom-10 w-px bg-gradient-to-b from-blue-200 via-purple-200 to-emerald-200 hidden md:block" />

            {[
              { step: "01", icon: <Search className="w-6 h-6 text-blue-600" />, bg: "bg-blue-50", title: t("home.hiw.step1.title"), desc: t("home.hiw.step1.desc") },
              { step: "02", icon: <Brain className="w-6 h-6 text-purple-600" />, bg: "bg-purple-50", title: t("home.hiw.step2.title"), desc: t("home.hiw.step2.desc") },
              { step: "03", icon: <Rocket className="w-6 h-6 text-emerald-600" />, bg: "bg-emerald-50", title: t("home.hiw.step3.title"), desc: t("home.hiw.step3.desc") },
            ].map((s, i) => (
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

      {/* ── F) SOCIAL PROOF (2x2 grid) ──────────────────────────────────────── */}
      <section className="bg-slate-50 border-y border-slate-100 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-8 mx-auto flex w-fit">
            <TrendingUp className="w-4 h-4" /> {t("home.testimonial.badge")}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {testimonials.map((t, i) => (
              <div key={i} className={`${t.bg} rounded-2xl p-6 flex flex-col gap-4`}>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} className="w-3.5 h-3.5 text-amber-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <blockquote className={`text-sm leading-relaxed font-medium ${t.text} opacity-90`}>"{t.quote}"</blockquote>
                <div className="flex items-center gap-3 mt-auto">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${i === 1 ? "bg-slate-900 text-amber-500" : "bg-blue-600 text-white"}`}>
                    {t.initials}
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${t.text}`}>{t.name}</p>
                    <p className={`text-xs opacity-60 ${t.text}`}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── G) PRICING TEASER ───────────────────────────────────────────────── */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-[0.2em] mb-3">{t("home.pricing.title")}</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-10">
            {t("home.pricing.heading")}
          </h2>
          <div className="flex flex-col gap-3 mb-8">
            {[
              { tier: "Free", desc: "Search suppliers, 3 results per query", color: "bg-slate-100 border-slate-200", badge: "" },
              { tier: "Professional", desc: "Unlimited search, landed cost calculator, export tools", color: "bg-blue-600 border-blue-600", badge: "Most Popular", textWhite: true },
              { tier: "Enterprise", desc: "Custom integrations, dedicated support, bulk data access", color: "bg-slate-900 border-slate-800", textWhite: true },
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
              Get Started Free <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </section>

      {/* ── H) FINAL CTA ────────────────────────────────────────────────────── */}
      <section className="bg-slate-950 py-24 px-4 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-600/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/4 w-[300px] h-[300px] bg-amber-500/6 rounded-full blur-[100px] pointer-events-none" />

        {/* Integrations strip */}
        <div className="relative z-10 max-w-5xl mx-auto mb-14">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-[0.2em] mb-8">
            {t("home.integrations.label")}
          </p>
          <IntegrationLogos variant="compact" />
        </div>

        <div className="relative z-10 max-w-xl mx-auto">
          <p className="text-xs font-semibold text-amber-400 uppercase tracking-[0.2em] mb-4">{t("home.cta.badge")}</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
            {t("home.cta.title1")} <br className="hidden sm:block" />
            {t("home.cta.title2")}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mb-8 leading-relaxed">
            {t("home.cta.subtitle")}
          </p>

          {/* Big search bar again */}
          <form
            onSubmit={handleSearch}
            className="flex items-center bg-white rounded-xl overflow-hidden mb-6 shadow-[0_0_60px_rgba(59,130,246,0.15)]"
          >
            <Search className="ml-4 w-5 h-5 text-slate-400 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search 25M+ suppliers..."
              className="flex-1 pl-3 pr-4 py-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
            />
            <button type="submit" className="shrink-0 m-1.5 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-sm rounded-lg transition">
              {t("home.pricing.search")}
            </button>
          </form>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
            <Link href="/signup">
              <button className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-8 py-3.5 rounded-xl transition hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-amber-500/20 text-base">
                {t("home.cta.primary")} <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <Link href="/suppliers">
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
