import { Router } from "express";
import { auditCount, listRecentAudit } from "../../domain/audit-log.js";
import { listOpenSignals, resolveSignal } from "../../services/fraud-service.js";
import { transitionVerification } from "../../services/verification-service.js";
import type { VerificationState } from "../../../../ortaq-shared/src/trust/verification-states.js";
import { adminAuth } from "../../middleware/admin-auth.js";

export const adminRouter = Router();

adminRouter.use(adminAuth);

/** GET /admin/audit — recent audit events */
adminRouter.get("/audit", (_req, res) => {
  res.json({ total: auditCount(), events: listRecentAudit(100) });
});

/** GET /admin/fraud/signals — open fraud signals queue */
adminRouter.get("/fraud/signals", (_req, res) => {
  res.json({ items: listOpenSignals() });
});

/** POST /admin/fraud/signals/:id/resolve */
adminRouter.post("/fraud/signals/:id/resolve", (req, res) => {
  const { resolution, reviewerId } = req.body ?? {};
  if (!["false_positive", "confirmed", "escalated"].includes(resolution)) {
    res.status(400).json({ error: "invalid_resolution" });
    return;
  }
  const signal = resolveSignal(req.params.id, resolution, reviewerId ?? "ops-unknown");
  if (!signal) {
    res.status(404).json({ error: "signal_not_found" });
    return;
  }
  res.json(signal);
});

/** POST /admin/verification/transition — state machine enforcement */
adminRouter.post("/verification/transition", (req, res) => {
  const { subjectType, subjectId, from, to, actorId, publicReason, internalNotes } = req.body ?? {};
  if (!subjectType || !subjectId || !from || !to || !actorId) {
    res.status(400).json({ error: "missing_fields" });
    return;
  }
  const result = transitionVerification({
    subjectType,
    subjectId,
    from: from as VerificationState,
    to: to as VerificationState,
    actorId,
    publicReason,
    internalNotes,
  });
  if (!result.ok) {
    res.status(422).json({ error: result.error });
    return;
  }
  res.json(result);
});

/** GET /admin/queue — ops dashboard summary */
adminRouter.get("/queue", (_req, res) => {
  res.json({
    fraudSignalsOpen: listOpenSignals().length,
    auditEventsTotal: auditCount(),
    note: "Campaign review queue requires Postgres — Phase 2",
  });
});
