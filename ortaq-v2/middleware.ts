import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { getAuthSecret } from "@/lib/auth/secret";

const ROUTE_ALIASES: Record<string, string> = {
  "/panel/eslesmeler": "/panel/eslesmelerim",
  "/panel/profil": "/panel/profilim",
  "/guven-ve-kalite": "/guven-kalite",
};

const PROTECTED_PREFIXES = ["/panel", "/onboarding"];

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const aliasTarget = ROUTE_ALIASES[pathname];
  if (aliasTarget) {
    return NextResponse.redirect(new URL(aliasTarget, request.url));
  }

  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: getAuthSecret(),
  });

  if (!token) {
    const loginUrl = new URL("/giris", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/panel", "/panel/:path*", "/onboarding", "/onboarding/:path*"],
};
