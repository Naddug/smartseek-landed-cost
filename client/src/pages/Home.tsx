import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Search, ArrowRight, Globe, DollarSign, Shield,
  CheckCircle2, Check, TrendingUp, Brain, Rocket,
  AlertTriangle, Clock, BadgeDollarSign,
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
      <section className="relative flex flex-col items-center justify-center min-h-[92vh] bg-slate-950 px-4 text-center overflow-hidden">

        {/* Glow orbs */}
        <div className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-blue-600/15 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute top-[50%] right-[10%] w-[300px] h-[300px] bg-amber-500/8 rounded-full blur-[100px] pointer-events-none" />

        {/* Social proof badge */}
        <div className="relative z-10 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-medium mb-10 tracking-wide">
          <span className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-3 h-3 text-amber-400 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </span>
          Trusted by 50,000+ procurement professionals worldwide
        </div>

        {/* Headline — loss aversion + specificity */}
        <h1 className="relative z-10 text-4xl sm:text-5xl md:text-6xl lg:text-72px font-bold text-white leading-[1.1] tracking-tight max-w-4xl mb-6">
          Find the right supplier.{" "}
          <br className="hidden sm:block" />
          Know the real cost.{" "}
          <span className="text-amber-400">Move first.</span>
        </h1>

        {/* Subhead — specific, outcome-driven */}
        <p className="relative z-10 text-slate-400 text-base sm:text-lg max-w-2xl leading-relaxed mb-3">
          {formatStat(suppliers)} verified global suppliers, accurate landed costs, and AI-powered risk intelligence — so your team decides in <span className="text-white font-medium">hours, not weeks.</span>
        </p>

        {/* Micro pain line */}
        <p className="relative z-10 text-slate-600 text-sm mb-10 italic">
          Stop cold-emailing. Stop guessing costs. Stop being surprised at customs.
        </p>

        {/* Search bar */}
        <form
          onSubmit={handleSearch}
          className="relative z-10 w-full max-w-2xl flex items-center bg-white rounded-xl shadow-[0_0_60px_rgba(59,130,246,0.15)] overflow-hidden mb-4 border border-white/10"
        >
          <Search className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder='Try: "cotton fabric manufacturer, Turkey" or "electronics, Vietnam"'
            className="flex-1 pl-12 pr-4 py-4 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
          />
          <button
            type="submit"
            className="shrink-0 m-1.5 px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-900 text-sm font-bold rounded-lg transition flex items-center gap-2 shadow-lg shadow-amber-500/20"
          >
            Search Free <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Micro proof under search */}
        <p className="relative z-10 text-slate-600 text-xs mb-8">
          Average search returns <span className="text-slate-400 font-medium">200+ verified matches</span> in under a second
        </p>

        {/* Trust chips */}
        <div className="relative z-10 flex flex-wrap justify-center items-center gap-4 sm:gap-6 text-xs text-slate-500">
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> No credit card required</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Free plan available</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Government-verified data</span>
        </div>

        {/* Stat strip at bottom of hero */}
        <div className="absolute bottom-0 left-0 right-0 z-10 border-t border-white/5 bg-white/3 backdrop-blur-sm">
          <div className="max-w-3xl mx-auto px-4 py-4 flex justify-center gap-8 sm:gap-16 text-xs font-medium tracking-wide">
            <span className="text-blue-400">{formatStat(suppliers)} <span className="text-slate-500">Suppliers</span></span>
            <span className="text-emerald-400">{formatStat(leads)} <span className="text-slate-500">Trade Leads</span></span>
            <span className="text-violet-400">{countries}+ <span className="text-slate-500">Countries</span></span>
            <span className="text-amber-400">{industries}+ <span className="text-slate-500">Industries</span></span>
          </div>
        </div>
      </section>

      {/* ── 2. INTEGRATIONS ──────────────────────────────────────────── */}
      <section className="bg-white border-b border-slate-100 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-xs font-semibold text-slate-400 uppercase tracking-[0.2em] mb-10">
            Plugs into the tools your procurement team already uses
          </p>
          <IntegrationLogos variant="compact" />
        </div>
      </section>

      {/* ── 3. FEATURES — PAS formula ────────────────────────────────── */}
      <section className="bg-slate-50 py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-[0.2em] mb-3">Three problems. One platform.</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 max-w-2xl mx-auto leading-snug">
              Built for the moments that matter most in procurement
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Card 1 — Supplier Discovery */}
            <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all flex flex-col">
              <div className="h-1.5 bg-gradient-to-r from-blue-500 to-blue-400" />
              <div className="p-7 flex flex-col gap-5 flex-1">
                <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <Globe className="w-5 h-5" />
                </div>
                {/* Pain line */}
                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">The problem</p>
                <p className="text-sm text-slate-500 italic leading-relaxed -mt-3">
                  "We spend 3 weeks cold-emailing suppliers who never respond — and still end up with the wrong ones."
                </p>
                <div className="border-t border-slate-100 pt-4">
                  <h3 className="text-base font-bold text-slate-900 mb-2">Find verified suppliers in seconds</h3>
                  <p className="text-sm text-slate-500 leading-relaxed mb-4">
                    Government-registry verified contacts across {formatStat(suppliers)} suppliers. No bounced emails. No dead leads.
                  </p>
                  <ul className="space-y-2">
                    {[
                      "Email & phone included — no hunting",
                      "Filter by cert, country, MOQ, employees",
                      "Send RFQ in 2 clicks",
                    ].map(b => (
                      <li key={b} className="flex items-start gap-2 text-sm text-slate-600">
                        <Check className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" /> {b}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link href="/suppliers" className="mt-auto">
                  <span className="text-sm text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-1 cursor-pointer">
                    Search suppliers free <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
              </div>
            </div>

            {/* Card 2 — Landed Cost */}
            <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-emerald-300 hover:shadow-xl transition-all flex flex-col">
              <div className="h-1.5 bg-gradient-to-r from-emerald-500 to-emerald-400" />
              <div className="p-7 flex flex-col gap-5 flex-1">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <DollarSign className="w-5 h-5" />
                </div>
                <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">The problem</p>
                <p className="text-sm text-slate-500 italic leading-relaxed -mt-3">
                  "We budgeted $42k. The invoice said $61k. The difference was duties we didn't know existed."
                </p>
                <div className="border-t border-slate-100 pt-4">
                  <h3 className="text-base font-bold text-slate-900 mb-2">Know your real cost before you commit</h3>
                  <p className="text-sm text-slate-500 leading-relaxed mb-4">
                    Duties, freight, insurance, port fees, VAT — calculated upfront. No surprises when the container arrives.
                  </p>
                  <ul className="space-y-2">
                    {[
                      "HS code lookup & live duty rates",
                      "Sea FCL/LCL, air, express compared",
                      "Multi-country origin comparison",
                    ].map(b => (
                      <li key={b} className="flex items-start gap-2 text-sm text-slate-600">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> {b}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link href="/landed-cost" className="mt-auto">
                  <span className="text-sm text-emerald-600 font-semibold hover:text-emerald-700 flex items-center gap-1 cursor-pointer">
                    Calculate landed cost <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
              </div>
            </div>

            {/* Card 3 — Risk Intelligence */}
            <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-violet-300 hover:shadow-xl transition-all flex flex-col">
              <div className="h-1.5 bg-gradient-to-r from-violet-500 to-violet-400" />
              <div className="p-7 flex flex-col gap-5 flex-1">
                <div className="w-11 h-11 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600">
                  <Shield className="w-5 h-5" />
                </div>
                <p className="text-xs font-semibold text-violet-600 uppercase tracking-wide">The problem</p>
                <p className="text-sm text-slate-500 italic leading-relaxed -mt-3">
                  "Our top supplier was in a region that went unstable. We had no backup plan and lost 6 weeks of production."
                </p>
                <div className="border-t border-slate-100 pt-4">
                  <h3 className="text-base font-bold text-slate-900 mb-2">Spot supplier risk before it costs you</h3>
                  <p className="text-sm text-slate-500 leading-relaxed mb-4">
                    AI risk scores for every supplier and region. Geopolitical flags. Alternative sourcing routes identified automatically.
                  </p>
                  <ul className="space-y-2">
                    {[
                      "Risk score 0–100 for any supplier",
                      "Real-time geopolitical & compliance flags",
                      "Alternatives suggested automatically",
                    ].map(b => (
                      <li key={b} className="flex items-start gap-2 text-sm text-slate-600">
                        <Check className="w-4 h-4 text-violet-500 shrink-0 mt-0.5" /> {b}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link href="/risk-intelligence" className="mt-auto">
                  <span className="text-sm text-violet-600 font-semibold hover:text-violet-700 flex items-center gap-1 cursor-pointer">
                    Assess my risk <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. PAIN INTERRUPTION ─────────────────────────────────────── */}
      <section className="bg-slate-950 py-16 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-400" />
            </div>
            <div className="text-3xl font-bold text-white">14 <span className="text-amber-400">hrs/week</span></div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Average time procurement teams waste on manual supplier research
            </p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <div className="text-3xl font-bold text-white">$2.3M <span className="text-red-400">lost</span></div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Estimated annual loss per company from hidden import costs and poor supplier choices
            </p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="text-3xl font-bold text-white">23% <span className="text-emerald-400">saved</span></div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Average cost reduction reported by SmartSeek users in their first 90 days
            </p>
          </div>
        </div>
        <p className="text-center text-xs text-slate-600 mt-10 max-w-xl mx-auto">
          SmartSeek users go from 14 hours of weekly research to under 2. That's 12 hours back — every single week.
        </p>
      </section>

      {/* ── 5. HOW IT WORKS ──────────────────────────────────────────── */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-[0.2em] mb-3">How it works</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">
              From search to contract in days — not months
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            <div className="hidden md:block absolute top-10 left-[23%] right-[23%] h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

            {[
              {
                step: "01",
                icon: <Search className="w-6 h-6 text-blue-600" />,
                bg: "bg-blue-50",
                title: "Search",
                desc: "Type a product, material, or industry. Get 200+ verified supplier matches instantly — with contact details.",
              },
              {
                step: "02",
                icon: <Brain className="w-6 h-6 text-purple-600" />,
                bg: "bg-purple-50",
                title: "Analyze",
                desc: "AI scores each supplier on risk, quality, and landed cost. Compare countries and routes side-by-side.",
              },
              {
                step: "03",
                icon: <Rocket className="w-6 h-6 text-emerald-600" />,
                bg: "bg-emerald-50",
                title: "Source",
                desc: "Contact suppliers directly, send an RFQ, and move forward — all without leaving the platform.",
              },
            ].map(s => (
              <div key={s.step} className="relative bg-slate-50 rounded-2xl p-7 border border-slate-200 z-10 hover:border-slate-300 hover:shadow-md transition-all">
                <span className="absolute top-5 right-6 text-5xl font-bold text-slate-100 select-none">{s.step}</span>
                <div className={`w-12 h-12 rounded-xl ${s.bg} flex items-center justify-center mb-5`}>{s.icon}</div>
                <h3 className="font-bold text-slate-900 text-lg mb-2">{s.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. TESTIMONIAL ───────────────────────────────────────────── */}
      <section className="bg-slate-50 border-y border-slate-100 py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          {/* Outcome badge */}
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-8">
            <TrendingUp className="w-4 h-4" /> 60% faster supplier qualification
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
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
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
      <section className="bg-slate-950 py-24 px-4 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative z-10 max-w-xl mx-auto">
          <p className="text-xs font-semibold text-amber-400 uppercase tracking-[0.2em] mb-4">Start for free today</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
            Your competitors are already <br className="hidden sm:block" />
            sourcing smarter. Are you?
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mb-10 leading-relaxed">
            Join 50,000+ procurement professionals who stopped guessing and started sourcing with confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/signup">
              <button className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-8 py-4 rounded-xl transition hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-amber-500/20 text-base">
                Start Searching Free <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <Link href="/suppliers">
              <button className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium px-8 py-4 rounded-xl transition text-base">
                Browse suppliers
              </button>
            </Link>
          </div>
          <p className="mt-5 text-xs text-slate-600">No credit card · Free plan · Cancel anytime</p>
        </div>
      </section>

    </PublicLayout>
  );
}
