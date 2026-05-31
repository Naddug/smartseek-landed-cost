export type LeadPayload = {
  name: string;
  email: string;
  role: "company" | "investor" | "other";
  message?: string;
};
