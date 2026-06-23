import fs from "fs/promises";
import path from "path";
import type { OpportunityDossier } from "@/types/opportunity-dossier";

const STORE_DIR = path.join(process.cwd(), "data/store");
const STORE_FILE = path.join(STORE_DIR, "opportunity-drafts.json");

export interface OpportunityDossierRepository {
  findAll(ownerId?: string): Promise<OpportunityDossier[]>;
  findById(id: string): Promise<OpportunityDossier | null>;
  create(dossier: OpportunityDossier): Promise<OpportunityDossier>;
  update(id: string, data: Partial<OpportunityDossier>): Promise<OpportunityDossier | null>;
}

async function readAll(): Promise<OpportunityDossier[]> {
  try {
    const raw = await fs.readFile(STORE_FILE, "utf-8");
    return JSON.parse(raw) as OpportunityDossier[];
  } catch {
    return [];
  }
}

async function writeAll(drafts: OpportunityDossier[]): Promise<void> {
  await fs.mkdir(STORE_DIR, { recursive: true });
  await fs.writeFile(STORE_FILE, JSON.stringify(drafts, null, 2), "utf-8");
}

/** File-based store — swap with PrismaOpportunityDossierRepository later */
export const opportunityDossierRepository: OpportunityDossierRepository = {
  async findAll(ownerId?: string) {
    const all = await readAll();
    if (!ownerId) return all;
    return all.filter((d) => d.ownerId === ownerId);
  },

  async findById(id: string) {
    const all = await readAll();
    return all.find((d) => d.id === id) ?? null;
  },

  async create(dossier: OpportunityDossier) {
    const all = await readAll();
    all.push(dossier);
    await writeAll(all);
    return dossier;
  },

  async update(id: string, data: Partial<OpportunityDossier>) {
    const all = await readAll();
    const index = all.findIndex((d) => d.id === id);
    if (index === -1) return null;
    all[index] = { ...all[index], ...data, updatedAt: new Date().toISOString() };
    await writeAll(all);
    return all[index];
  },
};
