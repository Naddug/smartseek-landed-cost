import { NextResponse } from "next/server";
import { SIGNUP_ROLE_COOKIE } from "@/lib/auth";
import { parseUserRole } from "@/lib/auth/roles";

export async function POST(request: Request) {
  const body = (await request.json()) as { role?: string };
  const role = parseUserRole(body.role);

  if (!role) {
    return NextResponse.json({ error: "Geçersiz rol." }, { status: 400 });
  }

  const response = NextResponse.json({ ok: true, role });
  response.cookies.set(SIGNUP_ROLE_COOKIE, role, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60,
  });

  return response;
}
