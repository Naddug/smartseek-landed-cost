"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

/**
 * HeroPlate — the single atmospheric surface on the homepage.
 *
 * Sits above HomepageMasthead. Documentary-register industrial photograph
 * paired with a kicker, one headline, one body line, one closing line, and
 * one inline link. No animation, no gradient, no overlay, no second CTA.
 *
 * Image swapping
 * --------------
 * Replacement photographs go in /public/media/hero/ with a slug-style
 * filename, registered in the HERO_IMAGES array below. The component picks
 * the first entry; rotation logic is deliberately not implemented to keep
 * the surface static (a hero that cycles is theatrical).
 *
 * Caption discipline
 * ------------------
 * Every entry must carry a caption that names the location and the nature
 * of the observation. The caption is what converts the photograph from
 * decoration into evidence.
 */

type HeroImage = {
  /** Public path; must exist under /public/media/ */
  src: string;
  /** Short caption read as evidence — location · observation type · period */
  captionTr: string;
  captionEn: string;
};

/**
 * Temporary editorial placeholder.
 *
 * `factory-floor.jpg` (verified content: engineering desk, calipers, technical
 * drawings) is the closest existing JPG to the documentary register the brief
 * specifies. Replace with on-site Anatolian OSB photography when sourced.
 */
const HERO_IMAGES: HeroImage[] = [
  {
    src: "/media/factory-floor.jpg",
    captionTr: "Konya OSB · ön ziyaret notu · 2026",
    captionEn: "Konya OSB · field observation · 2026",
  },
];

export function HeroPlate() {
  const { t, i18n } = useTranslation();
  const image = HERO_IMAGES[0];
  const caption = i18n.language === "en" ? image.captionEn : image.captionTr;

  return (
    <section
      className="border-b border-ortaq-border bg-ortaq-surface"
      aria-label={t("homeProduct.heroPlate.aria")}
    >
      <Container wide>
        <div className="grid gap-6 py-7 sm:py-9 lg:grid-cols-[1.4fr_1fr] lg:gap-10 lg:py-10">
          {/* Photograph + caption */}
          <figure className="min-w-0">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-ortaq-md border border-ortaq-border bg-ortaq-bg-alt">
              <Image
                src={image.src}
                alt=""
                fill
                priority
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="object-cover"
              />
            </div>
            <figcaption className={cn(typography.caption, "mt-1.5 text-ortaq-ink-soft")}>
              {caption}
            </figcaption>
          </figure>

          {/* Text column */}
          <div className="flex min-w-0 flex-col justify-center">
            <p className={typography.label}>{t("homeProduct.heroPlate.kicker")}</p>
            <h1 className={cn(typography.display, "mt-2 max-w-xl text-ortaq-ink")}>
              {t("homeProduct.heroPlate.headline")}
            </h1>
            <p className={cn(typography.body, "mt-3 max-w-xl text-ortaq-ink-muted")}>
              {t("homeProduct.heroPlate.body")}
            </p>
            <p className={cn(typography.body, "mt-2 max-w-xl text-ortaq-ink")}>
              {t("homeProduct.heroPlate.closing")}
            </p>
            <Link
              href="/sirketler"
              className={cn(
                typography.bodySm,
                "mt-5 inline-block w-fit font-medium text-ortaq-ink decoration-ortaq-border-strong underline-offset-4 hover:underline",
              )}
            >
              {t("homeProduct.heroPlate.cta")}
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
