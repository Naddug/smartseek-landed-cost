/**
 * Website Crawler — Company Enrichment
 *
 * Input:  domain (e.g. "acme.com" or "https://acme.com")
 * Output: emails, linkedin profiles, addresses, phones, keywords
 * Store:  company_enrichments table (Prisma)
 *
 * Architecture:
 *   BFS queue — crawls up to `maxPages` same-domain pages.
 *   Uses native fetch (Node 18+) for HTTP and cheerio for HTML parsing.
 *   No Playwright — plain HTTP is fast enough for most company sites.
 *   Falls back gracefully: timeouts skip pages, partial data is still saved.
 *
 * Usage:
 *   import { crawlDomain, getCrawlResult } from "./websiteCrawler";
 *   const result = await crawlDomain("acme.com");
 */

import * as cheerio from "cheerio";
import { prisma } from "../../lib/prisma.js";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CrawlOptions {
  /** Maximum number of pages to visit (default 20) */
  maxPages?: number;
  /** Per-request timeout in ms (default 8000) */
  timeout?: number;
  /** Delay between requests in ms — be polite (default 300) */
  delay?: number;
  /** Follow links beyond the home page (default true) */
  followLinks?: boolean;
  /** User-agent header */
  userAgent?: string;
}

export interface PageData {
  url: string;
  emails: string[];
  linkedins: string[];
  phones: string[];
  addresses: string[];
  keywords: string[];
}

export interface CrawlResult {
  domain: string;
  emails: string[];
  linkedins: string[];
  phones: string[];
  addresses: string[];
  keywords: string[];
  pagesVisited: number;
  pages: PageData[];
  crawledAt: Date;
}

// ─── Regex patterns ────────────────────────────────────────────────────────────

const EMAIL_RE =
  /\b[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}\b/g;

const PHONE_RE =
  /(?:\+?[\d\s\-().]{7,}(?:ext\.?\s*\d{1,5})?)/g;

// Stricter phone validator — must contain at least 7 consecutive digits
const PHONE_DIGITS_RE = /\d[\d\s\-().]{5,}\d/;

const LINKEDIN_RE =
  /https?:\/\/(?:www\.)?linkedin\.com\/(in|company|organization)\/[a-zA-Z0-9_\-%]+\/?/g;

// High-noise emails to ignore
const EMAIL_BLOCKLIST = new Set([
  "example.com",
  "domain.com",
  "yourdomain.com",
  "email.com",
  "sentry.io",
  "sampleemail.com",
]);

// ─── Priority page paths — always try these first ─────────────────────────────

const PRIORITY_PATHS = [
  "/",
  "/contact",
  "/contact-us",
  "/about",
  "/about-us",
  "/team",
  "/company",
  "/imprint",
  "/impressum",
  "/legal",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function normaliseDomain(input: string): string {
  let s = input.trim().toLowerCase();
  if (!s.startsWith("http")) s = "https://" + s;
  try {
    return new URL(s).hostname.replace(/^www\./, "");
  } catch {
    return s.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0];
  }
}

function toAbsolute(href: string, base: URL): string | null {
  if (!href || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("#")) return null;
  try {
    return new URL(href, base).href;
  } catch {
    return null;
  }
}

function isSameDomain(url: string, domain: string): boolean {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    return host === domain || host.endsWith("." + domain);
  } catch {
    return false;
  }
}

function dedup<T>(arr: T[]): T[] {
  return [...new Set(arr)];
}

function sleep(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms));
}

// ─── Extractors ───────────────────────────────────────────────────────────────

function extractEmails(html: string, $: cheerio.CheerioAPI): string[] {
  const found = new Set<string>();

  // mailto: links
  $("a[href^='mailto:']").each((_, el) => {
    const raw = $(el).attr("href")?.replace("mailto:", "").split("?")[0].trim();
    if (raw) found.add(raw.toLowerCase());
  });

  // Text content regex
  const text = $.root().text();
  const matches = text.match(EMAIL_RE) ?? [];
  for (const m of matches) found.add(m.toLowerCase());

  // Also scan raw HTML for obfuscated emails
  const htmlMatches = html.match(EMAIL_RE) ?? [];
  for (const m of htmlMatches) found.add(m.toLowerCase());

  // Filter blocklist and placeholder-looking emails
  return [...found].filter(e => {
    const domain = e.split("@")[1];
    if (!domain) return false;
    if (EMAIL_BLOCKLIST.has(domain)) return false;
    if (e.includes("..")) return false;
    return true;
  });
}

