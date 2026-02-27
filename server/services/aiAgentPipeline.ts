/**
 * AI Agent Pipeline: Prospector → Enricher → Qualifier → Outreach
 * Lightweight orchestration via sequential LLM calls. No external frameworks.
 */

import { getOpenAIClient } from "./openaiClient";

export interface PipelineInput {
  searchCriteria: string;
  targetIndustries?: string[];
  topN?: number; // How many leads to enrich and qualify (default 3)
}

export interface EnrichedLead {
  name: string;
  title: string;
  company: string;
  industry: string;
  email?: string;
  phone?: string;
  score?: number;
  research?: string;
}

export interface PipelineResult {
  step: string;
  leads: EnrichedLead[];
  topLead: EnrichedLead | null;
  callScript?: string;
  emailDraft?: string;
  summary?: string;
}

async function callLLM(systemPrompt: string, userContent: string): Promise<string> {
  const response = await getOpenAIClient().chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userContent },
    ],
    max_tokens: 4000,
  });
  return response.choices[0]?.message?.content || "";
}

function parseLeadsFromContent(content: string): EnrichedLead[] {
  try {
    const jsonMatch = content.match(/\{[\s\S]*"leads"[\s\S]*\}/) || content.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      const arr = Array.isArray(parsed) ? parsed : parsed.leads || [];
      return arr.map((l: any, i: number) => ({
        name: l.name || "Unknown",
        title: l.title || "",
        company: l.company || "",
        industry: l.industry || "",
        email: l.email,
        phone: l.phone,
      }));
    }
  } catch {
    /* ignore parse errors */
  }
  return [];
}

/**
 * Step 1: Prospector — Find leads matching criteria
 */
async function runProspector(input: PipelineInput): Promise<EnrichedLead[]> {
  const industries = input.targetIndustries?.length
    ? input.targetIndustries.join(", ")
    : "any industry";
  const query = `Find business owners and decision makers matching: ${input.searchCriteria}. Target industries: ${industries}. Return as JSON: { "leads": [ { "name", "title", "company", "industry", "email", "phone" } ], "summary": "brief summary" }. Generate 8-12 realistic leads. Focus on C-level executives, VPs, and Directors who are actual decision makers for procurement and sourcing. Include companies of varying sizes (enterprise, mid-market, SMB) for a diverse pipeline.`;
  const systemPrompt = `You are an elite B2B lead generation specialist with deep expertise in international trade and sourcing. You identify high-value decision makers at companies that actively source products globally. Return ONLY valid JSON with a "leads" array. Each lead must have: name, title, company, industry, email, phone. Prioritize: procurement directors, supply chain VPs, sourcing managers, and C-suite executives at importing/manufacturing companies.`;
  const content = await callLLM(systemPrompt, query);
  return parseLeadsFromContent(content);
}

/**
 * Step 2: Enricher — Research top N companies
 */
async function runEnricher(leads: EnrichedLead[], topN: number): Promise<EnrichedLead[]> {
  const toEnrich = leads.slice(0, topN);
  const enriched: EnrichedLead[] = [];

  for (const lead of toEnrich) {
    try {
      const query = `Provide a strategic intelligence brief (5-6 sentences) for ${lead.company}. Include: company size and revenue estimate, key products/services, recent strategic moves or news, current sourcing challenges or opportunities, and specific engagement angle for reaching ${lead.name} (${lead.title}). End with one specific pain point we can address.`;
      const systemPrompt = `You are a senior business intelligence analyst specializing in supply chain and procurement intelligence. Provide actionable insights that a sales team can immediately use. Be specific about company details, market position, and strategic opportunities. Return a concise summary only, no JSON.`;
      const research = await callLLM(systemPrompt, query);
      enriched.push({ ...lead, research: research.trim() });
    } catch {
      enriched.push(lead);
    }
  }

  return [...enriched, ...leads.slice(topN)];
}

