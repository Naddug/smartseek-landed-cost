import fs from "fs/promises";
import path from "path";
import type { DossierInterestRecord } from "@/types/dossier-interest";

const STORE_DIR = path.join(process.cwd(), "data/store");
const STORE_FILE = path.join(STORE_DIR, "dossier-interests.json");

export interface DossierInterestRepository {
  findByUser(userId: string): Promise<DossierInterestRecord[]>;
  findByUserAndDossier(
    userId: string,
    dossierId: string
  ): Promise<DossierInterestRecord | null>;
  create(record: DossierInterestRecord): Promise<DossierInterestRecord>;
}

const useMemoryStore = Boolean(process.env.VERCEL);

const globalStore = globalThis as unknown as {
  __ortaqDossierInterests?: DossierInterestRecord[];
};

function memoryReadAll(): DossierInterestRecord[] {
  if (!globalStore.__ortaqDossierInterests) {
    globalStore.__ortaqDossierInterests = [];
  }
  return globalStore.__ortaqDossierInterests;
}

function memoryWriteAll(records: DossierInterestRecord[]): void {
  globalStore.__ortaqDossierInterests = records;
}

async function fileReadAll(): Promise<DossierInterestRecord[]> {
  try {
    const raw = await fs.readFile(STORE_FILE, "utf-8");
    return JSON.parse(raw) as DossierInterestRecord[];
  } catch {
    return [];
  }
}

async function fileWriteAll(records: DossierInterestRecord[]): Promise<void> {
  await fs.mkdir(STORE_DIR, { recursive: true });
  await fs.writeFile(STORE_FILE, JSON.stringify(records, null, 2), "utf-8");
}

async function readAll(): Promise<DossierInterestRecord[]> {
  if (useMemoryStore) return memoryReadAll();
  return fileReadAll();
}

async function writeAll(records: DossierInterestRecord[]): Promise<void> {
  if (useMemoryStore) {
    memoryWriteAll(records);
    return;
  }
  await fileWriteAll(records);
}

export const dossierInterestRepository: DossierInterestRepository = {
  async findByUser(userId) {
    const all = await readAll();
    return all
      .filter((record) => record.userId === userId)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  },

  async findByUserAndDossier(userId, dossierId) {
    const all = await readAll();
    return (
      all.find(
        (record) => record.userId === userId && record.dossierId === dossierId
      ) ?? null
    );
  },

  async create(record) {
    const all = await readAll();
    all.push(record);
    await writeAll(all);
    return record;
  },
};
