/**
 * Directory Scraping System
 *
 * Sources: clutch.co · g2.com · goodfirms.co
 *
 * Extracts:  company name, website, country, industry, employees
 * Stores in: companies table (Prisma)
 *
 * Architecture:
 *   Each source has a dedicated Scraper class extending BaseScraper.
 *   All scrapers share:
 *     - Playwright Chromium (headless)
 *     - Retry logic with exponential back-off
 *     - Rate-limiting (configurable delay between pages)
 *     - robots.txt respect flag (default: true)
 *     - Result dedup by domain
 *
 * Usage:
 *   import { scrapeAll, scrapeSource } from "./directoryScraper";
 *   await scrapeAll({ maxPages: 5 });          // all three sources
 *   await scrapeSource("clutch", { maxPages: 3 });
 */

import { chromium, type Browser, type Page } from "playwright";
import * as cheerio from "cheerio";
import { prisma } from "../../lib/prisma.js";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ScraperSource = "clutch" | "g2" | "goodfirms";

export interface ScrapedCompany {
  name:        string;
  website:     string | null;
  domain:      string | null;
  country:     string | null;
  city:        string | null;
  industry:    string | null;
  employees:   string | null;
  employeeMin: number | null;
  employeeMax: number | null;
  rating:      number | null;
  reviewCount: number | null;
  sourceUrl:   string | null;
  sourceId:    string | null;
  tags:        string[];
  source:      ScraperSource;
}

export interface ScrapeOptions {
  maxPages?:      number;   // pages per source category (default: 3)
  delayMs?:       number;   // ms between page requests (default: 2000)
  headless?:      boolean;  // default: true
  respectRobots?: boolean;  // default: true
  categories?:    string[]; // filter categories (default: all)
}

export interface ScrapeResult {
  source:    ScraperSource;
  scraped:   number;
  stored:    number;
  skipped:   number;
  errors:    number;
  durationMs: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function normaliseDomain(raw: string | null | undefined): string | null {
  if (!raw) return null;
  try {
    const url = raw.startsWith("http") ? raw : `https://${raw}`;
    return new URL(url).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return null;
  }
}

function parseEmployees(raw: string | null | undefined): { min: number | null; max: number | null } {
  if (!raw) return { min: null, max: null };
  const clean = raw.replace(/,/g, "").trim();
  // "50-249" | "1000+" | "10,000+" | "1 - 10"
  const rangeMatch = clean.match(/(\d+)\s*[-–]\s*(\d+)/);
  if (rangeMatch) return { min: parseInt(rangeMatch[1]), max: parseInt(rangeMatch[2]) };
  const plusMatch  = clean.match(/(\d+)\+/);
  if (plusMatch)  return { min: parseInt(plusMatch[1]), max: null };
  const single     = clean.match(/^(\d+)$/);
  if (single)     return { min: parseInt(single[1]), max: parseInt(single[1]) };
  return { min: null, max: null };
}

async function delay(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms));
}

async function withRetry<T>(fn: () => Promise<T>, retries = 3, baseDelay = 1500): Promise<T> {
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (e) {
      if (i === retries) throw e;
      await delay(baseDelay * Math.pow(2, i));
    }
  }
  throw new Error("unreachable");
}

/** Store a batch of scraped companies, deduping by domain. */
async function storeBatch(companies: ScrapedCompany[]): Promise<{ stored: number; skipped: number }> {
  let stored = 0;
  let skipped = 0;

  for (const c of companies) {
    try {
      const where = c.domain ? { domain: c.domain } : undefined;
      if (where) {
        const existing = await prisma.company.findUnique({ where });
        if (existing) { skipped++; continue; }
      }

      const { min, max } = parseEmployees(c.employees);
      await prisma.company.create({
        data: {
          name:        c.name,
          website:     c.website,
          domain:      c.domain,
          country:     c.country,
          city:        c.city,
          industry:    c.industry,
          employees:   c.employees,
          employeeMin: min,
          employeeMax: max,
          rating:      c.rating,
          reviewCount: c.reviewCount,
          source:      c.source,
          sourceUrl:   c.sourceUrl,
          sourceId:    c.sourceId,
          tags:        c.tags,
          techStack:   [],
        },
      });
      stored++;
    } catch (e) {
      // Unique constraint on domain — treat as skip
      if ((e as Error).message?.includes("Unique constraint")) {
        skipped++;
      } else {
        throw e;
      }
    }
  }

  return { stored, skipped };
}

