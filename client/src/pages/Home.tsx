import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Search, ArrowRight, Globe, DollarSign, Shield, CheckCircle2, Check, TrendingUp, Brain, Rocket, AlertTriangle, Clock, BadgeDollarSign, Lock, Zap, Building2, Target } from "lucide-react";
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

// ─── Interactive Demo Data ──────────────────────────────────────────────────

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

function getDemoResults(query: string): DemoSupplier[] {
  const q = query.toLowerCase();
  if (q.includes("antimony") || q.includes("mineral") || q.includes("mining")) return DEMO_SUPPLIERS.antimony;
  if (q.includes("cotton") || q.includes("textile") || q.includes("fabric") || q.includes("turk")) return DEMO_SUPPLIERS.cotton;
  if (q.includes("solar") || q.includes("panel") || q.includes("energy") || q.includes("vietnam")) return DEMO_SUPPLIERS.solar;
  if (q.includes("pharma") || q.includes("api") || q.includes("drug") || q.includes("india")) return DEMO_SUPPLIERS.pharma;
  return DEMO_SUPPLIERS.default;
}

function DemoCard({ s }: { s: DemoSupplier }) {
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
                <span className="shrink-0 text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full border border-blue-100 font-semibold">✓ Verified</span>
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

function InteractiveDemo() {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<DemoSupplier[] | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [searching, setSearching] = useState(false);

  const QUICK = [
    { label: "⛏ Antimony suppliers China", q: "antimony suppliers china" },
    { label: "🧵 Cotton fabric Turkey", q: "cotton fabric turkey" },
    { label: "☀ Solar panels Vietnam", q: "solar panels vietnam" },
    { label: "💊 Pharma API India", q: "pharmaceutical api india" },
  ];

  const run = (q: string) => {
    if (!q.trim()) return;
    setSearching(true);
    setResults(null);
    setTimeout(() => {
      setResults(getDemoResults(q));
      const base = q.includes("solar") ? 4218 : q.includes("cotton") || q.includes("turk") ? 3847 : q.includes("pharma") || q.includes("india") ? 2934 : 1247;
      setTotalCount(base + Math.floor(Math.random() * 80));
      setSearching(false);
    }, 650);
  };

  return (
    <div>
      <form onSubmit={(e) => { e.preventDefault(); run(query); }} className="flex gap-2 mb-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={t("home.demo.placeholder")}
            className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all"
          />
        </div>
        <button type="submit" disabled={searching}
          className="shrink-0 px-5 py-3 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 disabled:opacity-60 text-slate-900 font-bold text-sm rounded-xl transition-colors flex items-center gap-2 shadow-lg shadow-amber-500/20">
          {searching
            ? <span className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
            : <Zap className="w-4 h-4" />}
          {t("home.demo.searchBtn")}
        </button>
      </form>

      <div className="flex flex-wrap gap-2 mb-8">
        {QUICK.map(s => (
          <button key={s.q} onClick={() => { setQuery(s.label); run(s.q); }}
            className="text-xs bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700 hover:border-slate-600 transition-all hover:shadow-sm">
            {s.label}
          </button>
        ))}
      </div>

      {searching && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1,2,3].map(i => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 animate-pulse">
              <div className="flex justify-between mb-3">
                <div className="space-y-1.5 flex-1 mr-3">
                  <div className="h-4 bg-slate-200 rounded w-4/5" />
                  <div className="h-3 bg-slate-100 rounded w-1/2" />
                </div>
                <div className="w-9 h-9 bg-slate-100 rounded-lg shrink-0" />
              </div>
              <div className="h-5 bg-slate-100 rounded w-24 mb-2" />
              <div className="flex gap-1 mb-3"><div className="h-5 w-20 bg-blue-50 rounded" /><div className="h-5 w-16 bg-blue-50 rounded" /></div>
              <div className="h-3 bg-slate-100 rounded w-full" />
            </div>
          ))}
        </div>
      )}

      {results && !searching && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" /> {t("home.demo.liveResults")}
            </span>
            <span className="text-sm text-slate-300">
              <span className="font-bold text-white">{totalCount.toLocaleString()}</span>
              <span className="text-slate-400"> {t("home.demo.suppliersFound")}</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            {results.map((s, i) => <DemoCard key={i} s={s} />)}
          </div>

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
                  {(totalCount - 3).toLocaleString()} more suppliers available
                </p>
                <p className="text-slate-300 text-sm mb-5 leading-relaxed">
                  Free account unlocks full results, verified contact info, AI-powered analysis, and export tools.
                </p>
                <div className="flex flex-col sm:flex-row gap-2.5 justify-center">
                  <Link href="/signup">
                    <button className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-900 font-bold px-5 py-2.5 rounded-xl text-sm transition-colors shadow-lg shadow-amber-500/20">
                      Start Free <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                  <Link href="/login">
                    <button className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-medium px-5 py-2.5 rounded-xl text-sm transition-colors">
                      Log in
                    </button>
                  </Link>
                </div>
                <p className="text-slate-500 text-xs mt-3">No credit card required</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {!results && !searching && (
        <div className="flex flex-col items-center justify-center py-14 text-center gap-3">
          <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
            <Building2 className="w-6 h-6 text-slate-500" />
          </div>
          <p className="text-slate-400 text-sm">Enter any product, material, or industry above</p>
          <p className="text-slate-600 text-xs">Or click a quick search to see results instantly</p>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [, navigate] = useLocation();
  const [suppliers, setSuppliers] = useState(0);
  const [leads, setLeads] = useState(0);
  const [countries, setCountries] = useState(0);
  const [industries, setIndustries] = useState(0);
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
    { initials: "MK", name: t("home.testimonialCard1.name"), role: t("home.testimonialCard1.role"), quote: t("home.testimonialCard1.quote"), bg: "bg-slate-800", text: "text-white" },
    { initials: "SP", name: t("home.testimonialCard2.name"), role: t("home.testimonialCard2.role"), quote: t("home.testimonialCard2.quote"), bg: "bg-amber-500", text: "text-slate-900" },
    { initials: "JL", name: t("home.testimonialCard3.name"), role: t("home.testimonialCard3.role"), quote: t("home.testimonialCard3.quote"), bg: "bg-slate-800", text: "text-white" },
    { initials: "EF", name: t("home.testimonialCard4.name"), role: t("home.testimonialCard4.role"), quote: t("home.testimonialCard4.quote"), bg: "bg-blue-600", text: "text-white" },
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
          {suppliers > 0 ? (
            <><AnimatedCounter to={suppliers} duration={2.5} /> {t("home.suppliersIndexed")}</>
          ) : (
            <span className="text-slate-400 text-sm font-mono tracking-wider">{t("home.globalEngine")}</span>
          )}
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
          {t("home.hero.subtitleBase", { suppliers: suppliers > 0 ? formatStat(suppliers) : "Verified" })}<span className="text-white font-medium">{t("home.hero.subtitleHighlight")}</span>
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
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl w-full mb-20">
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
      </section>

      {/* ── B) DATA TRUST BAR ─────────────────────────────────────────────── */}
      <div className="bg-slate-900 border-y border-slate-800 py-3 px-4">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-center items-center gap-6 text-xs text-slate-500">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> {t("home.trust.registryVerified")}</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500 inline-block" /> {t("home.trust.noFabricated")}</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-violet-500 inline-block" /> {t("home.trust.realRecords")}</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> {t("home.trust.directSource")}</span>
        </div>
      </div>

      {/* ── B2) INTEGRATIONS ──────────────────────────────────────────────────── */}
      <div className="bg-slate-900 border-b border-slate-800 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-[11px] font-semibold text-slate-600 uppercase tracking-[0.18em] mb-5">
            {t("home.integrations.title")}
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-3">
            {["Google Workspace", "SAP Ariba", "Salesforce", "Oracle", "Microsoft Dynamics", "Coupa"].map(name => (
              <span key={name} className="text-sm font-semibold text-slate-600 tracking-wide">{name}</span>
            ))}
          </div>
        </div>
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

      {/* ── D) INTERACTIVE DEMO ──────────────────────────────────────────────── */}
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
          <InteractiveDemo />
        </div>
      </section>

      {/* ── E) CORE CAPABILITIES ────────────────────────────────────────────── */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-[0.2em] mb-3">{t("home.capabilities.badge")}</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              {t("home.capabilities.title")}
            </h2>
            <p className="text-slate-500 text-base max-w-xl mx-auto">
              {t("home.capabilities.subtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Globe className="w-6 h-6 text-blue-600" />,
                bg: "bg-blue-50",
                accent: "from-blue-500 to-indigo-500",
                border: "border-slate-200 hover:border-blue-300",
                title: t("home.capabilities.findSuppliers"),
                desc: t("home.capabilities.findSuppliersDesc"),
                href: "/suppliers",
                cta: t("home.capabilities.searchSuppliers"),
                chips: [t("home.capabilities.findSuppliersChip1"), t("home.capabilities.findSuppliersChip2"), t("home.capabilities.findSuppliersChip3")],
                chipColor: "bg-blue-50 border-blue-100 text-blue-700",
              },
              {
                icon: <Target className="w-6 h-6 text-emerald-600" />,
                bg: "bg-emerald-50",
                accent: "from-emerald-500 to-teal-500",
                border: "border-slate-200 hover:border-emerald-300",
                title: t("home.capabilities.findLeads"),
                desc: t("home.capabilities.findLeadsDesc"),
                href: "/signup",
                cta: t("home.capabilities.exploreLeads"),
                chips: [t("home.capabilities.findLeadsChip1"), t("home.capabilities.findLeadsChip2"), t("home.capabilities.findLeadsChip3")],
                chipColor: "bg-emerald-50 border-emerald-100 text-emerald-700",
              },
              {
                icon: <Brain className="w-6 h-6 text-violet-600" />,
                bg: "bg-violet-50",
                accent: "from-violet-500 to-purple-500",
                border: "border-slate-200 hover:border-violet-300",
                title: t("home.capabilities.aiIntel"),
                desc: t("home.capabilities.aiIntelDesc"),
                href: "/signup",
                cta: t("home.capabilities.tryAI"),
                chips: [t("home.capabilities.aiIntelChip1"), t("home.capabilities.aiIntelChip2"), t("home.capabilities.aiIntelChip3")],
                chipColor: "bg-violet-50 border-violet-100 text-violet-700",
              },
            ].map((cap) => (
              <Link key={cap.title} href={cap.href}>
                <div className={`group relative bg-white border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer ${cap.border}`}>
                  <div className={`h-1 bg-gradient-to-r ${cap.accent}`} />
                  <div className="p-7">
                    <div className={`w-12 h-12 rounded-xl ${cap.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                      {cap.icon}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{cap.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed mb-4">{cap.desc}</p>
                    <div className="flex flex-wrap gap-2 mb-5">
                      {cap.chips.map(chip => (
                        <span key={chip} className={`text-xs border px-2.5 py-1 rounded-full font-medium ${cap.chipColor}`}>{chip}</span>
                      ))}
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 group-hover:text-blue-700">
                      {cap.cta} <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── F) HOW IT WORKS (numbered, linear) ──────────────────────────────── */}
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

      {/* ── G) SOCIAL PROOF (2x2 grid) ──────────────────────────────────────── */}
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

      {/* ── H) INTEGRATIONS (dedicated section) ─────────────────────────────── */}
      <section className="bg-white border-t border-slate-100 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-[0.2em] mb-3">
            {t("home.integrations.label")}
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
            {t("home.integrations.sectionTitle")}
          </h2>
          <p className="text-slate-500 text-sm mb-12 max-w-xl mx-auto leading-relaxed">
            {t("home.integrations.sectionDesc")}
          </p>
          <IntegrationLogos variant="compact" />
          <div className="mt-10">
            <Link href="/integrations">
              <button className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 border border-blue-200 hover:border-blue-400 px-5 py-2.5 rounded-xl transition-colors">
                {t("home.integrations.viewAll")} <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── I) PRICING TEASER ───────────────────────────────────────────────── */}
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

      {/* ── J) FINAL CTA ────────────────────────────────────────────────────── */}
      <section className="bg-slate-950 py-24 px-4 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-600/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/4 w-[300px] h-[300px] bg-amber-500/6 rounded-full blur-[100px] pointer-events-none" />

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
              placeholder={t("home.searchPlaceholder")}
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
