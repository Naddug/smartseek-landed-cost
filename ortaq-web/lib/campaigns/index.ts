import { karatParcaKonya } from "./karat-parca-konya";
import { demirTekstilBursa } from "./demir-tekstil-bursa";
import { anatoliaGidaGaziantep } from "./anatolia-gida-gaziantep";
import { yildizDokumManisa } from "./yildiz-dokum-manisa";
import { catalogBatch } from "./catalog-batch";
import type { SimulatedCampaign } from "./types";

/**
 * Catalog order is the canonical display order across /sirketler and the homepage.
 * Review-stage and sector diversity first; do not alphabetize.
 */
const coreCampaigns = [
  ...catalogBatch.filter((c) => c.slug === "adana-tarim-isleme"),
  ...catalogBatch.filter((c) => c.slug === "atlas-lojistik-istanbul"),
  karatParcaKonya,
  anatoliaGidaGaziantep,
  yildizDokumManisa,
  ...catalogBatch.filter((c) => c.slug === "vizyon-otomotiv-bursa"),
  demirTekstilBursa,
  ...catalogBatch.filter(
    (c) =>
      !["adana-tarim-isleme", "atlas-lojistik-istanbul", "vizyon-otomotiv-bursa"].includes(c.slug),
  ),
];

const campaigns: Record<string, SimulatedCampaign> = Object.fromEntries(
  coreCampaigns.map((c) => [c.slug, c]),
);

export function getCampaign(slug: string): SimulatedCampaign | undefined {
  return campaigns[slug];
}

export function getAllCampaignSlugs(): string[] {
  return Object.keys(campaigns);
}

export function listCampaigns(): SimulatedCampaign[] {
  return coreCampaigns;
}

export type { SimulatedCampaign } from "./types";
