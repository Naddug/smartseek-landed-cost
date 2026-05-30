import type { VerificationState } from "../../../ortaq-shared/src/trust/verification-states.js";
import { canTransition, toPublicLabel } from "../../../ortaq-shared/src/trust/verification-states.js";
import { appendAudit } from "../domain/audit-log.js";

export type TransitionRequest = {
  subjectType: string;
  subjectId: string;
  from: VerificationState;
  to: VerificationState;
  actorId: string;
  publicReason?: string;
  internalNotes?: string;
};

export function transitionVerification(req: TransitionRequest): {
  ok: true;
  publicLabel: ReturnType<typeof toPublicLabel>;
} | {
  ok: false;
  error: string;
} {
  if (!canTransition(req.from, req.to)) {
    return {
      ok: false,
      error: `invalid_transition:${req.from}->${req.to}`,
    };
  }

  const publicLabel = toPublicLabel(req.to);

  appendAudit({
    type: "verification_state_change",
    actorType: "ops_user",
    actorId: req.actorId,
    subjectType: req.subjectType,
    subjectId: req.subjectId,
    payload: {
      from: req.from,
      to: req.to,
      publicLabel,
      publicReason: req.publicReason,
      internalNotes: req.internalNotes,
    },
  });

  return { ok: true, publicLabel };
}

/** Required checks before committee can approve */
export function checksComplete(
  completed: string[],
  required: string[],
): boolean {
  return required.every((c) => completed.includes(c));
}
