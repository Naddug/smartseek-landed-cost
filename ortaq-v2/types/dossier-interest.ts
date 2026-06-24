export type DossierInterestStatus = "pending" | "in_review" | "matched" | "declined";

export type DossierInterestRecord = {
  id: string;
  userId: string;
  userEmail: string;
  dossierId: string;
  dossierSlug: string;
  dossierTitle: string;
  status: DossierInterestStatus;
  createdAt: string;
  updatedAt: string;
};

export type SubmitDossierInterestResult =
  | { ok: true; duplicate: false; id: string }
  | { ok: true; duplicate: true; id: string }
  | { ok: false; error: string; code?: "auth" | "profile" | "closed" | "owner" };
