"use client";

import { useTranslation } from "react-i18next";
import { VisualImage } from "@/components/home/visual/VisualImage";
import { homeVisuals } from "@/lib/home/visuals";

const FACTORY_TILES = [
  { key: "operations", image: homeVisuals.proof.operations, span: "lg:col-span-7 lg:row-span-2" },
  { key: "quality", image: homeVisuals.proof.quality, span: "lg:col-span-5" },
  { key: "production", image: homeVisuals.proof.production, span: "lg:col-span-5" },
  { key: "export", image: homeVisuals.proof.export, span: "lg:col-span-12" },
] as const;

export function ExecutionTrust() {
  const { t } = useTranslation();
  const credentials = t("home.operator.proof.credentials", { returnObjects: true }) as string[];

  return (
    <section id="proof-wall" className="bg-ortaq-bg-alt">
      <article className="relative min-h-[420px] overflow-hidden sm:min-h-[500px]">
        <VisualImage
          src={homeVisuals.proof.founder}
          alt={t("home.operator.proof.founderAlt")}
          className="absolute inset-0 size-full"
          imageClassName="object-[center_25%]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ortaq-ink/95 via-ortaq-ink/40 to-ortaq-ink/10" />
        <div className="relative flex min-h-[420px] flex-col justify-end px-5 py-10 sm:min-h-[500px] sm:px-8 sm:py-14">
          <p className="text-[0.625rem] font-black uppercase tracking-[0.16em] text-ortaq-gold">
            {t("home.operator.proof.founderLabel")}
          </p>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-4">
            {credentials.map((line) => (
              <span
                key={line}
                className="font-heading text-[2rem] font-semibold tracking-[-0.03em] text-white sm:text-[2.75rem] lg:text-[3.5rem]"
              >
                {line}
              </span>
            ))}
          </div>
          <p className="mt-5 max-w-xl text-[0.875rem] font-medium text-white/70 sm:text-[1rem]">
            {t("home.operator.proof.founderLine")}
          </p>
        </div>
      </article>

      <div className="grid gap-1 sm:gap-1.5 lg:grid-cols-12">
        {FACTORY_TILES.map((tile) => (
          <article
            key={tile.key}
            className={`relative min-h-[220px] overflow-hidden sm:min-h-[280px] ${tile.span}`}
          >
            <VisualImage
              src={tile.image}
              alt={t(`home.operator.proof.tiles.${tile.key}`)}
              className="absolute inset-0 size-full"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-ortaq-ink/15" />
            <p className="absolute bottom-4 left-4 text-[0.6875rem] font-black uppercase tracking-[0.14em] text-white sm:bottom-6 sm:left-6 sm:text-[0.75rem]">
              {t(`home.operator.proof.tiles.${tile.key}`)}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
