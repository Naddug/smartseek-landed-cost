import type { SimulatedCampaign } from "@/lib/campaigns/types";
import { getOperationalRelevanceLine } from "@/lib/product/operational-relevance";
import { formatDaysAgo } from "@/lib/product/company-summary";

export type WhyNowBriefing = {
  headline: string;
  focus: string;
  recentChange: string | null;
  challenge: string | null;
  exportDevelopment: string | null;
  lastActivityWhen: string | null;
};

function latestActivity(c: SimulatedCampaign): { date: string; text: string } | null {
  const journal = c.fieldJournal[0];
  if (journal) return { date: journal.date, text: journal.text };
  const update = c.operationalUpdates[0];
  if (update) return { date: update.date, text: update.text };
  return null;
}

export function getWhyNowBriefing(c: SimulatedCampaign, locale = "tr-TR"): WhyNowBriefing {
  const focus = getOperationalRelevanceLine(c);
  const activity = latestActivity(c);
  const recentChange = activity ? sanitizeNote(activity.text) : null;
  const rawChallenge = c.bottlenecks[0]
    ? `${c.bottlenecks[0].label}: ${c.bottlenecks[0].note}`
    : c.operationalFriction[0]?.note ?? null;
  const challenge =
    rawChallenge && !/yatırım|fonlama|getiri|sermaye|raise/i.test(rawChallenge) ? rawChallenge : c.bottlenecks[0]?.label ?? null;
  const lastExport = c.exportEvolution[c.exportEvolution.length - 1];
  const exportDevelopment = lastExport
    ? `${lastExport.year} · ${lastExport.market}: ${lastExport.note}`
    : null;

  return {
    headline: focus,
    focus,
    recentChange,
    challenge: challenge ? sanitizeNote(challenge) : null,
    exportDevelopment: exportDevelopment ? sanitizeNote(exportDevelopment) : null,
    lastActivityWhen: activity ? formatDaysAgo(activity.date, locale) : null,
  };
}

function sanitizeNote(text: string): string {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length > 160) return `${t.slice(0, 157)}…`;
  return t;
}
