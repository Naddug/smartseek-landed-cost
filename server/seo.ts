/**
 * Server-side SEO meta injection for the SmartSeek SPA.
 *
 * Because this is a Vite + React SPA, search engine crawlers receive a blank
 * shell unless the Express server injects page-specific meta tags *before*
 * sending index.html. This module does exactly that: it replaces the
 * <!-- SEO_META_INJECT --> placeholder in the built HTML with a full <head>
 * block containing <title>, <meta name="description">, Open Graph tags,
 * canonical URL, and JSON-LD structured data.
 *
 * The injection is path-based (no DB queries at this layer) and is therefore
 * fast enough to run synchronously on every non-API GET request.
 */

const SITE_URL = (process.env.SITE_URL || "https://smartseek.com").replace(/\/$/, "");
const SITE_NAME = "SmartSeek";
const DEFAULT_OG_IMAGE = `${SITE_URL}/opengraph.jpg`;

// ─── Popular supplier categories (used in sitemap + JSON-LD breadcrumbs) ─────
// Slugs must stay in sync with client/src/pages/SuppliersIndex.tsx.
export const SUPPLIER_CATEGORIES = [
  // Strategic metals & critical minerals
  "antimony",
  "tungsten",
  "tin",
  "lithium-batteries",
  "rare-earths",
  // Base metals
  "copper-cathode",
  "aluminum",
  "steel",
  // Industrial verticals
  "electronics",
  "machinery",
  "chemicals",
  "automotive-parts",
  "plastics",
  // Materials & inputs
  "textiles",
  "cotton-fabric",
  "food-ingredients",
  "pharmaceutical-api",
];

// Public top-level routes — used by sitemap.xml.
export const PUBLIC_STATIC_ROUTES = [
  "/",
  "/search",
  "/suppliers",
  "/rfq",
  "/rfq-status",
  "/become-a-supplier",
  "/trust",
  "/verification",
  "/methodology",
  "/pricing",
  "/about",
  "/contact",
  "/faq",
  "/privacy",
  "/terms",
  "/integrations",
];

// ─── Types ────────────────────────────────────────────────────────────────────

