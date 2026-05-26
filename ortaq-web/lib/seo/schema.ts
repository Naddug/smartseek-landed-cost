import { FAQ_ITEMS } from "./faq";
import { GLOSSARY_TERMS } from "./glossary";
import { site } from "@/lib/metadata";

const ORG_ID = `${site.url}/#organization`;
const WEBSITE_ID = `${site.url}/#website`;

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: site.name,
    url: site.url,
    description: site.defaultDescription,
    areaServed: { "@type": "Country", name: "Turkey" },
  };
}

export function webSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: site.name,
    url: site.url,
    inLanguage: "tr-TR",
    publisher: { "@id": ORG_ID },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${site.url}${item.path}`,
    })),
  };
}

export function faqPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };
}

export function definedTermSetSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: "ORTAQ paya dayalı ortaklık sözlüğü",
    inLanguage: "tr-TR",
    hasDefinedTerm: GLOSSARY_TERMS.map((t) => ({
      "@type": "DefinedTerm",
      name: t.term,
      description: t.definition,
      inDefinedTermSet: `${site.url}/sozluk`,
    })),
  };
}

type HowToStep = { name: string; text: string };

export function howToSchema(name: string, description: string, steps: HowToStep[]) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description,
    inLanguage: "tr-TR",
    step: steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };
}

export function webPageSchema(title: string, description: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: `${site.url}${path}`,
    inLanguage: "tr-TR",
    isPartOf: { "@id": WEBSITE_ID },
    publisher: { "@id": ORG_ID },
  };
}

/** Company/campaign page — illustrative only, no fake Product schema */
export function illustrativeCampaignSchema(slug: string, title: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: `${site.url}/sirket/${slug}`,
    inLanguage: "tr-TR",
    specialty: "illustrative-example",
    isPartOf: { "@id": WEBSITE_ID },
  };
}
