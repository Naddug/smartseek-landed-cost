import { useEffect } from "react";
import { Link } from "wouter";
import { ArrowRight, ShieldCheck, Search, FileText } from "lucide-react";
import PublicLayout from "@/components/layout/PublicLayout";

// Curated category index. Each entry maps to /suppliers/:slug (existing SEO category page).
// Slugs match server/seo.ts SUPPLIER_CATEGORIES so JSON-LD/canonical stay consistent.
const CATEGORIES: { slug: string; name: string; group: string; blurb: string; icon: string }[] = [
  // Strategic metals & critical minerals
  { slug: "antimony",          name: "Antimony",          group: "Strategic metals",       blurb: "Ingot, trioxide, alloys. Used in flame retardants, lead-acid, defence.", icon: "⛏️" },
  { slug: "tungsten",          name: "Tungsten",          group: "Strategic metals",       blurb: "APT, oxide, ferrotungsten. Cutting tools, defence, lighting.",            icon: "🔩" },
  { slug: "tin",               name: "Tin",               group: "Strategic metals",       blurb: "Refined tin, solder alloys, tinplate.",                                   icon: "🥫" },
  { slug: "lithium-batteries", name: "Lithium",           group: "Strategic metals",       blurb: "Carbonate, hydroxide, battery-grade chemistries.",                        icon: "🔋" },
  { slug: "rare-earths",       name: "Rare Earths",       group: "Strategic metals",       blurb: "NdPr, Dy, Tb oxides and concentrates.",                                   icon: "🔬" },
  // Base metals
  { slug: "copper-cathode",    name: "Copper",            group: "Base metals",            blurb: "Cathode A-grade, rod, scrap.",                                            icon: "🟠" },
  { slug: "aluminum",          name: "Aluminium",         group: "Base metals",            blurb: "Ingot, billet, sheet, extrusions.",                                       icon: "🥈" },
  { slug: "steel",             name: "Steel & Alloys",    group: "Base metals",            blurb: "HRC, CRC, rebar, plate, stainless.",                                      icon: "🏗️" },
  // Industrial verticals
  { slug: "electronics",       name: "Electronics",       group: "Industrial verticals",   blurb: "Components, PCBA, EMS partners.",                                         icon: "💡" },
  { slug: "machinery",         name: "Industrial Machinery", group: "Industrial verticals", blurb: "Capital equipment, tooling, precision parts.",                            icon: "⚙️" },
  { slug: "chemicals",         name: "Chemicals & Polymers", group: "Industrial verticals", blurb: "Bulk chemicals, polymers, intermediates.",                                icon: "🧪" },
  { slug: "automotive-parts",  name: "Automotive Parts",  group: "Industrial verticals",   blurb: "OEM and aftermarket components.",                                         icon: "🚗" },
  { slug: "plastics",          name: "Plastics",          group: "Industrial verticals",   blurb: "Resins, masterbatch, compounds.",                                         icon: "🧴" },
  // Soft inputs
  { slug: "textiles",          name: "Textiles",          group: "Materials & inputs",     blurb: "Yarn, woven, knit, technical textiles.",                                  icon: "🧵" },
  { slug: "cotton-fabric",     name: "Cotton Fabric",     group: "Materials & inputs",     blurb: "Mill direct, denim, jersey, canvas.",                                     icon: "🧶" },
  { slug: "food-ingredients",  name: "Food Ingredients",  group: "Materials & inputs",     blurb: "Bulk ingredients, agricultural commodities.",                             icon: "🌾" },
  { slug: "pharmaceutical-api",name: "Pharmaceutical API",group: "Materials & inputs",     blurb: "Active pharmaceutical ingredients, regulated.",                           icon: "💊" },
];

const GROUP_ORDER = ["Strategic metals", "Base metals", "Industrial verticals", "Materials & inputs"];

export default function SuppliersIndex() {
  useEffect(() => {
    // BreadcrumbList + ItemList JSON-LD for category authority
    const ld = [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://smartseek.com/" },
          { "@type": "ListItem", "position": 2, "name": "Suppliers", "item": "https://smartseek.com/suppliers" },
        ],
      },
      {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Supplier categories on SmartSeek",
        "itemListElement": CATEGORIES.map((c, i) => ({
          "@type": "ListItem",
          "position": i + 1,
          "name": `${c.name} suppliers`,
          "url": `https://smartseek.com/suppliers/${c.slug}`,
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
  }, []);

  const groups = GROUP_ORDER.map((g) => ({ group: g, items: CATEGORIES.filter((c) => c.group === g) }));

  return (
    <PublicLayout>
      <section className="bg-gradient-to-b from-slate-950 via-blue-950 to-slate-900 py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold mb-4">
            <Search className="w-3.5 h-3.5" /> Supplier directory
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">Browse suppliers by category</h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Curated, registry-verified suppliers across strategic metals, base metals, and industrial inputs. Pick a category to explore — or submit an RFQ and we&apos;ll source it for you.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <Link href="/rfq">
              <button className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-xl text-sm transition shadow-lg shadow-blue-600/20">
                <FileText className="w-4 h-4" /> Submit an RFQ
              </button>
            </Link>
            <Link href="/become-a-supplier">
              <button className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/20 text-white font-semibold px-6 py-3 rounded-xl text-sm transition">
                Become a supplier
              </button>
            </Link>
          </div>
          <p className="text-[11px] text-slate-500 mt-4 inline-flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> Registry-verified · operator-led RFQ routing
          </p>
        </div>
      </section>

      <section className="bg-white py-14 px-4 border-b border-slate-100">
        <div className="max-w-5xl mx-auto space-y-12">
          {groups.map(({ group, items }) => (
            <div key={group}>
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 mb-4">{group}</h2>
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
                        <span className="font-semibold text-slate-900">{c.name}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{c.blurb}</p>
                    <p className="text-[11px] text-slate-400 mt-2">smartseek.com/suppliers/{c.slug}</p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Don&apos;t see your category?</h2>
          <p className="text-sm text-slate-600 mb-5">Submit an RFQ. A sourcing operator will tap our internal index and verified network for the right suppliers.</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/rfq">
              <button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition">
                <FileText className="w-4 h-4" /> Submit an RFQ
              </button>
            </Link>
            <Link href="/methodology" className="text-sm font-semibold text-blue-700 underline underline-offset-2">How sourcing works</Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