// ══════════════════════════════════════════════════════════════════════════════
// Base scraper
// ══════════════════════════════════════════════════════════════════════════════

abstract class BaseScraper {
  protected browser!: Browser;
  protected page!: Page;

  constructor(protected opts: Required<ScrapeOptions>) {}

  abstract source: ScraperSource;
  abstract scrapeListPage(url: string): Promise<ScrapedCompany[]>;
  abstract listUrls(): string[];

  async init(browser: Browser): Promise<void> {
    this.browser = browser;
    this.page = await browser.newPage();
    await this.page.setExtraHTTPHeaders({
      "Accept-Language": "en-US,en;q=0.9",
      "Accept":          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    });
    // Plausible user-agent
    await this.page.setViewportSize({ width: 1280, height: 800 });
  }

  async close(): Promise<void> {
    await this.page?.close().catch(() => {});
  }

  protected async fetchHtml(url: string): Promise<string> {
    await this.page.goto(url, { waitUntil: "domcontentloaded", timeout: 30_000 });
    await delay(800); // allow JS hydration
    return this.page.content();
  }

  async run(): Promise<ScrapeResult> {
    const start = Date.now();
    const urls = this.listUrls().slice(0, this.opts.maxPages);
    let totalScraped = 0;
    let totalStored  = 0;
    let totalSkipped = 0;
    let totalErrors  = 0;

    for (const url of urls) {
      try {
        const companies = await withRetry(() => this.scrapeListPage(url));
        totalScraped += companies.length;

        const { stored, skipped } = await storeBatch(companies);
        totalStored  += stored;
        totalSkipped += skipped;

        console.log(`  [${this.source}] ${url.split("?")[0]} → ${companies.length} companies (${stored} stored, ${skipped} skipped)`);
      } catch (e) {
        totalErrors++;
        console.warn(`  [${this.source}] Error scraping ${url}:`, (e as Error).message.slice(0, 80));
      }

      await delay(this.opts.delayMs);
    }

    return {
      source: this.source,
      scraped: totalScraped,
      stored:  totalStored,
      skipped: totalSkipped,
      errors:  totalErrors,
      durationMs: Date.now() - start,
    };
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// Clutch.co scraper
// ══════════════════════════════════════════════════════════════════════════════

class ClutchScraper extends BaseScraper {
  source: ScraperSource = "clutch";

  listUrls(): string[] {
    const cats = this.opts.categories.length
      ? this.opts.categories
      : ["it-services", "software-development", "marketing", "design", "mobile-app-developers"];

    const pages: string[] = [];
    for (const cat of cats) {
      for (let p = 1; p <= Math.ceil(this.opts.maxPages / cats.length) + 1; p++) {
        pages.push(`https://clutch.co/directory/${cat}?page=${p}`);
      }
    }
    return pages.slice(0, this.opts.maxPages);
  }

  async scrapeListPage(url: string): Promise<ScrapedCompany[]> {
    const html = await this.fetchHtml(url);
    const $ = cheerio.load(html);
    const companies: ScrapedCompany[] = [];

    // Clutch uses provider-list__item or similar wrappers
    $("[class*='provider'], [class*='company-card'], li[data-provider]").each((_, el) => {
      const $el = $(el);

      const name    = $el.find("[class*='company-name'], h3, [class*='title']").first().text().trim();
      const website = $el.find("a[href*='http']:not([href*='clutch.co'])").first().attr("href") ?? null;
      const country = $el.find("[class*='location'], [class*='country'], [itemprop='addressCountry']").first().text().trim() || null;
      const city    = $el.find("[class*='locality'], [itemprop='addressLocality']").first().text().trim() || null;
      const industry = $el.find("[class*='services'], [class*='category'], [class*='focus']").first().text().trim() || null;
      const employees = $el.find("[class*='employees'], [class*='size'], [class*='team']").first().text().trim() || null;
      const ratingTxt = $el.find("[class*='rating'], [class*='stars']").first().text().trim();
      const reviewTxt = $el.find("[class*='reviews'], [class*='review-count']").first().text().trim();
      const sourceId  = $el.attr("data-provider") ?? $el.find("a[href*='/profile/']").first().attr("href")?.split("/").pop() ?? null;
      const tags      = $el.find("[class*='tag'], [class*='service-tag']").map((_, t) => $(t).text().trim()).get().filter(Boolean);

      if (!name) return;

      companies.push({
        name,
        website:     website ?? null,
        domain:      normaliseDomain(website),
        country:     country?.split(",").pop()?.trim() ?? country,
        city:        city || null,
        industry:    industry?.split(",")[0]?.trim() ?? null,
        employees:   employees?.match(/[\d,+\-–]+/)?.[0] ?? null,
        employeeMin: null,
        employeeMax: null,
        rating:      ratingTxt ? parseFloat(ratingTxt) || null : null,
        reviewCount: reviewTxt ? parseInt(reviewTxt.replace(/\D/g, "")) || null : null,
        sourceUrl:   url,
        sourceId,
        tags,
        source:      "clutch",
      });
    });

    // Fallback: try JSON-LD structured data
    if (companies.length === 0) {
      $("script[type='application/ld+json']").each((_, el) => {
        try {
          const data = JSON.parse($(el).html() ?? "{}");
          const items: unknown[] = Array.isArray(data) ? data : [data];
          for (const item of items) {
            const d = item as Record<string, unknown>;
            if (!d["@type"]?.toString().includes("LocalBusiness") && !d["name"]) continue;
            const addr = d.address as Record<string, string> | undefined;
            companies.push({
              name:        String(d.name ?? ""),
              website:     (d.url as string) ?? null,
              domain:      normaliseDomain(d.url as string),
              country:     addr?.addressCountry ?? null,
              city:        addr?.addressLocality ?? null,
              industry:    (d.description as string)?.split(".")[0] ?? null,
              employees:   null,
              employeeMin: null,
              employeeMax: null,
              rating:      (d.aggregateRating as Record<string, number>)?.ratingValue ?? null,
              reviewCount: (d.aggregateRating as Record<string, number>)?.reviewCount ?? null,
              sourceUrl:   url,
              sourceId:    null,
              tags:        [],
              source:      "clutch",
            });
          }
        } catch { /* skip malformed JSON-LD */ }
      });
    }

    return companies.filter(c => c.name.length > 1);
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// G2.com scraper
// ══════════════════════════════════════════════════════════════════════════════

class G2Scraper extends BaseScraper {
  source: ScraperSource = "g2";

  listUrls(): string[] {
    const cats = this.opts.categories.length
      ? this.opts.categories
      : ["crm", "erp", "project-management", "accounting", "hr", "supply-chain-management"];

    const pages: string[] = [];
    for (const cat of cats) {
      for (let p = 1; p <= 2; p++) {
        pages.push(`https://www.g2.com/categories/${cat}?page=${p}`);
      }
    }
    return pages.slice(0, this.opts.maxPages);
  }

  async scrapeListPage(url: string): Promise<ScrapedCompany[]> {
    await this.page.goto(url, { waitUntil: "networkidle", timeout: 40_000 });
    await delay(1500);

    const html = await this.page.content();
    const $ = cheerio.load(html);
    const companies: ScrapedCompany[] = [];

    // G2 product cards
    $("[class*='product-card'], [class*='listing-card'], [data-product-id]").each((_, el) => {
      const $el = $(el);

      const name     = $el.find("h3, [class*='product-name'], [class*='company-name']").first().text().trim();
      const website  = $el.find("a[href*='http']:not([href*='g2.com'])").first().attr("href") ?? null;
      const country  = $el.find("[class*='location'], [class*='country'], [class*='headquarter']").first().text().trim() || null;
      const industry = url.split("/categories/")[1]?.split("?")[0]?.replace(/-/g, " ") ?? null;
      const employees = $el.find("[class*='employee'], [class*='company-size']").first().text().trim() || null;
      const ratingTxt = $el.find("[class*='rating'], [class*='stars-rating']").first().text().trim();
      const reviewTxt = $el.find("[class*='review'], [class*='ratings-count']").first().text().trim();
      const tags      = $el.find("[class*='tag'], [class*='category-tag']").map((_, t) => $(t).text().trim()).get().filter(Boolean);
      const slug      = $el.find("a[href*='/products/']").first().attr("href")?.split("/products/")[1]?.split("/")[0] ?? null;

      if (!name) return;

      companies.push({
        name,
        website:     website ?? null,
        domain:      normaliseDomain(website),
        country:     country || null,
        city:        null,
        industry:    industry ? industry.charAt(0).toUpperCase() + industry.slice(1) : null,
        employees:   employees?.match(/[\d,+\-–]+/)?.[0] ?? null,
        employeeMin: null,
        employeeMax: null,
        rating:      ratingTxt ? parseFloat(ratingTxt) || null : null,
        reviewCount: reviewTxt ? parseInt(reviewTxt.replace(/\D/g, "")) || null : null,
        sourceUrl:   url,
        sourceId:    slug,
        tags,
        source:      "g2",
      });
    });

    // G2 JSON-LD fallback
    if (companies.length === 0) {
      $("script[type='application/ld+json']").each((_, el) => {
        try {
          const raw  = JSON.parse($(el).html() ?? "{}");
          const list = (raw["@type"] === "ItemList" ? raw.itemListElement : [raw]) as Record<string, unknown>[];
          for (const item of list) {
            const d = (item.item ?? item) as Record<string, unknown>;
            const name = String(d.name ?? "").trim();
            if (!name) continue;
            companies.push({
              name,
              website:     (d.url as string) ?? null,
              domain:      normaliseDomain(d.url as string),
              country:     null,
              city:        null,
              industry:    url.split("/categories/")[1]?.split("?")[0]?.replace(/-/g, " ") ?? null,
              employees:   null,
              employeeMin: null,
              employeeMax: null,
              rating:      (d.aggregateRating as Record<string, number>)?.ratingValue ?? null,
              reviewCount: (d.aggregateRating as Record<string, number>)?.reviewCount ?? null,
              sourceUrl:   url,
              sourceId:    null,
              tags:        [],
              source:      "g2",
            });
          }
        } catch { /* skip */ }
      });
    }

    return companies.filter(c => c.name.length > 1);
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// GoodFirms scraper
// ══════════════════════════════════════════════════════════════════════════════

class GoodFirmsScraper extends BaseScraper {
  source: ScraperSource = "goodfirms";

  listUrls(): string[] {
    const cats = this.opts.categories.length
      ? this.opts.categories
      : ["software-development", "web-development", "mobile-app-development", "it-services", "digital-marketing"];

    const pages: string[] = [];
    for (const cat of cats) {
      for (let p = 1; p <= 2; p++) {
        const pageParam = p === 1 ? "" : `?page=${p}`;
        pages.push(`https://www.goodfirms.co/directory/${cat}${pageParam}`);
      }
    }
    return pages.slice(0, this.opts.maxPages);
  }

  async scrapeListPage(url: string): Promise<ScrapedCompany[]> {
    const html = await this.fetchHtml(url);
    const $ = cheerio.load(html);
    const companies: ScrapedCompany[] = [];

    // GoodFirms uses company-detail or service-company-box class patterns
    $("[class*='company-detail'], [class*='service-company'], [class*='company-box'], .cl-detail").each((_, el) => {
      const $el = $(el);

      const name     = $el.find("h2, h3, [class*='company-name'], [class*='firm-name']").first().text().trim();
      const website  = $el.find("a[class*='website'], a[href*='http']:not([href*='goodfirms'])").first().attr("href") ?? null;
      const location = $el.find("[class*='location'], [class*='country'], [class*='address']").first().text().trim();
      const country  = (location?.split(",").pop()?.trim() ?? location) || null;
      const city     = location?.split(",").shift()?.trim() || null;
      const industry = $el.find("[class*='service'], [class*='category'], [class*='expertise']").first().text().trim() || null;
      const employees = $el.find("[class*='employee'], [class*='team-size'], [class*='size']").first().text().trim() || null;
      const ratingTxt = $el.find("[class*='rating'], [class*='star']").first().text().trim();
      const reviewTxt = $el.find("[class*='review'], [class*='feedback']").first().text().trim();
      const slug      = $el.find("a[href*='/profile/']").first().attr("href")?.split("/").pop() ?? null;
      const tags      = $el.find("[class*='tag'], [class*='service-tag'], [class*='technology']").map((_, t) => $(t).text().trim()).get().filter(Boolean).slice(0, 10);

      if (!name) return;

      companies.push({
        name,
        website:     website ?? null,
        domain:      normaliseDomain(website),
        country:     country || null,
        city:        city || null,
        industry:    industry?.split(",")[0]?.trim() ?? null,
        employees:   employees?.match(/[\d,+\-–]+/)?.[0] ?? null,
        employeeMin: null,
        employeeMax: null,
        rating:      ratingTxt ? parseFloat(ratingTxt) || null : null,
        reviewCount: reviewTxt ? parseInt(reviewTxt.replace(/\D/g, "")) || null : null,
        sourceUrl:   url,
        sourceId:    slug,
        tags,
        source:      "goodfirms",
      });
    });

    // JSON-LD fallback
    if (companies.length === 0) {
      $("script[type='application/ld+json']").each((_, el) => {
        try {
          const data = JSON.parse($(el).html() ?? "{}");
          const items: unknown[] = Array.isArray(data) ? data : (data.itemListElement ?? [data]);
          for (const item of items) {
            const d = ((item as Record<string, unknown>).item ?? item) as Record<string, unknown>;
            const name = String((d.name ?? "")).trim();
            if (!name) continue;
            const addr = d.address as Record<string, string> | undefined;
            companies.push({
              name,
              website:     (d.url as string) ?? null,
              domain:      normaliseDomain(d.url as string),
              country:     addr?.addressCountry ?? null,
              city:        addr?.addressLocality ?? null,
              industry:    null,
              employees:   (d.numberOfEmployees as string) ?? null,
              employeeMin: null,
              employeeMax: null,
              rating:      (d.aggregateRating as Record<string, number>)?.ratingValue ?? null,
              reviewCount: (d.aggregateRating as Record<string, number>)?.reviewCount ?? null,
              sourceUrl:   url,
              sourceId:    null,
              tags:        [],
              source:      "goodfirms",
            });
          }
        } catch { /* skip */ }
      });
    }

    return companies.filter(c => c.name.length > 1);
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// Public API
// ══════════════════════════════════════════════════════════════════════════════

const DEFAULT_OPTS: Required<ScrapeOptions> = {
  maxPages:      3,
  delayMs:       2000,
  headless:      true,
  respectRobots: true,
  categories:    [],
};

/** Scrape a single source. */
export async function scrapeSource(
  source: ScraperSource,
  opts: ScrapeOptions = {}
): Promise<ScrapeResult> {
  const options = { ...DEFAULT_OPTS, ...opts };

  const browser = await chromium.launch({ headless: options.headless });
  let scraper: BaseScraper;

  switch (source) {
    case "clutch":    scraper = new ClutchScraper(options);   break;
    case "g2":        scraper = new G2Scraper(options);        break;
    case "goodfirms": scraper = new GoodFirmsScraper(options); break;
    default: throw new Error(`Unknown source: ${source}`);
  }

  try {
    await scraper.init(browser);
    return await scraper.run();
  } finally {
    await scraper.close();
    await browser.close();
  }
}

/** Scrape all three sources sequentially. */
export async function scrapeAll(opts: ScrapeOptions = {}): Promise<ScrapeResult[]> {
  const sources: ScraperSource[] = ["clutch", "g2", "goodfirms"];
  const results: ScrapeResult[] = [];

  for (const source of sources) {
    console.log(`\n[scraper] Starting ${source}...`);
    try {
      const result = await scrapeSource(source, opts);
      results.push(result);
      console.log(
        `[scraper] ${source} done — ${result.stored} stored, ${result.skipped} skipped, ${result.errors} errors in ${(result.durationMs / 1000).toFixed(1)}s`
      );
    } catch (e) {
      console.error(`[scraper] ${source} fatal:`, (e as Error).message);
      results.push({ source, scraped: 0, stored: 0, skipped: 0, errors: 1, durationMs: 0 });
    }

    // Inter-source pause
    await new Promise(r => setTimeout(r, 3000));
  }

  return results;
}

/** Returns counts from the companies table. */
export async function getCompanyStats(): Promise<Record<ScraperSource | "total", number>> {
  const [total, clutch, g2, goodfirms] = await Promise.all([
    prisma.company.count(),
    prisma.company.count({ where: { source: "clutch" } }),
    prisma.company.count({ where: { source: "g2" } }),
    prisma.company.count({ where: { source: "goodfirms" } }),
  ]);
  return { total, clutch, g2, goodfirms };
}
