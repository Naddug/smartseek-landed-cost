"use client";

import { ChipSelect } from "@/components/shared/ChipSelect";
import { cn } from "@/lib/utils";
import {
  ASSET_OPTIONS,
  LOCATION_TENURE,
  REVENUE_RANGES,
  TEAM_SIZES,
} from "@/data/onboarding/owner-options";

interface AssetSelectorProps {
  selected: string[];
  followUps: Record<string, Record<string, string>>;
  onChange: (selected: string[], followUps: Record<string, Record<string, string>>) => void;
  className?: string;
}

function FollowUpField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-2 rounded-lg border border-ortaq-line bg-ortaq-surface-alt/60 px-3 py-2">
      <p className="mb-1.5 text-xs font-medium text-ortaq-text-muted">{label}</p>
      {children}
    </div>
  );
}

export function AssetSelector({
  selected,
  followUps,
  onChange,
  className,
}: AssetSelectorProps) {
  const toggle = (values: string[]) => {
    const nextFollowUps = { ...followUps };
    for (const key of Object.keys(nextFollowUps)) {
      if (!values.includes(key)) delete nextFollowUps[key];
    }
    onChange(values, nextFollowUps);
  };

  const setFollowUp = (assetId: string, field: string, value: string) => {
    onChange(selected, {
      ...followUps,
      [assetId]: { ...followUps[assetId], [field]: value },
    });
  };

  return (
    <div className={cn("space-y-4", className)}>
      <ChipSelect
        options={ASSET_OPTIONS}
        value={selected}
        onChange={toggle}
        multiple
      />

      {selected.includes("location") && (
        <FollowUpField label="Fiziksel lokasyon — durum">
          <div className="flex flex-wrap gap-2">
            {LOCATION_TENURE.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setFollowUp("location", "tenure", opt.value)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium",
                  followUps.location?.tenure === opt.value
                    ? "border-ortaq-action bg-ortaq-action/10 text-ortaq-action"
                    : "border-ortaq-line text-ortaq-text-muted"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </FollowUpField>
      )}

      {selected.includes("website") && (
        <FollowUpField label="Web sitesi / uygulama — URL">
          <input
            type="url"
            placeholder="https://"
            value={followUps.website?.url ?? ""}
            onChange={(e) => setFollowUp("website", "url", e.target.value)}
            className="h-9 w-full rounded-lg border border-ortaq-line bg-ortaq-surface px-3 text-sm focus:border-ortaq-action focus:outline-none focus:ring-2 focus:ring-ortaq-action/20"
          />
        </FollowUpField>
      )}

      {selected.includes("revenue") && (
        <FollowUpField label="Gelir / ciro — aralık">
          <div className="flex flex-wrap gap-2">
            {REVENUE_RANGES.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setFollowUp("revenue", "range", opt.value)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium",
                  followUps.revenue?.range === opt.value
                    ? "border-ortaq-action bg-ortaq-action/10 text-ortaq-action"
                    : "border-ortaq-line text-ortaq-text-muted"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </FollowUpField>
      )}

      {selected.includes("team") && (
        <FollowUpField label="Çalışan / ekip — büyüklük">
          <div className="flex flex-wrap gap-2">
            {TEAM_SIZES.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setFollowUp("team", "size", opt.value)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium",
                  followUps.team?.size === opt.value
                    ? "border-ortaq-action bg-ortaq-action/10 text-ortaq-action"
                    : "border-ortaq-line text-ortaq-text-muted"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </FollowUpField>
      )}
    </div>
  );
}
