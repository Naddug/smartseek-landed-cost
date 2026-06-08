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
      source?: string;
      corridor?: string;
      problem?: string;
      market?: string;
      product?: string;
      volume?: string;
      message?: string;
    };

    if (!body.name || !body.company || !body.email) {
      return NextResponse.json({ error: "missing_fields" }, { status: 400 });
    }

    if (!isValidEmail(body.email)) {
      return NextResponse.json({ error: "invalid_email" }, { status: 400 });
    }

    const isQuote = body.source === "quote_form";

    if (isQuote && (!body.market || !body.product)) {
      return NextResponse.json({ error: "missing_fields" }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.LEAD_NOTIFY_EMAIL ?? "destek@ortaq.biz";
    const from = process.env.RESEND_FROM_EMAIL ?? "ORTAQ <destek@ortaq.biz>";

    const problem = body.problem || body.corridor;
    const subjectPrefix = isQuote ? "ORTAQ Teklif" : "ORTAQ Demo";
    const textLines = isQuote
      ? [
          `Kaynak: Teklif formu`,
          `Ad Soyad: ${body.name}`,
          `Şirket: ${body.company}`,
          `E-posta: ${body.email}`,
          `Pazar: ${body.market}`,
          `Ürün / program: ${body.product}`,
          `Hacim: ${body.volume || "Belirtilmedi"}`,
          `Not: ${body.message || "—"}`,
        ]
      : [
          `Kaynak: Demo formu`,
          `Ad Soyad: ${body.name}`,
          `Şirket: ${body.company}`,
          `E-posta: ${body.email}`,
          `Sorun / Neden?: ${problem || "Belirtilmedi"}`,
          `Not: ${body.message || "—"}`,
        ];

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
          subject: `[${subjectPrefix}] ${body.name} · ${body.company}`,
          text: textLines.join("\n"),
        }),
      });
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
