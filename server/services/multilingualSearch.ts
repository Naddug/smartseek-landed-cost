/**
 * AI-powered multilingual search expansion.
 * Expands search queries in any language (German, Spanish, Turkish, etc.)
 * to include English equivalents so supplier DB (mostly English) returns relevant results.
 */

import { getOpenAIClientOrNull } from "./openaiClient";
import { LIGHT_MODEL } from "./openaiClient";

const CACHE = new Map<string, string[]>();
const CACHE_MAX = 500;
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour
const CACHE_ENTRIES: { key: string; ts: number }[] = [];

function cacheKey(q: string): string {
  return q.toLowerCase().trim();
}

function getCached(key: string): string[] | null {
  const entry = CACHE_ENTRIES.find((e) => e.key === key);
  if (entry && Date.now() - entry.ts < CACHE_TTL_MS) {
    return CACHE.get(key) ?? null;
  }
  return null;
}

function setCache(key: string, value: string[]) {
  if (CACHE.size >= CACHE_MAX) {
    const oldest = CACHE_ENTRIES.shift();
    if (oldest) CACHE.delete(oldest.key);
  }
  CACHE.set(key, value);
  CACHE_ENTRIES.push({ key, ts: Date.now() });
}

/** Check if query looks like it might need expansion (non-ASCII or non-English chars) */
function mightNeedExpansion(query: string): boolean {
  const trimmed = query.trim();
  if (trimmed.length < 2) return false;
  // Simple heuristic: if it contains mostly ASCII letters and common words, might be English
  const asciiOnly = /^[a-zA-Z0-9\s\-.,]+$/.test(trimmed);
  const commonEnglish = /\b(supplier|suppliers|manufacturer|fabric|cotton|steel|antimony|solar|panel|pharma|api|china|turkey|india|vietnam)\b/i.test(trimmed);
  if (asciiOnly && commonEnglish) return false;
  // Non-ASCII or less common patterns → likely needs expansion
  return !asciiOnly || trimmed.split(/\s+/).some((w) => w.length > 8);
}

export interface ExpandResult {
  terms: string[];
  usedExpansion: boolean;
}

/**
 * Expand a search query for multilingual supplier search.
 * Returns original terms + English equivalents + synonyms.
 * Uses AI when configured; otherwise returns original terms only.
 * @param query - User's search query
 * @param uiLang - Optional UI language (e.g. "de", "tr") — when non-English, forces expansion
 */
export async function expandSearchQueryForMultilingual(
  query: string,
  uiLang?: string
): Promise<ExpandResult> {
  const trimmed = query.trim();
  if (!trimmed) return { terms: [], usedExpansion: false };

  const key = cacheKey(trimmed) + (uiLang || "");
  const cached = getCached(key);
  if (cached) {
    const origCount = trimmed.split(/\s+/).filter(Boolean).length;
    return { terms: cached, usedExpansion: cached.length > origCount };
  }

  const originalTerms = trimmed.split(/\s+/).filter(Boolean);
  const uniqueOriginal = [...new Set(originalTerms)];

  const client = getOpenAIClientOrNull();
  const forceByLang = uiLang && uiLang !== "en";
  const needsExpansion = forceByLang || mightNeedExpansion(trimmed);
  if (!client || !needsExpansion) {
    setCache(key, uniqueOriginal);
    return { terms: uniqueOriginal, usedExpansion: false };
  }

  try {
    const res = await client.chat.completions.create({
      model: LIGHT_MODEL,
      messages: [
        {
          role: "system",
          content: `You are a B2B sourcing search assistant. Given a search query in any language (German, Spanish, Turkish, etc.), return JSON: {"terms": ["term1", "term2", ...]} with search terms that would help find suppliers in a database mostly in English.
Include: 1) Original terms as-is. 2) English equivalents (e.g. Antimon→antimony, Telas de algodón→cotton fabric). 3) Key product/material words. 4) Skip pure location names (we filter by country separately).
3-8 terms max. Example: "Antimon Lieferanten" → {"terms": ["Antimon", "antimony", "suppliers"]}`,
        },
        {
          role: "user",
          content: `Query: "${trimmed}"`,
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 150,
      temperature: 0.2,
    });

    const content = res.choices[0]?.message?.content?.trim();
    if (!content) {
      setCache(key, uniqueOriginal);
      return { terms: uniqueOriginal, usedExpansion: false };
    }

    let parsed: { terms?: string[]; searchTerms?: string[] };
    try {
      parsed = JSON.parse(content);
    } catch {
      setCache(key, uniqueOriginal);
      return { terms: uniqueOriginal, usedExpansion: false };
    }

    const expanded = parsed.terms ?? parsed.searchTerms ?? [];
    const valid = Array.isArray(expanded)
      ? expanded
          .filter((t): t is string => typeof t === "string" && t.trim().length > 0)
          .map((t) => t.trim())
          .slice(0, 8)
      : [];

    const combined = [...new Set([...uniqueOriginal, ...valid])];
    setCache(key, combined);
    return { terms: combined, usedExpansion: combined.length > uniqueOriginal.length };
  } catch (err) {
    console.warn("Multilingual search expansion failed:", (err as Error).message);
    setCache(key, uniqueOriginal);
    return { terms: uniqueOriginal, usedExpansion: false };
  }
}
