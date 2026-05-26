import { karatParcaKonya } from "./karat-parca-konya";
import type { SimulatedCampaign } from "./types";

const campaigns: Record<string, SimulatedCampaign> = {
  [karatParcaKonya.slug]: karatParcaKonya,
};

export function getCampaign(slug: string): SimulatedCampaign | undefined {
  return campaigns[slug];
}

export function getAllCampaignSlugs(): string[] {
  return Object.keys(campaigns);
}

export function listCampaigns(): SimulatedCampaign[] {
  return Object.values(campaigns);
}

export type { SimulatedCampaign } from "./types";
