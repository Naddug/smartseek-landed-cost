import { Router } from "express";
import { addComplaint, getComplaintByRef } from "../../domain/store.js";
import { appendAudit } from "../../domain/audit-log.js";
import { rateLimit } from "../../middleware/rate-limit.js";

export const complaintsRouter = Router();

const COMPLAINT_CATEGORIES = [
  "misleading_information",
  "cannot_withdraw",
  "document_missing",
  "identity_theft",
  "harassment",
  "technical",
  "other",
] as const;

/** POST /v1/complaints — investor complaint intake */
complaintsRouter.post("/", rateLimit(5, 60 * 60 * 1000), (req, res) => {
  const { category, description, campaignSlug, contactEmail } = req.body ?? {};

  if (!category || !COMPLAINT_CATEGORIES.includes(category)) {
    res.status(400).json({ error: "invalid_category" });
    return;
  }
  if (!description || typeof description !== "string" || description.length < 20) {
    res.status(400).json({ error: "description_too_short" });
    return;
  }
  if (!contactEmail || typeof contactEmail !== "string" || !contactEmail.includes("@")) {
    res.status(400).json({ error: "invalid_email" });
    return;
  }

  const complaint = addComplaint({
    category,
    description: description.slice(0, 5000),
    campaignSlug: typeof campaignSlug === "string" ? campaignSlug.slice(0, 100) : undefined,
    contactEmail: contactEmail.slice(0, 254),
  });

  appendAudit({
    type: "escalation_opened",
    actorType: "user",
    actorId: contactEmail,
    subjectType: "complaint",
    subjectId: complaint.id,
    payload: { publicRef: complaint.publicRef, category },
  });

  res.status(201).json({
    publicRef: complaint.publicRef,
    status: complaint.status,
    message: "Şikayetiniz alındı. Referans numaranızı saklayın.",
  });
});

/** GET /v1/complaints/:publicRef — status lookup (no PII returned) */
complaintsRouter.get("/:publicRef", (req, res) => {
  const complaint = getComplaintByRef(req.params.publicRef);
  if (!complaint) {
    res.status(404).json({ error: "not_found" });
    return;
  }
  res.json({
    publicRef: complaint.publicRef,
    status: complaint.status,
    createdAt: complaint.createdAt,
    acknowledgedAt: complaint.acknowledgedAt,
  });
});
