import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Search, ArrowRight, Globe, DollarSign, Shield,
  CheckCircle2, Check, TrendingUp, Brain, Rocket,
} from "lucide-react";
import { Link, useLocation } from "wouter";
import PublicLayout from "@/components/layout/PublicLayout";
import { IntegrationLogos } from "@/components/integrations/IntegrationLogos";

function formatStat(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M+`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K+`;
  return `${n}+`;
}

export default function Home() {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [, navigate] = useLocation();
  const [suppliers, setSuppliers] = useState(25_200_000);
  const [leads, setLeads] = useState(7_000_000);
  const [countries, setCountries] = useState(220);
  const [industries, setIndustries] = useState(20);

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    navigate(`/suppliers${q ? `?q=${encodeURIComponent(q)}` : ""}`);
  };

  return (
    <PublicLayout>

      {/* ── 1. HERO ─────────────────────────────────────────────────── */}
      <section className="relative flex flex-col items-center justify-center min-h-[88vh] bg-slate-950 px-4 text-center overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />

        {/* Badge */}
        <div className="relative z-10 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/8 border border-white/10 text-slate-400 text-xs font-medium mb-8 tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Trusted by procurement teams in {countries}+ countries
        </div>

        {/* Headline */}
        <h1 className="relative z-10 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.12] tracking-tight max-w-3xl mb-5">
          {t("hero.title1")}
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-300">
            {t("hero.title2")}
          </span>
        </h1>

        <p className="relative z-10 text-slate-400 text-base sm:text-lg max-w-xl leading-relaxed mb-10">
          Search {formatStat(suppliers)} verified global suppliers, calculate true landed costs, and assess supply chain risk — all in one platform.
        </p>

        {/* Search bar */}
        <form
          onSubmit={handleSearch}
          className="relative z-10 w-full max-w-xl flex items-center bg-white rounded-xl shadow-2xl shadow-blue-900/30 overflow-hidden mb-5"
        >
          <Search className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search suppliers, products, or industries..."
            className="flex-1 pl-12 pr-4 py-4 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
          />
          <button
            type="submit"
            className="shrink-0 m-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition flex items-center gap-2"
          >
            Search <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-sm">
          <Link href="/signup">
            <span className="text-blue-400 hover:text-blue-300 font-medium transition cursor-pointer flex items-center gap-1.5">
              {t("hero.cta")} <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>
          <span className="hidden sm:block text-slate-700">·</span>
          <span className="text-slate-500 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> {t("hero.noCard")}
          </span>
        </div>

        <div className="absolute bottom-8 left-0 right-0 z-10 flex justify-center gap-6 sm:gap-10 text-xs text-slate-600 font-medium tracking-wide">
          <span>{formatStat(suppliers)} suppliers</span>
          <span>·</span>
          <span>{countries}+ countries</span>
          <span>·</span>
          <span>Free plan available</span>
        </div>
      </section>

      {/* ── 2. STATS ─────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-slate-100 py-14 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: formatStat(suppliers), label: t("stat.verifiedSuppliers") },
            { value: formatStat(leads),     label: t("stat.buyerLeads") },
            { value: `${countries}+`,       label: t("stat.countries") },
            { value: `${industries}+`,      label: t("stat.industries") },
          ].map((s, i) => (
            <div key={i}>
              <div className="text-3xl sm:text-4xl font-bold text-slate-900 tabular-nums mb-1">{s.value}</div>
              <div className="text-sm text-slate-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. INTEGRATIONS ──────────────────────────────────────────── */}
      <section className="bg-slate-50 border-b border-slate-100 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-xs font-semibold text-slate-400 uppercase tracking-[0.2em] mb-10">
            Integrates with your existing procurement stack
          </p>
          <IntegrationLogos variant="compact" />
        </div>
      </section>

      {/* ── 4. FEATURES ──────────────────────────────────────────────── */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-[0.2em] mb-3">Platform capabilities</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">
              Everything you need to source smarter
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Supplier Discovery */}
            <div className="bg-slate-50 rounded-2xl p-7 flex flex-col gap-5 border border-slate-100 hover:border-blue-200 hover:shadow-lg transition-all">
              <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{t("home.feature5.title")}</h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-4">
                  Search {formatStat(suppliers)} verified suppliers across {countries}+ countries. Filter by industry, country, certifications, and more.
                </p>
                <ul className="space-y-2">
                  {["Government-registry verified data", "Real-time contact enrichment", "RFQ & lead capture built in"].map(b => (
                    <li key={b} className="flex items-center gap-2 text-sm text-slate-600">
                      <Check className="w-4 h-4 text-blue-500 shrink-0" /> {b}
                    </li>
                  ))}
                </ul>
              </div>
              <Link href="/suppliers">
                <span className="text-sm text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1 cursor-pointer mt-auto">
                  Search suppliers <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            </div>

            {/* Landed Cost */}
            <div className="bg-slate-50 rounded-2xl p-7 flex flex-col gap-5 border border-slate-100 hover:border-emerald-200 hover:shadow-lg transition-all">
              <div className="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{t("home.feature2.title")}</h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-4">
                  Calculate the true total cost of any import shipment — duties, freight, insurance, taxes, and port fees — before you commit.
                </p>
                <ul className="space-y-2">
                  {["HS code lookup & duty rates", "Sea FCL/LCL, air & express", "Multi-country comparison"].map(b => (
                    <li key={b} className="flex items-center gap-2 text-sm text-slate-600">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" /> {b}
                    </li>
                  ))}
                </ul>
              </div>
              <Link href="/landed-cost">
                <span className="text-sm text-emerald-600 font-medium hover:text-emerald-700 flex items-center gap-1 cursor-pointer mt-auto">
                  Try the calculator <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            </div>

            {/* Risk Intelligence */}
            <div className="bg-slate-50 rounded-2xl p-7 flex flex-col gap-5 border border-slate-100 hover:border-violet-200 hover:shadow-lg transition-all">
              <div className="w-11 h-11 rounded-xl bg-violet-100 flex items-center justify-center text-violet-600">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{t("home.feature1.title")}</h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-4">
                  Real-time risk scoring for suppliers, countries, and industries. Identify concentration risk and alternative sourcing routes instantly.
                </p>
                <ul className="space-y-2">
                  {["AI-powered risk scores 0–100", "Geopolitical & compliance flags", "Alternative supplier suggestions"].map(b => (
                    <li key={b} className="flex items-center gap-2 text-sm text-slate-600">
                      <Check className="w-4 h-4 text-violet-500 shrink-0" /> {b}
                    </li>
                  ))}
                </ul>
              </div>
              <Link href="/risk-intelligence">
                <span className="text-sm text-violet-600 font-medium hover:text-violet-700 flex items-center gap-1 cursor-pointer mt-auto">
                  Assess risk <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. HOW IT WORKS ──────────────────────────────────────────── */}
      <section className="bg-slate-50 border-y border-slate-100 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-[0.2em] mb-3">{t("home.howItWorks.badge")}</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">{t("home.howItWorks.title")}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* connector line */}
            <div className="hidden md:block absolute top-10 left-[23%] right-[23%] h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />

            {[
              { step: "01", icon: <Search className="w-6 h-6 text-blue-600" />, bg: "bg-blue-50", title: t("home.step1.title"), desc: t("home.step1.desc") },
              { step: "02", icon: <Brain className="w-6 h-6 text-purple-600" />, bg: "bg-purple-50", title: t("home.step2.title"), desc: t("home.step2.desc", { suppliers: formatStat(suppliers) }) },
              { step: "03", icon: <Rocket className="w-6 h-6 text-emerald-600" />, bg: "bg-emerald-50", title: t("home.step3.title"), desc: t("home.step3.desc") },
            ].map(s => (
              <div key={s.step} className="relative bg-white rounded-2xl p-7 border border-slate-200 shadow-sm z-10">
                <span className="absolute top-5 right-6 text-5xl font-bold text-slate-100 select-none">{s.step}</span>
                <div className={`w-12 h-12 rounded-xl ${s.bg} flex items-center justify-center mb-5`}>{s.icon}</div>
                <h3 className="font-bold text-slate-900 mb-2">{s.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. TESTIMONIAL ───────────────────────────────────────────── */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          {/* Cost savings badge */}
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-8">
            <TrendingUp className="w-4 h-4" /> Average 23% cost reduction reported by users
          </div>

          <div className="flex justify-center mb-6 gap-1">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>

          <blockquote className="text-xl sm:text-2xl font-medium text-slate-800 leading-relaxed mb-8">
            "{t("home.testimonial1.quote")}"
          </blockquote>

          <div className="flex items-center justify-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
              {t("home.testimonial1.name").split(" ").map((w: string) => w[0]).join("")}
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-slate-900">{t("home.testimonial1.name")}</p>
              <p className="text-xs text-slate-500">{t("home.testimonial1.role")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. FINAL CTA ─────────────────────────────────────────────── */}
      <section className="bg-slate-950 py-20 px-4 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            {t("home.cta.title")}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mb-8 leading-relaxed">
            {t("home.cta.subtitle")}
          </p>
          <Link href="/signup">
            <button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3.5 rounded-xl transition hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-600/30">
              {t("home.cta.button")} <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
          <p className="mt-4 text-xs text-slate-600">{t("home.cta.footer")}</p>
        </div>
      </section>

    </PublicLayout>
  );
}
