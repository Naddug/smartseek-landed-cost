import { useEffect } from "react";
import { Link } from "wouter";
import { ArrowRight, ShieldCheck, Search, FileText } from "lucide-react";
import PublicLayout from "@/components/layout/PublicLayout";
import { useTranslation } from "react-i18next";

const CATEGORIES: { slug: string; groupKey: string; icon: string }[] = [
  { slug: "antimony", groupKey: "strategicMetals", icon: "⛏️" },
  { slug: "tungsten", groupKey: "strategicMetals", icon: "🔩" },
  { slug: "tin", groupKey: "strategicMetals", icon: "🥫" },
  { slug: "lithium-batteries", groupKey: "strategicMetals", icon: "🔋" },
  { slug: "rare-earths", groupKey: "strategicMetals", icon: "🔬" },
  { slug: "copper-cathode", groupKey: "baseMetals", icon: "🟠" },
  { slug: "aluminum", groupKey: "baseMetals", icon: "🥈" },
  { slug: "steel", groupKey: "baseMetals", icon: "🏗️" },
  { slug: "electronics", groupKey: "industrialVerticals", icon: "💡" },
  { slug: "machinery", groupKey: "industrialVerticals", icon: "⚙️" },
  { slug: "chemicals", groupKey: "industrialVerticals", icon: "🧪" },
  { slug: "automotive-parts", groupKey: "industrialVerticals", icon: "🚗" },
  { slug: "plastics", groupKey: "industrialVerticals", icon: "🧴" },
  { slug: "textiles", groupKey: "materialsInputs", icon: "🧵" },
  { slug: "cotton-fabric", groupKey: "materialsInputs", icon: "🧶" },
  { slug: "food-ingredients", groupKey: "materialsInputs", icon: "🌾" },
  { slug: "pharmaceutical-api", groupKey: "materialsInputs", icon: "💊" },
];

const GROUP_ORDER = ["strategicMetals", "baseMetals", "industrialVerticals", "materialsInputs"] as const;

export default function SuppliersIndex() {
  const { t } = useTranslation();

  useEffect(() => {
    const ld = [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: t("suppliersIndex.ld.home"), item: "https://smartseek.com/" },
          { "@type": "ListItem", position: 2, name: t("suppliersIndex.ld.suppliers"), item: "https://smartseek.com/suppliers" },
        ],
      },
      {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: t("suppliersIndex.ld.listName"),
        itemListElement: CATEGORIES.map((c, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: `${t(`suppliersIndex.categories.${c.slug}.name`)} ${t("suppliersIndex.ld.itemSuffix")}`,
          url: `https://smartseek.com/suppliers/${c.slug}`,
        })),
      },
    ];
    let el = document.getElementById("suppliers-index-ld") as HTMLScriptElement | null;
    if (!el) {
      el = document.createElement("script");
      el.id = "suppliers-index-ld";
      el.type = "application/ld+json";
      document.head.appendChild(el);
    }
    el.text = JSON.stringify(ld);
  }, [t]);

  const groups = GROUP_ORDER.map((groupKey) => ({
    groupKey,
    items: CATEGORIES.filter((c) => c.groupKey === groupKey),
  }));

  return (
    <PublicLayout>
      <section className="bg-gradient-to-b from-slate-950 via-blue-950 to-slate-900 py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold mb-4">
            <Search className="w-3.5 h-3.5" /> {t("suppliersIndex.badge")}
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">{t("suppliersIndex.title")}</h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {t("suppliersIndex.subtitle")}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <Link href="/rfq">
              <button className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-xl text-sm transition shadow-lg shadow-blue-600/20">
                <FileText className="w-4 h-4" /> {t("suppliersIndex.submitRfq")}
              </button>
            </Link>
            <Link href="/become-a-supplier">
              <button className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/20 text-white font-semibold px-6 py-3 rounded-xl text-sm transition">
                {t("suppliersIndex.becomeSupplier")}
              </button>
            </Link>
          </div>
          <p className="text-[11px] text-slate-400 mt-4 inline-flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> {t("suppliersIndex.trustLine")}
          </p>
        </div>
      </section>

      <section className="bg-white py-14 px-4 border-b border-slate-100">
        <div className="max-w-5xl mx-auto space-y-12">
          {groups.map(({ groupKey, items }) => (
            <div key={groupKey}>
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 mb-4">
                {t(`suppliersIndex.groups.${groupKey}`)}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/suppliers/${c.slug}`}
                    className="group bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md rounded-xl p-4 transition-all"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{c.icon}</span>
                        <span className="font-semibold text-slate-900">{t(`suppliersIndex.categories.${c.slug}.name`)}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{t(`suppliersIndex.categories.${c.slug}.blurb`)}</p>
                    <p className="text-[11px] text-slate-500 mt-2">smartseek.com/suppliers/{c.slug}</p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-xl font-bold text-slate-900 mb-2">{t("suppliersIndex.footerTitle")}</h2>
          <p className="text-sm text-slate-600 mb-5">{t("suppliersIndex.footerBody")}</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/rfq">
              <button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition">
                <FileText className="w-4 h-4" /> {t("suppliersIndex.submitRfq")}
              </button>
            </Link>
            <Link href="/methodology" className="text-sm font-semibold text-blue-700 underline underline-offset-2">
              {t("suppliersIndex.methodologyLink")}
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
