import { NextResponse } from "next/server";
import { registerUser } from "@/lib/auth/register";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: string;
      password?: string;
      name?: string;
      role?: string;
    };

    const result = await registerUser({
      email: body.email ?? "",
      password: body.password ?? "",
      name: body.name,
      role: body.role,
    });

    if (!result.ok) {
      const status =
        result.code === "CONFLICT"
          ? 409
          : result.code === "UNAVAILABLE"
            ? 503
            : 400;
      return NextResponse.json({ error: result.error }, { status });
    }

    return NextResponse.json({
      ok: true,
      userId: result.userId,
      role: result.role,
    });
  } catch {
    return NextResponse.json(
      { error: "Kayıt sırasında beklenmeyen bir hata oluştu." },
      { status: 500 }
    );
  }
}
