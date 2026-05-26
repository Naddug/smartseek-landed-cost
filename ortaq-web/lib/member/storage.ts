/** Local member state — no auth, no fake portfolio. Trust continuity only. */

const STORAGE_KEY = "ortaq-member-v1";

export type SavedCompany = {
  slug: string;
  title: string;
  savedAt: string;
};

export type MemberState = {
  onboardingCompletedAt?: string;
  onboardingStep: number;
  riskAcknowledged: boolean;
  pagesRead: string[];
  savedCompanies: SavedCompany[];
  visitedAt: string;
};

export const EDUCATION_PAGES = [
  { path: "/basla", key: "start" },
  { path: "/nasil-calisir", key: "process" },
  { path: "/guven", key: "trust" },
  { path: "/riskler", key: "risk" },
  { path: "/sss", key: "faq" },
] as const;

const DEFAULT_STATE: MemberState = {
  onboardingStep: 0,
  riskAcknowledged: false,
  pagesRead: [],
  savedCompanies: [],
  visitedAt: new Date().toISOString(),
};

function readRaw(): MemberState {
  if (typeof window === "undefined") return { ...DEFAULT_STATE };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_STATE };
    return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_STATE };
  }
}

function write(state: MemberState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function getMemberState(): MemberState {
  return readRaw();
}

export function setOnboardingStep(step: number): void {
  const s = readRaw();
  s.onboardingStep = step;
  if (step >= 3) s.riskAcknowledged = true;
  write(s);
}

export function markOnboardingComplete(): void {
  const s = readRaw();
  s.onboardingStep = 4;
  s.onboardingCompletedAt = new Date().toISOString();
  s.riskAcknowledged = true;
  if (!s.pagesRead.includes("/basla")) s.pagesRead.push("/basla");
  write(s);
}

export function markPageRead(path: string): void {
  const s = readRaw();
  if (!s.pagesRead.includes(path)) {
    s.pagesRead = [...s.pagesRead, path];
  }
  s.visitedAt = new Date().toISOString();
  write(s);
}

export function toggleSavedCompany(slug: string, title: string): boolean {
  const s = readRaw();
  const exists = s.savedCompanies.some((c) => c.slug === slug);
  if (exists) {
    s.savedCompanies = s.savedCompanies.filter((c) => c.slug !== slug);
    write(s);
    return false;
  }
  s.savedCompanies = [
    ...s.savedCompanies,
    { slug, title, savedAt: new Date().toISOString() },
  ];
  write(s);
  return true;
}

export function isCompanySaved(slug: string): boolean {
  return readRaw().savedCompanies.some((c) => c.slug === slug);
}
