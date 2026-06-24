import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { applySignupRoleToUser } from "@/lib/auth/profile";
import { postAuthRedirect, sanitizeNextPath } from "@/lib/auth/routes";
import { parseUserRole } from "@/lib/auth/roles";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Oturum gerekli." }, { status: 401 });
  }

  const body = (await request.json()) as { role?: string; next?: string };
  const role = parseUserRole(body.role);

  if (!role || role === "admin") {
    return NextResponse.json({ error: "Geçersiz rol." }, { status: 400 });
  }

  try {
    await applySignupRoleToUser(session.user.id, role);

    const redirect = postAuthRedirect(
      role,
      body.next ? sanitizeNextPath(body.next) : null
    );

    return NextResponse.json({ ok: true, role, redirect });
  } catch {
    return NextResponse.json(
      { error: "Rol kaydedilemedi. Lütfen tekrar deneyin." },
      { status: 500 }
    );
  }
}
