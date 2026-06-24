/**
 * Middleware + session/JWT-shaping smoke test.
 *
 * Exercises the REAL protected-route middleware (unauthenticated gating + route
 * aliases) and the REAL NextAuth `jwt`/`session` callbacks that shape the token
 * (cookie) and the client session object.
 *
 * It does NOT mint a signed session cookie (the authenticated middleware branch
 * and the browser round-trip remain manual — see report).
 *
 * Run:
 *   node --experimental-strip-types --experimental-loader ./scripts/_alias-loader.mjs scripts/smoke-auth-session.ts
 */
import { NextRequest } from "next/server";
import { middleware } from "@/middleware";
import { authCallbacks } from "@/lib/auth/callbacks";

/* eslint-disable @typescript-eslint/no-explicit-any */
let failures = 0;
function check(name: string, pass: boolean, detail = "") {
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
  if (!pass) failures += 1;
}

async function main() {
  // ---- Middleware: protected route, no session cookie → redirect to /giris?next ----
  const protectedRes = await middleware(new NextRequest("http://localhost/panel/firsatlarim"));
  const protectedLoc = protectedRes.headers.get("location") ?? "";
  check(
    "unauth /panel/* → redirect to /giris with next",
    protectedRes.status >= 300 && protectedRes.status < 400 &&
      protectedLoc.includes("/giris") &&
      protectedLoc.includes("next=%2Fpanel%2Ffirsatlarim"),
    `${protectedRes.status} ${protectedLoc}`
  );

  const onboardingRes = await middleware(new NextRequest("http://localhost/onboarding/ortak"));
  check(
    "unauth /onboarding/* → redirect to /giris",
    (onboardingRes.headers.get("location") ?? "").includes("/giris"),
    onboardingRes.headers.get("location") ?? ""
  );

  // ---- Middleware: public route → pass through (not redirected to login) ----
  const publicRes = await middleware(new NextRequest("http://localhost/firsatlar"));
  check(
    "public /firsatlar → not gated",
    !(publicRes.headers.get("location") ?? "").includes("/giris"),
    `x-middleware-next=${publicRes.headers.get("x-middleware-next")}`
  );

  // ---- Middleware: legacy alias redirect ----
  const aliasRes = await middleware(new NextRequest("http://localhost/panel/profil"));
  check(
    "/panel/profil → alias redirect to /panel/profilim",
    (aliasRes.headers.get("location") ?? "").endsWith("/panel/profilim"),
    aliasRes.headers.get("location") ?? ""
  );

  // ---- session callback: token → session.user shaping (what the browser sees) ----
  const session = await (authCallbacks as any).session({
    session: { user: {} },
    token: {
      sub: "user-1",
      role: "opportunity_owner",
      onboardingCompleted: true,
      sideSelected: true,
      profileCompletionLevel: "complete",
    },
  });
  check(
    "session callback maps token → session.user",
    session.user.id === "user-1" &&
      session.user.role === "opportunity_owner" &&
      session.user.onboardingCompleted === true &&
      session.user.sideSelected === true &&
      session.user.profileCompletionLevel === "complete"
  );

  // ---- session callback: safe defaults when token fields missing ----
  const fallbackSession = await (authCallbacks as any).session({
    session: { user: {} },
    token: { sub: "user-2" },
  });
  check(
    "session callback applies safe defaults",
    fallbackSession.user.role === "partner" &&
      fallbackSession.user.onboardingCompleted === false &&
      fallbackSession.user.sideSelected === false &&
      fallbackSession.user.profileCompletionLevel === "incomplete"
  );

  // ---- jwt callback: credentials sign-in user → token carries role/flags (the cookie) ----
  const token = await (authCallbacks as any).jwt({
    token: {},
    user: {
      id: "user-3",
      email: "owner@ortaq.test",
      role: "opportunity_owner",
      onboardingCompleted: false,
      sideSelected: true,
      profileCompletionLevel: "incomplete",
    },
    account: null,
    trigger: "signIn",
  });
  check(
    "jwt callback persists identity + role into token",
    token.sub === "user-3" &&
      token.role === "opportunity_owner" &&
      token.sideSelected === true &&
      token.onboardingCompleted === false,
    `role=${token.role}`
  );

  console.log(`\n${failures === 0 ? "ALL MIDDLEWARE + SESSION CHECKS PASSED" : `${failures} CHECK(S) FAILED`}`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((error) => {
  console.error("SMOKE ERROR:", error);
  process.exit(1);
});
