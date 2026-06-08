"use client";

import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";
import { homeVisuals } from "@/lib/home/visuals";

export function WlProof() {
  const { t } = useTranslation();
  const credentials = t("home.whitelabel.proof.credentials", { returnObjects: true }) as string[];

  return (
    <section className="border-b border-ortaq-border bg-ortaq-surface py-14 sm:py-20">
      <Container wide className="max-w-[72rem]">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
          <div>
            <h2 className="font-heading text-[1.75rem] font-semibold tracking-[-0.03em] text-ortaq-ink sm:text-[2rem]">
              {t("home.whitelabel.proof.title")}
            </h2>
            <p className="mt-4 text-[1.0625rem] leading-relaxed text-ortaq-ink-muted">
              {t("home.whitelabel.proof.lead")}
            </p>
            <ul className="mt-8 flex flex-wrap gap-2">
              {credentials.map((name) => (
                <li
                  key={name}
                  className="rounded-md border border-ortaq-border bg-ortaq-bg px-4 py-2 text-[0.9375rem] font-semibold text-ortaq-ink"
                >
                  {name}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-[0.9375rem] leading-relaxed text-ortaq-ink-soft">
              {t("home.whitelabel.proof.line")}
            </p>
          </div>

          <div className="overflow-hidden rounded-lg border border-ortaq-border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={homeVisuals.proof.founder}
              alt={t("home.whitelabel.proof.imageAlt")}
              className="aspect-[5/4] w-full object-cover object-[center_30%]"
              loading="lazy"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
