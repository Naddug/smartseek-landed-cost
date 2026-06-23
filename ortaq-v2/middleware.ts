import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const ROUTE_ALIASES: Record<string, string> = {
  "/panel/eslesmeler": "/panel/eslesmelerim",
  "/panel/profil": "/panel/profilim",
  "/guven-ve-kalite": "/guven-kalite",
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const aliasTarget = ROUTE_ALIASES[pathname];
  if (aliasTarget) {
    return NextResponse.redirect(new URL(aliasTarget, request.url));
  }

  if (!pathname.startsWith("/panel")) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    const loginUrl = new URL("/giris", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/panel", "/panel/:path*", "/guven-ve-kalite"],
};
