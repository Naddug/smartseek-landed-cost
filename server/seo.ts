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

const SITE_URL = (process.env.SITE_URL || "https://smartseek.io").replace(/\/$/, "");
const SITE_NAME = "SmartSeek";
const DEFAULT_OG_IMAGE = `${SITE_URL}/opengraph.jpg`;

// ─── Popular supplier categories (used in sitemap + JSON-LD breadcrumbs) ─────
export const SUPPLIER_CATEGORIES = [
  "copper-cathode",
  "lithium-batteries",
  "antimony",
  "solar-panels",
  "cotton-fabric",
  "olive-oil",
  "pharmaceutical-api",
  "steel",
  "aluminum",
  "electronics",
  "textiles",
  "chemicals",
  "food-ingredients",
  "plastics",
  "machinery",
  "automotive-parts",
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
      title: `${SITE_NAME} – Find Real Suppliers Anywhere in the World`,
      description:
        "Search manufacturers, exporters and verified suppliers instantly. SmartSeek is Google for Suppliers — 220+ countries, AI-powered sourcing intelligence.",
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
            "Global supplier discovery platform connecting buyers with verified manufacturers and exporters across 220+ countries.",
          sameAs: [`https://twitter.com/smartsekai`],
        },
      ],
    },
    "/pricing": {
      title: `Pricing – ${SITE_NAME} Supplier Discovery`,
      description:
        "Start for free. Access verified global suppliers with SmartSeek's flexible pricing plans. No credit card required to begin searching.",
    },
    "/about": {
      title: `About ${SITE_NAME} – Google for Suppliers`,
      description:
        "SmartSeek helps procurement teams find verified manufacturers and exporters globally. Learn how we make supplier discovery instant and reliable.",
    },
    "/faq": {
      title: `FAQ – ${SITE_NAME} Supplier Platform`,
      description:
        "Common questions about SmartSeek's supplier discovery, verification standards, pricing, and AI trade intelligence features.",
    },
    "/contact": {
      title: `Contact ${SITE_NAME}`,
      description:
        "Get in touch with the SmartSeek team for enterprise inquiries, partnerships, or platform support.",
    },
    "/signup": {
      title: `Sign Up Free – ${SITE_NAME} Supplier Discovery`,
      description:
        "Create a free SmartSeek account and start discovering verified global suppliers instantly. No credit card required.",
    },
    "/login": {
      title: `Login – ${SITE_NAME}`,
      description:
        "Log in to SmartSeek to access your supplier search, trade leads, and AI-powered sourcing intelligence tools.",
    },
    "/search": {
      title: `Search Suppliers – ${SITE_NAME}`,
      description:
        "Search verified manufacturers and exporters worldwide. Find real suppliers by product, industry, or region. No login required.",
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
    "/rfq": {
      title: `Request a Quote – ${SITE_NAME}`,
      description:
        "Send a sourcing request to multiple verified suppliers at once. SmartSeek routes your RFQ to the best-matched manufacturers.",
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
      title: `${displayName} Suppliers – Find Verified Manufacturers | ${SITE_NAME}`,
      description: `Discover verified ${displayName.toLowerCase()} suppliers worldwide. Compare manufacturers and exporters instantly on SmartSeek.`,
      canonical: `${SITE_URL}/suppliers/${slug}`,
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
            { "@type": "ListItem", position: 2, name: "Suppliers", item: `${SITE_URL}/search` },
            { "@type": "ListItem", position: 3, name: displayName, item: `${SITE_URL}/suppliers/${slug}` },
          ],
        },
        {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `${displayName} Suppliers`,
          description: `Verified ${displayName.toLowerCase()} manufacturers and exporters on SmartSeek`,
          url: `${SITE_URL}/suppliers/${slug}`,
          isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
        },
      ],
    };
  }

  // Default fallback for any other path
  return {
    title: `${SITE_NAME} – Global Supplier Discovery`,
    description:
      "Find real suppliers anywhere in the world. Search manufacturers, exporters and verified suppliers instantly with SmartSeek.",
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
    `<meta name="twitter:site" content="@smartsekai" />`,
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