function extractLinkedins(html: string, $: cheerio.CheerioAPI): string[] {
  const found = new Set<string>();

  $("a[href*='linkedin.com']").each((_, el) => {
    const href = $(el).attr("href");
    if (href) {
      const matches = href.match(LINKEDIN_RE) ?? [];
      for (const m of matches) found.add(m.replace(/\/$/, ""));
    }
  });

  const htmlMatches = html.match(LINKEDIN_RE) ?? [];
  for (const m of htmlMatches) found.add(m.replace(/\/$/, ""));

  return [...found];
}

function extractPhones(html: string, $: cheerio.CheerioAPI): string[] {
  const found = new Set<string>();

  // tel: links — most reliable
  $("a[href^='tel:']").each((_, el) => {
    const raw = $(el).attr("href")?.replace("tel:", "").trim();
    if (raw) found.add(raw);
  });

  // schema.org telephone
  $("[itemprop='telephone']").each((_, el) => {
    const t = $(el).text().trim() || $(el).attr("content") || "";
    if (t) found.add(t);
  });

  // JSON-LD
  $("script[type='application/ld+json']").each((_, el) => {
    try {
      const data = JSON.parse($(el).html() ?? "{}") as Record<string, unknown>;
      const phone = (data.telephone ?? (data.contactPoint as Record<string, unknown>)?.telephone) as string | undefined;
      if (phone) found.add(String(phone).trim());
    } catch { /* skip */ }
  });

  // Regex on text — noisy, filter aggressively
  const text = $.root().text();
  const candidates = text.match(PHONE_RE) ?? [];
  for (const c of candidates) {
    const cleaned = c.trim();
    if (PHONE_DIGITS_RE.test(cleaned) && cleaned.replace(/\D/g, "").length >= 7) {
      found.add(cleaned);
    }
  }

  return dedup(
    [...found]
      .map(p => p.replace(/\s{2,}/g, " ").trim())
      .filter(p => p.replace(/\D/g, "").length >= 7)
  ).slice(0, 10); // cap at 10 to avoid noise
}

function extractAddresses($: cheerio.CheerioAPI): string[] {
  const found = new Set<string>();

  // HTML <address> tag
  $("address").each((_, el) => {
    const text = $(el).text().replace(/\s+/g, " ").trim();
    if (text.length > 5) found.add(text);
  });

  // schema.org PostalAddress — JSON-LD
  $("script[type='application/ld+json']").each((_, el) => {
    try {
      const data = JSON.parse($(el).html() ?? "{}") as Record<string, unknown>;
      const items: unknown[] = Array.isArray(data) ? data : [data];
      for (const item of items) {
        const d = item as Record<string, unknown>;
        const addr = d.address as Record<string, string> | undefined;
        if (addr) {
          const parts = [
            addr.streetAddress,
            addr.addressLocality,
            addr.addressRegion,
            addr.postalCode,
            addr.addressCountry,
          ].filter(Boolean);
          if (parts.length >= 2) found.add(parts.join(", "));
        }
        // Also check location
        const loc = d.location as Record<string, unknown> | undefined;
        if (loc?.address) {
          const la = loc.address as Record<string, string>;
          const parts = [la.streetAddress, la.addressLocality, la.postalCode, la.addressCountry].filter(Boolean);
          if (parts.length >= 2) found.add(parts.join(", "));
        }
      }
    } catch { /* skip */ }
  });

  // schema.org microdata
  $("[itemprop='streetAddress']").each((_, el) => {
    const street = $(el).text().trim() || $(el).attr("content") || "";
    if (!street) return;
    const parent = $(el).closest("[itemtype*='PostalAddress']");
    const locality = parent.find("[itemprop='addressLocality']").first().text().trim();
    const country  = parent.find("[itemprop='addressCountry']").first().text().trim();
    const postal   = parent.find("[itemprop='postalCode']").first().text().trim();
    const parts = [street, locality, postal, country].filter(Boolean);
    if (parts.length >= 2) found.add(parts.join(", "));
  });

  // Common class/id patterns
  const selectors = [
    "[class*='address']:not(script):not(style)",
    "[class*='location']:not(script):not(style)",
    "[id*='address']",
    "[id*='location']",
    ".contact-info",
    ".contact-details",
    ".office-address",
    ".hq-address",
  ];
  for (const sel of selectors) {
    $(sel).each((_, el) => {
      const text = $(el).text().replace(/\s+/g, " ").trim();
      // Must look like an address — contain digits and letters
      if (text.length > 10 && text.length < 300 && /\d/.test(text) && /[a-zA-Z]/.test(text)) {
        found.add(text);
      }
    });
  }

  return [...found].slice(0, 5);
}

