"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";
import type { TeamMemberId } from "@/lib/team/members";

type TeamMemberCardProps = {
  id: TeamMemberId;
  linkedinUrl?: string;
  compact?: boolean;
};

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toLocaleUpperCase("tr-TR");
}

export function TeamMemberCard({ id, linkedinUrl, compact = false }: TeamMemberCardProps) {
  const { t } = useTranslation();
  const prefix = `teamPage.members.${id}`;
  const name = t(`${prefix}.name`);
  const role = t(`${prefix}.role`);
  const focus = t(`${prefix}.focus`);
  const bio = t(`${prefix}.bio`);
  const url = linkedinUrl || t(`${prefix}.linkedinUrl`);

  return (
    <article
      className={cn(
        "flex flex-col border border-ortaq-border bg-ortaq-surface",
        compact ? "p-5 sm:p-6" : "p-6 sm:p-8",
      )}
    >
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "flex shrink-0 items-center justify-center rounded-full border border-ortaq-border-strong bg-ortaq-bg-alt font-semibold text-ortaq-ink",
            compact ? "h-12 w-12 text-sm" : "h-14 w-14 text-base",
          )}
          aria-hidden
        >
          {initials(name)}
        </div>
        <div className="min-w-0 flex-1">
          <p className={cn(typography.label, "text-ortaq-ink-soft")}>{role}</p>
          <h3 className={cn(compact ? "text-lg" : "text-xl", "mt-1 font-semibold tracking-[-0.02em] text-ortaq-ink")}>
            {name}
          </h3>
          {focus ? (
            <p className={cn(typography.caption, "mt-2 leading-relaxed text-ortaq-ink-muted")}>{focus}</p>
          ) : null}
        </div>
      </div>

      <p className={cn(typography.bodySm, "mt-4 leading-relaxed text-ortaq-ink-muted")}>{bio}</p>

      {url ? (
        <p className="mt-4 border-t border-ortaq-border pt-4">
          <Link
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(typography.caption, typography.link, "font-medium")}
          >
            {t("teamPage.linkedinLabel")} →
          </Link>
        </p>
      ) : null}
    </article>
  );
}
