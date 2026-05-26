/** Honest operational status — edit manually when something changes. No backend. */
export const operationalPulse = {
  siteLastUpdated: "2026-05-26",
  stats: {
    preliminaryReview: 3,
    fieldVisitsCompleted: 2,
    documentReview: 1,
    committeeQueue: 0,
  },
  notes: [
    { id: "platform", date: "2026-05-20", key: "platform" as const },
    { id: "legal", date: "2026-05-12", key: "legal" as const },
    { id: "verify", date: "2026-02-01", key: "verify" as const },
  ],
  logs: [
    { id: "log-1", date: "2026-05-18", key: "fieldVisit" as const },
    { id: "log-2", date: "2026-05-14", key: "preliminary" as const },
    { id: "log-3", date: "2026-05-10", key: "legalUpdate" as const },
    { id: "log-4", date: "2026-05-02", key: "partner" as const },
  ],
} as const;

export function formatPulseDate(iso: string, locale = "tr-TR"): string {
  return new Date(iso).toLocaleDateString(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