function extractKeywords($: cheerio.CheerioAPI, domain: string): string[] {
  const found = new Set<string>();

  // meta keywords
  const metaKw = $("meta[name='keywords']").attr("content") ?? "";
  for (const kw of metaKw.split(",").map(k => k.trim().toLowerCase()).filter(Boolean)) {
    found.add(kw);
  }

  // meta description words
  const metaDesc = $("meta[name='description']").attr("content") ?? "";
  for (const word of metaDesc.split(/\s+/).map(w => w.replace(/[^a-zA-Z]/g, "").toLowerCase()).filter(w => w.length > 4)) {
    found.add(word);
  }

  // title
  const title = $("title").text().replace(/[-|·–]/g, " ").replace(/\s+/g, " ").trim();
  for (const word of title.split(" ").map(w => w.replace(/[^a-zA-Z]/g, "").toLowerCase()).filter(w => w.length > 3)) {
    found.add(word);
  }

  // h1, h2
  $("h1, h2").each((_, el) => {
    const text = $(el).text().replace(/\s+/g, " ").trim().toLowerCase();
    for (const word of text.split(" ").map(w => w.replace(/[^a-zA-Z]/g, "")).filter(w => w.length > 4)) {
      found.add(word);
    }
  });

  // og:description
  const ogDesc = $("meta[property='og:description']").attr("content") ?? "";
  for (const word of ogDesc.split(/\s+/).map(w => w.replace(/[^a-zA-Z]/g, "").toLowerCase()).filter(w => w.length > 4)) {
    found.add(word);
  }

  // Remove the domain name itself and common stopwords
  const stopwords = new Set(["about", "company", "contact", "their", "which", "these", "those", "other", "there", "where", "could", "would", "should", "https", "http"]);
  const domainParts = new Set(domain.replace(/\..+$/, "").split(/[.\-_]/));
  return [...found]
    .filter(w => !stopwords.has(w) && !domainParts.has(w))
    .slice(0, 50);
}

// ─── Page fetcher ─────────────────────────────────────────────────────────────

async function fetchPage(
  url: string,
  opts: { timeout: number; userAgent: string }
): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), opts.timeout);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": opts.userAgent,
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
      redirect: "follow",
    });
    clearTimeout(timer);
    if (!res.ok) return null;
    const ct = res.headers.get("content-type") ?? "";
    if (!ct.includes("html")) return null;
    return await res.text();
  } catch {
    return null;
  }
}

// ─── Per-page extractor ───────────────────────────────────────────────────────

function parsePage(html: string, url: string): PageData {
  const $ = cheerio.load(html);

  // Remove noisy elements before extracting text
  $("script:not([type='application/ld+json']), style, noscript, svg, iframe, nav, footer").remove();

  return {
    url,
    emails:    extractEmails(html, $),
    linkedins: extractLinkedins(html, $),
    phones:    extractPhones(html, $),
    addresses: extractAddresses($),
    keywords:  [],              // collected at domain level only
  };
}