interface MetaConfig {
  title: string;
  description: string;
  canonical: string;
  ogImage?: string;
  jsonLd?: object[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function slugToTitle(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function esc(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// ─── Route → meta map ─────────────────────────────────────────────────────────

function getMetaForPath(pathname: string): MetaConfig {
  const base = pathname.split("?")[0].replace(/\/$/, "") || "/";

  const staticMeta: Record<string, Omit<MetaConfig, "canonical">> = {
    "/": {
      title: `${SITE_NAME} – Strategic Sourcing Intelligence for Procurement Teams`,
      description:
        "Discover verified suppliers, run structured RFQs, and source strategic metals and industrial inputs with confidence.",
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE_NAME,
          url: SITE_URL,
          potentialAction: {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
            },
            "query-input": "required name=search_term_string",
          },
        },
        {
          "@context": "https://schema.org",
          "@type": "Organization",
          name: SITE_NAME,
          url: SITE_URL,
          logo: `${SITE_URL}/logo.png`,
          description:
            "Strategic sourcing intelligence and supplier discovery platform for industrial procurement teams.",
          sameAs: [`https://twitter.com/smartseek`],
        },
      ],
    },
    "/register": {
      title: `Register – ${SITE_NAME} Beta Access`,
      description:
        "Create your SmartSeek beta account to access supplier discovery, RFQ workflows, and procurement onboarding.",
    },
    "/pricing": {
      title: `Beta Access – ${SITE_NAME}`,
      description:
        "SmartSeek is free during beta. Request access for supplier discovery and strategic sourcing workflows.",
    },
    "/about": {
      title: `About ${SITE_NAME} – Strategic Sourcing Platform`,
      description:
        "Learn how SmartSeek helps procurement teams discover verified suppliers and run operator-led RFQ workflows.",
    },
    "/faq": {
      title: `FAQ – ${SITE_NAME}`,
      description:
        "Common questions about SmartSeek's supplier discovery, verification standards, and RFQ workflows.",
    },
    "/contact": {
      title: `Contact ${SITE_NAME}`,
      description:
        "Get in touch with the SmartSeek team for enterprise inquiries, partnerships, or platform support.",
    },
    "/signup": {
      title: `Sign Up – ${SITE_NAME} Beta`,
      description:
        "Create a SmartSeek beta account for strategic sourcing, supplier discovery, and RFQ management.",
    },
    "/login": {
      title: `Login – ${SITE_NAME}`,
      description:
        "Log in to SmartSeek to manage supplier discovery, RFQs, and procurement workflows.",
    },
    "/search": {
      title: `Search Suppliers – ${SITE_NAME}`,
      description:
        "Search curated, registry-verified suppliers by commodity, region, and industrial category. No login required.",
    },
    "/sample-report": {
      title: `Sample Supplier Intelligence Report – ${SITE_NAME}`,
      description:
        "See what a full SmartSeek supplier intelligence report looks like — risk scores, certifications, landed cost analysis, and more.",
    },
    "/integrations": {
      title: `Integrations – ${SITE_NAME}`,
      description:
        "Connect SmartSeek to your existing procurement stack. Integrations with SAP Ariba, Salesforce, Oracle, Coupa, and more.",
    },
    "/privacy": {
      title: `Privacy Policy – ${SITE_NAME}`,
      description:
        "Review how SmartSeek handles account, supplier discovery, and RFQ data during beta.",
    },
    "/terms": {
      title: `Terms of Service – ${SITE_NAME}`,
      description:
        "Read SmartSeek terms for using supplier discovery and RFQ workflows.",
    },
    "/become-a-supplier": {
      title: `Become a Supplier – ${SITE_NAME}`,
      description:
        "Apply to list your company on SmartSeek and receive relevant RFQ opportunities from procurement teams.",
    },
    "/trust": {
      title: `Trust & Verification – ${SITE_NAME}`,
      description:
        "See how SmartSeek verifies suppliers, routes RFQs, and avoids marketplace spam.",
    },
    "/verification": {
      title: `Verification Standards – ${SITE_NAME}`,
      description:
        "Understand SmartSeek supplier verification tiers and evidence requirements.",
    },
    "/methodology": {
      title: `Sourcing Methodology – ${SITE_NAME}`,
      description:
        "See how SmartSeek operators screen and route RFQs to qualified suppliers.",
    },
    "/rfq": {
      title: `Create RFQ – ${SITE_NAME}`,
      description:
        "Submit a sourcing request and SmartSeek operators route it to verified suppliers with structured quote responses.",
    },
    "/rfq/new": {
      title: `Create RFQ – ${SITE_NAME}`,
      description:
        "Submit a sourcing request and SmartSeek operators route it to verified suppliers with structured quote responses.",
    },
    "/rfq-status": {
      title: `RFQ status – ${SITE_NAME}`,
      description:
        "Check the status of your SmartSeek RFQ. Enter your RFQ ID and submission email.",
    },
    "/suppliers": {
      title: `Supplier directory by category – ${SITE_NAME}`,
      description:
        "Browse curated, registry-verified suppliers by commodity: antimony, tungsten, tin, copper, lithium, rare earths, steel, and more.",
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
            { "@type": "ListItem", position: 2, name: "Suppliers", item: `${SITE_URL}/suppliers` },
          ],
        },
        {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Supplier categories on SmartSeek",
          itemListElement: SUPPLIER_CATEGORIES.map((slug, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: `${slugToTitle(slug)} suppliers`,
            url: `${SITE_URL}/suppliers/${slug}`,
          })),
        },
      ],
    },
  };

  if (staticMeta[base]) {
    return { canonical: `${SITE_URL}${base}`, ...staticMeta[base] };
  }

  // Dynamic supplier category pages: /suppliers/:category
  const catMatch = base.match(/^\/suppliers\/(.+)$/);
  if (catMatch) {
    const slug = catMatch[1];
    const displayName = slugToTitle(slug);
    return {
      title: `${displayName} suppliers – registry-verified manufacturers | ${SITE_NAME}`,
      description: `Curated ${displayName.toLowerCase()} suppliers on SmartSeek. Registry-verified manufacturers and traders, with operator-led RFQ routing.`,
      canonical: `${SITE_URL}/suppliers/${slug}`,
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
            { "@type": "ListItem", position: 2, name: "Suppliers", item: `${SITE_URL}/suppliers` },
            { "@type": "ListItem", position: 3, name: displayName, item: `${SITE_URL}/suppliers/${slug}` },
          ],
        },
        {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `${displayName} suppliers`,
          description: `Registry-verified ${displayName.toLowerCase()} suppliers curated on SmartSeek.`,
          url: `${SITE_URL}/suppliers/${slug}`,
          isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
        },
      ],
    };
  }

  // Default fallback for any other path
  return {
    title: `${SITE_NAME} – Strategic sourcing intelligence`,
    description:
      "SmartSeek is a curated supplier discovery and operator-led RFQ platform for strategic metals and industrial inputs.",
    canonical: `${SITE_URL}${base}`,
  };
}

// ─── Build the injectable HTML block ─────────────────────────────────────────

function buildMetaHtml(meta: MetaConfig): string {
  const ogImage = meta.ogImage || DEFAULT_OG_IMAGE;
  const lines: string[] = [
    `<title>${esc(meta.title)}</title>`,
    `<meta name="description" content="${esc(meta.description)}" />`,
    `<meta property="og:title" content="${esc(meta.title)}" />`,
    `<meta property="og:description" content="${esc(meta.description)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:url" content="${esc(meta.canonical)}" />`,
    `<meta property="og:image" content="${esc(ogImage)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:site" content="@smartseek" />`,
    `<meta name="twitter:title" content="${esc(meta.title)}" />`,
    `<meta name="twitter:description" content="${esc(meta.description)}" />`,
    `<meta name="twitter:image" content="${esc(ogImage)}" />`,
    `<link rel="canonical" href="${esc(meta.canonical)}" />`,
  ];

  if (meta.jsonLd?.length) {
    for (const ld of meta.jsonLd) {
      lines.push(`<script type="application/ld+json">${JSON.stringify(ld)}</script>`);
    }
  }

  return lines.join("\n    ");
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Replace the <!-- SEO_META_INJECT --> placeholder in index.html with
 * path-specific title, meta, canonical, and JSON-LD tags.
 */
export function injectSeoMeta(html: string, pathname: string): string {
  const meta = getMetaForPath(pathname);
  const block = buildMetaHtml(meta);
  return html.replace("<!-- SEO_META_INJECT -->", block);
}
