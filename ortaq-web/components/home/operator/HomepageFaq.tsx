"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/cn";
import { Container, SectionHeader } from "@/components/ui/Section";

type FaqItem = { q: string; a: string };

export function HomepageFaq() {
  const { t } = useTranslation();
  const items = t("home.operator.faq.items", { returnObjects: true }) as FaqItem[];
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="border-b border-ortaq-border bg-ortaq-surface">
      <Container narrow>
        <div className="py-12 sm:py-14">
          <SectionHeader title={t("home.operator.faq.headline")} align="center" />
          <div className="mt-6 divide-y divide-ortaq-border rounded-xl border border-ortaq-border bg-white">
            {items.map((item, i) => (
              <div key={item.q}>
                <button
                  type="button"
                  onClick={() => setOpen(open === i ? null : i)}
                  className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="text-[0.9375rem] font-semibold text-ortaq-ink">{item.q}</span>
                  <span className="shrink-0 text-ortaq-ink-soft">{open === i ? "−" : "+"}</span>
                </button>
                <div
                  className={cn(
                    "overflow-hidden px-5 transition-all",
                    open === i ? "max-h-96 pb-4" : "max-h-0",
                  )}
                >
                  <p className="text-[0.875rem] leading-relaxed text-ortaq-ink-muted">{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
