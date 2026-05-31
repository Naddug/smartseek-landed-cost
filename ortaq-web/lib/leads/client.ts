import type { LeadPayload } from "@/lib/leads/types";

export type LeadSubmitResult =
  | { ok: true; id: string }
  | { ok: false; error: string; test?: boolean };

export async function submitLead(payload: LeadPayload): Promise<LeadSubmitResult> {
  try {
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = (await res.json()) as {
      ok?: boolean;
      id?: string;
      error?: string;
      test?: boolean;
      delivered?: boolean;
    };

    if (!res.ok || data.test) {
      return {
        ok: false,
        error: data.error ?? "submission_failed",
        test: data.test,
      };
    }

    if (!data.ok || !data.delivered) {
      return { ok: false, error: data.error ?? "delivery_not_confirmed" };
    }

    return { ok: true, id: data.id ?? "unknown" };
  } catch {
    return { ok: false, error: "network_error" };
  }
}
