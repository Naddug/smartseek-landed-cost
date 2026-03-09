import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Search, ArrowRight, Globe, DollarSign, Shield, CheckCircle2 } from "lucide-react";
import { Link, useLocation } from "wouter";
import PublicLayout from "@/components/layout/PublicLayout";

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
  const [countries, setCountries] = useState(220);

  useEffect(() => {
    fetch("/api/stats")
      .then(r => r.json())
      .then(d => {
        if (d.suppliers > 0) setSuppliers(d.suppliers);
        if (d.countries > 0) setCountries(d.countries);
      })
      .catch(() => {});
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    navigate(`/suppliers${q ? `?q=${encodeURIComponent(q)}` : ""}`);
  };

  const outcomes = [
    {
      icon: <Globe className="w-6 h-6" />,
      color: "text-blue-500",
      bg: "bg-blue-50",
      title: t("home.feature5.title"),
      desc: t("home.feature5.desc", { suppliers: formatStat(suppliers), leads: "", countries }),
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      color: "text-emerald-500",
      bg: "bg-emerald-50",
      title: t("home.feature2.title"),
      desc: t("home.feature2.desc", { suppliers: formatStat(suppliers), leads: "", countries }),
    },
    {
      icon: <Shield className="w-6 h-6" />,
      color: "text-violet-500",
      bg: "bg-violet-50",
      title: t("home.feature1.title"),
      desc: t("home.feature1.desc", { suppliers: formatStat(suppliers), leads: "", countries }),
    },
  ];

  return (
    <PublicLayout>
      {/* ── HERO ────────────────────────────────────────────────────── */}
      <section className="relative flex flex-col items-center justify-center min-h-[90vh] bg-slate-950 px-4 text-center overflow-hidden">

        {/* Subtle glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />

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

        {/* Subline */}
        <p className="relative z-10 text-slate-400 text-base sm:text-lg max-w-xl leading-relaxed mb-10">
          Search {formatStat(suppliers)} verified global suppliers and know your true cost — before you commit.
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

        {/* Micro CTAs */}
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

        {/* Bottom stat strip */}
        <div className="absolute bottom-8 left-0 right-0 z-10 flex justify-center gap-6 sm:gap-10 text-xs text-slate-600 font-medium tracking-wide">
          <span>{formatStat(suppliers)} suppliers</span>
          <span>·</span>
          <span>{countries}+ countries</span>
          <span>·</span>
          <span>Free plan available</span>
        </div>
      </section>

      {/* ── OUTCOMES ────────────────────────────────────────────────── */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-4xl mx-auto">

          <p className="text-center text-xs font-semibold text-slate-400 uppercase tracking-[0.2em] mb-14">
            Everything you need in one place
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {outcomes.map((o, i) => (
              <div key={i} className="flex flex-col gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${o.bg} ${o.color}`}>
                  {o.icon}
                </div>
                <h3 className="text-base font-semibold text-slate-900 leading-snug">{o.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{o.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DIVIDER ──────────────────────────────────────────────────── */}
      <div className="border-t border-slate-100" />

      {/* ── TESTIMONIAL ──────────────────────────────────────────────── */}
      <section className="bg-slate-50 py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
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

      {/* ── FINAL CTA ────────────────────────────────────────────────── */}
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
