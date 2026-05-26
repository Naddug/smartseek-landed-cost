/** Quiet economic traces — edit manually. Discovered, not announced. */
export const economicTraces = {
  global: [
    { id: "g1", date: "2026-05-26", time: "09:14", key: "konyaFieldUpdate" as const },
    { id: "g2", date: "2026-05-25", time: "16:40", key: "capacityReport" as const },
    { id: "g3", date: "2026-05-24", time: "11:02", key: "qualityReview" as const },
    { id: "g4", date: "2026-05-23", time: "08:55", key: "shipmentRef" as const },
    { id: "g5", date: "2026-05-22", time: "19:30", key: "dossierRevision" as const },
    { id: "g6", date: "2026-05-21", time: "13:18", key: "preliminaryFile" as const },
    { id: "g7", date: "2026-05-20", time: "10:07", key: "exportDoc" as const },
    { id: "g8", date: "2026-05-19", time: "15:44", key: "machineAudit" as const },
  ],
  /** Traces pinned to homepage layers */
  layers: {
    network: ["g4", "g6"] as const,
    whisper: ["g3"] as const,
    company: ["g1", "g2"] as const,
    gate: ["g5", "g7", "g8"] as const,
  },
} as const;

export type TraceKey = (typeof economicTraces.global)[number]["key"];

export function getTrace(id: string) {
  return economicTraces.global.find((t) => t.id === id);
}

export function getLayerTraces(layer: keyof typeof economicTraces.layers) {
  return economicTraces.layers[layer]
    .map((id) => getTrace(id))
    .filter((t): t is NonNullable<typeof t> => t != null);
}

export function formatTraceTimestamp(date: string, time: string, locale = "tr-TR"): string {
  const d = new Date(`${date}T${time}:00`);
  const day = d.toLocaleDateString(locale, { day: "numeric", month: "short" });
  return `${day} · ${time}`;
}
