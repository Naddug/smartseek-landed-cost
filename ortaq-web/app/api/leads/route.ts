import { NextResponse } from "next/server";
import type { LeadPayload } from "@/lib/leads/types";

export type { LeadPayload };

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isProductionDeliveryEnv() {
  return (
    process.env.NEXT_PUBLIC_APP_ENV === "production" ||
    process.env.VERCEL_ENV === "production"
  );
}

async function notifyViaResend(payload: LeadPayload, id: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFY_EMAIL ?? "destek@ortaq.biz";
  const from = process.env.RESEND_FROM_EMAIL ?? "ORTAQ Başvuru <basvuru@ortaq.biz>";

  if (!apiKey) {
    return { sent: false as const, reason: "missing_api_key" as const };
  }

  const roleLabel =
    payload.role === "company" ? "Üretim şirketi" : payload.role === "investor" ? "Sermaye partneri" : "Diğer";

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: payload.email,
      subject: `[ORTAQ Başvuru] ${payload.name} · ${roleLabel}`,
      text: [
        `Başvuru ID: ${id}`,
        `Ad: ${payload.name}`,
        `E-posta: ${payload.email}`,
        `Rol: ${roleLabel}`,
        payload.message ? `Not: ${payload.message}` : "",
        `Zaman: ${new Date().toISOString()}`,
      ]
        .filter(Boolean)
        .join("\n"),
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    return { sent: false as const, reason: "resend_failed" as const, status: res.status, detail };
  }

  return { sent: true as const };
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const { name, email, role, message } = (body ?? {}) as Partial<LeadPayload>;

  if (!name || typeof name !== "string" || name.trim().length < 2 || name.length > 120) {
    return NextResponse.json({ error: "invalid_name" }, { status: 400 });
  }
  if (!email || typeof email !== "string" || !isValidEmail(email.trim()) || email.length > 254) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }
  if (!role || !["company", "investor", "other"].includes(role)) {
    return NextResponse.json({ error: "invalid_role" }, { status: 400 });
  }
  if (message && (typeof message !== "string" || message.length > 2000)) {
    return NextResponse.json({ error: "invalid_message" }, { status: 400 });
  }

  const payload: LeadPayload = {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    role,
    message: message?.trim() || undefined,
  };

  const id = crypto.randomUUID();
  const isProd = isProductionDeliveryEnv();
  const delivery = await notifyViaResend(payload, id);

  if (!delivery.sent) {
    console.error("[leads] delivery failed", {
      id,
      email: payload.email,
      isProd,
      reason: delivery.reason,
      ...(delivery.reason === "resend_failed"
        ? { status: delivery.status, detail: delivery.detail }
        : {}),
    });

    if (isProd) {
      return NextResponse.json({ error: "delivery_unavailable" }, { status: 503 });
    }

    return NextResponse.json(
      {
        error: "delivery_unavailable",
        test: true,
        id,
        message: "Non-production: lead not delivered. Configure RESEND_API_KEY to test delivery.",
      },
      { status: 503 },
    );
  }

  return NextResponse.json({ ok: true, delivered: true, id });
}
