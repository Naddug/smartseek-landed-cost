import { createHash, randomUUID } from "node:crypto";
import type { AuditEvent, AuditEventType } from "../../../ortaq-shared/src/trust/audit-moderation.js";

/** In-memory append-only audit — replace with Postgres append-only table */
const events: AuditEvent[] = [];

export function appendAudit(input: {
  type: AuditEventType;
  actorType: AuditEvent["actorType"];
  actorId: string;
  subjectType: string;
  subjectId: string;
  payload: Record<string, unknown>;
  ipHash?: string;
}): AuditEvent {
  const payloadHash = createHash("sha256").update(JSON.stringify(input.payload)).digest("hex");
  const event: AuditEvent = {
    id: randomUUID(),
    type: input.type,
    actorType: input.actorType,
    actorId: input.actorId,
    subjectType: input.subjectType,
    subjectId: input.subjectId,
    payload: input.payload,
    payloadHash,
    createdAt: new Date().toISOString(),
    ipHash: input.ipHash,
  };
  events.push(event);
  return event;
}

export function listAuditForSubject(subjectType: string, subjectId: string): AuditEvent[] {
  return events.filter((e) => e.subjectType === subjectType && e.subjectId === subjectId);
}

export function listRecentAudit(limit = 50): AuditEvent[] {
  return events.slice(-limit).reverse();
}

/** Admin only — never expose full log publicly */
export function auditCount(): number {
  return events.length;
}
