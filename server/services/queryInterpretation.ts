/**
 * Natural-language query interpretation for supplier search.
 *
 * AI is used ONLY for parsing — never for ranking or deterministic scoring.
 * All outputs are explainable structured fields returned to the client.
 */

import { getOpenAIClientOrNull, LIGHT_MODEL } from "./openaiClient";
import { SEARCH_QUERY_INTERPRETATION_ENABLED } from "../config/searchFeatures";

export interface QueryInterpretation {
  originalQuery: string;
  /** Primary FTS terms derived from the query */
  searchTerms: string[];
  suggestedCountry?: string;
  suggestedIndustry?: string;
  suggestedProductTerms: string[];
  /** Human-readable steps explaining how the query was understood */
  explanation: string[];
  usedAi: boolean;
}

const INTERPRET_CACHE = new Map<string, QueryInterpretation>();
const CACHE_MAX = 300;

function looksNaturalLanguage(query: string): boolean {
  const q = query.trim();
  if (q.split(/\s+/).length < 3) return false;
  return /\b(in|from|for|near|based|supplier|manufacturer|factory|certified|verified|organic|steel|textile|electronic)\b/i.test(q)
    || /[,;]/.test(q);
}

function heuristicInterpret(query: string): QueryInterpretation {
  const originalQuery = query.trim();
  const terms = originalQuery.split(/\s+/).filter(Boolean);
  const explanation = [`Searching for: "${originalQuery}"`];

  // Lightweight country hint: "suppliers in Turkey", "from China"
  const countryMatch = originalQuery.match(/\b(?:in|from)\s+([A-Z][a-zA-Z\s]{2,30})\b/);
  const suggestedCountry = countryMatch?.[1]?.trim();

  if (suggestedCountry) {
    explanation.push(`Location hint detected: ${suggestedCountry}`);
  }

  return {
    originalQuery,
    searchTerms: [originalQuery],
    suggestedCountry,
    suggestedProductTerms: terms.filter((t) => t.length > 2).slice(0, 6),
    explanation,
    usedAi: false,
  };
}

export async function interpretSupplierQuery(query: string): Promise<QueryInterpretation> {
  const trimmed = query.trim();
  if (!trimmed) {
    return {
      originalQuery: "",
      searchTerms: [],
      suggestedProductTerms: [],
      explanation: [],
      usedAi: false,
    };
  }

  const cacheKey = trimmed.toLowerCase();
  const cached = INTERPRET_CACHE.get(cacheKey);
  if (cached) return cached;

  if (!SEARCH_QUERY_INTERPRETATION_ENABLED || !looksNaturalLanguage(trimmed)) {
    const result = heuristicInterpret(trimmed);
    INTERPRET_CACHE.set(cacheKey, result);
    return result;
  }

  const client = getOpenAIClientOrNull();
  if (!client) {
    const result = heuristicInterpret(trimmed);
    INTERPRET_CACHE.set(cacheKey, result);
    return result;
  }

  try {
    const res = await client.chat.completions.create({
      model: LIGHT_MODEL,
      messages: [
        {
          role: "system",
          content: `You parse B2B supplier search queries into structured JSON. Do NOT score suppliers.
Return JSON: {
  "searchTerms": ["primary search phrase"],
  "suggestedCountry": "country name or null",
  "suggestedIndustry": "industry or null",
  "suggestedProductTerms": ["term1", "term2"],
  "explanation": ["step 1", "step 2"]
}
Rules:
- searchTerms: 1-2 concise phrases for full-text search (English preferred)
- explanation: 2-4 short plain-language steps describing how you understood the query
- Do not invent supplier names
- Do not use hype language`,
        },
        { role: "user", content: trimmed },
      ],
      response_format: { type: "json_object" },
      max_tokens: 250,
      temperature: 0.1,
    });

    const content = res.choices[0]?.message?.content?.trim();
    if (!content) {
      const fallback = heuristicInterpret(trimmed);
      INTERPRET_CACHE.set(cacheKey, fallback);
      return fallback;
    }

    const parsed = JSON.parse(content) as {
      searchTerms?: string[];
      suggestedCountry?: string | null;
      suggestedIndustry?: string | null;
      suggestedProductTerms?: string[];
      explanation?: string[];
    };

    const searchTerms = (parsed.searchTerms ?? [])
      .filter((t): t is string => typeof t === "string" && t.trim().length > 0)
      .map((t) => t.trim())
      .slice(0, 2);

    const result: QueryInterpretation = {
      originalQuery: trimmed,
      searchTerms: searchTerms.length > 0 ? searchTerms : [trimmed],
      suggestedCountry: parsed.suggestedCountry?.trim() || undefined,
      suggestedIndustry: parsed.suggestedIndustry?.trim() || undefined,
      suggestedProductTerms: (parsed.suggestedProductTerms ?? [])
        .filter((t): t is string => typeof t === "string" && t.trim().length > 0)
        .map((t) => t.trim())
        .slice(0, 8),
      explanation: (parsed.explanation ?? [`Searching for: "${trimmed}"`])
        .filter((s): s is string => typeof s === "string" && s.trim().length > 0)
        .slice(0, 5),
      usedAi: true,
    };

    if (INTERPRET_CACHE.size >= CACHE_MAX) {
      const first = INTERPRET_CACHE.keys().next().value;
      if (first) INTERPRET_CACHE.delete(first);
    }
    INTERPRET_CACHE.set(cacheKey, result);
    return result;
  } catch (err) {
    console.warn("[queryInterpretation] AI parse failed:", (err as Error).message);
    const fallback = heuristicInterpret(trimmed);
    INTERPRET_CACHE.set(cacheKey, fallback);
    return fallback;
  }
}
