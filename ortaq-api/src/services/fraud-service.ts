import { randomUUID } from "node:crypto";
import type { FraudSignal, FraudSignalSeverity, FraudSignalType } from "../../../ortaq-shared/src/trust/fraud-signals.js";
import { FRAUD_DETECTION_RULES } from "../../../ortaq-shared/src/trust/fraud-signals.js";
import { appendAudit } from "../domain/audit-log.js";

const signals: FraudSignal[] = [];

export function createFraudSignal(input: {
  type: FraudSignalType;
  severity: FraudSignalSeverity;
  subjectType: FraudSignal["subjectType"];
  subjectId: string;
  description: string;
}): FraudSignal {
  const signal: FraudSignal = {
    id: randomUUID(),
    type: input.type,
    severity: input.severity,
    detectedAt: new Date().toISOString(),
    subjectType: input.subjectType,
    subjectId: input.subjectId,
    description: input.description,
    reviewed: false,
    action: input.severity === "critical" ? "pause_campaign" : "flag_for_review",
  };
  signals.push(signal);

  appendAudit({
    type: "fraud_signal_created",
    actorType: "system",
    actorId: "fraud-detector",
    subjectType: input.subjectType,
    subjectId: input.subjectId,
    payload: { signalId: signal.id, type: input.type, severity: input.severity },
  });

  return signal;
}

export function listOpenSignals(): FraudSignal[] {
  return signals.filter((s) => !s.reviewed);
}

export function resolveSignal(
  signalId: string,
  resolution: "false_positive" | "confirmed" | "escalated",
  reviewerId: string,
): FraudSignal | undefined {
  const signal = signals.find((s) => s.id === signalId);
  if (!signal) return undefined;
  signal.reviewed = true;
  signal.reviewerId = reviewerId;
  signal.resolution = resolution;

  appendAudit({
    type: "fraud_signal_resolved",
    actorType: "ops_user",
    actorId: reviewerId,
    subjectType: signal.subjectType,
    subjectId: signal.subjectId,
    payload: { signalId, resolution },
  });

  return signal;
}

/** Simple velocity check — extend with Redis at scale */
const deviceInvestmentLog = new Map<string, number[]>();

export function recordInvestmentAttempt(deviceHash: string): { allowed: boolean; reason?: string } {
  const now = Date.now();
  const dayAgo = now - 24 * 60 * 60 * 1000;
  const timestamps = (deviceInvestmentLog.get(deviceHash) ?? []).filter((t) => t > dayAgo);
  timestamps.push(now);
  deviceInvestmentLog.set(deviceHash, timestamps);

  if (timestamps.length > FRAUD_DETECTION_RULES.maxInvestmentsPerDevice24h) {
    createFraudSignal({
      type: "velocity_identity",
      severity: "high",
      subjectType: "user",
      subjectId: deviceHash,
      description: `Device exceeded ${FRAUD_DETECTION_RULES.maxInvestmentsPerDevice24h} investment attempts in 24h`,
    });
    return { allowed: false, reason: "velocity_limit" };
  }
  return { allowed: true };
}

export function getManipulationDefaults() {
  return {
    fakeMomentumBlocked: FRAUD_DETECTION_RULES.fakeMomentumBlocked,
    publicMetricsRequirePartner: FRAUD_DETECTION_RULES.publicMetricsRequirePartner,
    userGeneratedContentDisabled: FRAUD_DETECTION_RULES.userGeneratedContentDisabled,
  };
}
