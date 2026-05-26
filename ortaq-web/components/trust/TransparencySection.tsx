"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Container, Section, SectionHeader } from "@/components/ui/Section";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";
import { getPlatformTrust, getTransparencyFeed, type PublicTransparencyRecord } from "@/lib/trust/api";
import type { PlatformTrustSnapshot } from "@/lib/trust/api";

export function TransparencySection() {
  const { t } = useTranslation();
  const [platform, setPlatform] = useState<PlatformTrustSnapshot | null>(null);
  const [feed, setFeed] = useState<PublicTransparencyRecord[]>([]);

  useEffect(() => {
    void getPlatformTrust().then(setPlatform);
    void getTransparencyFeed().then(setFeed);
  }, []);

  if (!platform && feed.length === 0) return null;

  return (
    <Section tone="alt" spacing="compact">
      <Container narrow>
        <SectionHeader
          title={t("transparency.title")}
          description={t("transparency.intro")}
        />

        {feed.length > 0 && (
          <ul className="border-t border-ortaq-border">
            {feed.map((item) => (
              <li key={item.id} className="border-b border-ortaq-border py-4">
                <p className={typography.caption}>
                  {new Date(item.publishedAt).toLocaleDateString("tr-TR")}
                </p>
                <h3 className={cn(typography.h3, "mt-1")}>{item.title}</h3>
                <p className={cn(typography.body, "mt-1.5")}>{item.summary}</p>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </Section>
  );
}
