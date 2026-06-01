"use client";

import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";
import { TeamMemberCard } from "@/components/team/TeamMemberCard";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";
import { TEAM_MEMBERS } from "@/lib/team/members";

type TeamGridProps = {
  compact?: boolean;
  showIntro?: boolean;
};

export function TeamGrid({ compact = false, showIntro = true }: TeamGridProps) {
  const { t } = useTranslation();

  return (
    <div>
      {showIntro ? (
        <div className="max-w-2xl">
          <p className={cn(typography.body, "text-ortaq-ink-muted")}>{t("teamPage.intro")}</p>
        </div>
      ) : null}
      <div className={cn("grid gap-5 sm:gap-6", showIntro ? "mt-8" : "mt-0", compact ? "sm:grid-cols-2" : "lg:grid-cols-2")}>
        {TEAM_MEMBERS.map((m) => (
          <TeamMemberCard
            key={m.id}
            id={m.id}
            linkedinUrl={m.linkedinPath}
            compact={compact}
          />
        ))}
      </div>
    </div>
  );
}

export function TeamGridSection({ compact, showIntro }: TeamGridProps) {
  return (
    <Container wide>
      <TeamGrid compact={compact} showIntro={showIntro} />
    </Container>
  );
}
