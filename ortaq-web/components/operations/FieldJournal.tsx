"use client";

import type { FieldJournalEntry, InspectionLayer, OperationalUpdate } from "@/lib/campaigns/types";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

type FieldJournalProps = {
  entries: FieldJournalEntry[];
  title?: string;
};

const typeLabel: Record<FieldJournalEntry["type"], string> = {
  observation: "Gözlem",
  inspection: "İnceleme",
  capacity: "Kapasite",
  logistics: "Lojistik",
  founder: "Kurucu",
};

/** Saha notları — discovered operational fragments */
export function FieldJournal({ entries, title = "Saha notları" }: FieldJournalProps) {
  return (
    <div>
      <p className={typography.kicker}>{title}</p>
      <ul className="mt-6 space-y-0">
        {entries.map((entry) => (
          <li
            key={`${entry.date}-${entry.time}-${entry.type}`}
            className="grid grid-cols-[5.5rem_1fr] gap-x-4 border-t border-ortaq-border py-5 sm:grid-cols-[6.5rem_1fr] sm:gap-x-6"
          >
            <div>
              <p className={cn(typography.caption, "tabular-nums")}>
                {entry.date.slice(5).replace("-", ".")}
              </p>
              <p className={cn(typography.caption, "tabular-nums text-ortaq-ink-soft")}>{entry.time}</p>
              <p className={cn(typography.caption, "mt-1 text-ortaq-gold/80")}>{typeLabel[entry.type]}</p>
            </div>
            <div>
              <p className={cn(typography.bodySm, "leading-relaxed text-ortaq-ink-muted")}>{entry.text}</p>
              <p className={cn(typography.caption, "mt-2 text-ortaq-ink-soft")}>{entry.author}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

type InspectionStackProps = {
  layers: InspectionLayer[];
};

export function InspectionStack({ layers }: InspectionStackProps) {
  const statusLabel = { pending: "Bekliyor", partial: "Kısmi", done: "Tamam" } as const;

  return (
    <ul className="space-y-3">
      {layers.map((layer) => (
        <li
          key={layer.layer}
          className={cn(
            "flex flex-col gap-1 border-l-2 py-1 pl-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4",
            layer.status === "partial" && "border-l-ortaq-gold",
            layer.status === "done" && "border-l-ortaq-trust",
            layer.status === "pending" && "border-l-ortaq-border",
          )}
        >
          <span className={typography.bodySm}>{layer.layer}</span>
          <span className={cn(typography.caption, "shrink-0")}>
            {statusLabel[layer.status]} · {layer.note}
          </span>
        </li>
      ))}
    </ul>
  );
}

type OperationalFeedProps = {
  updates: OperationalUpdate[];
};

export function OperationalFeed({ updates }: OperationalFeedProps) {
  return (
    <ul className="space-y-2">
      {updates.map((u) => (
        <li key={`${u.date}-${u.time}`} className={cn(typography.caption, "text-ortaq-ink-soft")}>
          <span className="tabular-nums">{u.date.slice(5).replace("-", ".")} {u.time}</span>
          {" — "}
          {u.text}
        </li>
      ))}
    </ul>
  );
}
