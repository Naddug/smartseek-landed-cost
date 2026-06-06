import { NextResponse } from "next/server";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      name?: string;
      company?: string;
      email?: string;
      corridor?: string;  // kept for backwards compat; maps to "problem" in new form
      problem?: string;
      message?: string;
    };

    if (!body.name || !body.company || !body.email) {
      return NextResponse.json({ error: "missing_fields" }, { status: 400 });
    }

    if (!isValidEmail(body.email)) {
      return NextResponse.json({ error: "invalid_email" }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.LEAD_NOTIFY_EMAIL ?? "destek@ortaq.biz";
    const from = process.env.RESEND_FROM_EMAIL ?? "ORTAQ Demo <demo@ortaq.biz>";

    const problem = body.problem || body.corridor;

    if (apiKey) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: [to],
          reply_to: body.email,
          subject: `[ORTAQ Demo] ${body.name} · ${body.company}`,
          text: [
            `Ad Soyad: ${body.name}`,
            `Şirket: ${body.company}`,
            `E-posta: ${body.email}`,
            `Sorun / Neden?: ${problem || "Belirtilmedi"}`,
            `Not: ${body.message || "—"}`,
          ].join("\n"),
        }),
      });
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