/**
 * Step 3: Qualifier — Score and rank leads
 */
async function runQualifier(leads: EnrichedLead[]): Promise<EnrichedLead[]> {
  if (leads.length === 0) return [];
  if (leads.length === 1) return [{ ...leads[0], score: 85 }];

  const list = leads.map((l) => `${l.name} at ${l.company} (${l.title}, ${l.industry})`).join("\n");
  const query = `Rank these leads by sales qualification priority (1=best). Return JSON only: { "scores": [ 85, 72, 90, ... ] } — same order as leads. Consider: title seniority, company fit, industry.`;
  const systemPrompt = `You are a sales qualification specialist. Return ONLY valid JSON.`;
  const content = await callLLM(systemPrompt, query);

  try {
    const jsonMatch = content.match(/\{[\s\S]*"scores"[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      const scores: number[] = Array.isArray(parsed.scores) ? parsed.scores : [];
      return leads.map((l, i) => ({ ...l, score: scores[i] ?? 70 }));
    }
  } catch {
    /* fallback: assign default scores */
  }
  return leads.map((l, i) => ({ ...l, score: 80 - i * 5 }));
}

/**
 * Step 4: Outreach — Generate call script and email for top lead
 */
async function runOutreach(
  lead: EnrichedLead,
  settings?: { phoneScriptTone?: string; emailTemplate?: string; emailSignature?: string }
): Promise<{ callScript: string; emailDraft: string }> {
  const tone = settings?.phoneScriptTone || "professional";
  const template = settings?.emailTemplate || "formal";
  const sig = settings?.emailSignature || "Best regards";

  const [callContent, emailContent] = await Promise.all([
    callLLM(
      `You are a B2B sales call specialist. Create a ${tone} phone script. Include: opening hook, intro, 3-4 talking points, objection handling, call to action.`,
      `Script for ${lead.name}, ${lead.title} at ${lead.company} (${lead.industry}).${lead.research ? ` Context: ${lead.research.slice(0, 200)}` : ""}`
    ),
    callLLM(
      `You are a B2B email copywriter. Draft a ${template} outreach email. Include: subject line (2 options), personalized opening, value prop, CTA. Under 150 words.`,
      `Email for ${lead.name} at ${lead.company}.${lead.research ? ` Context: ${lead.research.slice(0, 200)}` : ""} Sign off: ${sig}`
    ),
  ]);

  return { callScript: callContent.trim(), emailDraft: emailContent.trim() };
}

/**
 * Run full pipeline: Prospector → Enricher → Qualifier → Outreach
 */
export async function runAIAgentPipeline(
  input: PipelineInput,
  settings?: { phoneScriptTone?: string; emailTemplate?: string; emailSignature?: string }
): Promise<{
  leads: EnrichedLead[];
  topLead: EnrichedLead | null;
  callScript?: string;
  emailDraft?: string;
  summary: string;
}> {
  const topN = Math.min(input.topN ?? 3, 5);

  // Step 1: Prospector
  const leads = await runProspector(input);
  if (leads.length === 0) {
    return { leads: [], topLead: null, summary: "No leads found matching criteria." };
  }

  // Step 2: Enricher (top N only)
  const enriched = await runEnricher(leads, topN);

  // Step 3: Qualifier
  const qualified = await runQualifier(enriched);
  qualified.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  const topLead = qualified[0] ?? null;

  // Step 4: Outreach (top lead only)
  let callScript: string | undefined;
  let emailDraft: string | undefined;
  if (topLead) {
    const outreach = await runOutreach(topLead, settings);
    callScript = outreach.callScript;
    emailDraft = outreach.emailDraft;
  }

  return {
    leads: qualified,
    topLead,
    callScript,
    emailDraft,
    summary: `Found ${qualified.length} leads. Top: ${topLead?.name} at ${topLead?.company} (score: ${topLead?.score ?? "N/A"}).`,
  };
}
