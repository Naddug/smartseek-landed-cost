"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import type { SimulatedCampaign } from "@/lib/campaigns/types";
import { useInterest } from "@/lib/interest/store";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

type ProfileInterestRailProps = {
  campaign: SimulatedCampaign;
  className?: string;
};

export function ProfileInterestRail({ campaign, className }: ProfileInterestRailProps) {
  const { t } = useTranslation();
  const { toggleWatch, isWatching, addInterest, pendingIntroFor } = useInterest();
  const [note, setNote] = useState("");
  const [sent, setSent] = useState(false);
  const slug = campaign.slug;
  const watching = isWatching(slug);
  const pending = pendingIntroFor(slug);

  const submitInterest = () => {
    const text = note.trim() || t("discovery.interest.defaultNote");
    addInterest(slug, text);
    setSent(true);
    setNote("");
  };

  return (
    <aside
      className={cn(
        "border border-ortaq-border bg-ortaq-surface p-5 sm:p-6",
        className,
      )}
      aria-label={t("discovery.profile.interestAria")}
    >
      <p className={cn(typography.label, "text-ortaq-ink-soft")}>{t("discovery.profile.railLabel")}</p>
      <p className={cn(typography.caption, "mt-2 leading-relaxed text-ortaq-ink-muted")}>{t("discovery.profile.disclaimer")}</p>

      <div className="mt-4 flex flex-col gap-2">
        <button
          type="button"
          onClick={() => toggleWatch(slug)}
          className={cn(
            "min-h-10 rounded-ortaq-md border px-4 text-[0.8125rem] font-semibold transition-colors",
            watching
              ? "border-ortaq-trust bg-ortaq-trust-soft text-ortaq-trust"
              : "border-ortaq-border-strong text-ortaq-ink hover:bg-ortaq-bg-alt",
          )}
        >
          {watching ? t("discovery.profile.watching") : t("discovery.profile.watch")}
        </button>

        {pending || sent ? (
          <p className={cn(typography.bodySm, "rounded-ortaq-md bg-ortaq-bg-alt px-3 py-2.5 text-ortaq-ink-muted")}>
            {t("discovery.interest.pending")}
          </p>
        ) : (
          <>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder={t("discovery.interest.placeholder")}
              className="w-full resize-none rounded-ortaq-md border border-ortaq-border bg-ortaq-bg px-3 py-2 text-[0.8125rem] text-ortaq-ink placeholder:text-ortaq-ink-soft focus:border-ortaq-trust focus:outline-none"
            />
            <button
              type="button"
              onClick={submitInterest}
              className="min-h-10 rounded-ortaq-md bg-ortaq-ink px-4 text-[0.8125rem] font-semibold text-ortaq-cream transition-opacity hover:opacity-90"
            >
              {t("discovery.profile.interest")}
            </button>
          </>
        )}
      </div>

      <Link href="/alan" className={cn(typography.caption, typography.link, "mt-4 inline-block font-medium")}>
        {t("discovery.profile.workspaceLink")} →
      </Link>
    </aside>
  );
}