function extractPageLinks(html: string, base: URL, domain: string): string[] {
  const $ = cheerio.load(html);
  const links: string[] = [];
  $("a[href]").each((_, el) => {
    const href = $(el).attr("href") ?? "";
    const abs = toAbsolute(href, base);
    if (abs && isSameDomain(abs, domain)) {
      // Skip obvious non-content paths
      if (/\.(pdf|jpg|jpeg|png|gif|svg|ico|css|js|xml|txt|zip|doc|xls)(\?|$)/i.test(abs)) return;
      if (/#/.test(abs)) return;
      links.push(abs.split("#")[0].split("?")[0]);
    }
  });
  return dedup(links);
}

// ─── Core crawler ─────────────────────────────────────────────────────────────

export async function crawlDomain(
  domainOrUrl: string,
  opts: CrawlOptions = {}
): Promise<CrawlResult> {
  const {
    maxPages    = 20,
    timeout     = 8_000,
    delay       = 300,
    followLinks = true,
    userAgent   = "Mozilla/5.0 (compatible; SmartSeekBot/1.0; +https://smartseek.io)",
  } = opts;

  const domain = normaliseDomain(domainOrUrl);
  const baseUrl = `https://${domain}`;

  const visited = new Set<string>();
  const queue: string[] = [];
  const pages: PageData[] = [];

  // Seed queue with priority paths then discover more via BFS
  for (const path of PRIORITY_PATHS) {
    queue.push(baseUrl + path);
  }

  const fetchOpts = { timeout, userAgent };

  while (queue.length > 0 && visited.size < maxPages) {
    const url = queue.shift()!;
    if (visited.has(url)) continue;
    visited.add(url);

    const html = await fetchPage(url, fetchOpts);
    if (!html) {
      if (visited.size > 1) await sleep(delay);
      continue;
    }

    const base = new URL(url);
    const pageData = parsePage(html, url);

    // Keywords extracted once from home page
    if (visited.size === 1) {
      const $ = cheerio.load(html);
      pageData.keywords = extractKeywords($, domain);
    }

    pages.push(pageData);

    if (followLinks && visited.size < maxPages) {
      const links = extractPageLinks(html, base, domain);
      for (const link of links) {
        if (!visited.has(link) && !queue.includes(link)) {
          queue.push(link);
        }
      }
    }

    await sleep(delay);
  }

  // Aggregate across all pages
  const allEmails    = dedup(pages.flatMap(p => p.emails));
  const allLinkedins = dedup(pages.flatMap(p => p.linkedins));
  const allPhones    = dedup(pages.flatMap(p => p.phones));
  const allAddresses = dedup(pages.flatMap(p => p.addresses));
  const allKeywords  = dedup(pages.flatMap(p => p.keywords));

  return {
    domain,
    emails:       allEmails,
    linkedins:    allLinkedins,
    phones:       allPhones,
    addresses:    allAddresses,
    keywords:     allKeywords,
    pagesVisited: pages.length,
    pages,
    crawledAt:    new Date(),
  };
}

// ─── DB persistence ───────────────────────────────────────────────────────────

export async function crawlAndSave(
  domainOrUrl: string,
  opts: CrawlOptions & { companyId?: string } = {}
): Promise<CrawlResult> {
  const { companyId, ...crawlOpts } = opts;
  const result = await crawlDomain(domainOrUrl, crawlOpts);

  await prisma.companyEnrichment.upsert({
    where:  { domain: result.domain },
    update: {
      emails:       result.emails,
      linkedins:    result.linkedins,
      phones:       result.phones,
      addresses:    result.addresses,
      keywords:     result.keywords,
      pagesVisited: result.pagesVisited,
      crawledAt:    result.crawledAt,
      rawData:      result.pages as unknown as object,
      ...(companyId ? { companyId } : {}),
    },
    create: {
      domain:       result.domain,
      emails:       result.emails,
      linkedins:    result.linkedins,
      phones:       result.phones,
      addresses:    result.addresses,
      keywords:     result.keywords,
      pagesVisited: result.pagesVisited,
      crawledAt:    result.crawledAt,
      rawData:      result.pages as unknown as object,
      ...(companyId ? { companyId } : {}),
    },
  });

  return result;
}

// ─── Read back saved enrichment ───────────────────────────────────────────────

export async function getCrawlResult(domain: string) {
  const d = normaliseDomain(domain);
  return prisma.companyEnrichment.findUnique({ where: { domain: d } });
}

export async function listEnrichments(opts: { skip?: number; take?: number } = {}) {
  return prisma.companyEnrichment.findMany({
    orderBy: { crawledAt: "desc" },
    skip: opts.skip ?? 0,
    take: opts.take ?? 50,
    select: {
      id: true,
      domain: true,
      companyId: true,
      emails: true,
      linkedins: true,
      phones: true,
      addresses: true,
      keywords: true,
      pagesVisited: true,
      crawledAt: true,
      createdAt: true,
    },
  });
}
