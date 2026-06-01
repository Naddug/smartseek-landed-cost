export const dossierSections = [
  { id: "snapshot", key: "snapshot" },
  { id: "production", key: "production" },
  { id: "facility", key: "facility" },
  { id: "machines", key: "machines" },
  { id: "export", key: "export" },
  { id: "customers", key: "customers" },
  { id: "field", key: "field" },
  { id: "operations", key: "operations" },
  { id: "risks", key: "risks" },
  { id: "review", key: "review" },
  { id: "documents", key: "documents" },
] as const;

export type DossierSectionId = (typeof dossierSections)[number]["id"];
